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
    <div className="flex items-center justify-between p-3 border-b border-line bg-bg">
      {/* Left: user avatar (click to edit profile) */}
      <button onClick={() => router.push('/profile?edit=true')} className="flex items-center gap-2">
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-sm">👻</div>
        )}
      </button>

      {/* Center: spacer */}
      <div className="text-center">
        <p className="font-semibold">&nbsp;</p>
      </div>

      {/* Right: settings */}
      <button onClick={() => setMenuOpen(true)} className="text-2xl text-textDim hover:text-white">•••</button>
      {menuOpen && <SettingsMenu onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
