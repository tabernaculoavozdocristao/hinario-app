import React, { useEffect, useMemo, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Search, Music, X, BookOpen } from 'lucide-react';
import { getHinosBySlug } from '../data/dataLoader';
import { searchInLyrics } from '../utils/textUtils';
import type { Hino } from '../data/dataLoader';

interface HinosListProps {
  slug: string;
  hinarioNome?: string;
  onSelectHino: (slug: string, numero: number) => void;
  onBack: () => void;
}

export function HinosList({ slug, hinarioNome, onSelectHino, onBack }: HinosListProps) {
  const [allHinos, setAllHinos] = useState<Hino[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const hinos = await getHinosBySlug(slug);
        if (!cancelled) setAllHinos(hinos);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar hinos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const results = useMemo(() => {
    if (!query.trim()) return allHinos;
    return allHinos.filter(hino => searchInLyrics(hino, query)).slice(0, 50);
  }, [allHinos, query]);

  const total = results.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navigation
          title="Tabernáculo A Voz do Cristão"
          onBack={onBack}
          isHinoView={true}
        />
        <LoadingSpinner message="Carregando hinos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navigation
          title="Tabernáculo A Voz do Cristão"
          onBack={onBack}
          isHinoView={true}
        />
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
      <Navigation
        title={hinarioNome || 'Hinário'}
        onBack={onBack}
        isHinoView={true}
      />

      <div className="bg-white dark:bg-slate-800/50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="text-center mb-6 animate-fade-in-up">
            <div className="w-14 h-14 rounded-2xl bg-gradient-wheat flex items-center justify-center mx-auto mb-4 shadow-md">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-serif mb-1 leading-tight">
              {hinarioNome || 'Hinário'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {allHinos.length} hinos disponíveis
            </p>
          </div>

          <div className="relative animate-fade-in-up stagger-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por número, título ou palavra..."
              className="w-full h-14 pl-12 pr-12 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-amber focus:border-brand-amber transition-all duration-200 shadow-sm"
              autoFocus
              aria-label="Buscar hino"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="page-container">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500 dark:text-gray-400 text-sm" aria-live="polite">
            {total} {total === 1 ? 'hino' : 'hinos'}
            {query && ` encontrado${total !== 1 ? 's' : ''}`}
          </p>
        </div>

        {total === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 animate-fade-in">
            <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {query ? `Nenhum hino encontrado para "${query}"` : 'Nenhum hino encontrado neste hinário'}
            </p>
            {query && (
              <button
                onClick={() => setQuery('')}
                className="px-6 py-3 bg-gradient-wheat text-white font-medium rounded-full shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200"
              >
                Limpar busca
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((hino, index) => (
              <div
                key={`${hino.slugHinario}-${hino.numero}`}
                className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:border-brand-amber dark:hover:border-brand-amber cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.99] animate-fade-in-up"
                onClick={() => onSelectHino(hino.slugHinario, hino.numero)}
                style={{ animationDelay: `${Math.min(index * 20, 300)}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="number-badge flex-shrink-0">
                    {hino.numero}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {hino.titulo}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
