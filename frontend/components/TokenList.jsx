import Link from 'next/link';

export default function TokenList({ tokens = [] }) {
  return (
    <div className="bg-[#111] rounded-2xl border border-[#222] p-3 mt-4">
      <h2 className="text-xs text-textDim font-semibold mb-2">TRENDING ON SOLANA</h2>
      {tokens.map((t) => {
        const priceRaw = t?.price ?? t?.value ?? 0;
        const priceNum = Number(priceRaw);
        const priceDisplay = Number.isFinite(priceNum) ? priceNum.toFixed(4) : String(priceRaw || 0);

        const changeRaw = t?.change24h ?? t?.change_24h ?? 0;
        const changeNum = Number(changeRaw);
        const changeDisplay = Number.isFinite(changeNum) ? changeNum.toFixed(2) : String(changeRaw || 0);

        const volumeRaw = t?.volume24h ?? t?.volume_24h ?? 0;
        const volumeNum = Number(volumeRaw) || 0;

        // Ensure logo URI is absolute. DexScreener sometimes returns a short icon hash.
        let imgSrc = t.logoURI || t.raw?.icon || '';
        if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/')) {
          imgSrc = `https://cdn.dexscreener.com/token-images/solana/${t.address || t.tokenAddress || ''}`;
        }
        if (!imgSrc) imgSrc = `/sol.png`; // fallback local image

        const displaySymbol = t.symbol || t.tokenSymbol || t.raw?.symbol || (t.address ? `${String(t.address).slice(0,4)}...${String(t.address).slice(-4)}` : 'UNKNOWN');

        return (
          <Link
            key={t.address || t.tokenAddress || t.id}
            href={`/token/${t.address || t.tokenAddress || ''}`}
            className="flex items-center justify-between py-2 border-b border-[#222] last:border-0"
          >
            <div className="flex items-center space-x-3">
              <img src={imgSrc} alt={displaySymbol} className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-sm font-semibold">{displaySymbol}</p>
                <p className="text-xs text-textDim">{t.name || t.tokenName || ''}</p>
                <p className="text-xs text-textDim">${volumeNum.toLocaleString()} Vol</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">${priceDisplay}</p>
              <p className={`${changeNum >= 0 ? 'text-green-400' : 'text-red-400'} text-xs`}>
                {changeDisplay}%
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
