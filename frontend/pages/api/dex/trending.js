//
// Uses global `fetch` (available in Next.js) — do not import node-fetch to avoid duplicate global definitions.

// DexScreener proxy for trending tokens (single clean implementation)
// - Uses global fetch (Next.js runtime)
// - Supports query params: ?limit, ?sort (volume|gainers), ?chain
// - Filters to requested chain (default: solana)
// - Enriches token metadata from Solana tokenlist when available
// - In-memory caching to reduce outbound requests during dev

const DEX_API = process.env.DEX_API_URL || 'https://api.dexscreener.com/latest/dex';
const SOL_TOKENLIST = 'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json';

const CACHE = { responses: {}, tokenlist: null, tokenlistTs: 0, logoMap: null };
const CG_CACHE = { list: null, listTs: 0, prices: {}, pricesTs: {} };
const COINGECKO_LIST_TTL = 1000 * 60 * 60; // 1h
const COINGECKO_PRICE_TTL = 1000 * 30; // 30s

async function loadCoinGeckoList() {
  const now = Date.now();
  if (CG_CACHE.list && (now - CG_CACHE.listTs) < COINGECKO_LIST_TTL) return CG_CACHE.list;
  try {
    const r = await fetch('https://api.coingecko.com/api/v3/coins/list');
    if (!r.ok) return null;
    const j = await r.json();
    // create a map by symbol uppercase -> id (first match wins)
    const map = {};
    for (const c of j || []) {
      try {
        const sym = String(c.symbol || '').toUpperCase();
        if (!map[sym]) map[sym] = c.id;
      } catch (e) {}
    }
    CG_CACHE.list = map;
    CG_CACHE.listTs = Date.now();
    return map;
  } catch (e) { return null; }
}

