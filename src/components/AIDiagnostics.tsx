import { useState, useEffect } from "react";
import { ShieldCheck, Play, Power, AlertCircle, RefreshCw, Terminal, CheckCircle } from "lucide-react";

interface AIStatusInfo {
  configured: boolean;
  model: string;
  details: string;
  pingState: "idle" | "testing" | "success" | "failed";
  pingResult?: string;
}

export default function AIDiagnostics() {
  const [statuses, setStatuses] = useState<{
    gemini: AIStatusInfo;
    openrouter: AIStatusInfo;
    mistral: AIStatusInfo;
  }>({
    gemini: { configured: false, model: "gemini-3.5-flash", details: "Cargando...", pingState: "idle" },
    openrouter: { configured: false, model: "...", details: "Cargando...", pingState: "idle" },
    mistral: { configured: false, model: "...", details: "Cargando...", pingState: "idle" },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [activeTestStep, setActiveTestStep] = useState<string | null>(null);

  // Add a line to the screen-printed console logger and standard web console
  const logMessage = (msg: string, type: "info" | "success" | "error" = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    const formatted = `[${timestamp}] ${msg}`;
    setTerminalLogs((prev) => [...prev, formatted]);
    
    // Satisfy requirement "si hay errores mostrar en console"
    if (type === "error") {
      console.error(msg);
    } else {
      console.log(msg);
    }
  };

  const fetchStatus = async () => {
    setIsLoading(true);
    logMessage("Iniciando consulta de claves de entorno del backend...", "info");
    try {
      const res = await fetch("/api/ai-status");
      if (!res.ok) throw new Error("Falla al recuperar estatus del servidor.");
      const data = await res.json();
      
      setStatuses({
        gemini: { ...statuses.gemini, configured: data.gemini.configured, details: data.gemini.details, model: data.gemini.model },
        openrouter: { ...statuses.openrouter, configured: data.openrouter.configured, details: data.openrouter.details, model: data.openrouter.model },
        mistral: { ...statuses.mistral, configured: data.mistral.configured, details: data.mistral.details, model: data.mistral.model },
      });

      logMessage(
        `Estatus cargado. Gemini: ${data.gemini.configured ? "CONECTADO" : "FALTA CLAVE"}, OpenRouter: ${data.openrouter.configured ? "CONECTADO" : "FALTA CLAVE"}, Mistral: ${data.mistral.configured ? "CONECTADO" : "FALTA CLAVE"}`,
        "success"
      );
    } catch (err: any) {
      logMessage(`Error de red o configuración: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Perform sequential 1-by-1 validation of each configured function
  const runSequentialDiagnostics = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setTerminalLogs([]);
    logMessage("=== INICIANDO PROTOCOLO DE TESTEO SECUENCIAL (1 POR 1) ===", "info");

    const providers: ("gemini" | "openrouter" | "mistral")[] = ["gemini", "openrouter", "mistral"];

    for (const provider of providers) {
      setActiveTestStep(provider);
      setStatuses((prev) => ({
        ...prev,
        [provider]: { ...prev[provider], pingState: "testing" }
      }));

      logMessage(`[Paso 1/3] Iniciando apretón de manos con el motor: ${provider.toUpperCase()}`, "info");

      try {
        const res = await fetch(`/api/ai-test/${provider}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({ error: "Falla de red no identificada" }));
          throw new Error(errData.error || `Error HTTP ${res.status}`);
        }
        
        const data = await res.json();
        
        setStatuses((prev) => ({
          ...prev,
          [provider]: { ...prev[provider], pingState: "success", pingResult: data.text }
        }));
        
        logMessage(`[CONECTADO] ${provider.toUpperCase()} respondió exitosamente: "${data.text}"`, "success");
      } catch (err: any) {
        setStatuses((prev) => ({
          ...prev,
          [provider]: { ...prev[provider], pingState: "failed", pingResult: err.message }
        }));
        
        // Output very detailed error statements to screen console & browser console
        logMessage(`[DEFECTUOSO] Falla en la función de ${provider.toUpperCase()}: ${err.message}`, "error");
        logMessage(`Sugerencia para solucionar ${provider.toUpperCase()}: Verifique que declare la variable correspondiente en la sección 'Secrets' en AI Studio.`, "error");
      }
    }

    setActiveTestStep(null);
    setIsLoading(false);
    logMessage("=== PROTOCOLO DE DIAGNÓSTICO SECUENCIAL FINALIZADO ===", "info");
  };

  return (
    <div className="bg-zinc-50 dark:bg-[#121215] rounded border border-zinc-200 dark:border-white/10 p-6">
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div>
          <h3 className="font-serif font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#C5A267]" />
            Panel de Diagnóstico & Estatus de IAs
          </h3>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono uppercase tracking-widest leading-normal">
            Verificación de conectores uno por uno
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={fetchStatus}
            disabled={isLoading}
            className="p-1 px-2.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 hover:border-[#C5A267] text-zinc-600 dark:text-zinc-300 transition-all font-mono text-[9px] flex items-center gap-1 cursor-pointer disabled:opacity-50"
            title="Recargar estatus de llaves"
          >
            <RefreshCw size={10} className={`${isLoading ? "animate-spin" : ""}`} />
            LLAVES
          </button>
          <button
            onClick={runSequentialDiagnostics}
            disabled={isLoading}
            className="p-1 px-2.5 rounded bg-red-600 hover:bg-red-700 text-white font-mono text-[9px] font-bold tracking-widest flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
          >
            <Play size={9} />
            TEST 1-POR-1
          </button>
        </div>
      </div>

      {/* Grid status indicators with lights (green/red) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
        {/* GEMINI ENGINE CARD */}
        <div className="p-3.5 bg-white dark:bg-zinc-950/60 rounded border border-zinc-200/60 dark:border-white/5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[8px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                MOTOR PRINCIPAL
              </span>
              <h4 className="font-bold text-xs dark:text-white mt-0.5 font-mono">Gemini 3.5</h4>
            </div>
            {/* Status light */}
            <span className="flex h-3.5 w-3.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                statuses.gemini.configured ? "bg-emerald-400" : "bg-red-400"
              }`}></span>
              <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                statuses.gemini.configured ? "bg-emerald-500" : "bg-red-500"
              }`} title={statuses.gemini.configured ? "Clave Habilitada" : "Clave faltante"} />
            </span>
          </div>
          <div className="mt-4 pt-2 border-t border-zinc-150 dark:border-white/5 text-[9px] font-mono">
            <p className="text-zinc-400">Modelo: {statuses.gemini.model}</p>
            {statuses.gemini.pingState === "testing" && <p className="text-amber-500 animate-pulse mt-1 font-bold">PROBANDO...</p>}
            {statuses.gemini.pingState === "success" && <p className="text-emerald-500 mt-1 font-bold">✔ ONLINE</p>}
            {statuses.gemini.pingState === "failed" && <p className="text-red-500 mt-1 font-bold">✖ ERROR</p>}
            {statuses.gemini.pingState === "idle" && <p className="text-zinc-500 mt-1">Esperando test</p>}
          </div>
        </div>

        {/* OPENROUTER ENGINE CARD */}
        <div className="p-3.5 bg-white dark:bg-zinc-950/60 rounded border border-zinc-200/60 dark:border-white/5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[8px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                MOTOR ALTERNATIVO
              </span>
              <h4 className="font-bold text-xs dark:text-white mt-0.5 font-mono">OpenRouter</h4>
            </div>
            {/* Status light */}
            <span className="flex h-3.5 w-3.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                statuses.openrouter.configured ? "bg-emerald-400" : "bg-red-400"
              }`}></span>
              <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                statuses.openrouter.configured ? "bg-emerald-500" : "bg-red-500"
              }`} title={statuses.openrouter.configured ? "Clave Habilitada" : "Clave faltante"} />
            </span>
          </div>
          <div className="mt-4 pt-2 border-t border-zinc-150 dark:border-white/5 text-[9px] font-mono">
            <p className="text-zinc-400 truncate" title={statuses.openrouter.model}>Modelo: {statuses.openrouter.model.split("/").pop()}</p>
            {statuses.openrouter.pingState === "testing" && <p className="text-amber-500 animate-pulse mt-1 font-bold">PROBANDO...</p>}
            {statuses.openrouter.pingState === "success" && <p className="text-emerald-500 mt-1 font-bold">✔ ONLINE</p>}
            {statuses.openrouter.pingState === "failed" && <p className="text-red-500 mt-1 font-bold">✖ ERROR</p>}
            {statuses.openrouter.pingState === "idle" && <p className="text-zinc-500 mt-1">Esperando test</p>}
          </div>
        </div>

        {/* MISTRAL ENGINE CARD */}
        <div className="p-3.5 bg-white dark:bg-zinc-950/60 rounded border border-zinc-200/60 dark:border-white/5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[8px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                MOTOR ALTERNATIVO
              </span>
              <h4 className="font-bold text-xs dark:text-white mt-0.5 font-mono">Mistral AI</h4>
            </div>
            {/* Status light */}
            <span className="flex h-3.5 w-3.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                statuses.mistral.configured ? "bg-emerald-400" : "bg-red-400"
              }`}></span>
              <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                statuses.mistral.configured ? "bg-emerald-500" : "bg-red-500"
              }`} title={statuses.mistral.configured ? "Clave Habilitada" : "Clave faltante"} />
            </span>
          </div>
          <div className="mt-4 pt-2 border-t border-zinc-150 dark:border-white/5 text-[9px] font-mono">
            <p className="text-zinc-400">Modelo: {statuses.mistral.model}</p>
            {statuses.mistral.pingState === "testing" && <p className="text-amber-500 animate-pulse mt-1 font-bold">PROBANDO...</p>}
            {statuses.mistral.pingState === "success" && <p className="text-emerald-500 mt-1 font-bold">✔ ONLINE</p>}
            {statuses.mistral.pingState === "failed" && <p className="text-red-500 mt-1 font-bold">✖ ERROR</p>}
            {statuses.mistral.pingState === "idle" && <p className="text-zinc-500 mt-1">Esperando test</p>}
          </div>
        </div>
      </div>

      {/* Interactive terminal readout for step logs */}
      <div className="rounded bg-zinc-950 p-4 border border-zinc-800 font-mono text-xs flex flex-col select-all">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2 text-zinc-500">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider">
            <Terminal size={12} className="text-[#C5A267]" />
            Consola de Diagnóstico Inmortal
          </div>
          <span className="text-[9px] rounded px-1.5 py-0.5 bg-zinc-900 border border-white/5">
            {isLoading ? "PROCESANDO" : "STANDBY"}
          </span>
        </div>
        <div className="h-32 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
          {terminalLogs.length === 0 ? (
            <p className="text-zinc-650 italic text-[11px]">Haga clic en &quot;TEST 1-POR-1&quot; para iniciar un diagnóstico interactivo en tiempo real de cada función.</p>
          ) : (
            terminalLogs.map((log, index) => {
              let color = "text-zinc-300";
              if (log.includes("[CONECTADO]") || log.includes("exitosemente") || log.includes("=== INICIANDO") || log.includes("=== PROTOCOLO")) {
                color = "text-emerald-400";
              } else if (log.includes("[DEFECTUOSO]") || log.includes("Error") || log.includes("Falla")) {
                color = "text-rose-400";
              } else if (log.includes("Iniciando")) {
                color = "text-amber-400";
              }
              return (
                <p key={index} className={`text-[11px] leading-relaxed break-words whitespace-pre-wrap ${color}`}>
                  {log}
                </p>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
