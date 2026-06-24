import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import CalendarPage from './pages/CalendarPage';
import WatchlistPage from './pages/WatchlistPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import MovieDetailPage from './pages/MovieDetailPage';
import PersonPage from './pages/PersonPage';
import TopRatedPage from './pages/TopRatedPage';
import CategoryPage from './pages/CategoryPage';
import TVSchedulePage from './pages/TVSchedulePage';
import { useAuth } from './store/authStore';
import { ReviewProvider } from './store/reviewStore';

// Pages that manage their own top spacing (hero or full-screen)
const NO_NAV_OFFSET_PATHS = ['/', '/auth'];

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (user && loc.pathname === '/auth') {
      nav('/', { replace: true });
    }
  }, [user, loc.pathname, nav]);

  return <>{children}</>;
}

function AppContent() {
  const loc = useLocation();
  const needsOffset = !NO_NAV_OFFSET_PATHS.includes(loc.pathname);

  return (
    <AuthRedirect>
      <Navbar />
      {/* Offset for fixed 72px navbar on pages without a hero */}
      <main style={{ paddingTop: needsOffset ? '72px' : '0px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/top-rated" element={<TopRatedPage />} />
          <Route path="/tv-schedule" element={<TVSchedulePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/person/:id" element={<PersonPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
        </Routes>
      </main>
    </AuthRedirect>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <ReviewProvider>
          <AppContent />
        </ReviewProvider>
      </div>
    </BrowserRouter>
  );
}
