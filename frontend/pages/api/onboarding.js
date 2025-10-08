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

    // Dynamically import createWallet at runtime to avoid bundling bip39
    // (when Next.js compiles frontend code it can attempt to include server-only
    // modules if they're imported at module scope). Importing here ensures
    // bip39 and other node-only libs are only required on the server at runtime.
    const { createWallet } = await import('../../../utils/solana.js');
    // Generate wallet (createWallet is async)
    const wallet = await createWallet();

    // Dynamically import the Supabase helper. In dev environments where
    // SUPABASE_* is not configured we prefer to continue (so onboarding can
    // be tested without a DB). If the import or the helper throws because of
    // missing env, we'll skip the DB upsert and return the wallet to the client.
    let upsertFn = null;
    try {
      const mod = await import('../../../utils/supabase.js');
      upsertFn = mod.upsertUserWallet;
    } catch (err) {
      console.warn('supabase helper unavailable, skipping DB upsert during onboarding:', err && err.message);
    }

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
    if (upsertFn) {
      await upsertFn(telegramId, wallet, hashedPassword);
    } else {
      // No-op in dev when Supabase isn't configured. Caller will still get
      // the wallet details so onboarding flow can be exercised.
      console.info('Skipping Supabase upsert: upsertUserWallet not available');
    }

    res.status(200).json({ publicKey: wallet.publicKey });
  } catch (e) {
    // Provide friendlier errors for common misconfigurations
    if (e.message && e.message.includes('RPC_URL')) {
      return res.status(500).json({ error: 'Server RPC_URL is missing or invalid. Set RPC_URL (or NEXT_PUBLIC_RPC_URL) to a valid http(s) Solana RPC endpoint.' });
    }
    res.status(500).json({ error: e.message || 'Failed to create account.' });
  }
}
