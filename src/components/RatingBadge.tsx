import { Star } from 'lucide-react';

interface Props {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function RatingBadge({ rating, size = 'md' }: Props) {
  if (!rating) return null;
  const sizes = { sm: 'text-xs px-1.5 py-0.5', md: 'text-sm px-2 py-1', lg: 'text-base px-2.5 py-1' };

  const color = rating >= 7 ? 'var(--success)' : rating >= 5 ? 'var(--gold)' : 'var(--error)';

  return (
    <span className={`inline-flex items-center gap-1 rounded font-mono font-medium ${sizes[size]}`}
      style={{ background: 'rgba(14,19,24,0.85)', color }}>
      <Star size={size === 'sm' ? 10 : size === 'md' ? 12 : 14} fill={color} stroke={color} />
      {rating.toFixed(1)}
    </span>
  );
}
