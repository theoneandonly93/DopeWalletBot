import Link from "next/link";
import { useRouter } from "next/router";

export default function BottomNav(){
  const r = useRouter();
  const tab = r.pathname.startsWith("/swap")
    ? "swap"
    : r.pathname.startsWith("/earn")
    ? "earn"
    : r.pathname.startsWith("/profile")
    ? "profile"
    : r.pathname.startsWith("/browser")
    ? "browser"
    : "wallet";
  const Item = ({href,label,active}) => (
    <Link href={href} className={`flex flex-col items-center text-xs ${active?"text-white":"text-textDim"}`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${active?"bg-accent/20":"bg-[#171717]"}`}>{label==="Wallet"?"🔷":label==="Swap"?"🔁":label==="Profile"?"🪪":label==="Browser"?"🧭":"%"}</div>
      <div className="mt-1">{label}</div>
    </Link>
  );
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-bg border-t border-line py-2 flex justify-around">
      <Item href="/" label="Wallet" active={tab==="wallet"} />
      <Item href="/swap" label="Swap" active={tab==="swap"} />
      <Item href="/profile" label="Profile" active={tab==="profile"} />
      <Item href="/browser" label="Browser" active={tab==="browser"} />
    </nav>
  );
}
