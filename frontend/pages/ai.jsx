import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/navigation";
import { motion } from "framer-motion";
import TokenChartModal from "../components/TokenChartModal";

export default function AIInsights() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://dopewalletbot-production.up.railway.app";

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/ai/predictions`);
        setTokens(res.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  const triggerRefresh = async () => {
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/ai/refresh`);
      // refetch
      const res = await axios.get(`${BACKEND_URL}/ai/predictions`);
      setTokens(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSwap = (symbol) => {
    // store the suggested token symbol for the swap page to pick up
    localStorage.setItem("swapToken", symbol);
    window.location.href = "/swap";
  };

  return (
  <div className="min-h-screen flex flex-col justify-between bg-bg text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">🤖 AI Insights</h1>
        <p className="text-gray-400 mb-4">
          Tokens with high momentum probability based on AI monitoring.
        </p>

        <div className="flex gap-2 mb-4">
          <button className="btn btn-sm btn-primary text-white" onClick={triggerRefresh}>
            {loading ? "Refreshing..." : "Refresh Predictions"}
          </button>
          <p className="text-xs text-gray-400 self-center">Run the AI monitor to update suggestions.</p>
        </div>

        {loading && <p className="text-gray-400">Loading predictions...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && tokens.length === 0 && (
          <p className="text-gray-500 text-sm">No predictions available yet.</p>
        )}

        {!loading && tokens.length > 0 && (
          <div className="flex flex-col gap-3">
            {tokens.map((token, idx) => (
              <motion.div
                key={idx}
                className="card bg-neutral shadow-lg p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className="font-semibold text-lg">{token.symbol}</h2>
                    <p className="text-xs text-gray-400">{token.mint}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-xs btn-primary text-white"
                      onClick={() => handleQuickSwap(token.symbol)}
                    >
                      Quick Swap
                    </button>
                    <button
                      className="btn btn-xs bg-secondary text-white"
                      onClick={() => setSelectedToken(token)}
                    >
                      View Chart
                    </button>
                  </div>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-2"
                    style={{ width: `${Math.min(token.score * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Confidence: {(token.score * 100).toFixed(1)}%
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedToken && (
        <TokenChartModal
          token={selectedToken}
          onClose={() => setSelectedToken(null)}
        />
      )}

  <Navigation active="ai" />
    </div>
  );
}
