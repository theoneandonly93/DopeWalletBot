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
  const [balance, setBalance] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [usdBalance, setUsdBalance] = useState(null);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try { readyTelegram(); } catch (e) { /* ignore */ }
  }, []);

  // Try to auto-load a saved vault if we have a remembered password or when signin events happen.
  useEffect(() => {
    let mounted = true;
    async function tryLoadSaved() {
      try {
        const lastPw = sessionStorage.getItem('DW_LAST_PW');
        const signed = localStorage.getItem('dopewallet_signedin');
        const blob = sessionStorage.getItem('DW_VAULT_V1');
        if (!blob) return;
        // If we have a cached password, attempt to decrypt and set the vault so the wallet view shows.
        if (lastPw) {
          const v = await loadVault(lastPw);
          if (v && mounted) {
            setVault(v);
            // If user was marked signed in, hide chooser
            if (signed === 'true') {
              try { window.dispatchEvent(new Event('dopewallet:signin')); } catch (e) {}
            }
          }
        }
      } catch (err) {
        console.error('Failed to auto-load vault', err);
      }
    }
    tryLoadSaved();

    const onSignin = () => tryLoadSaved();
    const onStorage = (e) => {
      if (e.key === 'dopewallet_signedin' || e.key === 'DW_LAST_PW') tryLoadSaved();
    };
    window.addEventListener('dopewallet:signin', onSignin);
    window.addEventListener('storage', onStorage);
    return () => { mounted = false; window.removeEventListener('dopewallet:signin', onSignin); window.removeEventListener('storage', onStorage); };
  }, []);

  // Fetch balances and tokens when vault is available
  useEffect(() => {
    if (!vault) return;
    let mounted = true;
    async function fetchBalances() {
      try {
        const resp = await fetch('/api/balance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pubkey: vault.pubkey }),
        });
        if (!resp.ok) throw new Error('balance api error');
        const body = await resp.json();
        if (mounted) {
          setBalance(body.sol ?? null);
          setUsdBalance(body.usdBalance ?? null);
          setTokens(body.tokens ?? []);
        }
      } catch (err) {
        console.error('Failed to fetch balances', err);
      }
    }
    fetchBalances();
    return () => { mounted = false; };
  }, [vault]);

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
      {/* Do not show Header on the initial login/chooser flow. Only show when a vault is unlocked. */}
      {vault && <Header />}

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
        <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">
          <div className="text-center mb-4">
            <div className="text-sm text-textDim">Address</div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(vault.pubkey);
                    setToast('Address copied');
                    setTimeout(() => setToast(null), 1600);
                  } catch (e) {
                    console.error('copy failed', e);
                    setToast('Copy failed');
                    setTimeout(() => setToast(null), 1600);
                  }
                }}
                className="font-mono text-sm sm:text-base text-gray-300 font-semibold truncate max-w-xs sm:max-w-md mx-auto hover:underline cursor-pointer"
                aria-label="Copy address"
                title={vault.pubkey}
                style={{ letterSpacing: '0.2px' }}
              >
                <span className="hidden sm:inline">{vault.pubkey}</span>
                <span className="inline sm:hidden">{`${vault.pubkey.slice(0,6)}...${vault.pubkey.slice(-6)}`}</span>
              </button>
            </div>
          </div>

          {/* Toast */}
          {toast && (
            <div className="fixed right-4 bottom-24 z-50" role="status" aria-live="polite">
              <div className="flex items-center bg-black/80 text-white text-sm px-3 py-2 rounded-md shadow-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-2" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div>{toast}</div>
              </div>
            </div>
          )}

          <div className="text-center mb-4">
            <div className="text-sm text-textDim">USD Value</div>
            <div className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">{usdBalance !== null ? `$${typeof usdBalance === 'number' ? usdBalance.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : usdBalance}` : '$0.00'}</div>
            {/* SOL display removed per design — show USD only */}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <button onClick={() => setShowDeposit(true)} className="col-span-1 bg-card rounded-xl p-3 text-center flex flex-col items-center justify-center gap-2 hover:shadow-md transition touch-manipulation" style={{minHeight:56}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 5v14" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 9h8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div className="text-sm">Deposit</div>
            </button>

            <button onClick={() => setShowTransfer(true)} className="col-span-1 bg-card rounded-xl p-3 text-center flex flex-col items-center justify-center gap-2 hover:shadow-md transition touch-manipulation" style={{minHeight:56}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M21 12H3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 5l7 7-7 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div className="text-sm">Transfer</div>
            </button>

            <button onClick={() => setShowWithdraw(true)} className="col-span-1 bg-card rounded-xl p-3 text-center flex flex-col items-center justify-center gap-2 hover:shadow-md transition touch-manipulation" style={{minHeight:56}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M21 8v6a2 2 0 01-2 2H5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 12h10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div className="text-sm">Withdraw</div>
            </button>
          </div>

          <div className="mt-12" />

          <div className="mb-2">
            <div className="ml-4">
              <span className="inline-block bg-bg border border-line text-xs px-3 py-0.5 rounded-full">Token Holdings</span>
            </div>
            <div className="bg-card rounded-xl border border-line p-6 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div />
                <div className="text-xs text-textDim">{tokens.length} tokens</div>
              </div>
              <div className="space-y-2">
              {tokens.length === 0 && (
                <div className="text-textDim text-sm">No tokens found. Your SOL balance and tokens will appear here.</div>
              )}
              {tokens.map((t) => (
                <div key={t.mint || t.address} className="flex items-center justify-between bg-[#0b0b0d] rounded-lg p-2 hover:bg-[#0f0f11] transition">
                  <div className="flex items-center space-x-3">
                    <img src={t.logoURI || '/token-placeholder.png'} alt={t.symbol} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="text-sm font-medium">{t.symbol || t.name}</div>
                      <div className="text-xs text-textDim">{t.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{t.uiAmountString || t.amount || '0'}</div>
                    <div className="text-xs text-textDim">${t.usdValue || '0.00'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

          <div className="mt-4 mb-2">
            <div className="ml-4">
              <span className="inline-block bg-bg border border-line text-xs px-3 py-0.5 rounded-full">Activity</span>
            </div>
            <div className="bg-card rounded-xl p-6">
              <div className="text-textDim text-sm">Recent transfers, swaps, and deposits will show here.</div>
            </div>
          </div>

          {/* Deposit Modal */}
          {showDeposit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowDeposit(false)} />
              <div className="relative bg-bg rounded-xl w-full max-w-md p-4">
                <div className="font-semibold mb-2">Deposit</div>
                <div className="text-sm text-textDim mb-4">Send SOL to this address to deposit into your wallet.</div>
                <div className="bg-[#0b0b0d] rounded-lg p-3 font-mono text-sm break-words mb-4">{vault.pubkey}</div>
                <div className="flex justify-end">
                  <button onClick={() => setShowDeposit(false)} className="px-4 py-2 bg-card rounded-lg">Close</button>
                </div>
              </div>
            </div>
          )}

          {/* Withdraw Modal */}
          {showWithdraw && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowWithdraw(false)} />
              <div className="relative bg-bg rounded-xl w-full max-w-md p-4">
                <div className="font-semibold mb-2">Withdraw</div>
                <div className="text-sm text-textDim mb-4">Enter an address and amount to withdraw SOL.</div>
                <input placeholder="Destination address" className="w-full bg-[#0b0b0d] rounded-lg p-2 mb-2" />
                <input placeholder="Amount (SOL)" className="w-full bg-[#0b0b0d] rounded-lg p-2 mb-4" />
                <div className="flex justify-end">
                  <button onClick={() => setShowWithdraw(false)} className="px-4 py-2 bg-card rounded-lg">Cancel</button>
                  <button className="ml-2 px-4 py-2 bg-accent rounded-lg">Withdraw</button>
                </div>
              </div>
            </div>
          )}

          {/* Transfer Modal */}
          {showTransfer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowTransfer(false)} />
              <div className="relative bg-bg rounded-xl w-full max-w-md p-4">
                <div className="font-semibold mb-2">Transfer</div>
                <div className="text-sm text-textDim mb-4">Quick send SOL or tokens to another wallet.</div>
                <input placeholder="Recipient address" className="w-full bg-[#0b0b0d] rounded-lg p-2 mb-2" />
                <input placeholder="Amount" className="w-full bg-[#0b0b0d] rounded-lg p-2 mb-4" />
                <div className="flex justify-end">
                  <button onClick={() => setShowTransfer(false)} className="px-4 py-2 bg-card rounded-lg">Cancel</button>
                  <button className="ml-2 px-4 py-2 bg-accent rounded-lg">Send</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}

