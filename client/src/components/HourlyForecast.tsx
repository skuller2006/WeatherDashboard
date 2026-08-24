import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { HourlyForecast as HourlyForecastType } from '../types/weather';
import { formatHour, formatTemperature, getConditionEmoji } from '../utils/weatherUtils';
import { useSettings } from '../hooks/useSettings';

interface HourlyForecastProps {
  data: HourlyForecastType[];
}

export default function HourlyForecast({ data }: HourlyForecastProps) {
  const { settings } = useSettings();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (data.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 200;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className="relative rounded-xl bg-white dark:bg-white/5
        border border-gray-100 dark:border-white/8
        shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wider">
          Hourly Forecast
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/10
              hover:bg-gray-200 dark:hover:bg-white/20
              text-gray-500 dark:text-gray-400
              transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/10
              hover:bg-gray-200 dark:hover:bg-white/20
              text-gray-500 dark:text-gray-400
              transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable area */}
      <div
        ref={scrollRef}
        className="flex gap-1 px-4 pb-5 overflow-x-auto scroll-smooth
          scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200
          dark:scrollbar-thumb-white/10 snap-x snap-mandatory"
      >
        {data.map((hour, index) => (
          <div
            key={hour.time}
            className={`flex-shrink-0 snap-start flex flex-col items-center gap-2
              py-3 px-4 rounded-xl transition-all duration-200
              ${index === 0
                ? 'bg-blue-50 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30'
                : 'hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
          >
            <span
              className={`text-xs font-medium
                ${index === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
            >
              {index === 0 ? 'Now' : formatHour(hour.time)}
            </span>

            <span className="text-2xl" role="img" aria-label={hour.condition.label}>
              {getConditionEmoji(hour.condition.code)}
            </span>

            <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">
              {formatTemperature(hour.temperature, settings.unitSystem)}
            </div>

            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              💧 {hour.precipitation}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
