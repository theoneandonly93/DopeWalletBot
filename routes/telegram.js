import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// POST /telegram/menu
// body: { type: 'web_app', text: 'Wallet', url: 'https://...' }
router.post('/menu', async (req, res) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return res.status(500).json({ error: 'Missing TELEGRAM_BOT_TOKEN' });
    const { type = 'web_app', text = 'Wallet', url } = req.body;
    if (!url) return res.status(400).json({ error: 'url required' });

    const payload = {
      menu_button: {
        type,
        text,
        web_app: { url },
      },
    };

    const resp = await fetch(`https://api.telegram.org/bot${token}/setChatMenuButton`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await resp.json();
    if (!json.ok) return res.status(500).json({ error: json });
    res.json({ ok: true, result: json.result });
  } catch (e) {
    res.status(500).json({ error: e.message || e });
  }
});

export default router;
