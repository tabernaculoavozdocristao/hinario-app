import React, { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { loadHinarios, loadHinosSmart } from '../data/dataLoader';
import { searchInLyrics } from '../utils/textUtils';
import type { Hinario } from '../types/hino';
import type { Hino } from '../data/dataLoader';
import { BookOpen, Search, X, Music, Heart, MessageSquare } from 'lucide-react';

interface HomeHinariosProps {
  onSelectHinario: (slug: string, hinarioNome?: string) => void;
  onSelectHino: (slug: string, numero: number) => void;
  onBack?: () => void;
  onFavorites: () => void;
  onSuggestion: () => void;
}

export function HomeHinarios({ onSelectHinario, onSelectHino, onBack, onFavorites, onSuggestion }: HomeHinariosProps) {
  const [hinarios, setHinarios] = useState<Hinario[]>([]);
  const [allHinos, setAllHinos] = useState<Hino[]>([]);
  const [searchResults, setSearchResults] = useState<Hino[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [hinariosData, hinosData] = await Promise.all([
        loadHinarios(),
        loadHinosSmart()
      ]);
      setHinarios(hinariosData);
      setAllHinos(hinosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar hinários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results = allHinos.filter(hino => searchInLyrics(hino, searchQuery));
    setSearchResults(results.slice(0, 50));
  }, [allHinos, searchQuery]);

  const handleHinoClick = (hino: Hino) => {
    onSelectHino(hino.slugHinario, hino.numero);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navigation title="Hinários" />
        <LoadingSpinner message="Carregando hinários..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navigation title="Hinários" />
        <ErrorMessage message={error} onRetry={loadData} />
      </div>
    );
  }

  if (hinarios.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navigation title="Hinários" />
        <div className="p-8 text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Nenhum hinário encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
      <Navigation title="Hinários" onBack={onBack} />

      <div className="page-container">
        <div className="mobile-content-spacing space-y-4 mb-8 animate-fade-in-up">
          <button
            onClick={onFavorites}
            className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-wheat text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200"
          >
            <Heart className="h-5 w-5 fill-current" />
            <span>Meus Hinos Favoritos</span>
          </button>
          <button
            onClick={onSuggestion}
            className="w-full flex items-center justify-center gap-3 p-4 bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-white font-medium rounded-2xl hover:border-brand-amber dark:hover:border-brand-amber hover:shadow-md active:scale-[0.98] transition-all duration-200"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Sugestão ou Correção de Hino</span>
          </button>
        </div>

        <div className="mb-10 animate-fade-in-up stagger-1">
          <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-soft">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-wheat flex items-center justify-center shadow-md">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white font-serif">
                  Busca Global
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Busque em todas as letras dos hinos
                </p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por número, título ou palavra..."
                className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-amber focus:border-brand-amber transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {searchQuery && (
          <div className="mb-10 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-serif">
              Resultados ({searchResults.length})
            </h3>
            {searchResults.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <Music className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum hino encontrado para "{searchQuery}"
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {searchResults.map((hino, index) => (
                  <div
                    key={`${hino.slugHinario}-${hino.numero}`}
                    className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:border-brand-amber dark:hover:border-brand-amber cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.99]"
                    onClick={() => handleHinoClick(hino)}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="number-badge flex-shrink-0">
                        {hino.numero}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                          {hino.titulo}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {hinarios.find(h => h.slug === hino.slugHinario)?.nome || 'Hinário'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="animate-fade-in-up stagger-2">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-serif">
              Hinários Disponíveis
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hinarios.map((hinario, index) => (
              <div
                key={hinario.slug}
                className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:border-brand-amber dark:hover:border-brand-amber cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                onClick={() => onSelectHinario(hinario.slug, hinario.nome)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-wheat flex items-center justify-center shadow-md flex-shrink-0">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white font-serif leading-tight mb-1">
                      {hinario.nome}
                    </h3>
                    {hinario.total && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {hinario.total} hinos
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
