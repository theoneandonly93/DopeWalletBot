import { useEffect, useState } from 'react';

export default function TelegramWebApp() {
  const [initData, setInitData] = useState(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    // Telegram injects window.Telegram.WebApp when opened in the Telegram client
    const tg = typeof window !== 'undefined' && window.Telegram?.WebApp;
    if (tg) {
      setInitData(tg.initData);
      // Optionally expand the webapp for better UX
      try { tg.expand(); } catch (e) {}
    } else {
      setStatus('not-in-telegram');
    }
  }, []);

  const verify = async () => {
    setStatus('verifying');
    try {
      const res = await fetch('/api/telegram/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'verify failed');
      setStatus('verified');
    } catch (e) {
      setStatus('error:' + (e.message || e));
    }
  };

  return (
    <div className="p-4 text-white bg-phantom-bg min-h-screen">
      <h1 className="text-2xl font-bold">DopeWallet (Telegram)</h1>
      <p className="text-sm text-gray-300 mt-2">Open this inside Telegram to use as a wallet tab.</p>

      <div className="mt-4">
        <pre className="text-xs bg-gray-900 p-2 rounded">{initData || 'No Telegram WebApp env detected.'}</pre>
      </div>

      <div className="mt-4">
        <button className="btn btn-primary" onClick={verify}>Verify initData</button>
        <span className="ml-3">{status}</span>
      </div>
    </div>
  );
}
