import { useNavigate } from 'react-router-dom';
import { Star, Tv, Trophy } from 'lucide-react';
import { tmdb, type Movie } from '../lib/tmdb';
import { getLangColor, getLangName, LANG_TEXT_COLORS } from '../lib/utils';
import { getVerifiedRating } from '../lib/ratings';

interface Props {
  movie: Movie;
  size?: 'sm' | 'md' | 'lg';
}

function isNewRelease(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const release = new Date(dateStr);
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 3);
  return release >= cutoff;
}

export default function MovieCard({ movie, size = 'md' }: Props) {
  const nav = useNavigate();
  const widths = { sm: '140px', md: '175px', lg: '200px' };
  const w = widths[size];

  const langColor = getLangColor(movie.original_language);
  const langTextColor = LANG_TEXT_COLORS[movie.original_language] ?? '#fff';
  const verified = getVerifiedRating(movie.title.toLowerCase());

  const displayRating = verified?.imdb ?? (movie.vote_average > 0 ? movie.vote_average : null);
  const lbRating = verified?.lb;
  const isTopRated = verified?.topRated || (displayRating != null && displayRating >= 8.5);
  const isTvClassic = verified?.tvClassic;
  const isNationalAward = verified?.nationalAward;
  const isNew = isNewRelease(movie.release_date);
  const isLBLoved = lbRating != null && lbRating >= 4.0;

  // Top-right badge priority: NEW > TOP RATED > LB LOVED > TV CLASSIC > NATIONAL AWARD
  const topRightBadge = isNew
    ? { label: 'NEW', bg: 'var(--success)', color: '#0F0F0F' }
    : isTopRated
      ? { label: 'TOP RATED', bg: 'var(--gold)', color: '#0F0F0F' }
      : isLBLoved
        ? { label: '♦ LB LOVED', bg: '#FF8000', color: '#fff' }
        : isTvClassic
          ? null // icon instead
          : isNationalAward
            ? { label: '🏆', bg: 'rgba(200,200,200,0.15)', color: '#C0C0C0' }
            : null;

  const ratingColor = displayRating != null
    ? displayRating >= 8 ? '#21D07A' : displayRating >= 7 ? '#F5C518' : '#FF8000'
    : '#F5C518';

  return (
    <div
      className="flex-shrink-0 cursor-pointer group"
      style={{ width: w }}
      onClick={() => nav(`/movie/${movie.id}`)}
    >
      <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '2/3', background: 'var(--card2)' }}>
        {movie.poster_path ? (
          <img
            src={tmdb.imgUrl(movie.poster_path, 'w342')}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Star size={32} style={{ color: 'var(--text3)' }} />
          </div>
        )}

        {/* Hover gradient */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />

        {/* Language badge — top left */}
        <div
          className="absolute top-2 left-2 font-condensed font-bold px-2 py-0.5 rounded"
          style={{ background: langColor, color: langTextColor, fontSize: '9px', letterSpacing: '0.08em' }}
        >
          {getLangName(movie.original_language).toUpperCase()}
        </div>

        {/* Top-right badge */}
        {topRightBadge && (
          <div
            className="absolute top-2 right-2 font-condensed font-bold px-1.5 py-0.5 rounded"
            style={{ background: topRightBadge.bg, color: topRightBadge.color, fontSize: '8px', letterSpacing: '0.08em' }}
          >
            {topRightBadge.label}
          </div>
        )}
        {/* TV Classic icon (no text badge, just icon) */}
        {!topRightBadge && isTvClassic && (
          <div className="absolute top-2 right-2" title="TV Classic — airs frequently">
            <Tv size={13} style={{ color: 'var(--tv-purple)', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.8))' }} />
          </div>
        )}

        {/* National Award icon (stacked under top-right if it has another badge) */}
        {topRightBadge && isNationalAward && (
          <div className="absolute top-8 right-2" title="National Award Winner">
            <Trophy size={12} style={{ color: '#C0C0C0', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.8))' }} />
          </div>
        )}

        {/* IMDb rating — bottom left */}
        {displayRating != null && (
          <div
            className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md font-mono font-bold text-xs"
            style={{
              background: ratingColor,
              color: '#0F0F0F',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              fontSize: '11px',
            }}
          >
            <Star size={9} fill="#0F0F0F" stroke="#0F0F0F" />
            {(verified?.imdb ?? displayRating).toFixed(1)}
          </div>
        )}

        {/* Letterboxd rating — bottom right */}
        {lbRating != null && (
          <div
            className="absolute bottom-2 right-2 font-mono font-bold rounded-md"
            style={{ background: '#FF8000', color: '#fff', fontSize: '9px', padding: '3px 5px' }}
          >
            ♦{lbRating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="mt-2 px-0.5">
        <p className="text-sm font-semibold truncate leading-tight"
          style={{ color: 'var(--text)', fontFamily: "'Barlow', sans-serif", fontWeight: 600 }}>
          {movie.title}
        </p>
        <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text3)' }}>
          {movie.release_date?.slice(0, 4) || '—'}
        </p>
      </div>
    </div>
  );
}
