import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavigationProps {
  title: string;
  onBack?: () => void;
  onHome?: () => void;
  isHinoView?: boolean;
  showBack?: boolean;
}

export function Navigation({ title, onBack, onHome, isHinoView = false }: NavigationProps) {
  return (
    <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-nav border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 mobile-safe-top">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-[68px]">
          {isHinoView ? (
            <>
              <div className="flex items-center">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-wheat text-white font-medium rounded-full shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 text-sm"
                    aria-label="Voltar"
                  >
                    <ArrowLeft size={18} />
                    <span>Voltar</span>
                  </button>
                )}
              </div>

              <div className="absolute left-1/2 transform -translate-x-1/2">
                <img
                  src="/logo-png.png"
                  alt="Logo Tabernáculo A Voz do Cristão"
                  className="h-9 w-9 object-contain drop-shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <div className="flex items-center">
                <ThemeToggle />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center min-w-[100px]">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-wheat text-white font-medium rounded-full shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 text-sm"
                    aria-label="Voltar"
                  >
                    <ArrowLeft size={18} />
                    <span>Voltar</span>
                  </button>
                )}
                {onHome && !onBack && (
                  <button
                    onClick={onHome}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-brand-amber dark:text-gray-400 dark:hover:text-brand-amber rounded-full hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 text-sm font-medium"
                    aria-label="Início"
                  >
                    <Home size={18} />
                    <span>Início</span>
                  </button>
                )}
              </div>

              <div className="absolute left-1/2 transform -translate-x-1/2">
                <img
                  src="/logo-png.png"
                  alt="Logo Tabernáculo A Voz do Cristão"
                  className="h-9 w-9 object-contain drop-shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <div className="flex items-center min-w-[100px] justify-end">
                <ThemeToggle />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
