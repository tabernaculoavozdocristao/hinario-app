import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ChevronLeft, ChevronRight, BookOpen, Plus, Minus } from 'lucide-react';
import { BibleBook, BibleVerse } from '../types/bible';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface BibleReadingProps {
  book: BibleBook;
  chapter: number;
  onChangeChapter: (chapter: number) => void;
  onBack: () => void;
}

export function BibleReading({ book, chapter, onChangeChapter, onBack }: BibleReadingProps) {
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useLocalStorage('bible-font-size', 18);

  useEffect(() => {
    loadChapter();
  }, [book.id, chapter]);

  useEffect(() => {
    if (verses.length > 0 && !loading) {
      window.scrollTo(0, 0);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }, 50);
    }
  }, [verses, loading]);

  const loadChapter = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/data/bible/${book.id}/${chapter}.json`);
      if (!response.ok) {
        setVerses([]);
        setError('Conteudo ainda nao disponivel. Os dados da Biblia serao adicionados em breve.');
        return;
      }
      const data = await response.json();
      setVerses(data.verses || []);
    } catch {
      setVerses([]);
      setError('Conteudo ainda nao disponivel. Os dados da Biblia serao adicionados em breve.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousChapter = () => {
    if (chapter > 1) {
      onChangeChapter(chapter - 1);
    }
  };

  const handleNextChapter = () => {
    if (chapter < book.chapters) {
      onChangeChapter(chapter + 1);
    }
  };

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(14, Math.min(28, fontSize + delta));
    setFontSize(newSize);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
      <Navigation
        title={`${book.name} ${chapter}`}
        showBack
        onBack={onBack}
      />

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-nav border-b border-gray-100 dark:border-gray-800 sticky top-16 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousChapter}
                disabled={chapter === 1}
                className="flex items-center gap-1 px-3 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-amber dark:hover:border-brand-amber transition-all duration-200 text-gray-700 dark:text-gray-200"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium">Anterior</span>
              </button>

              <button
                onClick={handleNextChapter}
                disabled={chapter === book.chapters}
                className="flex items-center gap-1 px-3 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-amber dark:hover:border-brand-amber transition-all duration-200 text-gray-700 dark:text-gray-200"
              >
                <span className="hidden sm:inline text-sm font-medium">Proximo</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

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
          </div>
        </div>
      </div>

      <div className="page-container">
        <div className="mobile-content-spacing">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-serif">
              {book.name} {chapter}
            </h1>
          </div>

          {loading && (
            <LoadingSpinner message="Carregando capitulo..." />
          )}

          {error && !loading && (
            <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && verses.length > 0 && (
            <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-soft animate-fade-in-up">
              <div style={{ fontSize: `${fontSize}px` }} className="space-y-5">
                {verses.map((verse, index) => (
                  <p
                    key={verse.verse}
                    className="text-gray-700 dark:text-gray-200 leading-relaxed animate-fade-in"
                    style={{ animationDelay: `${Math.min(index * 20, 200)}ms`, lineHeight: '1.9' }}
                  >
                    <span
                      className="inline-block text-brand-amber font-bold mr-2 align-top"
                      style={{ fontSize: `${Math.max(12, fontSize - 3)}px` }}
                    >
                      {verse.verse}
                    </span>
                    {verse.text}
                  </p>
                ))}
              </div>
            </div>
          )}

          {!loading && !error && verses.length > 0 && (
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={handlePreviousChapter}
                disabled={chapter === 1}
                className="flex items-center gap-2 px-5 sm:px-6 py-3 bg-gradient-wheat text-white font-medium rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.98] transition-all duration-200 text-sm sm:text-base"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Capitulo</span> {chapter - 1}
              </button>

              <button
                onClick={handleNextChapter}
                disabled={chapter === book.chapters}
                className="flex items-center gap-2 px-5 sm:px-6 py-3 bg-gradient-wheat text-white font-medium rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.98] transition-all duration-200 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Capitulo</span> {chapter + 1}
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
