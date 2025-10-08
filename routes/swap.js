import express from "express";
import axios from "axios";
import bs58 from "bs58";
import { VersionedTransaction, Keypair } from "@solana/web3.js";
import { getConnection } from "../utils/solana.js";

const router = express.Router();

// Use lazy connection
// const connection = new Connection(process.env.RPC_URL, "confirmed");

/**
 * POST /swap/quote
 * Fetches best quote from Jupiter
 */
router.post("/quote", async (req, res) => {
  try {
    const { inputMint, outputMint, amount } = req.body;
    if (!inputMint || !outputMint || !amount)
      return res.status(400).json({ error: "Missing fields" });

    const quoteRes = await axios.get(`${process.env.JUPITER_API_URL}/quote`, {
      params: {
        inputMint,
        outputMint,
        amount,
        slippageBps: 50,
        onlyDirectRoutes: false,
      },
    });

    res.json(quoteRes.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /swap/execute
 * Executes swap using Jupiter
 */
router.post("/execute", async (req, res) => {
  try {
    const { userPrivateKey, route } = req.body;
    if (!userPrivateKey || !route)
      return res.status(400).json({ error: "Missing fields" });

    const swapRes = await axios.post(`${process.env.JUPITER_API_URL}/swap`, {
      swapRequest: {
        userPublicKey: route.userPublicKey,
        route,
      },
    });

    const swapTransactionBuf = Buffer.from(swapRes.data.swapTransaction, "base64");
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    const secretKey = bs58.decode(userPrivateKey);
    const keypair = Keypair.fromSecretKey(secretKey);
    transaction.sign([keypair]);
    const rawTransaction = transaction.serialize();
  const connection = getConnection();
  const txid = await connection.sendRawTransaction(rawTransaction, { skipPreflight: true });
  await connection.confirmTransaction(txid, "confirmed");

    res.json({ success: true, signature: txid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
