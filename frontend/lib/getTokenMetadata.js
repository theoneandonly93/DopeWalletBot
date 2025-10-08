// Fetch token metadata by mint/address or by symbol
export async function getTokenMetadata(query) {
  const q = String(query || '').trim();
  if (!q) return null;

  // try Birdeye public tokenlist first (more complete with logos)
  try {
    const res = await fetch('https://public-api.birdeye.so/public/tokenlist');
    if (res.ok) {
      const j = await res.json();
      const tokens = j?.data?.tokens || [];
      const byAddress = tokens.find(t => String(t.address || '').toLowerCase() === q.toLowerCase());
      if (byAddress) return byAddress;
      const bySymbol = tokens.find(t => String(t.symbol || '').toLowerCase() === q.toLowerCase());
      if (bySymbol) return bySymbol;
    }
  } catch (e) {
    // ignore and fallback
    console.warn('Birdeye lookup failed', e?.message || e);
  }

  // fallback: solana token list CDN (static JSON)
  try {
    const res2 = await fetch('https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json');
    if (res2.ok) {
      const j2 = await res2.json();
      const tokens2 = j2?.tokens || [];
      const byAddress2 = tokens2.find(t => String(t.address || '').toLowerCase() === q.toLowerCase());
      if (byAddress2) return byAddress2;
      const bySymbol2 = tokens2.find(t => String(t.symbol || '').toLowerCase() === q.toLowerCase());
      if (bySymbol2) return bySymbol2;
    }
  } catch (e) {
    console.warn('Solana token list lookup failed', e?.message || e);
  }

  return null;
}
