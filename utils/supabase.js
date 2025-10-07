import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/**
 * Save or update a user's wallet info
 */
export const upsertUserWallet = async (telegramId, wallet, hashedPassword) => {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      telegram_id: telegramId,
      wallet_pubkey: wallet.publicKey,
      password_hash: hashedPassword,
      created_at: new Date().toISOString(),
    })
    .select();
  if (error) throw new Error(error.message);
  return data;
};

/**
 * Get a user's wallet by Telegram ID
 */
export const getUserWallet = async (telegramId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("wallet_pubkey")
    .eq("telegram_id", telegramId)
    .single();
  if (error) throw new Error(error.message);
  return data?.wallet_pubkey;
};
