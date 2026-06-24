import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkX, Film, Tv, Bookmark, Eye, SortAsc } from 'lucide-react';
import { useWatchlist } from '../store/watchlistStore';
import MovieCard from '../components/MovieCard';
import type { Movie } from '../lib/tmdb';

type WLTab = 'ott' | 'tv' | 'seen';
type SortKey = 'date_added' | 'rating' | 'year' | 'alpha';

// TV Classics metadata for TV watchlist display (id → title/lang/imdb/channels)
const TV_META: Record<number, { title: string; lang: string; imdb: number; channels: string[] }> = {
  5765: { title: 'Baasha', lang: 'Tamil', imdb: 7.8, channels: ['SUN TV', 'KTV'] },
  26594: { title: 'Padayappa', lang: 'Tamil', imdb: 7.5, channels: ['KTV'] },
  100789: { title: 'Sivaji: The Boss', lang: 'Tamil', imdb: 7.4, channels: ['VIJAY TV'] },
  39150: { title: 'Enthiran', lang: 'Tamil', imdb: 7.5, channels: ['SUN TV', 'KTV'] },
  554600: { title: 'Mersal', lang: 'Tamil', imdb: 7.4, channels: ['VIJAY TV', 'SUN TV'] },
  551276: { title: 'Bigil', lang: 'Tamil', imdb: 7.3, channels: ['VIJAY TV'] },
  723996: { title: 'Master', lang: 'Tamil', imdb: 7.7, channels: ['SUN TV'] },
  776503: { title: 'Vikram', lang: 'Tamil', imdb: 7.9, channels: ['SUN TV', 'KTV'] },
  100042: { title: 'Thuppakki', lang: 'Tamil', imdb: 7.8, channels: ['KTV'] },
  263449: { title: 'Kaththi', lang: 'Tamil', imdb: 7.7, channels: ['SUN TV'] },
  187596: { title: 'Mankatha', lang: 'Tamil', imdb: 7.5, channels: ['KTV'] },
  340215: { title: 'Petta', lang: 'Tamil', imdb: 7.4, channels: ['SUN TV'] },
  76341: { title: 'Nayakan', lang: 'Tamil', imdb: 8.1, channels: ['SUN TV', 'KTV'] },
  297799: { title: 'Vinnaithaandi Varuvaayaa', lang: 'Tamil', imdb: 7.9, channels: ['SUN TV'] },
  166176: { title: 'Alaipayuthey', lang: 'Tamil', imdb: 8.0, channels: ['SUN TV', 'KTV'] },
  76177: { title: 'Magadheera', lang: 'Telugu', imdb: 7.8, channels: ['GEMINI TV', 'ZEE TELUGU'] },
  302325: { title: 'Baahubali: The Beginning', lang: 'Telugu', imdb: 8.0, channels: ['GEMINI TV', 'STAR MAA'] },
  385687: { title: 'Baahubali 2: The Conclusion', lang: 'Telugu', imdb: 8.2, channels: ['GEMINI TV', 'ZEE TELUGU'] },
  484802: { title: 'Pushpa: The Rise', lang: 'Telugu', imdb: 7.6, channels: ['GEMINI TV'] },
  579974: { title: 'RRR', lang: 'Telugu', imdb: 7.8, channels: ['GEMINI TV', 'ETV TELUGU'] },
  214756: { title: 'Bommarillu', lang: 'Telugu', imdb: 7.8, channels: ['GEMINI TV'] },
  193610: { title: 'Drishyam', lang: 'Malayalam', imdb: 8.3, channels: ['ASIANET', 'MAZHAVIL MANORAMA'] },
  335984: { title: 'Premam', lang: 'Malayalam', imdb: 8.3, channels: ['ASIANET', 'SURYA TV'] },
  385717: { title: 'Bangalore Days', lang: 'Malayalam', imdb: 8.4, channels: ['ASIANET', 'SURYA TV'] },
};

const LANG_COLORS: Record<string, string> = {
  Tamil: '#FF6B35', Telugu: '#4ECDC4', Malayalam: '#21D07A', Kannada: '#F7DC6F',
};

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'date_added', label: 'Date Added' },
  { key: 'rating', label: 'Rating' },
  { key: 'year', label: 'Year' },
  { key: 'alpha', label: 'A–Z' },
];

