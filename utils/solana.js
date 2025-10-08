import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import nacl from "tweetnacl";
import crypto from 'crypto';

// Lazily created connection. Don't create at module import time because
// that will throw if RPC_URL is not set or invalid (causes server-side 500s
// during import). Instead create when needed with a helpful error message.
let _connection = null;
function getRpcUrl() {
  const url = process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL;
  return url;
}

function getConnection() {
  if (_connection) return _connection;
  const rpcUrl = getRpcUrl();
  if (!rpcUrl || !(rpcUrl.startsWith('http://') || rpcUrl.startsWith('https://'))) {
    throw new TypeError('RPC_URL is missing or invalid. Set process.env.RPC_URL to a valid http(s) RPC endpoint.');
  }
  _connection = new Connection(rpcUrl, 'confirmed');
  return _connection;
}

// Export getConnection so routes can lazily obtain a connection when needed
export { getConnection };

/**
 * Generate a new wallet (mnemonic + keypair)
 */
export const createWallet = async () => {
  // Try to dynamically import bip39. If it fails (network, bundler, CJS/Esm
  // mismatch), fall back to generating a secure random seed so wallet
  // creation still works without a mnemonic. Returning a null mnemonic
  // signals the fallback to callers.
  try {
    const bip39 = await import('bip39');
    const { mnemonicToSeedSync, generateMnemonic } = bip39;
    const mnemonic = generateMnemonic();
    const seed = mnemonicToSeedSync(mnemonic).slice(0, 32);
    const keypair = Keypair.fromSeed(seed);
    return {
      mnemonic,
      privateKey: bs58.encode(keypair.secretKey),
      publicKey: keypair.publicKey.toBase58(),
    };
  } catch (err) {
    // If bip39 import or usage fails, produce a secure random seed and
    // derive a Solana keypair from it. This avoids hard failures when the
    // environment can't load bip39 (e.g., bundler tries to download it).
    // Note: there is no mnemonic in this fallback; callers should warn
    // users to back up the private key.
    console.warn('bip39 import failed; falling back to random seed wallet:', err && err.message);
    const seed = crypto.randomBytes(32);
    const keypair = Keypair.fromSeed(seed);
    return {
      mnemonic: null,
      privateKey: bs58.encode(keypair.secretKey),
      publicKey: keypair.publicKey.toBase58(),
    };
  }
};

/**
 * Get SOL balance
 */
export const getBalance = async (pubkey) => {
  const connection = getConnection();
  const balance = await connection.getBalance(new PublicKey(pubkey));
  return balance / LAMPORTS_PER_SOL;
};

/**
 * Send SOL between wallets
 */
export const sendSol = async (fromSecret, toAddress, amountSol) => {
  const connection = getConnection();
  const sender = Keypair.fromSecretKey(bs58.decode(fromSecret));
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: new PublicKey(toAddress),
      lamports: amountSol * LAMPORTS_PER_SOL,
    })
  );
  const sig = await sendAndConfirmTransaction(connection, transaction, [sender]);
  return sig;
};
