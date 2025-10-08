import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  // Allow build to proceed locally; runtime requests will fail clearly
  console.warn('frontend/utils/supabase: SUPABASE_URL or SUPABASE_KEY missing in env');
}

const supabase = createClient(SUPABASE_URL || '', SUPABASE_KEY || '');

export default supabase;

export const upsertProfile = async (telegramId) => {
  if (!telegramId) throw new Error('telegramId required');
  const payload = { telegram_id: telegramId, updated_at: new Date().toISOString() };
  const { data, error } = await supabase.from('profiles').upsert(payload).select();
  if (error) throw new Error(error.message);
  return data;
};
