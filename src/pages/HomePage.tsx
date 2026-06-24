import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv, ArrowRight } from 'lucide-react';
import {
  getWhatsHot, getHighestRatedSI, getFeelGoodSI, getRomanticSI,
  getAwardWinnersSI, getCultClassicsSI, discoverSI, tmdb, type Movie,
} from '../lib/tmdb';
import { getVerifiedRating } from '../lib/ratings';
import HeroBanner from '../components/HeroBanner';
import ScrollRow from '../components/ScrollRow';
import { useAuth } from '../store/authStore';

interface RowConfig {
  id: string;
  title: string;
  loading: boolean;
  movies: Movie[];
}

const ROW_DEFS = [
  {
    id: 'trending-global',
    title: 'Trending Worldwide',
    fetch: () => tmdb.getTrending('week').then(r => r.results || []),
  },
  {
    id: 'whats-hot',
    title: "What's Hot in South India",
    fetch: () => getWhatsHot().then(r => r.results),
  },
  {
    id: 'highest-rated',
    title: 'Highest Rated South Indian',
    fetch: () => getHighestRatedSI().then(r => r.results),
  },
  {
    id: 'tamil',
    title: 'Kollywood — Tamil',
    fetch: async () => {
      const [p1, p2] = await Promise.allSettled([
        discoverSI({ with_original_language: 'ta', sort_by: 'vote_average.desc', 'vote_count.gte': 150, 'primary_release_date.gte': '1980-01-01', page: 1 }),
        discoverSI({ with_original_language: 'ta', sort_by: 'vote_average.desc', 'vote_count.gte': 150, 'primary_release_date.gte': '1980-01-01', page: 2 }),
      ]);
      const all: Movie[] = [];
      [p1, p2].forEach(r => { if (r.status === 'fulfilled') all.push(...r.value.results); });
      const seen = new Set<number>();
      return all.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });
    },
  },
  {
    id: 'telugu',
    title: 'Tollywood — Telugu',
    fetch: async () => {
      const [p1, p2] = await Promise.allSettled([
        discoverSI({ with_original_language: 'te', sort_by: 'vote_average.desc', 'vote_count.gte': 150, 'primary_release_date.gte': '1980-01-01', page: 1 }),
        discoverSI({ with_original_language: 'te', sort_by: 'vote_average.desc', 'vote_count.gte': 150, 'primary_release_date.gte': '1980-01-01', page: 2 }),
      ]);
      const all: Movie[] = [];
      [p1, p2].forEach(r => { if (r.status === 'fulfilled') all.push(...r.value.results); });
      const seen = new Set<number>();
      return all.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });
    },
  },
  {
    id: 'malayalam',
    title: 'Mollywood — Malayalam',
    fetch: async () => {
      const [p1, p2] = await Promise.allSettled([
        discoverSI({ with_original_language: 'ml', sort_by: 'vote_average.desc', 'vote_count.gte': 100, 'primary_release_date.gte': '1980-01-01', page: 1 }),
        discoverSI({ with_original_language: 'ml', sort_by: 'vote_average.desc', 'vote_count.gte': 100, 'primary_release_date.gte': '1980-01-01', page: 2 }),
      ]);
      const all: Movie[] = [];
      [p1, p2].forEach(r => { if (r.status === 'fulfilled') all.push(...r.value.results); });
      const seen = new Set<number>();
      return all.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });
    },
  },
  {
    id: 'kannada',
    title: 'Sandalwood — Kannada',
    fetch: async () => {
      const [p1, p2] = await Promise.allSettled([
        discoverSI({ with_original_language: 'kn', sort_by: 'vote_average.desc', 'vote_count.gte': 50, 'primary_release_date.gte': '1980-01-01', page: 1 }),
        discoverSI({ with_original_language: 'kn', sort_by: 'popularity.desc', 'vote_count.gte': 30, 'primary_release_date.gte': '1980-01-01', page: 1 }),
      ]);
      const all: Movie[] = [];
      [p1, p2].forEach(r => { if (r.status === 'fulfilled') all.push(...r.value.results); });
      const seen = new Set<number>();
      return all.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });
    },
  },
  {
    id: 'action',
    title: 'Action Blockbusters',
    fetch: async () => {
      const [p1, p2] = await Promise.allSettled([
        discoverSI({ with_genres: '28', sort_by: 'popularity.desc', 'vote_count.gte': 80, 'primary_release_date.gte': '1980-01-01', page: 1 }),
        discoverSI({ with_genres: '28', sort_by: 'popularity.desc', 'vote_count.gte': 80, 'primary_release_date.gte': '1980-01-01', page: 2 }),
      ]);
      const all: Movie[] = [];
      [p1, p2].forEach(r => { if (r.status === 'fulfilled') all.push(...r.value.results); });
      const seen = new Set<number>();
      return all.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });
    },
  },
  {
    id: 'thriller',
    title: 'Thriller & Suspense',
    fetch: async () => {
      const [p1, p2] = await Promise.allSettled([
        discoverSI({ with_genres: '53', sort_by: 'vote_average.desc', 'vote_count.gte': 80, 'primary_release_date.gte': '1980-01-01', page: 1 }),
        discoverSI({ with_genres: '53', sort_by: 'vote_average.desc', 'vote_count.gte': 80, 'primary_release_date.gte': '1980-01-01', page: 2 }),
      ]);
      const all: Movie[] = [];
      [p1, p2].forEach(r => { if (r.status === 'fulfilled') all.push(...r.value.results); });
      const seen = new Set<number>();
      return all.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });
    },
  },
  {
    id: 'feel-good',
    title: 'Feel Good Picks',
    fetch: () => getFeelGoodSI().then(r => r.results),
  },
  {
    id: 'romantic',
    title: 'Romantic Hits',
    fetch: () => getRomanticSI().then(r => r.results),
  },
  {
    id: 'award-winners',
    title: 'Award Winners',
    fetch: () => getAwardWinnersSI().then(r => r.results),
  },
  {
    id: 'cult-classics',
    title: 'Cult Classics',
    fetch: () => getCultClassicsSI().then(r => r.results),
  },
];

