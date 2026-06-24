import { useNavigate } from 'react-router-dom';
import { LogOut, Bookmark, Film } from 'lucide-react';
import { useAuth } from '../store/authStore';
import { useWatchlist } from '../store/watchlistStore';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { items } = useWatchlist();
  const nav = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen pt-4 md:pt-6 pb-24 md:pb-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--text2)] mb-4">Sign in to view your profile</p>
          <button onClick={() => nav('/auth')} className="btn-gold">Sign In</button>
        </div>
      </div>
    );
  }

  const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const email = user.email;

  return (
    <div className="min-h-screen pt-4 md:pt-6 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        <div className="card p-8 text-center mb-6">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'var(--gold)' }}>
            <span className="text-2xl font-bold" style={{ color: 'var(--bg)' }}>
              {name[0]?.toUpperCase()}
            </span>
          </div>
          <h2 className="font-display text-3xl text-white mb-1">{name}</h2>
          <p className="text-sm text-[var(--text3)] font-mono">{email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button onClick={() => nav('/watchlist')} className="card p-6 text-center hover:border-[var(--border2)] transition-colors">
            <Bookmark size={24} className="mx-auto mb-2 text-[var(--gold)]" />
            <p className="font-display text-2xl text-white">{items.length}</p>
            <p className="text-xs text-[var(--text3)] mt-1">Watchlist</p>
          </button>
          <button onClick={() => nav('/')} className="card p-6 text-center hover:border-[var(--border2)] transition-colors">
            <Film size={24} className="mx-auto mb-2 text-[var(--gold)]" />
            <p className="font-display text-2xl text-white">Browse</p>
            <p className="text-xs text-[var(--text3)] mt-1">Movies</p>
          </button>
        </div>

        <button onClick={signOut} className="btn-outline w-full flex items-center justify-center gap-2">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}
