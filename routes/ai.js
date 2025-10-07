import express from "express";
import { supabase } from "../utils/supabase.js";
import { spawn } from "child_process";
import TelegramBot from "node-telegram-bot-api";

const router = express.Router();
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

/**
 * GET /ai/predictions
 * Get top momentum tokens from the AI model
 */
router.get("/predictions", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("ai_predictions")
      .select("*")
      .order("score", { ascending: false })
      .limit(10);
    if (error) throw new Error(error.message);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /ai/refresh
 * Force AI module to run prediction cycle manually
 */
router.post("/refresh", async (req, res) => {
  try {
    const python = spawn("python3", ["ai/monitor.py", "--run-once"]);
    python.stdout.on("data", (data) => console.log("[AI]", data.toString()));
    python.stderr.on("data", (data) => console.error("[AI Error]", data.toString()));
    python.on("close", (code) => console.log(`AI monitor exited ${code}`));
    res.json({ success: true, message: "AI refresh triggered." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /ai/alert
 * Sends alerts to Telegram users for trending tokens
 */
router.post("/alert", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("ai_predictions")
      .select("*")
      .order("score", { ascending: false })
      .limit(5);
    if (error) throw new Error(error.message);

    const users = await supabase
      .from("profiles")
      .select("telegram_id")
      .neq("telegram_id", null);

    for (const token of data) {
      const message = `⚡️ *AI Alert: ${token.symbol}*\nPossible early run-up detected.\nConfidence: ${(token.score * 100).toFixed(1)}%\n\nDYOR — not financial advice.`;
      for (const user of users.data) {
        await bot.sendMessage(user.telegram_id, message, { parse_mode: "Markdown" });
      }
    }

    res.json({ success: true, message: "AI alerts sent." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
