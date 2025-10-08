import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/navigation";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [network, setNetwork] = useState("mainnet");

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://dopewalletbot-production.up.railway.app";

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const telegramId = tg?.initDataUnsafe?.user?.id;
    if (!telegramId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/profile/${telegramId}`);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleRevealKeys = () => {
    const priv = localStorage.getItem("privateKey");
    const mnemonic = localStorage.getItem("mnemonic");
    alert(`🔑 Private Key:\n${priv}\n\n🪶 Seed Phrase:\n${mnemonic}`);
  };

  const toggleNetwork = () => {
    const next = network === "mainnet" ? "testnet" : "mainnet";
    setNetwork(next);
    alert(`Switched to ${next}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-phantom-bg text-white">
      <div className="p-4 relative">
        <h1 className="text-xl font-bold mb-2">👤 Profile</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="absolute top-4 right-4 btn btn-square btn-ghost text-white"
        >
          ⚙️
        </button>

        {showSettings && (
          <div className="absolute right-4 top-14 z-50 card bg-neutral shadow-lg w-64">
            <div className="card-body p-3">
              <button
                className="btn btn-sm bg-secondary text-white w-full mb-2"
                onClick={handleRevealKeys}
              >
                Reveal Secret Key
              </button>
              <button
                className="btn btn-sm bg-secondary text-white w-full mb-2"
                onClick={toggleNetwork}
              >
                Switch to {network === "mainnet" ? "Testnet" : "Mainnet"}
              </button>
              <button
                className="btn btn-sm btn-error text-white w-full"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {loading && <p className="text-gray-400">Loading profile...</p>}

        {profile && (
          <div className="card bg-neutral shadow-xl p-4 mt-4">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={profile.avatar_url || "https://api.dicebear.com/7.x/identicon/svg"}
                alt="avatar"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{profile.display_name || profile.username}</p>
                <p className="text-xs text-gray-400 truncate">{profile.wallet_pubkey}</p>
              </div>
            </div>
            <p className="text-sm mt-2">{profile.bio || "No bio yet."}</p>
            <div className="flex justify-between text-sm mt-3 text-gray-400">
              <p>{profile.followers || 0} Followers</p>
              <p>{profile.following || 0} Following</p>
            </div>
          </div>
        )}
      </div>

      <Navigation active="profile" />
    </div>
  );
}
