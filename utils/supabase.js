import { createClient } from "@supabase/supabase-js";

// Use the project's Supabase URL constant; keep the key in env for security
const SUPABASE_URL = 'https://wjyqpjssxoxwmlyldgpf.supabase.co';

let _supabase = null;
function getSupabaseClient() {
  if (_supabase) return _supabase;
  const url = SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  // Treat obvious dummy keys as missing during local development so tests and
  // onboarding don't accidentally hit the real Supabase API when a short
  // placeholder value is set (for example: "testing_dummy_key"). Supabase
  // keys are JWT-like and are typically long; we consider keys shorter than
  // 30 chars to be invalid for local dev purposes.
  const looksLikeDummyKey = key && key.length < 30;
  if (!url || !key || (process.env.NODE_ENV !== 'production' && looksLikeDummyKey)) {
    // Development fallback: return a harmless no-op client so local dev and
    // smoke tests can run without connecting to a real Supabase project.
    // All methods return resolved promises with null data and no error.
    if (!key) {
      console.warn('SUPABASE_KEY missing — returning noop Supabase client for local development.');
    } else {
      console.warn('SUPABASE_KEY looks like a short/dummy value — returning noop Supabase client for local development.');
    }
    const noop = {
      from: () => ({
        upsert: () => ({
          select: async () => ({ data: null, error: null }),
        }),
        select: async () => ({ data: null, error: null }),
        eq: function () { return this; },
        single: async () => ({ data: null, error: null }),
      }),
      rpc: async () => ({ data: null, error: null }),
      auth: {},
      _getClient: () => null,
    };
    _supabase = noop;
    return _supabase;
  }
  _supabase = createClient(url, key);
  return _supabase;
}

// Export a lazy supabase instance compatible with imports like: import { supabase } from '../utils/supabase.js'
export const supabase = {
  from: (...args) => getSupabaseClient().from(...args),
  rpc: (...args) => getSupabaseClient().rpc(...args),
  auth: getSupabaseClient().auth,
  // Provide a method to access the raw client if needed
  _getClient: () => getSupabaseClient(),
};

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
