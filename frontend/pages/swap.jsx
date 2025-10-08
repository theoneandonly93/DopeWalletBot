import { useEffect, useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import TokenList from "../components/TokenList";
import { jupQuote, jupSwapTx } from "../lib/api";
import { loadVault } from "../lib/wallet";

export default function SwapPage(){
  const [amount, setAmount] = useState("0");
  const [price, setPrice] = useState("0.00");
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const [inputMint, setInputMint] = useState("So11111111111111111111111111111111111111112");
  const [outputMint, setOutputMint] = useState("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
  const [vault, setVault] = useState(null);

  const [tab, setTab] = useState("Most Traded");
  const [trending, setTrending] = useState([]);

  const RPC = process.env.NEXT_PUBLIC_RPC;

  useEffect(()=>{ (async()=>{ try{ const pw = sessionStorage.getItem("DW_LAST_PW"); if (pw) { const v = await loadVault(pw); setVault(v); } }catch{} })(); },[]);

  // Fetch trending tokens from Birdeye
  useEffect(() => {
    (async () => {
      try {
        const key = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || '';
        const res = await fetch('https://public-api.birdeye.so/public/trending?sort_by=volume_24h', {
          headers: key ? { 'X-API-KEY': key } : {},
        });
        const body = await res.json();
        const items = (body?.data || []).map((it) => ({
          address: it.address || it.mint || it.id,
          logoURI: it.logo || it.logoURI || it.image || '',
          symbol: it.symbol || it.ticker || it.name || '',
          price: Number(it.price || it.value || it.last_price || 0),
          change24h: Number(it.change_24h || it.price_change_24h || 0),
          volume24h: Number(it.volume_24h || it.volume || 0),
        }));
        setTrending(items);
      } catch (e) {
        console.error('Trending fetch failed', e);
      }
    })();
  }, []);
  async function handleQuote(){
    if (!vault) return alert("Unlock your wallet first.");
    try {
      setLoading(true);
      const q = await jupQuote(inputMint, outputMint, amount);
      // backend returns Jupiter quote object — store it
      setQuote(q);
      setPrice(parseFloat(q.outAmountUSD || 0).toFixed(2));
    } catch (e) {
      console.error(e);
      alert("Quote failed: " + (e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function handleSwap(){
    if (!vault) return alert("Unlock your wallet first.");
    try{
      setLoading(true);

      // ensure we have a route (quote)
      const route = quote || await jupQuote(inputMint, outputMint, amount);

      // ask for password to unlock the vault and obtain private key
      const pw = prompt("Enter password to unlock your wallet for the swap:");
      if (!pw) throw new Error("Password required.");
      const unlocked = await loadVault(pw);
      if (!unlocked?.pkBase58) throw new Error("Unable to unlock vault or private key missing.");

      // Send private key and route to backend which will perform the swap
      const res = await jupSwapTx(unlocked.pkBase58, route);
      if (res?.success && res.signature) {
        alert("Swap complete: " + res.signature);
      } else if (res?.signature) {
        alert("Swap submitted: " + res.signature);
      } else {
        alert("Swap complete (no signature returned).");
      }
    } catch (e){ console.error(e); alert("Swap failed: " + (e?.message || e)); }
    finally{ setLoading(false); }
  }

  useEffect(()=>{
    setTrending([
      { name: "SOL", symbol: "SOL", price: 144.22, change: -3.4, logo: "/sol.png" },
      { name: "USDC", symbol: "USDC", price: 1.0, change: 0.02, logo: "/usdc.png" },
      { name: "BONK", symbol: "BONK", price: 0.000028, change: 8.3, logo: "/bonk.png" },
    ]);
  },[]);

  return (
    <div className="min-h-screen bg-bg text-white pb-24">
      <Header />

      <div className="p-4 space-y-3">
  <div className="rounded-xl p-4 space-y-4 relative bg-card">
          <div>
            <div className="text-textDim text-xs mb-1">You swap</div>
            <div className="flex justify-between items-center">
              <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} className="input input-ghost text-3xl outline-none w-2/3" placeholder="0" />
              <div className="flex items-center gap-2">
                <div className="badge badge-outline rounded-full px-2 py-1 text-sm flex items-center gap-1">
                  <img src="/sol.png" alt="SOL" className="w-4 h-4" />
                  SOL
                </div>
                <button className="btn btn-ghost btn-sm">Deposit</button>
              </div>
            </div>
            <div className="text-textDim text-sm">${price}</div>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 bg-bg rounded-full w-8 h-8 flex items-center justify-center">
            <div className="rotate-90">⇅</div>
          </div>

          <div className="pt-8">
            <div className="text-textDim text-xs mb-1">You receive</div>
            <div className="flex justify-between items-center">
              <input type="text" disabled value={quote ? quote.outAmountUi : "0"} className="input input-ghost text-3xl outline-none w-2/3" />
              <div className="flex items-center gap-2">
                <div className="badge badge-outline rounded-full px-2 py-1 text-sm flex items-center gap-1">
                  <img src="/usdc.png" alt="USDC" className="w-4 h-4" />
                  USDC
                </div>
                <button className="btn btn-ghost btn-sm">›</button>
              </div>
            </div>
            <div className="text-textDim text-sm">${price}</div>
          </div>
        </div>

        <button onClick={handleQuote} disabled={loading} className="btn btn-primary w-full">{loading ? "Fetching..." : "Get Quote"}</button>
        <button onClick={handleSwap} disabled={loading} className="btn w-full btn-outline">{loading ? "Processing..." : "Swap Now"}</button>
      </div>

        <div className="p-4">
        <div className="text-xs text-textDim mb-2">TRENDING ON SOLANA</div>
        <div className="bg-card rounded-xl p-3">
          <div className="flex justify-around text-sm mb-2">
            {["Most Traded","All Tokens","Top Gainers","Top Losers"].map((t)=> (
              <button key={t} onClick={()=>setTab(t)} className={`py-2 w-1/4 ${tab===t?"text-[#3B82F6] border-b-2 border-[#3B82F6]":"text-textDim"}`}>{t}</button>
            ))}
          </div>
          <TokenList tokens={trending} />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
