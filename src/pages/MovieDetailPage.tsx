import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Bookmark, BookmarkCheck, Play, Tv } from 'lucide-react';
import { tmdb, getSimilarSI, type MovieDetail, type Movie } from '../lib/tmdb';
import { formatDate, getLangName, getLangColor, LANG_TEXT_COLORS } from '../lib/utils';
import { getVerifiedRating } from '../lib/ratings';
import { useWatchlist } from '../store/watchlistStore';
import ScrollRow from '../components/ScrollRow';
import ReviewsSection from '../components/ReviewsSection';

// TV classics lookup for "on TV" section
const TV_AIRINGS: Record<string, { channels: string[]; frequency: string; airCount: string }> = {
  'baasha': { channels: ['SUN TV', 'KTV'], frequency: 'Weekly', airCount: '200+' },
  'padayappa': { channels: ['KTV'], frequency: 'Monthly', airCount: '150+' },
  'sivaji: the boss': { channels: ['VIJAY TV'], frequency: 'Weekly', airCount: '120+' },
  'enthiran': { channels: ['SUN TV', 'KTV'], frequency: 'Bi-weekly', airCount: '100+' },
  'mersal': { channels: ['VIJAY TV', 'SUN TV'], frequency: 'Weekly', airCount: '80+' },
  'bigil': { channels: ['VIJAY TV'], frequency: 'Weekly', airCount: '70+' },
  'master': { channels: ['SUN TV'], frequency: 'Weekly', airCount: '60+' },
  'vikram': { channels: ['SUN TV', 'KTV'], frequency: 'Weekly', airCount: '50+' },
  'thuppakki': { channels: ['KTV'], frequency: 'Weekly', airCount: '150+' },
  'kaththi': { channels: ['SUN TV'], frequency: 'Weekly', airCount: '80+' },
  'mankatha': { channels: ['KTV'], frequency: 'Monthly', airCount: '80+' },
  'petta': { channels: ['SUN TV'], frequency: 'Monthly', airCount: '40+' },
  'nayakan': { channels: ['SUN TV', 'KTV'], frequency: 'Monthly', airCount: '200+' },
  'vinnaithaandi varuvaayaa': { channels: ['SUN TV'], frequency: 'Monthly', airCount: '100+' },
  'alaipayuthey': { channels: ['SUN TV', 'KTV'], frequency: 'Monthly', airCount: '150+' },
  'magadheera': { channels: ['GEMINI TV', 'ZEE TELUGU'], frequency: 'Weekly', airCount: '150+' },
  'baahubali: the beginning': { channels: ['GEMINI TV', 'STAR MAA'], frequency: 'Weekly', airCount: '100+' },
  'baahubali 2: the conclusion': { channels: ['GEMINI TV', 'ZEE TELUGU', 'STAR MAA'], frequency: 'Weekly', airCount: '120+' },
  'pushpa: the rise': { channels: ['GEMINI TV', 'ZEE TELUGU'], frequency: 'Weekly', airCount: '60+' },
  'rrr': { channels: ['GEMINI TV', 'ETV TELUGU'], frequency: 'Weekly', airCount: '50+' },
  'bommarillu': { channels: ['GEMINI TV'], frequency: 'Monthly', airCount: '100+' },
  'drishyam': { channels: ['ASIANET', 'MAZHAVIL MANORAMA'], frequency: 'Monthly', airCount: '80+' },
  'premam': { channels: ['ASIANET', 'SURYA TV'], frequency: 'Monthly', airCount: '80+' },
  'bangalore days': { channels: ['ASIANET', 'SURYA TV'], frequency: 'Monthly', airCount: '60+' },
};

