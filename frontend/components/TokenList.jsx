import Link from 'next/link';
import { useState } from 'react';

function ChainBadge({ chain }){
  const c = (chain || '').toString().toLowerCase();
  const label = c.startsWith('sol') ? 'SOL' : (c.startsWith('bsc') || c.startsWith('bnb') ? 'BSC' : (c.toUpperCase().slice(0,3) || 'N/A'));
  return (
    <span className="ml-1 inline-flex items-center justify-center text-[10px] font-mono px-2 py-[3px] rounded-full bg-[#0b0b0b] border border-[#222] text-textDim">{label}</span>
  );
}

export default function TokenList({ tokens = [], chain = 'solana' }) {
  // NOTE: RPC/network switching for actual swaps is out of scope for this component.
  // This is a small scaffold where higher-level Swap page code can switch RPC/network when performing swaps.
  // e.g., useRpcForChain(chain) => returns RPC client or provider. Implement later in swap logic.

  // Child component for each token row (hooks allowed here)
  function TokenRow({ t }){
    const priceRaw = t?.price ?? t?.value ?? 0;
    const priceNum = Number(priceRaw);
    const priceDisplay = Number.isFinite(priceNum) ? priceNum.toFixed(4) : String(priceRaw || 0);

    const changeRaw = t?.change24h ?? t?.change_24h ?? 0;
    const changeNum = Number(changeRaw);
    const changeDisplay = Number.isFinite(changeNum) ? changeNum.toFixed(2) : String(changeRaw || 0);

    const volumeRaw = t?.volume24h ?? t?.volume_24h ?? 0;
    const volumeNum = Number(volumeRaw) || 0;

    let imgSrc = t.logoURI || t.raw?.icon || '';
    if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/')) {
      imgSrc = `https://cdn.dexscreener.com/token-images/${chain}/${t.address || t.tokenAddress || ''}`;
    }
    if (!imgSrc) imgSrc = `/token-placeholder.png`;

    const displaySymbol = t.symbol || t.tokenSymbol || t.raw?.symbol || (t.address ? `${String(t.address).slice(0,4)}...${String(t.address).slice(-4)}` : 'UNKNOWN');
    const tokenChain = (t.chain || chain || 'solana').toString().toLowerCase();
    const [src, setSrc] = useState(imgSrc);

    const target = t.address || t.tokenAddress || t.id || null;
    const href = target ? `/token/${encodeURIComponent(target)}` : null;

    const row = (
      <div className="flex items-center justify-between py-3 border-b border-[#222] last:border-0 hover:bg-[#121214] px-2 rounded">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <img src={src} onError={(e)=>{ if (src !== '/token-placeholder.png') setSrc('/token-placeholder.png'); }} alt={displaySymbol} className="w-10 h-10 rounded-full object-cover" />
            <div className="absolute -bottom-1 -right-1">
              <ChainBadge chain={tokenChain} />
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{displaySymbol}</p>
            <p className="text-xs text-textDim truncate">{t.name || t.tokenName || ''}</p>
            <p className="text-xs text-textDim">{volumeNum ? `$${volumeNum.toLocaleString()} Vol` : ''}</p>
          </div>
        </div>
        <div className="text-right min-w-[90px]">
          <p className="text-sm font-semibold">{priceDisplay && !Number.isNaN(Number(priceDisplay)) ? `$${priceDisplay}` : '$0.00'}</p>
          <p className={`${changeNum >= 0 ? 'text-green-400' : 'text-red-400'} text-xs`}>
            {changeDisplay}%
          </p>
        </div>
      </div>
    );

    if (href) {
      return (
        <Link key={target || displaySymbol} href={href} className="w-full block">
          {row}
        </Link>
      );
    }

    return (
      <div key={displaySymbol} className="w-full">{row}</div>
    );
  }

  return (
    <div className="bg-[#0f0f10] rounded-2xl border border-[#222] p-3 mt-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs text-textDim font-semibold">TRENDING</h2>
        <div className="text-xs px-2 py-1 rounded-full bg-[#0b0b0b] border border-[#222]">
          <span className="font-mono text-[11px] uppercase">{chain}</span>
        </div>
      </div>
      {tokens.map((t) => (
        <TokenRow key={t.address || t.tokenAddress || t.id || t.symbol} t={t} />
      ))}
    </div>
  );
}
