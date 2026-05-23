import { useState } from "react";
import { MessageSquare, ArrowRightLeft, ShieldAlert } from "lucide-react";

interface TweetReplyToolProps {
  onReplyGenerated: (originalText: string, context: string) => void;
  isReplying: boolean;
  generatedReply: string | null;
}

export default function TweetReplyTool({
  onReplyGenerated,
  isReplying,
  generatedReply,
}: TweetReplyToolProps) {
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
    if (!originalTweet.trim()) return;
    onReplyGenerated(originalTweet, replyContext);
  };

  const loadExample = (num: number) => {
    if (num === 1) {
      setOriginalTweet("Acabamos de anunciar un nuevo impuesto del 3% a las compras digitales para financiar la subsecretaría del bienestar colectivo.");
      setReplyContext("destruir acusando de comunismo socialdemocrata");
    } else if (num === 2) {
      setOriginalTweet("El Bitcoin cayó de nuevo un 4% hoy. Creo que es una burbuja especulativa que no sirve para nada.");
      setReplyContext("oponerse ferozmente con analisis tecnico");
    } else {
      setOriginalTweet("Hoy pagué en el bar de la esquina con billetes de dólar en efectivo, dejé un 15% de propina al mozo y no pedí factura.");
      setReplyContext("respaldo absoluto e incondicional proceder");
    }
  };

  return (
    <div className="bg-white dark:bg-[#121215] rounded border border-zinc-200 dark:border-white/10 p-6 shadow-sm">
      <h3 className="text-base font-serif font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2">
        <MessageSquare className="text-[#C5A267] w-5 h-5" />
        Responder Enunciados Ajenos
      </h3>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
        Pegá un tweet o frase ajena, seleccioná tu objetivo de respuesta y Carlos procederá a liquidarlo en público.
      </p>

      {/* Examples switcher */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono font-bold">Ejemplos:</span>
        <button
          onClick={() => loadExample(1)}
          className="text-[9px] font-mono px-2 py-1 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:bg-[#C5A267] hover:text-black transition-colors text-zinc-600 dark:text-zinc-300"
        >
          Impuestos (Comunista)
        </button>
        <button
          onClick={() => loadExample(2)}
          className="text-[9px] font-mono px-2 py-1 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:bg-[#C5A267] hover:text-black transition-colors text-zinc-600 dark:text-zinc-300"
        >
          Bitcoin de burbuja (Técnico)
        </button>
        <button
          onClick={() => loadExample(3)}
          className="text-[9px] font-mono px-2 py-1 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:bg-[#C5A267] hover:text-black transition-colors text-zinc-600 dark:text-zinc-300"
        >
          Pago Barrani (Proceder)
        </button>
      </div>

      <div className="mt-4">
        <textarea
          value={originalTweet}
          onChange={(e) => setOriginalTweet(e.target.value)}
          placeholder="Pegá lo que dijo el socialdemócrata o boludito de turno..."
          className="w-full h-24 p-3.5 text-xs rounded border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#C5A267]/40 focus:border-[#C5A267] transition-all font-sans resize-none"
        />
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
                className={`text-xs px-2.5 py-1.5 rounded border font-mono transition-all duration-200 ${
                  isSelected
                    ? "bg-amber-500/5 dark:bg-[#C5A267]/5 text-[#C5A267] border-[#C5A267]"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-zinc-800/80"
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
          disabled={isReplying || !originalTweet.trim()}
          className="w-full py-3 px-4 font-mono font-bold text-xs uppercase tracking-[0.2em] border border-[#C5A267] text-[#C5A267] hover:bg-[#C5A267] hover:text-black transition-all bg-transparent disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#C5A267] rounded-sm flex items-center justify-center gap-2 cursor-pointer animate-pulse"
        >
          {isReplying ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              <span>ELABORANDO RESPUESTA...</span>
            </>
          ) : (
            <>
              <ArrowRightLeft size={13} />
              <span>ORDENAR RESPUESTA</span>
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
          <p className="text-zinc-900 dark:text-zinc-50 font-serif italic whitespace-pre-wrap">
            &quot;{generatedReply}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
