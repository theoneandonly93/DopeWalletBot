import React from "react";
import { motion } from "framer-motion";

export default function SplashScreen({ onFinish }) {
  // Animation duration in ms
  const duration = 1200;

  // Automatically call onFinish after animation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, duration);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#060606] to-[#0A0A0B]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="flex flex-col items-center"
      >
        <img src="/logo-512.png" alt="DopeWallet Logo" className="w-24 h-24 mb-2 rounded-full shadow-lg" />
        <p className="text-sm text-textDim mt-2">loading…</p>
      </motion.div>
    </motion.div>
  );
}
