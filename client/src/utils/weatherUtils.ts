import type {
  WeatherConditionCode,
  WeatherCondition,
  CurrentWeather,
  HourlyForecast,
  WeatherAlert,
  WeatherInsight,
  ChartDataPoint,
} from '../types/weather';

// ─── Temperature Formatting ─────────────────────────────────────────────────

export function formatTemperature(tempC: number, unit: 'metric' | 'imperial' = 'metric'): string {
  const converted = unit === 'imperial' ? (tempC * 9/5) + 32 : tempC;
  const symbol = unit === 'imperial' ? 'F' : 'C';
  return `${Math.round(converted)}°${symbol}`;
}

// ─── Wind Formatting ────────────────────────────────────────────────────────

export function formatWindSpeed(speedKmh: number, unit: 'metric' | 'imperial' = 'metric'): string {
  const converted = unit === 'imperial' ? speedKmh * 0.621371 : speedKmh;
  const symbol = unit === 'imperial' ? 'mph' : 'km/h';
  return `${Math.round(converted)} ${symbol}`;
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

// ─── Visibility Formatting ──────────────────────────────────────────────────

export function formatVisibility(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

// ─── UV Index ───────────────────────────────────────────────────────────────

export function getUVLevel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: 'Low', color: '#22c55e' };
  if (uv <= 5) return { label: 'Moderate', color: '#eab308' };
  if (uv <= 7) return { label: 'High', color: '#f97316' };
  if (uv <= 10) return { label: 'Very High', color: '#ef4444' };
  return { label: 'Extreme', color: '#7c3aed' };
}

// ─── Date / Time Formatting ─────────────────────────────────────────────────

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatHour(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  });
}

export function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// ─── Weather Condition Helpers ──────────────────────────────────────────────

export function getConditionEmoji(code: WeatherConditionCode): string {
  const emojiMap: Record<WeatherConditionCode, string> = {
    'clear': '☀️',
    'partly-cloudy': '⛅',
    'cloudy': '☁️',
    'overcast': '🌥️',
    'mist': '🌫️',
    'fog': '🌫️',
    'drizzle': '🌦️',
    'rain': '🌧️',
    'heavy-rain': '🌧️',
    'thunderstorm': '⛈️',
    'snow': '❄️',
    'sleet': '🌨️',
    'hail': '🌨️',
  };
  return emojiMap[code] || '🌡️';
}

export function getConditionGradient(code: WeatherConditionCode, isDark: boolean): string {
  if (isDark) {
    const darkGradients: Partial<Record<WeatherConditionCode, string>> = {
      'clear': 'from-blue-900/80 to-slate-900',
      'partly-cloudy': 'from-slate-800 to-blue-900/70',
      'cloudy': 'from-slate-800 to-gray-900',
      'rain': 'from-slate-900 to-blue-950',
      'heavy-rain': 'from-gray-900 to-slate-950',
      'thunderstorm': 'from-gray-950 to-slate-900',
      'snow': 'from-slate-800 to-blue-900/50',
    };
    return darkGradients[code] || 'from-slate-800 to-blue-900/70';
  }

  const lightGradients: Partial<Record<WeatherConditionCode, string>> = {
    'clear': 'from-blue-400 to-sky-300',
    'partly-cloudy': 'from-blue-300 to-gray-200',
    'cloudy': 'from-gray-300 to-gray-400',
    'rain': 'from-gray-400 to-blue-400',
    'heavy-rain': 'from-gray-500 to-blue-500',
    'thunderstorm': 'from-gray-600 to-blue-600',
    'snow': 'from-blue-100 to-white',
  };
  return lightGradients[code] || 'from-blue-400 to-sky-300';
}

// ─── Weather Condition Factory ──────────────────────────────────────────────

