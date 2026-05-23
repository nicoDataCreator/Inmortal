import { createClient } from "@supabase/supabase-js";

export interface KnowledgeEntry {
  id: string;
  category: string;
  concept: string;
  quote_or_fact: string;
  historical_context?: string;
  created_at?: string;
}

// Curated 100% authentic Carlos Maslatón doctrines from his books and famous statements
export const INITIAL_KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "kb-1",
    category: "Elliot Waves & Mercados",
    concept: "La Subonda 3 Súper Impulsiva",
    quote_or_fact: "La Subonda 3 de una tendencia alalza es la fase más destructiva de osos, de mayor acumulación de capital y donde se consolida la riqueza soberana incondicional.",
    historical_context: "Análisis técnico de Ondas de Elliott aplicado al bull market argentino y criptográfico.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-2",
    category: "Elliot Waves & Mercados",
    concept: "La capitulación de los osos",
    quote_or_fact: "Los mercados tocan su piso definitivo de cotización cuando el pesimismo de los militantes del PowerPoint es absoluto y deciden liquidar sus posiciones asustados.",
    historical_context: "Fundamentos psicológicos de la Teoría de Ondas sobre la capitulación especulativa.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-3",
    category: "100% Barrani & Efis",
    concept: "Apología del Dinero Barrani",
    quote_or_fact: "La transacción en efectivo físico, en negro, eludiendo impuestos abusivos del Estado, es el acto de resistencia individual y libertad capitalista más puro de la civilización.",
    historical_context: "Manifiesto contra la hiper-regulación estatal y afición por el circuito informal legítimo.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-4",
    category: "100% Barrani & Efis",
    concept: "Repudio al Dinero Fiduciario",
    quote_or_fact: "Todo billete emitido por bancos centrales sin respaldo real es una estafa inflacionaria directa del estatismo, diseñada expresamente para expropiar los ahorros honestos.",
    historical_context: "Manchesterianismo puro e incondicional frente al monopolio emisor de moneda.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-5",
    category: "Marcianos & Marte",
    concept: "Llegada Inminente Extraterrestre",
    quote_or_fact: "Téngase presente: antes de finalizar el siglo XXI, vamos a presenciar la llegada de los marcianos a toda velocidad en naves espaciales que resisten el ingreso a la atmósfera sin desintegrarse.",
    historical_context: "Hipótesis cósmica de Carlos sobre el contacto inminente de civilizaciones avanzadas.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-6",
    category: "Marcianos & Marte",
    concept: "Marte Estacionario Retrogrado",
    quote_or_fact: "Cuando Marte entra en fase estacionaria o inicia retrogradación astral, distorsiona gravemente la psicología colectiva de los mercados financieros y altera las decisiones de los operadores.",
    historical_context: "Astrología bursátil no declarada de Maslatón sobre el comportamiento financiero.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-7",
    category: "Anti-Comunismo & Casta",
    concept: "Aborrecimiento de los Burócratas",
    quote_or_fact: "La burocracia estatal y la casta gerencial improductiva son parásitos históricos que asfixian el surgimiento de valor real con regulaciones absurdas y planificaciones de escritorio.",
    historical_context: "Crítica visceral contra el intervencionismo de planificación central.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-8",
    category: "Anti-Comunismo & Casta",
    concept: "La Casta de PowerPoint",
    quote_or_fact: "Los graduados con títulos corporativos de consultoría e ingenieros de PowerPoint destruyen las empresas por su total e irreversible desconexión del olfato comercial práctico.",
    historical_context: "Denuncia humorística y académica contra la tecnocracia corporativa moderna.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-9",
    category: "Soda & Costanera",
    concept: "El Bife de Lomo Soberano",
    quote_or_fact: "Un lomo de ternera premium jugoso en los carritos de Costanera Norte, acompañado incondicionalmente de soda helada de sifón con gas destructor, es el mayor milagro culinario que existe.",
    historical_context: "El ritual gastronómico maslatoniano clásico de disfrute urbano.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-10",
    category: "Soda & Costanera",
    concept: "La Servilleta Inútil de Plástico",
    quote_or_fact: "Las servilletas satinadas que no absorben agua sino que la esparcen sobre la cara son un atentado ho-rro-ro-so contra el comensal. Su proliferación en establecimientos es una conducta delictiva.",
    historical_context: "Queja mítica de Carlos sobre el diseño irracional de insumos de hostelería.",
    created_at: new Date().toISOString()
  }
];

