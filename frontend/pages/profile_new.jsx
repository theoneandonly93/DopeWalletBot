import { useEffect, useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { loadVault } from "../lib/wallet";
import { getPortfolio } from "../lib/api";

export default function ProfileNew(){
  const [vault, setVault] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [followers, setFollowers] = useState(23);
  const [following, setFollowing] = useState(12);

  useEffect(()=>{ (async()=>{ const pw = sessionStorage.getItem("DW_LAST_PW"); if (pw) { const v = await loadVault(pw); setVault(v); if (v?.pubkey) setPortfolio(await getPortfolio(v.pubkey)); } })(); },[]);

  return (
    <div className="min-h-screen bg-bg text-white pb-24">
      <Header />

      <div className="p-4 space-y-4">
        <div className="bg-card rounded-xl p-4 text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#222] flex items-center justify-center text-2xl">👻</div>
          </div>
          <div className="text-lg font-semibold">{vault ? "@" + vault.pubkey.slice(0,6) + "..." : "Anonymous"}</div>
          <div className="text-sm text-textDim">The dopest wallet on Solana 🔥</div>
          <div className="flex justify-center gap-6 text-sm text-textDim">
            <div className="text-center"><span className="font-semibold text-white">{followers}</span><br/>Followers</div>
            <div className="text-center"><span className="font-semibold text-white">{following}</span><br/>Following</div>
          </div>
          <button className="bg-accent rounded-xl py-2 px-6 font-semibold text-sm">Edit Profile</button>
        </div>

        <div className="bg-card rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-sm font-semibold">Followed Tokens</div>
            <button className="text-[#3B82F6] text-xs">See All ›</button>
          </div>
          <div className="space-y-2">
            {portfolio?.tokens?.slice(0,3).map((t)=> (
              <div key={t.mint} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src={t.logo} className="w-6 h-6 rounded-full" alt={t.symbol} />
                  <div className="text-sm">{t.symbol}</div>
                </div>
                <div className="text-sm text-textDim">${(t.price ?? 0).toFixed(2)}</div>
              </div>
            ))}
            {!portfolio?.tokens?.length && (<div className="text-xs text-textDim text-center py-2">You haven’t followed any tokens yet.</div>)}
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <div className="text-sm font-semibold">Recent Activity</div>
            <button className="text-[#3B82F6] text-xs">View More ›</button>
          </div>
          <div className="text-sm">👻 You swapped SOL → USDC</div>
          <div className="text-sm">🔥 You followed BONK</div>
          <div className="text-sm">🚀 You created your wallet</div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
