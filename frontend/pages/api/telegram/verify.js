import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL || '', SUPABASE_KEY || '');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { initData } = req.body;
  if (!initData) return res.status(400).json({ error: 'initData required' });

  let fields = {};
  if (typeof initData === 'string') {
    initData.split('&').forEach(pair => {
      const [k, v] = pair.split('=');
      fields[k] = decodeURIComponent(v || '');
    });
  } else if (typeof initData === 'object') {
    fields = { ...initData };
  }

  const hash = fields.hash || null;
  if (!hash) return res.status(400).json({ error: 'hash missing in initData' });

  const checkItems = Object.keys(fields).filter(k => k !== 'hash').sort().map(k => `${k}=${fields[k]}`);
  const checkString = checkItems.join('\n');

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return res.status(500).json({ error: 'Server missing TELEGRAM_BOT_TOKEN' });

  const secretKey = crypto.createHash('sha256').update(botToken, 'utf8').digest();
  const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');

  if (hmac !== fields.hash) {
    return res.status(401).json({ error: 'Invalid initData signature' });
  }

  const user = fields.user || null;
  if (!user || !user.id) return res.status(400).json({ error: 'initData missing user info' });

  // Ensure profiles row exists or upsert; do not overwrite existing fields except telegram_id
  try {
    const payload = { telegram_id: user.id, updated_at: new Date().toISOString() };
    const { data, error } = await supabase.from('profiles').upsert(payload).select();
    if (error) {
      console.warn('Supabase upsert error', error);
    }
  } catch (e) {
    console.warn('Supabase upsert exception', e.message || e);
  }

  // Issue a signed JWT session cookie instead of raw telegramId
  try {
    const { sign } = await import('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'change_this_to_a_strong_secret_replace_in_prod';
    const token = sign({ telegramId: user.id }, secret, { expiresIn: '7d' });
    const maxAge = 60 * 60 * 24 * 7;
    const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
    res.setHeader('Set-Cookie', `session=${token}; Path=/; HttpOnly; ${secureFlag}SameSite=Lax; Max-Age=${maxAge}`);
  } catch (e) {
    console.warn('Failed to sign session token', e.message || e);
  }

  return res.json({ ok: true, user, message: 'initData verified' });
}
