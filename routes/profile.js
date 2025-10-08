import express from "express";
import { supabase } from "../utils/supabase.js";

const router = express.Router();

/**
 * POST /profile/create
 * Create or update a user's profile
 */
router.post("/create", async (req, res) => {
  try {
    const { telegramId, username, displayName, avatarUrl, bio } = req.body;
    if (!telegramId || !username)
      return res.status(400).json({ error: "telegramId and username required" });

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        telegram_id: telegramId,
        username,
        display_name: displayName || username,
        avatar_url: avatarUrl || null,
        bio: bio || "",
        private: false,
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) throw new Error(error.message);
    res.json({ success: true, profile: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /profile/:username
 * View a user's public profile
 */
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { data, error } = await supabase
      .from("profiles")
      .select("username, display_name, wallet_pubkey, avatar_url, bio, private, followers, following")
      .eq("username", username)
      .single();
    if (error) throw new Error(error.message);
    if (data.private) return res.status(403).json({ error: "Profile is private" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /profile/follow
 * Follow or unfollow another wallet user
 */
router.post("/follow", async (req, res) => {
  try {
    const { follower, following } = req.body;
    if (!follower || !following)
      return res.status(400).json({ error: "Missing follower/following" });

    const existing = await supabase
      .from("follows")
      .select("*")
      .eq("follower", follower)
      .eq("following", following)
      .maybeSingle();

    if (existing.data) {
      await supabase.from("follows").delete().eq("follower", follower).eq("following", following);
      return res.json({ success: true, action: "unfollowed" });
    } else {
      await supabase.from("follows").insert([{ follower, following }]);
      return res.json({ success: true, action: "followed" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /profile/privacy
 * Toggle privacy on/off
 */
router.post("/privacy", async (req, res) => {
  try {
    const { telegramId, privateMode } = req.body;
    const { error } = await supabase
      .from("profiles")
      .update({ private: privateMode })
      .eq("telegram_id", telegramId);
    if (error) throw new Error(error.message);
    res.json({ success: true, privateMode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /profile/by_telegram/:telegramId
 * Fetch profile by Telegram ID (non-mutating)
 */
router.get("/by_telegram/:telegramId", async (req, res) => {
  try {
    const { telegramId } = req.params;
    const { data, error } = await supabase
      .from("profiles")
      .select("username, display_name, wallet_pubkey, avatar_url, bio, private, followers, following")
      .eq("telegram_id", telegramId)
      .single();
    if (error) throw new Error(error.message);
    if (data.private) return res.status(403).json({ error: "Profile is private" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
