import { useRouter } from "next/router";
import { useState } from "react";
import SplashScreen from "./SplashScreen";

export default function Navigation({ active }) {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);
  const [pendingRoute, setPendingRoute] = useState(null);

  const tabs = [
    { name: "home", icon: "🏠", route: "/" },
    { name: "swap", icon: "💱", route: "/swap" },
    { name: "browser", icon: "🌐", route: "/browser" },
    { name: "profile", icon: "👤", route: "/profile" },
  ];

  const handleTabClick = (route) => {
    setPendingRoute(route);
    setShowSplash(true);
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
    if (pendingRoute) router.push(pendingRoute);
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <div className="btm-nav bg-neutral border-t border-gray-700 text-white">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`flex flex-col items-center justify-center text-xs py-2 ${
              active === tab.name ? "text-primary font-semibold" : "text-gray-400"
            }`}
            onClick={() => handleTabClick(tab.route)}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
          </button>
        ))}
      </div>
    </>
  );
}
