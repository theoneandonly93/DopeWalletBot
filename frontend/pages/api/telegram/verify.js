import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { initData } = req.body;
  if (!initData) return res.status(400).json({ error: 'initData required' });

  // initData may be a string or object depending on client
  // If object, reconstruct the check_string from fields except 'hash'
  let fields = {};
  if (typeof initData === 'string') {
    // initData is of form "key=value&key2=value2"
    initData.split('&').forEach(pair => {
      const [k, v] = pair.split('=');
      fields[k] = decodeURIComponent(v || '');
    });
  } else if (typeof initData === 'object') {
    fields = { ...initData };
  }

  const hash = fields.hash || fields['auth_date'] ? fields.hash : null;
  if (!hash) return res.status(400).json({ error: 'hash missing in initData' });

  // Build check string: sort by key, exclude hash
  const checkItems = Object.keys(fields).filter(k => k !== 'hash').sort().map(k => `${k}=${fields[k]}`);
  const checkString = checkItems.join('\n');

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return res.status(500).json({ error: 'Server missing TELEGRAM_BOT_TOKEN' });

  const secretKey = crypto.createHash('sha256').update(botToken, 'utf8').digest();
  const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');

  if (hmac !== fields.hash) {
    return res.status(401).json({ error: 'Invalid initData signature' });
  }

  // Verified. Return the user id and a simple session token (optionally create server session)
  const user = fields.user || null;
  return res.json({ ok: true, user, message: 'initData verified' });
}
