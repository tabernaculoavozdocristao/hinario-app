import React, { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { getHinoByNumero } from '../data/dataLoader';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useFavorites } from '../contexts/FavoritesContext';
import type { Hino } from '../data/dataLoader';
import { Heart, Plus, Minus } from 'lucide-react';
import DOMPurify from 'dompurify';

interface HinoViewProps {
  slug: string;
  numero: number;
  onBack: () => void;
  onHome: () => void;
}

function textToHtml(txt: string): string {
  const paras = txt
    .split(/\n{2,}/g)
    .map(p => `<p>${p.split('\n').map(l => l.trim()).join('<br>')}</p>`)
    .join('');
  return paras;
}

function renderLyrics(hino: Hino, fontSize: number) {
  const raw = hino.letraHtml?.trim();
  const allowedTags = ['p', 'br', 'strong', 'em'];
  const allowedAttrs = ['class'];

  const clean = raw
    ? DOMPurify.sanitize(raw, {
        ALLOWED_TAGS: allowedTags,
        ALLOWED_ATTR: allowedAttrs
      })
    : null;

  const withStanzaGaps = clean
    ? clean.replace(/<p>(?:&nbsp;|\s)*<\/p>/gi, '<p class="stanza-gap"></p>')
    : null;

  const html = withStanzaGaps ?? textToHtml(hino.letra ?? '');

  return (
    <div
      className="lyrics max-w-3xl mx-auto"
      style={{ fontSize: `${fontSize}px` }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function HinoView({ slug, numero, onBack, onHome }: HinoViewProps) {
  const [hino, setHino] = useState<Hino | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [fontSize, setFontSize] = useLocalStorage('hino-font-size', 18);
  const { toggleFavorite: toggleFav, isFavorite: checkFavorite } = useFavorites();

  const hinoKey = `${slug}::${numero}`;
  const isFavorite = checkFavorite(hinoKey);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const foundHino = await getHinoByNumero(slug, numero);
        if (foundHino) {
          setHino(foundHino);
        } else {
          setError('Hino não encontrado');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar hino');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, numero]);

  useEffect(() => {
    if (hino && !loading) {
      window.scrollTo(0, 0);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }, 50);
    }
  }, [hino, loading]);

  const toggleFavorite = () => {
    toggleFav(hinoKey);
  };

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(14, Math.min(28, fontSize + delta));
    setFontSize(newSize);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navigation title="Carregando..." onBack={onBack} onHome={onHome} />
        <LoadingSpinner message="Carregando hino..." />
      </div>
    );
  }

  if (error || !hino) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navigation title="Erro" onBack={onBack} onHome={onHome} />
        <ErrorMessage message={error || 'Hino não encontrado'} onRetry={() => {}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
      <Navigation
        title={`Hino ${hino.numero}`}
        onBack={onBack}
        onHome={onHome}
        isHinoView={true}
      />

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-nav border-b border-gray-100 dark:border-gray-800 sticky top-16 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustFontSize(-2)}
                className="icon-button"
                aria-label="Diminuir fonte"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 min-w-[28px] text-center tabular-nums">
                {fontSize}
              </span>
              <button
                onClick={() => adjustFontSize(2)}
                className="icon-button"
                aria-label="Aumentar fonte"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={toggleFavorite}
              className={`w-11 h-11 rounded-xl transition-all duration-200 flex items-center justify-center ${
                isFavorite
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500'
              }`}
              aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <Heart className={`h-5 w-5 transition-transform duration-200 ${isFavorite ? 'fill-current scale-110' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="page-container">
        <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-soft lyrics-container animate-fade-in-up">
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-wheat text-white flex items-center justify-center text-2xl font-bold mx-auto mb-5 shadow-lg">
              {hino.numero}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 font-serif leading-tight">
              {hino.titulo}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Hino {hino.numero}</p>
          </div>

          {renderLyrics(hino, fontSize)}
        </div>
      </div>
    </div>
  );
}
