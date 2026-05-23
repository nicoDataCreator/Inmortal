import { useState } from "react";
import { TrendingUp, Award, Thermometer, ShieldCheck } from "lucide-react";

export default function CarlosStats() {
  const [multiplier, setMultiplier] = useState(3.5);
  const [bullishFactor, setBullishFactor] = useState(80);

  // Computed wave vertices for responsive SVG graph representation
  // Wave 0: (10, 160)
  // Wave 1: (90, 80)
  // Wave 2: (150, 130)
  // Wave 3: (300, 30 + (100 - bullishFactor))
  // Wave 4: (380, 100)
  // Wave 5: (480, 10 - multiplier * 4)
  const yWave3 = 30 + (100 - bullishFactor) * 1.2;
  const yWave5 = Math.max(5, 70 - multiplier * 15);

  const getVerdict = () => {
    const score = multiplier * bullishFactor;
    if (score > 600) return { title: "Super Bullish Apocalíptico", color: "text-red-500", desc: "A las 0350 ya saltamos de alegría. Liquidación total de los salamines bajistas con apalancamiento manchesteriano." };
    if (score > 350) return { title: "Bullmarket Histórico Sano", color: "text-emerald-500", desc: "Procedimiento excelente. Cotizaciones en alza constante. Es el triunfo definitivo de las fuerzas del cielo y el efectivo." };
    if (score > 150) return { title: "Bearish con Rebote Técnico", color: "text-yellow-500", desc: "Movimiento correctivo plano. Los boluditos de Nordelta asustados vendiendo posiciones baratas. Esperamos soporte." };
    return { title: "Catástrofe de los Planificados", color: "text-rose-500", desc: "Conducta ho-rro-ro-sa de los gerentes de PowerPoint. Se pudre todo señores. Refugiar efectivo físico en cajas fuertes." };
  };

  const verdict = getVerdict();

  return (
    <div className="bg-zinc-50 dark:bg-[#121215] rounded border border-zinc-200 dark:border-white/10 p-6">
      <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
        <div>
          <h3 className="font-serif font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2">
            <TrendingUp size={18} className="text-[#C5A267]" />
            Simulador de Ondas de Elliot Integradas
          </h3>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono uppercase tracking-widest leading-normal">
            Estructura Técnica de Fibonacci 55 Años
          </p>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded bg-amber-100 dark:bg-[#C5A267]/10 text-amber-800 dark:text-[#C5A267] font-mono font-bold uppercase tracking-widest">
          Masla Metrics
        </span>
      </div>

      {/* SVG Responsive Wave Graph */}
      <div className="w-full h-44 bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-white/5 rounded relative overflow-hidden flex items-end">
        <svg viewBox="0 0 500 180" className="w-full h-full p-2.5">
          {/* Grid lines */}
          <line x1="0" y1="45" x2="500" y2="45" stroke="#f4f4f5" className="dark:stroke-white/5" strokeWidth="1" strokeDasharray="3" />
          <line x1="0" y1="90" x2="500" y2="90" stroke="#f4f4f5" className="dark:stroke-white/5" strokeWidth="1" strokeDasharray="3" />
          <line x1="0" y1="135" x2="500" y2="135" stroke="#f4f4f5" className="dark:stroke-white/5" strokeWidth="1" strokeDasharray="3" />

          {/* Elliot Wave line styled as gold technical path */}
          <path
            d={`M 10 160 L 90 95 L 150 135 L 300 ${yWave3} L 380 110 L 485 ${yWave5}`}
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C5A267" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#C5A267" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>

          {/* Vertices indicator dots with gold premium feel */}
          <circle cx="10" cy="160" r="4" className="fill-zinc-400" />
          <circle cx="90" cy="95" r="4" className="fill-[#C5A267]" />
          <circle cx="150" cy="135" r="4" className="fill-[#C5A267]" />
          <circle cx="300" cy={yWave3} r="5" className="fill-[#C5A267]" />
          <circle cx="380" cy="110" r="4" className="fill-red-400" />
          <circle cx="485" cy={yWave5} r="5.5" className="fill-white animate-pulse" />

          {/* Labels */}
          <text x="12" y="155" className="text-[9px] font-mono fill-zinc-400" textAnchor="start">Inic (Oa)</text>
          <text x="91" y="85" className="text-[9px] font-mono fill-[#C5A267] font-bold" textAnchor="middle">Onda 1</text>
          <text x="148" y="150" className="text-[9px] font-mono fill-zinc-400" textAnchor="middle">Onda 2</text>
          <text x="298" y={yWave3 - 10} className="text-[9px] font-mono fill-[#C5A267] font-bold" textAnchor="middle">Onda 3</text>
          <text x="375" y="125" className="text-[9px] font-mono fill-zinc-400" textAnchor="middle">Onda 4</text>
          <text x="450" y={yWave5 + 15} className="text-[9px] font-mono fill-white font-bold" textAnchor="end">Onda 5 (Top)</text>
        </svg>

        {/* Live multiplier floating badge */}
        <div className="absolute bottom-3 left-3 bg-[#0A0A0C]/95 text-white font-mono text-[9px] px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest">
          MULT: {multiplier.toFixed(1)}x / COMP: {bullishFactor}%
        </div>
      </div>

      {/* Controllers block */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Lever factor */}
        <div>
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <Award size={12} className="text-[#C5A267]" /> Apalancamiento Barrani
            </span>
            <span className="font-bold text-zinc-950 dark:text-white">{multiplier.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="12.0"
            step="0.5"
            value={multiplier}
            onChange={(e) => setMultiplier(parseFloat(e.target.value))}
            className="mt-2 w-full accent-[#C5A267] h-1 rounded bg-zinc-200 dark:bg-white/10 cursor-pointer"
          />
        </div>

        {/* Bullish conviction */}
        <div>
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 font-bold font-mono">
              <Thermometer size={12} className="text-[#C5A267]" /> Fuerza del Bullmarket
            </span>
            <span className="font-bold text-zinc-950 dark:text-white">{bullishFactor}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={bullishFactor}
            onChange={(e) => setBullishFactor(parseInt(e.target.value))}
            className="mt-2 w-full accent-[#C5A267] h-1 rounded bg-zinc-200 dark:bg-white/10 cursor-pointer"
          />
        </div>
      </div>

      {/* Dynamic verdict box - EDITORIAL STYLE */}
      <div className="mt-5 p-5 bg-zinc-50 dark:bg-zinc-950/40 border-l-2 border-[#C5A267] italic font-serif text-sm leading-relaxed transition-all duration-300">
        <div>
          <h4 className={`text-[10px] font-extrabold uppercase font-mono tracking-widest mb-1.5 ${verdict.color}`}>
            DICTAMEN DEL MAESTRO: {verdict.title}
          </h4>
          <p className="text-sm text-zinc-800 dark:text-zinc-200 font-serif italic leading-relaxed">
            &quot;{verdict.desc}&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