export default function WatchlistPage() {
  const { items } = useWatchlist();
  const nav = useNavigate();
  const [tab, setTab] = useState<WLTab>('ott');
  const [sortBy, setSortBy] = useState<SortKey>('date_added');

  // TV watchlist from localStorage
  const [tvIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('moviera_tv_watchlist') || '[]'); } catch { return []; }
  });

  // "Seen" list from localStorage
  const [seenIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('moviera_seen_list') || '[]'); } catch { return []; }
  });

  const sortedOtt = [...items].sort((a: Movie, b: Movie) => {
    if (sortBy === 'rating') return (b.vote_average || 0) - (a.vote_average || 0);
    if (sortBy === 'year') return (b.release_date || '').localeCompare(a.release_date || '');
    if (sortBy === 'alpha') return a.title.localeCompare(b.title);
    return 0; // date_added preserves store order
  });

  const tvMovies = tvIds.map(id => TV_META[id]).filter(Boolean);

  const TAB_ITEMS: { id: WLTab; label: string; icon: React.FC<any>; count: number }[] = [
    { id: 'ott', label: 'OTT / Cinema', icon: Film, count: items.length },
    { id: 'tv', label: 'TV Watchlist', icon: Tv, count: tvIds.length },
    { id: 'seen', label: 'Seen', icon: Eye, count: seenIds.length },
  ];

  return (
    <div className="min-h-screen pt-4 md:pt-6 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h1 className="font-display text-3xl md:text-4xl mb-5" style={{ color: 'var(--gold)', letterSpacing: '0.05em' }}>
          MY WATCHLIST
        </h1>

        {/* Tab bar */}
        <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {TAB_ITEMS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-condensed font-bold transition-all"
              style={{
                background: tab === t.id
                  ? t.id === 'tv' ? 'var(--tv-purple)' : 'var(--gold)'
                  : 'transparent',
                color: tab === t.id ? (t.id === 'tv' ? '#fff' : '#0F0F0F') : 'var(--text3)',
                letterSpacing: '0.04em',
              }}
            >
              <t.icon size={14} />
              <span className="hidden sm:inline">{t.label}</span>
              {t.count > 0 && (
                <span className="text-xs font-mono opacity-70">({t.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Sort bar — OTT tab only */}
        {tab === 'ott' && items.length > 0 && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <SortAsc size={14} style={{ color: 'var(--text3)' }} />
            {SORT_OPTIONS.map(s => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key)}
                className="px-3 py-1.5 rounded-full text-xs font-condensed font-bold transition-all"
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
        )}

        {/* ── OTT / Cinema tab ── */}
        {tab === 'ott' && (
          items.length === 0 ? (
            <div className="text-center py-20">
              <BookmarkX size={48} className="mx-auto mb-4" style={{ color: 'var(--text3)' }} />
              <p style={{ color: 'var(--text2)', marginBottom: '8px', fontFamily: "'Barlow', sans-serif" }}>Your OTT watchlist is empty</p>
              <p className="text-sm mb-6" style={{ color: 'var(--text3)', fontFamily: "'Barlow', sans-serif" }}>Add movies from any page to watch later on OTT or in cinema</p>
              <button onClick={() => nav('/')} className="btn-gold flex items-center gap-2 mx-auto font-condensed" style={{ letterSpacing: '0.06em' }}>
                <Film size={16} /> BROWSE MOVIES
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {sortedOtt.map(m => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          )
        )}

        {/* ── TV Watchlist tab ── */}
        {tab === 'tv' && (
          tvMovies.length === 0 ? (
            <div className="text-center py-20">
              <Tv size={48} className="mx-auto mb-4" style={{ color: 'var(--text3)' }} />
              <p style={{ color: 'var(--text2)', marginBottom: '8px', fontFamily: "'Barlow', sans-serif" }}>No TV watchlist entries yet</p>
              <p className="text-sm mb-6" style={{ color: 'var(--text3)', fontFamily: "'Barlow', sans-serif" }}>Go to TV Schedule and bookmark movies you want to catch on TV</p>
              <button onClick={() => nav('/tv-schedule')} className="flex items-center gap-2 mx-auto font-condensed font-bold px-5 py-2.5 rounded-lg transition-all"
                style={{ background: 'rgba(168,85,247,0.15)', color: 'var(--tv-purple)', border: '1px solid rgba(168,85,247,0.3)', letterSpacing: '0.06em' }}>
                <Tv size={16} /> VIEW TV SCHEDULE
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {tvMovies.map((m, i) => {
                const langColor = LANG_COLORS[m.lang] || '#666';
                return (
                  <div key={i} className="card p-4 flex items-center gap-4 hover:border-[rgba(168,85,247,0.4)] transition-colors">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                      <Tv size={18} style={{ color: 'var(--tv-purple)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-display text-xl" style={{ color: 'var(--text)', letterSpacing: '0.04em' }}>{m.title}</span>
                        <span className="font-condensed text-xs font-bold px-2 py-0.5 rounded"
                          style={{ background: langColor, color: m.lang === 'Tamil' ? '#fff' : '#000', letterSpacing: '0.06em' }}>
                          {m.lang.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {m.channels.map(ch => (
                          <span key={ch} className="font-condensed text-xs px-1.5 py-0.5 rounded"
                            style={{ background: 'var(--card2)', color: 'var(--text3)', border: '1px solid var(--border)', letterSpacing: '0.04em' }}>
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0 font-mono text-sm font-bold" style={{ color: '#F5C518' }}>
                      ⭐ {m.imdb.toFixed(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ── Seen tab ── */}
        {tab === 'seen' && (
          <div className="text-center py-20">
            <Eye size={48} className="mx-auto mb-4" style={{ color: 'var(--text3)' }} />
            <p style={{ color: 'var(--text2)', fontFamily: "'Barlow', sans-serif" }}>Seen list coming soon</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text3)', fontFamily: "'Barlow', sans-serif" }}>Mark movies as watched from their detail page</p>
          </div>
        )}
      </div>
    </div>
  );
}
