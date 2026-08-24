import { CloudSun, Settings } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';
import { buildChartData } from '../utils/weatherUtils';
import SearchBar from '../components/SearchBar';
import ThemeToggle from '../components/ThemeToggle';
import SavedLocations from '../components/SavedLocations';
import CurrentWeather from '../components/CurrentWeather';
import WeatherStats from '../components/WeatherStats';
import HourlyForecast from '../components/HourlyForecast';
import WeeklyForecast from '../components/WeeklyForecast';
import WeatherChart from '../components/WeatherChart';
import WeatherAlerts from '../components/WeatherAlerts';
import WeatherInsight from '../components/WeatherInsight';
import WeatherMap from '../components/WeatherMap';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import SettingsModal from '../components/SettingsModal';
import { useFavorites } from '../hooks/useFavorites';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { useSettings } from '../hooks/useSettings';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { data, isLoading, error, searchCity, useCurrentLocation, clearError } = useWeather();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { history, addSearch } = useSearchHistory();
  const { settings, updateSettings } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (data) {
      addSearch(data.current.city);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.current.city]);

  const handleSearch = (city: string) => {
    clearError();
    searchCity(city);
  };

  const handleFocusSearch = () => {
    const input = document.getElementById('city-search-input') as HTMLInputElement | null;
    input?.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] transition-colors duration-300">
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl
          bg-white/80 dark:bg-[#0B1120]/80
          border-b border-gray-200/60 dark:border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500 text-white shadow-sm">
                <CloudSun className="w-5 h-5" />
              </div>
              <h1 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white whitespace-nowrap">
                <span className="hidden sm:inline">Weather Dashboard</span>
                <span className="sm:hidden">Weather</span>
              </h1>
            </div>

            {/* Search */}
            <div className="flex-1 flex justify-center max-w-xl">
              <SearchBar
                onSearch={handleSearch}
                onUseLocation={useCurrentLocation}
                isLoading={isLoading}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8
                  text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              {/* Saved Locations Dropdown */}
              <SavedLocations
                favorites={favorites}
                recentSearches={history}
                onSelectCity={handleSearch}
                onRemoveFavorite={removeFavorite}
              />
              
              {/* Theme toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content ───────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Loading State */}
        {isLoading && <LoadingState />}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorState
            code={error.code}
            message={error.message}
            onRetry={() => handleSearch('Hyderabad')}
            onSearch={handleFocusSearch}
          />
        )}

        {/* Dashboard Content */}
        {data && !isLoading && !error && (
          <>
            {/* Alerts (if any) */}
            {data.alerts.length > 0 && <WeatherAlerts alerts={data.alerts} />}

            {/* Current Weather Hero */}
            <CurrentWeather 
              data={data.current} 
              isFavorite={isFavorite(data.current.city)}
              onToggleFavorite={() => {
                if (isFavorite(data.current.city)) {
                  removeFavorite(data.current.city);
                } else {
                  addFavorite(data.current.city, data.current.country, data.current.latitude, data.current.longitude);
                }
              }}
            />

            {/* Weather Stats Grid */}
            <WeatherStats data={data.current} />

            {/* Hourly Forecast */}
            <HourlyForecast data={data.hourly} />

            {/* Charts + 7-Day Forecast */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherChart data={buildChartData(data.hourly, settings.unitSystem)} unitSystem={settings.unitSystem} />
              <WeeklyForecast data={data.daily} />
            </div>

            {/* Interactive Map & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherMap
                latitude={data.current.latitude}
                longitude={data.current.longitude}
                city={data.current.city}
              />
              <WeatherInsight insight={data.insight} />
            </div>

            {/* Footer */}
            <footer className="pt-6 pb-8 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-600">
                Data provided by OpenWeatherMap. Weather API integration complete.
              </p>
            </footer>
          </>
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        updateSettings={updateSettings}
      />
    </div>
  );
}
