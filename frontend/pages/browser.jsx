import { useEffect, useState, useRef } from "react";
import Navigation from "../components/navigation";

export default function Browser() {
  const iframeRef = useRef(null);
  const [url, setUrl] = useState("https://pump.fun/");
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);

  useEffect(() => {
    const storedKey = localStorage.getItem("publicKey");
    if (storedKey) setPublicKey(storedKey);

    // Inject Phantom-like provider when iframe loads
    const iframe = iframeRef.current;
    const injectProvider = () => {
      if (!iframe) return;
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
      iframe.contentWindow.eval(script);
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

      <div className="flex-1 bg-black">
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
        />
      </div>

      <Navigation active="browser" />
    </div>
  );
}
