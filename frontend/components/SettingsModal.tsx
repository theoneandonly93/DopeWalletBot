import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import SecuritySettings from './SecuritySettings';

export default function SettingsModal({ isOpen, onClose }) {
  const [activePage, setActivePage] = useState("main");

  // Sub-components for each page
  const BackButton = ({ label }) => (
    <div className="flex justify-between items-center mb-6">
      <button onClick={() => setActivePage("main")} className="text-blue-400 text-sm">
        ← Back
      </button>
      <h2 className="text-white text-base font-semibold">{label}</h2>
      <div className="w-6" />
    </div>
  );

  const LanguageSettings = () => (
    <>
      <BackButton label="Language" />
      <div className="space-y-3">
        { ["English", "Spanish", "French", "Korean", "Japanese"].map((lang, i) => (
          <button key={i} className="w-full text-left p-3 rounded-xl bg-[#111] hover:bg-[#222] text-white">
            {lang}
          </button>
        )) }
      </div>
    </>
  );

  const CurrencySettings = () => (
    <>
      <BackButton label="Default Currency" />
      <div className="space-y-3">
        { ["USD", "EUR", "SOL", "BNB", "BTC"].map((cur, i) => (
          <button key={i} className="w-full text-left p-3 rounded-xl bg-[#111] hover:bg-[#222] text-white">
            {cur}
          </button>
        )) }
      </div>
    </>
  );

  const RecoveryPhrase = () => (
    <>
      <BackButton label="Backup & Recovery Phrase" />
      <div className="bg-[#111] p-4 rounded-2xl text-gray-300 text-sm">
        <p>
          Your 12-word seed phrase is your key to your Dope Wallet. Write it down and
          store it securely. Never share it with anyone.
        </p>
        <div className="mt-4 p-3 rounded-xl bg-[#000] border border-[#333] text-center text-white font-mono">
          word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12
        </div>
        <button className="mt-5 w-full py-3 bg-blue-500 rounded-xl font-semibold text-white">Copy Phrase</button>
      </div>
    </>
  );

  const VersionNetwork = () => (
    <>
      <BackButton label="Version & Network" />
      <div className="bg-[#111] p-4 rounded-2xl text-gray-300 text-sm space-y-3">
        <div className="flex justify-between">
          <span>App Version</span>
          <span className="text-white">v1.0.3</span>
        </div>
        <div className="flex justify-between">
          <span>Network</span>
          <span className="text-white">Solana Mainnet</span>
        </div>
        <div className="flex justify-between">
          <span>RPC Endpoint</span>
          <span className="text-white">https://api.mainnet-beta.solana.com</span>
        </div>
      </div>
    </>
  );

  const mainSettings = [
    { label: "Notifications" },
    { label: "Passcode & Face ID", action: () => setActivePage('security') },
    { label: "Language", action: () => setActivePage("language") },
    { label: "Default Currency", action: () => setActivePage("currency") },
    { label: "Backup & Recovery Phrase", action: () => setActivePage("recovery") },
    { label: "Connected Apps" },
    { label: "Version & Network", action: () => setActivePage("version") },
    { label: "Contact Support" },
    { label: "FAQ" },
    { label: "Dope Wallet News" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-[#000000f2] backdrop-blur-md z-50 overflow-y-auto">
          <div className="p-6 max-w-md mx-auto">
            {/* Main */}
            {activePage === "main" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-white text-lg font-semibold">Settings</h2>
                  <button onClick={onClose}>
                    <XMarkIcon className="w-6 h-6 text-gray-300" />
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-gray-400 text-xs font-semibold tracking-wider">GENERAL SETTINGS</h3>
                  {mainSettings.map((item, i) => (
                    <button key={i} onClick={item.action} className="flex justify-between items-center w-full bg-[#111] p-3 rounded-2xl hover:bg-[#222] transition">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-white rounded-md opacity-80" />
                        <span className="text-sm text-white">{item.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <button className="w-full py-3 bg-[#222] text-red-500 rounded-2xl font-semibold">Remove Dope Wallet</button>
                </div>

                <div className="mt-6 space-y-2">
                  <button className="w-full text-center text-sm text-blue-400 font-medium">Terms of Use</button>
                  <button className="w-full text-center text-sm text-blue-400 font-medium">Privacy Policy</button>
                </div>
              </>
            )}

            {activePage === "language" && <LanguageSettings />}
            {activePage === "currency" && <CurrencySettings />}
            {activePage === "recovery" && <RecoveryPhrase />}
            {activePage === "version" && <VersionNetwork />}
            {activePage === 'security' && <SecuritySettings onBack={()=>setActivePage('main')} />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
