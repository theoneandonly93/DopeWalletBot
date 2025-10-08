import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { createWallet, saveVault, loadVault } from '../lib/wallet';
import { readyTelegram } from '../lib/telegram';
import { motion } from 'framer-motion';

export default function Home() {
  const [vault, setVault] = useState(null);
  const [stage, setStage] = useState('choose');
  const [tempVault, setTempVault] = useState(null);

  useEffect(() => {
    try { readyTelegram(); } catch (e) { /* ignore */ }
  }, []);

  async function handleNewWallet() {
    const v = await createWallet();
    setTempVault(v);
    setStage('create');
  }

  async function handleSavePassword() {
    const pass1 = document.getElementById('p1')?.value;
    const pass2 = document.getElementById('p2')?.value;
    if (!pass1 || pass1 !== pass2) return alert('Passwords must match');
    if (!tempVault) return;
    await saveVault(pass1, tempVault);
    sessionStorage.setItem('DW_LAST_PW', pass1);
    setVault(tempVault);
    setStage('choose');
    // Mark user as signed in and notify app to hide onboarding
    localStorage.setItem('dopewallet_signedin', 'true');
    try { window.dispatchEvent(new Event('dopewallet:signin')); } catch (e) { /* ignore */ }
    try { router.push('/profile'); } catch (e) { /* ignore */ }
  }

  async function handleRestore() {
    const pw = prompt('Enter your wallet password:');
    if (!pw) return;
    const v = await loadVault(pw);
    if (!v) return alert('Invalid password or no wallet found.');
    setVault(v);
    // consider the user signed in after successful restore
    localStorage.setItem('dopewallet_signedin', 'true');
    try { window.dispatchEvent(new Event('dopewallet:signin')); } catch (e) { /* ignore */ }
  }

  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg text-white flex flex-col pb-24">
      <Header />

      {/* --- choose screen --- */}
      {stage === 'choose' && !vault && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 space-y-6">
          <div className="relative">
            <motion.img
              src="/logo-512.png"
              alt="DopeWallet"
              className="w-28 h-28 mx-auto mb-3 relative z-10"
              animate={{ y: [0, -6, 0], scale: [0.995, 1, 0.995], rotate: [0, 4, 0] }}
              transition={{ y: { repeat: Infinity, duration: 2.6, ease: 'easeInOut' }, scale: { repeat: Infinity, duration: 3.6 }, rotate: { repeat: Infinity, duration: 6 } }}
            />
            <motion.div aria-hidden className="absolute inset-0 flex items-center justify-center z-0">
              <motion.span
                aria-hidden
                className="rounded-full"
                style={{
                  width: 96,
                  height: 96,
                  pointerEvents: 'none',
                  filter: 'blur(18px)',
                  background: 'radial-gradient(circle at 50% 40%, rgba(140,104,255,0.9), rgba(140,104,255,0.4) 40%, rgba(140,104,255,0) 70%)'
                }}
                animate={{ opacity: [0, 0.85, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
          <h1 className="text-2xl font-bold">Choose DopeWallet</h1>
          <p className="text-textDim text-sm leading-relaxed">
            You have one DopeWallet available for recovery.
            <br />
            Restore it or add a new one.
          </p>

          <div className="w-full bg-card rounded-xl border border-line py-3 px-4 text-left space-y-1">
            <div className="text-sm">
              <span className="text-textDim">
                {vault?.pubkey
                  ? `${vault.pubkey.slice(0, 4)}...${vault.pubkey.slice(-4)}`
                  : 'No saved wallet yet'}
              </span>
            </div>
            <div className="text-xs text-textDim">$0.00 · 0 tokens · 0 collectibles</div>
          </div>

          <button onClick={handleRestore} className="w-full bg-accent rounded-xl py-2 text-white font-semibold">
            Restore Wallet
          </button>

          <button onClick={handleNewWallet} className="text-[#3B82F6] font-medium">
            Create or import another wallet
          </button>
        </div>
      )}

      {/* --- create password screen --- */}
      {stage === 'create' && tempVault && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 space-y-4">
          <img src="/logo-512.png" alt="DopeWallet" className="w-28 h-28 mx-auto mb-3" />
          <h1 className="text-2xl font-bold">Secure Your Wallet</h1>
          <p className="text-textDim text-sm">
            Your new address:
            <br />
            <span className="text-white text-xs break-all">{tempVault.pubkey}</span>
          </p>
          <div className="w-full bg-card rounded-xl p-4 space-y-3">
            <input id="p1" type="password" placeholder="Password" className="w-full bg-[#111] border border-line rounded-xl2 p-2" />
            <input id="p2" type="password" placeholder="Confirm Password" className="w-full bg-[#111] border border-line rounded-xl2 p-2" />
            <button onClick={handleSavePassword} className="w-full bg-accent text-white rounded-xl2 py-2 font-semibold">
              Continue
            </button>
          </div>
          <div className="text-xs text-textDim max-w-sm">Be sure to save your recovery phrase and private key safely.</div>
        </div>
      )}

      {vault && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-3">
          <div className="text-lg font-semibold">Welcome back</div>
          <div className="text-xs text-textDim">{vault.pubkey.slice(0, 4)}...{vault.pubkey.slice(-4)}</div>
          <button onClick={() => { localStorage.setItem('dopewallet_signedin','true'); try { window.dispatchEvent(new Event('dopewallet:signin')); } catch(e){}; router.push('/profile'); }} className="bg-accent rounded-xl py-2 px-6">
            Enter Wallet
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

