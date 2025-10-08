import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsMenu({ onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        key="menu"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 flex flex-col justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.28 }}
          className="bg-[#111] rounded-t-2xl text-white p-4 space-y-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-1 bg-[#333] rounded-full mx-auto mb-3" />
          <h3 className="text-center text-sm font-semibold text-textDim mb-2">Wallet mini app</h3>

          <div className="divide-y divide-[#222]">
            <Link href="/settings" className="flex items-center justify-between py-3">
              <span>⚙️ Settings</span>
              <span>›</span>
            </Link>
            <a href="https://t.me/dopewalletbot" target="_blank" rel="noreferrer" className="flex items-center justify-between py-3">
              <span>🤖 Open Bot</span>
              <span>›</span>
            </a>
            <button onClick={() => window.location.reload()} className="flex items-center justify-between py-3 w-full">
              <span>🔄 Reload Page</span>
              <span>›</span>
            </button>
            <Link href="/terms" className="flex items-center justify-between py-3">
              <span>📄 Terms of Use</span>
              <span>›</span>
            </Link>
            <Link href="/privacy" className="flex items-center justify-between py-3">
              <span>🔒 Privacy Policy</span>
              <span>›</span>
            </Link>
            <button onClick={() => {
              // sign out: clear flag and notify app
              try { localStorage.removeItem('dopewallet_signedin'); } catch (e) {}
              try { window.dispatchEvent(new Event('dopewallet:signout')); } catch (e) {}
              // force a soft reload to ensure state resets
              window.location.reload();
            }} className="flex items-center justify-between py-3 text-sm w-full">
              <span>🔓 Sign out</span>
              <span>›</span>
            </button>
            <button className="flex items-center justify-between py-3 text-red-500 w-full">
              <span>🗑 Remove from Menu</span>
              <span>›</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full bg-[#222] rounded-xl py-2 text-sm text-textDim"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
