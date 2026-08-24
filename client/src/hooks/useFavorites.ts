import { useLocalStorage } from './useLocalStorage';

export interface FavoriteCity {
  city: string;
  country: string;
  lat: number;
  lon: number;
  addedAt: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>('weather-favorites', []);

  const addFavorite = (city: string, country: string, lat: number, lon: number) => {
    setFavorites((prev) => {
      // Prevent duplicates based on coordinates (rough match) or city name
      const exists = prev.some((f) => f.city.toLowerCase() === city.toLowerCase());
      if (exists) return prev;

      const newFavorite: FavoriteCity = {
        city,
        country,
        lat,
        lon,
        addedAt: new Date().toISOString(),
      };
      
      return [...prev, newFavorite];
    });
  };

  const removeFavorite = (city: string) => {
    setFavorites((prev) => prev.filter((f) => f.city.toLowerCase() !== city.toLowerCase()));
  };

  const isFavorite = (city: string) => {
    return favorites.some((f) => f.city.toLowerCase() === city.toLowerCase());
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