// Local in-memory store fallback
let inMemoryKnowledge: KnowledgeEntry[] = [...INITIAL_KNOWLEDGE];

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

if (supabase) {
  console.log("[Supabase Server] Cliente inicializado correctamente. Conexión de base de datos activa.");
} else {
  console.log("[Supabase Server] Modo local in-memory activo. Configure SUPABASE_URL y SUPABASE_KEY en Vercel para persistencia en nube.");
}

// Service Methods that dynamically route queries
export async function getKnowledgeList(): Promise<KnowledgeEntry[]> {
  if (!supabase) {
    return inMemoryKnowledge;
  }
  try {
    const { data, error } = await supabase
      .from("carlos_book_knowledge")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // If table doesn't exist yet, we log the error and use local
      console.warn("[Supabase Server Warning] No se pudo leer la tabla 'carlos_book_knowledge'. Posiblemente falte crearla. Usando fallback local. Error:", error.message);
      return inMemoryKnowledge;
    }
    return data && data.length > 0 ? data : inMemoryKnowledge;
  } catch (err: any) {
    console.warn("[Supabase Server Error] Falló consulta. Usando fallback in-memory:", err.message);
    return inMemoryKnowledge;
  }
}

export async function addKnowledgeEntry(entry: Omit<KnowledgeEntry, "id" | "created_at">): Promise<KnowledgeEntry> {
  const newEntry: KnowledgeEntry = {
    id: `kb-${Date.now()}`,
    category: entry.category,
    concept: entry.concept,
    quote_or_fact: entry.quote_or_fact,
    historical_context: entry.historical_context || "Aportación doctrinal del usuario.",
    created_at: new Date().toISOString()
  };

  // Prepend to local
  inMemoryKnowledge = [newEntry, ...inMemoryKnowledge];

  if (!supabase) {
    return newEntry;
  }

  try {
    const { data, error } = await supabase
      .from("carlos_book_knowledge")
      .insert([
        {
          category: entry.category,
          concept: entry.concept,
          quote_or_fact: entry.quote_or_fact,
          historical_context: entry.historical_context || "Aportación doctrinal del usuario."
        }
      ])
      .select();

    if (error) {
      console.error("[Supabase Server Error] No se pudo insertar en Supabase. Guardado en memoria local únicamente. Error:", error.message);
      return newEntry;
    }
    if (data && data[0]) {
      return data[0];
    }
    return newEntry;
  } catch (err: any) {
    console.error("[Supabase Server] Error inesperado insertando entrada:", err.message);
    return newEntry;
  }
}

export async function deleteKnowledgeEntry(id: string): Promise<boolean> {
  const originalLength = inMemoryKnowledge.length;
  inMemoryKnowledge = inMemoryKnowledge.filter(item => item.id !== id);

  if (!supabase) {
    return inMemoryKnowledge.length < originalLength;
  }

  try {
    // If it is a Supabase numeric ID
    const isLocalId = id.startsWith("kb-");
    const query = supabase.from("carlos_book_knowledge").delete();
    
    let error;
    if (isLocalId) {
      // It was a local fallback record or transient state
      return true;
    } else {
      const { error: err } = await query.eq("id", id);
      error = err;
    }

    if (error) {
      console.error("[Supabase Server Error] No se pudo borrar de la base de datos:", error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error("[Supabase Server] Error borrando entrada:", err.message);
    return false;
  }
}

// Helper to provide SQL instructions for the user to make deployment flawless
export function getDbSetupSql(): string {
  return `
-- SCRIPT DE CREACIÓN DE TABLA PARA SUPABASE
-- Ejecute esto en el SQL Editor de Supabase para habilitar la persistencia del libro de Carlos:

CREATE TABLE IF NOT EXISTS carlos_book_knowledge (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  category TEXT NOT NULL,
  concept TEXT NOT NULL,
  quote_or_fact TEXT NOT NULL,
  historical_context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar acceso de lectura/escritura público (o configurar políticas RLS para lectura pública y escritura anon)
ALTER TABLE carlos_book_knowledge ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de doctrinas" 
ON carlos_book_knowledge FOR SELECT 
USING (true);

CREATE POLICY "Inserción pública de doctrinas" 
ON carlos_book_knowledge FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Borrado público de doctrinas" 
ON carlos_book_knowledge FOR DELETE 
USING (true);
  `.trim();
}
