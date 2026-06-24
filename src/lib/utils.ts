export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(m) - 1]} ${y}`;
}

export function formatRating(r: number) {
  return r ? r.toFixed(1) : '—';
}

export const LANG_COLORS: Record<string, string> = {
  ta: '#FF6B35',
  te: '#4ECDC4',
  ml: '#21D07A',
  kn: '#F7DC6F',
};

export const LANG_TEXT_COLORS: Record<string, string> = {
  ta: '#fff',
  te: '#000',
  ml: '#000',
  kn: '#000',
};

export const LANG_NAMES: Record<string, string> = {
  ta: 'Tamil',
  te: 'Telugu',
  ml: 'Malayalam',
  kn: 'Kannada',
  hi: 'Hindi',
  en: 'English',
};

export function getLangColor(lang: string) {
  return LANG_COLORS[lang] || '#6B7280';
}

export function getLangName(lang: string) {
  return LANG_NAMES[lang] || lang.toUpperCase();
}

export function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
