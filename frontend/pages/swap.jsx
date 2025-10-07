import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/navigation";

export default function Swap() {
  const [inputMint, setInputMint] = useState("So11111111111111111111111111111111111111112"); // SOL
  const [outputMint, setOutputMint] = useState("");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://your-backend-url.onrender.com";

  const handleQuote = async () => {
    if (!amount || !outputMint) return;
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/swap/quote`, {
        inputMint,
        outputMint,
        amount: parseFloat(amount) * 1e9, // lamports
      });
      setQuote(res.data);
      setStatus(null);
    } catch (err) {
      setStatus(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!quote) return;
    setLoading(true);
    try {
      const tg = window.Telegram?.WebApp;
      const telegramId = tg?.initDataUnsafe?.user?.id;
      const res = await axios.post(`${BACKEND_URL}/swap/execute`, {
        userPrivateKey: localStorage.getItem("privateKey"),
        route: { ...quote, userPublicKey: localStorage.getItem("publicKey") },
      });
      setStatus(`✅ Swap sent! Tx: ${res.data.signature}`);
    } catch (err) {
      setStatus(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-phantom-bg text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">💱 Swap Tokens</h1>

        <div className="card bg-neutral p-4 mb-3">
          <label className="label text-sm text-gray-400">From (SOL)</label>
          <input
            type="number"
            placeholder="Amount"
            className="input input-bordered w-full bg-secondary"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label className="label text-sm text-gray-400 mt-3">To (Output Mint)</label>
          <input
            type="text"
            placeholder="e.g., USDC Mint Address"
            className="input input-bordered w-full bg-secondary"
            value={outputMint}
            onChange={(e) => setOutputMint(e.target.value)}
          />

          <button
            onClick={handleQuote}
            disabled={loading}
            className="btn btn-primary mt-4 w-full text-white"
          >
            {loading ? "Fetching..." : "Get Quote"}
          </button>
        </div>

        {quote && (
          <div className="card bg-neutral p-4 mt-3">
            <h2 className="text-sm text-gray-400 mb-2">Best Route</h2>
            <p className="text-xs text-gray-400">Out Amount: {quote.outAmount / 1e9} tokens</p>
            <p className="text-xs text-gray-400 mb-3">Price Impact: {quote.priceImpactPct}%</p>
            <button
              onClick={handleSwap}
              disabled={loading}
              className="btn bg-phantom-accent text-white w-full"
            >
              {loading ? "Swapping..." : "Execute Swap"}
            </button>
          </div>
        )}

        {status && (
          <p className="mt-4 text-center text-sm text-gray-300">{status}</p>
        )}
      </div>

      <Navigation active="swap" />
    </div>
  );
}
