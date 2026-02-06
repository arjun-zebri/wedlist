'use client';

import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('wedlist_favorites_mcs');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const toggleFavorite = (mcId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(mcId)
        ? prev.filter((id) => id !== mcId)
        : [...prev, mcId];

      localStorage.setItem('wedlist_favorites_mcs', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (mcId: string) => favorites.includes(mcId);

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
