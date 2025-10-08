import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Treat short/dummy keys as missing in development to avoid accidental
// network calls. Supabase keys are long; consider keys shorter than 30 chars
// to be invalid for local dev purposes.
const looksLikeDummyKey = SUPABASE_KEY && SUPABASE_KEY.length < 30;
let client;
let isNoop = false;
if (!SUPABASE_URL || !SUPABASE_KEY || (process.env.NODE_ENV !== 'production' && looksLikeDummyKey)) {
  console.warn('frontend/utils/supabase: SUPABASE_URL or SUPABASE_KEY missing or looks dummy — using noop client for local development');
  client = {
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
  isNoop = true;
} else {
  client = createClient(SUPABASE_URL, SUPABASE_KEY);
}

export default client;

export const upsertProfile = async (telegramId) => {
  if (!telegramId) throw new Error('telegramId required');
  if (isNoop) {
    // No-op in local dev
    return { telegram_id: telegramId, updated_at: new Date().toISOString() };
  }
  const payload = { telegram_id: telegramId, updated_at: new Date().toISOString() };
  const { data, error } = await client.from('profiles').upsert(payload).select();
  if (error) throw new Error(error.message);
  return data;
};
