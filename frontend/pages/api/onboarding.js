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

  // Generate wallet (createWallet is async now)
  const wallet = await createWallet();

    // Get Telegram ID from session or request (replace with your logic)
    // Avoid using a string placeholder like 'demo-user' which will fail if
    // the DB column is a bigint. Only pass telegram_id when it's a valid integer.
    let telegramIdRaw = req.cookies?.telegramId || req.body?.telegramId || null;
    let telegramId = null;
    if (telegramIdRaw !== null && telegramIdRaw !== undefined) {
      const parsed = Number(telegramIdRaw);
      if (!Number.isNaN(parsed) && Number.isInteger(parsed)) {
        telegramId = parsed;
      }
    }

    // Store wallet and hashed password in Supabase (telegramId may be null)
    await upsertUserWallet(telegramId, wallet, hashedPassword);

    res.status(200).json({ publicKey: wallet.publicKey });
  } catch (e) {
    // Provide friendlier errors for common misconfigurations
    if (e.message && e.message.includes('RPC_URL')) {
      return res.status(500).json({ error: 'Server RPC_URL is missing or invalid. Set RPC_URL (or NEXT_PUBLIC_RPC_URL) to a valid http(s) Solana RPC endpoint.' });
    }
    res.status(500).json({ error: e.message || 'Failed to create account.' });
  }
}
