import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onUseLocation: () => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, onUseLocation, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('');
      inputRef.current?.blur();
    }
  };

  // Keyboard shortcut: Ctrl/Cmd + K to focus search
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-xl">
      {/* Search Input */}
      <div
        className={`relative flex-1 flex items-center transition-all duration-300
          ${isFocused ? 'ring-2 ring-blue-400/50 dark:ring-blue-500/30' : ''}
          bg-white/80 dark:bg-white/10 backdrop-blur-sm
          border border-gray-200 dark:border-white/10
          rounded-xl shadow-sm hover:shadow-md`}
      >
        <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-3 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Search city..."
          disabled={isLoading}
          className="w-full py-2.5 px-3 bg-transparent text-sm
            text-gray-800 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            outline-none disabled:opacity-50"
          aria-label="Search for a city"
          id="city-search-input"
        />
        {/* Keyboard shortcut hint */}
        {!isFocused && !query && (
          <span className="hidden sm:flex items-center gap-0.5 mr-3 text-xs text-gray-400 dark:text-gray-600">
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 rounded text-[10px] font-mono border border-gray-200 dark:border-white/10">
              Ctrl
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 rounded text-[10px] font-mono border border-gray-200 dark:border-white/10">
              K
            </kbd>
          </span>
        )}
      </div>

      {/* Search Button */}
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="flex items-center justify-center px-4 py-2.5
          bg-blue-500 hover:bg-blue-600 active:bg-blue-700
          disabled:bg-blue-300 dark:disabled:bg-blue-800/50
          text-white text-sm font-medium rounded-xl
          transition-all duration-200 shadow-sm hover:shadow-md
          disabled:cursor-not-allowed disabled:shadow-none"
        aria-label="Search"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <span>Search</span>
        )}
      </button>

      {/* Location Button */}
      <button
        type="button"
        onClick={onUseLocation}
        disabled={isLoading}
        className="flex items-center justify-center w-10 h-10
          bg-white/80 dark:bg-white/10 backdrop-blur-sm
          border border-gray-200 dark:border-white/10
          hover:bg-blue-50 dark:hover:bg-white/20
          text-gray-600 dark:text-gray-300
          rounded-xl transition-all duration-200
          shadow-sm hover:shadow-md
          disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Use my current location"
        title="Use my current location"
      >
        <MapPin className="w-4 h-4" />
      </button>
    </form>
  );
}
