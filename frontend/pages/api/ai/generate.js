import fetch from 'node-fetch';
import rateLimit from 'express-rate-limit';

// Simple in-memory rate limiter wrapper for Next API (works during single-instance dev)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
});

const runLimiter = (req, res) => new Promise((resolve, reject) => {
  limiter(req, res, (err) => err ? reject(err) : resolve());
});

export default async function handler(req, res) {
  await runLimiter(req, res).catch(() => {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  });

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  const key = process.env.OPEN_AI_API_KEY || process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: 'Server missing OPEN_AI_API_KEY' });

  // quick abuse protection: limit prompt length and block suspicious content
  if (prompt.length > 2000) return res.status(400).json({ error: 'Prompt too long' });
  const lower = prompt.toLowerCase();
  if (lower.includes('viagra') || lower.includes('illegal')) return res.status(403).json({ error: 'Content blocked' });

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a concise assistant for the DopeWallet app.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 300,
      }),
    });
    if (!resp.ok) {
      const text = await resp.text();
      return res.status(500).json({ error: 'OpenAI error', detail: text });
    }
    const json = await resp.json();
    const reply = json.choices?.[0]?.message?.content || '';
    return res.json({ ok: true, reply, raw: json });
  } catch (e) {
    return res.status(500).json({ error: e.message || e });
  }
}
