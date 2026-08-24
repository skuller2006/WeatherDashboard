import type { DailyForecast as DailyForecastType } from '../types/weather';
import { formatTemperature, getDayName, getConditionEmoji } from '../utils/weatherUtils';
import { useSettings } from '../hooks/useSettings';

interface WeeklyForecastProps {
  data: DailyForecastType[];
}

export default function WeeklyForecast({ data }: WeeklyForecastProps) {
  const { settings } = useSettings();
  if (data.length === 0) return null;

  // Find global min/max for the temperature bar
  const allTemps = data.flatMap((d) => [d.tempHigh, d.tempLow]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const range = globalMax - globalMin || 1;

  return (
    <div
      className="rounded-xl bg-white dark:bg-white/5
        border border-gray-100 dark:border-white/8
        shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wider">
          7-Day Forecast
        </h3>
      </div>

      {/* Day rows */}
      <div className="divide-y divide-gray-100 dark:divide-white/5">
        {data.map((day, index) => {
          const lowPercent = ((day.tempLow - globalMin) / range) * 100;
          const highPercent = ((day.tempHigh - globalMin) / range) * 100;

          return (
            <div
              key={day.date}
              className="flex items-center gap-3 px-5 py-3.5
                hover:bg-gray-50/50 dark:hover:bg-white/3
                transition-colors"
            >
              {/* Day name */}
              <span
                className={`w-16 text-sm font-medium flex-shrink-0
                  ${index === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              >
                {getDayName(day.date)}
              </span>

              {/* Precipitation */}
              <div className="w-12 flex items-center gap-1 flex-shrink-0">
                {day.precipitation > 10 && (
                  <>
                    <span className="text-xs">💧</span>
                    <span className="text-xs text-blue-500">{day.precipitation}%</span>
                  </>
                )}
              </div>

              {/* Icon */}
              <span className="text-xl flex-shrink-0 w-8 text-center" role="img" aria-label={day.condition.label}>
                {getConditionEmoji(day.condition.code)}
              </span>

              {/* Low temp */}
              <span className="w-10 text-right text-sm text-gray-400 dark:text-gray-500 flex-shrink-0">
                {formatTemperature(day.tempLow, settings.unitSystem)}
              </span>

              {/* Temperature bar */}
              <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full relative mx-2 min-w-[80px]">
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"
                  style={{
                    left: `${lowPercent}%`,
                    width: `${highPercent - lowPercent}%`,
                  }}
                />
              </div>

              {/* High temp */}
              <span className="w-10 text-sm font-medium text-gray-800 dark:text-white flex-shrink-0">
                {formatTemperature(day.tempHigh, settings.unitSystem)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