async function getPriceFromCoinGecko(symbol, contractAddress) {
  try {
    const now = Date.now();
    const key = (contractAddress || symbol || '').toLowerCase();
    if (CG_CACHE.prices[key] && (now - (CG_CACHE.pricesTs[key] || 0)) < COINGECKO_PRICE_TTL) return CG_CACHE.prices[key];

    // Attempt contract lookup for solana if contractAddress provided
    if (contractAddress) {
      try {
        const r = await fetch(`https://api.coingecko.com/api/v3/coins/solana/contract/${contractAddress}`);
        if (r.ok) {
          const j = await r.json();
          const usd = j.market_data?.current_price?.usd ?? null;
          if (usd !== null) {
            CG_CACHE.prices[key] = usd;
            CG_CACHE.pricesTs[key] = Date.now();
            return usd;
          }
        }
      } catch (e) {}
    }

    // Fallback: symbol -> id -> simple/price
    const list = await loadCoinGeckoList();
    if (list && symbol) {
      const id = list[String(symbol).toUpperCase()];
      if (id) {
        const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=usd`);
        if (r.ok) {
          const j = await r.json();
          const usd = j[id]?.usd ?? null;
          if (usd !== null) {
            CG_CACHE.prices[key] = usd;
            CG_CACHE.pricesTs[key] = Date.now();
            return usd;
          }
        }
      }
    }
  } catch (e) { /* ignore */ }
  return null;
}

async function loadTokenList() {
  const now = Date.now();
  if (CACHE.tokenlist && (now - CACHE.tokenlistTs) < 60_000) return CACHE.tokenlist;
  try {
    const r = await fetch(SOL_TOKENLIST);
    if (!r.ok) return null;
    const j = await r.json();
    const map = {};
    for (const t of (j.tokens || [])) {
      try {
        const key = String(t.address || '').toLowerCase();
        if (key) map[key] = t;
      } catch (e) { /* ignore */ }
    }
    // build logo reverse-lookup map (filename or hash -> token meta)
    const logoMap = {};
    for (const t of (j.tokens || [])) {
      const maybe = t.logoURI || t.extensions?.logoURI || '';
      if (!maybe) continue;
      try {
        const parts = String(maybe).split('/');
        let last = parts[parts.length-1] || '';
        // strip query
        last = last.split('?')[0] || last;
        last = last.toLowerCase();
        if (last) logoMap[last] = t;
      } catch (e) { /* ignore */ }
    }
      CACHE.tokenlist = map;
    CACHE.logoMap = logoMap;
    CACHE.tokenlistTs = Date.now();
    return map;
  } catch (err) {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const { query } = req;
    const limit = Math.min(Number(query.limit) || 100, 100);
    const chain = (query.chain || 'solana').toString().toLowerCase();
    const sort = (query.sort || 'volume').toString().toLowerCase();

    const cacheKey = `${chain}:${sort}:${limit}`;
    const now = Date.now();
    if (CACHE.responses[cacheKey] && (now - CACHE.responses[cacheKey].ts) < 30_000) {
      return res.status(200).json({ data: CACHE.responses[cacheKey].data, cached: true });
    }

    // Try multiple upstream endpoints to be robust against DexScreener endpoint shapes.
    const candidates = [
      `${DEX_API}/${chain}`, // chain-specific (e.g. /latest/dex/solana)
      DEX_API, // global
      'https://api.dexscreener.com/token-boosts/top/v1', // alternative /token-boosts endpoint
    ];

    let body = null;
    let lastStatus = 0;
    for (const url of candidates) {
      try {
        const resp = await fetch(url, { headers: { 'User-Agent': 'DopeWalletBot/1.0' } });
        lastStatus = resp.status;
        if (!resp.ok) {
          // keep trying other candidates
          continue;
        }
        body = await resp.json();
        break;
      } catch (e) {
        lastStatus = 500;
        continue;
      }
    }

    if (!body) return res.status(502).json({ error: 'DexScreener upstream error', status: lastStatus });

    // collect candidate pairs
    let pairs = [];
    if (Array.isArray(body)) pairs = body;
    else if (Array.isArray(body.pairs)) pairs = body.pairs;
    else {
      for (const k of Object.keys(body || {})) {
        if (body[k]?.pairs && Array.isArray(body[k].pairs)) pairs = pairs.concat(body[k].pairs);
      }
    }

    // Filter to requested chain by inspecting various hint fields
    const filtered = (pairs || []).filter(p => {
      const hints = [p.chain, p.chainId, p.chainKey, p.dex?.chain, p.pair?.chain, p.baseToken?.chain, p.quoteToken?.chain]
        .filter(Boolean).map(String).join(' ').toLowerCase();
      return hints.includes(chain);
    });

    // simple sorting
    let sorted = filtered;
    if (sort === 'volume') sorted = filtered.sort((a,b)=> (Number(b.volume) || Number(b.volume_24h) || 0) - (Number(a.volume) || Number(a.volume_24h) || 0));
    else if (sort === 'gainers') sorted = filtered.sort((a,b)=> (Number(b.priceChange) || Number(b.change) || 0) - (Number(a.priceChange) || Number(a.change) || 0));

    const tokenlist = await loadTokenList();

    const normalized = (sorted || []).slice(0, limit).map((it) => {
      const address = it.tokenAddress || it.address || it.pairAddress || it.baseToken?.address || it.quoteToken?.address || it.id || '';
      let logoURI = it.icon || it.logo || it.logoURI || it.tokenIcon || it.baseToken?.icon || it.quoteToken?.icon || '';
      let symbol = it.symbol || it.tokenSymbol || it.token?.symbol || it.baseToken?.symbol || it.quoteToken?.symbol || it.name || '';
      let name = it.name || it.tokenName || it.baseToken?.name || it.quoteToken?.name || '';

      const lookupAddr = String(address || '').toLowerCase();
      if ((!logoURI || !symbol) && tokenlist && lookupAddr && tokenlist[lookupAddr]) {
        const meta = tokenlist[lookupAddr];
        logoURI = logoURI || meta.logoURI || meta.extensions?.logoURI || '';
        symbol = symbol || meta.symbol || meta.name || '';
      }
      // fallback: try logo filename/hash lookup from tokenlist (helps when upstream returns icon hash)
      if ((!symbol || !logoURI) && CACHE.logoMap) {
        try {
          let candidate = logoURI || '';
          // if candidate is short (a hash), use it; otherwise extract filename
          if (candidate && !candidate.startsWith('http')) {
            candidate = String(candidate).toLowerCase();
          } else if (candidate.startsWith('http')) {
            const parts = String(candidate).split('/');
            candidate = (parts[parts.length-1] || '').split('?')[0].toLowerCase();
          }
          if (candidate && CACHE.logoMap[candidate]) {
            const m = CACHE.logoMap[candidate];
            logoURI = logoURI || m.logoURI || m.extensions?.logoURI || '';
            symbol = symbol || m.symbol || m.name || '';
          }
        } catch (e) { /* ignore */ }
      }

  const price = Number(it.priceUsd || it.price || it.tokenPrice || it.price_usd || it.baseToken?.price || 0) || 0;
      const change24h = Number(it.priceChange || it.change || it.change_24h || it.price_change_percentage_24h || 0) || 0;
      const volume24h = Number(it.volume || it.volume24h || it.volume_24h || it.quoteVolume || it.liquidity || 0) || 0;

      if (!logoURI && address) logoURI = `https://cdn.dexscreener.com/token-images/${chain}/${address}`;

      // Fallback name/symbol heuristics when upstream lacks them
      const rawDesc = (it.description || it.raw?.description || it.tokenDescription || '') || '';
      const urlName = (it.url || it.raw?.url || '') ? String(it.url || it.raw?.url).split('/').filter(Boolean).pop() : '';

      function guessFromText(text) {
        if (!text) return '';
        // prefer first token-like word
        const cleaned = String(text).replace(/[\n\r]/g, ' ').trim();
        const first = cleaned.split(/\s|_|-|\//).filter(Boolean)[0] || '';
        const alpha = first.replace(/[^A-Za-z0-9]/g, '');
        return alpha.toUpperCase().slice(0, 6);
      }

      const guessedName = name || it.raw?.description || rawDesc || urlName || '';
      const guessedSymbol = symbol || guessFromText(symbol || name || rawDesc || urlName || address) || '';

      return { address, logoURI, symbol: guessedSymbol, name: guessedName, price, change24h, volume24h, raw: it };
    });

    CACHE.responses[cacheKey] = { ts: Date.now(), data: normalized };
    return res.status(200).json({ data: normalized, cached: false });
  } catch (err) {
    console.error('trending proxy error', err);
    return res.status(500).json({ error: String(err) });
  }
}
//

