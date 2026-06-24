import { useState, useEffect } from 'react';
import { Star, Trash2, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../store/authStore';
import { useReviews } from '../store/reviewStore';
import { useNavigate } from 'react-router-dom';

interface Props {
  movieId: number;
}

export default function ReviewsSection({ movieId }: Props) {
  const { user } = useAuth();
  const { reviews, loading, error, fetchReviews, addReview, deleteReview, userReview } = useReviews();
  const nav = useNavigate();
  const [rating, setRating] = useState(7);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews(movieId);
  }, [movieId, fetchReviews]);

  useEffect(() => {
    if (userReview) {
      setRating(userReview.rating);
      setContent(userReview.content);
    }
  }, [userReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    await addReview(movieId, rating, content.trim());
    setSubmitting(false);
    setShowForm(false);
    setContent('');
  };

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div className="flex items-center gap-3 mb-4">
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', color: 'var(--gold)', letterSpacing: '0.06em' }}>
          Public Reviews
        </h2>
        <span className="font-mono text-xs text-[var(--text3)]">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </span>
        {avgRating > 0 && (
          <span className="flex items-center gap-1 font-mono text-xs text-[var(--gold)]">
            <Star size={12} fill="var(--gold)" stroke="var(--gold)" />
            {avgRating.toFixed(1)} avg
          </span>
        )}
      </div>

      {/* Write review button */}
      {!user ? (
        <button
          onClick={() => nav('/auth')}
          className="btn-outline flex items-center gap-2 mb-4 text-sm"
        >
          <MessageSquare size={14} /> Sign in to write a review
        </button>
      ) : !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="btn-gold flex items-center gap-2 mb-4 text-sm"
          style={{ padding: '8px 20px' }}
        >
          <MessageSquare size={14} />
          {userReview ? 'Edit your review' : 'Write a review'}
        </button>
      )}

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm text-[var(--text2)]">Your rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={18}
                    fill={n <= rating ? 'var(--gold)' : 'transparent'}
                    stroke={n <= rating ? 'var(--gold)' : 'var(--text3)'}
                  />
                </button>
              ))}
            </div>
            <span className="font-mono text-sm text-[var(--gold)]">{rating}/10</span>
          </div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Share your thoughts about this film..."
            rows={3}
            className="form-input"
            style={{ resize: 'vertical', minHeight: '80px', marginBottom: '12px' }}
            maxLength={2000}
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="btn-gold flex items-center gap-2 text-sm"
              style={{ padding: '8px 20px' }}
            >
              <Send size={14} /> {submitting ? 'Posting...' : 'Post Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-outline text-sm"
              style={{ padding: '8px 16px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && (
        <p className="text-sm text-[var(--error)] mb-3">{error}</p>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-4">
              <div className="skeleton h-4 w-24 mb-2" />
              <div className="skeleton h-3 w-full mb-1" />
              <div className="skeleton h-3 w-3/4" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="card p-6 text-center">
          <MessageSquare size={32} className="mx-auto mb-2 text-[var(--text3)]" />
          <p className="text-sm text-[var(--text3)]">No reviews yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review.id} className="card p-4 fade-in">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'var(--gold)', color: 'var(--bg)' }}
                  >
                    {review.username[0]?.toUpperCase()}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[var(--text)]">{review.username}</span>
                    <span className="font-mono text-xs text-[var(--text3)] ml-2">
                      {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded"
                    style={{
                      background: review.rating >= 8 ? 'rgba(0,180,72,0.15)' : review.rating >= 5 ? 'rgba(232,184,75,0.15)' : 'rgba(232,75,75,0.15)',
                      color: review.rating >= 8 ? 'var(--success)' : review.rating >= 5 ? 'var(--gold)' : 'var(--error)',
                    }}>
                    <Star size={10} fill="currentColor" stroke="currentColor" />
                    {review.rating}/10
                  </span>
                  {user && user.id === review.user_id && (
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="text-[var(--text3)] hover:text-[var(--error)] transition-colors"
                      title="Delete review"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-[var(--text2)] leading-relaxed whitespace-pre-wrap">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
