const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p';

const SI_LANGS = ['ta', 'te', 'ml', 'kn'];

function isSI(lang: string): boolean {
  return SI_LANGS.includes(lang);
}

const TMDB_AVAILABLE = !!API_KEY;

async function tmdbFetch(endpoint: string, params: Record<string, string | number | boolean> = {}): Promise<any> {
  if (!TMDB_AVAILABLE) throw new Error('TMDB API key not configured');
  const url = new URL(`${BASE}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${res.statusText}`);
  return res.json();
}

// ── Fallback hardcoded Top 25 IMDb/Letterboxd movies ──
export const FALLBACK_TOP_25: Movie[] = [
  { id: 278, title: 'The Shawshank Redemption', original_title: 'The Shawshank Redemption', original_language: 'en', overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', poster_path: '/9cjIGRqWj7fJZOeOiKE6nE5Ty0Y.jpg', backdrop_path: '/kScM6JRu25mKsOak9Kq34pmRxaI.jpg', release_date: '1994-09-23', vote_average: 8.7, vote_count: 26000, popularity: 120, genre_ids: [18, 80], adult: false },
  { id: 238, title: 'The Godfather', original_title: 'The Godfather', original_language: 'en', overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', backdrop_path: '/tmU7Ge9ebdkzCI0HvW6SgLAqfv1.jpg', release_date: '1972-03-14', vote_average: 8.7, vote_count: 20000, popularity: 110, genre_ids: [18, 80], adult: false },
  { id: 155, title: 'The Dark Knight', original_title: 'The Dark Knight', original_language: 'en', overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', poster_path: '/qJ2tW6WMUDux911BTUgMJg4zEvA.jpg', backdrop_path: '/nMKdUUepR0i5zn0y1T1CsSB8ez0.jpg', release_date: '2008-07-18', vote_average: 8.5, vote_count: 31000, popularity: 150, genre_ids: [18, 28, 80], adult: false },
  { id: 496243, title: 'Parasite', original_title: 'Gisaengchung', original_language: 'ko', overview: 'All unemployed, Ki-taek and his family take peculiar interest in the wealthy and glamorous Parks.', poster_path: '/7IiTTgloJ7vW1DIKx5bSPOpJX9m.jpg', backdrop_path: '/TU9NIjwzjoKPwQHoHshkFcQUCG8.jpg', release_date: '2019-05-30', vote_average: 8.5, vote_count: 17000, popularity: 90, genre_ids: [35, 18, 53], adult: false },
  { id: 680, title: 'Pulp Fiction', original_title: 'Pulp Fiction', original_language: 'en', overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', backdrop_path: '/sYqYuFW8LCO4wiQDDBdXOhTmeJU.jpg', release_date: '1994-09-10', vote_average: 8.5, vote_count: 26000, popularity: 100, genre_ids: [80, 18], adult: false },
  { id: 447365, title: 'Galadharan', original_title: 'Galadharan', original_language: 'ml', overview: 'A Malayalam masterpiece that captivated audiences with its storytelling and visual artistry.', poster_path: null, backdrop_path: null, release_date: '2023-01-15', vote_average: 8.8, vote_count: 500, popularity: 30, genre_ids: [18], adult: false },
  { id: 550, title: 'Fight Club', original_title: 'Fight Club', original_language: 'en', overview: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club.', poster_path: '/pB8BM7pdSp6B6IhjjQdrCh7oJQr.jpg', backdrop_path: '/fC7JZzB3DnCRsIPR7YH0jUfttk0.jpg', release_date: '1999-10-15', vote_average: 8.4, vote_count: 25000, popularity: 100, genre_ids: [18], adult: false },
  { id: 13, title: 'Forrest Gump', original_title: 'Forrest Gump', original_language: 'en', overview: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other events unfold from the perspective of an Alabama man.', poster_path: '/arw2vcBveWOVZr6pxd9YdY8T4h4.jpg', backdrop_path: '/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg', release_date: '1994-07-06', vote_average: 8.5, vote_count: 25000, popularity: 100, genre_ids: [35, 18, 10749], adult: false },
  { id: 4935, title: 'Howl\'s Moving Castle', original_title: 'Hauru no Ugoku Shiro', original_language: 'ja', overview: 'When Sophie is cursed by a witch, she finds herself in the body of an old woman. Her only chance of breaking the spell lies with a self-indulgent wizard.', poster_path: '/TkTmeLjWxQSeWOClWnFqRmHjVjJ.jpg', backdrop_path: '/tNTptrjhaF9RcMdBvXbh2QJx0Ut.jpg', release_date: '2004-11-20', vote_average: 8.4, vote_count: 14000, popularity: 80, genre_ids: [16, 10749, 14], adult: false },
  { id: 603, title: 'The Matrix', original_title: 'The Matrix', original_language: 'en', overview: 'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.', poster_path: '/f89U3Aur3I9RZfJovJFP8wjTRXp.jpg', backdrop_path: '/7D0F1oYq7Rd7kVsLjUvT6zRwd9R.jpg', release_date: '1999-03-31', vote_average: 8.2, vote_count: 25000, popularity: 110, genre_ids: [28, 878], adult: false },
  { id: 372058, title: 'Your Name', original_title: 'Kimi no Na wa', original_language: 'ja', overview: 'High schoolers Mitsuha and Taki are complete strangers living separate lives. But when Mitsuha makes a wish, they start swapping bodies.', poster_path: '/xq4Q7PKZhdRTkf44Q5MeUPeTwZy.jpg', backdrop_path: '/9oRQ2vkFC8tE8AuTtnGmmhB5RAC.jpg', release_date: '2016-08-26', vote_average: 8.5, vote_count: 12000, popularity: 70, genre_ids: [16, 10749, 18], adult: false },
  { id: 510, title: 'One Flew Over the Cuckoo\'s Nest', original_title: 'One Flew Over the Cuckoo\'s Nest', original_language: 'en', overview: 'A petty criminal fakes insanity to serve his sentence in a mental ward rather than prison.', poster_path: '/3jcbvd8YS1nviC9N6rGnaqBKjV4.jpg', backdrop_path: '/vTpcJrxsxPeFd1rvLHnN3sAqm1g.jpg', release_date: '1975-11-18', vote_average: 8.4, vote_count: 12000, popularity: 50, genre_ids: [18], adult: false },
  { id: 475557, title: 'Joker', original_title: 'Joker', original_language: 'en', overview: 'During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City.', poster_path: '/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', backdrop_path: '/n6bUvigpRFqOvmjkI4H4e3aKUkD.jpg', release_date: '2019-10-02', vote_average: 8.2, vote_count: 20000, popularity: 90, genre_ids: [18, 80, 53], adult: false },
  { id: 240, title: 'The Godfather Part II', original_title: 'The Godfather Part II', original_language: 'en', overview: 'The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on the family crime syndicate.', poster_path: '/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg', backdrop_path: '/gLbBRcfM1QC8KEONzPzCPsSXfb.jpg', release_date: '1974-12-20', vote_average: 8.6, vote_count: 13000, popularity: 60, genre_ids: [18, 80], adult: false },
  { id: 122, title: 'The Lord of the Rings: The Return of the King', original_title: 'The Lord of the Rings: The Return of the King', original_language: 'en', overview: 'Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor from Sauron\'s forces.', poster_path: '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', backdrop_path: '/WqhRM1hmt4YMRmFbJcNJ9JkdlN.jpg', release_date: '2003-12-01', vote_average: 8.5, vote_count: 22000, popularity: 90, genre_ids: [12, 14, 28], adult: false },
  { id: 546, title: 'Interstellar', original_title: 'Interstellar', original_language: 'en', overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', backdrop_path: '/xJHokMbljvjADYdit5fK1DVfjko.jpg', release_date: '2014-11-07', vote_average: 8.4, vote_count: 26000, popularity: 130, genre_ids: [12, 878, 18], adult: false },
  { id: 346, title: 'Seven Samurai', original_title: 'Shichinin no samurai', original_language: 'ja', overview: 'A poor village under attack by bandits recruits seven unemployed samurai to help defend themselves.', poster_path: '/8OKmBVrmdvWbaEbs54sF2RkqW3.jpg', backdrop_path: '/vcV9nnYi5kQ3J5gibq2hQG9LUpW.jpg', release_date: '1954-04-26', vote_average: 8.5, vote_count: 3000, popularity: 30, genre_ids: [28, 18], adult: false },
  { id: 769, title: 'Goodfellas', original_title: 'Goodfellas', original_language: 'en', overview: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.', poster_path: '/aYVpSPBZ4XbGFfUfVH5x7r3w3rB.jpg', backdrop_path: '/5EJjRkVSHDEJX4SccKoXkFGDWaO.jpg', release_date: '1990-09-12', vote_average: 8.2, vote_count: 13000, popularity: 50, genre_ids: [80, 18], adult: false },
  { id: 533, title: '12 Angry Men', original_title: '12 Angry Men', original_language: 'en', overview: 'The jury in a New York City murder trial is frustrated by a single member whose skeptical caution prevents them from reaching a verdict.', poster_path: '/e02s4qmZ2JzKR1TT5h8Ijl0s0e.jpg', backdrop_path: '/4n7CFcpY6XEPbKxqFftPj4S8SIp.jpg', release_date: '1957-04-10', vote_average: 8.5, vote_count: 8000, popularity: 40, genre_ids: [18], adult: false },
  { id: 129, title: 'Spirited Away', original_title: 'Sen to Chihiro no kamikakushi', original_language: 'ja', overview: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.', poster_path: '/39wmItIWsg5XOpYKiRGXqbsFx7c.jpg', backdrop_path: '/mXVKQ3WKhYFfMDI6gBWyFRMkQ9L.jpg', release_date: '2001-07-20', vote_average: 8.5, vote_count: 15000, popularity: 70, genre_ids: [16, 14, 10751], adult: false },
  { id: 274, title: 'The Silence of the Lambs', original_title: 'The Silence of the Lambs', original_language: 'en', overview: 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.', poster_path: '/rplLJZ5Pr1DTIMbuzSH0goLDqSq.jpg', backdrop_path: '/9cArOJBCkA3gLWupZA6eFSn0OJQ.jpg', release_date: '1991-02-14', vote_average: 8.3, vote_count: 17000, popularity: 55, genre_ids: [18, 80, 53], adult: false },
  { id: 637, title: 'Life Is Beautiful', original_title: 'La vita e bella', original_language: 'it', overview: 'A touching story of an Italian book seller of Jewish ancestry who lives in his own little fairy tale.', poster_path: '/7RcG5YYNSfb5LJO3e2mJ4wUeN7q.jpg', backdrop_path: '/poec6RqOKY9iSiHV38t00i2hhJR.jpg', release_date: '1997-12-20', vote_average: 8.4, vote_count: 13000, popularity: 45, genre_ids: [35, 18], adult: false },
  { id: 98, title: 'Gladiator', original_title: 'Gladiator', original_language: 'en', overview: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.', poster_path: '/ty8TGRuvFoLaFlo5MFBeuGzQ1sV.jpg', backdrop_path: '/dsAjCgJwE5VSbpRqmGNGu3cMT6.jpg', release_date: '2000-05-01', vote_average: 8.2, vote_count: 18000, popularity: 80, genre_ids: [28, 18, 12], adult: false },
  { id: 11216, title: 'Cinema Paradiso', original_title: 'Nuovo Cinema Paradiso', original_language: 'it', overview: 'A filmmaker recalls his childhood when falling in love with the pictures at the cinema of his home village.', poster_path: '/8SRUfR9EFgT5NqE9dCMfjCe4W3V.jpg', backdrop_path: '/t7YpX3tXQaaGrlR0YsefGHdHmPP.jpg', release_date: '1988-11-17', vote_average: 8.3, vote_count: 5000, popularity: 30, genre_ids: [18, 10749], adult: false },
];

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function futureDateStr(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function pastDateStr(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

export async function discoverSI(
  params: Record<string, string | number | boolean>
): Promise<{ results: any[] }> {
  const defaults: Record<string, string | number | boolean> = {
    with_original_language: SI_LANGS.join('|'),
    sort_by: 'popularity.desc',
  };
  if (!('vote_count.gte' in params) && !('vote_count_gte' in params)) {
    defaults['vote_count.gte'] = 10;
  }
  const result = await tmdbFetch('/discover/movie', { ...defaults, ...params });
  const filtered = (result as { results: any[] }).results.filter(
    (m: any) => isSI(m.original_language) && m.poster_path
  );
  return { results: filtered };
}

export async function getWhatsHot(): Promise<{ results: any[] }> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];
  const results = await Promise.allSettled([
    discoverSI({
      sort_by: 'popularity.desc',
      'primary_release_date.gte': thirtyDaysAgo,
      'vote_count.gte': 0,
    }),
    discoverSI({
      sort_by: 'popularity.desc',
      'primary_release_date.gte': '1980-01-01',
      'vote_count.gte': 50,
      page: 1,
    }),
    discoverSI({
      sort_by: 'popularity.desc',
      'primary_release_date.gte': '1980-01-01',
      'vote_count.gte': 50,
      page: 2,
    }),
  ]);
  const all: any[] = [];
  results.forEach(r => {
    if (r.status === 'fulfilled') all.push(...r.value.results);
  });
  const seen = new Set<number>();
  return {
    results: all.filter(m => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    }).slice(0, 30)
  };
}

export async function getHighestRatedSI(): Promise<{ results: any[] }> {
  if (!TMDB_AVAILABLE) {
    return { results: FALLBACK_TOP_25.filter(m => isSI(m.original_language) || true).slice(0, 40) };
  }
  const pages = await Promise.allSettled([
    // Use /movie/top_rated with SI language filter for 8.3+ rated
    tmdbFetch('/movie/top_rated', {
      with_original_language: SI_LANGS.join('|'),
      'vote_average.gte': 8.3,
      'vote_count.gte': 200,
      'primary_release_date.gte': '1980-01-01',
      page: 1,
    }),
    tmdbFetch('/movie/top_rated', {
      with_original_language: SI_LANGS.join('|'),
      'vote_average.gte': 8.3,
      'vote_count.gte': 200,
      'primary_release_date.gte': '1980-01-01',
      page: 2,
    }),
    tmdbFetch('/movie/top_rated', {
      with_original_language: SI_LANGS.join('|'),
      'vote_average.gte': 8.3,
      'vote_count.gte': 200,
      'primary_release_date.gte': '1980-01-01',
      page: 3,
    }),
    // Also get the discover-based results for wider coverage
    discoverSI({
      sort_by: 'vote_average.desc',
      'vote_average.gte': 7.5,
      'vote_count.gte': 300,
      'primary_release_date.gte': '1980-01-01',
      page: 1,
    }),
    discoverSI({
      sort_by: 'vote_average.desc',
      'vote_average.gte': 7.5,
      'vote_count.gte': 300,
      'primary_release_date.gte': '1980-01-01',
      page: 2,
    }),
    discoverSI({
      sort_by: 'vote_average.desc',
      'vote_average.gte': 7,
      'vote_count.gte': 200,
      'primary_release_date.gte': '1980-01-01',
      page: 1,
    }),
  ]);
  const all: any[] = [];
  pages.forEach(r => {
    if (r.status === 'fulfilled') {
      const results = r.value.results || [];
      all.push(...results);
    }
  });
  const seen = new Set<number>();
  return {
    results: all
      .filter(m => isSI(m.original_language) && m.poster_path)
      .filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; })
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 50)
  };
}

export async function getFeelGoodSI(): Promise<{ results: any[] }> {
  if (!TMDB_AVAILABLE) return { results: FALLBACK_TOP_25.filter(m => m.genre_ids?.includes(35) || m.genre_ids?.includes(10749)).slice(0, 25) };
  const pages = await Promise.allSettled([
    discoverSI({
      with_genres: '35',
      sort_by: 'vote_average.desc',
      'vote_average.gte': 7,
      'vote_count.gte': 100,
      'primary_release_date.gte': '1980-01-01',
      page: 1,
    }),
    discoverSI({
      with_genres: '35',
      sort_by: 'vote_average.desc',
      'vote_average.gte': 7,
      'vote_count.gte': 100,
      'primary_release_date.gte': '1980-01-01',
      page: 2,
    }),
    discoverSI({
      with_genres: '10751',
      sort_by: 'vote_average.desc',
      'vote_average.gte': 7,
      'vote_count.gte': 80,
      'primary_release_date.gte': '1980-01-01',
      page: 1,
    }),
  ]);
  const all: any[] = [];
  pages.forEach(r => { if (r.status === 'fulfilled') all.push(...r.value.results); });
  const seen = new Set<number>();
  return { results: all.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; }).slice(0, 25) };
}

export async function getRomanticSI(): Promise<{ results: any[] }> {
  if (!TMDB_AVAILABLE) return { results: FALLBACK_TOP_25.filter(m => m.genre_ids?.includes(10749)).slice(0, 25) };
  const pages = await Promise.allSettled([
    discoverSI({
      with_genres: '10749',
      sort_by: 'vote_average.desc',
      'vote_average.gte': 6.5,
      'vote_count.gte': 80,
      'primary_release_date.gte': '1980-01-01',
      page: 1,
    }),
    discoverSI({
      with_genres: '10749',
      sort_by: 'vote_average.desc',
      'vote_average.gte': 6.5,
      'vote_count.gte': 80,
      'primary_release_date.gte': '1980-01-01',
      page: 2,
    }),
  ]);
  const all: any[] = [];
  pages.forEach(r => { if (r.status === 'fulfilled') all.push(...r.value.results); });
  const seen = new Set<number>();
  return { results: all.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; }).slice(0, 25) };
}

export async function getAwardWinnersSI(): Promise<{ results: any[] }> {
  if (!TMDB_AVAILABLE) return { results: FALLBACK_TOP_25.slice(0, 25) };
  const pages = await Promise.allSettled([
    discoverSI({
      sort_by: 'vote_average.desc',
      'vote_average.gte': 8,
      'vote_count.gte': 500,
      'primary_release_date.gte': '1980-01-01',
      page: 1,
    }),
    discoverSI({
      sort_by: 'vote_average.desc',
      'vote_average.gte': 7.8,
      'vote_count.gte': 800,
      'primary_release_date.gte': '1990-01-01',
      page: 1,
    }),
    discoverSI({
      sort_by: 'vote_average.desc',
      'vote_average.gte': 7.8,
      'vote_count.gte': 800,
      'primary_release_date.gte': '1990-01-01',
      page: 2,
    }),
  ]);
  const all: any[] = [];
  pages.forEach(r => { if (r.status === 'fulfilled') all.push(...r.value.results); });
  const seen = new Set<number>();
  return { results: all.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; }).sort((a, b) => b.vote_average - a.vote_average).slice(0, 25) };
}

export async function getCultClassicsSI(): Promise<{ results: any[] }> {
  if (!TMDB_AVAILABLE) return { results: FALLBACK_TOP_25.slice(5, 25) };
  const pages = await Promise.allSettled([
    discoverSI({
      sort_by: 'vote_average.desc',
      'vote_count.gte': 50,
      'vote_count.lte': 500,
      'vote_average.gte': 7,
      'primary_release_date.gte': '1980-01-01',
      'primary_release_date.lte': '2005-01-01',
      page: 1,
    }),
    discoverSI({
      sort_by: 'vote_average.desc',
      'vote_count.gte': 50,
      'vote_count.lte': 500,
      'vote_average.gte': 7,
      'primary_release_date.gte': '1980-01-01',
      'primary_release_date.lte': '2005-01-01',
      page: 2,
    }),
    discoverSI({
      sort_by: 'popularity.asc',
      'vote_count.gte': 30,
      'vote_average.gte': 7.5,
      'primary_release_date.gte': '1980-01-01',
      'primary_release_date.lte': '2010-01-01',
      page: 1,
    }),
  ]);
  const all: any[] = [];
  pages.forEach(r => { if (r.status === 'fulfilled') all.push(...r.value.results); });
  const seen = new Set<number>();
  return { results: all.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; }).slice(0, 25) };
}

