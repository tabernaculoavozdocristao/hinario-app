import React from 'react';
import { Navigation } from '../components/Navigation';
import { BookMarked, ScrollText, Search } from 'lucide-react';

interface BibleHomeProps {
  onSelectTestament: (testament: 'old' | 'new') => void;
  onSearch: () => void;
  onBack: () => void;
}

export function BibleHome({ onSelectTestament, onSearch, onBack }: BibleHomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
      <Navigation
        title="Biblia"
        showBack
        onBack={onBack}
      />

      <div className="page-container">
        <div className="mobile-content-spacing animate-fade-in-up">
          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-serif mb-2">
              Biblia Sagrada
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Almeida Corrigida Fiel
            </p>
          </div>

          <button
            onClick={onSearch}
            className="w-full mb-10 flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-brand-amber dark:hover:border-brand-amber transition-all duration-200 hover:shadow-md group"
          >
            <Search className="h-5 w-5 text-gray-400 group-hover:text-brand-amber transition-colors" />
            <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Buscar na Biblia...</span>
          </button>

          <div className="grid gap-5 sm:grid-cols-2">
            <button
              onClick={() => onSelectTestament('old')}
              className="group p-6 sm:p-8 bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-gray-800 rounded-3xl hover:border-brand-amber dark:hover:border-brand-amber transition-all duration-200 hover:shadow-lg active:scale-[0.98] text-left"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-wheat flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200 shadow-md">
                <ScrollText className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-serif mb-2">
                Antigo Testamento
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                39 livros - De Genesis a Malaquias
              </p>
            </button>

            <button
              onClick={() => onSelectTestament('new')}
              className="group p-6 sm:p-8 bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-gray-800 rounded-3xl hover:border-brand-amber dark:hover:border-brand-amber transition-all duration-200 hover:shadow-lg active:scale-[0.98] text-left"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-wheat flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200 shadow-md">
                <BookMarked className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-serif mb-2">
                Novo Testamento
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                27 livros - De Mateus a Apocalipse
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
