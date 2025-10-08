import { useEffect, useState } from 'react';

export default function TelegramWebApp() {
  const [initData, setInitData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(undefined);

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

  const createWallet = async () => {
    setStatus('creating');
    try {
      const res = await fetch('/wallet/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ telegramId: initData?.user?.id }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'create failed');
      setStatus('wallet-created');
      setWallet(j.wallet);
    } catch (e) {
      setStatus('error:' + (e.message || e));
    }
  };

  const getBalance = async () => {
    setStatus('fetching-balance');
    try {
      const id = initData?.user?.id;
      const res = await fetch(`/wallet/balance/${id}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'balance failed');
      setStatus('balance-fetched');
      setBalance(j.balance);
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

      <div className="mt-4 space-x-2">
        <button className="btn btn-primary" onClick={verify}>Verify initData</button>
        <button className="btn btn-secondary" onClick={createWallet}>Create Wallet</button>
        <button className="btn btn-ghost" onClick={getBalance}>Get Balance</button>
        <span className="ml-3">{status}</span>
      </div>

      {wallet && (
        <div className="mt-4 bg-gray-900 p-3 rounded">
          <div>Public Key: {wallet.publicKey}</div>
        </div>
      )}

      {typeof balance !== 'undefined' && (
        <div className="mt-4 bg-gray-900 p-3 rounded">Balance: {balance} SOL</div>
      )}
    </div>
  );
}
