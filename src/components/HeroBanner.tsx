import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { tmdb, type Movie } from '../lib/tmdb';
import { getLangName, getLangColor, LANG_TEXT_COLORS } from '../lib/utils';
import { getVerifiedRating } from '../lib/ratings';

interface Props {
  movies: Movie[];
}

const ROTATION_MS = 6000;

export default function HeroBanner({ movies }: Props) {
  const nav = useNavigate();
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((next: number) => {
    setFading(true);
    setTimeout(() => {
      setIdx(next);
      setFading(false);
    }, 350);
  }, []);

  useEffect(() => {
    if (movies.length <= 1) return;
    const t = setInterval(() => {
      goTo((idx + 1) % movies.length);
    }, ROTATION_MS);
    return () => clearInterval(t);
  }, [idx, movies.length, goTo]);

  if (!movies.length) return null;

  const movie = movies[idx];
  const langColor = getLangColor(movie.original_language);
  const langTextColor = LANG_TEXT_COLORS[movie.original_language] ?? '#fff';
  const langName = getLangName(movie.original_language);
  const verified = getVerifiedRating(movie.title.toLowerCase());
  const imdbRating = verified?.imdb ?? (movie.vote_average > 0 ? movie.vote_average : null);
  const lbRating = verified?.lb;
  const isTopRated = verified?.topRated || (imdbRating != null && imdbRating >= 8.5);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 'min(88vh, 840px)',
        minHeight: '520px',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      {/* ── Backdrop image with fade transition ── */}
      {movie.backdrop_path ? (
        <img
          key={movie.id}
          src={tmdb.imgUrl(movie.backdrop_path, 'original')}
          alt=""
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            opacity: fading ? 0 : 1,
            transition: 'opacity 0.35s ease',
          }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: 'var(--card2)' }} />
      )}

      {/* Top vignette */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,15,15,0.55) 0%, transparent 22%)' }} />
      {/* Bottom-up gradient for text */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0F0F0F 0%, rgba(15,15,15,0.9) 18%, rgba(15,15,15,0.45) 42%, transparent 68%)' }} />
      {/* Left gradient for text legibility */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,15,15,0.88) 0%, rgba(15,15,15,0.5) 28%, rgba(15,15,15,0.1) 52%, transparent 70%)' }} />

      {/* ── Content ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-end',
          paddingTop: '88px',
          paddingBottom: '80px',
          paddingLeft: 'clamp(1.5rem, 5vw, 5rem)',
          paddingRight: 'clamp(1.5rem, 5vw, 5rem)',
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.35s ease',
        }}
      >
        <div style={{ maxWidth: '640px', width: '100%' }}>

          {/* Badge row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            {/* Language tag */}
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: langColor,
                color: langTextColor,
                fontFamily: "'Barlow Condensed', sans-serif",
              }}
            >
              {langName}
            </span>

            {/* Year */}
            {movie.release_date && (
              <span style={{ fontSize: '13px', color: 'var(--text3)', fontFamily: "'DM Mono', monospace" }}>
                {movie.release_date.slice(0, 4)}
              </span>
            )}

            {/* TOP RATED badge */}
            {isTopRated && (
              <span style={{
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                background: 'var(--gold)',
                color: '#0F0F0F',
                fontFamily: "'Barlow Condensed', sans-serif",
              }}>
                TOP RATED
              </span>
            )}

            {/* IMDb rating */}
            {imdbRating != null && (
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '4px',
                background: 'rgba(245,197,24,0.15)',
                border: '1px solid rgba(245,197,24,0.3)',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--gold)',
                fontFamily: "'DM Mono', monospace",
              }}>
                <Star size={10} fill="var(--gold)" stroke="none" />
                {imdbRating.toFixed(1)} <span style={{ fontSize: '9px', color: 'var(--text3)', marginLeft: 2 }}>IMDb</span>
              </span>
            )}

            {/* Letterboxd rating */}
            {lbRating != null && (
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '4px',
                background: 'rgba(255,128,0,0.15)',
                border: '1px solid rgba(255,128,0,0.3)',
                fontSize: '12px',
                fontWeight: 700,
                color: '#FF8000',
                fontFamily: "'DM Mono', monospace",
              }}>
                ♦ {lbRating.toFixed(1)} <span style={{ fontSize: '9px', color: 'var(--text3)', marginLeft: 2 }}>LB</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(2.6rem, 6vw, 5.2rem)',
            lineHeight: 0.95,
            letterSpacing: '0.04em',
            color: '#FFFFFF',
            textShadow: '0 2px 28px rgba(0,0,0,0.7)',
            marginBottom: '16px',
            wordBreak: 'break-word',
          }}>
            {movie.title}
          </h1>

          {/* Overview */}
          {movie.overview && (
            <p style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 'clamp(0.82rem, 1.15vw, 0.95rem)',
              color: 'var(--text2)',
              lineHeight: 1.65,
              marginBottom: '28px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              maxWidth: '520px',
            }}>
              {movie.overview}
            </p>
          )}

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => nav(`/movie/${movie.id}`)}
              className="btn-gold"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', fontSize: '14px', fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.06em', borderRadius: '10px' }}
            >
              <Play size={15} fill="var(--bg)" stroke="none" />
              VIEW DETAILS
            </button>
            <button
              onClick={() => nav(`/movie/${movie.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px', fontSize: '14px',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700, letterSpacing: '0.06em',
                color: '#fff',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '10px', cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            >
              <Info size={15} /> MORE INFO
            </button>
          </div>
        </div>
      </div>

      {/* ── Dot indicators ── */}
      {movies.length > 1 && (
        <div style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '6px', alignItems: 'center',
        }}>
          {movies.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === idx ? '24px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === idx ? 'var(--gold)' : 'rgba(255,255,255,0.35)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Prev / Next arrows ── */}
      {movies.length > 1 && (
        <>
          <button
            onClick={() => goTo((idx - 1 + movies.length) % movies.length)}
            style={{
              position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%',
              width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff', transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.65)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.4)')}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => goTo((idx + 1) % movies.length)}
            style={{
              position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%',
              width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff', transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.65)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.4)')}
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Bottom fade */}
      <div aria-hidden style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px',
        background: 'linear-gradient(to top, var(--bg), transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
