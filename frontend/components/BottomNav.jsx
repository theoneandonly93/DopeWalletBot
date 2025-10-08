import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Icon from './Icon';

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
  // Use shared Icon component (icons use stroke="currentColor")

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
        <div className="flex items-center justify-center p-0">
          <Icon name={label} size={20} className="" />
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