// TV Classics teaser (reused from TVSchedulePage without importing the full page)
const TV_TEASER = [
  { title: 'Baasha', lang: 'Tamil', channels: 'SUN TV / KTV' },
  { title: 'Padayappa', lang: 'Tamil', channels: 'KTV' },
  { title: 'Magadheera', lang: 'Telugu', channels: 'GEMINI TV' },
  { title: 'Drishyam', lang: 'Malayalam', channels: 'ASIANET' },
  { title: 'Premam', lang: 'Malayalam', channels: 'ASIANET' },
  { title: 'Baahubali 2', lang: 'Telugu', channels: 'GEMINI TV / ZEE TELUGU' },
  { title: 'Thuppakki', lang: 'Tamil', channels: 'KTV' },
];

const LANG_COLORS_MAP: Record<string, string> = {
  Tamil: '#FF6B35', Telugu: '#4ECDC4', Malayalam: '#21D07A', Kannada: '#F7DC6F',
};

function dedup(movies: Movie[]): Movie[] {
  const seen = new Set<number>();
  return movies.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });
}

function isVerifiedHero(m: Movie): boolean {
  const v = getVerifiedRating(m.title.toLowerCase());
  if (v?.imdb != null && v.imdb >= 8.0) return true;
  if (v?.lb != null && v.lb >= 3.4) return true;
  // Fall back to TMDB score if no verified data
  if (!v && m.vote_average >= 7.8 && m.vote_count > 500) return true;
  return false;
}

