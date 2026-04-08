import { useState, useCallback } from 'react';
import { Navigation } from '../components/Navigation';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
import { BibleBook, BIBLE_BOOKS } from '../types/bible';
import { normalizeText } from '../utils/textUtils';

interface BibleSearchProps {
  onSelectResult: (book: BibleBook, chapter: number, verse?: number) => void;
  onBack: () => void;
}

interface SearchResult {
  type: 'reference' | 'text';
  book: BibleBook;
  chapter: number;
  verse?: number;
  text?: string;
  highlight?: string;
}

const BOOK_ALIASES: Record<string, string> = {
  'gn': 'genesis',
  'gen': 'genesis',
  'ex': 'exodus',
  'exodo': 'exodus',
  'lv': 'leviticus',
  'levitico': 'leviticus',
  'nm': 'numbers',
  'numeros': 'numbers',
  'dt': 'deuteronomy',
  'deuteronomio': 'deuteronomy',
  'js': 'joshua',
  'josue': 'joshua',
  'jz': 'judges',
  'juizes': 'judges',
  'rt': 'ruth',
  'rute': 'ruth',
  '1sm': '1samuel',
  '1 samuel': '1samuel',
  '2sm': '2samuel',
  '2 samuel': '2samuel',
  '1rs': '1kings',
  '1 reis': '1kings',
  '2rs': '2kings',
  '2 reis': '2kings',
  '1cr': '1chronicles',
  '1 cronicas': '1chronicles',
  '2cr': '2chronicles',
  '2 cronicas': '2chronicles',
  'ed': 'ezra',
  'esdras': 'ezra',
  'ne': 'nehemiah',
  'neemias': 'nehemiah',
  'et': 'esther',
  'ester': 'esther',
  'jo': 'job',
  'sl': 'psalms',
  'salmos': 'psalms',
  'salmo': 'psalms',
  'pv': 'proverbs',
  'proverbios': 'proverbs',
  'ec': 'ecclesiastes',
  'eclesiastes': 'ecclesiastes',
  'ct': 'song-of-solomon',
  'canticos': 'song-of-solomon',
  'cantares': 'song-of-solomon',
  'is': 'isaiah',
  'isaias': 'isaiah',
  'jr': 'jeremiah',
  'jeremias': 'jeremiah',
  'lm': 'lamentations',
  'lamentacoes': 'lamentations',
  'ez': 'ezekiel',
  'ezequiel': 'ezekiel',
  'dn': 'daniel',
  'os': 'hosea',
  'oseias': 'hosea',
  'jl': 'joel',
  'am': 'amos',
  'ob': 'obadiah',
  'obadias': 'obadiah',
  'jn': 'jonah',
  'jonas': 'jonah',
  'mq': 'micah',
  'miqueias': 'micah',
  'na': 'nahum',
  'naum': 'nahum',
  'hc': 'habakkuk',
  'habacuque': 'habakkuk',
  'sf': 'zephaniah',
  'sofonias': 'zephaniah',
  'ag': 'haggai',
  'ageu': 'haggai',
  'zc': 'zechariah',
  'zacarias': 'zechariah',
  'ml': 'malachi',
  'malaquias': 'malachi',
  'mt': 'matthew',
  'mateus': 'matthew',
  'mc': 'mark',
  'marcos': 'mark',
  'lc': 'luke',
  'lucas': 'luke',
  'joao': 'john',
  'at': 'acts',
  'atos': 'acts',
  'rm': 'romans',
  'romanos': 'romans',
  '1co': '1corinthians',
  '1 corintios': '1corinthians',
  '2co': '2corinthians',
  '2 corintios': '2corinthians',
  'gl': 'galatians',
  'galatas': 'galatians',
  'ef': 'ephesians',
  'efesios': 'ephesians',
  'fp': 'philippians',
  'filipenses': 'philippians',
  'cl': 'colossians',
  'colossenses': 'colossians',
  '1ts': '1thessalonians',
  '1 tessalonicenses': '1thessalonians',
  '2ts': '2thessalonians',
  '2 tessalonicenses': '2thessalonians',
  '1tm': '1timothy',
  '1 timoteo': '1timothy',
  '2tm': '2timothy',
  '2 timoteo': '2timothy',
  'tt': 'titus',
  'tito': 'titus',
  'fm': 'philemon',
  'filemom': 'philemon',
  'hb': 'hebrews',
  'hebreus': 'hebrews',
  'tg': 'james',
  'tiago': 'james',
  '1pe': '1peter',
  '1 pedro': '1peter',
  '2pe': '2peter',
  '2 pedro': '2peter',
  '1jo': '1john',
  '1 joao': '1john',
  '2jo': '2john',
  '2 joao': '2john',
  '3jo': '3john',
  '3 joao': '3john',
  'jd': 'jude',
  'judas': 'jude',
  'ap': 'revelation',
  'apocalipse': 'revelation',
};

