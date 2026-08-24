import type {
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  WeatherResponse,
  WeatherConditionCode,
} from '../types/weather';
import { createCondition, generateAlerts, generateInsights } from '../utils/weatherUtils';
import { generateAIInsights } from './aiService';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// ─── OpenWeatherMap Type Definitions ──────────────────────────────────────

interface OWMWeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface OWMCurrentResponse {
  coord: { lon: number; lat: number };
  weather: OWMWeatherCondition[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: { speed: number; deg: number };
  clouds: { all: number };
  sys: { country: string; sunrise: number; sunset: number };
  name: string;
  dt: number;
}

interface OWMForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: OWMWeatherCondition[];
  clouds: { all: number };
  wind: { speed: number; deg: number };
  visibility: number;
  pop: number; // Probability of precipitation (0 to 1)
  dt_txt: string;
}

interface OWMForecastResponse {
  list: OWMForecastItem[];
  city: {
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    sunrise: number;
    sunset: number;
  };
}

interface OWMAirQualityResponse {
  list: Array<{
    main: { aqi: number };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
    dt: number;
  }>;
}

// ─── Mapping Helpers ──────────────────────────────────────────────────────

function mapConditionCode(owmId: number): WeatherConditionCode {
  if (owmId >= 200 && owmId < 300) return 'thunderstorm';
  if (owmId >= 300 && owmId < 400) return 'drizzle';
  if (owmId >= 500 && owmId < 511) return 'rain';
  if (owmId === 511) return 'sleet';
  if (owmId > 511 && owmId < 600) return 'heavy-rain';
  if (owmId >= 600 && owmId < 700) return 'snow';
  if (owmId === 701 || owmId === 741) return 'fog';
  if (owmId > 701 && owmId < 800) return 'mist';
  if (owmId === 800) return 'clear';
  if (owmId === 801 || owmId === 802) return 'partly-cloudy';
  if (owmId === 803) return 'cloudy';
  if (owmId === 804) return 'overcast';
  return 'clear'; // default fallback
}

// ─── Data Fetching ────────────────────────────────────────────────────────

async function fetchFromOWM<T>(endpoint: string): Promise<T> {
  if (!API_KEY) {
    throw {
      success: false,
      error: {
        code: 'API_ERROR',
        message: 'OpenWeatherMap API Key is missing. Please add it to your .env file.',
      },
    };
  }

  try {
    const url = endpoint.includes('?') 
      ? `${endpoint}&appid=${API_KEY}` 
      : `${endpoint}?appid=${API_KEY}`;
      
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw { code: 'CITY_NOT_FOUND', message: 'The requested city could not be found.' };
      }
      if (response.status === 401) {
        throw { code: 'API_ERROR', message: 'Invalid API Key.' };
      }
      if (response.status === 429) {
        throw { code: 'RATE_LIMITED', message: 'API rate limit exceeded. Please try again later.' };
      }
      throw { code: 'API_ERROR', message: data.message || 'Error fetching data from weather provider.' };
    }

    return data;
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err) {
      throw { success: false, error: err };
    }
    throw {
      success: false,
      error: { code: 'NETWORK_ERROR', message: 'Failed to connect to the weather provider.' },
    };
  }
}

// ─── Formatting Responses ─────────────────────────────────────────────────

function parseCurrentWeather(current: OWMCurrentResponse, aqiData?: OWMAirQualityResponse): CurrentWeather {
  const airQuality = aqiData && aqiData.list.length > 0 ? {
    aqi: aqiData.list[0].main.aqi,
    pm2_5: aqiData.list[0].components.pm2_5,
    pm10: aqiData.list[0].components.pm10,
    o3: aqiData.list[0].components.o3,
    no2: aqiData.list[0].components.no2,
  } : undefined;

  return {
    city: current.name,
    country: current.sys.country,
    latitude: current.coord.lat,
    longitude: current.coord.lon,
    temperature: current.main.temp,
    feelsLike: current.main.feels_like,
    humidity: current.main.humidity,
    windSpeed: current.wind.speed * 3.6, // m/s to km/h
    windDirection: current.wind.deg,
    pressure: current.main.pressure,
    visibility: current.visibility,
    uvIndex: 0, // UV Index requires One Call API, which requires a credit card. Defaulting to 0.
    cloudCoverage: current.clouds.all,
    condition: createCondition(mapConditionCode(current.weather[0].id)),
    airQuality,
    sunrise: new Date(current.sys.sunrise * 1000).toISOString(),
    sunset: new Date(current.sys.sunset * 1000).toISOString(),
    updatedAt: new Date(current.dt * 1000).toISOString(),
  };
}

