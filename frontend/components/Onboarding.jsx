import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => setStep(1);

  const handleCreateAccount = async () => {
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");

    // Best-effort: try server onboarding but continue locally even if it fails
    try {
      await axios.post('/api/onboarding', { password }).catch(() => null);
    } catch (e) {
      // ignore server errors
    }

    try {
      localStorage.setItem('dopewallet_signedin', 'true');
    } catch (e) {}
    try { window.dispatchEvent(new Event('dopewallet:signin')); } catch (e) {}
    setLoading(false);
    onComplete();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#060606] to-[#0A0A0B]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.img
        src="/logo-512.png"
        alt="DopeWallet Logo"
        className="w-28 h-28 mt-8 mb-4 rounded-full shadow-2xl"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
      />

      <div className="card bg-neutral text-white w-[90%] max-w-md p-8 shadow-2xl flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2">Welcome to DopeWallet</h1>
        {step === 0 && (
          <>
            <p className="mb-6 text-center text-gray-300">Your secure Solana wallet. Get started to create your account and wallet.</p>
            <button className="btn btn-primary w-full" onClick={handleGetStarted}>Get Started</button>
          </>
        )}

        {step === 1 && (
          <>
            <p className="mb-4 text-center text-gray-300">Create a password to secure your wallet. You'll use this to sign in next time.</p>
            <input
              type="password"
              className="input input-bordered w-full mb-2"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              className="input input-bordered w-full mb-2"
              placeholder="Confirm Password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              disabled={loading}
            />
            {error && <p className="text-red-400 mb-2">{error}</p>}
            <button className="btn btn-success w-full" onClick={handleCreateAccount} disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
