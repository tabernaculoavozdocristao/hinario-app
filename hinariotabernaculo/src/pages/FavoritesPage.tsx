import React, { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Heart, Music } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { loadHinosSmart } from '../data/dataLoader';
import type { Hino } from '../data/dataLoader';

interface FavoritesPageProps {
  onSelectHino: (slug: string, numero: number) => void;
  onBack: () => void;
}

export function FavoritesPage({ onSelectHino, onBack }: FavoritesPageProps) {
  const { favorites } = useFavorites();
  const [favoriteHinos, setFavoriteHinos] = useState<Hino[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavoriteHinos = async () => {
      try {
        setLoading(true);
        if (favorites.length === 0) {
          setFavoriteHinos([]);
          return;
        }

        const allHinos = await loadHinosSmart();
        const favoriteHinosList: Hino[] = [];

        favorites.forEach(favoriteKey => {
          const parts = favoriteKey.split('::');
          if (parts.length !== 2) return;
          const [slug, numeroStr] = parts;
          const numero = parseInt(numeroStr);
          if (isNaN(numero)) return;
          const hino = allHinos.find(h => h.slugHinario === slug && h.numero === numero);
          if (hino) {
            favoriteHinosList.push(hino);
          }
        });

        // Ordena por número
        favoriteHinosList.sort((a, b) => a.numero - b.numero);
        setFavoriteHinos(favoriteHinosList);
      } catch (error) {
        console.error('Erro ao carregar hinos favoritos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteHinos();
  }, [favorites]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navigation title="Hinos Favoritos" onBack={onBack} />
        <LoadingSpinner message="Carregando favoritos..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
      <Navigation title="Hinos Favoritos" showBack onBack={onBack} />

      <div className="bg-white dark:bg-slate-800/50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="text-center animate-fade-in-up">
            <div className="w-14 h-14 rounded-2xl bg-gradient-wheat flex items-center justify-center mx-auto mb-4 shadow-md">
              <Heart className="h-7 w-7 text-white fill-current" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-serif mb-1">
              Hinos Favoritos
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {favoriteHinos.length} {favoriteHinos.length === 1 ? 'hino favoritado' : 'hinos favoritados'}
            </p>
          </div>
        </div>
      </div>

      <div className="page-container">
        <div className="mobile-content-spacing">
          {favoriteHinos.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                <Music className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum hino favoritado
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                Toque no coracao ao lado de qualquer hino para adiciona-lo aos seus favoritos
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteHinos.map((hino, index) => (
                <div
                  key={`${hino.slugHinario}-${hino.numero}`}
                  className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:border-brand-amber dark:hover:border-brand-amber cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.99] animate-fade-in-up"
                  onClick={() => onSelectHino(hino.slugHinario, hino.numero)}
                  style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="number-badge flex-shrink-0">
                      {hino.numero}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {hino.titulo}
                      </h3>
                    </div>
                    <div className="text-red-500 flex-shrink-0">
                      <Heart className="h-5 w-5 fill-current" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}