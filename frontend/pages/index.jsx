import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navigation from "../components/navigation";
import TokenChartModal from "../components/TokenChartModal";

export default function Home() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [tokenPrices, setTokenPrices] = useState({});

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://your-backend-url.onrender.com";

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.expand();

    const telegramId = tg?.initDataUnsafe?.user?.id;
    if (!telegramId) {
      setError("No Telegram user detected");
      setLoading(false);
      return;
    }

    // fetch wallet, balance, and tokens
    const fetchWalletData = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/wallet/balance/${telegramId}`);
        setWallet(res.data.publicKey);
        setBalance(res.data.balance);
        // Fetch tokens (replace with actual API if available)
        const tokensRes = await axios.get(`${BACKEND_URL}/wallet/tokens/${telegramId}`);
        setTokens(tokensRes.data.tokens || []);
        // Fetch prices for tokens
        const priceObj = {};
        for (const token of tokensRes.data.tokens || []) {
          try {
            const priceRes = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${token.mint}`);
            const pair = priceRes.data.pairs?.[0];
            priceObj[token.symbol] = pair?.priceUsd ? parseFloat(pair.priceUsd) : null;
          } catch {
            priceObj[token.symbol] = null;
          }
        }
        setTokenPrices(priceObj);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWalletData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-phantom-bg text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-3">👻 DopeWallet</h1>

        {loading && <p className="text-gray-400">Loading wallet...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Balance Card */}
        {!loading && !error && (
          <motion.div
            className="card bg-gradient-to-br from-[#1b133d] to-[#0A0A0B] shadow-xl mb-6 border border-gray-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="card-body flex flex-col items-center">
              <h2 className="card-title text-sm text-gray-400">Wallet Balance</h2>
              <p className="truncate text-xs text-gray-500 mb-2">{wallet}</p>
              <h3 className="text-4xl font-bold mt-2 mb-2">{balance?.toFixed(3)} SOL</h3>
              <div className="flex gap-3 mb-2">
                <button className="btn btn-sm bg-green-600 text-white font-semibold shadow-md">Buy</button>
                <button className="btn btn-sm bg-blue-600 text-white font-semibold shadow-md">Send</button>
                <button className="btn btn-sm bg-purple-600 text-white font-semibold shadow-md">Receive</button>
              </div>
              <button
                className="btn btn-xs bg-phantom-accent text-white mt-2"
                onClick={() => window.location.reload()}
              >
                Refresh
              </button>
            </div>
          </motion.div>
        )}

        {/* Token Holdings Card */}
        {!loading && !error && (
          <motion.div
            className="card bg-neutral shadow-xl mb-6 border border-gray-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="card-body">
              <h2 className="font-semibold mb-2">Token Holdings</h2>
              <div className="grid grid-cols-2 gap-3">
                {tokens.length === 0 && <p className="text-gray-400 col-span-2">No tokens found.</p>}
                {tokens.map((token) => (
                  <div
                    key={token.symbol}
                    className="card bg-secondary text-center py-3 cursor-pointer hover:shadow-lg transition"
                    onClick={() => setSelectedToken(token)}
                  >
                    <p className="font-bold text-lg mb-1">{token.symbol}</p>
                    <p className="text-xs text-gray-400 mb-1">{token.mint}</p>
                    <p className="text-sm">Amount: {token.amount}</p>
                    <p className="text-xs text-gray-300">Price: {tokenPrices[token.symbol] ? `$${tokenPrices[token.symbol].toFixed(4)}` : "N/A"}</p>
                    <p className="text-xs text-gray-300 font-semibold">Value: {tokenPrices[token.symbol] ? `$${(token.amount * tokenPrices[token.symbol]).toFixed(2)}` : "N/A"}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Token Modal */}
        {selectedToken && (
          <TokenChartModal token={selectedToken} onClose={() => setSelectedToken(null)} />
        )}
      </div>

      <Navigation active="home" />
    </div>
  );
}
