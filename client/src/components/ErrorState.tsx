import { CloudOff, MapPinOff, WifiOff, RefreshCw, Search } from 'lucide-react';
import type { ErrorCode } from '../types/weather';
import clsx from 'clsx';

interface ErrorStateProps {
  code: ErrorCode;
  message: string;
  onRetry?: () => void;
  onSearch?: () => void;
}

const ERROR_CONFIG: Record<
  ErrorCode,
  { icon: React.ReactNode; title: string; color: string }
> = {
  CITY_NOT_FOUND: {
    icon: <Search className="w-8 h-8" />,
    title: 'City Not Found',
    color: 'text-amber-500',
  },
  INVALID_INPUT: {
    icon: <Search className="w-8 h-8" />,
    title: 'Invalid Search',
    color: 'text-amber-500',
  },
  API_ERROR: {
    icon: <CloudOff className="w-8 h-8" />,
    title: 'Service Unavailable',
    color: 'text-red-500',
  },
  NETWORK_ERROR: {
    icon: <WifiOff className="w-8 h-8" />,
    title: 'Network Error',
    color: 'text-red-500',
  },
  RATE_LIMITED: {
    icon: <CloudOff className="w-8 h-8" />,
    title: 'Too Many Requests',
    color: 'text-amber-500',
  },
  LOCATION_DENIED: {
    icon: <MapPinOff className="w-8 h-8" />,
    title: 'Location Access Denied',
    color: 'text-amber-500',
  },
  LOCATION_UNAVAILABLE: {
    icon: <MapPinOff className="w-8 h-8" />,
    title: 'Location Unavailable',
    color: 'text-amber-500',
  },
  UNKNOWN_ERROR: {
    icon: <CloudOff className="w-8 h-8" />,
    title: 'Something Went Wrong',
    color: 'text-red-500',
  },
};

export default function ErrorState({ code, message, onRetry, onSearch }: ErrorStateProps) {
  const config = ERROR_CONFIG[code] || ERROR_CONFIG.UNKNOWN_ERROR;

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div
        className="flex flex-col items-center text-center max-w-md px-6 py-10
          rounded-2xl bg-white dark:bg-white/5
          border border-gray-100 dark:border-white/8
          shadow-sm"
      >
        {/* Icon */}
        <div
          className={clsx(
            'flex items-center justify-center w-16 h-16 rounded-2xl mb-4',
            'bg-gray-50 dark:bg-white/10',
            config.color
          )}
        >
          {config.icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          {config.title}
        </h3>

        {/* Message */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2
                bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium
                rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
          {onSearch && (
            <button
              onClick={onSearch}
              className="flex items-center gap-2 px-4 py-2
                bg-gray-100 dark:bg-white/10
                hover:bg-gray-200 dark:hover:bg-white/15
                text-gray-700 dark:text-gray-300
                text-sm font-medium rounded-xl
                transition-all duration-200"
            >
              <Search className="w-4 h-4" />
              Search Another City
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
