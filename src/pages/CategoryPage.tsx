import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getWhatsHot, getHighestRatedSI, getFeelGoodSI, getRomanticSI,
  getAwardWinnersSI, getCultClassicsSI, discoverSI, tmdb, type Movie,
} from '../lib/tmdb';
import MovieCard from '../components/MovieCard';

const CATEGORY_MAP: Record<string, { title: string; fetch: () => Promise<any[]> }> = {
  'trending-global': { title: 'Trending Worldwide', fetch: () => tmdb.getTrending('week').then(r => r.results || []) },
  'whats-hot': { title: "What's Hot in South India", fetch: () => getWhatsHot().then(r => r.results) },
  'highest-rated': { title: 'Highest Rated South Indian', fetch: () => getHighestRatedSI().then(r => r.results) },
  'tamil': { title: 'Kollywood — Tamil', fetch: () => discoverSI({ with_original_language: 'ta', sort_by: 'vote_average.desc', 'vote_count.gte': 150, 'primary_release_date.gte': '1980-01-01', page: 1 }).then(r => r.results) },
  'telugu': { title: 'Tollywood — Telugu', fetch: () => discoverSI({ with_original_language: 'te', sort_by: 'vote_average.desc', 'vote_count.gte': 150, 'primary_release_date.gte': '1980-01-01', page: 1 }).then(r => r.results) },
  'malayalam': { title: 'Mollywood — Malayalam', fetch: () => discoverSI({ with_original_language: 'ml', sort_by: 'vote_average.desc', 'vote_count.gte': 100, 'primary_release_date.gte': '1980-01-01', page: 1 }).then(r => r.results) },
  'kannada': { title: 'Sandalwood — Kannada', fetch: () => discoverSI({ with_original_language: 'kn', sort_by: 'vote_average.desc', 'vote_count.gte': 50, 'primary_release_date.gte': '1980-01-01', page: 1 }).then(r => r.results) },
  'action': { title: 'Action Blockbusters', fetch: () => discoverSI({ with_genres: '28', sort_by: 'popularity.desc', 'vote_count.gte': 80, 'primary_release_date.gte': '1980-01-01', page: 1 }).then(r => r.results) },
  'thriller': { title: 'Thriller & Suspense', fetch: () => discoverSI({ with_genres: '53', sort_by: 'vote_average.desc', 'vote_count.gte': 80, 'primary_release_date.gte': '1980-01-01', page: 1 }).then(r => r.results) },
  'feel-good': { title: 'Feel Good Solus', fetch: () => getFeelGoodSI().then(r => r.results) },
  'romantic': { title: 'Romantic Hits', fetch: () => getRomanticSI().then(r => r.results) },
  'award-winners': { title: 'Award Winners', fetch: () => getAwardWinnersSI().then(r => r.results) },
  'cult-classics': { title: 'Cult Classics', fetch: () => getCultClassicsSI().then(r => r.results) },
};

export default function CategoryPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const category = id ? CATEGORY_MAP[id] : null;

  useEffect(() => {
    if (!category) { setLoading(false); return; }
    setLoading(true);
    category.fetch()
      .then(data => {
        const seen = new Set<number>();
        setMovies(data.filter((m: any) => { if (seen.has(m.id)) return false; seen.add(m.id); return m.poster_path; }));
      })
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen pt-4 md:pt-6 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <button
          onClick={() => nav('/')}
          className="flex items-center gap-2 text-[var(--text3)] hover:text-[var(--gold)] transition-colors mb-4"
        >
          <ArrowLeft size={18} /> Back to Home
        </button>

        <div className="flex items-center gap-3 mb-6">
          <h1 className="font-display text-3xl md:text-4xl" style={{ color: 'var(--gold)' }}>
            {category?.title || 'Category'}
          </h1>
          <span className="font-mono text-xs text-[var(--text3)]">
            {movies.length} films
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-shrink-0" style={{ width: 175 }}>
                <div className="skeleton aspect-[2/3] rounded-lg" />
                <div className="skeleton h-4 w-3/4 mt-2" />
              </div>
            ))}
          </div>
        ) : !category ? (
          <div className="text-center py-20">
            <p className="text-[var(--text3)]">Category not found</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--text3)]">No movies in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map(m => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
