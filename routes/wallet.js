import express from "express";
import { createWallet, getBalance, sendSol } from "../utils/solana.js";
import { upsertUserWallet, getUserWallet } from "../utils/supabase.js";

const router = express.Router();

/**
 * POST /wallet/create
 * Generates a new wallet for the user
 */
router.post("/create", async (req, res) => {
  try {
    let { telegramId } = req.body;
    if (!telegramId && req.user?.telegramId) telegramId = req.user.telegramId;
    if (!telegramId) return res.status(400).json({ error: "telegramId required" });

    const wallet = await createWallet();
    await upsertUserWallet(telegramId, wallet);

    res.json({
      success: true,
      wallet: {
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /wallet/balance/:telegramId
 * Returns wallet balance for a user
 */
router.get("/balance/:telegramId", async (req, res) => {
  try {
    const { telegramId } = req.params;
    const pubkey = await getUserWallet(telegramId);
    if (!pubkey) return res.status(404).json({ error: "Wallet not found" });
    const balance = await getBalance(pubkey);
    res.json({ publicKey: pubkey, balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /wallet/send
 * Sends SOL to another address
 */
router.post("/send", async (req, res) => {
  try {
    const { privateKey, toAddress, amount } = req.body;
    if (!privateKey || !toAddress || !amount)
      return res.status(400).json({ error: "Missing fields" });

    const sig = await sendSol(privateKey, toAddress, parseFloat(amount));
    res.json({ success: true, signature: sig });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
