import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { tmdb, type Person, type Movie } from '../lib/tmdb';
import MovieCard from '../components/MovieCard';

export default function PersonPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    tmdb.getPersonDetails(Number(id))
      .then(setPerson)
      .catch(() => setPerson(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-4 pb-24 md:pb-8 max-w-7xl mx-auto px-4 md:px-6">
        <div className="skeleton h-8 w-24 mb-6" />
        <div className="flex gap-6">
          <div className="skeleton w-48 h-64 rounded-lg flex-shrink-0" />
          <div className="flex-1">
            <div className="skeleton h-8 w-48 mb-4" />
            <div className="skeleton h-4 w-full mb-2" />
            <div className="skeleton h-4 w-3/4 mb-2" />
            <div className="skeleton h-4 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!person) return <div className="min-h-screen flex items-center justify-center text-[var(--text3)]">Not found</div>;

  const knownFor = person.movie_credits?.cast
    ?.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
    ?.slice(0, 20) || [];

  return (
    <div className="min-h-screen pt-4 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <button onClick={() => nav(-1)} className="flex items-center gap-2 text-sm text-[var(--text3)] hover:text-[var(--text)] mb-6 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="flex-shrink-0 w-48 mx-auto md:mx-0">
            {person.profile_path ? (
              <img
                src={tmdb.imgUrl(person.profile_path, 'w342')}
                alt={person.name}
                className="w-full rounded-xl shadow-xl"
              />
            ) : (
              <div className="w-full aspect-[3/4] rounded-xl bg-dark-surface-3 flex items-center justify-center">
                <span className="font-display text-4xl text-[var(--text3)]">{person.name[0]}</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="font-display text-4xl md:text-5xl text-white mb-2">{person.name}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-[var(--text3)] mb-4">
              {person.known_for_department && <span>{person.known_for_department}</span>}
              {person.birthday && <span className="font-mono">{person.birthday}</span>}
              {person.place_of_birth && <span>{person.place_of_birth}</span>}
            </div>
            {person.biography && (
              <p className="text-sm text-[var(--text2)] leading-relaxed max-w-2xl">{person.biography}</p>
            )}
          </div>
        </div>

        {knownFor.length > 0 && (
          <div>
            <h2 className="section-header mb-4">Known For</h2>
            <div className="movie-scroll">
              {knownFor.map(m => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
