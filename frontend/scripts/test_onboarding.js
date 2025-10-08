const fetch = require('node-fetch'); // Node 18+ has global fetch; if your Node doesn't, run: npm install node-fetch
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const PASSWORD = process.env.PASSWORD || 'TestPass123!';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

function looksLikeBase58(s) {
  if (!s || typeof s !== 'string') return false;
  // Basic base58 charset (no 0, O, I, l)
  const re = /^[1-9A-HJ-NP-Za-km-z]+$/;
  return re.test(s) && s.length >= 32 && s.length <= 64;
}

async function querySupabaseProfile(walletPubkey) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('SUPABASE_URL or SUPABASE_KEY not set — skipping Supabase profile check');
    return null;
  }
  // Use the Supabase REST API to query profiles where wallet_pubkey=eq.<value>
  const url = `${SUPABASE_URL}/rest/v1/profiles?select=wallet_pubkey,password_hash&wallet_pubkey=eq.${encodeURIComponent(walletPubkey)}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Supabase REST query failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data;
}

async function testOnboarding() {
  const url = `${BACKEND_URL}/api/onboarding`;
  console.log('POST', url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: PASSWORD }),
    });
    const text = await res.text();
    let body;
    try { body = JSON.parse(text); } catch (e) { body = text; }
    console.log('HTTP', res.status);
    console.log('Response body:', body);
    if (!res.ok) {
      console.error('Onboarding failed; body above contains error details.');
      return;
    }

    // Validate shape: expect { publicKey: string }
    if (!body || !body.publicKey) {
      console.error('Onboarding response missing publicKey');
      return;
    }
    if (!looksLikeBase58(body.publicKey)) {
      console.error('Returned publicKey does not look like base58:', body.publicKey);
      return;
    }
    console.log('Returned publicKey looks valid:', body.publicKey);

    // If Supabase configured, verify profile row exists and password_hash is set
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const rows = await querySupabaseProfile(body.publicKey);
        if (!rows || rows.length === 0) {
          console.error('No profile row found in Supabase for wallet_pubkey:', body.publicKey);
          return;
        }
        // Check password_hash not null
        const row = rows[0];
        if (!row.password_hash) {
          console.error('Profile found but password_hash is null/empty — expected hashed password');
          return;
        }
        console.log('Supabase profile check OK: password_hash present');
      } catch (err) {
        console.error('Error querying Supabase:', err.message || err);
      }
    } else {
      console.log('Supabase not configured; skipping DB verification');
    }

    console.log('Onboarding test passed');
  } catch (err) {
    console.error('Request failed:', err);
  }
}

testOnboarding();