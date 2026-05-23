import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Tweet, TweetCategory, MarketAsset } from "./types";
import { MessageCircle, FileText, Send, Sparkles, RefreshCcw, HelpCircle, Check, Info, X } from "lucide-react";
import Header from "./components/Header";
import TweetCard from "./components/TweetCard";
import TweetGenerator from "./components/TweetGenerator";
import TweetReplyTool from "./components/TweetReplyTool";
import CarlosStats from "./components/CarlosStats";
import AIDiagnostics from "./components/AIDiagnostics";
import ElliottWaveScanner from "./components/ElliottWaveScanner";
import CarlosBookLibrary from "./components/CarlosBookLibrary";

// Inmortalized static starting tweets representing actual Maslatón quotes
const INITIAL_TWEETS: Tweet[] = [
  {
    id: "masla_1",
    category: TweetCategory.ELLIOT_WAVES,
    text: "TÉNGASÉ PRESENTE: Procederemos a liquidar a todos los operadores apalancados que no entienden la matemática de Fibonacci de 55 años. El mercado de Bitcoin es 100% barrani y soberano. Los salamines bajistas serán aplastados.",
    timestamp: "Hace 10 mins",
    likes: 3450,
    retweets: 1800,
    marketData: {
      symbol: "BTC",
      price: 64500,
      change: 3.52,
      verdict: "Estructura alcista inquebrantable de onda 3 de onda 5. Proceder incondicional."
    }
  },
  {
    id: "masla_2",
    category: TweetCategory.GASTRONOMY,
    text: "Un panqueque de dulce de leche acompañado de soda de sifón recontra helada con gas en la Costanera Norte es el mayor placer registrado por el humano civilizado. Mozo excelente, pago 100% en dólares físicos en efectivo, sin factura. Masla Town procede.",
    timestamp: "Hace 2 horas",
    likes: 8900,
    retweets: 4210
  },
  {
    id: "masla_3",
    category: TweetCategory.COSMIC,
    text: "Alerto a los burócratas de Nordelta: Marte se encuentra en fase estacionaria a punto de retrogradar. La concha de la lora. Se pudre todo señores. Solo los marcianos en naves superlumínicas nos salvarán del desastre socialista del Nasdaq.",
    timestamp: "Hace 1 día",
    likes: 12050,
    retweets: 5930
  }
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    return localStorage.getItem("masla_intro_seen") !== "true";
  });
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(() => {
    return localStorage.getItem("masla_welcome_dismissed") !== "true";
  });
  const [marketAssets, setMarketAssets] = useState<MarketAsset[]>([
    { symbol: "BTC", name: "Bitcoin", price: 64500, change: 1.25 },
    { symbol: "COMP", name: "NASDAQ", price: 16340, change: -0.45 },
    { symbol: "SPX", name: "S&P 500", price: 5275, change: 0.15 }
  ]);
  const [isMarketLoading, setIsMarketLoading] = useState(false);
  const [spaceData, setSpaceData] = useState<{ title: string; imageUrl?: string; explanation?: string } | null>(null);

  const [tweets, setTweets] = useState<Tweet[]>(INITIAL_TWEETS);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [isReplying, setIsReplying] = useState(false);
  const [generatedReply, setGeneratedReply] = useState<string | null>(null);
  const [replySources, setReplySources] = useState<{ title: string; uri: string }[]>([]);

  // Sync visual body theme class on mount and change
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleDismissIntro = () => {
    localStorage.setItem("masla_intro_seen", "true");
    setShowIntro(false);
  };

  const handleDismissWelcome = () => {
    localStorage.setItem("masla_welcome_dismissed", "true");
    setShowWelcomeBanner(false);
  };

  const handleShowIntro = () => {
    setShowIntro(true);
  };

  // Fetch API assets & NASA details on startup
  useEffect(() => {
    fetchMarketData();
    fetchSpaceData();
  }, []);

  const fetchMarketData = async () => {
    setIsMarketLoading(true);
    try {
      const res = await fetch("/api/market-status");
      if (res.ok) {
        const data = await res.json();
        setMarketAssets(data);
      }
    } catch (err) {
      console.error("Error fetching markets", err);
    } finally {
      setIsMarketLoading(false);
    }
  };

  const fetchSpaceData = async () => {
    try {
      const res = await fetch("/api/space-status");
      if (res.ok) {
        const data = await res.json();
        setSpaceData(data);
      }
    } catch (err) {
      console.error("Error fetching space apod", err);
    }
  };

  // Generate target post using Express + Gemini API Endpoint
  const handleGenerateTweet = async (
    factsPayload: string,
    category: TweetCategory,
    useMarket: boolean,
    useSpace: boolean
  ) => {
    setIsGenerating(true);
    try {
      const parsedFacts = JSON.parse(factsPayload);
      
      const response = await fetch("/api/gemini/generate-tweet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          currentFacts: parsedFacts,
          provider: "gemini",
        }),
      });

      if (!response.ok) throw new Error("Gemini generate error");
      const data = await response.json();

      // Formulate custom dynamic Tweet instance
      const btcAsset = marketAssets.find((a) => a.symbol === "BTC");
      const newTweet: Tweet = {
        id: `gen_${Date.now()}`,
        category,
        text: data.text,
        timestamp: "Ahora mismo",
        likes: Math.floor(Math.random() * 250) + 10,
        retweets: Math.floor(Math.random() * 120) + 5,
        marketData: useMarket && btcAsset ? {
          symbol: btcAsset.symbol,
          price: btcAsset.price,
          change: btcAsset.change,
          verdict: category === TweetCategory.ELLIOT_WAVES 
            ? "Conteo armónico de Elliot validado. Proceder incondicional." 
            : "Mercado marginalmente barrani paralelo."
        } : undefined,
        spaceData: useSpace && spaceData ? {
          title: spaceData.title,
          imageUrl: spaceData.imageUrl,
          explanation: spaceData.explanation,
        } : undefined
      };

      setTweets((prev) => [newTweet, ...prev]);
    } catch (err) {
      console.error("Error generating tweet", err);
      // Fallback tweet in case of unexpected connection drop
      const fbTweet: Tweet = {
        id: `fb_${Date.now()}`,
        category,
        text: `TÉNGASE PRESENTE: Caída provisional de los servidores de Masla Town. Procederemos a liquidar posiciones de resguardo barrani de forma inmediata. Bullish absoluto.`,
        timestamp: "Ahora mismo",
        likes: 120,
        retweets: 45,
      };
      setTweets((prev) => [fbTweet, ...prev]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Ask Carlos to reply back to customized prompts
  const handleGenerateReply = async (originalTweet: string, replyContext: string, xLink?: string) => {
    setIsReplying(true);
    setGeneratedReply(null);
    setReplySources([]);
    try {
      const response = await fetch("/api/gemini/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalTweet, replyContext, xLink, provider: "gemini" }),
      });

      if (!response.ok) throw new Error("Gemini reply error");
      const data = await response.json();
      setGeneratedReply(data.text);
      if (data.sources) {
        setReplySources(data.sources);
      }
    } catch (err) {
      console.error("Error generating reply", err);
      setGeneratedReply("TÉNGASE PRESENTE: No respondo enunciados que carecen de soporte técnico de Fibonacci o links caídos. Proceder con extrema cautela.");
    } finally {
      setIsReplying(false);
    }
  };

  // Push the visual wave scanner result as a live, formatted Tweet post in Carlos' feed
  const handleScanComplete = (tweetText: string, chartImage: string) => {
    const newTweet: Tweet = {
      id: `wave_scan_${Date.now()}`,
      category: TweetCategory.ELLIOT_WAVES,
      text: tweetText,
      timestamp: "Ahora mismo",
      likes: Math.floor(Math.random() * 850) + 120,
      retweets: Math.floor(Math.random() * 415) + 60,
      chartImage: chartImage,
    };
    setTweets((prev) => [newTweet, ...prev]);
  };

  return (
    <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300 ${isDarkMode ? "dark" : ""}`}>
      {/* Unified Header */}
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        marketAssets={marketAssets}
        isMarketLoading={isMarketLoading}
        onRefreshMarket={fetchMarketData}
        onShowIntroClick={handleShowIntro}
      />

      {/* Premium First-Visit / Instruction Presentation Overlay (AnimatePresence) */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white dark:bg-[#0A0A0C] border-2 border-[#C5A267] rounded-lg max-w-xl w-full p-8 shadow-[0_0_50px_rgba(197,162,103,0.2)] font-sans relative overflow-hidden"
            >
              {/* Decorative design element */}
              <div className="absolute top-0 left-0 w-2 h-full bg-[#C5A267]" />
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded bg-[#C5A267] flex items-center justify-center font-serif font-bold text-black text-lg">
                  C
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-zinc-950 dark:text-white tracking-tight">
                    SINOPSIS DEL PROCEDIMIENTO SOBERANO
                  </h4>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-[#C5A267]">
                    Cuerpo Documental Maslatoneano
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-zinc-750 dark:text-zinc-300 text-xs leading-relaxed font-serif">
                <p className="text-sm italic">
                  &quot;Hemos recopilado minuciosamente una gran cantidad de información histórica, sentencias doctrinales del mercado, discursos, tweets y vivencias gastronómicas sibaritas de Carlos Maslatón.&quot;
                </p>
                <p className="font-sans text-[11px] text-zinc-500 dark:text-zinc-400">
                  A partir de esta vasta base documental consolidada, el motor inteligente soberano simula con precisión total los razonamientos financieros (Teoría de Ondas de Elliott), el fervor anti-comunista, la apología al barrani y la defensa inquebrantable del lomo premium en Costanera Norte.
                </p>
                <div className="p-3 bg-amber-500/5 dark:bg-[#C5A267]/5 border-l-2 border-[#C5A267] rounded font-mono text-[10px] text-zinc-600 dark:text-[#C5A267] leading-relaxed">
                  <strong>Estado del Conector:</strong> 100% SOBERANO Y BARRANI · Default Gemini 3.5 Engine activo para todas las operaciones analíticas.
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-white/5 flex justify-end">
                <button
                  onClick={handleDismissIntro}
                  className="bg-[#C5A267] hover:bg-[#B38E54] active:bg-[#9E7C45] text-black font-mono font-bold uppercase tracking-widest text-xs px-6 py-3 rounded transition-all shadow-md shadow-[#C5A267]/10 w-full sm:w-auto"
                >
                  ENTENDIDO, PROCEDEMOS
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        {showWelcomeBanner && (
          <div className="mb-8 p-6 bg-red-950/80 dark:bg-red-950/30 text-red-100 border border-red-800/40 dark:border-red-900/30 rounded-3xl relative overflow-hidden shadow-lg shadow-red-950/20 transition-all duration-300">
            <div className="absolute right-0 bottom-0 w-80 h-80 bg-red-900/20 rounded-full filter blur-3xl opacity-40 translate-x-20 translate-y-20 pointer-events-none" />
            
            {/* Dismiss Button */}
            <button
              onClick={handleDismissWelcome}
              className="absolute right-4 top-4 text-red-300/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all cursor-pointer z-20"
              title="Sacar banner de bienvenida"
            >
              <X size={18} />
            </button>

            <div className="relative z-10 max-w-2xl pr-8">
              <h2 className="text-xl font-bold tracking-tight text-red-200 dark:text-red-100 font-serif">
                Bienvenido a INMORTAL
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-red-200/80 dark:text-zinc-300 leading-relaxed font-sans">
                El simulador definitivo e interactivo basado en la filosofía, análisis de mercado y vivencias de <strong>Carlos Maslatón</strong>. Generá tweets asombrosos con datos reales del BTC y de la NASA, o respondé tweets ajenos con el criterio inapelable del maestro.
              </p>
              <div className="mt-4 flex gap-1.5 items-center bg-red-900/40 dark:bg-red-950/50 border border-red-800/50 p-2 rounded-lg w-fit text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-red-300">
                <Info size={13} />
                <span>Conexión Servidor Activa · 100% Barrani</span>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Grid split view */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Command panel */}
          <section className="lg:col-span-7 space-y-8">
            {/* Real-time connection indicators & diagnostic logging panel */}
            <AIDiagnostics />

            {/* Engine Config cockpit */}
            <TweetGenerator
              onTweetGenerated={handleGenerateTweet}
              marketAssets={marketAssets}
              spaceData={spaceData}
              isGenerating={isGenerating}
            />

            {/* Answer Simulation panel */}
            <TweetReplyTool
              onReplyGenerated={handleGenerateReply}
              isReplying={isReplying}
              generatedReply={generatedReply}
              replySources={replySources}
            />

            {/* Elliott Wave Multi-modal Scanner */}
            <ElliottWaveScanner onScanComplete={handleScanComplete} />

            {/* Carlos Book Knowledge Database Library */}
            <CarlosBookLibrary />

            {/* Simulated Elliott wave Metrics */}
            <CarlosStats />
          </section>

          {/* Right Column: Generated live tweets */}
          <section className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase font-mono tracking-widest text-zinc-500 flex items-center gap-2">
                <span>Feed de Carlos Maslatón</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
              </h3>
              <span className="text-xs text-zinc-400 font-mono">
                {tweets.length} Registrados
              </span>
            </div>

            {/* Rendered Live Tweets Queue */}
            <div className="space-y-4">
              {tweets.map((tweet) => (
                <TweetCard
                  key={tweet.id}
                  tweet={tweet}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