export function createCondition(code: WeatherConditionCode): WeatherCondition {
  const labels: Record<WeatherConditionCode, { label: string; description: string }> = {
    'clear': { label: 'Clear Sky', description: 'Clear sky with no clouds' },
    'partly-cloudy': { label: 'Partly Cloudy', description: 'Partially cloudy skies' },
    'cloudy': { label: 'Cloudy', description: 'Overcast with clouds' },
    'overcast': { label: 'Overcast', description: 'Completely covered by clouds' },
    'mist': { label: 'Mist', description: 'Light mist reducing visibility' },
    'fog': { label: 'Fog', description: 'Thick fog reducing visibility significantly' },
    'drizzle': { label: 'Drizzle', description: 'Light drizzle' },
    'rain': { label: 'Rain', description: 'Moderate rainfall' },
    'heavy-rain': { label: 'Heavy Rain', description: 'Heavy rainfall expected' },
    'thunderstorm': { label: 'Thunderstorm', description: 'Thunderstorm with lightning' },
    'snow': { label: 'Snow', description: 'Snowfall' },
    'sleet': { label: 'Sleet', description: 'Freezing rain and sleet' },
    'hail': { label: 'Hail', description: 'Hailstorm' },
  };

  const info = labels[code];
  return { code, label: info.label, description: info.description };
}

// ─── Alert Generation (Deterministic) ───────────────────────────────────────

export function generateAlerts(
  current: CurrentWeather,
  hourly: HourlyForecast[],
  tempAlertThreshold: number = 35,
  windAlertThreshold: number = 30
): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  // High temperature warning
  if (current.temperature >= tempAlertThreshold + 5) {
    alerts.push({
      id: 'extreme-temp',
      type: 'temperature',
      title: 'Extreme Heat Warning',
      description: `Temperature is ${Math.round(current.temperature)}°C. Stay hydrated and avoid prolonged outdoor exposure.`,
      severity: 'danger',
      icon: 'thermometer',
    });
  } else if (current.temperature >= tempAlertThreshold) {
    alerts.push({
      id: 'high-temp',
      type: 'temperature',
      title: 'High Temperature Advisory',
      description: `Temperature has reached your alert threshold of ${tempAlertThreshold}°C.`,
      severity: 'warning',
      icon: 'thermometer',
    });
  }

  // Strong wind warning
  if (current.windSpeed >= windAlertThreshold + 20) {
    alerts.push({
      id: 'extreme-wind',
      type: 'wind',
      title: 'Extreme Wind Warning',
      description: `Wind speeds of ${Math.round(current.windSpeed)} km/h detected. Secure loose objects.`,
      severity: 'danger',
      icon: 'wind',
    });
  } else if (current.windSpeed >= windAlertThreshold) {
    alerts.push({
      id: 'high-wind',
      type: 'wind',
      title: 'Wind Advisory',
      description: `Wind speeds have reached your alert threshold of ${windAlertThreshold} km/h.`,
      severity: 'warning',
      icon: 'wind',
    });
  }

  // UV index warning
  if (current.uvIndex >= 8) {
    alerts.push({
      id: 'high-uv',
      type: 'uv',
      title: 'High UV Index Warning',
      description: `UV index is ${current.uvIndex}. Wear sunscreen and protective clothing.`,
      severity: 'danger',
      icon: 'sun',
    });
  } else if (current.uvIndex >= 6) {
    alerts.push({
      id: 'high-uv',
      type: 'uv',
      title: 'UV Index Advisory',
      description: `UV index is ${current.uvIndex}. Sun protection recommended.`,
      severity: 'warning',
      icon: 'sun',
    });
  }

  // Rain forecast
  const upcomingRain = hourly.slice(0, 12).filter((h) => h.precipitation > 50);
  if (upcomingRain.length >= 3) {
    alerts.push({
      id: 'rain-expected',
      type: 'rain',
      title: 'Heavy Rainfall Expected',
      description: `Rain is expected in the coming hours with up to ${Math.max(...upcomingRain.map((h) => h.precipitation))}% precipitation probability.`,
      severity: 'warning',
      icon: 'cloud-rain',
    });
  }

  // Thunderstorm
  const thunderstormHours = hourly
    .slice(0, 12)
    .filter((h) => h.condition.code === 'thunderstorm');
  if (thunderstormHours.length > 0) {
    alerts.push({
      id: 'thunderstorm',
      type: 'thunderstorm',
      title: 'Thunderstorm Alert',
      description: 'Thunderstorms are expected. Seek indoor shelter and avoid open areas.',
      severity: 'danger',
      icon: 'cloud-lightning',
    });
  }

  // Low visibility
  if (current.visibility < 1000) {
    alerts.push({
      id: 'low-visibility',
      type: 'visibility',
      title: 'Low Visibility Warning',
      description: `Visibility reduced to ${formatVisibility(current.visibility)}. Drive carefully.`,
      severity: 'warning',
      icon: 'eye-off',
    });
  }

  return alerts;
}

