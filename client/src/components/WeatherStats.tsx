import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  Sun,
  Activity,
} from 'lucide-react';
import type { CurrentWeather } from '../types/weather';
import { formatWindSpeed, formatVisibility, getUVLevel, getWindDirection } from '../utils/weatherUtils';
import WeatherCard from './WeatherCard';
import { useSettings } from '../hooks/useSettings';

interface WeatherStatsProps {
  data: CurrentWeather;
}

export default function WeatherStats({ data }: WeatherStatsProps) {
  const { settings } = useSettings();
  const uvInfo = getUVLevel(data.uvIndex);
  const windDir = getWindDirection(data.windDirection);

  const getAqiDetails = (aqi?: number) => {
    switch (aqi) {
      case 1: return { text: 'Good', color: 'text-green-500', bg: 'bg-green-500/10' };
      case 2: return { text: 'Fair', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      case 3: return { text: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
      case 4: return { text: 'Poor', color: 'text-orange-500', bg: 'bg-orange-500/10' };
      case 5: return { text: 'Very Poor', color: 'text-red-500', bg: 'bg-red-500/10' };
      default: return { text: 'Unknown', color: 'text-gray-500', bg: 'bg-gray-500/10' };
    }
  };

  const aqiInfo = getAqiDetails(data.airQuality?.aqi);

  const stats = [
    {
      icon: <Droplets className="w-5 h-5" />,
      label: 'Humidity',
      value: data.humidity,
      unit: '%',
      description: data.humidity > 70 ? 'High humidity' : data.humidity < 30 ? 'Low humidity' : 'Comfortable',
      accentColor: 'text-blue-500',
    },
    {
      icon: <Wind className="w-5 h-5" />,
      label: 'Wind',
      value: formatWindSpeed(data.windSpeed, settings.unitSystem),
      description: `Direction: ${windDir}`,
      accentColor: 'text-sky-500',
    },
    {
      icon: <Gauge className="w-5 h-5" />,
      label: 'Pressure',
      value: data.pressure,
      unit: 'hPa',
      description: data.pressure > 1013 ? 'High pressure' : 'Low pressure',
      accentColor: 'text-indigo-500',
    },
    {
      icon: <Eye className="w-5 h-5" />,
      label: 'Visibility',
      value: formatVisibility(data.visibility),
      description: data.visibility >= 10000 ? 'Excellent' : data.visibility >= 5000 ? 'Good' : 'Poor',
      accentColor: 'text-cyan-500',
    },
    {
      icon: <Sun className="w-5 h-5" />,
      label: 'UV Index',
      value: data.uvIndex,
      description: uvInfo.label,
      accentColor: 'text-amber-500',
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: 'Air Quality',
      value: data.airQuality ? `AQI ${data.airQuality.aqi}` : 'N/A',
      description: (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${aqiInfo.color} ${aqiInfo.bg}`}>
          {aqiInfo.text}
        </span>
      ),
      accentColor: 'text-rose-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat) => (
        <WeatherCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