function parseForecast(forecast: OWMForecastResponse): { hourly: HourlyForecast[]; daily: DailyForecast[] } {
  const hourly: HourlyForecast[] = [];
  const dailyMap: Record<string, DailyForecast> = {};

  const today = new Date().toDateString();

  forecast.list.forEach((item, index) => {
    // Collect next 24 hours (8 periods of 3 hours) for hourly forecast
    if (index < 8) {
      hourly.push({
        time: new Date(item.dt * 1000).toISOString(),
        temperature: item.main.temp,
        feelsLike: item.main.feels_like,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed * 3.6,
        precipitation: Math.round(item.pop * 100),
        condition: createCondition(mapConditionCode(item.weather[0].id)),
      });
    }

    // Aggregate daily data
    const dateObj = new Date(item.dt * 1000);
    const dateStr = dateObj.toDateString();
    
    // Skip today's historical data for the daily forecast summary
    if (dateStr === today && index > 3) return;

    if (!dailyMap[dateStr]) {
      dailyMap[dateStr] = {
        date: dateObj.toISOString(),
        dayName: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
        tempHigh: item.main.temp_max,
        tempLow: item.main.temp_min,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed * 3.6,
        precipitation: Math.round(item.pop * 100),
        condition: createCondition(mapConditionCode(item.weather[0].id)),
      };
    } else {
      dailyMap[dateStr].tempHigh = Math.max(dailyMap[dateStr].tempHigh, item.main.temp_max);
      dailyMap[dateStr].tempLow = Math.min(dailyMap[dateStr].tempLow, item.main.temp_min);
      
      // Update condition to the one during the middle of the day (roughly)
      if (dateObj.getHours() >= 12 && dateObj.getHours() <= 15) {
        dailyMap[dateStr].condition = createCondition(mapConditionCode(item.weather[0].id));
        dailyMap[dateStr].precipitation = Math.max(dailyMap[dateStr].precipitation, Math.round(item.pop * 100));
      }
    }
  });

  // Convert map to array and take next 7 days (or max available from 5-day forecast)
  const daily = Object.values(dailyMap).slice(0, 7);

  return { hourly, daily };
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function fetchWeatherData(city: string): Promise<WeatherResponse> {
  // 1. Get coordinates for the city
  const geoData = await fetchFromOWM<Array<{ lat: number; lon: number }>>(`${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=1`);
  
  if (!geoData || geoData.length === 0) {
    throw {
      success: false,
      error: {
        code: 'CITY_NOT_FOUND',
        message: `Could not find weather data for "${city}". Please check the spelling and try again.`,
      },
    };
  }

  const { lat, lon } = geoData[0];
  return fetchWeatherByCoords(lat, lon);
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherResponse> {
  // Fetch Current Weather, 5-day Forecast, and Air Quality in parallel
  const [currentResponse, forecastResponse, aqiResponse] = await Promise.all([
    fetchFromOWM<OWMCurrentResponse>(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric`),
    fetchFromOWM<OWMForecastResponse>(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric`),
    fetchFromOWM<OWMAirQualityResponse>(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}`).catch(() => undefined) // Fail silently if AQI is not available
  ]);

  const current = parseCurrentWeather(currentResponse, aqiResponse);
  const { hourly, daily } = parseForecast(forecastResponse);
  
  // Read custom alert thresholds from localStorage
  let tempAlertThreshold = 35;
  let windAlertThreshold = 30;
  try {
    const stored = window.localStorage.getItem('weather-settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.tempAlertThreshold) tempAlertThreshold = parsed.tempAlertThreshold;
      if (parsed.windAlertThreshold) windAlertThreshold = parsed.windAlertThreshold;
    }
  } catch {
    // Ignore parse error
  }
  
  const alerts = generateAlerts(current, hourly, tempAlertThreshold, windAlertThreshold);
  
  let insight = await generateAIInsights(current, hourly);
  if (!insight) {
    insight = generateInsights(current, hourly);
  }

  return { current, hourly, daily, alerts, insight };
}
