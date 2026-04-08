// Normaliza acentos e caixa para comparar títulos
const norm = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

// Remove tudo que não é dígito
const onlyDigits = (s: string) => s.replace(/\D+/g, "");

// Busca EXATA por número do hino
export function filterHinosByExactNumber(hinos: any[], query: string) {
  const q = onlyDigits(query.trim());     // mantém só dígitos (ignora espaços, traços etc.)
  if (q.length === 0) return hinos;       // vazio -> lista completa
  const n = Number(q);                    // "070" -> 70
  if (!Number.isFinite(n)) return [];     // segurança

  return hinos.filter(h => Number(h.numero) === n);
}

// Função de busca robusta para hinos (DEPRECATED - usar filterHinosByExactNumber)
export function searchHinos(hinos: any[], queryRaw: string) {
  return filterHinosByExactNumber(hinos, queryRaw);
}

// Função para busca global (usada na home) - busca em letras também
export function searchInLyrics(hino: { numero: number; titulo: string; letra: string }, query: string): boolean {
  if (!query.trim()) return true;
  
  const trimmedQuery = query.trim();
  const normalizedQuery = norm(trimmedQuery);
  
  // Busca no número (exato)
  if (/^\d+$/.test(trimmedQuery) && hino.numero.toString() === trimmedQuery) {
    return true;
  }
  
  // Busca no título
  if (norm(hino.titulo).includes(normalizedQuery)) {
    return true;
  }
  
  // Busca na letra
  if (norm(hino.letra).includes(normalizedQuery)) {
    return true;
  }
  
  return false;
}

// Função normalizeText para compatibilidade
export function normalizeText(text: string): string {
  return norm(text);
}

// Função searchMatch para compatibilidade (não usada mais)
export function searchMatch(text: string, query: string): boolean {
  if (!query.trim()) return true;
  const normalizedText = norm(text);
  const normalizedQuery = norm(query.trim());
  return normalizedText.includes(normalizedQuery);
}