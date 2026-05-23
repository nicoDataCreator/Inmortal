import { useState, useEffect, FormEvent } from "react";
import { Database, BookOpen, Plus, Trash, Search, Code, Check, AlertCircle, Info, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface KnowledgeEntry {
  id: string;
  category: string;
  concept: string;
  quote_or_fact: string;
  historical_context?: string;
  created_at?: string;
}

export default function CarlosBookLibrary() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSql, setShowSql] = useState(false);
  const [sqlScript, setSqlScript] = useState("");
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");
  const [copiedSql, setCopiedSql] = useState(false);

  // Form State
  const [category, setCategory] = useState("100% Barrani & Efis");
  const [concept, setConcept] = useState("");
  const [quoteOrFact, setQuoteOrFact] = useState("");
  const [historicalContext, setHistoricalContext] = useState("");
  
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const categories = [
    "Elliot Waves & Mercados",
    "100% Barrani & Efis",
    "Marcianos & Marte",
    "Anti-Comunismo & Casta",
    "Soda & Costanera"
  ];

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/knowledge");
      if (!res.ok) throw new Error("Failed to fetch knowledge entries");
      const data = await res.json();
      setEntries(data);
    } catch (err: any) {
      console.error("Error fetching library values", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSql = async () => {
    try {
      const res = await fetch("/api/knowledge/sql");
      const data = await res.json();
      setSqlScript(data.sql);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEntries();
    fetchSql();
  }, []);

  const handleAddEntry = async (e: FormEvent) => {
    e.preventDefault();
    if (!category || !concept || !quoteOrFact) {
      setStatusMessage({ type: "error", text: "TÉNGASE PRESENTE: Complete los campos de concepto y cita obligatorios." });
      return;
    }

    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          concept,
          quote_or_fact: quoteOrFact,
          historical_context: historicalContext
        })
      });

      if (!res.ok) throw new Error("No se pudo agregar la regla analítica.");
      
      const newEntry = await res.json();
      setEntries(prev => [newEntry, ...prev]);
      
      // Reset form fields
      setConcept("");
      setQuoteOrFact("");
      setHistoricalContext("");
      setActiveTab("list");
      
      setStatusMessage({ 
        type: "success", 
        text: "PROCEDIMIENTO EXCELENTE: Conocimiento guardado. El motor de tweets lo usará de inmediato." 
      });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: `Falla al insertar registro: ${err.message}` });
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm("¿Desea suprimir doctrinalmente esta sabiduría de Carlos para la IA?")) return;
    try {
      const res = await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo borrar");
      setEntries(prev => prev.filter(item => item.id !== id));
      setStatusMessage({ type: "success", text: "REGISTRO PURGADO: El pensamiento ha sido retirado históricamente." });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: `Error de supresión: ${err.message}` });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const filteredEntries = entries.filter(item => 
    item.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.quote_or_fact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-[#0E0E12] rounded-2xl border border-zinc-200 dark:border-white/5 p-6 shadow-md transition-all">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 dark:border-white/5 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="text-[#C5A267]" size={22} />
          <div>
            <h3 className="text-md font-serif font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
              SISTEMA DOCTRINARIO DE CARLOS
            </h3>
            <p className="text-[10px] font-mono text-[#C5A267] uppercase tracking-wider font-extrabold">
              Base de Conocimientos · Supabase & Local Cache
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("list")}
            className={`flex-1 sm:flex-none text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === "list"
                ? "bg-[#C5A267]/10 text-[#C5A267] border border-[#C5A267]/30"
                : "border border-zinc-200 dark:border-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            Ver Doctrinas ({filteredEntries.length})
          </button>
          
          <button
            onClick={() => setActiveTab("add")}
            className={`flex-1 sm:flex-none text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "add"
                ? "bg-[#C5A267]/10 text-[#C5A267] border border-[#C5A267]/30"
                : "border border-zinc-200 dark:border-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            <Plus size={12} />
            <span>Sumar Doctrina</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-3 rounded-lg flex items-start gap-2.5 text-[11px] font-mono mb-4 border ${
          statusMessage.type === "success" 
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
            : "bg-red-500/10 text-red-500 border-red-500/20"
        }`}>
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Database Integration Sync Indicator */}
      <div className="flex items-center gap-2.5 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-white/5 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mb-6">
        <Database size={15} className="text-[#C5A267]" />
        <div className="flex-1 flex flex-col sm:flex-row justify-between sm:items-center gap-1">
          <span>
            <strong>Sincronizador:</strong> El motor consulta la tabla <code className="text-zinc-900 dark:text-white px-1 py-0.5 rounded bg-zinc-200 dark:bg-white/10">carlos_book_knowledge</code> de Supabase si posee credenciales.
          </span>
          <button 
            onClick={fetchEntries}
            className="text-[9px] font-bold text-[#C5A267] hover:underline flex items-center gap-0.5 uppercase tracking-wider cursor-pointer font-sans"
          >
            <RefreshCw size={10} className={isLoading ? "animate-spin" : ""} />
            Refrescar
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === "list" ? (
        <div className="space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-zinc-400" size={15} />
            <input
              type="text"
              placeholder="Buscar hito, palabra o concepto doctrinal de Carlos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs font-sans pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-lg focus:outline-none focus:border-[#C5A267]/50 text-zinc-900 dark:text-white transition-colors placeholder-zinc-500"
            />
          </div>

          <div className="max-h-[380px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
            {isLoading && entries.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-zinc-500">
                Sincronizando sabiduría analítica con la nube...
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-zinc-500 border border-dashed border-zinc-200 dark:border-white/5 rounded-xl">
                Ninguna frase o doctrina registrada en el circuito para esta búsqueda.
              </div>
            ) : (
              filteredEntries.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 bg-zinc-50 dark:bg-[#121216] rounded-xl border border-zinc-100 dark:border-white/5 hover:border-[#C5A267]/20 transition-all flex justify-between items-start gap-3 group relative overflow-hidden"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#C5A267]/10 text-[#C5A267] border border-[#C5A267]/20">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#C5A267]">
                        · {item.concept}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-serif text-zinc-950 dark:text-zinc-200 italic">
                      &quot;{item.quote_or_fact}&quot;
                    </p>
                    {item.historical_context && (
                      <p className="text-[9px] font-sans text-zinc-500 dark:text-zinc-500">
                        <strong>Contexto:</strong> {item.historical_context}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleDeleteEntry(item.id)}
                    className="text-zinc-500 hover:text-red-500 p-1 rounded-md hover:bg-red-500/10 transition-colors pointer-events-auto cursor-pointer flex shrink-0"
                    title="Purgar hito histórico"
                  >
                    <Trash size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Add Form Tab */
        <form onSubmit={handleAddEntry} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                Selección de Categoría Doctrinal
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-sans p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-lg focus:outline-none focus:border-[#C5A267]/50 text-zinc-900 dark:text-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                Concepto Fundamental (Ej: Conteo de Ondas, Lomo Premium) *
              </label>
              <input
                type="text"
                placeholder="Introduzca el título o tesis analítica del maestro"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                required
                className="w-full text-xs font-sans p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-lg focus:outline-none focus:border-[#C5A267]/50 text-zinc-900 dark:text-white placeholder-zinc-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
              Cita Textual Maslatoneana para adoctrinar a la IA *
            </label>
            <textarea
              rows={3}
              placeholder="Ejemplo: 'La soda servida en sifón con gas destructor de burbujas robustas representa lo más sagrado de la alimentación en Costanera Norte.'"
              value={quoteOrFact}
              onChange={(e) => setQuoteOrFact(e.target.value)}
              required
              className="w-full text-xs font-serif p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-lg focus:outline-none focus:border-[#C5A267]/50 text-zinc-900 dark:text-white placeholder-zinc-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
              Contexto Histórico / Notas Generales (Opcional)
            </label>
            <input
              type="text"
              placeholder="Origen, tweet real de referencia o vivencia sibarita"
              value={historicalContext}
              onChange={(e) => setHistoricalContext(e.target.value)}
              className="w-full text-xs font-sans p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-lg focus:outline-none focus:border-[#C5A267]/50 text-zinc-900 dark:text-white placeholder-zinc-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#C5A267] hover:bg-[#B38E54] active:bg-[#9E7C45] text-black font-mono font-bold uppercase tracking-widest text-[11px] py-3 rounded-lg transition-all shadow-md mt-2 cursor-pointer"
          >
            GUARDAR CONOCIMIENTO DOCTRINARIO SOBERANO
          </button>
        </form>
      )}

      {/* SQL Setup for Supabase section */}
      <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-white/5">
        <button
          onClick={() => setShowSql(!showSql)}
          className="w-full flex justify-between items-center text-[10px] font-mono text-[#C5A267] hover:underline uppercase tracking-wider cursor-pointer"
        >
          <span className="flex items-center gap-1">
            <Code size={12} />
            <span>¿Quiere usar Supabase? Ver script SQL</span>
          </span>
          <span>{showSql ? "OCULTAR" : "MOSTRAR"}</span>
        </button>

        <AnimatePresence>
          {showSql && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mt-3"
            >
              <div className="bg-[#121216] p-4 rounded-xl border border-white/5 space-y-3">
                <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                  Para tener persistencia permanente en la nube usando su cuenta gratuita de Supabase, cree una tabla denominada <code className="text-[#C5A267] font-mono bg-white/5 px-1 py-0.5 rounded">carlos_book_knowledge</code> ejecutando este script de SQL en el panel de control de Supabase:
                </p>
                
                <div className="relative">
                  <pre className="text-[9px] font-mono text-zinc-300 bg-black/60 p-3 rounded-lg overflow-x-auto max-h-[180px] leading-tight select-all">
                    {sqlScript || "CREATE TABLE carlos_book_knowledge (...)"}
                  </pre>
                  
                  <button
                    onClick={copyToClipboard}
                    className="absolute right-2 top-2 bg-[#C5A267]/10 hover:bg-[#C5A267]/20 border border-[#C5A267]/30 px-2 py-1 rounded text-[8px] font-mono text-[#C5A267] transition-all cursor-pointer"
                  >
                    {copiedSql ? "COPIADO!" : "COPIAR SQL"}
                  </button>
                </div>

                <div className="p-2.5 bg-amber-500/5 border border-amber-500/10 rounded text-[9px] font-mono text-amber-500 flex gap-1.5 items-start leading-normal">
                  <Info size={11} className="shrink-0 mt-0.5" />
                  <span>
                    <strong>CONSEJO DE SEGURIDAD:</strong> Defina las variables <code className="text-white">SUPABASE_URL</code> y <code className="text-white">SUPABASE_KEY</code> en la configuración de Vercel. Si no lo hace, el sistema corre en modo local in-memory con un listado excelente pre-cargado.
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
