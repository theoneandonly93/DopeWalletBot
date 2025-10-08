const { unifiedSwap } = require('../../../../lib/swapRouter');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { fromToken, toToken, amount, userPubkey, destinationAddress } = req.body;
    const result = await unifiedSwap({ fromToken, toToken, amount, userPubkey, destinationAddress });
    res.status(200).json({ ok: true, result });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
}
