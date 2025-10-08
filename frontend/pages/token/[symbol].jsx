import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import BottomNav from '../../components/BottomNav';
import Icon from '../../components/Icon';
import TokenChart from '../../components/TokenChart';
import { loadVault } from '../../lib/wallet';
import dynamic from 'next/dynamic';
const SwapModal = dynamic(() => import('../../components/SwapModal'), { ssr: false });

const RPC_URL = process.env.NEXT_PUBLIC_RPC || 'https://api.mainnet-beta.solana.com';

export default function TokenDetail({ token, price, change, chartData }){
  const router = useRouter();
  const { symbol } = router.query;

  const [balance, setBalance] = useState(0);
  const [apy, setApy] = useState(2.7);
  const [pubkey, setPubkey] = useState(null);
  const [showSwap, setShowSwap] = useState(false);

  useEffect(()=>{
    // Try to obtain a usable pubkey from the saved vault (decrypt if we have DW_LAST_PW)
    let mounted = true;
    (async ()=>{
      try{
        const pw = localStorage.getItem('DW_LAST_PW');
        if (pw) {
          try {
            const v = await loadVault(pw);
            if (v?.pubkey && mounted) { setPubkey(v.pubkey); fetchBalance(v.pubkey); return; }
          } catch (e) {}
        }

        // fallback parse raw blob
        try {
          const blob = localStorage.getItem('DW_VAULT_V1');
          if (blob) {
            try { const parsed = JSON.parse(blob); if (parsed?.pubkey) { if (mounted) { setPubkey(parsed.pubkey); fetchBalance(parsed.pubkey); } } } catch (e) {}
          }
        } catch (e) {}
      }catch(e){}
    })();
    return ()=>{ mounted = false; };
  }, []);

  async function fetchBalance(pk){
    try{
      const conn = new Connection(RPC_URL);
      const lamports = await conn.getBalance(new PublicKey(pk));
      setBalance(lamports / 1e9);
    }catch(e){ setBalance(0); }
  }

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-24">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A]">
        <button onClick={()=>router.back()} className="text-[#3B82F6] font-semibold text-sm">Back</button>
        <div className="text-center">
          <h1 className="text-base font-semibold">Wallet <span className="text-[#3B82F6]">✓</span></h1>
          <p className="text-[11px] text-[#999] -mt-1">mini app</p>
        </div>
        <button className="p-2"><Icon name="Dots" size={18} /></button>
      </div>
      {/* Chart at top */}
      {chartData ? (
        <div className="w-full px-4 pt-4">
          <div className="bg-[#0b0b0d] rounded-2xl overflow-hidden border border-[#222]">
            <TokenChart chartData={chartData} />
            <div className="p-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{token.symbol || token.name}</div>
                <div className={`text-lg font-bold ${change < 0 ? 'text-red-500' : 'text-green-500'}`}>${price.toFixed(2)}</div>
              </div>
              <div className="text-sm text-textDim">{change < 0 ? '↓' : '↑'} {Math.abs(change)}%</div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col items-center mt-4 px-4">
        <img src={token.logo} alt={token.name} className="w-14 h-14 rounded-full mb-3" />
        <h2 className="text-lg font-semibold">{token.name} Balance</h2>
        <p className="text-2xl font-bold mt-1">{balance.toFixed(2)} {String(symbol).toUpperCase()}</p>

        <div className="grid grid-cols-4 gap-3 mt-5 px-5 w-full max-w-sm">
          <button className="bg-[#111] rounded-xl py-3 text-sm flex flex-col items-center"><Icon name="Transfer" size={18} /><span className="text-xs mt-1">Transfer</span></button>
          <button className="bg-[#111] rounded-xl py-3 text-sm flex flex-col items-center"><Icon name="Plus" size={18} /><span className="text-xs mt-1">Deposit</span></button>
          <button className="bg-[#111] rounded-xl py-3 text-sm flex flex-col items-center"><Icon name="Upload" size={18} /><span className="text-xs mt-1">Withdraw</span></button>
          <button onClick={()=>setShowSwap(true)} className="bg-[#111] rounded-xl py-3 text-sm flex flex-col items-center"><Icon name="Swap" size={18} /><span className="text-xs mt-1">Swap</span></button>
        </div>
      </div>

      <div className="mt-6 px-5">
        <h3 className="text-xs text-[#888] mb-2">EARN</h3>
        <div className="bg-[#111] rounded-2xl border border-[#222] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={token.logo} alt={token.name} className="w-7 h-7 rounded-full" />
            <div>
              <p className="font-semibold text-sm">{token.name}</p>
              <p className="text-xs text-green-500">Up to {apy}% APY</p>
            </div>
          </div>
          <button className="bg-[#3B82F6] px-4 py-2 rounded-xl font-semibold text-sm">Earn</button>
        </div>
      </div>

      <div className="mt-6 px-5">
        <h3 className="text-xs text-[#888] mb-2">EARN</h3>
        <div className="bg-[#111] rounded-2xl border border-[#222] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={token.logo} alt={token.name} className="w-7 h-7 rounded-full" />
            <div>
              <p className="font-semibold text-sm">{token.name}</p>
              <p className="text-xs text-green-500">Up to {apy}% APY</p>
            </div>
          </div>
          <button className="bg-[#3B82F6] px-4 py-2 rounded-xl font-semibold text-sm">Earn</button>
        </div>
      </div>

      <div className="mt-6 px-5">
        <h3 className="text-xs text-[#888] mb-2">ACTIVITY</h3>
        <div className="bg-[#111] rounded-2xl border border-[#222] p-6 text-center text-[#aaa]">
          <p className="font-semibold text-sm">No History Yet</p>
          <p className="text-xs mt-1">Once you start making transactions, they will appear here.</p>
        </div>
      </div>

      {showSwap && (
        <SwapModal onClose={()=>setShowSwap(false)} tokenMint={token.mint || token.address || token.mintAddress} tokenSymbol={String(symbol).toUpperCase()} />
      )}

      <BottomNav />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { symbol } = context.params;
  const sym = String(symbol || '').toUpperCase();

  // Resolve token metadata (try CoinGecko by symbol, fallback mapping)
  const mapping = {
    SOL: { name: 'Solana', logo: 'https://cryptologos.cc/logos/solana-sol-logo.png', mint: 'So11111111111111111111111111111111111111112' },
    USDC: { name: 'USDC', logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
  };

  let token = mapping[sym] || null;
  let price = 0;
  let change = 0;
  let chartData = null;

  try{
    // Try CoinGecko simple price lookup by symbol -> coin id mapping is required; for now, use quick paths for SOL/USDC
    if (sym === 'SOL') {
      const r = await fetch('https://api.coingecko.com/api/v3/coins/solana');
      const j = await r.json();
      price = j?.market_data?.current_price?.usd || 0;
      change = j?.market_data?.price_change_percentage_24h || 0;
      // simple hourly chart mock based on market sparkline
      const spark = j?.market_data?.sparkline_7d?.price || [];
      chartData = { labels: spark.slice(-24).map((_,i)=>`${i}h`), datasets: [{ data: spark.slice(-24) }] };
      token = token || mapping['SOL'];
    } else if (sym === 'USDC') {
      price = 1.0; change = 0; token = token || mapping['USDC'];
      chartData = { labels: Array.from({length:24},(_,i)=>`${i}h`), datasets: [{ data: Array.from({length:24},()=>1) }] };
    } else {
      // Try DexScreener or fallback default
      token = token || { name: sym, logo: '/token-placeholder.png', mint: '' };
    }
  }catch(e){ console.warn('SSR price fetch failed', e); }

  return { props: { token, price, change, chartData } };
}
