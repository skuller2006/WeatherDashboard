import { useState, useRef, useEffect } from 'react';
import { Bookmark, Clock, MapPin, X } from 'lucide-react';
import type { FavoriteCity } from '../hooks/useFavorites';
import type { SearchHistoryItem } from '../hooks/useSearchHistory';

interface SavedLocationsProps {
  favorites: FavoriteCity[];
  recentSearches: SearchHistoryItem[];
  onSelectCity: (city: string) => void;
  onRemoveFavorite: (city: string) => void;
}

export default function SavedLocations({
  favorites,
  recentSearches,
  onSelectCity,
  onRemoveFavorite,
}: SavedLocationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (city: string) => {
    onSelectCity(city);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
          ${
            isOpen
              ? 'bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-white shadow-sm'
              : 'bg-white/80 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 hover:shadow-sm'
          }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bookmark className={`w-4 h-4 ${isOpen ? 'fill-blue-500 text-blue-500 dark:fill-white dark:text-white' : ''}`} />
        <span className="hidden sm:inline">Saved</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 
            bg-white dark:bg-gray-800 rounded-xl shadow-xl 
            border border-gray-100 dark:border-gray-700 
            overflow-hidden z-50 animate-slide-in"
        >
          <div className="max-h-[70vh] overflow-y-auto overscroll-contain">
            {/* Favorites Section */}
            <div className="p-2">
              <h4 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Favorites
              </h4>
              
              {favorites.length === 0 ? (
                <p className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500 italic">
                  No favorite cities yet. Click the heart icon on a city to save it.
                </p>
              ) : (
                <ul className="space-y-0.5">
                  {favorites.map((fav) => (
                    <li key={fav.city} className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                      <button
                        onClick={() => handleSelect(fav.city)}
                        className="flex items-center gap-2 flex-1 text-left"
                      >
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{fav.city}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">{fav.country}</p>
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFavorite(fav.city);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-red-50 dark:hover:bg-red-500/10"
                        title="Remove from favorites"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />

            {/* Recent Searches Section */}
            <div className="p-2">
              <h4 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Recent Searches
              </h4>
              
              {recentSearches.length === 0 ? (
                <p className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500 italic">
                  No recent searches.
                </p>
              ) : (
                <ul className="space-y-0.5">
                  {recentSearches.map((item, i) => (
                    <li key={`${item.city}-${i}`}>
                      <button
                        onClick={() => handleSelect(item.city)}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-left"
                      >
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {item.city}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