function findBookByQuery(query: string): BibleBook | null {
  const normalized = normalizeText(query.toLowerCase().trim());

  if (BOOK_ALIASES[normalized]) {
    return BIBLE_BOOKS.find(b => b.id === BOOK_ALIASES[normalized]) || null;
  }

  for (const book of BIBLE_BOOKS) {
    const bookNameNorm = normalizeText(book.name.toLowerCase());
    const bookAbbrevNorm = normalizeText(book.abbrev.toLowerCase());
    const bookIdNorm = book.id.toLowerCase();

    if (bookNameNorm === normalized || bookAbbrevNorm === normalized || bookIdNorm === normalized) {
      return book;
    }
  }

  for (const book of BIBLE_BOOKS) {
    const bookNameNorm = normalizeText(book.name.toLowerCase());
    if (bookNameNorm.startsWith(normalized) || normalized.startsWith(bookNameNorm)) {
      return book;
    }
  }

  return null;
}

function parseReference(query: string): { book: BibleBook; chapter?: number; verse?: number } | null {
  const normalized = query.trim();

  const refPatterns = [
    /^(.+?)\s+(\d+)\s*:\s*(\d+)$/,
    /^(.+?)\s+(\d+)\s*[.,]\s*(\d+)$/,
    /^(.+?)\s+(\d+)$/,
    /^(.+?)(\d+)\s*:\s*(\d+)$/,
    /^(.+?)(\d+)$/,
  ];

  for (const pattern of refPatterns) {
    const match = normalized.match(pattern);
    if (match) {
      const bookPart = match[1].trim();
      const chapter = parseInt(match[2], 10);
      const verse = match[3] ? parseInt(match[3], 10) : undefined;

      const book = findBookByQuery(bookPart);
      if (book && chapter >= 1 && chapter <= book.chapters) {
        return { book, chapter, verse };
      }
    }
  }

  const book = findBookByQuery(normalized);
  if (book) {
    return { book };
  }

  return null;
}

