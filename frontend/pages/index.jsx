import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import BottomNav from '../components/BottomNav';
import Icon from '../components/Icon';
import TokenList from '../components/TokenList';
import { loadVault, getPublicKeyUnsafe } from '../lib/wallet';

export default function Home() {
  const [vault, setVault] = useState(null);
  const [balance, setBalance] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [usdBalance, setUsdBalance] = useState(null);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [toast, setToast] = useState(null);
  const [chain, setChain] = useState('solana');
  const addressBtnRef = useRef(null);

  useEffect(() => {
    // Try to decrypt/load the saved vault if we have a cached password, otherwise
    // fall back to a lightweight parse of the stored blob (for older unencrypted data).
    let mounted = true;
    (async () => {
      try {
        const pw = localStorage.getItem('DW_LAST_PW');
        if (pw) {
          try {
            const v = await loadVault(pw);
            if (v && mounted) {
              setVault(v);
              return;
            }
          } catch (e) {
            // decryption failed, fall back below
          }
        }

        // Fallback: try the unsafe public key extractor (handles legacy/plain blobs)
        try {
          const pk = getPublicKeyUnsafe();
          if (pk && mounted) { setVault({ pubkey: pk }); }
        } catch (e) {}
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  function showToast(msg, ms = 2500) {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-20">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A]">
        <div />
        <div className="text-center">
          <h1 className="text-base font-semibold">Wallet</h1>
        </div>
        <div>
          <button onClick={() => window.location.href = '/settings'} className="w-8 h-8 rounded-full overflow-hidden">
            {/* simple avatar: initials from pubkey */}
            <div className="w-8 h-8 flex items-center justify-center bg-[#1F2937] text-white text-xs font-semibold">
              {vault?.pubkey ? String(vault.pubkey).slice(0,2).toUpperCase() : 'U'}
            </div>
          </button>
        </div>
      </div>

      {/* balance */}
      <div className="text-center mt-6 px-4">
        <p className="text-sm text-[#aaa] mb-2">
          My address is {vault?.pubkey ? `${String(vault.pubkey).slice(0,4)}...${String(vault.pubkey).slice(-4)}` : 'No wallet'}
        </p>
        <h1 className="text-6xl font-bold mb-5">${(Number(usdBalance) || 0).toFixed(2)}</h1>

        <div className="grid grid-cols-3 gap-3">
          <button type="button" onClick={() => setShowTransfer(true)} onTouchEnd={() => setShowTransfer(true)} className="flex flex-col items-center bg-[#111] rounded-xl py-3 touch-manipulation">
            <span className="text-xl mb-1"><Icon name="Transfer" size={20} /></span>
            <p className="text-xs font-medium">Transfer</p>
          </button>
          <button type="button" onClick={() => setShowDeposit(true)} onTouchEnd={() => setShowDeposit(true)} className="flex flex-col items-center bg-[#111] rounded-xl py-3 touch-manipulation">
            <span className="text-xl mb-1"><Icon name="Plus" size={20} /></span>
            <p className="text-xs font-medium">Deposit</p>
          </button>
          <button type="button" onClick={() => setShowWithdraw(true)} onTouchEnd={() => setShowWithdraw(true)} className="flex flex-col items-center bg-[#111] rounded-xl py-3 touch-manipulation">
            <span className="text-xl mb-1"><Icon name="Upload" size={20} /></span>
            <p className="text-xs font-medium">Withdraw</p>
          </button>
        </div>
      </div>

      {/* finish setup */}
      <div className="mt-6 px-4">
        <h2 className="text-xs text-[#888] mb-2 font-semibold tracking-wide">FINISH SETTING UP</h2>
        <div className="bg-[#111] rounded-2xl border border-[#222]">
          <button type="button" onClick={() => showToast('Get SOL flow')} className="w-full flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500/20 rounded-full p-3 text-lg"><Icon name="Cash" size={18} /></div>
              <div>
                <p className="font-semibold text-sm">Get your first SOL</p>
              </div>
            </div>
            <p className="text-[#3B82F6]">›</p>
          </button>
        </div>
      </div>

      {/* tokens */}
      <div className="mt-6 px-4">
        <h2 className="text-xs text-[#888] mb-2 font-semibold tracking-wide">TOKENS</h2>
        {/* Use TokenList so rows are clickable and navigate to /token/[symbol] or /token/[mint] */}
        <TokenList tokens={(tokens && tokens.length) ? tokens : [
          { symbol: 'SOL', name: 'Solana', logoURI: 'https://cryptologos.cc/logos/solana-sol-logo.png', price: 150.30, volume24h: 123456, address: 'So11111111111111111111111111111111111111112' },
          { symbol: 'USDC', name: 'USDC', logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', price: 1.00, volume24h: 98765, address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' }
        ]} chain={chain} />
      </div>

      {/* earning assets */}
      <div className="mt-6 px-4">
        <div className="bg-[#111] rounded-2xl border border-[#222] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500/20 rounded-full p-3 text-lg"><Icon name="Percent" size={18} /></div>
            <div>
              <p className="font-semibold text-sm">Earning Assets <span className="bg-[#3B82F6] text-xs px-2 py-[2px] rounded-md ml-1">NEW</span></p>
              <p className="text-xs text-[#aaa]">Get rewards for holding crypto</p>
            </div>
          </div>
          <p className="text-[#3B82F6] text-lg">›</p>
        </div>
      </div>

      {/* activity */}
      <div className="mt-6 px-4">
        <h2 className="text-xs text-[#888] mb-2 font-semibold tracking-wide">ACTIVITY</h2>
        <div className="bg-[#111] rounded-2xl border border-[#222] divide-y divide-[#222]">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 w-7 h-7 rounded-full flex items-center justify-center"><Icon name="Ghost" size={16} /></div>
              <div>
                <p className="text-sm font-semibold">You created DopeWallet</p>
                <p className="text-xs text-[#999]">October 8 at 12:44 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-6 mb-24 px-4">
        <h2 className="text-xs text-[#888] mb-2 font-semibold tracking-wide">FAQ</h2>
        <div className="bg-[#111] rounded-2xl border border-[#222] divide-y divide-[#222]">
          <button type="button" onClick={()=>alert('What is DopeWallet?')} className="w-full text-left p-3 text-sm">What is DopeWallet?</button>
          <button type="button" onClick={()=>alert('Secure wallet instructions')} className="w-full text-left p-3 text-sm">How can I secure my wallet?</button>
          <button type="button" onClick={()=>alert('Withdraw steps')} className="w-full text-left p-3 text-sm">How to withdraw crypto?</button>
        </div>
      </div>

      {/* bottom nav is provided by BottomNav component (white-outline SVG icons) */}

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowDeposit(false)} />
          <div className="relative bg-bg rounded-xl w-full max-w-md p-4">
            <div className="font-semibold mb-2">Deposit</div>
            <div className="text-sm text-textDim mb-4">Send SOL to this address to deposit into your wallet.</div>
            <div className="bg-[#0b0b0d] rounded-lg p-3 font-mono text-sm break-words mb-4">{vault?.pubkey || 'No address'}</div>
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

      {/* toast */}
      {toast && (
        <div className="fixed right-4 bottom-24 z-50" role="status" aria-live="polite">
          <div className="flex items-center bg-black/80 text-white text-sm px-3 py-2 rounded-md shadow-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-2" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div>{toast}</div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

