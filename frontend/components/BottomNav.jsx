import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BottomNav(){
  const r = useRouter();
  const path = r.pathname || '/';
  const tab = path === '/'
    ? 'wallet'
    : path.startsWith('/profile')
    ? 'profile'
    : path.startsWith('/swap')
    ? 'swap'
    : path.startsWith('/earn')
    ? 'earn'
    : path.startsWith('/browser')
    ? 'browser'
    : 'wallet';
  const Icon = ({name, active}) => {
    const stroke = active ? 'white' : 'rgba(255,255,255,0.6)';
    const size = 18;
    if (name === 'Wallet') return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect x="2" y="6" width="20" height="12" rx="2" stroke={stroke} strokeWidth="1.6" fill="none" />
        <path d="M16 10h2v2" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
    if (name === 'Swap') return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M4 7h11l-3-3" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 17H9l3 3" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
    if (name === 'Profile') return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="12" cy="8" r="3" stroke={stroke} strokeWidth="1.6" fill="none" />
        <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
    // Browser / Compass
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.6" fill="none" />
        <path d="M9 15l6-3-3 6-3-3z" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  };

  const Item = ({ href, label, active }) => {
    const handleNav = (e) => {
      e?.preventDefault?.();
      try { r.push(href); } catch (err) { /* fallback */ window.location.href = href; }
    };
    // note: avoid navigating on touchstart to prevent accidental taps while scrolling on mobile
    const handleTouch = (e) => {
      // use touchend for reliable taps on mobile
      try { r.push(href); } catch (err) { window.location.href = href; }
    };
    return (
        <div
        role="button"
        tabIndex={0}
        onClick={handleNav}
        onTouchEnd={handleTouch}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNav(); } }}
        className={`flex flex-col items-center text-xs px-3 py-3 touch-manipulation w-20 ${active?"text-white":"text-textDim"} cursor-pointer`}
      >
        {/* Removed circular bg container so icon is shown inline without a rounded background */}
        <div className="flex items-center justify-center p-0">
          <Icon name={label} active={active} />
        </div>
        <div className="mt-1 text-[11px] select-none">{label}</div>
      </div>
    );
  };
  // Wallet button should open the DopeWallet home page (root), which is the wallet UI.
  const walletHref = '/';

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-bg py-2 flex justify-around z-50 pointer-events-auto">
      <Item href={walletHref} label="Wallet" active={tab==="wallet"} />
      <Item href="/swap" label="Swap" active={tab==="swap"} />
      <Item href="/profile" label="Profile" active={tab==="profile"} />
      <Item href="/browser" label="Browser" active={tab==="browser"} />
    </nav>
  );
}
