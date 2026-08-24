import { useState } from 'react';
import {
  AlertTriangle,
  X,
  Thermometer,
  Wind,
  Sun,
  CloudRain,
  CloudLightning,
  EyeOff,
} from 'lucide-react';
import type { WeatherAlert as WeatherAlertType } from '../types/weather';
import clsx from 'clsx';

interface WeatherAlertsProps {
  alerts: WeatherAlertType[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  thermometer: <Thermometer className="w-5 h-5" />,
  wind: <Wind className="w-5 h-5" />,
  sun: <Sun className="w-5 h-5" />,
  'cloud-rain': <CloudRain className="w-5 h-5" />,
  'cloud-lightning': <CloudLightning className="w-5 h-5" />,
  'eye-off': <EyeOff className="w-5 h-5" />,
  default: <AlertTriangle className="w-5 h-5" />,
};

const SEVERITY_STYLES = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/20',
    icon: 'text-blue-500',
    title: 'text-blue-800 dark:text-blue-300',
    text: 'text-blue-700 dark:text-blue-400',
    badge: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/20',
    icon: 'text-amber-500',
    title: 'text-amber-800 dark:text-amber-300',
    text: 'text-amber-700 dark:text-amber-400',
    badge: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-500/10',
    border: 'border-red-200 dark:border-red-500/20',
    icon: 'text-red-500',
    title: 'text-red-800 dark:text-red-300',
    text: 'text-red-700 dark:text-red-400',
    badge: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
  },
};

export default function WeatherAlerts({ alerts }: WeatherAlertsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  if (alerts.length === 0) return null;

  const visibleAlerts = alerts.filter((a) => !dismissed.has(a.id));
  if (visibleAlerts.length === 0) return null;

  const dismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wider">
        ⚠️ Weather Alerts
      </h3>

      {visibleAlerts.map((alert) => {
        const styles = SEVERITY_STYLES[alert.severity];
        const icon = ICON_MAP[alert.icon] || ICON_MAP.default;

        return (
          <div
            key={alert.id}
            className={clsx(
              'flex items-start gap-3 p-4 rounded-xl border transition-all duration-300',
              styles.bg,
              styles.border,
              'animate-slide-in'
            )}
            role="alert"
          >
            {/* Icon */}
            <span className={clsx('flex-shrink-0 mt-0.5', styles.icon)}>{icon}</span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={clsx('text-sm font-semibold', styles.title)}>
                  {alert.title}
                </h4>
                <span
                  className={clsx(
                    'text-[10px] font-medium px-1.5 py-0.5 rounded-full uppercase tracking-wider',
                    styles.badge
                  )}
                >
                  {alert.severity}
                </span>
              </div>
              <p className={clsx('text-xs leading-relaxed', styles.text)}>
                {alert.description}
              </p>
            </div>

            {/* Dismiss */}
            <button
              onClick={() => dismiss(alert.id)}
              className={clsx(
                'flex-shrink-0 p-1 rounded-lg transition-colors',
                'hover:bg-black/5 dark:hover:bg-white/10',
                styles.icon
              )}
              aria-label={`Dismiss ${alert.title}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
