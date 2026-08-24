import type { ReactNode } from 'react';
import clsx from 'clsx';

interface WeatherCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  description?: string;
  accentColor?: string;
  className?: string;
}

export default function WeatherCard({
  icon,
  label,
  value,
  unit,
  description,
  accentColor = 'text-blue-500',
  className,
}: WeatherCardProps) {
  return (
    <div
      className={clsx(
        `group relative overflow-hidden rounded-xl
        bg-white dark:bg-white/5
        border border-gray-100 dark:border-white/8
        p-4 sm:p-5
        shadow-sm hover:shadow-md
        transition-all duration-300
        hover:-translate-y-0.5`,
        className
      )}
    >
      {/* Accent glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
          bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-500/5 dark:to-transparent"
      />

      <div className="relative z-10">
        {/* Icon + Label */}
        <div className="flex items-center gap-2 mb-3">
          <span className={clsx('flex-shrink-0', accentColor)}>{icon}</span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {label}
          </span>
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white">
            {value}
          </span>
          {unit && (
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {unit}
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}
