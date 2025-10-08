import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), { ssr: false });
import Link from 'next/link';

export default function TokenDetail() {
  const router = useRouter();
  const { mint } = router.query;

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mint) fetchToken();
  }, [mint]);

  async function fetchToken() {
    try {
      // Birdeye public endpoints
      const key = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || '';
      const res = await fetch(`https://public-api.birdeye.so/public/token_price?address=${mint}`, {
        headers: key ? { 'X-API-KEY': key } : {},
      });
      const data = await res.json();
      const infoRes = await fetch(`https://public-api.birdeye.so/public/token_meta?address=${mint}`, {
        headers: key ? { 'X-API-KEY': key } : {},
      });
      const info = await infoRes.json();
      const merged = { ...(data?.data || {}), ...(info?.data || {}) };
      setToken(merged);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  if (loading) return <div className="p-6 text-center text-textDim">Loading...</div>;
  if (!token) return <div className="p-6 text-center text-textDim">Token not found</div>;

  const value = token.value || token.price || 0;

  return (
    <div className="min-h-screen bg-bg text-white pb-20">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <button onClick={() => router.back()} className="text-[#3B82F6] text-base">Back</button>
        <h1 className="text-lg font-semibold">Token</h1>
        <div className="w-8" />
      </div>

      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">{token.symbol || token.ticker || token.name}</h2>
            <p className="text-3xl font-bold">${Number(value || 0).toFixed(2)}</p>
            <p className={`text-sm ${ (token.priceChange24h || token.change_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400' }`}>
              {(token.priceChange24h || token.change_24h || 0) >= 0 ? '+' : ''}{Number(token.priceChange24h || token.change_24h || 0).toFixed(2)}%
            </p>
          </div>
          <img src={token.logoURI || token.logo || '/logo-512.png'} className="w-14 h-14 rounded-full" alt={token.symbol} />
        </div>

        {/* Chart */}
        <div className="bg-[#0D0D0D] rounded-2xl p-3">
          <Line
            data={{
              labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
              datasets: [
                {
                  label: 'Price',
                  data: Array.from({ length: 24 }, () => Number(value || 0) * (0.95 + Math.random() * 0.1)),
                  borderColor: '#22C55E',
                  borderWidth: 2,
                  tension: 0.3,
                  pointRadius: 0,
                },
              ],
            }}
            options={{ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }}
          />
          <div className="flex justify-around text-xs mt-3 text-textDim">
            {['1D', '1W', '1M', '1Y', 'All'].map((t) => (
              <button key={t} className="px-2 py-1 bg-[#1a1a1a] rounded-lg">{t}</button>
            ))}
          </div>
        </div>

        {/* Overview */}
        <div className="bg-[#111] rounded-2xl border border-[#222] p-4 space-y-3">
          <h3 className="text-sm font-semibold text-textDim">OVERVIEW</h3>
          <div className="flex justify-between text-sm"><span>Market Cap</span><span>${(token.marketCap || token.market_cap || 0).toLocaleString()}</span></div>
          <div className="flex justify-between text-sm"><span>Total Supply</span><span>{token.supply || token.total_supply || 'N/A'} {token.symbol}</span></div>
          <div className="flex justify-between text-sm"><span>Holders</span><span>{token.holders || token.holders_count || 'N/A'}</span></div>
          <div className="flex justify-between text-sm"><span>Liquidity</span><span>${(token.liquidityUsd || token.liquidity_usd || 0).toLocaleString()}</span></div>
          <div className="flex justify-between text-sm"><span>Listing Date</span><span>—</span></div>
        </div>

        {/* 24h trading */}
        <div className="bg-[#111] rounded-2xl border border-[#222] p-4">
          <h3 className="text-sm font-semibold text-textDim mb-2">24H TRADING ACTIVITY</h3>
          <div className="flex justify-between text-sm"><span>Volume</span><span>${(token.volumeUsd24h || token.volume_24h || 0).toLocaleString()}</span></div>
          <div className="flex justify-between mt-2 text-xs">
            <span className="text-green-400">Buy ${(Number(token.volumeUsd24h || token.volume_24h || 0) * 0.49).toFixed(2)}</span>
            <span className="text-red-400">Sell ${(Number(token.volumeUsd24h || token.volume_24h || 0) * 0.51).toFixed(2)}</span>
          </div>
        </div>

        {/* Explorer */}
        <div className="bg-[#111] rounded-2xl border border-[#222] p-4">
          <h3 className="text-sm font-semibold text-textDim mb-2">RESOURCES</h3>
          <Link href={`https://solscan.io/token/${mint}`} target="_blank" className="text-[#3B82F6] text-sm">View Details in Explorer</Link>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-[#0D0D0D] border-t border-[#222] p-4 flex space-x-3">
        <button onClick={() => { try { localStorage.setItem('swap_prefill', JSON.stringify({ inputMint: 'So11111111111111111111111111111111111111112', outputMint: mint })); } catch(e){}; window.location.href = '/swap'; }} className="flex-1 bg-[#3B82F6] py-3 rounded-xl font-semibold">Buy</button>
        <button className="flex-1 bg-[#1F1F1F] py-3 rounded-xl font-semibold">Deposit</button>
      </div>
    </div>
  );
}
