import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Splash({ trigger }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // show when trigger changes
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[999] bg-bg flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <motion.img
              src="/dopeghost.png"
              alt="DopeWallet Ghost"
              className="w-20 h-20 mb-3 drop-shadow-[0_0_12px_rgba(140,104,255,0.8)]"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              animate={{ y: [0, -6, 0], scale: [0.99, 1, 0.99] }}
              transition={{ y: { repeat: Infinity, duration: 2.6, ease: 'easeInOut' }, scale: { repeat: Infinity, duration: 3.6 } }}
            />

            {/* static loading label (no animated DopeWallet text) */}
            <p className="text-textDim text-xs mt-1">loading...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
