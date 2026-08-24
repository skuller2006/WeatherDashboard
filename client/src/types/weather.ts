// ─── Weather Condition ───────────────────────────────────────────────────────

export type WeatherConditionCode =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'overcast'
  | 'mist'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavy-rain'
  | 'thunderstorm'
  | 'snow'
  | 'sleet'
  | 'hail';

export interface WeatherCondition {
  code: WeatherConditionCode;
  label: string;
  description: string;
}

// ─── Current Weather ─────────────────────────────────────────────────────────

export interface CurrentWeather {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  cloudCoverage: number;
  condition: WeatherCondition;
  airQuality?: {
    aqi: number; // 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
    pm2_5: number;
    pm10: number;
    o3: number;
    no2: number;
  };
  sunrise: string;
  sunset: string;
  updatedAt: string;
}

// ─── Hourly Forecast ─────────────────────────────────────────────────────────

export interface HourlyForecast {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  condition: WeatherCondition;
}

// ─── Daily Forecast ──────────────────────────────────────────────────────────

export interface DailyForecast {
  date: string;
  dayName: string;
  tempHigh: number;
  tempLow: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  condition: WeatherCondition;
}

// ─── Weather Stats ───────────────────────────────────────────────────────────

export interface WeatherStat {
  label: string;
  value: string | number;
  unit: string;
  icon: string;
  color: string;
  description?: string;
}

// ─── Weather Alert ───────────────────────────────────────────────────────────

export type AlertSeverity = 'info' | 'warning' | 'danger';

export interface WeatherAlert {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  icon: string;
}

// ─── Weather Insight ─────────────────────────────────────────────────────────

export interface WeatherInsight {
  summary: string;
  details: string[];
  source: 'deterministic' | 'ml-model';
}

// ─── Chart Data ──────────────────────────────────────────────────────────────

export type ChartMetric = 'temperature' | 'humidity' | 'wind' | 'precipitation';

export interface ChartDataPoint {
  time: string;
  temperature?: number;
  humidity?: number;
  wind?: number;
  precipitation?: number;
}

// ─── Complete Weather Response ───────────────────────────────────────────────

export interface WeatherResponse {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts: WeatherAlert[];
  insight: WeatherInsight;
}

// ─── API Error ───────────────────────────────────────────────────────────────

export type ErrorCode =
  | 'CITY_NOT_FOUND'
  | 'INVALID_INPUT'
  | 'API_ERROR'
  | 'NETWORK_ERROR'
  | 'RATE_LIMITED'
  | 'LOCATION_DENIED'
  | 'LOCATION_UNAVAILABLE'
  | 'UNKNOWN_ERROR';

export interface APIError {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  };
}

// ─── Theme ───────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark';

// ─── Historical Data (future use) ───────────────────────────────────────────

export interface HistoricalDataPoint {
  date: string;
  avgTemperature: number;
  highTemperature: number;
  lowTemperature: number;
  avgHumidity: number;
  avgWindSpeed: number;
  totalPrecipitation: number;
}