// ─── Insight Generation (Deterministic) ─────────────────────────────────────

export function generateInsights(
  current: CurrentWeather,
  hourly: HourlyForecast[]
): WeatherInsight {
  const details: string[] = [];
  const next12h = hourly.slice(0, 12);
  const temps = next12h.map((h) => h.temperature);
  const minTemp = Math.round(Math.min(...temps));
  const maxTemp = Math.round(Math.max(...temps));

  // Temperature range summary
  details.push(
    `Temperatures are expected to range between ${minTemp}°C and ${maxTemp}°C over the next 12 hours.`
  );

  // Rain check
  const rainHours = next12h.filter((h) => h.precipitation > 40);
  if (rainHours.length > 0) {
    const firstRainTime = formatHour(rainHours[0].time);
    details.push(
      `There is an increased chance of rain starting around ${firstRainTime}, with precipitation probability up to ${Math.max(...rainHours.map((h) => h.precipitation))}%.`
    );
  } else {
    details.push('No significant rainfall is expected in the next 12 hours.');
  }

  // Humidity insight
  if (current.humidity > 80) {
    details.push(
      'Humidity is quite high. It may feel warmer than the actual temperature suggests.'
    );
  } else if (current.humidity < 30) {
    details.push('Humidity is low. Stay hydrated and use moisturizer to prevent dry skin.');
  }

  // Wind insight
  if (current.windSpeed > 20) {
    details.push(
      `Winds are ${current.windSpeed >= 30 ? 'strong' : 'moderate'} at ${Math.round(current.windSpeed)} km/h from the ${getWindDirection(current.windDirection)}.`
    );
  }

  // UV insight
  if (current.uvIndex >= 6) {
    details.push(
      `The UV index is ${getUVLevel(current.uvIndex).label.toLowerCase()} at ${current.uvIndex}. Apply sunscreen if spending time outdoors.`
    );
  }

  // Build summary
  const conditionText = current.condition.label.toLowerCase();
  const summaryParts: string[] = [
    `Currently ${conditionText} with a temperature of ${Math.round(current.temperature)}°C`,
  ];
  if (rainHours.length > 0) {
    summaryParts.push(`rain expected later`);
  }
  if (current.windSpeed > 20) {
    summaryParts.push(`moderate to strong winds`);
  }

  return {
    summary: summaryParts.join(', ') + '.',
    details,
    source: 'deterministic',
  };
}

// ─── Chart Data Helpers ─────────────────────────────────────────────────────

export function buildChartData(hourly: HourlyForecast[], unitSystem: 'metric' | 'imperial' = 'metric'): ChartDataPoint[] {
  return hourly.map((h) => {
    // temperature
    const tempC = h.temperature;
    const temp = unitSystem === 'imperial' ? (tempC * 9/5) + 32 : tempC;
    // wind
    const windKmh = h.windSpeed;
    const wind = unitSystem === 'imperial' ? windKmh * 0.621371 : windKmh;

    return {
      time: formatHour(h.time),
      temperature: Math.round(temp),
      humidity: h.humidity,
      wind: Math.round(wind),
      precipitation: h.precipitation,
    };
  });
}
