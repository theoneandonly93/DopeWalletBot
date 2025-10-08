import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { loadVault } from "../lib/wallet";
import { getPortfolio } from "../lib/api";

export default function Profile() {
  const [vault, setVault] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);
  const router = useRouter();
  const usernameFromPath = router.query.username || null;

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ display_name: "", username: "", avatar_url: "", bio: "" });
  const [isFollowing, setIsFollowing] = useState(false);
  const [processingFollow, setProcessingFollow] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://dopewalletbot-production.up.railway.app";

  // Determine current logged-in Telegram ID (if available)
  const getTelegramId = () => {
    const tg = typeof window !== 'undefined' && window.Telegram?.WebApp;
    if (!tg) return null;
    return tg?.initDataUnsafe?.user?.id || (tg?.initData && (() => { try { return JSON.parse(tg.initData).user?.id } catch { return null } })());
  };

  useEffect(() => {
    (async () => {
  const pw = localStorage.getItem("DW_LAST_PW");
      if (pw) {
        const v = await loadVault(pw);
        setVault(v);
        if (v?.pubkey) setPortfolio(await getPortfolio(v.pubkey));
      }
    })();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      setLoadingProfile(true);
      try {
        const tgId = getTelegramId();
        let res;
        if (usernameFromPath) {
          res = await axios.get(`${BACKEND_URL}/profile/${usernameFromPath}`);
        } else if (tgId) {
          res = await axios.get(`${BACKEND_URL}/profile/by_telegram/${tgId}`);
        } else {
          setProfile(null);
          setLoadingProfile(false);
          return;
        }
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to load profile', err?.response?.data || err.message || err);
        setProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };
    loadProfile();
  }, [usernameFromPath]);

  // Auto-open edit modal if routed with ?edit=true
  useEffect(() => {
    if (router.query?.edit === 'true') {
      openEdit();
    }
  }, [router.query]);

  const openEdit = () => {
    setEditData({
      display_name: profile?.display_name || profile?.username || "",
      username: profile?.username || "",
      avatar_url: profile?.avatar_url || "",
      bio: profile?.bio || "",
    });
    setEditing(true);
  };

  const saveProfile = async () => {
    try {
      const tgId = getTelegramId();
      if (!tgId) {
        // Allow saving in dev if Telegram not present, but warn the user
        if (!confirm('Telegram not detected. Save profile locally?')) return;
      }
      const payload = {
        telegramId: tgId || null,
        username: editData.username,
        displayName: editData.display_name,
        avatarUrl: editData.avatar_url,
        bio: editData.bio,
      };
      const res = await axios.post(`${BACKEND_URL}/profile/create`, payload);
      if (res.data?.success) {
        setProfile(res.data.profile);
        setEditing(false);
      } else {
        alert("Error saving profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }
  };

  const toggleFollow = async () => {
    try {
      setProcessingFollow(true);
      const me = getTelegramId();
      if (!me) return alert("Open inside Telegram to follow users.");
      const res = await axios.post(`${BACKEND_URL}/profile/follow`, { follower: me, following: profile.username });
      if (res.data?.action === "followed") setIsFollowing(true);
      if (res.data?.action === "unfollowed") setIsFollowing(false);
    } catch (err) {
      console.error(err);
      alert("Unable to follow/unfollow");
    } finally {
      setProcessingFollow(false);
    }
  };

  useEffect(() => {
    (async () => {
      const pw = localStorage.getItem("DW_LAST_PW");
      if (pw) {
        const v = await loadVault(pw);
        setVault(v);
        if (v?.pubkey) setPortfolio(await getPortfolio(v.pubkey));
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-bg text-white pb-24">
      <Header />

      <div className="p-4 space-y-4">
        {/* profile card */}
        <div className="card bg-card rounded-xl p-4 text-center space-y-3">
          <div className="flex justify-center">
            <div className="avatar">
              <div className="w-16 h-16 rounded-full bg-[#222] flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <circle cx="12" cy="8" r="3" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" fill="none" />
                  <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            </div>
          </div>
          <div className="text-lg font-semibold">{profile?.display_name || (vault ? "@" + vault.pubkey.slice(0, 6) + "..." : "Anonymous")}</div>
          <div className="text-sm text-textDim">{profile?.bio || "The dopest wallet on Solana"}</div>
          <div className="stats stats-vertical sm:stats-horizontal shadow-none bg-transparent p-0">
            <div className="stat">
              <div className="stat-value">{profile?.followers ?? '-'}</div>
              <div className="stat-desc text-textDim">Followers</div>
            </div>
            <div className="stat">
              <div className="stat-value">{profile?.following ?? '-'}</div>
              <div className="stat-desc text-textDim">Following</div>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <button onClick={openEdit} className="btn btn-primary rounded-xl py-2 px-6 font-semibold text-sm">Edit Profile</button>
            <button disabled={processingFollow} onClick={toggleFollow} className="btn btn-ghost rounded-xl py-2 px-6">{isFollowing ? 'Following' : 'Follow'}</button>
          </div>
        </div>

        {/* token follows */}
        <div className="bg-card rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-sm font-semibold">Followed Tokens</div>
            <button className="text-[#3B82F6] text-xs">See All ›</button>
          </div>
          <div className="space-y-2">
            {portfolio?.tokens?.slice(0, 3).map((t) => (
              <div key={t.mint} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src={t.logo} className="w-6 h-6 rounded-full" alt={t.symbol} />
                  <div className="text-sm">{t.symbol}</div>
                </div>
                <div className="text-sm text-textDim">${(t.price ?? 0).toFixed(2)}</div>
              </div>
            ))}
            {!portfolio?.tokens?.length && (
              <div className="text-xs text-textDim text-center py-2">You haven’t followed any tokens yet.</div>
            )}
          </div>
        </div>

        {/* recent activity: replaced with dynamic/empty state until backend provides activity feed */}
        <div className="bg-card rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <div className="text-sm font-semibold">Recent Activity</div>
            <button className="text-[#3B82F6] text-xs">View More ›</button>
          </div>
          <div className="text-xs text-textDim">No recent activity available.</div>
        </div>
        {/* Edit modal */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-neutral card p-4 w-96">
              <h3 className="font-bold mb-2">Edit Profile</h3>
              <label className="label">
                <span className="label-text">Display name</span>
              </label>
              <input className="input w-full mb-2" value={editData.display_name} onChange={(e) => setEditData({...editData, display_name: e.target.value})} />
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input className="input w-full mb-2" value={editData.username} onChange={(e) => setEditData({...editData, username: e.target.value})} />
              <label className="label">
                <span className="label-text">Avatar (upload)</span>
              </label>
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      setEditData(prev => ({ ...prev, avatar_url: String(reader.result) }));
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                {editData.avatar_url && (
                  <img src={editData.avatar_url} alt="preview" className="w-12 h-12 rounded-full object-cover" />
                )}
              </div>
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea className="textarea w-full mb-2" value={editData.bio} onChange={(e) => setEditData({...editData, bio: e.target.value})} />

              <div className="flex justify-end gap-2">
                <button className="btn" onClick={() => setEditing(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={saveProfile}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
