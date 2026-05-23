import { useState } from "react";
import { TweetCategory, MarketAsset } from "../types";
import { Sparkles, Check, HelpCircle, AlertCircle, Database, Moon } from "lucide-react";

interface TweetGeneratorProps {
  onTweetGenerated: (tweetText: string, category: TweetCategory, useMarket: boolean, useSpace: boolean) => void;
  marketAssets: MarketAsset[];
  spaceData: { title: string; imageUrl?: string; explanation?: string } | null;
  isGenerating: boolean;
}

export default function TweetGenerator({
  onTweetGenerated,
  marketAssets,
  spaceData,
  isGenerating,
}: TweetGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState<TweetCategory>(TweetCategory.ELLIOT_WAVES);
  const [customPointers, setCustomPointers] = useState("");
  const [includeMarket, setIncludeMarket] = useState(true);
  const [includeSpace, setIncludeSpace] = useState(false);

  const categories = [
    {
      id: TweetCategory.ELLIOT_WAVES,
      title: "Análisis de Ondas",
      emoji: "📈",
      desc: "Elliott Waves, cotizaciones, rants de mercados y verdades del Bitcoin.",
    },
    {
      id: TweetCategory.BARRANI,
      title: "Economía Barrani",
      emoji: "💵",
      desc: "Efectivo en mano, evasión sana, soda, propinas en dólares y anti-facturas.",
    },
    {
      id: TweetCategory.COSMIC,
      title: "Astronomía & Aliens",
      emoji: "🛸",
      desc: "Inminente llegada de los marcianos, orbitas de satélites y Marte retrógrado.",
    },
    {
      id: TweetCategory.ANTI_COMMUNIST,
      title: "Anti-Comunismo",
      emoji: "⚔️",
      desc: "Fusilamiento retórico a los socialdemócratas y gerentes de PowerPoint.",
    },
    {
      id: TweetCategory.GASTRONOMY,
      title: "Sibarita Premium",
      emoji: "🥩",
      desc: "Sifón frío, Costanera Norte, odio profundo a la menta granizada.",
    },
  ];

  const handleGenerate = () => {
    // Collect facts for context
    const facts: any = {};
    if (customPointers.trim()) {
      facts.customContext = customPointers.trim();
    }
    if (includeMarket) {
      facts.marketAssets = marketAssets;
    }
    if (includeSpace && spaceData) {
      facts.spaceEvent = { title: spaceData.title, explanation: spaceData.explanation };
    }

    onTweetGenerated(JSON.stringify(facts), selectedCategory, includeMarket, includeSpace);
  };

  return (
    <div className="bg-zinc-50 dark:bg-[#121215] rounded border border-zinc-200 dark:border-white/10 p-6">
      <h2 className="text-lg font-serif font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2">
        <Sparkles className="text-[#C5A267] w-5 h-5 animate-pulse" />
        Configurar Procedimiento Excelente
      </h2>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
        Elegí un temario y dejá que Carlos analice minuciosamente la coyuntura nacional e internacional.
      </p>

      {/* Categories Grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                // Proactively enable related data sets based on category selecion for better UX
                if (cat.id === TweetCategory.COSMIC) {
                  setIncludeSpace(true);
                  setIncludeMarket(false);
                } else if (cat.id === TweetCategory.ELLIOT_WAVES) {
                  setIncludeMarket(true);
                  setIncludeSpace(false);
                }
              }}
              className={`p-3.5 rounded border text-left flex flex-col justify-between h-34 transition-all duration-200 ${
                isSelected
                  ? "bg-amber-500/5 dark:bg-[#C5A267]/5 border-[#C5A267] ring-1 ring-[#C5A267]/30 shadow-sm"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 hover:bg-zinc-100/50"
              }`}
            >
              <div className="text-2xl">{cat.emoji}</div>
              <div>
                <p className="text-xs font-bold text-zinc-950 dark:text-zinc-100 flex items-center gap-1.5 label-editorial">
                  {cat.title}
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#C5A267]" />}
                </p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                  {cat.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Context / Pointers */}
      <div className="mt-5">
        <label className="block text-[10px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-mono">
          Conceptos y Hechos Clave
        </label>
        <input
          type="text"
          value={customPointers}
          onChange={(e) => setCustomPointers(e.target.value)}
          placeholder="Ej: Luquitas Rodriguez, Nordelta, el dolar blue a 1400, Soda Ivess"
          className="mt-2 w-full px-4 py-3 rounded text-xs border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-[#C5A267]/40 focus:border-[#C5A267] transition-all"
        />
      </div>

      {/* Key Integrations Checkboxes */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Finnhub integration */}
        <div
          onClick={() => setIncludeMarket(!includeMarket)}
          className={`p-3.5 rounded border cursor-pointer select-none transition-all flex items-center justify-between ${
            includeMarket
              ? "bg-[#C5A267]/10 dark:bg-[#C5A267]/5 border-[#C5A267]/40 text-[#C5A267]"
              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-zinc-400"
          }`}
        >
          <div className="flex gap-2.5 items-center">
            <Database size={15} className={includeMarket ? "text-[#C5A267]" : "text-zinc-400"} />
            <div>
              <p className="text-[11px] font-extrabold font-mono uppercase tracking-wider">Inyectar Finnhub API</p>
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">Integrar cotización Bitcoin, COMP y SPX actúales.</p>
            </div>
          </div>
          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
            includeMarket ? "bg-[#C5A267] border-[#C5A267] text-black" : "border-zinc-300 dark:border-white/10"
          }`}>
            {includeMarket && <Check size={11} className="stroke-[3]" />}
          </div>
        </div>

        {/* NASA Integration */}
        <div
          onClick={() => setIncludeSpace(!includeSpace)}
          className={`p-3.5 rounded border cursor-pointer select-none transition-all flex items-center justify-between ${
            includeSpace
              ? "bg-[#C5A267]/10 dark:bg-[#C5A267]/5 border-[#C5A267]/40 text-[#C5A267]"
              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-zinc-400"
          }`}
        >
          <div className="flex gap-2.5 items-center">
            <Moon size={15} className={includeSpace ? "text-[#C5A267]" : "text-zinc-400"} />
            <div>
              <p className="text-[11px] font-extrabold font-mono uppercase tracking-wider">Inyectar NASA APOD</p>
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">Acoplar registro astronómico del cosmos espacial.</p>
            </div>
          </div>
          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
            includeSpace ? "bg-[#C5A267] border-[#C5A267] text-black" : "border-zinc-300 dark:border-white/10"
          }`}>
            {includeSpace && <Check size={11} className="stroke-[3]" />}
          </div>
        </div>
      </div>

      {/* Trigger Button - AMAZING GOLD SHADOW BUTTON */}
      <div className="mt-6">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-3.5 px-4 font-mono font-bold text-xs tracking-[0.2em] text-black bg-[#C5A267] hover:bg-[#b59255] disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 rounded-sm hover:scale-[1.01] active:scale-100 disabled:scale-100 transition-all shadow-[0_0_20px_rgba(197,162,103,0.25)] flex items-center justify-center gap-2 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
              <span>CREANDO TWEET SOBERANO...</span>
            </>
          ) : (
            <>
              <span>PROCEDER A GENERAR TWEET</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
