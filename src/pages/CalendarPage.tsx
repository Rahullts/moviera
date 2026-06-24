import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { tmdb, type Movie } from '../lib/tmdb';
import { getLangColor, getLangName } from '../lib/utils';

type MonthGroup = { monthYear: string; movies: Movie[] };

const TIME_FILTERS = [
  { id: 'all-time', label: 'All Upcoming' },
  { id: 'this-week', label: 'This Week' },
  { id: 'this-month', label: 'This Month' },
];

export default function CalendarPage() {
  const nav = useNavigate();
  const [moviesByMonth, setMoviesByMonth] = useState<MonthGroup[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<MonthGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [langFilter, setLangFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all-time');

  useEffect(() => {
    async function fetchUpcomingMovies() {
      setLoading(true);
      setError(null);
      try {
        const [p1, p2, p3] = await Promise.allSettled([
          tmdb.getUpcomingSI(1),
          tmdb.getUpcomingSI(2),
          tmdb.getUpcomingSI(3),
        ]);

        const all: Movie[] = [];
        [p1, p2, p3].forEach(r => {
          if (r.status === 'fulfilled') all.push(...r.value.results);
        });

        const seen = new Set<number>();
        const unique = all.filter(m => {
          if (seen.has(m.id)) return false;
          seen.add(m.id);
          return true;
        });

        unique.sort((a, b) => (a.release_date || '').localeCompare(b.release_date || ''));

        const grouped: Record<string, Movie[]> = {};
        unique.forEach(movie => {
          if (!movie.release_date) return;
          const [y, mo] = movie.release_date.split('-');
          const key = new Date(+y, +mo - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(movie);
        });

        setMoviesByMonth(Object.entries(grouped).map(([monthYear, movies]) => ({ monthYear, movies })));
      } catch {
        setError('Failed to load upcoming releases.');
      } finally {
        setLoading(false);
      }
    }
    fetchUpcomingMovies();
  }, []);

  useEffect(() => {
    let filtered = [...moviesByMonth];
    if (langFilter !== 'all') {
      filtered = filtered
        .map(g => ({ ...g, movies: g.movies.filter(m => m.original_language === langFilter) }))
        .filter(g => g.movies.length > 0);
    }
    if (timeFilter === 'this-week') {
      const weekEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered
        .map(g => ({ ...g, movies: g.movies.filter(m => m.release_date >= today && m.release_date <= weekEnd) }))
        .filter(g => g.movies.length > 0);
    }
    if (timeFilter === 'this-month') {
      const now = new Date();
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      const today = now.toISOString().split('T')[0];
      filtered = filtered
        .map(g => ({ ...g, movies: g.movies.filter(m => m.release_date >= today && m.release_date <= monthEnd) }))
        .filter(g => g.movies.length > 0);
    }
    setFilteredMovies(filtered);
  }, [moviesByMonth, langFilter, timeFilter]);

  const langFilters = [
    { key: 'all', label: 'All', color: 'var(--gold)' },
    { key: 'ta', label: 'Tamil', color: 'var(--tamil)' },
    { key: 'te', label: 'Telugu', color: 'var(--telugu)' },
    { key: 'ml', label: 'Malayalam', color: 'var(--malayalam)' },
    { key: 'kn', label: 'Kannada', color: 'var(--kannada)' },
  ];

  return (
    <div className="min-h-screen pt-4 md:pt-6 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h1 className="font-display text-3xl md:text-4xl mb-6" style={{ color: 'var(--gold)' }}>
          Release Calendar
        </h1>

        {/* Time filters */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {TIME_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setTimeFilter(f.id)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: timeFilter === f.id ? 'var(--accent-glow)' : 'var(--card2)',
                color: timeFilter === f.id ? 'var(--gold)' : 'var(--text3)',
                border: timeFilter === f.id ? '1px solid var(--border-gold)' : '1px solid var(--border)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Language filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {langFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setLangFilter(f.key)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: langFilter === f.key ? `${f.color}20` : 'var(--card2)',
                color: langFilter === f.key ? f.color : 'var(--text3)',
                border: langFilter === f.key ? `1px solid ${f.color}40` : '1px solid var(--border)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card p-3 flex gap-3 items-center">
                <div className="skeleton w-16 h-24 rounded-lg flex-shrink-0" />
                <div className="flex-1">
                  <div className="skeleton h-4 w-3/4 mb-2" />
                  <div className="skeleton h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <CalendarIcon size={48} className="mx-auto mb-4 text-[var(--text3)]" />
            <p className="text-[var(--text2)]">{error}</p>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-20">
            <CalendarIcon size={48} className="mx-auto mb-4 text-[var(--text3)]" />
            <p className="text-[var(--text2)]">No upcoming releases found</p>
            <p className="text-sm text-[var(--text3)] mt-1">Check back soon for new releases</p>
          </div>
        ) : (
          filteredMovies.map(group => (
            <div key={group.monthYear} className="mb-10 fade-in">
              <h2 className="font-display text-2xl mb-4 flex items-center gap-2" style={{ color: 'var(--gold)' }}>
                {group.monthYear}
                <span className="font-mono text-xs text-[var(--text3)]">
                  ({group.movies.length} films)
                </span>
              </h2>

              <div className="space-y-3">
                {group.movies.map(m => (
                  <div
                    key={m.id}
                    className="card p-3 flex gap-3 items-start hover:border-[var(--border2)] transition-colors cursor-pointer"
                    onClick={() => nav(`/movie/${m.id}`)}
                  >
                    {/* Date badge */}
                    <div style={{ width: '44px', flexShrink: 0, textAlign: 'center' }}>
                      <div className="cal-date-num">
                        {m.release_date ? new Date(m.release_date).getDate() : '—'}
                      </div>
                      <div className="cal-date-mon">
                        {m.release_date ? new Date(m.release_date).toLocaleDateString('en', { month: 'short' }) : ''}
                      </div>
                    </div>

                    {/* Poster */}
                    <div style={{ width: '60px', height: '90px', borderRadius: '8px', overflow: 'hidden', background: 'var(--card2)', flexShrink: 0 }}>
                      {m.poster_path ? (
                        <img src={tmdb.imgUrl(m.poster_path, 'w185')} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CalendarIcon size={16} style={{ color: 'var(--text3)' }} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.title}
                      </div>
                      <span style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600,
                        background: `${getLangColor(m.original_language)}20`, color: getLangColor(m.original_language),
                      }}>
                        {getLangName(m.original_language)}
                      </span>
                      {m.vote_average > 0 && (
                        <span style={{ marginLeft: '8px', color: 'var(--gold)', fontSize: '12px', fontFamily: "'DM Mono', monospace" }}>
                          ★ {m.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
