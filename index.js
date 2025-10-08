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
let bot;
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TELEGRAM_TOKEN) {
  console.error('Missing TELEGRAM_BOT_TOKEN in environment. Bot will not start.');
} else {
  try {
    // quick validation call to Telegram API
    const validate = async () => {
      try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getMe`);
        const data = await res.json();
        if (!data.ok) {
          console.error('Telegram token invalid:', data.description);
          return false;
        }
        return true;
      } catch (e) {
        console.error('Failed to validate Telegram token:', e.message || e);
        return false;
      }
    };

    validate().then((ok) => {
      if (!ok) return;
      bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
      console.log('Telegram bot started.');
      // register handlers after bot is created
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
                    text: 'Open Wallet',
                    web_app: { url: process.env.FRONTEND_URL || 'https://dopewallet.app' },
                  },
                ],
              ],
            },
          }
        );
      });

      bot.onText(/\/balance/, async (msg) => {
        const chatId = msg.chat.id;
        const { data, error } = await supabase
          .from('profiles')
          .select('wallet_pubkey')
          .eq('telegram_id', chatId)
          .single();

        if (error || !data) return bot.sendMessage(chatId, 'No wallet found. Open your DopeWallet first.');
        const balance = await connection.getBalance(data.wallet_pubkey);
        bot.sendMessage(chatId, `💰 Balance: ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL`);
      });
    });
  } catch (e) {
    console.error('Failed to start Telegram bot:', e.message || e);
  }
}

// ----- AI Module (Python subprocess) -----
if (process.env.AI_ENABLED === 'true') {
  try {
    const which = spawn('which', ['python3']);
    which.on('close', (code) => {
      if (code !== 0) {
        console.warn('python3 not found in PATH. AI monitor will not start.');
        return;
      }
      const aiProcess = spawn('python3', ['ai/monitor.py']);
      aiProcess.stdout.on('data', (data) => console.log('[AI]', data.toString()));
      aiProcess.stderr.on('data', (data) => console.error('[AI Error]', data.toString()));
      aiProcess.on('close', (code) => console.log(`AI Monitor exited with code ${code}`));
    });
  } catch (e) {
    console.error('Failed to start AI monitor:', e.message || e);
  }
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
