import { useLocalStorage } from './useLocalStorage';

export interface SearchHistoryItem {
  city: string;
  searchedAt: string;
}

export function useSearchHistory(maxItems: number = 5) {
  const [history, setHistory] = useLocalStorage<SearchHistoryItem[]>('weather-search-history', []);

  const addSearch = (city: string) => {
    setHistory((prev) => {
      // Remove if it already exists so we can push it to the top
      const filtered = prev.filter((item) => item.city.toLowerCase() !== city.toLowerCase());
      
      const newItem: SearchHistoryItem = {
        city,
        searchedAt: new Date().toISOString(),
      };
      
      // Add to front and limit length
      return [newItem, ...filtered].slice(0, maxItems);
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    addSearch,
    clearHistory,
  };
}
