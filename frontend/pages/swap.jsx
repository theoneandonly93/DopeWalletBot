import { useEffect, useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import TokenList from "../components/TokenList";
import { jupQuote, jupSwapTx } from "../lib/api";
import pancake, { PANCAKE_ROUTER } from '../utils/pancake';
import { Wallet, providers, Contract, parseUnits } from 'ethers';
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
  const [chain, setChain] = useState('solana');

  const RPC = process.env.NEXT_PUBLIC_RPC;

  useEffect(()=>{ (async()=>{ try{ const pw = localStorage.getItem("DW_LAST_PW"); if (pw) { const v = await loadVault(pw); setVault(v); } }catch{} })(); },[]);

  // Read swap prefill (from token detail Buy button) if present
  useEffect(() => {
    try {
      const raw = localStorage.getItem('swap_prefill');
      if (raw) {
        const pref = JSON.parse(raw);
        if (pref.inputMint) setInputMint(pref.inputMint);
        if (pref.outputMint) setOutputMint(pref.outputMint);
        // clear after consuming
        localStorage.removeItem('swap_prefill');
      }
    } catch (e) { /* ignore */ }
  }, []);

  // Fetch trending tokens from Birdeye (re-fetch when chain changes)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/dex/trending?chain=${encodeURIComponent(chain)}`);
        const body = await res.json();

        // Support multiple response shapes: our proxy { data: [...] }, DexScreener { pairs: [...] } or direct array
        const rawList = body?.data || body?.pairs || body || [];

        const items = (Array.isArray(rawList) ? rawList : []).map((it) => {
          // DexScreener pair/item variations
          const tokenAddress = it.tokenAddress || it.address || it.pairAddress || it.baseToken?.address || it.quoteToken?.address || it.id || '';
          const logoURI = it.icon || it.logo || it.logoURI || it.tokenIcon || it.baseToken?.icon || it.quoteToken?.icon || '';
          const symbol = it.symbol || it.tokenSymbol || it.token?.symbol || it.baseToken?.symbol || it.quoteToken?.symbol || it.name || '';

          const price = Number(it.priceUsd || it.price || it.tokenPrice || it.price_usd || it.baseToken?.price || 0) || 0;
          const change24h = Number(it.priceChange || it.change || it.change_24h || it.price_change_percentage_24h || 0) || 0;
          const volume24h = Number(it.volume || it.volume24h || it.volume_24h || it.quoteVolume || it.liquidity || 0) || 0;

          return {
            address: tokenAddress,
            logoURI,
            symbol,
            price,
            change24h,
            volume24h,
          };
        });
        setTrending(items);
      } catch (e) {
        console.error('Trending fetch failed', e);
      }
    })();
  }, [chain]);
  async function handleQuote(){
    if (!vault) return alert("Unlock your wallet first.");
    try {
      setLoading(true);
      if (chain === 'bsc'){
        try{
          const rpc = process.env.NEXT_PUBLIC_BSC_RPC || process.env.NEXT_PUBLIC_RPC;
          const provider = new providers.JsonRpcProvider(rpc);
          // Use pancakeswap contract to getAmountsOut
          const routerAbi = [ 'function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)' ];
          const router = new Contract(PANCAKE_ROUTER, routerAbi, provider);
          // amount handling: assume amount is in token units already; proper decimals handling will be added later
          const amountIn = parseUnits(String(amount || '0'), 6); // naive default 6 decimals
          const path = [inputMint, outputMint];
          const amounts = await router.getAmountsOut(amountIn, path);
          // amounts is an array of BigNumber; present the last as expected out
          const out = amounts[amounts.length - 1];
          setQuote({ chain: 'bsc', amounts: amounts.map(a => a.toString()), out: out.toString() });
          setPrice('0.00');
        }catch(e){ console.error('BSC quote failed', e); alert('BSC quote failed: ' + (e?.message||e)); }
      } else {
        const q = await jupQuote(inputMint, outputMint, amount);
        // backend returns Jupiter quote object — store it
        setQuote(q);
        setPrice(parseFloat(q.outAmountUSD || 0).toFixed(2));
      }
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

      if (chain === 'bsc'){
        try{
          // Use mnemonic from unlocked vault to derive an EVM wallet
          const mnemonic = unlocked.mnemonic;
          if (!mnemonic) throw new Error('Mnemonic not available in vault for EVM signing.');
          const rpc = process.env.NEXT_PUBLIC_BSC_RPC || process.env.NEXT_PUBLIC_RPC;
          const provider = new providers.JsonRpcProvider(rpc);
          // derive first account for Ethereum
          const wallet = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/0").connect(provider);

          // prepare amounts
          const amountIn = parseUnits(String(amount || '0'), 6);
          // compute amountsOut via contract
          const routerAbi = [ 'function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)', 'function swapExactTokensForTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) returns (uint[] memory amounts)' ];
          const router = new Contract(PANCAKE_ROUTER, routerAbi, wallet);
          const amounts = await router.getAmountsOut(amountIn, [inputMint, outputMint]);
          const out = amounts[amounts.length - 1];
          // set a slippage of 5%
          const amountOutMin = out.mul(95).div(100);

          // Approve input token to router if needed
          const erc20Abi = [ 'function approve(address spender, uint256 amount) returns (bool)', 'function allowance(address owner,address spender) view returns (uint256)' ];
          const tokenIn = new Contract(inputMint, erc20Abi, wallet);
          const owner = await wallet.getAddress();
          const allowance = await tokenIn.allowance(owner, PANCAKE_ROUTER);
          if (allowance.lt(amountIn)){
            const tx = await tokenIn.approve(PANCAKE_ROUTER, amountIn);
            await tx.wait();
          }

          const deadline = Math.floor(Date.now()/1000) + 60*10;
          const swapTx = await router.swapExactTokensForTokens(amountIn, amountOutMin, [inputMint, outputMint], owner, deadline, { gasLimit: 600000 });
          const receipt = await swapTx.wait();
          alert('Swap complete: ' + receipt.transactionHash);
        }catch(e){ console.error('BSC swap failed', e); alert('BSC swap failed: ' + (e?.message || e)); }
      } else {
        // Send private key and route to backend which will perform the swap (Solana/Jupiter flow)
        const res = await jupSwapTx(unlocked.pkBase58, route);
        if (res?.success && res.signature) {
          alert("Swap complete: " + res.signature);
        } else if (res?.signature) {
          alert("Swap submitted: " + res.signature);
        } else {
          alert("Swap complete (no signature returned).");
        }
      }
    } catch (e){ console.error(e); alert("Swap failed: " + (e?.message || e)); }
    finally{ setLoading(false); }
  }

  useEffect(()=>{
    // No local mock override — rely on the API proxy for trending tokens.
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
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-textDim">TRENDING</div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setChain('solana')} className={`btn btn-sm ${chain==='solana'?'btn-primary':'btn-ghost'}`}>Solana</button>
            <button onClick={()=>setChain('bsc')} className={`btn btn-sm ${chain==='bsc'?'btn-primary':'btn-ghost'}`}>BSC</button>
          </div>
        </div>
        <div className="bg-card rounded-xl p-3">
          <div className="flex justify-around text-sm mb-2">
            {["Most Traded","All Tokens","Top Gainers","Top Losers"].map((t)=> (
              <button key={t} onClick={()=>setTab(t)} className={`py-2 w-1/4 ${tab===t?"text-[#3B82F6] border-b-2 border-[#3B82F6]":"text-textDim"}`}>{t}</button>
            ))}
          </div>
          <TokenList tokens={trending} chain={chain} />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
