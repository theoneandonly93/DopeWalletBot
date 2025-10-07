import { useRouter } from "next/router";

export default function Navigation({ active }) {
  const router = useRouter();

  const tabs = [
    { name: "home", icon: "🏠", route: "/" },
    { name: "swap", icon: "💱", route: "/swap" },
    { name: "browser", icon: "🌐", route: "/browser" },
    { name: "profile", icon: "👤", route: "/profile" },
  ];

  return (
    <div className="btm-nav bg-neutral border-t border-gray-700 text-white">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          className={`flex flex-col items-center justify-center text-xs py-2 ${
            active === tab.name ? "text-primary font-semibold" : "text-gray-400"
          }`}
          onClick={() => router.push(tab.route)}
        >
          <span className="text-lg">{tab.icon}</span>
          {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
        </button>
      ))}
    </div>
  );
}
