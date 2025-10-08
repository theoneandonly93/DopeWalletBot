import bs58 from "bs58";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { encryptJson, decryptJson } from "./crypto";

const VAULT_KEY = "DW_VAULT_V1";

export async function createWallet() {
  const mnemonic = bip39.generateMnemonic(128);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const path = "m/44'/501'/0'/0'";
  const { key } = derivePath(path, seed.toString("hex"));
  const kp = Keypair.fromSeed(key);
  return {
    pubkey: kp.publicKey.toBase58(),
    pkBase58: bs58.encode(kp.secretKey),
    mnemonic,
    createdAt: Date.now(),
  };
}

export function keypairFromBase58(pkBase58) {
  return Keypair.fromSecretKey(bs58.decode(pkBase58));
}

export async function saveVault(password, vault) {
  const blob = await encryptJson(password, vault);
  sessionStorage.setItem(VAULT_KEY, blob);
}

export async function loadVault(password) {
  const blob = sessionStorage.getItem(VAULT_KEY);
  if (!blob) return null;
  return await decryptJson(password, blob);
}

export function getPublicKeyUnsafe() {
  const blob = sessionStorage.getItem(VAULT_KEY);
  if (!blob) return null;
  try { return null; } catch { return null; }
}
