// Simple HTML proxy that injects a wallet bridge script so proxied pages can talk to the host wallet
import { getPublicKeyUnsafe, loadVault } from '../../lib/wallet';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url || typeof url !== 'string') return res.status(400).send('missing url');

  try {
    const decoded = decodeURIComponent(url);
    if (!decoded.startsWith('http://') && !decoded.startsWith('https://')) return res.status(400).send('invalid url');

    const target = decoded;
    const fetchRes = await fetch(target, { method: 'GET' });
    const contentType = fetchRes.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      // For non-HTML content, just proxy the response directly
      const buffer = await fetchRes.arrayBuffer();
      res.setHeader('content-type', contentType);
      return res.status(fetchRes.status).send(Buffer.from(buffer));
    }

    let html = await fetchRes.text();

    // Insert <base> so relative URLs resolve against the original site
    try {
      const origin = new URL(target).origin;
      if (!html.includes('<base')) {
        html = html.replace(/<head(.*?)>/i, `<head$1><base href="${origin}">`);
      }
    } catch (e) { /* ignore */ }

    // Bridge script: listens for wallet requests inside proxied page and forwards via postMessage to parent
    const bridge = `
      <script>
      (function(){
        function request(action, data){
          return new Promise((resolve, reject) => {
            const id = Math.random().toString(36).slice(2);
            function onmsg(e){
              try{
                if (e?.data && e.data.__DW_RESP__ === id){
                  window.removeEventListener('message', onmsg);
                  if (e.data.error) return reject(e.data.error);
                  return resolve(e.data.payload);
                }
              }catch(err){ }
            }
            window.addEventListener('message', onmsg);
            window.parent.postMessage({ __DW_REQ__: true, id, action, data }, '*');
          });
        }

        window.solana = {
          isPhantom: true,
          connect: function(){
            return request('connect').then(p => {
              if (p && p.publicKey) {
                window.solana.publicKey = { toString: () => p.publicKey };
              }
              return p;
            });
          },
          disconnect: function(){ return request('disconnect'); },
          signMessage: function(msg){ return request('signMessage', { msg }); },
          signTransaction: function(tx){ return request('signTransaction', { tx }); },
          signAllTransactions: function(txs){ return request('signAllTransactions', { txs }); },
          publicKey: { toString: function(){ return ''; } }
        };
        window.dispatchEvent(new Event('solana#initialized'));
      })();
      </script>
    `;

    // Inject bridge before closing </body> or </head>
    if (html.indexOf('</body>') !== -1) html = html.replace('</body>', bridge + '</body>');
    else if (html.indexOf('</head>') !== -1) html = html.replace('</head>', bridge + '</head>');
    else html = bridge + html;

    res.setHeader('content-type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (err) {
    console.error('proxy error', err?.message || err);
    return res.status(500).send('proxy error');
  }
}
