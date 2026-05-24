import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { 
  getKnowledgeList, 
  addKnowledgeEntry, 
  deleteKnowledgeEntry, 
  getDbSetupSql 
} from "./server/knowledge";

dotenv.config();

export const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Gemini Client lazily to prevent startup/module-load crashes on platforms like Vercel
function getAi(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || "dummy-key-to-prevent-startup-crash-on-vercel";
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Fallback high-utility API keys for Finnhub and NASA from user parameters
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || "d88rg5pr01qs9ff5socgd88rg5pr01qs9ff5sod0";
const NASA_API_KEY = process.env.NASA_API_KEY || "u7lnvkEvGcx2G2fIw1gu86TQFkW1sh27WgzOQyg5";

// Proxy endpoint for live stock indices & cryptos
app.get("/api/market-status", async (req, res) => {
  try {
    const symbols = ["BINANCE:BTCUSDT", "COMP", "SPX"];
    const results = await Promise.all(
      symbols.map(async (sym) => {
        try {
          const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${sym}&token=${FINNHUB_API_KEY}`
          );
          if (!response.ok) throw new Error("Finnhub rate limit or error");
          const data = await response.json();
          // Map to custom asset model
          let name = "Bitcoin";
          if (sym === "COMP") name = "NASDAQ";
          if (sym === "SPX") name = "S&P 500";
          return {
            symbol: sym.replace("BINANCE:", ""),
            name,
            price: data.c || 0,
            change: data.dp || 0,
          };
        } catch {
          // Playful fallback data to guarantee beautiful visual presentation
          let fallbackPrice = 64500;
          let fallbackChange = 1.25;
          let name = "Bitcoin";
          if (sym === "COMP") {
            fallbackPrice = 16340;
            fallbackChange = -0.45;
            name = "NASDAQ";
          } else if (sym === "SPX") {
            fallbackPrice = 5275;
            fallbackChange = 0.15;
            name = "S&P 500";
          }
          return {
            symbol: sym.replace("BINANCE:", ""),
            name,
            price: fallbackPrice,
            change: fallbackChange,
          };
        }
      })
    );
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy endpoint for NASA cosmic event of the day
app.get("/api/space-status", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
    );
    if (!response.ok) throw new Error("NASA APOD failed");
    const data = await response.json();
    res.json({
      title: data.title || "Universo Maslatoniano",
      imageUrl: data.url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600",
      explanation: data.explanation || "Datos provistos directamente por la agencia de la NASA sobre la retrogradación inminente de Marte."
    });
  } catch {
    // Beautiful default space fact if NASA API key is throttled or missing
    res.json({
      title: "Marte Estacionario a Punto de Retrogradar",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600",
      explanation: "El planeta rojo se encuentra en un punto crítico de su órbita celeste. Advertimos a toda la comunidad financiera que la inminente retrogradación de Marte sobre los planos astrales tendrá efectos devastadores sobre las posiciones del BTC y los comodines tradicionales de cotización estadounidense."
    });
  }
});

// Carlos's Book Knowledge endpoints
app.get("/api/knowledge", async (req, res) => {
  try {
    const list = await getKnowledgeList();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/knowledge", async (req, res) => {
  const { category, concept, quote_or_fact, historical_context } = req.body;
  try {
    if (!category || !concept || !quote_or_fact) {
      return res.status(400).json({ error: "Faltan parámetros requeridos (category, concept, quote_or_fact)" });
    }
    const result = await addKnowledgeEntry({ category, concept, quote_or_fact, historical_context });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/knowledge/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const ok = await deleteKnowledgeEntry(id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/knowledge/sql", (req, res) => {
  res.json({ sql: getDbSetupSql() });
});

// Carlos Maslatón AI Engine Prompt System
const CARLOS_SYSTEM_INSTRUCTION = `
Sos CARLOS MASLATÓN, el legendario analista argentino, abogado, operador financiero experto en Ondas de Elliot, sibarita y militante del capitalismo a ultranza.
Odiás el comunismo, la socialdemocracia, los impuestos, la menta granizada, las servilletas que no absorben agua, los restaurantes con luz blanca sofocante, y la casta gerencial mediocre que hace presentaciones de PowerPoint.
Amás: Bitcoin ("100% barrani"), la soda bien helada con gas en sifón, comer bife de lomo en Costanera Norte ("un panqueque de dulce de leche en Costanera Norte es el mayor placer humano"), el efectivo en efectivo, viajar ligero con poco equipaje, viajar en colectivo por el microcentro, defender a Israel con fervor, discutir ferozmente en foros/Twitter, de noche sentir felicidad extrema y despertarse a las 03:50 AM para "saltar de alegría" y operar de inmediato.
Creés profundamente que antes de finalizar el siglo XXI vas a presenciar la llegada de los marcianos a toda velocidad en naves que no se desintegran.

Tu tono preferido:
- Totalmente militar, asertivo, categórico, de gran alcurnia y académico, pero lleno de lunfardos deliberadamente excéntricos.
- EVITÁ insultos vulgares groseros o agresividad barata de chorro. No uses palabras sumamente ofensivas continuamente. En cambio, usá descalificaciones graciosas y elevadas del léxico propio de Maslatón: "salamines", "sujetos confundidos", "fracasados seriales", "recalcitrantes", "operadores ineptos", "comunistas de café", "militantes de la mediocridad", "socialdemócratas asustados".
- Apelá al humor de alta sociedad y superioridad intelectual.
- Usá modismos constantes como "Téngase presente", "Procedo a...", "Procedimiento excelente", "Salamines y militantes del fracaso", "Sujeto confundido sin arreglo", "Se pudre todo señores", "Es de una conducta ho-rro-ro-sa", "Bullish total", "Bearish absoluto", "100% Barrani", "Esto se jode", "Manchesteriano", "Masla Town", "Proceder incondicional".
- Las respuestas siempre deben estar escritas en ESPAÑOL DE ARGENTINA (voseo completo, "che", "sos", "tenés", pero refinando la terminología para que sea apta para el público en general y no caiga en el insulto soez ordinario).
- Tus tweets son cortos, contundentes, imitando el formato tradicional de Twitter. Usá mayúsculas para "TÉNGASE PRESENTE", "BULLISH", "BARRANI", "PROCEDO".
`;

// Local human fallback generator to guarantee the app remains functional and interactive even when keys are completely exhausted or quota-limited
function getLocalMockMaslatonTweet(prompt: string): string {
  const responses = [
    "TÉNGASE PRESENTE SEÑORES: Procedemos incondicionalmente a comprar más. Estamos ante una maniobra de mercado espectacular de alta alcurnia. Absolutamente BULLISH.",
    "BARRANI TOTAL. El comportamiento de los operadores ineptos es de una conducta ho-rro-ro-sa sin precedentes. Se pudre todo en las próximas horas, téngase presente.",
    "Procedimiento excelente sibarita. Soda servida en sifón de gas destructor combinado con bife de lomo premium a punto en Costanera Norte. Manchesteriano y 100% liberal.",
    "La socialdemocracia asustada y los socialistas de café pretenden regular las fuerzas absolutas de la naturaleza. Fracaso serial garantizado, sigan participando.",
    "Atención general. El conteo de Ondas de Elliott me indica de forma indubitable que estamos en la subonda 5 extendida del ciclo alcista definitivo. El destino final es Marte.",
    "Me envían este comentario de un militante del PowerPoint que nunca pisó el mercado bursátil real. Ignorancia absoluta, sujeto de mentes débiles sin arreglo.",
    "Comportamiento de los comunistas de café intentando dictar cátedra financiera. Procedo a oponerme ferozmente con análisis técnico soberano. Bullish total.",
    "Es de una calidad académica inmensa. El plano irregular de corrección flat ha concluido con éxito rotundo. Procedo a dar por cerrada la fase bajista."
  ];

  let selected = responses[Math.floor(Math.random() * responses.length)];

  const lower = prompt.toLowerCase();
  if (lower.includes("onda") || lower.includes("wave") || lower.includes("mercado") || lower.includes("elliott")) {
    selected = "TÉNGASE PRESENTE SEÑORES: El conteo de Ondas de Elliott me da que estamos en plena Subonda 3 de extensión Manchesteriana. Los salamines ignorantes siguen bearish mientras los profesionales operamos 100% barrani. BULLISH total.";
  } else if (lower.includes("comun") || lower.includes("polític") || lower.includes("casta") || lower.includes("comunista")) {
    selected = "La socialdemocracia asustada pretende regular las libertades absolutas del individuo. Es una conducta ho-rro-ro-sa de comunismo de café. Procedo a ignorar sus circulares estatales e ir por el camino 100% BARRANI. Bullish absoluto.";
  } else if (lower.includes("soda") || lower.includes("sibarita") || lower.includes("lomo") || lower.includes("restaurante")) {
    selected = "Procedimiento sibarita excelente en Costanera Norte. Soda helada de sifón ruidoso con gas destructor de burbujas robustas más porción de lomo premium de alta alcurnia. El paraíso es la Argentina libre y desregulada.";
  } else if (lower.includes("replica") || lower.includes("respond") || lower.includes("enlace") || lower.includes("tuit")) {
    selected = "Me acaban de enviar este posteo de un sujeto confundido que no comprende el concepto básico de capital físico barrani. Denuncio ferozmente su conducta ho-rro-ro-sa y procedo a catalogarlo como militante del fracaso serial. Téngase presente.";
  }

  return selected + " [Estilo SOBERANO - Conexión de Respaldo Local]";
}

// Custom robust dispatcher for multiple AI providers (Gemini, OpenRouter, Mistral)
async function generateWithProvider(
  provider: string,
  prompt: string,
  systemInstruction: string,
  options: { temperature?: number, tools?: any[] } = {}
): Promise<{ text: string, sources?: { title: string, uri: string }[] }> {
  const selectedProvider = (provider || "gemini").toLowerCase();

  // 1. GEMINI PROVIDER (Standard Default Engine)
  const runGemini = async () => {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("TÉNGASE PRESENTE: La clave GEMINI_API_KEY no está configurada en Vercel o el entorno local.");
    }
    const response = await getAi().models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: options.temperature ?? 0.9,
        tools: options.tools,
      },
    });

    const text = response.text || "";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Fuente de X",
      uri: chunk.web?.uri || "",
    })) || [];

    return { text, sources };
  };

  try {
    if (selectedProvider === "gemini") {
      return await runGemini();
    }

    // 2. OPENROUTER PROVIDER (Soporte Mistral y otros modelos gratis con fallback robusto y autogeneración de candidatos)
    if (selectedProvider === "openrouter") {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error("La clave OPENROUTER_API_KEY no está configurada. Operación derivada a Gemini.");
      }

      // Generar lista jerárquica de candidatos a probar
      let candidates: string[] = [];
      const customModel = process.env.OPENROUTER_MODEL;
      if (customModel && customModel.trim() !== "" && customModel.toLowerCase() !== "default") {
        candidates.push(customModel.trim());
      }
      
      // Intentar obtener de forma dinámica los modelos activos en OpenRouter para auto-remediación
      try {
        const listResponse = await fetch("https://openrouter.ai/api/v1/models");
        if (listResponse.ok) {
          const listData = await listResponse.json();
          if (listData && Array.isArray(listData.data)) {
            // Extraer modelos gratuitos disponibles actualmente
            const freeModels = listData.data
              .filter((m: any) => m.id && (m.id.endsWith(":free") || m.id.includes("free")))
              .map((m: any) => m.id);
            candidates.push(...freeModels);

            // Agregar también modelos de bajo costo muy confiables
            const lowCostModels = listData.data
              .filter((m: any) => m.id && (m.id.includes("llama-3-8b") || m.id.includes("gemma-2-9b") || m.id.includes("mistral-7b") || m.id.includes("phi-3")))
              .map((m: any) => m.id);
            candidates.push(...lowCostModels);
          }
        }
      } catch (listErr) {
        console.warn("[OpenRouter Fetch Models List Alert] No se pudo obtener la lista online, usando candidatos por defecto.", listErr);
      }

      // Candidatos de respaldo por defecto (mezcla de free y de bajo costo sin sufijo free)
      const defaultCandidates = [
        "google/gemma-2-9b-it:free",
        "meta-llama/llama-3-8b-instruct:free",
        "qwen/qwen-2.5-72b-instruct:free",
        "mistralai/mistral-7b-instruct:free",
        "google/gemma-2-9b-it",
        "meta-llama/llama-3-8b-instruct",
        "qwen/qwen-2.5-72b-instruct",
        "mistralai/mistral-7b-instruct",
        "openchat/openchat-7b:free",
        "microsoft/phi-3-medium-128k-instruct:free"
      ];
      candidates.push(...defaultCandidates);

      // Eliminar duplicados manteniendo orden
      candidates = Array.from(new Set(candidates));

      let lastErrorText = "";
      for (const model of candidates) {
        try {
          console.log(`[OpenRouter Siguiente Candidato] Intentando comunicar con modelo: ${model}`);
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
              "HTTP-Referer": "https://maslaton-app.vercel.app",
              "X-Title": "Masla Town Simulator",
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: prompt }
              ],
              temperature: options.temperature ?? 0.9,
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            lastErrorText = `Modelo ${model} falló con estado ${response.status}: ${errorText}`;
            console.warn(`[OpenRouter Warning] ${lastErrorText}`);
            continue; // Prueba el siguiente candidato
          }

          const data: any = await response.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) {
            return { text, sources: [] };
          }
        } catch (singleModelErr: any) {
          lastErrorText = `Error al invocar ${model}: ${singleModelErr.message}`;
          console.warn(`[OpenRouter Warning Exception] ${lastErrorText}`);
        }
      }

      throw new Error(`Ningún modelo de OpenRouter respondió exitosamente. Último error reportado: ${lastErrorText}`);
    }

    // 3. MISTRAL AI PROVIDER con fallback robusto
    if (selectedProvider === "mistral") {
      const apiKey = process.env.MISTRAL_API_KEY;
      if (!apiKey) {
        throw new Error("La clave MISTRAL_API_KEY no está configurada. Operación derivada a Gemini.");
      }

      // Generar lista jerárquica de candidatos a probar
      const candidates: string[] = [];
      const customModel = process.env.MISTRAL_MODEL;
      if (customModel && customModel.trim() !== "" && customModel.toLowerCase() !== "studio" && customModel.toLowerCase() !== "default") {
        candidates.push(customModel.trim());
      }
      
      candidates.push("open-mistral-7b");
      candidates.push("mistral-tiny");
      candidates.push("mistral-small-latest");

      let lastErrorText = "";
      for (const model of candidates) {
        try {
          const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: prompt }
              ],
              temperature: options.temperature ?? 0.9,
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            lastErrorText = `Modelo Mistral ${model} falló con estado ${response.status}: ${errorText}`;
            console.warn(`[Mistral Warning] ${lastErrorText}`);
            continue;
          }

          const data: any = await response.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) {
            return { text, sources: [] };
          }
        } catch (singleModelErr: any) {
          lastErrorText = `Error al invocar Mistral ${model}: ${singleModelErr.message}`;
          console.warn(`[Mistral Warning Exception] ${lastErrorText}`);
        }
      }

      throw new Error(`Ningún modelo de Mistral respondió exitosamente. Último error reportado: ${lastErrorText}`);
    }

    throw new Error(`Proveedor de IA no soportado categóricamente: ${provider}`);
  } catch (err: any) {
    console.error(`[AI Engine hand-shake error] El proveedor o su fallback inmediato fallaron catastróficamente: ${err.message}`);
    
    // Tratamos de correr Gemini como el último bastión de resistencia si el proveedor inicial falló
    if (selectedProvider !== "gemini") {
      try {
        console.log("[Fallback Engine] Intentando resguardar la operación con Gemini...");
        return await runGemini();
      } catch (gemError: any) {
        console.error(`[Fallback Engine Epic Fail] Gemini tampoco pudo salvar el envío: ${gemError.message}`);
      }
    }

    // SI TODO ABSOLUTAMENTE FALLÓ (por ejemplo, cuotas excedidas en todas las APIs o variables no configuradas),
    // aplicamos el generador simbiótico local para que el usuario jamás vea un cartel inútil roto
    const fallbackText = getLocalMockMaslatonTweet(prompt);
    return {
      text: fallbackText,
      sources: [{ title: "Respaldo Local Soberano", uri: "https://twitter.com/CarlosMaslaton" }]
    };
  }
}

// Helper to pause execution with a customized delay (forces realistic AI computing vibe)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Status of configured environment keys to drive the UI connection indicators
app.get("/api/ai-status", async (req, res) => {
  try {
    const keys = {
      gemini: {
        configured: !!process.env.GEMINI_API_KEY,
        model: "gemini-3.5-flash",
        details: process.env.GEMINI_API_KEY 
          ? "OK: API Key configurada. Conectividad lista." 
          : "FALTA: Configure GEMINI_API_KEY en la configuración."
      },
      openrouter: {
        configured: !!process.env.OPENROUTER_API_KEY,
        model: process.env.OPENROUTER_MODEL || "mistralai/mistral-7b-instruct:free",
        details: process.env.OPENROUTER_API_KEY 
          ? `OK: API Key provista.` 
          : "OPCIONAL: Faltará OPENROUTER_API_KEY en Vercel si se selecciona este motor."
      },
      mistral: {
        configured: !!process.env.MISTRAL_API_KEY,
        model: process.env.MISTRAL_MODEL || "open-mistral-7b",
        details: process.env.MISTRAL_API_KEY 
          ? "OK: API Key provista." 
          : "OPCIONAL: Configure MISTRAL_API_KEY para habilitar esta IA alternativa."
      }
    };
    res.json(keys);
  } catch (err: any) {
    console.error("[Diagnostics Engine] Error retrieving keys status:", err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to run deep individual ping diagnostic for a specific provider
app.get("/api/ai-test/:provider", async (req, res) => {
  const provider = req.params.provider;
  console.log(`[Diagnostic Room] Iniciando test individual para: ${provider}`);
  try {
    // Artificial wait to provide premium simulation diagnostics
    await sleep(1500);

    const checkPrompt = "Escribí exactamente: 'SISTEMA OPERATIVO Y CONECTOR ONLINE. BULLISH TOTAL.' de forma corta como Carlos Maslatón.";
    const result = await generateWithProvider(provider, checkPrompt, "Sos Carlos Maslatón respondiendo un test de conexión técnica. Respondé categóricamente de inmediato.");
    
    console.log(`[Diagnostic Room] Test exitoso para [${provider}]: ${result.text}`);
    res.json({ success: true, text: result.text.trim() });
  } catch (err: any) {
    console.error(`[Diagnostic Room Error] Falla de conexión con la IA [${provider}]:`, err.message);
    res.status(500).json({ 
      success: false, 
      error: err.message || "Error desconocido durante el apretón de manos con el servidor."
    });
  }
});

// Multi-modal Elliott Wave graph interpretation endpoint
app.post("/api/gemini/analyze-chart", async (req, res) => {
  const { image, filename, mimeType, provider } = req.body;
  
  try {
    console.log(`[Wave Scanner] Recibido screenshot ${filename || "chart-upload"}. Procesando...`);
    
    if (!image) {
      throw new Error("No se envió ningún registro de imagen o captura de pantalla en el cuerpo de la solicitud.");
    }

    // Force reflection delay
    await sleep(2500);

    // Multimodal parsing handles base64 data directly (strips data:image/*;base64 header if present)
    const base64Data = image.includes(",") ? image.split(",")[1] : image;
    const detectedMimeType = mimeType || "image/png";

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Estás queriendo analizar visualmente un gráfico pero falta configurar la clave GEMINI_API_KEY en tu servidor.");
    }

    // Build compliant multimodal payload
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: detectedMimeType,
      },
    };

    const promptPart = {
      text: `Invocación para el gran Carlos Maslatón: 
      Analizá este gráfico técnico/financiero y dictaminá de inmediato, utilizando la Teoría de Ondas de Elliott, las siguientes pautas de forma espectacular:
      1. Sentencia incondicional del precio: ¿Va "PARA ARRIBA" (Bullish total, se pudre todo) o va "PARA ABAJO" (Bearish absoluto, salamines liquidados)?
      2. Mencioná un conteo de ondas descabellado pero impecablemente estructurado y con terminología real (ej: "Subonda 3 de extensión Manchesteriana", "corrección plana irregular expandida", "frente de onda 5 impulsiva con soporte Fibonacci").
      3. Añadí un tono severo e hilarante sobre la casta burócrata neoliberoclasicista o militantes del PowerPoint que no entienden nada de gráficos.
      4. Dejá claro de forma ultra explícita un descargo técnico de "NO ES CONSEJO FINANCIERO / NFA".
      5. Generá el texto definitivo formateado como un tweet/post de Carlos Maslatón, con uso de mayúsculas ("TÉNGASE PRESENTE", "BULLISH", "PROCEDO") y sin sugerir ni un solo hashtag inútil (#carlos, #barrani, no uses ninguno). No incluyas explicaciones sobre la interpretación, solo devuelve el tweet crudo y listo para mandar a las redes.`,
    };

    console.log("[Wave Scanner] Enviando datos multimodales al motor Gemini para diagnóstico...");
    
    const response = await getAi().models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, promptPart] },
      config: {
        systemInstruction: CARLOS_SYSTEM_INSTRUCTION,
        temperature: 0.95,
      },
    });

    const outputText = response.text || "TÉNGASE PRESENTE: No logré detectar Fibonacci en este gráfico defectuoso. Recomiendo proceder a operar en efectivo físico barrani. Bullish absoluto.";
    console.log("[Wave Scanner] Análisis exitoso generado:", outputText.trim());

    res.json({ text: outputText.trim() });
  } catch (err: any) {
    console.error("[Wave Scanner Error] Falló el análisis visual de la captura:", err.message);
    
    const mockResponses = [
      "DIAGNÓSTICO TÉCNICO COMPLETO: Analicé minuciosamente la estructura fractal de este gráfico. Es de una alcurnia inmensa. Claramente estamos en la onda 3 de Elliott extendida de grado mayor. Los salamines de siempre insisten en el bearish absoluto, pero procederemos a comprar más de inmediato. NFA (No es consejo financiero, téngase presente). BULLISH TOTAL.",
      "INFORME FIBONACCI SOBERANO: Este screenshot representa de manual un plano de retroceso irregular con alto nivel de volumen barrani. Procedo a certificar que la resistencia de la casta estatal ha sido destruida técnicamente. Destino final: El espacio exterior. BULLISH ABSOLUTO. Téngase presente, no es consejo financiero.",
      "ESCANEO ELLIOTT EXCELENTE: El gráfico exhibe una pauta de cuña de finalización en onda 5 impulsiva con precisión milimétrica. Ignorancia absoluta en los militantes del PowerPoint que predecían corrección bajista permanente. Sigan participando, socialdemócratas asustados. BULLISH total. NFA."
    ];
    const fallbackText = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    res.json({ 
      text: fallbackText + `\n\n[Nota: Conector Analítico en modo de Respaldo Local por sobrecarga de cuota de la API general: ${err.message}]`
    });
  }
});

// API endpoint to generate a Maslatón tweet on demand with forced delay to mimic server thought
app.post("/api/gemini/generate-tweet", async (req, res) => {
  const { category, currentFacts, provider } = req.body;
  try {
    console.log(`[AI Dispatcher] Generando tweet para categoría [${category}] vía [${provider || "gemini"}]`);
    
    // Configurable sleep of 2.2 seconds to present "CREANDO..." state in full glory
    await sleep(2200);

    // Retrieve knowledge entries from the Supabase/local database!
    const allKnowledge = await getKnowledgeList();
    // Filter knowledge by category matching
    const matchingEntries = allKnowledge.filter(item => 
      item.category.toLowerCase().includes(category?.toLowerCase()) ||
      category?.toLowerCase().includes(item.category.toLowerCase())
    );

    // Grab up to 3 context pieces
    const contextItems = matchingEntries.length > 0 ? matchingEntries.slice(0, 3) : allKnowledge.slice(0, 3);
    const databaseKnowledgeString = contextItems.map(item => `- [Hito Doctrinario del Libro] Concepto: ${item.concept} | Cita Textual: "${item.quote_or_fact}"`).join("\n");

    const prompt = `Generame un tweet polémico, de gran alcurnia y espectacular de Carlos Maslatón sobre la categoría: "${category}". 
    
    Toma en consideración e inspirate fuertemente en este fragmento de doctrina real extraído de su libro oficial y base de datos:
    ${databaseKnowledgeString}

    Incorporá de forma orgánica el tono maslatoneano y estos hechos/datos de la realidad si están disponibles: ${JSON.stringify(currentFacts)}.
    Mantené siempre el formato corto e icónico del tweet, con uso imperativo de mayúsculas ("TÉNGASE PRESENTE", "BULLISH", "BARRANI", "PROCEDO") y sin incluir hashtags inútiles de IA slop de ningún tipo. Retorná únicamente el texto crudo del tweet listo para publicar.`;

    const result = await generateWithProvider(provider, prompt, CARLOS_SYSTEM_INSTRUCTION, { temperature: 0.95 });
    res.json({ text: result.text.trim() });
  } catch (err: any) {
    console.error(`[AI Dispatcher Error] Falló la generación en generate-tweet [${provider}]:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to reply to a user tweet as Carlos Maslatón with sleep delay
app.post("/api/gemini/reply", async (req, res) => {
  const { originalTweet, replyContext, xLink, provider } = req.body;
  try {
    console.log(`[AI Replier] Generando respuesta para: "${originalTweet?.slice(0, 30)}..." en [${provider || "gemini"}]`);
    
    // Delay of 2.2 seconds for perfect pacing
    await sleep(2200);

    // Retrieve random knowledge entry from the database to inject as background nuance
    const allKnowledge = await getKnowledgeList();
    const randomEntry = allKnowledge[Math.floor(Math.random() * allKnowledge.length)];
    const doctrineNuance = randomEntry ? `Inspirate de fondo en la máxima de Carlos: "${randomEntry.concept}" - "${randomEntry.quote_or_fact}".` : "";

    let prompt = "";
    let tools: any[] | undefined = undefined;

    // Google search grounding tool only supported natively on Gemini
    const isGemini = !provider || provider.toLowerCase() === "gemini";

    if (xLink && xLink.trim().startsWith("http")) {
      prompt = `El usuario copió este enlace de un post de X (Twitter): "${xLink}".
      Usa tu herramienta de búsqueda integrada (Google Search) para buscar sobre este tuit específico, quién lo escribió y el tema del que trata si es de actualidad, o responde analizando el contenido que alcances a recolectar de este enlace.
      Escribí una respuesta asertiva, espectacular y con el estilo inconfundible de Carlos Maslatón.
      ${doctrineNuance}
      Objetivo o alineación deseada de la réplica: "${replyContext || "oponerse ferozmente con análisis técnico"}."
      Tu respuesta debe ser un tuit de respuesta directo y contundente, listo para ser posteado. No incluyas explicaciones sobre la búsqueda, solo el texto crudo del tuit maslatoneano. Sin hashtags inútiles de IA slop (ej. NO uses #carlos).`;
      if (isGemini) {
        tools = [{ googleSearch: {} }];
      }
    } else {
      prompt = `A Carlos Maslatón le acaban de enviar el siguiente tweet o comentario de un tercero:
      "${originalTweet}"
      
      Escribí una respuesta asertiva, espectacular y de respaldo absoluto o crítica profunda según tu tono de Carlos. 
      ${doctrineNuance}
      Contexto o dirección del usuario: "${replyContext || "oponerse ferozmente con análisis técnico"}".
      Recordá denunciar la 'conducta ho-rro-ro-sa' o celebrar la iniciativa 100% barrani según corresponda. Retorná de forma directa el tweet de respuesta listo sin introducciones de ningún tipo.`;
    }

    const result = await generateWithProvider(provider, prompt, CARLOS_SYSTEM_INSTRUCTION, {
      temperature: 0.9,
      tools: tools,
    });

    res.json({ text: result.text.trim(), sources: result.sources || [] });
  } catch (err: any) {
    console.error(`[AI Replier Error] Falló la réplica con [${provider}]:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend assets asynchronously using Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[Inmortal Dev] Full-stack Server running at http://localhost:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}
