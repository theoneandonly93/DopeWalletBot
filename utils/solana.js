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
import { mnemonicToSeedSync, generateMnemonic } from "bip39";
import nacl from "tweetnacl";

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
export const createWallet = () => {
  const mnemonic = generateMnemonic();
  const seed = mnemonicToSeedSync(mnemonic).slice(0, 32);
  const keypair = Keypair.fromSeed(seed);
  return {
    mnemonic,
    privateKey: bs58.encode(keypair.secretKey),
    publicKey: keypair.publicKey.toBase58(),
  };
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
