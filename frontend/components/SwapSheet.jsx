import { useState } from "react";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { jupQuote, jupSwapTx } from "../lib/api";
import { loadVault, keypairFromBase58 } from "../lib/wallet";

const RPC = process.env.NEXT_PUBLIC_RPC;

export default function SwapSheet({ pubkey }){
  const [inMint, setInMint] = useState("So11111111111111111111111111111111111111112");
  const [outMint, setOutMint] = useState("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
  const [amount, setAmount] = useState("0.01");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  async function handleSwap(){
    try{
      setLoading(true); setMsg("Fetching quote...");
      const quote = await jupQuote(inMint, outMint, amount);
      setMsg("Building swap transaction...");
      const { swapTransaction } = await jupSwapTx(pubkey, quote);
      const tx = VersionedTransaction.deserialize(Buffer.from(swapTransaction, "base64"));

      const pw = prompt("Enter wallet password to sign the swap:");
      if (!pw) throw new Error("Password required");
      const vault = await loadVault(pw);
      if (!vault) throw new Error("Unable to unlock wallet");
      const kp = keypairFromBase58(vault.pkBase58);
      tx.sign([kp]);

      const conn = new Connection(RPC, "confirmed");
      setMsg("Sending transaction...");
      const sig = await conn.sendTransaction(tx, { skipPreflight: true, maxRetries: 3 });
      setMsg(`Sent! ${sig}`);
      await conn.confirmTransaction(sig, "confirmed");
  alert("Swap complete\n" + sig);
    } catch (e){ console.error(e); alert("Swap failed: " + (e?.message ?? e)); }
    finally { setLoading(false); setMsg(null); }
  }

  return (
    <div className="bg-card rounded-xl2 p-3 space-y-3">
      <div className="text-sm text-textDim">Swap (via Jupiter)</div>
      <input className="w-full bg-[#111] border border-line rounded-xl2 p-2 text-sm" placeholder="Input mint" value={inMint} onChange={e=>setInMint(e.target.value)} />
      <input className="w-full bg-[#111] border border-line rounded-xl2 p-2 text-sm" placeholder="Output mint" value={outMint} onChange={e=>setOutMint(e.target.value)} />
      <input className="w-full bg-[#111] border border-line rounded-xl2 p-2 text-sm" placeholder="Amount (tokens)" value={amount} onChange={e=>setAmount(e.target.value)} />
      <button disabled={loading} onClick={handleSwap} className="w-full bg-accent text-white rounded-xl2 py-2">{loading ? (msg ?? "Working...") : "Swap"}</button>
    </div>
  );
}
