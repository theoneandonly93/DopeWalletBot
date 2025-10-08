import { useState } from 'react';
import Header from '../components/Header';
import { loadVault } from '../lib/wallet';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function BackupPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [vault, setVault] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleUnlock(e) {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const v = await loadVault(password);
      if (!v) {
        setError('Invalid password or no wallet found in session storage.');
      } else {
        setVault(v);
      }
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!vault?.mnemonic) return;
    try {
      navigator.clipboard.writeText(vault.mnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setError('Copy failed');
    }
  }

  function handleFinish() {
    if (!confirmed) return alert('Please confirm you have saved your recovery phrase safely.');
    // navigate back to wallet home (or dashboard)
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-bg text-white pb-24">
      <Header />

      <div className="p-4">
        <h1 className="text-lg font-semibold mb-2">Backup & Recovery Phrase</h1>
        <p className="text-textDim text-sm mb-4">This screen lets you reveal the Secret Recovery Phrase for your wallet. Keep it offline and never share it.</p>

        {!vault && (
          <form onSubmit={handleUnlock} className="space-y-3">
            <label className="block text-xs text-textDim">Enter your wallet password to unlock</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full bg-[#111] border border-line rounded-xl p-2"
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex gap-2">
              <button type="submit" className="bg-accent rounded-xl py-2 px-4">{loading ? 'Unlocking…' : 'Unlock'}</button>
              <button type="button" onClick={() => router.back()} className="bg-[#222] rounded-xl py-2 px-4 text-textDim">Back</button>
            </div>
          </form>
        )}

        {vault && (
          <div className="space-y-4">
            <div className="bg-card rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-sm text-textDim">Secret Recovery Phrase</h2>
                  <p className="text-xs text-textDim mt-1">Keep this phrase private. Anyone with it can access your funds.</p>
                </div>
                <div className="ml-3">
                  <button onClick={() => setRevealed((v) => !v)} className="text-sm text-[#3B82F6]">{revealed ? 'Hide' : 'Reveal'}</button>
                </div>
              </div>

              <motion.pre
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 p-3 bg-[#0A0A0B] rounded-lg text-xs break-words"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                            {revealed ? vault.mnemonic : 'Hidden (reveal to show recovery phrase)'}
              </motion.pre>

              <div className="mt-3 flex items-center gap-2">
                <button onClick={handleCopy} className="bg-[#222] rounded-xl py-2 px-3 text-sm">{copied ? 'Copied' : 'Copy'}</button>
                <button onClick={() => navigator.share ? navigator.share({ text: vault.mnemonic }) : alert('Sharing not supported')} className="bg-[#222] rounded-xl py-2 px-3 text-sm">Share</button>
              </div>
            </div>

            <div className="bg-[#0B0B0B] p-4 rounded-xl">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
                <span className="text-xs text-textDim">I have written down my recovery phrase and stored it offline.</span>
              </label>
              <div className="mt-3 flex gap-2">
                <button onClick={handleFinish} className="bg-accent rounded-xl py-2 px-4">Finish</button>
                <button onClick={() => setVault(null)} className="bg-[#222] rounded-xl py-2 px-4 text-textDim">Lock</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
