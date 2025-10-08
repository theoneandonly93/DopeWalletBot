import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TokenChart from '../../../components/TokenChart';
import BottomNav from '../../../components/BottomNav';
import Icon from '../../../components/Icon';
import dynamic from 'next/dynamic';
import { Connection, PublicKey } from '@solana/web3.js';
import { loadVault } from '../../../lib/wallet';
const SwapModal = dynamic(() => import('../../../components/SwapModal'), { ssr: false });

const RPC_URL = process.env.NEXT_PUBLIC_RPC || 'https://api.mainnet-beta.solana.com';

export default function WalletTokenPage({ token }){
  const router = useRouter();
  const { mint } = router.query;
  const [balance, setBalance] = useState(0);
  const [pubkey, setPubkey] = useState(null);
  const [showSwap, setShowSwap] = useState(false);

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      try{
        const pw = localStorage.getItem('DW_LAST_PW');
        if (pw) {
          try { const v = await loadVault(pw); if (v?.pubkey && mounted) { setPubkey(v.pubkey); fetchBalance(v.pubkey); } } catch(e){}
        }
        try { const blob = localStorage.getItem('DW_VAULT_V1'); if (blob) { const parsed = JSON.parse(blob); if (parsed?.pubkey && mounted) { setPubkey(parsed.pubkey); fetchBalance(parsed.pubkey); } } } catch(e){}
      }catch(e){}
    })();
    return ()=>{ mounted = false; };
  }, []);

  async function fetchBalance(pk){
    try{ const conn = new Connection(RPC_URL); const lamports = await conn.getBalance(new PublicKey(pk)); setBalance(lamports / 1e9); }catch(e){ setBalance(0); }
  }

  if (!token) return <div className="min-h-screen bg-[#0D0D0D] text-white">Token not found</div>;

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

      {/* Chart */}
      <div className="w-full px-4 pt-4">
        <div className="bg-[#0b0b0d] rounded-2xl overflow-hidden border border-[#222]">
          <TokenChart chartData={token.chartData || null} />
          <div className="p-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">{token.symbol || token.name}</div>
              <div className="text-lg font-bold">${token.price || 0}</div>
            </div>
            <div className="text-sm text-textDim">{(token.change24h ?? token.change) || 0}%</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-4 px-4">
        <img src={token.logo || '/token-placeholder.png'} alt={token.name} className="w-14 h-14 rounded-full mb-3" />
        <h2 className="text-lg font-semibold">{token.name} Balance</h2>
        <p className="text-2xl font-bold mt-1">{balance.toFixed(2)} {token.symbol || ''}</p>

        <div className="grid grid-cols-4 gap-3 mt-5 px-5 w-full max-w-sm">
          <button className="bg-[#111] rounded-xl py-3 text-sm flex flex-col items-center"><Icon name="Transfer" size={18} /><span className="text-xs mt-1">Transfer</span></button>
          <button className="bg-[#111] rounded-xl py-3 text-sm flex flex-col items-center"><Icon name="Plus" size={18} /><span className="text-xs mt-1">Deposit</span></button>
          <button className="bg-[#111] rounded-xl py-3 text-sm flex flex-col items-center"><Icon name="Upload" size={18} /><span className="text-xs mt-1">Withdraw</span></button>
          <button onClick={()=>setShowSwap(true)} className="bg-[#111] rounded-xl py-3 text-sm flex flex-col items-center"><Icon name="Swap" size={18} /><span className="text-xs mt-1">Swap</span></button>
        </div>
      </div>

      {showSwap && <SwapModal onClose={()=>setShowSwap(false)} tokenMint={mint} tokenSymbol={token.symbol || ''} />}

      <BottomNav />
    </div>
  );
}

export async function getServerSideProps(context){
  const mint = context.params?.mint || null;
  if (!mint) return { props: { token: null } };

  // Try to fetch token metadata from trending proxy or tokenlist
  let token = null;
  try{
    const r = await fetch('https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json');
    if (r.ok){ const tl = await r.json(); const found = (tl?.tokens||[]).find(x=>String(x.address).toLowerCase()===String(mint).toLowerCase()); if (found) token = { name: found.name, symbol: found.symbol, logo: found.logoURI, price: 0 }; }
  }catch(e){}

  if (!token){
    try{
      const envBase = process.env.NEXT_PUBLIC_BASE_URL;
      const defaultPort = process.env.PORT || 3000;
      const base = envBase || `http://localhost:${defaultPort}`;
      const root = String(base).replace(/\/+$/,'');
      const url = `${root}/api/dex/trending?chain=solana&limit=500`;
      const r = await fetch(url);
      if (r.ok){ const body = await r.json(); const found = (body?.data||[]).find(it=>String(it.address).toLowerCase()===String(mint).toLowerCase()); if (found) token = { name: found.name, symbol: found.symbol, logo: found.logoURI, price: found.price, chartData: found.chartData || null }; }
    }catch(e){}
  }

  return { props: { token } };
}
