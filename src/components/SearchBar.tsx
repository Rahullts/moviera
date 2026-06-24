import { useState, FormEvent } from 'react';
import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search movies...' }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className="relative flex items-center rounded-xl transition-all duration-200"
      style={{
        background: focused ? 'var(--card2)' : 'var(--surface)',
        border: `1px solid ${focused ? 'var(--gold)' : 'var(--border)'}`,
        boxShadow: focused ? '0 0 0 3px rgba(232,184,75,0.1)' : 'none',
      }}
    >
      <Search size={18} className="ml-4 text-[var(--text3)] flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent py-3 px-3 text-sm text-[var(--text)] placeholder:text-[var(--text3)] outline-none"
      />
      {value && (
        <button onClick={() => onChange('')} className="mr-3 p-1 rounded-full hover:bg-dark-surface-3 transition-colors">
          <X size={14} className="text-[var(--text3)]" />
        </button>
      )}
    </div>
  );
}
