import { useState } from "react";
import { MessageSquare, ArrowRightLeft, ShieldAlert, Link, FileText, Send } from "lucide-react";

interface TweetReplyToolProps {
  onReplyGenerated: (originalText: string, context: string, xLink?: string) => void;
  isReplying: boolean;
  generatedReply: string | null;
  replySources?: { title: string; uri: string }[];
}

export default function TweetReplyTool({
  onReplyGenerated,
  isReplying,
  generatedReply,
  replySources = [],
}: TweetReplyToolProps) {
  const [activeTab, setActiveTab] = useState<"link" | "text">("link");
  const [xLink, setXLink] = useState("");
  const [originalTweet, setOriginalTweet] = useState("");
  const [replyContext, setReplyContext] = useState("oponerse ferozmente con analisis tecnico");

  const contexts = [
    { id: "oponerse ferozmente con analisis tecnico", label: "Oponerse Ferozmente con Análisis Técnico" },
    { id: "destruir acusando de comunismo socialdemocrata", label: "Destruir Acusando de Comunismo" },
    { id: "respaldo absoluto e incondicional proceder", label: "Respaldo Incondicional (Proceder)" },
    { id: "tratar de absoluto boludito sin arreglo", label: "Tratar de absoluto boludito sin arreglo" },
    { id: "explicar por que es de conducta ho-rro-ro-sa", label: "Denunciar como Conducta Horrorosa" },
  ];

  const handlePostReply = () => {
    if (activeTab === "link") {
      if (!xLink.trim()) return;
      onReplyGenerated("", replyContext, xLink);
    } else {
      if (!originalTweet.trim()) return;
      onReplyGenerated(originalTweet, replyContext);
    }
  };

  const loadExample = (num: number) => {
    if (num === 1) {
      setActiveTab("link");
      setXLink("https://x.com/CarlosMaslaton/status/1785002938472918231");
      setReplyContext("oponerse ferozmente con analisis tecnico");
    } else if (num === 2) {
      setActiveTab("text");
      setOriginalTweet("Acabamos de anunciar un nuevo impuesto del 3% a las compras digitales para financiar la subsecretaría del bienestar colectivo.");
      setReplyContext("destruir acusando de comunismo socialdemocrata");
    } else {
      setActiveTab("text");
      setOriginalTweet("Hoy pagué en el bar de la esquina con billetes de dólar en efectivo, dejé un 15% de propina al mozo y no pedí factura.");
      setReplyContext("respaldo absoluto e incondicional proceder");
    }
  };

  // Safe twitter web intent URL
  const tweetTextToSend = generatedReply 
    ? `${generatedReply}${activeTab === "link" && xLink ? ` ${xLink}` : ""}` 
    : "";
  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetTextToSend)}`;

  return (
    <div className="bg-white dark:bg-[#121215] rounded border border-zinc-200 dark:border-white/10 p-6 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
        <div>
          <h3 className="text-base font-serif font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="text-[#C5A267] w-5 h-5 animate-pulse" />
            Réplicas Analíticas de X & Enunciados
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Pegá un post de X para que la IA entienda el contexto usando Google Search, u opiná frente a dichos de terceros con el criterio absoluto de Carlos.
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-[#C5A267]/10 text-amber-800 dark:text-[#C5A267] font-mono font-bold uppercase tracking-wider">
          CONEXIÓN X INTENT
        </span>
      </div>

      {/* Examples switcher */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono font-bold">Ejemplos:</span>
        <button
          onClick={() => loadExample(1)}
          className="text-[9px] font-mono px-2 py-1 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:bg-[#C5A267] hover:text-black transition-colors text-zinc-650 dark:text-zinc-300"
        >
          Enlace de X (Análisis)
        </button>
        <button
          onClick={() => loadExample(2)}
          className="text-[9px] font-mono px-2 py-1 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:bg-[#C5A267] hover:text-black transition-colors text-zinc-650 dark:text-zinc-300"
        >
          Impuestos (Comunista)
        </button>
        <button
          onClick={() => loadExample(3)}
          className="text-[9px] font-mono px-2 py-1 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:bg-[#C5A267] hover:text-black transition-colors text-zinc-650 dark:text-zinc-300"
        >
          Pago Barrani (Proceder)
        </button>
      </div>

      {/* Mode selectors */}
      <div className="mt-5 flex border-b border-zinc-200 dark:border-white/5">
        <button
          onClick={() => setActiveTab("link")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
            activeTab === "link"
              ? "border-[#C5A267] text-[#C5A267]"
              : "border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <Link size={13} />
          Enlace de X (Twitter)
        </button>
        <button
          onClick={() => setActiveTab("text")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
            activeTab === "text"
              ? "border-[#C5A267] text-[#C5A267]"
              : "border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <FileText size={13} />
          Comentario Manual
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "link" ? (
          <div>
            <label className="block text-[10px] font-extrabold uppercase font-mono tracking-widest text-[#C5A267] mb-2">
              Ingresá el enlace original del Post de X
            </label>
            <input
              type="text"
              value={xLink}
              onChange={(e) => setXLink(e.target.value)}
              placeholder="https://x.com/CarlosMaslaton/status/1785002938472918231"
              className="w-full p-3.5 text-xs rounded border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#C5A267]/40 focus:border-[#C5A267] transition-all font-mono"
            />
            <p className="mt-1.5 text-[10px] text-zinc-500 dark:text-zinc-400 font-sans">
              * El servidor buscará el contexto en la red usando Gemini Search Grounding en tiempo real para brindarle a Carlos todo el trasfondo del tuit.
            </p>
          </div>
        ) : (
          <div>
            <label className="block text-[10px] font-extrabold uppercase font-mono tracking-widest text-zinc-500 mb-2">
              Pegá lo que dijo el socialdemócrata o sujeto confundido
            </label>
            <textarea
              value={originalTweet}
              onChange={(e) => setOriginalTweet(e.target.value)}
              placeholder="Escribí o pegá la frase del burócrata de turno para destrozarlo..."
              className="w-full h-24 p-3.5 text-xs rounded border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#C5A267]/40 focus:border-[#C5A267] transition-all font-sans resize-none"
            />
          </div>
        )}
      </div>

      {/* Target choice selection */}
      <div className="mt-4">
        <label className="block text-[10px] font-extrabold uppercase font-mono tracking-widest text-zinc-500">
          Alineación de Carlos
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {contexts.map((ctx) => {
            const isSelected = replyContext === ctx.id;
            return (
              <button
                key={ctx.id}
                onClick={() => setReplyContext(ctx.id)}
                className={`text-xs px-2.5 py-1.5 rounded border font-mono transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-amber-500/5 dark:bg-[#C5A267]/5 text-[#C5A267] border-[#C5A267]"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {ctx.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit button */}
      <div className="mt-5">
        <button
          onClick={handlePostReply}
          disabled={isReplying || (activeTab === "link" ? !xLink.trim() : !originalTweet.trim())}
          className="w-full py-3 px-4 font-mono font-bold text-xs uppercase tracking-[0.2em] border border-[#C5A267] text-[#C5A267] hover:bg-[#C5A267] hover:text-black transition-all bg-transparent disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#C5A267] rounded-sm flex items-center justify-center gap-2 cursor-pointer animate-pulse"
        >
          {isReplying ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              <span>{activeTab === "link" ? "BUSCANDO EN X Y COORDINANDO..." : "ELABORANDO RESPUESTA..."}</span>
            </>
          ) : (
            <>
              <ArrowRightLeft size={13} />
              <span>{activeTab === "link" ? "ANALIZAR ENLACE Y REPLICAR" : "ORDENAR RESPUESTA"}</span>
            </>
          )}
        </button>
      </div>

      {/* Output reply if populated */}
      {generatedReply && (
        <div className="mt-4 p-6 bg-zinc-50 dark:bg-zinc-950/40 border-l-2 border-[#C5A267] italic font-serif text-[17px] leading-relaxed relative overflow-hidden transition-all duration-300">
          <div className="flex gap-1 items-center mb-2">
            <ShieldAlert size={14} className="text-[#C5A267]" />
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase font-semibold text-[#C5A267]">
              REPLICA OFICIAL DE CARLOS
            </span>
          </div>
          <p className="text-zinc-950 dark:text-white font-serif italic whitespace-pre-wrap text-md leading-relaxed">
            &quot;{generatedReply}&quot;
          </p>

          {/* Search Citations / Grounding sources representation */}
          {replySources.length > 0 && (
            <div className="mt-4 border-t border-zinc-200 dark:border-white/5 pt-3">
              <span className="block text-[9px] font-mono font-extrabold uppercase text-zinc-400 mb-1.5 tracking-wider">
                Referencias Grounding del Post:
              </span>
              <div className="flex flex-wrap gap-2">
                {replySources.slice(0, 2).map((src, index) => (
                  <a
                    key={index}
                    href={src.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-zinc-500 dark:text-[#C5A267] bg-white dark:bg-[#0A0A0C] border border-zinc-200 dark:border-white/10 px-2.5 py-1 rounded hover:bg-zinc-50 dark:hover:bg-white/5"
                  >
                    🔍 {src.title.length > 30 ? src.title.substring(0, 30) + "..." : src.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action button to proceed on X linking user account */}
          <div className="mt-5 pt-3 border-t border-zinc-250 dark:border-white/5 flex justify-end">
            <a
              href={twitterIntentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#C5A267] text-black hover:bg-[#B38E54] active:bg-[#9E7C45] px-5 py-2.5 rounded text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md shadow-[#C5A267]/10"
            >
              <Send size={13} />
              Contestar y Postear en X
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
