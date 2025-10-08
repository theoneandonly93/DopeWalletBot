const fetch = require('node-fetch'); // Node 18+ has global fetch; if your Node doesn't, run: npm install node-fetch
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const PASSWORD = process.env.PASSWORD || 'TestPass123!';

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
    if (res.ok) {
      console.log('Onboarding succeeded. Verify profiles table in Supabase for a new row and non-null password_hash.');
    } else {
      console.error('Onboarding failed; body above contains error details.');
    }
  } catch (err) {
    console.error('Request failed:', err);
  }
}

testOnboarding();