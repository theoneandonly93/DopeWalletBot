import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg text-white pb-20">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <button onClick={() => router.back()} className="text-[#3B82F6]">Back</button>
        <h1 className="text-lg font-semibold">Wallet <span className="text-[#3B82F6]">✓</span></h1>
        <div className="w-8" />
      </div>

      <div className="p-4 space-y-6">

        <section>
          <h2 className="text-textDim text-xs font-semibold mb-2">GENERAL SETTINGS</h2>
          <div className="divide-y divide-[#222] rounded-xl overflow-hidden border border-[#222]">
            <button className="flex items-center justify-between p-3 w-full"><span>🔔 Notifications</span><span>›</span></button>
            <button className="flex items-center justify-between p-3 w-full"><span>🔐 Passcode & Face ID</span><span>›</span></button>
            <button className="flex items-center justify-between p-3 w-full"><span>🌐 Language</span><span>English ›</span></button>
            <button className="flex items-center justify-between p-3 w-full"><span>💲 Default Currency</span><span>USD ›</span></button>
          </div>
        </section>

        <section className="border border-[#222] rounded-xl p-4 bg-[#111]">
          <h3 className="text-red-500 text-sm font-semibold mb-1">Never Lose Access to DopeWallet</h3>
          <p className="text-xs text-textDim">
            Back up your Secret Recovery Phrase so you can always access your wallet.
          </p>
          <Link href="/backup" className="text-[#3B82F6] text-sm mt-1 inline-block">Back up</Link>
        </section>

        <section>
          <div className="divide-y divide-[#222] rounded-xl overflow-hidden border border-[#222]">
            <Link href="/backup" className="flex items-center justify-between p-3"><span>🔑 Backup & Recovery Phrase</span><span>›</span></Link>
            <Link href="/connected-apps" className="flex items-center justify-between p-3"><span>📱 Connected Apps</span><span>›</span></Link>
            <Link href="/my-stars" className="flex items-center justify-between p-3"><span>⭐ My Stars</span><span>›</span></Link>
            <Link href="/version" className="flex items-center justify-between p-3"><span>💻 Version & Network</span><span>›</span></Link>
          </div>
        </section>

        <section>
          <div className="divide-y divide-[#222] rounded-xl overflow-hidden border border-[#222]">
            <Link href="/support" className="flex items-center justify-between p-3"><span>💬 Contact Support</span><span>›</span></Link>
            <Link href="/faq" className="flex items-center justify-between p-3"><span>❓ FAQ</span><span>›</span></Link>
            <Link href="/news" className="flex items-center justify-between p-3"><span>📰 Wallet News</span><span>›</span></Link>
          </div>
        </section>

        <button className="w-full py-2 rounded-xl bg-[#1A1A1A] text-red-500 font-semibold">Remove Wallet</button>

        <section className="text-center text-xs text-textDim space-y-1">
          <Link href="/terms" className="block text-[#3B82F6]">Terms of Use</Link>
          <Link href="/privacy" className="block text-[#3B82F6]">Privacy Policy</Link>
          <p className="text-[10px] mt-2 px-6">
            The mini app is supported by DopeWallet Labs. This service is independent and not affiliated with Telegram.
          </p>
        </section>
      </div>
    </div>
  );
}
