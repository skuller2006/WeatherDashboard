import { MapPin, Clock, Heart } from 'lucide-react';
import type { CurrentWeather as CurrentWeatherType } from '../types/weather';
import {
  formatTemperature,
  formatDate,
  formatTime,
  getConditionEmoji,
  getConditionGradient,
} from '../utils/weatherUtils';
import { useSettings } from '../hooks/useSettings';

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function CurrentWeather({ data, isFavorite, onToggleFavorite }: CurrentWeatherProps) {
  const { settings } = useSettings();
  const isDark = document.documentElement.classList.contains('dark');
  const gradient = getConditionGradient(data.condition.code, isDark);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient}
        p-6 sm:p-8 text-white shadow-lg`}
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: City + Date */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-white/80 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-semibold truncate">
              {data.city}, {data.country}
            </h2>
            {onToggleFavorite && (
              <button
                onClick={onToggleFavorite}
                className="ml-2 p-1.5 rounded-full hover:bg-white/20 transition-colors"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-white/80'
                  }`}
                />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(data.updatedAt)}</span>
            <span className="text-white/40">•</span>
            <span>{formatTime(data.updatedAt)}</span>
          </div>

          {/* Condition */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-4xl" role="img" aria-label={data.condition.label}>
              {getConditionEmoji(data.condition.code)}
            </span>
            <div>
              <p className="text-lg font-medium text-white/90">{data.condition.label}</p>
              <p className="text-sm text-white/70 mt-1">
                Feels like {formatTemperature(data.feelsLike, settings.unitSystem)}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Temperature */}
        <div className="flex flex-col items-end">
          <div className="flex items-start text-white">
            <span className="text-7xl font-bold tracking-tighter">
              {formatTemperature(data.temperature, settings.unitSystem).replace(/°[CF]/, '')}
            </span>
            <span className="text-3xl font-medium mt-2 ml-1">
              °{settings.unitSystem === 'imperial' ? 'F' : 'C'}
            </span>
          </div>
        </div>
      </div>

      {/* Sunrise / Sunset */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex items-center gap-6 text-sm text-white/70">
        <div className="flex items-center gap-2">
          <span className="text-base">🌅</span>
          <span>Sunrise {formatTime(data.sunrise)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base">🌇</span>
          <span>Sunset {formatTime(data.sunset)}</span>
        </div>
      </div>
    </div>
  );
}
