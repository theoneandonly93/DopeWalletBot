import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import cookieParser from 'cookie-parser';
import { verifyToken } from './utils/auth.js';
import { spawn } from "child_process";
import { createClient } from "@supabase/supabase-js";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// simple middleware to populate req.user from jwt cookie
app.use((req, res, next) => {
  const token = req.cookies?.session || null;
  if (token) {
    const user = verifyToken(token);
    if (user) req.user = user;
  }
  next();
});

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
    // Instantiate the bot directly. Skip the network validation step so the
    // server won't hang or produce confusing errors during startup when
    // running locally. If the token is invalid Telegram will reject requests
    // and the bot will log errors, but the server keeps running.
    try {
      bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
      console.log('Telegram bot started (polling).');

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

      // Handle polling errors from the Telegram library. If we receive an
      // Unauthorized (401) error repeatedly it usually means the token is
      // invalid; stop polling to avoid continuous error spam.
      bot.on('polling_error', (err) => {
        try {
          // The library may provide an error object or JSON string
          const code = err?.response?.body?.error_code || err?.code || (err?.response && err.response.status);
          console.error('Telegram polling_error', JSON.stringify(err?.response?.body || err || { message: err?.message }));
          if (code === 401 || code === 'ETELEGRAM' || (err && /401|Unauthorized/i.test(String(err)))) {
            console.error('Telegram polling received 401 Unauthorized — stopping polling to avoid spam.');
            try { bot.stopPolling(); } catch (stopErr) { console.error('Failed to stop polling:', stopErr); }
          }
        } catch (e) {
          console.error('Error handling polling_error:', e);
        }
      });
    } catch (e) {
      console.error('Failed to instantiate Telegram bot (silent):', e.message || e);
      bot = undefined;
    }
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
// ----- Telegram Bot Commands -----
// Handlers are registered when the bot is created above. If the bot
// wasn't started (missing/invalid token), avoid calling methods on
// an undefined `bot` to prevent runtime TypeErrors.
if (bot) {
  // No-op here because handlers are already registered in the startup
  // block where the bot is instantiated. This guard ensures any
  // accidental double-registration or late requires won't crash.
} else {
  console.log('Telegram bot not initialized; skipping global command bindings.');
}

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
import telegramRoutes from "./routes/telegram.js";

app.use("/wallet", walletRoutes);
app.use("/swap", swapRoutes);
app.use("/profile", profileRoutes);
app.use("/ai", aiRoutes);
app.use("/telegram", telegramRoutes);

// Root
app.get("/", (req, res) => res.send("🚀 DopeWallet backend is running"));

// Start Server
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));
