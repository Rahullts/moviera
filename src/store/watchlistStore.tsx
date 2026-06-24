import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Movie } from '../lib/tmdb';

interface WatchlistState {
  items: Movie[];
  add: (movie: Movie) => void;
  remove: (id: number) => void;
  has: (id: number) => boolean;
}

const WatchlistContext = createContext<WatchlistState | null>(null);

const STORAGE_KEY = 'moviera_watchlist';

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = (movie: Movie) => {
    setItems(prev => {
      if (prev.some(m => m.id === movie.id)) return prev;
      return [movie, ...prev];
    });
  };

  const remove = (id: number) => {
    setItems(prev => prev.filter(m => m.id !== id));
  };

  const has = (id: number) => items.some(m => m.id === id);

  return (
    <WatchlistContext.Provider value={{ items, add, remove, has }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be inside WatchlistProvider');
  return ctx;
}
