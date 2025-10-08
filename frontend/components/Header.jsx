import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import SettingsMenu from './SettingsMenu';

export default function Header(){
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const router = useRouter();

  // Try to detect Telegram user id from WebApp and fetch profile
  useEffect(() => {
    try {
      const tg = typeof window !== 'undefined' && window.Telegram?.WebApp;
      const tgId = tg?.initDataUnsafe?.user?.id || (tg?.initData && (() => { try { return JSON.parse(tg.initData).user?.id } catch { return null } })());
      if (!tgId) return;
      (async () => {
        try {
          const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://dopewalletbot-production.up.railway.app';
          const res = await axios.get(`${BACKEND_URL}/profile/by_telegram/${tgId}`);
          setAvatarUrl(res.data?.avatar_url || null);
        } catch (e) {
          // ignore
        }
      })();
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="flex items-center justify-between p-3 bg-bg">
      {/* Left: user avatar (click to edit profile) */}
      <button onClick={() => router.push('/profile?edit=true')} className="flex items-center gap-2">
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <circle cx="12" cy="8" r="3" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" fill="none" />
              <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
        )}
      </button>

      {/* Center: spacer */}
      <div className="text-center">
        <p className="font-semibold">&nbsp;</p>
      </div>

      {/* Right: settings */}
      <button onClick={() => setMenuOpen(true)} className="text-textDim hover:text-white p-1">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="5" cy="12" r="1.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" fill="none" />
          <circle cx="12" cy="12" r="1.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" fill="none" />
          <circle cx="19" cy="12" r="1.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" fill="none" />
        </svg>
      </button>
      {menuOpen && <SettingsMenu onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
