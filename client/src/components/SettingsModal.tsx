import { X, Settings, Thermometer, Wind } from 'lucide-react';
import type { UserSettings } from '../hooks/useSettings';
import { useEffect, useRef } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
}

export default function SettingsModal({ isOpen, onClose, settings, updateSettings }: SettingsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-slide-in"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            Preferences
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Unit System */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Unit System</h3>
            <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <button
                onClick={() => updateSettings({ unitSystem: 'metric' })}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  settings.unitSystem === 'metric'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Metric (°C, km/h)
              </button>
              <button
                onClick={() => updateSettings({ unitSystem: 'imperial' })}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  settings.unitSystem === 'imperial'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Imperial (°F, mph)
              </button>
            </div>
          </div>

          {/* Temp Alert */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-red-500" />
                Heat Warning Threshold
              </h3>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {settings.tempAlertThreshold}°C
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Trigger a weather alert if the temperature exceeds this value.
            </p>
            <input
              type="range"
              min="20"
              max="50"
              step="1"
              value={settings.tempAlertThreshold}
              onChange={(e) => updateSettings({ tempAlertThreshold: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>20°C</span>
              <span>50°C</span>
            </div>
          </div>

          {/* Wind Alert */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-sky-500" />
                Wind Warning Threshold
              </h3>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {settings.windAlertThreshold} km/h
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Trigger a weather alert if wind speeds exceed this value.
            </p>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={settings.windAlertThreshold}
              onChange={(e) => updateSettings({ windAlertThreshold: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10 km/h</span>
              <span>100 km/h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
