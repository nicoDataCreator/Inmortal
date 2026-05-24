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
    quote_or_fact: "La Subonda 3 de una tendencia al alza es la fase más destructiva de osos, de mayor acumulación de capital y donde se consolida la riqueza soberana incondicional.",
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
    category: "Personal & Filosofía",
    concept: "Ladrillazos al Cerebro",
    quote_or_fact: "No se puede perder el tiempo en la vida leyendo libros, verdaderos ladrillazos al cerebro que dañan la formación de cualquier joven. Celebro que Twitter haya reventado a todos los autodenominados intelectuales que pretendieron adueñarse de la realidad.",
    historical_context: "Doctrina mítica contra la vanidad académica e intelectual desvinculada del mercado práctico.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-5",
    category: "Personal & Filosofía",
    concept: "Destrucción de Libros",
    quote_or_fact: "En mi caso, respecto de los libros de papel que he leído en mi vida, no doblo sus hojas, ni los marco con lápiz o birome. Los iba procesando de a poco, o sea: leía capítulos enteros, los separaba del principal, y destruía sus hojas o las quemaba hasta que no quedaran rastros.",
    historical_context: "Hábito radical de asimilación intelectual de Carlos expuesto en su libro.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-6",
    category: "Personal & Filosofía",
    concept: "La UBA: la mejor universidad del mundo",
    quote_or_fact: "La UBA no es la mejor universidad de Iberoamérica sino del mundo. Hay cinco razones fundamentales para mí: 1) hay mucha gente habitándola a toda hora; 2) se puede hacer kilombo y todo bien; 3) es una escuela para la vida y la política; 4) es muy divertida; 5) las minas que van son espectaculares.",
    historical_context: "Ferviente defensa maslatoniana a la universidad pública estatal frente a las privadas.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-7",
    category: "Personal & Filosofía",
    concept: "Técnica de Bañado Definitiva",
    quote_or_fact: "Se me ha preguntado decenas de veces cuál es la técnica de bañado personal que utilizo: 1) Mojada general del cuerpo por 40 segundos. 2) Primera enjabonada general, con jabón blanco en pan, raspando la cabeza con las uñas. 3) Primera enjuagada rápida. 4) Segunda enjabonada general, bien fuerte. 5) Enjuagada fina. Por lo tanto: cero desodorante y cero perfume, el cuerpo ya ha quedado limpísimo.",
    historical_context: "Riguroso protocolo de higiene extraído de su capítulo de Usos y Costumbres.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-8",
    category: "Soda & Costanera",
    concept: "La soda destructora de sifón",
    quote_or_fact: "La soda de sifón con gas destructor, recontra helada, es indispensable para acompañar cualquier plato. Pedir agua mineral con gas es una mariconada típica que los mozos de perfil colectivista te quieren encajar.",
    historical_context: "Filosofía culinaria nacional y defensa mítica de la mesa tradicional argentina.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-9",
    category: "Anti-Comunismo & Casta",
    concept: "La nefasta casta de gerentes de PowerPoint",
    quote_or_fact: "Los gerentes corporativos de recursos humanos no hacen ni dejan hacer. Temen que queden expuestas su inutilidad cerebral y su vagancia psicomotriz de origen, que vuelcan en 'PowerPoints' para impresionar, pero que no sirven para nada.",
    historical_context: "Crítica maslatoniana definitiva contra la tecnocracia gerencial moderna.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-10",
    category: "100% Barrani & Efis",
    concept: "No estudiar economía en universidades",
    quote_or_fact: "Aclaro que nunca estudié economía ni finanzas en ninguna parte del mundo. No estoy para ir a escuchar pelotudeces a la universidad. Soy meramente un hombre del mercado y un judío especulador del estrato más bajo de la sociedad. Soy el capitalismo.",
    historical_context: "Doctrina mítica de Carlos sobre su origen puramente empírico y bursátil.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-11",
    category: "Personal & Filosofía",
    concept: "Sábanas I: Gente socialdemócrata",
    quote_or_fact: "¿Ustedes duermen en sus camas con las sábanas, frazadas y acolchados sueltos de tal manera de maniobrarlos a voluntad durante la noche? La cama liberada es un síntoma de liberalismo político y económico. La sábana pegada es de gente socialdemócrata que no sabe lo que quiere.",
    historical_context: "Análisis conceptual del sueño libre expuesto en 'Téngase Presente'.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-12",
    category: "Soda & Costanera",
    concept: "El peor café del mundo",
    quote_or_fact: "El café que se sirve en la Argentina no es tan solo malo, es directamente el peor del mundo. No hay ningún otro país con un café tan horrible, inclusive las cadenas internacionales Starbucks son incapaces de reproducir aquí las calidades básicas. Sin duda, la falla es humana.",
    historical_context: "Observación urbana inapelable sobre la gastronomía nacional.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-13",
    category: "Anti-Comunismo & Casta",
    concept: "Sintonizar al enemigo (Radio Pekín)",
    quote_or_fact: "El comunismo ha sido un desastre con la represión y la muerte. Pero para definir al enemigo hay que conocerlo. Corría 1973 y yo escuchaba con devoción Radio Pekín en idioma español sintonizando ondas cortas. Me enviaban kilos de folletería del X Congreso del Partido Comunista de China.",
    historical_context: "Memorias de su juventud como radioescucha y corresponsal por correspondencia.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-14",
    category: "Personal & Filosofía",
    concept: "No busco amigos sino enemigos",
    quote_or_fact: "Téngase presente. No busco sumar amigos sino enemigos. Más enemigos, mejor todavía. Mi madre nunca lo entendió y estuvo por años horrorizada por mi permanente búsqueda de conflicto. Cuanta más gente en contra tenga, mejor me siento en la vida. Soy indestructible, invencible e inmortal.",
    historical_context: "Declaraciones de principios vitales e incondicionales del maestro.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-15",
    category: "Personal & Filosofía",
    concept: "O hacés diez cosas al mismo tiempo, o te morís",
    quote_or_fact: "Desde chico estoy diseñado para hacer muchas cosas diferentes al mismo tiempo. La hipercomunicación del siglo XXI no me sorprendió ni me desequilibró. O hacés diez cosas al mismo tiempo, o te morís. No hay término medio.",
    historical_context: "Máxima maslatoniana sobre la intensidad vital requerida para operar en el siglo XXI.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-16",
    category: "100% Barrani & Efis",
    concept: "Mandarinas: una tremenda desgracia",
    quote_or_fact: "Detesto la mandarina y a todos los consumidores de mandarina, son todos una manga de roñosos. Mi esposa se ha convertido, desgraciadamente, en contraposición a mi discurso público, en una mandarinera que deja la casa impregnada con ese olor a fermento podrido insoportable.",
    historical_context: "Queja mítica hogareña extraída de las páginas de su libro.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-17",
    category: "Elliot Waves & Mercados",
    concept: "Los 55 años de Fibonacci en el Bear Market",
    quote_or_fact: "Estructura Técnica del Gran Bear Market Argentino: 55 años de Fibonacci en conteo cíclico de la historia nacional desde la Noche de los Bastones Largos en julio de 1966. El mercado de acciones es incondicionalmente Bullish por razones técnicas.",
    historical_context: "Vaticinio exacto formulado por Maslatón antes del despegue bursátil argentino.",
    created_at: new Date().toISOString()
  },
  {
    id: "kb-18",
    category: "Personal & Filosofía",
    concept: "El órgano sexual por excelencia",
    quote_or_fact: "Téngase presente. El órgano sexual masculino por excelencia no se denomina 'pito', como escriben algunos desubicados o desubicadas que la van de finos o de finas. Los nombres correctos son: 'pija', 'poronga' o 'janune'.",
    historical_context: "Doctrina de precisión lingüística y moral de Carlos expuesta en su libro.",
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

-- Limpiar políticas viejas si se vuelven a crear
DROP POLICY IF EXISTS "Lectura pública de doctrinas" ON carlos_book_knowledge;
DROP POLICY IF EXISTS "Inserción pública de doctrinas" ON carlos_book_knowledge;
DROP POLICY IF EXISTS "Borrado público de doctrinas" ON carlos_book_knowledge;

CREATE POLICY "Lectura pública de doctrinas" 
ON carlos_book_knowledge FOR SELECT 
USING (true);

CREATE POLICY "Inserción pública de doctrinas" 
ON carlos_book_knowledge FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Borrado público de doctrinas" 
ON carlos_book_knowledge FOR DELETE 
USING (true);

-- ALIMENTAR SEED DATA: 18 doctrinas extraídas del PDF original de Carlos Maslatón "Téngase Presente":
INSERT INTO carlos_book_knowledge (category, concept, quote_or_fact, historical_context) 
VALUES
('Elliot Waves & Mercados', 'La Subonda 3 Súper Impulsiva', 'La Subonda 3 de una tendencia al alza es la fase más destructiva de osos, de mayor acumulación de capital y donde se consolida la riqueza soberana incondicional.', 'Análisis técnico de Ondas de Elliott aplicado al bull market argentino y criptográfico.'),

('Elliot Waves & Mercados', 'La capitulación de los osos', 'Los mercados tocan su piso definitivo de cotización cuando el pesimismo de los militantes del PowerPoint es absoluto y deciden liquidar sus posiciones asustados.', 'Fundamentos psicológicos de la Teoría de Ondas sobre la capitulación especulativa.'),

('100% Barrani & Efis', 'Apología del Dinero Barrani', 'La transacción en efectivo físico, en negro, eludiendo impuestos abusivos del Estado, es el acto de resistencia individual y libertad capitalista más puro de la civilización.', 'Manifiesto contra la hiper-regulación estatal y afición por el circuito informal legítimo.'),

('Personal & Filosofía', 'Ladrillazos al Cerebro', 'No se puede perder el tiempo en la vida leyendo libros, verdaderos ladrillazos al cerebro que dañan la formación de cualquier joven. Celebro que Twitter haya reventado a todos los autodenominados intelectuales que pretendieron adueñarse de la realidad.', 'Doctrina mítica contra la vanidad académica e intelectual desvinculada del mercado práctico.'),

('Personal & Filosofía', 'Destrucción de Libros', 'En mi caso, respecto de los libros de papel que he leído en mi vida, no doblo sus hojas, ni los marco con lápiz o birome. Los iba procesando de a poco, o sea: leía capítulos enteros, los separaba del principal, y destruía sus hojas o las quemaba hasta que no quedaran rastros.', 'Hábito radical de asimilación intelectual de Carlos expuesto en su libro.'),

('Personal & Filosofía', 'La UBA: la mejor universidad del mundo', 'La UBA no es la mejor universidad de Iberoamérica sino del mundo. Hay cinco razones fundamentales para mí: 1) hay mucha gente habitándola a toda hora; 2) se puede hacer kilombo y todo bien; 3) es una escuela para la vida y la política; 4) es muy divertida; 5) las minas que van son espectaculares.', 'Ferviente defensa maslatoniana a la universidad pública estatal frente a las privadas.'),

('Personal & Filosofía', 'Técnica de Bañado Definitiva', 'Se me ha preguntado decenas de veces cuál es la técnica de bañado personal que utilizo: 1) Mojada general del cuerpo por 40 segundos. 2) Primera enjabonada general, con jabón blanco en pan, raspando la cabeza con las uñas. 3) Primera enjuagada rápida. 4) Segunda enjabonada general, bien fuerte. 5) Enjuagada fina. Por lo tanto: cero desodorante y cero perfume, el cuerpo ya ha quedado limpísimo.', 'Riguroso protocolo de higiene extraído de su capítulo de Usos y Costumbres.'),

('Soda & Costanera', 'La soda destructora de sifón', 'La soda de sifón con gas destructor, recontra helada, es indispensable para acompañar cualquier plato. Pedir agua mineral con gas es una mariconada típica que los mozos de perfil colectivista te quieren encajar.', 'Filosofía culinaria nacional y defensa mítica de la mesa tradicional argentina.'),

('Anti-Comunismo & Casta', 'La nefasta casta de gerentes de PowerPoint', 'Los gerentes corporativos de recursos humanos no hacen ni dejan hacer. Temen que queden expuestas su inutilidad cerebral y su vagancia psicomotriz de origen, que vuelcan en ''PowerPoints'' para impresionar, pero que no sirven para nada.', 'Crítica maslatoniana definitiva contra la tecnocracia gerencial moderna.'),

('100% Barrani & Efis', 'No estudiar economía en universidades', 'Aclaro que nunca estudié economía ni finanzas en ninguna parte del mundo. No estoy para ir a escuchar pelotudeces a la universidad. Soy meramente un hombre del mercado y un judío especulador del estrato más bajo de la sociedad. Soy el capitalismo.', 'Doctrina mítica de Carlos sobre su origen puramente empírico y bursátil.'),

('Personal & Filosofía', 'Sábanas I: Gente socialdemócrata', '¿Ustedes duermen en sus camas con las sábanas, frazadas y acolchados sueltos de tal manera de maniobrarlos a voluntad durante la noche? La cama liberada es un síntoma de liberalismo político y económico. La sábana pegada es de gente socialdemócrata que no sabe lo que quiere.', 'Análisis conceptual del sueño libre expuesto en ''Téngase Presente''.'),

('Soda & Costanera', 'El peor café del mundo', 'El café que se sirve en la Argentina no es tan solo malo, es directamente el peor del mundo. No hay ningún otro país con un café tan horrible, inclusive las cadenas internacionales Starbucks son incapaces de reproducir aquí las calidades básicas. Sin duda, la falla es humana.', 'Observación urbana inapelable sobre la gastronomía nacional.'),

('Anti-Comunismo & Casta', 'Sintonizar al enemigo (Radio Pekín)', 'El comunismo ha sido un desastre con la represión y la muerte. Pero para definir al enemigo hay que conocerlo. Corría 1973 y yo escuchaba con devoción Radio Pekín en idioma español sintonizando ondas cortas. Me enviaban kilos de folletería del X Congreso del Partido Comunista de China.', 'Memorias de su juventud como radioescucha y corresponsal por correspondencia.'),

('Personal & Filosofía', 'No busco amigos sino enemigos', 'Téngase presente. No busco sumar amigos sino enemigos. Más enemigos, mejor todavía. Mi madre nunca lo entendió y estuvo por años horrorizada por mi permanente búsqueda de conflicto. Cuanta más gente en contra tenga, mejor me siento en la vida. Soy indestructible, invencible e inmortal.', 'Declaraciones de principios vitales e incondicionales del maestro.'),

('Personal & Filosofía', 'O hacés diez cosas al mismo tiempo, o te morís', 'Desde chico estoy diseñado para hacer muchas cosas diferentes al mismo tiempo. La hipercomunicación del siglo XXI no me sorprendió ni me desequilibró. O hacés diez cosas al mismo tiempo, o te morís. No hay término medio.', 'Máxima maslatoniana sobre la intensidad vital requerida para operar en el siglo XXI.'),

('100% Barrani & Efis', 'Mandarinas: una tremenda desgracia', 'Detesto la mandarina y a todos los consumidores de mandarina, son todos una manga de roñosos. Mi esposa se ha convertido, desgraciadamente, en contraposición a mi discurso público, en una mandarinera que deja la casa impregnada con ese olor a fermento podrido insoportable.', 'Queja mítica hogareña extraída de las páginas de su libro.'),

('Elliot Waves & Mercados', 'Los 55 años de Fibonacci en el Bear Market', 'Estructura Técnica del Gran Bear Market Argentino: 55 años de Fibonacci en conteo cíclico de la historia nacional desde la Noche de los Bastones Largos en julio de 1966. El mercado de acciones es incondicionalmente Bullish por razones técnicas.', 'Vaticinio exacto formulado por Maslatón antes del despegue bursátil argentino.'),

('Personal & Filosofía', 'El órgano sexual por excelencia', 'Téngase presente. El órgano sexual masculino por excelencia no se denomina ''pito'', como escriben algunos desubicados o desubicadas que la van de finos o de finas. Los nombres correctos son: ''pija'', ''poronga'' o ''janune''.', 'Doctrina de precisión lingüística y moral de Carlos expuesta en su libro.')
ON CONFLICT DO NOTHING;
  `.trim();
}
