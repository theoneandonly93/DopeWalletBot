import Image from "next/image";

export function TokenRow({ logo, name, symbol, price, change, balanceUSD, balanceStr, onClick }){
  return (
    <button onClick={onClick} className="w-full bg-card rounded-xl2 p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#0e0e0e] overflow-hidden flex items-center justify-center">
          {logo ? <Image src={logo} alt={symbol} width={36} height={36} /> : <div className="w-6 h-6 rounded-full bg-accent" />}
        </div>
        <div className="text-left">
          <div className="text-[15px] leading-4">{name}</div>
          <div className="text-xs text-textDim">${price} <span className={change.startsWith("-")?"text-danger":"text-success"}>{change}</span></div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[15px]">${balanceUSD}</div>
        <div className="text-xs text-textDim">{balanceStr}</div>
      </div>
    </button>
  );
}

export function SimpleCard({ title, subtitle, badge }){
  return (
    <div className="bg-card rounded-xl2 p-3 flex items-center justify-between">
      <div>
        <div className="font-medium">{title} {badge && <span className="text-[10px] bg-[#2a2a2a] px-2 py-0.5 rounded-full align-middle">{badge}</span>}</div>
        <div className="text-xs text-textDim">{subtitle}</div>
      </div>
      <div className="text-2xl">%</div>
    </div>
  );
}
