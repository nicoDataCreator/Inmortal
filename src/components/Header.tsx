import { Sun, Moon, TrendingUp, TrendingDown, RefreshCw, Space } from "lucide-react";
import { MarketAsset } from "../types";

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  marketAssets: MarketAsset[];
  isMarketLoading: boolean;
  onRefreshMarket: () => void;
}

export default function Header({
  isDarkMode,
  setIsDarkMode,
  marketAssets,
  isMarketLoading,
  onRefreshMarket,
}: HeaderProps) {
  return (
    <header className="border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-[#0A0A0C]/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#C5A267] flex items-center justify-center p-1 shadow-lg shadow-[#C5A267]/10 shrink-0">
            <div className="w-full h-full border border-white/20 flex items-center justify-center font-serif font-bold text-black text-xl tracking-tighter">
              I
            </div>
          </div>
          <div>
            <h1 className="text-xl font-serif tracking-tight text-zinc-950 dark:text-white flex items-center gap-1.5 font-bold">
              <span>INMORTAL</span>
              <span className="text-[9px] uppercase tracking-[0.2em] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-[#C5A267]/10 text-amber-800 dark:text-[#C5A267] font-mono font-bold">
                BARRANI
              </span>
            </h1>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-widest">
              Elliot Wave Synthesis
            </p>
          </div>
        </div>

        {/* Real-time Ticker */}
        <div className="flex items-center gap-3 overflow-x-auto py-1 max-w-full sm:max-w-auto no-scrollbar">
          <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900/60 px-3 py-1.5 rounded border border-zinc-200/60 dark:border-white/5">
            <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mr-1 font-bold">
              <span>MERCADOS</span>
              <button
                onClick={onRefreshMarket}
                disabled={isMarketLoading}
                className={`p-0.5 hover:text-[#C5A267] dark:hover:text-[#C5A267] rounded transition-transform ${
                  isMarketLoading ? "animate-spin text-[#C5A267]" : ""
                }`}
                title="Actualizar Cotizaciones"
              >
                <RefreshCw size={10} />
              </button>
            </div>

            {marketAssets.map((asset) => {
              const ChangeIcon = asset.change >= 0 ? TrendingUp : TrendingDown;
              const changeColor = asset.change >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400";
              const bgBadge = asset.change >= 0 ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-rose-50 dark:bg-rose-950/20";

              return (
                <div key={asset.symbol} className="flex items-center gap-1.5 text-xs font-mono border-r border-zinc-200 dark:border-white/5 last:border-0 pr-4 last:pr-0">
                  <span className="font-semibold text-zinc-500 dark:text-zinc-400">{asset.name}</span>
                  <span className="text-zinc-950 dark:text-zinc-100 font-bold">
                    ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                  </span>
                  <span className={`flex items-center gap-0.5 text-[9px] px-1 rounded font-bold ${changeColor} ${bgBadge}`}>
                    <ChangeIcon size={9} />
                    {asset.change >= 0 ? "+" : ""}{asset.change.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          {/* Light/Dark Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-9 h-9 rounded flex items-center justify-center border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-650 dark:text-[#C5A267] transition-colors"
            title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
