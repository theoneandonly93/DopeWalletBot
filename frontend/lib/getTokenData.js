// lib/getTokenData.js
// Fetch token metadata by mint/address for Solana (Birdeye) or BSC (Pancake)
export async function getTokenData(address) {
  try {
    const q = String(address || '').trim();
    if (!q) return null;

    const isSolana = !q.startsWith('0x');
    const baseUrl = isSolana
      ? 'https://public-api.birdeye.so/public/token/'
      : 'https://api.pancakeswap.info/api/v2/tokens/';

    const res = await fetch(`${baseUrl}${q}`, {
      headers: isSolana
        ? { 'x-chain': 'solana', accept: 'application/json' }
        : {},
    });

    if (!res.ok) throw new Error('Token not found');
    const data = await res.json();

    return isSolana ? data?.data || null : (data?.data?.[q] || null);
  } catch (err) {
    console.error('Token fetch failed:', err?.message || err);
    return null;
  }
}
