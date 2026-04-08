import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (key: string) => void;
  removeFavorite: (key: string) => void;
  toggleFavorite: (key: string) => void;
  isFavorite: (key: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = 'hino-favorites';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  const addFavorite = useCallback((key: string) => {
    setFavorites(prev => {
      if (prev.includes(key)) return prev;
      return [...prev, key];
    });
  }, []);

  const removeFavorite = useCallback((key: string) => {
    setFavorites(prev => prev.filter(fav => fav !== key));
  }, []);

  const toggleFavorite = useCallback((key: string) => {
    setFavorites(prev => {
      if (prev.includes(key)) {
        return prev.filter(fav => fav !== key);
      }
      return [...prev, key];
    });
  }, []);

  const isFavorite = useCallback((key: string) => {
    return favorites.includes(key);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