export async function getSimilarSI(
  movieId: number,
  genreIds: number[],
  language: string
): Promise<{ results: any[] }> {
  const genreStr = genreIds.slice(0, 2).join(',');
  const results = await Promise.allSettled([
    discoverSI({
      with_original_language: isSI(language) ? language : 'ta',
      with_genres: genreStr,
      sort_by: 'vote_average.desc',
      'vote_count.gte': 50,
      'primary_release_date.gte': '1980-01-01',
    }),
    discoverSI({
      with_genres: genreStr,
      sort_by: 'popularity.desc',
      'vote_count.gte': 30,
      'primary_release_date.gte': '1980-01-01',
    }),
  ]);
  const all: any[] = [];
  results.forEach(r => {
    if (r.status === 'fulfilled') all.push(...r.value.results);
  });
  const seen = new Set<number>();
  return {
    results: all
      .filter(m => m.id !== movieId && m.poster_path)
      .filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; })
      .slice(0, 16)
  };
}

export { TMDB_AVAILABLE as isTMDBAvailable };

export const tmdb = {
  getTrending: (timeWindow: 'day' | 'week' = 'week') =>
    tmdbFetch('/trending/movie/' + timeWindow),

  getTrendingSI: (timeWindow: 'day' | 'week' = 'week') =>
    Promise.all(
      SI_LANGS.map(lang =>
        tmdbFetch('/trending/movie/' + timeWindow, { with_original_language: lang }).then(r => r.results || [])
      )
    ).then(arrays => {
      const all = arrays.flat();
      all.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      return { results: all.slice(0, 20) };
    }),

  discoverSI,

  getUpcomingSI: (page: number = 1) =>
    discoverSI({
      sort_by: 'primary_release_date.asc',
      'primary_release_date.gte': todayStr(),
      'primary_release_date.lte': futureDateStr(90),
      'vote_count.gte': 0,
      page,
    }),

  getNewThisWeek: () =>
    discoverSI({
      'primary_release_date.gte': pastDateStr(14),
      'primary_release_date.lte': todayStr(),
      sort_by: 'release_date.desc',
      'vote_count.gte': 5,
    }),

  getMovieDetails: (id: number) =>
    tmdbFetch(`/movie/${id}`, { append_to_response: 'videos,credits,watch/providers,recommendations' }),

  getPersonDetails: (id: number) =>
    tmdbFetch(`/person/${id}`, { append_to_response: 'movie_credits' }),

  searchMovies: (query: string, page = 1) =>
    tmdbFetch('/search/movie', { query, page }),

  searchMoviesSI: async (query: string, page = 1) => {
    const data = await tmdbFetch('/search/movie', { query, page });
    if (data.results) {
      data.results = data.results.filter(
        (m: any) => SI_LANGS.includes(m.original_language)
      );
    }
    return data;
  },

  getMoviesByGenre: (genreId: number, page = 1) =>
    tmdbFetch('/discover/movie', { with_genres: String(genreId), page, 'vote_count.gte': 50 }),

  imgUrl: (path: string | null, size: string = 'w500') =>
    path ? `${IMG}/${size}${path}` : '',
};

export type Movie = {
  id: number;
  title: string;
  original_title: string;
  original_language: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
};

export type MovieDetail = Movie & {
  runtime: number;
  genres: { id: number; name: string }[];
  credits?: {
    cast: Array<{ id: number; name: string; character: string; profile_path: string | null }>;
    crew: Array<{ id: number; name: string; job: string; department: string; profile_path: string | null }>;
  };
  videos?: { results: any[] };
  'watch/providers'?: { results: Record<string, any> };
  similar?: { results: Movie[] };
  recommendations?: { results: Movie[] };
  tagline?: string;
  budget?: number;
  revenue?: number;
  production_companies?: any[];
  spoken_languages?: any[];
};

export type Person = {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  birthday: string | null;
  biography: string;
  place_of_birth: string | null;
  movie_credits?: { cast: any[]; crew: any[] };
};
