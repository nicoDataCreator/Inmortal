import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { AreaChart, UploadCloud, Info, RefreshCw, Layers, Sparkles, Check } from "lucide-react";

interface ElliottWaveScannerProps {
  onScanComplete: (tweetText: string, chartImageBase64: string) => void;
}

export default function ElliottWaveScanner({ onScanComplete }: ElliottWaveScannerProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [mimeType, setMimeType] = useState<string>("image/png");
  
  const [scanStatus, setScanStatus] = useState<"idle" | "uploading" | "creating" | "finished" | "failed">("idle");
  const [scanProgressLabel, setScanProgressLabel] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert files cleanly to base64 Data URLs
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("TÉNGASE PRESENTE: Solo se admiten archivos de imagen (png, jpeg, webp) de gráficos.");
      setScanStatus("failed");
      return;
    }

    setImageName(file.name);
    setMimeType(file.type);
    setScanStatus("uploading");
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedImage(e.target.result as string);
        setScanStatus("idle");
      } else {
        setErrorMessage("Error de lectura física al procesar el archivo.");
        setScanStatus("failed");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setImageName("");
    setScanStatus("idle");
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  const startElliottWaveAnalysis = async () => {
    if (!selectedImage) return;

    setScanStatus("creating"); // Reassuring status label for "creando" requested by user
    setErrorMessage(null);

    // Sequence of state steps/labels for high realism
    const labels = [
      "ESTABLECIENDO CONEXIÓN FIAT ...",
      "RECOLECTANDO PUNTOS DE ONDA FIBONACCI ...",
      "CONSULTANDO AL MAESTRO CARLOS ...",
      "CREANDO REPORTE DE MERCADO SOBERANO ...",
    ];

    let currentStep = 0;
    setScanProgressLabel(labels[0]);

    const labelInterval = setInterval(() => {
      currentStep++;
      if (currentStep < labels.length) {
        setScanProgressLabel(labels[currentStep]);
      }
    }, 700);

    try {
      // API call to custom multimodal Gemini endpoint
      const res = await fetch("/api/gemini/analyze-chart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: selectedImage,
          filename: imageName,
          mimeType: mimeType,
        }),
      });

      clearInterval(labelInterval);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Falla de conectividad local con el motor multimodal.");
      }

      const data = await res.json();
      setAnalysisResult(data.text);
      setScanStatus("finished");

      // Push synthesized tweet directly into Carlos' feeds! "y que se genere automáticamente un post"
      onScanComplete(data.text, selectedImage);

    } catch (err: any) {
      clearInterval(labelInterval);
      console.error("[Scanner UI Fail]", err.message);
      setErrorMessage(err.message || "Error interno del analizador multimodal.");
      setScanStatus("failed");
    }
  };

  return (
    <div className="bg-zinc-50 dark:bg-[#121215] rounded border border-zinc-200 dark:border-white/10 p-6 relative overflow-hidden">
      
      {/* Visual background gradient accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A267]/5 rounded-full filter blur-2xl pointer-events-none" />

      {/* Header element */}
      <div className="flex justify-between items-start mb-5 pb-3 border-b border-zinc-150 dark:border-white/5">
        <div>
          <h3 className="font-serif font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2">
            <AreaChart size={18} className="text-[#C5A267]" />
            Analizador Multimodal de Capturas (Ondas de Elliott)
          </h3>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono uppercase tracking-widest leading-normal">
            Análisis visual 100% SOBERANO con disclaimer NFA
          </p>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 font-mono font-bold uppercase tracking-widest">
          VISION AI
        </span>
      </div>

      {/* NFA Warning Banner */}
      <div className="mb-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 flex items-start gap-2.5 p-3 rounded text-zinc-650 dark:text-zinc-300">
        <Info size={14} className="text-[#C5A267] mt-0.5 shrink-0" />
        <div className="text-[11px] leading-relaxed">
          <strong className="font-mono text-[10px] uppercase font-bold text-zinc-800 dark:text-white block mb-0.5">Disclaimer Importante (NFA):</strong>
          Toda predicción provista por el simulador de Carlos Maslatón es 100% de carácter especulativo y con fines lúdicos y testimoniales. <strong>No constituye asesoramiento financiero formal.</strong> Opere bajo su propio discernimiento soberano.
        </div>
      </div>

      {/* Main Drag/Upload Area */}
      {!selectedImage && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
            dragActive
              ? "border-[#C5A267] bg-[#C5A267]/10"
              : "border-zinc-300 dark:border-white/10 bg-white/50 dark:bg-zinc-950/30 hover:bg-zinc-100 dark:hover:bg-zinc-900/40"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
          />
          <UploadCloud size={32} className="text-zinc-400 dark:text-zinc-500" />
          <div>
            <p className="text-sm font-bold dark:text-white">Arrastrá tu screenshot de gráfico acá</p>
            <p className="text-xs text-zinc-400 mt-1">O hacé clic para explorar tus capturas locales</p>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-200 dark:bg-white/10 text-zinc-500">
            JPG, PNG, WEBP (MAX 4MB)
          </span>
        </div>
      )}

      {/* Image Preview & Scanner controllers */}
      {selectedImage && (
        <div className="space-y-4">
          <div className="relative rounded overflow-hidden border border-zinc-200 dark:border-white/10 h-64 bg-zinc-100 dark:bg-black/30 flex items-center justify-center p-2">
            <img
              src={selectedImage}
              alt="Preview chart"
              className="max-w-full max-h-full object-contain rounded"
            />
            {/* Overlay for CREANDO status with dynamic steps */}
            {scanStatus === "creating" && (
              <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 z-30 transition-all">
                <RefreshCw size={28} className="text-[#C5A267] animate-spin" />
                <div className="text-center">
                  <span className="text-xs font-mono font-black text-[#C5A267] tracking-widest uppercase">
                    CREANDO...
                  </span>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase mt-1.5 animate-pulse tracking-wider">
                    {scanProgressLabel}
                  </p>
                </div>
              </div>
            )}
            
            {/* File info pill */}
            <div className="absolute top-2.5 right-2.5 bg-[#0A0A0C]/90 text-white font-mono text-[9px] px-2 py-1 rounded border border-white/10 uppercase max-w-xs truncate">
              {imageName || "grafico-cargado.png"}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center gap-3">
            <button
              onClick={resetScanner}
              disabled={scanStatus === "creating"}
              className="px-4 py-2 text-xs font-mono font-bold tracking-widest bg-zinc-200 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-300 rounded hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              DESCARTAR
            </button>
            <button
              onClick={startElliottWaveAnalysis}
              disabled={scanStatus === "creating"}
              className="px-6 py-2.5 text-xs font-mono font-extrabold tracking-widest bg-red-600 hover:bg-red-700 text-white rounded transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/10 disabled:opacity-50"
            >
              <Sparkles size={13} />
              ANALIZAR CON CARLOS (NFA)
            </button>
          </div>
        </div>
      )}

      {/* Error readouts */}
      {errorMessage && (
        <div className="mt-4 p-4 rounded bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-400 font-serif text-xs leading-relaxed flex gap-2">
          <Info size={14} className="shrink-0 mt-0.5" />
          <div>
            <strong className="font-mono text-[10px] uppercase font-bold block mb-1">FALLA COMPORTAMIENTO:</strong>
            {errorMessage}
            <span className="block mt-1.5 text-[9px] font-mono text-rose-500 uppercase">
              RECOMENDACIÓN: Verifique si GEMINI_API_KEY está cargado en el panel Secrets.
            </span>
          </div>
        </div>
      )}

      {/* Response Display Box (If not directly posted already) */}
      {analysisResult && scanStatus === "finished" && (
        <div className="mt-5 p-4 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200/50 dark:border-emerald-950/20 rounded-lg">
          <p className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <Check size={12} />
            CONTEO INTEGRADO & SUBIDO AL FEED
          </p>
          <div className="pl-3.5 border-l border-emerald-500 italic font-serif text-[13px] leading-relaxed text-zinc-800 dark:text-zinc-200">
            &quot;{analysisResult}&quot;
          </div>
        </div>
      )}

    </div>
  );
}