export default function MovieDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { has, add, remove } = useWatchlist();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    tmdb.getMovieDetails(Number(id))
      .then(async (data) => {
        setMovie(data);
        const genreIds = (data.genres || []).map((g: any) => g.id);
        const lang = data.original_language || 'ta';
        try {
          const simData = await getSimilarSI(Number(id), genreIds, lang);
          setSimilar(simData.results);
        } catch {
          setSimilar([]);
        }
      })
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-4 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="skeleton h-8 w-24 mb-6" />
          <div className="skeleton h-[50vh] rounded-xl mb-6" />
          <div className="skeleton h-8 w-64 mb-4" />
          <div className="skeleton h-4 w-full mb-2" />
          <div className="skeleton h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text3)]">Movie not found</p>
      </div>
    );
  }

  const inList = has(movie.id);
  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const cast = movie.credits?.cast?.slice(0, 10) || [];
  const providers = movie['watch/providers']?.results?.IN;
  const flatrate = providers?.flatrate || [];
  const rent = providers?.rent || [];

  const directors = movie.credits?.crew?.filter(c => c.job === 'Director').slice(0, 2) || [];
  const musicDir = movie.credits?.crew?.filter(c =>
    c.job === 'Original Music Composer' || c.job === 'Music Director' || (c.department === 'Sound' && c.job.includes('Music'))
  ).slice(0, 1) || [];
  const dop = movie.credits?.crew?.filter(c =>
    c.job === 'Director of Photography' || c.job === 'Cinematography'
  ).slice(0, 1) || [];
  const producers = movie.credits?.crew?.filter(c =>
    c.job === 'Producer' || c.job === 'Executive Producer'
  ).slice(0, 2) || [];
  const editors = movie.credits?.crew?.filter(c => c.job === 'Editor').slice(0, 1) || [];
  const writers = movie.credits?.crew?.filter(c =>
    c.job === 'Screenplay' || c.job === 'Writer' || c.job === 'Story'
  ).slice(0, 1) || [];

  const crewMembers = [
    ...directors.map(p => ({ ...p, role: 'Director' })),
    ...musicDir.map(p => ({ ...p, role: 'Music' })),
    ...dop.map(p => ({ ...p, role: 'DOP' })),
    ...producers.map(p => ({ ...p, role: 'Producer' })),
    ...editors.map(p => ({ ...p, role: 'Editor' })),
    ...writers.map(p => ({ ...p, role: 'Screenplay' })),
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* ── Backdrop image ── overflow:hidden so image is cropped cleanly */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(280px, 42vh, 500px)',
          overflow: 'hidden',
          background: 'var(--card)',
        }}
      >
        {movie.backdrop_path ? (
          <img
            src={tmdb.imgUrl(movie.backdrop_path, 'original')}
            alt=""
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 15%',
            }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--card2), var(--elevated))' }} />
        )}
        {/* Bottom-to-top fade so content below merges seamlessly */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg) 0%, rgba(8,11,15,0.5) 50%, rgba(8,11,15,0.1) 100%)' }} />
      </div>

      {/* ── Poster + Title row ── pulled UP into the backdrop via negative margin */}
      <div
        className="max-w-7xl mx-auto px-4 md:px-6"
        style={{
          /* Pull the row up so the poster overlaps the backdrop */
          marginTop: '-80px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          {/* Poster — always visible since it's OUTSIDE overflow:hidden */}
          {movie.poster_path && (
            <img
              src={tmdb.imgUrl(movie.poster_path, 'w342')}
              alt={movie.title}
              style={{
                width: 'clamp(100px, 10vw, 160px)',
                flexShrink: 0,
                borderRadius: '12px',
                boxShadow: '0 12px 50px rgba(0,0,0,0.8)',
                border: '2px solid var(--border2)',
              }}
            />
          )}
          <div style={{ paddingBottom: '4px', flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(2rem, 4vw, 3.8rem)',
                lineHeight: 1.05,
                letterSpacing: '0.03em',
                color: '#ffffff',
                textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                wordBreak: 'break-word',
              }}
            >
              {movie.title}
            </h1>
            {movie.tagline && (
              <p style={{
                fontSize: '13px',
                color: 'var(--text2)',
                marginTop: '6px',
                fontStyle: 'italic',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                "{movie.tagline}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Metadata + actions ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Verified ratings display */}
          {(() => {
            const verified = getVerifiedRating(movie.title.toLowerCase());
            const imdb = verified?.imdb ?? (movie.vote_average > 0 ? movie.vote_average : null);
            const lb = verified?.lb;
            return (
              <>
                {imdb != null && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm"
                    style={{ background: 'rgba(245,197,24,0.12)', border: '1px solid rgba(245,197,24,0.3)', color: 'var(--gold)' }}>
                    <Star size={14} fill="var(--gold)" stroke="none" />
                    {imdb.toFixed(1)}
                    <span className="text-xs opacity-60 font-condensed" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.06em' }}>IMDb</span>
                  </span>
                )}
                {lb != null && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm"
                    style={{ background: 'rgba(255,128,0,0.12)', border: '1px solid rgba(255,128,0,0.3)', color: '#FF8000' }}>
                    ♦ {lb.toFixed(1)}/5
                    <span className="text-xs opacity-60 font-condensed" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.06em' }}>LB</span>
                  </span>
                )}
                {imdb == null && lb == null && (
                  <span className="font-mono text-sm" style={{ color: 'var(--text3)' }}>Rating: N/A</span>
                )}
              </>
            );
          })()}
          <span className="font-mono text-sm text-[var(--text3)]">{movie.vote_count?.toLocaleString()} votes</span>
          {movie.runtime > 0 && (
            <span className="flex items-center gap-1 text-sm text-[var(--text3)]">
              <Clock size={14} /> {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
            </span>
          )}
          <span
            className="font-condensed px-2 py-0.5 rounded text-xs font-bold"
            style={{
              background: getLangColor(movie.original_language),
              color: LANG_TEXT_COLORS[movie.original_language] ?? '#fff',
              letterSpacing: '0.08em',
            }}
          >
            {getLangName(movie.original_language).toUpperCase()}
          </span>
          <span className="font-mono text-sm text-[var(--text3)]">{formatDate(movie.release_date)}</span>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => inList ? remove(movie.id) : add(movie)}
              className={`btn-outline flex items-center gap-2 ${inList ? 'border-[var(--gold)] text-[var(--gold)]' : ''}`}
            >
              {inList ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              {inList ? 'In Watchlist' : 'Watchlist'}
            </button>
            {trailer && (
              <a
                href={`https://youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold flex items-center gap-2"
              >
                <Play size={16} fill="var(--bg)" /> Trailer
              </a>
            )}
          </div>
        </div>

        {movie.genres?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {movie.genres.map(g => (
              <span key={g.id} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--card2)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
                {g.name}
              </span>
            ))}
          </div>
        )}

        {movie.overview && (
          <p className="text-[var(--text2)] text-sm md:text-base leading-relaxed mb-8 max-w-3xl">
            {movie.overview}
          </p>
        )}

        {/* User Reviews */}
        <ReviewsSection movieId={movie.id} />

        {/* Production Team */}
        {crewMembers.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', color: 'var(--gold)', marginBottom: '1rem', letterSpacing: '0.06em' }}>
              Production Team
            </h2>
            <div className="crew-grid">
              {crewMembers.map(person => (
                <div key={`${person.id}-${person.role}`} className="crew-card" onClick={() => nav(`/person/${person.id}`)} style={{ cursor: 'pointer' }}>
                  <div className="crew-role">{person.role}</div>
                  <div className="crew-name">{person.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {cast.length > 0 && (
          <div className="mb-8">
            <h3 className="section-header mb-3">Cast</h3>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {cast.map(c => (
                <div
                  key={c.id}
                  className="flex-shrink-0 text-center cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ width: 80 }}
                  onClick={() => nav(`/person/${c.id}`)}
                >
                  <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--card2)' }}>
                    {c.profile_path ? (
                      <img src={tmdb.imgUrl(c.profile_path, 'w185')} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--text3)] text-xs">
                        {c.name[0]}
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium truncate">{c.name}</p>
                  <p className="text-[10px] text-[var(--text3)] truncate">{c.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(flatrate.length > 0 || rent.length > 0) && (
          <div className="mb-8">
            <h3 className="section-header mb-3 flex items-center gap-2">
              Where to Watch
              <span className="text-xs text-[var(--text3)] font-mono">India</span>
            </h3>
            <div className="card p-4">
              {flatrate.length > 0 && (
                <div className="mb-3">
                  <span className="text-xs text-[var(--text3)] uppercase tracking-wider font-medium">Stream</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {flatrate.map(p => (
                      <div key={p.provider_id} className="w-10 h-10 rounded-lg overflow-hidden" style={{ background: 'var(--card2)' }}>
                        {p.logo_path && (
                          <img src={tmdb.imgUrl(p.logo_path, 'w92')} alt={p.provider_name} className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {rent.length > 0 && (
                <div>
                  <span className="text-xs text-[var(--text3)] uppercase tracking-wider font-medium">Rent</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {rent.map(p => (
                      <div key={p.provider_id} className="w-10 h-10 rounded-lg overflow-hidden" style={{ background: 'var(--card2)' }}>
                        {p.logo_path && (
                          <img src={tmdb.imgUrl(p.logo_path, 'w92')} alt={p.provider_name} className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TV Airings Section */}
        {(() => {
          const tvInfo = TV_AIRINGS[movie.title.toLowerCase()];
          if (!tvInfo) return null;
          return (
            <div className="mb-8">
              <h3 className="section-header mb-3 flex items-center gap-2" style={{ color: 'var(--tv-purple)' }}>
                <Tv size={18} /> On TV
              </h3>
              <div className="card p-4" style={{ borderColor: 'rgba(168,85,247,0.25)', background: 'rgba(168,85,247,0.04)' }}>
                <div className="flex flex-wrap gap-4 items-start">
                  <div>
                    <p className="text-xs font-condensed font-bold mb-2" style={{ color: 'var(--text3)', letterSpacing: '0.1em' }}>CHANNELS</p>
                    <div className="flex gap-2 flex-wrap">
                      {tvInfo.channels.map(ch => (
                        <span key={ch} className="font-condensed font-bold text-xs px-2 py-1 rounded"
                          style={{ background: 'var(--card2)', color: 'var(--tv-purple)', border: '1px solid rgba(168,85,247,0.3)', letterSpacing: '0.06em' }}>
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-condensed font-bold mb-2" style={{ color: 'var(--text3)', letterSpacing: '0.1em' }}>FREQUENCY</p>
                    <span className="font-condensed font-bold text-sm" style={{ color: 'var(--tv-purple)' }}>{tvInfo.frequency}</span>
                  </div>
                  <div>
                    <p className="text-xs font-condensed font-bold mb-2" style={{ color: 'var(--text3)', letterSpacing: '0.1em' }}>TOTAL AIRINGS</p>
                    <span className="font-condensed font-bold text-sm flex items-center gap-1" style={{ color: 'var(--tv-purple)' }}>
                      <Tv size={14} /> 📺 {tvInfo.airCount} times
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-condensed font-bold ml-auto"
                    style={{ background: 'rgba(168,85,247,0.15)', color: 'var(--tv-purple)', border: '1px solid rgba(168,85,247,0.3)', letterSpacing: '0.06em' }}>
                    📺 TV CLASSIC
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {similar.length > 0 && (
          <ScrollRow title="You Might Also Like" movies={similar} />
        )}
      </div>
    </div>
  );
}
