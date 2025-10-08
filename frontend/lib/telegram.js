export function getTelegramUserId() {
  try {
    // @ts-ignore
    const tg = window?.Telegram?.WebApp;
    return tg?.initDataUnsafe?.user?.id ?? null;
  } catch { return null; }
}
export function readyTelegram() {
  try { // @ts-ignore
    const tg = window?.Telegram?.WebApp; tg?.ready?.(); tg?.expand?.();
  } catch {}
}
