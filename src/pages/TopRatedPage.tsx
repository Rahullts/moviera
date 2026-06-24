import { useState, useEffect, useMemo } from 'react';
import { Search, Star, Filter, SlidersHorizontal } from 'lucide-react';
import {
  getHighestRatedSI, getFeelGoodSI, getAwardWinnersSI,
  FALLBACK_TOP_25, isTMDBAvailable, discoverSI, type Movie,
} from '../lib/tmdb';
import { getVerifiedRating } from '../lib/ratings';
import MovieCard from '../components/MovieCard';

// ── Hardcoded high-quality SI films for richer coverage ──
const SI_CURATED: Partial<Movie>[] = [
  { id: 723996, title: 'Master', original_title: 'Master', original_language: 'ta', release_date: '2021-01-13', vote_average: 7.7, vote_count: 14000, poster_path: '/40jp1MhtPNmYqU0IKHNPlQoxWsh.jpg', backdrop_path: null, overview: 'A professor with a drinking problem faces off against a dangerous gangster.', popularity: 80, genre_ids: [28, 18, 80], adult: false },
  { id: 776503, title: 'Vikram', original_title: 'Vikram', original_language: 'ta', release_date: '2022-06-03', vote_average: 7.9, vote_count: 10000, poster_path: '/c7WPmH4nUUBvjCRmGvBJBvFkbMi.jpg', backdrop_path: null, overview: 'A special agent hunts down a dangerous masked crew.', popularity: 90, genre_ids: [28, 18], adult: false },
  { id: 193610, title: 'Drishyam', original_title: 'Drishyam', original_language: 'ml', release_date: '2013-08-30', vote_average: 8.3, vote_count: 8000, poster_path: '/i3TmJkrDSa1JHZA2K0NCPS7ib7k.jpg', backdrop_path: null, overview: 'A man goes to great lengths to protect his family.', popularity: 60, genre_ids: [18, 80, 53], adult: false },
  { id: 579974, title: 'RRR', original_title: 'RRR', original_language: 'te', release_date: '2022-03-25', vote_average: 7.8, vote_count: 20000, poster_path: '/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg', backdrop_path: null, overview: 'Two legendary freedom fighters and their story before they joined the Indian Independence Movement.', popularity: 120, genre_ids: [28, 12, 18], adult: false },
  { id: 484802, title: 'Pushpa: The Rise', original_title: 'Pushpa', original_language: 'te', release_date: '2021-12-17', vote_average: 7.6, vote_count: 15000, poster_path: '/rugyJdeoJm7cSJL1q4jBpTNbxyU.jpg', backdrop_path: null, overview: 'A laborer rises in the world of red sandalwood smuggling.', popularity: 110, genre_ids: [28, 18], adult: false },
];

const PAGE_SIZE = 12;

const TABS = [
  { id: 'all', label: 'All SI Films' },
  { id: 'ta', label: 'Tamil' },
  { id: 'te', label: 'Telugu' },
  { id: 'ml', label: 'Malayalam' },
  { id: 'kn', label: 'Kannada' },
  { id: 'feel-good', label: 'Feel Good' },
  { id: 'action', label: 'Action' },
  { id: 'award', label: 'Award Winners' },
];

const SORT_OPTIONS = [
  { key: 'imdb', label: 'IMDb Rating' },
  { key: 'lb', label: 'Letterboxd' },
  { key: 'recent', label: 'Most Recent' },
  { key: 'alpha', label: 'A–Z' },
];

type SortKey = 'imdb' | 'lb' | 'recent' | 'alpha';

