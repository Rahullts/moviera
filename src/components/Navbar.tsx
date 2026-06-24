import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bookmark, User, Clapperboard, Home, Star, Tv } from 'lucide-react';
import { useAuth } from '../store/authStore';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/top-rated', label: 'Top Rated', icon: Star },
  { path: '/tv-schedule', label: 'TV', icon: Tv },
  { path: '/watchlist', label: 'Watchlist', icon: Bookmark },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Navbar() {
  const nav = useNavigate();
  const loc = useLocation();
  const { user } = useAuth();

  return (
    <>
      {/* Desktop / Tablet header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 hidden md:flex items-center"
        style={{
          height: '72px',
          background: 'rgba(8,11,15,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(232,184,75,0.12)',
          boxShadow: '0 1px 40px rgba(0,0,0,0.6)',
        }}
      >
        <div className="w-full max-w-screen-2xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => nav('/')}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            {/* Icon mark */}
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{
                width: '42px',
                height: '42px',
                background: 'linear-gradient(135deg, var(--gold) 0%, var(--accent2) 100%)',
                boxShadow: '0 0 24px rgba(232,184,75,0.4)',
              }}
            >
              <Clapperboard size={22} style={{ color: '#080B0F' }} strokeWidth={2.5} />
            </div>

            {/* Wordmark */}
            <div className="flex flex-col leading-none">
              <span
                className="font-display tracking-[0.12em]"
                style={{
                  fontSize: '1.75rem',
                  background: 'linear-gradient(135deg, #F5D080 0%, #E8B84B 50%, #C99A35 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1,
                  textShadow: 'none',
                }}
              >
                MOVIERA
              </span>
              <span
                className="font-mono tracking-[0.25em] uppercase"
                style={{ fontSize: '0.42rem', color: 'var(--text3)', letterSpacing: '0.3em', marginTop: '3px' }}
              >
                South Indian Cinema
              </span>
            </div>
          </button>

          {/* Nav links */}
          <nav className="flex items-center gap-1 mx-6">
            {[
              { path: '/', label: 'Home' },
              { path: '/top-rated', label: 'Top Rated' },
              { path: '/tv-schedule', label: 'TV Schedule' },
              { path: '/calendar', label: 'Calendar' },
              { path: '/watchlist', label: 'Watchlist' },
            ].map(item => {
              const active = loc.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => nav(item.path)}
                  className="relative px-4 py-2 rounded-lg transition-all font-condensed"
                  style={{
                    color: active ? 'var(--gold)' : 'var(--text2)',
                    background: active ? 'rgba(245,197,24,0.08)' : 'transparent',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2"
                      style={{
                        width: '20px', height: '2px',
                        background: 'var(--gold)', // active underline
                        borderRadius: '2px',
                        bottom: '4px',
                        display: 'block',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right side: Search + Auth */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search button */}
            <button
              onClick={() => nav('/search')}
              className="flex items-center gap-2 rounded-xl transition-all hover:opacity-80"
              style={{
                padding: '8px 16px',
                background: 'var(--card2)',
                border: '1px solid var(--border)',
                color: 'var(--text3)',
              }}
              title="Search movies"
            >
              <Search size={16} style={{ color: 'var(--text3)' }} />
              <span className="text-sm" style={{ color: 'var(--text3)', fontSize: '13px' }}>Search...</span>
            </button>

            {/* Auth */}
            {user ? (
              <button
                onClick={() => nav('/profile')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:opacity-80"
                style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, var(--gold), var(--accent2))', color: '#080B0F' }}
                >
                  {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                </div>
                <span className="text-sm hidden lg:inline" style={{ color: 'var(--text2)' }}>
                  {user.user_metadata?.full_name?.split(' ')[0] || 'Account'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => nav('/auth')}
                className="btn-gold flex items-center gap-1.5"
                style={{ padding: '8px 20px', fontSize: '13px', fontWeight: 600 }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: 'rgba(8,11,15,0.97)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.map(item => {
            const active = loc.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => nav(item.path)}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors"
                style={{ color: active ? 'var(--gold)' : 'var(--text3)' }}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
