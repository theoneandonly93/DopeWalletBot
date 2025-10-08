export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { pubkey } = req.body || {};
    if (!pubkey) return res.status(400).json({ error: 'pubkey required' });

    const RPC = process.env.RPC_URL || 'https://api.mainnet-beta.solana.com';

    // 1) get SOL balance via RPC
    const rpcBalance = await fetch(RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getBalance', params: [pubkey] }),
    }).then((r) => r.json());
    const sol = (rpcBalance.result?.value || 0) / 1e9;

    // 2) get token accounts by owner
    const tokenRes = await fetch(RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getTokenAccountsByOwner', params: [pubkey, { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' }, { encoding: 'jsonParsed' }] }),
    }).then((r) => r.json());

    const accounts = tokenRes.result?.value || [];
    const tokens = accounts.map((a) => {
      const info = a.account?.data?.parsed?.info || {};
      const amt = info.tokenAmount?.uiAmount || 0;
      return {
        address: info.mint || a.pubkey,
        name: info?.mint || 'Unknown',
        symbol: (info.mint || '').slice(0, 6),
        uiAmountString: amt ? amt.toString() : '0',
        usdValue: '0.00',
        logoURI: '/token-placeholder.png',
      };
    });

    // 3) price via CoinGecko
    let usdPrice = null;
    try {
      const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const priceJson = await priceRes.json();
      usdPrice = priceJson?.solana?.usd || null;
    } catch (e) {
      usdPrice = null;
    }

    return res.json({ sol, usdPrice, usdBalance: usdPrice !== null ? (usdPrice * sol).toFixed(2) : null, tokens });
  } catch (err) {
    console.error('balance api error', err);
    res.status(500).json({ error: 'internal error' });
  }
}
