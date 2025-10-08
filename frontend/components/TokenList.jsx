import Link from 'next/link';

export default function TokenList({ tokens = [] }) {
  return (
    <div className="bg-[#111] rounded-2xl border border-[#222] p-3 mt-4">
      <h2 className="text-xs text-textDim font-semibold mb-2">TRENDING ON SOLANA</h2>
      {tokens.map((t) => (
        <Link
          key={t.address}
          href={`/token/${t.address}`}
          className="flex items-center justify-between py-2 border-b border-[#222] last:border-0"
        >
          <div className="flex items-center space-x-3">
            <img src={t.logoURI} alt={t.symbol} className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-sm font-semibold">{t.symbol}</p>
              <p className="text-xs text-textDim">${(t.volume24h || t.volume_24h || 0).toLocaleString()} Vol</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">${(t.price || t.value || 0).toFixed ? (t.price || t.value).toFixed(4) : (t.price || t.value)}</p>
            <p className={`${(t.change24h || t.change_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'} text-xs`}>
              {(t.change24h || t.change_24h || 0).toFixed ? (t.change24h || t.change_24h || 0).toFixed(2) : (t.change24h || t.change_24h || 0)}%
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
