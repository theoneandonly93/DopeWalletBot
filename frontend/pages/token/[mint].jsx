// Clean server-side token detail page
import Link from 'next/link';

export default function TokenDetailPage({ token, mint }) {
  if (!token) {
    const isSol = !(mint || '').toString().startsWith('0x');
    const explorer = isSol ? `https://solscan.io/token/${mint}` : `https://bscscan.com/token/${mint}`;
    return (
      <div className="min-h-screen bg-bg text-white pb-20">
        <div className="p-6 text-center text-textDim space-y-3">
          <div className="text-lg">Token not found</div>
          <div className="text-sm">We couldn't find detailed metadata for <span className="font-mono">{mint}</span>.</div>
          <a href={explorer} target="_blank" rel="noopener noreferrer" className="text-[#3B82F6]">Open on explorer</a>
        </div>
      </div>
    );
  }

  const value = token.price || token.value || 0;
  const change = token.priceChange24h ?? token.change_24h ?? 0;

  return (
    <div className="min-h-screen bg-bg text-white pb-20">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <Link href="/swap" className="text-[#3B82F6] text-base">Back</Link>
        <h1 className="text-lg font-semibold">{token.symbol || token.name || 'Token'}</h1>
        <div className="w-8" />
      </div>

      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">{token.symbol || token.name}</h2>
            <p className="text-3xl font-bold">${Number(value || 0).toFixed(2)}</p>
            <p className={`text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? '+' : ''}{Number(change || 0).toFixed(2)}%
            </p>
          </div>
          <img src={token.logoURI || token.logo || '/logo-512.png'} className="w-14 h-14 rounded-full" alt={token.symbol} />
        </div>

        <div className="bg-[#0D0D0D] rounded-2xl p-3">
          <div className="text-xs text-textDim mb-2">Price chart (mock)</div>
          <div className="h-36 bg-[#090909] rounded" />
        </div>

        <div className="bg-[#111] rounded-2xl border border-[#222] p-4 space-y-3">
          <h3 className="text-sm font-semibold text-textDim">OVERVIEW</h3>
          <div className="flex justify-between text-sm"><span>Market Cap</span><span>${(token.marketCap || token.market_cap || 0).toLocaleString()}</span></div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-[#0D0D0D] border-t border-[#222] p-4 flex space-x-3">
        <button onClick={() => { try { localStorage.setItem('swap_prefill', JSON.stringify({ inputMint: 'So11111111111111111111111111111111111111112', outputMint: mint })); } catch(e){}; window.location.href = '/swap'; }} className="flex-1 bg-[#3B82F6] py-3 rounded-xl font-semibold">Buy</button>
        <button className="flex-1 bg-[#1F1F1F] py-3 rounded-xl font-semibold">Deposit</button>
      </div>
    </div>
  );
}

export async function getServerSideProps(context){
  const mint = context.params?.mint || null;
  if (!mint) return { props: { token: null, mint } };

  let merged = null;

  // Try Solana tokenlist first
  try {
    const listRes = await fetch('https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json');
    if (listRes.ok){
      const tl = await listRes.json();
      const found = (tl?.tokens || []).find((x) => String(x.address).toLowerCase() === String(mint).toLowerCase());
      if (found) merged = { name: found.name, symbol: found.symbol, logoURI: found.logoURI, address: found.address };
    }
  } catch (e) {
    // ignore
  }

  // fallback: trending proxy (use absolute base so SSR can call our API route)
  if (!merged){
    try {
      const chains = ['solana','bsc'];
      const envBase = process.env.NEXT_PUBLIC_BASE_URL;
      const defaultPort = process.env.PORT || 3000;
      const base = envBase || `http://localhost:${defaultPort}`;
      const root = String(base).replace(/\/+$/,'');
      for (const c of chains){
        const url = `${root}/api/dex/trending?chain=${c}&limit=500`;
        try {
          const r = await fetch(url);
          if (!r.ok) continue;
          const body = await r.json();
          const list = body?.data || [];
          const found = list.find((it) => (it.address || '').toString().toLowerCase() === String(mint).toLowerCase());
          if (found){ merged = { name: found.name, symbol: found.symbol, logoURI: found.logoURI, address: found.address, price: found.price }; break; }
        } catch (e) { continue; }
      }
    } catch (e) { /* ignore */ }
  }

  return { props: { token: merged || null, mint } };
}
