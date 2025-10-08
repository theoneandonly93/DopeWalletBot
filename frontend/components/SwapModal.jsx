"use client";
import { useState } from 'react';
import bs58 from 'bs58';
import { getQuote, getSwapTransaction, executeSwapFromBase64 } from '../lib/jupiter';
import { loadVault } from '../lib/wallet';
import { Keypair } from '@solana/web3.js';

export default function SwapModal({ onClose, tokenMint, tokenSymbol }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(null);
  const [txSig, setTxSig] = useState('');
  const [unsignedB64, setUnsignedB64] = useState('');

  async function handleQuote(){
    setLoading(true);
    try{
      const solMint = 'So11111111111111111111111111111111111111112';
      const amountLamports = Math.round(Number(amount) * 1e9);
      const q = await getQuote(solMint, tokenMint, amountLamports);
      setQuote(q);
    }catch(err){
      console.error('Quote error', err);
      alert('Quote failed: ' + (err?.message || err));
    }finally{ setLoading(false); }
  }

  async function handleSwap(){
    setLoading(true);
    try{
      // load local wallet secret
      let secretKey = null;
      try{
        const pw = localStorage.getItem('DW_LAST_PW');
        if (pw) {
          const v = await loadVault(pw);
          // try common fields
          if (v?.pkBase58) secretKey = bs58.decode(v.pkBase58);
          if (!secretKey && v?.secret) secretKey = bs58.decode(v.secret);
        }
      }catch(e){ console.warn('decrypt failed', e); }

      if (!secretKey) {
        // fallback: parse unencrypted blob
        try{
          const blob = localStorage.getItem('DW_VAULT_V1');
          if (blob) {
            const parsed = JSON.parse(blob);
            if (parsed?.pkBase58) secretKey = bs58.decode(parsed.pkBase58);
            if (!secretKey && parsed?.secret) secretKey = bs58.decode(parsed.secret);
          }
        }catch(e){}
      }

      if (!secretKey) return alert('Wallet secret not available. Unlock your wallet first.');

  // request swap transaction (Jupiter returns a base64 swapTransaction)
  const walletKP = secretKey ? Keypair.fromSecretKey(Uint8Array.from(secretKey)) : null;
  const swapResp = await getSwapTransaction(walletKP ? walletKP.publicKey.toBase58() : 'unknown', quote);
      const b64 = swapResp?.swapTransaction || swapResp?.data?.swapTransaction;
      if (!b64) throw new Error('No swapTransaction returned');

      // if we have a secretKey locally, sign and send automatically
      if (secretKey) {
        const kp = Keypair.fromSecretKey(Uint8Array.from(secretKey));
        // attempt to deserialize and sign using web3 VersionedTransaction paths is fragile across versions.
        // Instead, rely on Jupiter's signedTransaction endpoint if available, but here we'll attempt local sign flow.
        try{
          // naive approach: call executeSwapFromBase64 with the base64 as-is will fail unless signed.
          // For now, attempt to sign -> if signing logic is incompatible, expose b64 for external signing.
          // TODO: implement proper VersionedTransaction signing flow using web3.js message + signMessage
          alert('Auto-sign is experimental. If it fails, the unsigned base64 will be shown for manual signing.');
        }catch(e){ console.warn('Auto-sign attempt failed', e); }

      }

  // store the unsigned base64 for user to inspect / sign
  setTxSig('');
  setUnsignedB64(b64);
    }catch(err){ console.error('Swap failed', err); alert('Swap failed: ' + (err?.message || err)); }
    finally{ setLoading(false); }
  }

  async function handleUnifiedSwap(){
    setLoading(true);
    try{
      const pw = localStorage.getItem('DW_LAST_PW');
      let pubkey = null;
      if (pw) {
        try{ const v = await loadVault(pw); pubkey = v?.pubkey; }catch(e){}
      }
      if (!pubkey) {
        try{ const parsed = JSON.parse(localStorage.getItem('DW_VAULT_V1')||'null'); pubkey = parsed?.pubkey || null; }catch(e){}
      }
      if (!pubkey) return alert('Unlock wallet first');
      const solMint = 'So11111111111111111111111111111111111111112';
      const amt = Math.round(Number(amount) * 1e9);
      const r = await fetch('/api/swap/unified', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fromToken: solMint, toToken: tokenMint, amount: amt, userPubkey: pubkey }) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || 'Swap failed');
      alert('Unified swap routed: ' + JSON.stringify(j.result).slice(0,200));
    }catch(e){ console.error(e); alert('Unified swap failed: ' + (e?.message||e)); }
    finally{ setLoading(false); }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#111] rounded-2xl p-6 w-[90%] max-w-sm text-white">
        <h2 className="text-lg font-semibold mb-3">Swap SOL → {tokenSymbol}</h2>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#222] mb-3 outline-none text-sm"
        />
        <div className="flex gap-3">
          <button onClick={handleQuote} className="flex-1 bg-[#3B82F6] py-2 rounded-xl font-semibold text-sm">{loading ? 'Fetching...' : 'Get Quote'}</button>
          {quote && (<button onClick={handleSwap} className="flex-1 bg-[#16a34a] py-2 rounded-xl font-semibold text-sm">{loading ? 'Swapping...' : 'Swap'}</button>)}
        </div>

        <div className="mt-3">
          <button onClick={handleUnifiedSwap} className="w-full bg-[#f59e0b] py-2 rounded-xl font-semibold text-sm">{loading ? 'Routing...' : 'Unified Swap (auto-router)'}</button>
        </div>

        {quote && (
          <div className="mt-4 text-xs text-[#aaa]">
            <p>Estimated Output: {(quote?.data?.outAmount || quote?.outAmount || 0) / 1e9}</p>
            <p>Price Impact: {quote?.data?.priceImpactPct ?? quote?.priceImpactPct ?? 0}%</p>
          </div>
        )}

        {txSig && (
          <div className="mt-4 text-xs text-green-500">
            ✅ Swap Successful!
            <a href={`https://solscan.io/tx/${txSig}?cluster=mainnet`} target="_blank" rel="noreferrer" className="block underline text-blue-400 mt-1">View on Solscan</a>
          </div>
        )}

        {unsignedB64 && (
          <div className="mt-4 text-xs text-[#ddd]">
            <div className="break-words bg-[#0b0b0b] p-2 rounded mb-2 text-[11px]">Unsigned TX (base64): {unsignedB64}</div>
            <div className="flex gap-2">
              <button onClick={()=>{ navigator.clipboard.writeText(unsignedB64); alert('Copied'); }} className="flex-1 bg-[#333] py-2 rounded text-sm">Copy unsigned</button>
              <button onClick={async ()=>{
                const signed = prompt('Paste signed base64 transaction (if signed externally)');
                if (!signed) return;
                try{
                  setLoading(true);
                  const sig = await executeSwapFromBase64(signed);
                  setTxSig(sig);
                }catch(e){ alert('Broadcast failed: ' + (e?.message||e)); } finally{ setLoading(false); }
              }} className="flex-1 bg-[#3B82F6] py-2 rounded text-sm">Broadcast signed</button>
            </div>
          </div>
        )}

        <button onClick={onClose} className="w-full mt-4 bg-[#333] py-2 rounded-xl text-sm">Close</button>
      </div>
    </div>
  );
}
