import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

export default function Browser() {
  const iframeRef = useRef(null);
  const [url, setUrl] = useState("https://pump.fun/");
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);

  useEffect(() => {
    const storedKey = localStorage.getItem("publicKey");
    if (storedKey) setPublicKey(storedKey);

    // Inject Phantom-like provider when iframe loads if same-origin.
    const iframe = iframeRef.current;
    const injectProvider = () => {
      if (!iframe) return;
      try {
        const iw = iframe.contentWindow;
        // Accessing href will throw for cross-origin frames
        // eslint-disable-next-line no-unused-expressions
        iw.location.href;

        const script = `
          (() => {
            window.solana = {
              isPhantom: true,
              publicKey: { toString: () => "${storedKey}" },
              connect: () => Promise.resolve({ publicKey: "${storedKey}" }),
              disconnect: () => Promise.resolve(),
              signTransaction: (tx) => Promise.resolve(tx),
              signAllTransactions: (txs) => Promise.resolve(txs),
              signMessage: (msg) => Promise.resolve({ signature: msg }),
            };
            window.dispatchEvent(new Event('solana#initialized'));
          })();
        `;

        // Safe to inject for same-origin
        iw.eval(script);
        setConnected(true);
      } catch (err) {
        // Cross-origin or injection blocked. Don't try to eval.
        console.warn("Provider injection skipped (cross-origin or blocked):", err.message || err);
        setConnected(false);
      }
    };

    iframe?.addEventListener("load", injectProvider);
    return () => iframe?.removeEventListener("load", injectProvider);
  }, []);

  const handleNav = (e) => {
    e.preventDefault();
    if (!url.startsWith("http")) setUrl(`https://${url}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-phantom-bg text-white">
      <Header />
      <div className="p-3">
        <form onSubmit={handleNav} className="flex mb-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input input-bordered w-full bg-secondary text-sm text-gray-300"
            placeholder="Enter dApp URL..."
          />
          <button className="btn btn-primary ml-2 text-white" type="submit">
            Go
          </button>
        </form>
      </div>

      <div className="w-full bg-black p-2">
        <div className="w-full h-[80vh] bg-black rounded-md overflow-hidden">
          <iframe
            ref={iframeRef}
            src={url}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
          />
        </div>
      </div>

      {!connected && (
        <div className="p-3 text-center text-sm text-yellow-300 bg-yellow-900/10 rounded-md">
          Provider injection disabled for cross-origin sites. Open the dApp in a same-origin context to enable the injected wallet provider.
        </div>
      )}

      <BottomNav />
    </div>
  );
}
