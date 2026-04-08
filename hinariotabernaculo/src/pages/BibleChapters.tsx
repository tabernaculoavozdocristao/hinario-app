import React from 'react';
import { Navigation } from '../components/Navigation';
import { BibleBook } from '../types/bible';

interface BibleChaptersProps {
  book: BibleBook;
  onSelectChapter: (chapter: number) => void;
  onBack: () => void;
}

export function BibleChapters({ book, onSelectChapter, onBack }: BibleChaptersProps) {
  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
      <Navigation
        title={book.name}
        showBack
        onBack={onBack}
      />

      <div className="page-container">
        <div className="mobile-content-spacing animate-fade-in-up">
          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-serif mb-2">
              {book.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Selecione um capitulo
            </p>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {chapters.map((chapter, index) => (
              <button
                key={chapter}
                onClick={() => onSelectChapter(chapter)}
                className="aspect-square flex items-center justify-center bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-gray-800 rounded-xl font-semibold text-gray-800 dark:text-white hover:border-brand-amber dark:hover:border-brand-amber hover:bg-gradient-wheat hover:text-white hover:shadow-md active:scale-95 transition-all duration-200 text-sm sm:text-base animate-scale-in"
                style={{ animationDelay: `${Math.min(index * 10, 200)}ms` }}
              >
                {chapter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