export default function TopRatedPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [feelGood, setFeelGood] = useState<Movie[]>([]);
  const [action, setAction] = useState<Movie[]>([]);
  const [awardWinners, setAwardWinners] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('imdb');
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [main, fg, aw] = await Promise.allSettled([
          getHighestRatedSI(),
          getFeelGoodSI(),
          getAwardWinnersSI(),
        ]);
        const act = await discoverSI({ with_genres: '28', sort_by: 'vote_average.desc', 'vote_count.gte': 100, 'primary_release_date.gte': '1980-01-01', page: 1 }).catch(() => ({ results: [] }));

        if (main.status === 'fulfilled') setMovies(main.value.results);
        else setMovies(FALLBACK_TOP_25 as Movie[]);
        if (fg.status === 'fulfilled') setFeelGood(fg.value.results);
        if (aw.status === 'fulfilled') setAwardWinners(aw.value.results);
        setAction(act.results);
      } catch {
        setMovies(FALLBACK_TOP_25 as Movie[]);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Reset visible count when tab or search changes
  useEffect(() => { setVisible(PAGE_SIZE); }, [tab, search, sortBy]);

  const baseMovies: Movie[] = useMemo(() => {
    switch (tab) {
      case 'feel-good': return feelGood;
      case 'action': return action;
      case 'award': return awardWinners;
      case 'ta': return movies.filter(m => m.original_language === 'ta');
      case 'te': return movies.filter(m => m.original_language === 'te');
      case 'ml': return movies.filter(m => m.original_language === 'ml');
      case 'kn': return movies.filter(m => m.original_language === 'kn');
      default: return movies;
    }
  }, [tab, movies, feelGood, action, awardWinners]);

  const sorted = useMemo(() => {
    let result = [...baseMovies];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(m => m.title.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      if (sortBy === 'imdb') {
        const va = getVerifiedRating(a.title)?.imdb ?? a.vote_average;
        const vb = getVerifiedRating(b.title)?.imdb ?? b.vote_average;
        return vb - va;
      }
      if (sortBy === 'lb') {
        const la = getVerifiedRating(a.title)?.lb ?? 0;
        const lb = getVerifiedRating(b.title)?.lb ?? 0;
        return lb - la;
      }
      if (sortBy === 'recent') return (b.release_date || '').localeCompare(a.release_date || '');
      return a.title.localeCompare(b.title);
    });
    return result;
  }, [baseMovies, search, sortBy]);

  const displayed = sorted.slice(0, visible);
  const hasMore = visible < sorted.length;

  const tabColor = (id: string) => {
    if (id === 'ta') return '#FF6B35';
    if (id === 'te') return '#4ECDC4';
    if (id === 'ml') return '#21D07A';
    if (id === 'kn') return '#F7DC6F';
    return 'var(--gold)';
  };

  return (
    <div className="min-h-screen pt-4 md:pt-6 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Star size={28} fill="var(--gold)" stroke="var(--gold)" />
          <div>
            <h1 className="font-display text-3xl md:text-4xl" style={{ color: 'var(--gold)' }}>
              Top Rated
            </h1>
            <p className="text-xs font-condensed" style={{ color: 'var(--text3)', letterSpacing: '0.08em' }}>
              {sorted.length} VERIFIED SOUTH INDIAN FILMS
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(t => {
            const active = tab === t.id;
            const color = tabColor(t.id);
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-condensed font-bold transition-all"
                style={{
                  background: active ? `${color}20` : 'var(--card2)',
                  color: active ? color : 'var(--text3)',
                  border: active ? `1px solid ${color}40` : '1px solid var(--border)',
                  letterSpacing: '0.06em',
                }}
              >
                {t.label.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Search + sort row */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text3)' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter movies..."
              className="form-input pl-9"
              style={{ marginBottom: 0 }}
            />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text3)' }}>
              <SlidersHorizontal size={12} />
            </span>
            {SORT_OPTIONS.map(s => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key as SortKey)}
                className="px-3 py-2 rounded-full text-xs font-condensed font-bold transition-all"
                style={{
                  background: sortBy === s.key ? 'var(--accent-glow)' : 'var(--card2)',
                  color: sortBy === s.key ? 'var(--gold)' : 'var(--text3)',
                  border: sortBy === s.key ? '1px solid var(--border-gold)' : '1px solid var(--border)',
                  letterSpacing: '0.06em',
                }}
              >
                {s.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* API key notice */}
        {!isTMDBAvailable && (
          <div className="card p-3 mb-5 text-sm" style={{ borderColor: 'var(--border-gold)' }}>
            <span style={{ color: 'var(--text2)' }}>
              Showing curated list — add <code className="font-mono text-xs" style={{ color: 'var(--gold)' }}>VITE_TMDB_API_KEY</code> for live data.
            </span>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[2/3] rounded-xl" />
                <div className="skeleton h-4 w-3/4 mt-2" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20">
            <Star size={48} className="mx-auto mb-4" style={{ color: 'var(--text3)' }} />
            <p style={{ color: 'var(--text2)' }}>No movies match your filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {displayed.map(m => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setVisible(v => v + PAGE_SIZE)}
                  className="btn-outline font-condensed"
                  style={{ letterSpacing: '0.08em' }}
                >
                  LOAD MORE — {sorted.length - visible} remaining
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
