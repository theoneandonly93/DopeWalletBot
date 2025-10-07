import { createWallet } from '../../../utils/solana';
import { upsertUserWallet } from '../../../utils/supabase';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate wallet
    const wallet = createWallet();

    // Get Telegram ID from session or request (replace with your logic)
    const telegramId = req.cookies.telegramId || req.body.telegramId || 'demo-user';

    // Store wallet and hashed password in Supabase
    await upsertUserWallet(telegramId, wallet, hashedPassword);

    res.status(200).json({ publicKey: wallet.publicKey });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Failed to create account.' });
  }
}