export function BibleSearch({ onSelectResult, onBack }: BibleSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchTextInBible = useCallback(async (query: string): Promise<SearchResult[]> => {
    const results: SearchResult[] = [];
    const searchTermNormalized = normalizeText(query.toLowerCase());
    const maxResults = 50;

    for (const book of BIBLE_BOOKS) {
      if (results.length >= maxResults) break;

      for (let chapter = 1; chapter <= book.chapters; chapter++) {
        if (results.length >= maxResults) break;

        try {
          const response = await fetch(`/data/bible/${book.id}/${chapter}.json`);
          if (!response.ok) continue;

          const data = await response.json();
          const verses = data.verses || [];

          for (const verse of verses) {
            if (results.length >= maxResults) break;

            const verseTextNormalized = normalizeText(verse.text.toLowerCase());
            if (verseTextNormalized.includes(searchTermNormalized)) {
              const startIndex = verseTextNormalized.indexOf(searchTermNormalized);
              const originalStart = Math.max(0, startIndex - 30);
              const originalEnd = Math.min(verse.text.length, startIndex + query.length + 50);

              let highlight = verse.text.substring(originalStart, originalEnd);
              if (originalStart > 0) highlight = '...' + highlight;
              if (originalEnd < verse.text.length) highlight = highlight + '...';

              results.push({
                type: 'text',
                book,
                chapter,
                verse: verse.verse,
                text: verse.text,
                highlight,
              });
            }
          }
        } catch {
          continue;
        }
      }
    }

    return results;
  }, []);

  const handleSearch = useCallback(async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    const ref = parseReference(trimmedQuery);
    if (ref) {
      setResults([{
        type: 'reference',
        book: ref.book,
        chapter: ref.chapter || 1,
        verse: ref.verse,
      }]);
      setLoading(false);
      return;
    }

    if (trimmedQuery.length >= 3) {
      const textResults = await searchTextInBible(trimmedQuery);
      setResults(textResults);
    } else {
      setResults([]);
    }

    setLoading(false);
  }, [searchQuery, searchTextInBible]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
      <Navigation
        title="Buscar na Biblia"
        showBack
        onBack={onBack}
      />

      <div className="bg-white dark:bg-slate-800/50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="text-center mb-6 animate-fade-in-up">
            <div className="w-14 h-14 rounded-2xl bg-gradient-wheat flex items-center justify-center mx-auto mb-4 shadow-md">
              <Search className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-serif mb-1">
              Buscar na Biblia
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Pesquise por referencia ou palavras
            </p>
          </div>

          <div className="animate-fade-in-up stagger-1">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Joao 3:16, Genesis 1, amor, no principio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-amber focus:border-brand-amber transition-all duration-200 shadow-sm"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full py-4 bg-gradient-wheat text-white font-semibold rounded-2xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-70"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
              Digite uma referencia (ex: Joao 3:16) ou palavras para buscar no texto
            </p>
          </div>
        </div>
      </div>

      <div className="page-container">
        <div className="mobile-content-spacing">
          {loading && (
            <LoadingSpinner message="Buscando nos textos..." />
          )}

          {!loading && results.length > 0 && (
            <div className="animate-fade-in">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
              </h3>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <button
                    key={`${result.book.id}-${result.chapter}-${result.verse || 0}-${index}`}
                    onClick={() => onSelectResult(result.book, result.chapter, result.verse)}
                    className="w-full flex items-start justify-between p-4 bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-brand-amber dark:hover:border-brand-amber transition-all duration-200 hover:shadow-md group text-left animate-fade-in-up"
                    style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-brand-amber flex-shrink-0 group-hover:bg-gradient-wheat group-hover:text-white transition-all duration-200 shadow-sm">
                        {result.book.abbrev}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {result.book.name} {result.chapter}
                          {result.verse && `:${result.verse}`}
                        </h4>
                        {result.type === 'text' && result.highlight && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            {result.highlight}
                          </p>
                        )}
                        {result.type === 'reference' && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {result.book.testament === 'old' ? 'Antigo Testamento' : 'Novo Testamento'}
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-brand-amber transition-colors flex-shrink-0 mt-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && hasSearched && results.length === 0 && searchQuery.trim() && (
            <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                Nenhum resultado encontrado para "{searchQuery}"
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Tente buscar por uma referencia (ex: Joao 3) ou outras palavras
              </p>
            </div>
          )}

          {!hasSearched && !loading && (
            <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-4">
                Busca inteligente da Biblia
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <p>Exemplos de busca:</p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  <span className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-brand-amber rounded-full text-xs font-medium">Joao 3:16</span>
                  <span className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-brand-amber rounded-full text-xs font-medium">Genesis 1</span>
                  <span className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-brand-amber rounded-full text-xs font-medium">Salmos</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  <span className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-brand-amber rounded-full text-xs font-medium">amor</span>
                  <span className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-brand-amber rounded-full text-xs font-medium">no principio</span>
                  <span className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-brand-amber rounded-full text-xs font-medium">Deus amou</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
