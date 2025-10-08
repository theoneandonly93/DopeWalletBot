import { createClient } from "@supabase/supabase-js";

// Use the project's Supabase URL constant; keep the key in env for security
const SUPABASE_URL = 'https://wjyqpjssxoxwmlyldgpf.supabase.co';

let _supabase = null;
function getSupabaseClient() {
  if (_supabase) return _supabase;
  const url = SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_KEY must be set. SUPABASE_URL is set from source, SUPABASE_KEY must be provided as an env var.');
  }
  _supabase = createClient(url, key);
  return _supabase;
}

/**
 * Save or update a user's wallet info
 */
export const upsertUserWallet = async (telegramId, wallet, hashedPassword) => {
  const supabase = getSupabaseClient();
  const payload = {
    wallet_pubkey: wallet.publicKey,
    password_hash: hashedPassword,
    created_at: new Date().toISOString(),
  };
  if (telegramId !== null && telegramId !== undefined) payload.telegram_id = telegramId;

  const { data, error } = await supabase.from('profiles').upsert(payload).select();
  if (error) throw new Error(error.message);
  return data;
};

/**
 ** Get a user's wallet by Telegram ID
 */
export const getUserWallet = async (telegramId) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('wallet_pubkey')
    .eq('telegram_id', telegramId)
    .single();
  if (error) throw new Error(error.message);
  return data?.wallet_pubkey;
};
