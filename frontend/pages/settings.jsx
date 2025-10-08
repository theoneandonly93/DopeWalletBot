import Link from 'next/link';
import { useRouter } from 'next/router';
import Icon from '../components/Icon';

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
            <button className="flex items-center justify-between p-3 w-full"><span className="flex items-center gap-3"><Icon name="Cash" size={16} />Notifications</span><span className="text-textDim"><Icon name="ChevronRight" size={16} /></span></button>
            <button className="flex items-center justify-between p-3 w-full"><span className="flex items-center gap-3"><Icon name="Lock" size={16} />Passcode & Face ID</span><span className="text-textDim"><Icon name="ChevronRight" size={16} /></span></button>
            <button className="flex items-center justify-between p-3 w-full"><span className="flex items-center gap-3"><Icon name="Document" size={16} />Language</span><span className="text-textDim">English <Icon name="ChevronRight" size={16} /></span></button>
            <button className="flex items-center justify-between p-3 w-full"><span className="flex items-center gap-3"><Icon name="Cash" size={16} />Default Currency</span><span className="text-textDim">USD <Icon name="ChevronRight" size={16} /></span></button>
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
            <Link href="/backup" className="flex items-center justify-between p-3"><span className="flex items-center gap-3"><Icon name="Lock" size={16} />Backup & Recovery Phrase</span><span className="text-textDim"><Icon name="ChevronRight" size={16} /></span></Link>
            <Link href="/connected-apps" className="flex items-center justify-between p-3"><span className="flex items-center gap-3"><Icon name="Bot" size={16} />Connected Apps</span><span className="text-textDim"><Icon name="ChevronRight" size={16} /></span></Link>
            <Link href="/my-stars" className="flex items-center justify-between p-3"><span className="flex items-center gap-3"><Icon name="Star" size={16} />My Stars</span><span className="text-textDim"><Icon name="ChevronRight" size={16} /></span></Link>
            <Link href="/version" className="flex items-center justify-between p-3"><span className="flex items-center gap-3"><Icon name="Document" size={16} />Version & Network</span><span className="text-textDim"><Icon name="ChevronRight" size={16} /></span></Link>
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
