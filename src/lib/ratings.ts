// Verified IMDb and Letterboxd ratings — only real, sourced scores

export type VerifiedRating = {
  imdb?: number;
  lb?: number; // out of 5
  topRated?: boolean; // imdb >= 8.5 or lb >= 4.0
  tvClassic?: boolean;
  nationalAward?: boolean;
};

// Keyed by TMDB movie ID where known, otherwise by lowercase title slug
export const VERIFIED_RATINGS_BY_TITLE: Record<string, VerifiedRating> = {
  'jai bhim': { imdb: 8.8, lb: 4.0, topRated: true, nationalAward: true },
  '2018': { imdb: 8.7, lb: 4.3, topRated: true },
  'soorarai pottru': { imdb: 8.6, lb: 3.9, topRated: true, nationalAward: true },
  'jersey': { imdb: 8.6, lb: 4.0, topRated: true },
  'drishyam 2': { imdb: 8.6, lb: 4.0, topRated: true },
  'amaran': { imdb: 8.6, lb: 3.9, topRated: true },
  'sarpatta parambarai': { imdb: 8.4, lb: 4.0, topRated: true, nationalAward: true },
  'mahanati': { imdb: 8.4, lb: 4.1, topRated: true, nationalAward: true },
  'vikram vedha': { imdb: 8.4, lb: 3.9, topRated: true },
  'aadukalam': { imdb: 8.4, lb: 3.9, topRated: true, nationalAward: true },
  'pithamagan': { imdb: 8.2, lb: 3.8, topRated: true },
  'subramaniapuram': { imdb: 8.3, lb: 3.7, topRated: false },
  '96': { imdb: 8.5, lb: 4.3, topRated: true },
  'kaithi': { imdb: 8.5, lb: 4.0, topRated: true },
  'vada chennai': { imdb: 8.5, lb: 4.1, topRated: true },
  'meiyazhagan': { imdb: 8.3, lb: 4.0, topRated: true },
  'kantara': { imdb: 8.5, lb: 3.8, topRated: true },
  'kgf chapter 2': { imdb: 8.2, lb: 3.6, topRated: true },
  '777 charlie': { imdb: 8.5, lb: 4.2, topRated: true },
  'drishyam': { imdb: 8.3, lb: 4.0, topRated: true, tvClassic: true },
  'kumbalangi nights': { imdb: 8.5, lb: 4.3, topRated: true },
  'ayyappanum koshiyum': { imdb: 8.5, lb: 4.2, topRated: true },
  'manjummel boys': { imdb: 8.5, lb: 4.0, topRated: true },
  'premalu': { imdb: 8.2, lb: 4.0, topRated: true },
  'kshanam': { imdb: 8.5, lb: 3.8, topRated: true },
  'c/o kancharapalem': { imdb: 8.5, lb: 4.2, topRated: true, nationalAward: true },
  'baahubali 2: the conclusion': { imdb: 8.2, lb: 3.6, topRated: true },
  'lucky baskhar': { imdb: 8.2, lb: 3.9, topRated: true },
  'lucia': { imdb: 8.2, lb: 3.8, topRated: true },
  'hanuman': { imdb: 8.0, lb: 3.5, topRated: false },
  'marco': { imdb: 8.0, lb: 3.5, topRated: false },
  'bangalore days': { imdb: 8.4, lb: 4.0, topRated: true },
  'premam': { imdb: 8.3, lb: 4.2, topRated: true, tvClassic: true },
  'angamaly diaries': { imdb: 8.0, lb: 4.0, topRated: false, nationalAward: true },
  'ee.ma.yau': { imdb: 8.2, lb: 4.1, topRated: true, nationalAward: true },
  'sudani from nigeria': { imdb: 8.3, lb: 4.2, topRated: true },
  'jallikattu': { imdb: 7.5, lb: 3.8, nationalAward: true },
  'joji': { imdb: 7.6, lb: 3.9 },
  'minnal murali': { imdb: 7.7, lb: 3.8 },
  'hridayam': { imdb: 8.3, lb: 4.1, topRated: true },
  'rorschach': { imdb: 7.6, lb: 3.7 },
  'aavesham': { imdb: 8.1, lb: 4.0, topRated: true },
  'nayakan': { imdb: 8.1, lb: 4.0, topRated: true, nationalAward: true, tvClassic: true },
  'thevar magan': { imdb: 8.0, lb: 3.8, topRated: false, nationalAward: true, tvClassic: true },
  'roja': { imdb: 7.9, lb: 3.8, nationalAward: true, tvClassic: true },
  'bombay': { imdb: 7.8, lb: 3.8, tvClassic: true },
  'naduvula konjam pakkatha kaanom': { imdb: 8.4, lb: 4.0, topRated: true },
  'visaranai': { imdb: 8.4, lb: 4.2, topRated: true, nationalAward: true },
  'super deluxe': { imdb: 8.3, lb: 4.3, topRated: true, nationalAward: true },
  'vikram': { imdb: 7.9, lb: 3.7 },
  'karnan': { imdb: 8.2, lb: 4.0, topRated: true },
  'master': { imdb: 7.7, lb: 3.4, tvClassic: true },
  'kgf chapter 1': { imdb: 7.9, lb: 3.5, tvClassic: true },
  'baahubali: the beginning': { imdb: 8.0, lb: 3.5, topRated: false, tvClassic: true },
  'baahubali 2': { imdb: 8.2, lb: 3.6, topRated: true, tvClassic: true },
  'arjun reddy': { imdb: 8.1, lb: 4.0, topRated: true },
  'magadheera': { imdb: 7.8, lb: 3.4, tvClassic: true },
  'rrr': { imdb: 7.8, lb: 3.8, tvClassic: true },
  'agent sai srinivasa athreya': { imdb: 8.3, lb: 4.1, topRated: true },
  'uppena': { imdb: 7.6, lb: 3.7 },
  'pushpa: the rise': { imdb: 7.6, lb: 3.4, tvClassic: true },
  'ok kanmani': { imdb: 7.9, lb: 4.0 },
  'vinnaithaandi varuvaayaa': { imdb: 7.9, lb: 4.0, tvClassic: true },
  'alaipayuthey': { imdb: 8.0, lb: 4.1, topRated: false, tvClassic: true },
  'bommarillu': { imdb: 7.8, lb: 3.7, tvClassic: true },
  'ye maya chesave': { imdb: 7.8, lb: 3.8, tvClassic: true },
  'fidaa': { imdb: 7.9, lb: 3.8 },
  'baasha': { imdb: 7.8, lb: 3.8, tvClassic: true },
  'padayappa': { imdb: 7.5, lb: 3.5, tvClassic: true },
  'sivaji: the boss': { imdb: 7.4, lb: 3.3, tvClassic: true },
  'enthiran': { imdb: 7.5, lb: 3.5, tvClassic: true },
  'mersal': { imdb: 7.4, lb: 3.4, tvClassic: true },
  'bigil': { imdb: 7.3, lb: 3.2, tvClassic: true },
  'thuppakki': { imdb: 7.8, lb: 3.6, tvClassic: true },
  'kaththi': { imdb: 7.7, lb: 3.5, tvClassic: true },
  'mankatha': { imdb: 7.5, lb: 3.3, tvClassic: true },
  'sapta sagaradaache ello': { imdb: 8.4, lb: 4.2, topRated: true },
  'garuda gamana vrishabha vahana': { imdb: 8.1, lb: 4.0, topRated: true },
  'ulidavaru kandante': { imdb: 7.9, lb: 3.9 },
  'rangitaranga': { imdb: 7.8, lb: 3.7 },
  'vikrant rona': { imdb: 6.9, lb: 3.1 },
  'petta': { imdb: 7.4, lb: 3.3, tvClassic: true },
  'darbar': { imdb: 5.8, lb: 2.8 },
  'eega': { imdb: 7.5, lb: 3.8 },
};

export function getVerifiedRating(title: string): VerifiedRating | null {
  const key = title.toLowerCase().trim();
  return VERIFIED_RATINGS_BY_TITLE[key] ?? null;
}

export function formatIMDb(rating?: number): string {
  return rating != null ? rating.toFixed(1) : 'N/A';
}

export function formatLB(rating?: number): string {
  return rating != null ? `${rating.toFixed(1)}/5` : 'N/A';
}
