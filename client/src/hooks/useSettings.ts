import { useLocalStorage } from './useLocalStorage';

export type UnitSystem = 'metric' | 'imperial';

export interface UserSettings {
  unitSystem: UnitSystem;
  tempAlertThreshold: number; // Stored in Celsius, converted if needed
  windAlertThreshold: number; // Stored in km/h, converted if needed
}

const DEFAULT_SETTINGS: UserSettings = {
  unitSystem: 'metric',
  tempAlertThreshold: 35, // 35°C
  windAlertThreshold: 30, // 30 km/h
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<UserSettings>('weather-settings', DEFAULT_SETTINGS);

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return {
    settings,
    updateSettings,
  };
}
