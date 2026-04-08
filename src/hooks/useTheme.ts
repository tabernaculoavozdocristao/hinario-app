import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // SEMPRE inicia com light, ignora prefers-color-scheme
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light'; // Padrão é sempre light
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Aplica a classe no documento
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
}