export default function HomePage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [rows, setRows] = useState<RowConfig[]>(
    ROW_DEFS.map(d => ({ id: d.id, title: d.title, loading: true, movies: [] }))
  );

  useEffect(() => {
    async function fetchAll() {
      for (let i = 0; i < ROW_DEFS.length; i += 2) {
        const batch = ROW_DEFS.slice(i, i + 2);
        await Promise.allSettled(
          batch.map(async (def) => {
            try {
              const results = await def.fetch();
              const movies = dedup(results.filter((m: any) => m.poster_path));
              setRows(prev => prev.map(r =>
                r.id === def.id ? { ...r, movies, loading: false } : r
              ));
              // Build hero pool from highest-rated & whats-hot rows
              if ((def.id === 'highest-rated' || def.id === 'whats-hot') && movies.length > 0) {
                setHeroMovies(prev => {
                  const verified = movies.filter(m => isVerifiedHero(m) && m.backdrop_path);
                  const combined = dedup([...prev, ...verified]);
                  // max 8 hero slides
                  return combined.slice(0, 8);
                });
              }
            } catch {
              setRows(prev => prev.map(r =>
                r.id === def.id ? { ...r, loading: false } : r
              ));
            }
          })
        );
        if (i + 2 < ROW_DEFS.length) {
          await new Promise(r => setTimeout(r, 200));
        }
      }
    }
    fetchAll();
  }, []);

  // Fallback hero from trending if nothing loaded yet
  useEffect(() => {
    if (heroMovies.length > 0) return;
    const trendRow = rows.find(r => r.id === 'trending-global');
    if (trendRow && !trendRow.loading && trendRow.movies.length > 0) {
      const siMovies = trendRow.movies.filter(m =>
        ['ta', 'te', 'ml', 'kn'].includes(m.original_language) && m.backdrop_path
      );
      if (siMovies.length > 0) setHeroMovies(siMovies.slice(0, 6));
      else setHeroMovies(trendRow.movies.filter(m => m.backdrop_path).slice(0, 4));
    }
  }, [rows, heroMovies.length]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Hero banner — auto-rotating, verified movies only */}
      {heroMovies.length > 0 && <HeroBanner movies={heroMovies} />}

      {/* Content rows */}
      <div
        className="max-w-screen-2xl mx-auto px-4 md:px-6"
        style={{ paddingTop: heroMovies.length > 0 ? '1rem' : '6rem', paddingBottom: '6rem' }}
      >
        {/* Welcome text */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.8rem', color: 'var(--text)', letterSpacing: '0.05em' }}>
            {user
              ? `WELCOME BACK, ${(user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'CINEPHILE').toUpperCase()}`
              : 'SOUTH INDIAN CINEMA UNIVERSE'}
          </h2>
          <p style={{ color: 'var(--text3)', fontSize: '13px', marginTop: '4px', fontFamily: "'Barlow', sans-serif" }}>
            Tamil · Telugu · Malayalam · Kannada · and Global Trending
          </p>
        </div>

        {/* Movie scroll rows */}
        {rows.map(row => (
          <ScrollRow
            key={row.id}
            rowId={row.id}
            title={row.title}
            movies={row.movies}
            loading={row.loading}
          />
        ))}

        {/* ── Top on TV This Week teaser ── */}
        <div
          className="card p-5 mt-4"
          style={{ borderColor: 'rgba(168,85,247,0.25)', background: 'rgba(168,85,247,0.04)' }}
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Tv size={20} style={{ color: 'var(--tv-purple)' }} />
              <h2 className="font-display text-2xl" style={{ color: 'var(--tv-purple)', letterSpacing: '0.06em' }}>
                TOP ON TV THIS WEEK
              </h2>
            </div>
            <button
              onClick={() => nav('/tv-schedule')}
              className="flex items-center gap-1.5 text-xs font-condensed font-bold transition-colors"
              style={{ color: 'var(--tv-purple)', letterSpacing: '0.08em' }}
            >
              VIEW FULL SCHEDULE <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {TV_TEASER.map((item, i) => {
              const color = LANG_COLORS_MAP[item.lang] || '#666';
              const day = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i];
              return (
                <div
                  key={i}
                  className="rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.02]"
                  style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}
                  onClick={() => nav('/tv-schedule')}
                >
                  <p className="font-condensed font-bold text-xs mb-2" style={{ color: 'var(--text3)', letterSpacing: '0.1em' }}>
                    {day}
                  </p>
                  <p className="font-display text-base leading-tight mb-1" style={{ color: 'var(--text)', letterSpacing: '0.04em' }}>
                    {item.title}
                  </p>
                  <span
                    className="font-condensed font-bold text-xs px-1.5 py-0.5 rounded"
                    style={{ background: color, color: item.lang === 'Tamil' ? '#fff' : '#000', letterSpacing: '0.06em' }}
                  >
                    {item.lang.toUpperCase()}
                  </span>
                  <p className="text-xs mt-1 font-condensed" style={{ color: 'var(--text3)', letterSpacing: '0.04em', fontSize: '10px' }}>
                    {item.channels}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
