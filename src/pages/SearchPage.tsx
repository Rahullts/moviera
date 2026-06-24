import { useState, useEffect, useCallback } from 'react';
import { tmdb, type Movie } from '../lib/tmdb';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const search = useCallback(async (q: string, p: number) => {
    if (!q.trim()) { setResults([]); setTotal(0); return; }
    setLoading(true);
    try {
      const data = await tmdb.searchMoviesSI(q, p);
      const newResults = data.results || [];
      if (p === 1) setResults(newResults);
      else setResults(prev => [...prev, ...newResults]);
      setTotal(data.total_results || 0);
    } catch {
      if (p === 1) setResults([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query, 1), 400);
    return () => clearTimeout(timer);
  }, [query, search]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    search(query, next);
  };

  return (
    <div className="min-h-screen pt-4 md:pt-6 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h1 className="font-display text-3xl md:text-4xl mb-6" style={{ color: 'var(--gold)' }}>Search</h1>

        <div className="mb-8">
          <SearchBar value={query} onChange={setQuery} placeholder="Search South Indian movies..." />
        </div>

        {query && !loading && results.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--text3)]">No results for "{query}"</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map(m => (
            <MovieCard key={m.id} movie={m} size="md" />
          ))}
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="flex-shrink-0" style={{ width: 175 }}>
              <div className="skeleton aspect-[2/3] rounded-lg" />
              <div className="skeleton h-4 w-3/4 mt-2" />
            </div>
          ))}
        </div>

        {results.length > 0 && results.length < total && !loading && (
          <div className="text-center mt-8">
            <button onClick={loadMore} className="btn-outline">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
