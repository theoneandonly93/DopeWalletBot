import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function TokenChartModal({ token, onClose }) {
  const [chartUrl, setChartUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchChart = async () => {
      try {
        const res = await axios.get(
          `https://api.dexscreener.com/latest/dex/tokens/${token.mint}`
        );
        const pair = res.data.pairs?.[0];
        if (pair) setChartUrl(`https://dexscreener.com/solana/${pair.pairAddress}`);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchChart();
  }, [token]);

  if (!token) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="card bg-neutral text-white w-[90%] md:w-[70%] lg:w-[50%] h-[70%] overflow-hidden relative">
        <button
          className="absolute top-2 right-2 btn btn-sm btn-error text-white"
          onClick={onClose}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="card-body">
          <h2 className="text-xl font-semibold mb-2">{token.symbol}</h2>
          <p className="text-xs text-gray-400 mb-2">{token.mint}</p>
          {loading && <p className="text-gray-400">Loading chart...</p>}
          {chartUrl ? (
            <iframe
              src={chartUrl}
              className="w-full h-full border-0 rounded-md"
              title="DexScreener Chart"
            />
          ) : (
            !loading && (
              <p className="text-gray-500 text-sm">No chart data found for this token.</p>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}
