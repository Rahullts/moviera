import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { Movie } from '../lib/tmdb';
import MovieCard from './MovieCard';

interface Props {
  title: string;
  movies: Movie[];
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  rowId?: string;
}

export default function ScrollRow({ title, movies, size = 'md', loading, rowId }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const nav = useNavigate();

  const check = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => { check(); }, [movies]);

  const scroll = (dir: 'left' | 'right') => {
    const el = ref.current;
    if (!el) return;
    const amt = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'left' ? -amt : amt, behavior: 'smooth' });
    setTimeout(check, 400);
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="skeleton h-7 w-48 mb-3" />
        <div className="flex gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0" style={{ width: 175 }}>
              <div className="skeleton aspect-[2/3] rounded-lg" />
              <div className="skeleton h-4 w-3/4 mt-2" />
              <div className="skeleton h-3 w-1/3 mt-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies.length) return null;

  const widths = { sm: '140px', md: '175px', lg: '200px' };
  const w = widths[size];

  return (
    <div className="mb-8 relative group/row">
      <div className="flex items-center justify-between mb-3">
        <h2 className="section-header">{title}</h2>
      </div>

      <div className="relative">
        {canLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-12 z-10 w-10 flex items-center justify-center bg-gradient-to-r from-dark to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeft size={20} className="text-[var(--text2)]" />
          </button>
        )}

        <div ref={ref} className="movie-scroll" onScroll={check}>
          {movies.map(m => (
            <MovieCard key={m.id} movie={m} size={size} />
          ))}

          {/* Show All card at the end */}
          {rowId && movies.length > 6 && (
            <div
              className="flex-shrink-0 cursor-pointer group/card"
              style={{ width: w }}
              onClick={() => nav(`/category/${rowId}`)}
            >
              <div
                className="aspect-[2/3] rounded-lg flex flex-col items-center justify-center gap-2 transition-all group-hover/card:border-[var(--gold)]"
                style={{
                  background: 'var(--card2)',
                  border: '1px solid var(--border)',
                }}
              >
                <ArrowRight size={24} className="text-[var(--gold)]" />
                <span
                  className="font-display text-sm tracking-widest"
                  style={{ color: 'var(--gold)' }}
                >
                  SHOW ALL
                </span>
                <span className="font-mono text-xs text-[var(--text3)]">
                  {movies.length} films
                </span>
              </div>
            </div>
          )}
        </div>

        {canRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-12 z-10 w-10 flex items-center justify-center bg-gradient-to-l from-dark to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRight size={20} className="text-[var(--text2)]" />
          </button>
        )}
      </div>
    </div>
  );
}
