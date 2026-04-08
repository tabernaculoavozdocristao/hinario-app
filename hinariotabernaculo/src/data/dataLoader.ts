// src/data/dataLoader.ts
// Tipos
export type Hino = {
  numero: number;
  titulo: string;
  slugHinario: string;
  letra: string;
  letraHtml?: string;
};

// Cache global de hinos em memória
let GLOBAL_HINOS_CACHE: Hino[] | null = null;
let CACHE_LOADED = false;

// Força limpeza do cache na inicialização - TIMESTAMP: 2025-01-27 19:45
GLOBAL_HINOS_CACHE = null;
CACHE_LOADED = false;

// Função para forçar limpeza do cache
export function clearCache() {
  GLOBAL_HINOS_CACHE = null;
  CACHE_LOADED = false;
  console.log('🗑️ Cache limpo - próxima busca recarregará os dados');
}

// Função para normalizar um item de hino de qualquer formato semelhante
function normalizeHino(h: any): Hino | null {
  if (!h) return null;
  const numero = Number(h.numero ?? 0);
  const titulo = String(h.titulo ?? "").trim();
  const slug = String(h.slugHinario ?? "").trim().toLowerCase();
  const letra = String(h.letra ?? "");
  const letraHtml = h.letraHtml ? String(h.letraHtml) : undefined;
  if (!numero || !slug) return null;
  return { numero, titulo, slugHinario: slug, letra, letraHtml };
}

// Util: BASE_URL com barra final
function baseUrl(): string {
  const b = import.meta.env.BASE_URL || "/";
  return b.endsWith("/") ? b : b + "/";
}

// Fetch JSON com validação de conteúdo
async function fetchJsonStrict<T>(path: string): Promise<T> {
  const url = `${baseUrl()}${path.replace(/^\//, "")}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  const ct = res.headers.get("Content-Type") || "";
  const text = await res.text();
  const first = text.trim()[0];
  if (!/json/i.test(ct) && first !== "{" && first !== "[") {
    throw new Error(`Not JSON: ${url}`);
  }
  return JSON.parse(text) as T;
}

// Tipo para o índice de hinos
type HinosIndexEntry = {
  file: string;
  start: number;
  end: number;
  count: number;
};

// Carrega TODOS os hinos dos blocos dinamicamente
export async function loadHinosSmart(): Promise<Hino[]> {
  // Força recarregamento se cache foi limpo ou não existe
  const shouldReload = !CACHE_LOADED || !GLOBAL_HINOS_CACHE;
  
  if (!shouldReload) {
    console.log('📚 Retornando hinos do cache em memória:', GLOBAL_HINOS_CACHE.length);
    return GLOBAL_HINOS_CACHE;
  }
  
  console.log('📚 Carregando hinos dos arquivos (cache limpo)...');
  const all: Hino[] = [];

  try {
    // Carrega o índice de arquivos
    const index = await fetchJsonStrict<HinosIndexEntry[]>("data/hinos_index.json");
    
    // Carrega todos os blocos baseado no índice
    for (const entry of index) {
      try {
        const json = await fetchJsonStrict<any>(`data/${entry.file}`);
        const arr = Array.isArray(json) ? json : [];
        const norm = arr.map(normalizeHino).filter((x): x is Hino => !!x);
        all.push(...norm);
      } catch (e) {
        console.error(`ERRO ao carregar arquivo ${entry.file}:`, e);
      }
    }
  } catch (e) {
    console.error("ERRO ao carregar hinos_index.json:", e);
    // Fallback para lista hardcoded se o índice falhar
    const fallbackFiles = [
      "hinos_001.json",
      "hinos_102.json", 
      "hinos_202.json",
      "hinos_302.json",
      "hinos_403.json",
      "hinos_503.json",
      "hinos_604.json",
      "hinos_705.json",
      "hinos_806.json"
    ];
    
    for (const file of fallbackFiles) {
      try {
        const json = await fetchJsonStrict<any>(`data/${file}`);
        const arr = Array.isArray(json) ? json : [];
        const norm = arr.map(normalizeHino).filter((x): x is Hino => !!x);
        all.push(...norm);
      } catch (e) {
        console.error(`ERRO ao carregar arquivo ${file}:`, e);
      }
    }
  }

  // Ordena por número
  all.sort((a, b) => a.numero - b.numero);
  
  // Salva no cache global
  GLOBAL_HINOS_CACHE = all;
  CACHE_LOADED = true;
  
  console.log('📚 Hinos carregados e cache atualizado:', all.length);
  return all;
}

// Helpers
export async function getHinosBySlug(slug: string): Promise<Hino[]> {
  const list = await loadHinosSmart();
  const s = slug.trim().toLowerCase();
  const filtered = list.filter(h => h.slugHinario === s).sort((a,b)=>a.numero-b.numero);
  console.log(`🎵 Hinos do slug "${s}":`, filtered.length);
  return filtered;
}

export async function getHinoByNumero(slug: string, numero: number): Promise<Hino | undefined> {
  const list = await getHinosBySlug(slug);
  const hino = list.find(h => h.numero === numero);
  if (hino) {
    console.log(`🎼 Hino encontrado ${numero}:`, hino.titulo);
  }
  return hino;
}

export async function loadHinarios() {
  try {
    const json = await fetchJsonStrict<any[]>("data/hinarios.json");
    return Array.isArray(json) ? json : [];
  } catch (e) {
    console.error("Erro ao carregar hinarios.json:", e);
    return [];
  }
}