import React from 'react';
import { Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-gray-700 hover:text-brand-orange hover:bg-gray-50 dark:text-gray-300 dark:hover:text-brand-amber dark:hover:bg-gray-800 transition-all duration-150"
      aria-label={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
      title="Tema"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}