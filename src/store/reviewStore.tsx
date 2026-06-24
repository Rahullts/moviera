import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export type Review = {
  id: string;
  movie_id: number;
  user_id: string;
  username: string;
  rating: number;
  content: string;
  created_at: string;
};

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  fetchReviews: (movieId: number) => Promise<void>;
  addReview: (movieId: number, rating: number, content: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  userReview: Review | null;
}

const ReviewContext = createContext<ReviewState | null>(null);

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);

  const fetchReviews = useCallback(async (movieId: number) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('reviews')
        .select('*')
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false });
      if (err) throw err;
      setReviews(data || []);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const addReview = useCallback(async (movieId: number, rating: number, content: string) => {
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Sign in to review'); return; }
    const username = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    const { data, error: err } = await supabase
      .from('reviews')
      .upsert({
        movie_id: movieId,
        user_id: user.id,
        username,
        rating,
        content,
      }, { onConflict: 'movie_id,user_id' })
      .select()
      .single();
    if (err) { setError(err.message); return; }
    if (data) {
      setUserReview(data);
      setReviews(prev => [data, ...prev.filter(r => r.id !== data.id)]);
    }
  }, []);

  const deleteReview = useCallback(async (reviewId: string) => {
    const { error: err } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (err) { setError(err.message); return; }
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    setUserReview(null);
  }, []);

  return (
    <ReviewContext.Provider value={{ reviews, loading, error, fetchReviews, addReview, deleteReview, userReview }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error('useReviews must be inside ReviewProvider');
  return ctx;
}
