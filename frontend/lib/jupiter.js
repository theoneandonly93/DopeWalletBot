import { Connection } from '@solana/web3.js';
const JUP_API = 'https://quote-api.jup.ag/v6';
const RPC_URL = process.env.NEXT_PUBLIC_RPC || 'https://api.mainnet-beta.solana.com';
const connection = new Connection(RPC_URL);

export async function getQuote(inputMint, outputMint, amount) {
  const url = `${JUP_API}/quote?inputMint=${encodeURIComponent(inputMint)}&outputMint=${encodeURIComponent(outputMint)}&amount=${encodeURIComponent(String(amount))}&slippageBps=50`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch quote');
  return res.json();
}

// Returns the raw swap response from Jupiter (includes swapTransaction base64)
export async function getSwapTransaction(userPubkey, quoteResponse) {
  const res = await fetch(`${JUP_API}/swap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quoteResponse, userPublicKey: userPubkey, wrapAndUnwrapSol: true }),
  });
  if (!res.ok) throw new Error('Failed to fetch swap transaction');
  const data = await res.json();
  if (!data) throw new Error('Invalid swap response');
  return data; // consumer can read data.swapTransaction (base64)
}

// Execute a signed transaction provided as base64 or Buffer
export async function executeSwapFromBase64(swapTransactionBase64) {
  const raw = Buffer.from(swapTransactionBase64, 'base64');
  const sig = await connection.sendRawTransaction(raw, { skipPreflight: false });
  await connection.confirmTransaction(sig, 'confirmed');
  return sig;
  return sig;
}
