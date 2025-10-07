import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { spawn } from "child_process";
import { createClient } from "@supabase/supabase-js";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// ----- Supabase -----
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ----- Solana -----
const connection = new Connection(process.env.RPC_URL, "confirmed");

// ----- Telegram Bot -----
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// ----- AI Module (Python subprocess) -----
if (process.env.AI_ENABLED === "true") {
  const aiProcess = spawn("python3", ["ai/monitor.py"]);
  aiProcess.stdout.on("data", (data) => console.log("[AI]", data.toString()));
  aiProcess.stderr.on("data", (data) => console.error("[AI Error]", data.toString()));
  aiProcess.on("close", (code) => console.log(`AI Monitor exited with code ${code}`));
}

// ----- Telegram Bot Commands -----
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `👻 Welcome to DopeWallet!\n\nTap below to open your wallet.`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Open Wallet",
              web_app: { url: process.env.FRONTEND_URL || "https://dopewallet.app" },
            },
          ],
        ],
      },
    }
  );
});

// Example: check SOL balance command
bot.onText(/\/balance/, async (msg) => {
  const chatId = msg.chat.id;
  const { data, error } = await supabase
    .from("profiles")
    .select("wallet_pubkey")
    .eq("telegram_id", chatId)
    .single();

  if (error || !data) return bot.sendMessage(chatId, "No wallet found. Open your DopeWallet first.");
  const balance = await connection.getBalance(data.wallet_pubkey);
  bot.sendMessage(chatId, `💰 Balance: ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL`);
});

// Example: AI insights alert test
app.get("/ai/signal", async (req, res) => {
  const { data, error } = await supabase.from("ai_predictions").select("*").order("score", { ascending: false }).limit(5);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ----- API Routes -----
import walletRoutes from "./routes/wallet.js";
import swapRoutes from "./routes/swap.js";
import profileRoutes from "./routes/profile.js";
import aiRoutes from "./routes/ai.js";

app.use("/wallet", walletRoutes);
app.use("/swap", swapRoutes);
app.use("/profile", profileRoutes);
app.use("/ai", aiRoutes);

// Root
app.get("/", (req, res) => res.send("🚀 DopeWallet backend is running"));

// Start Server
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));
