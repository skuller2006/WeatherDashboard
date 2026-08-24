import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Thermometer, Droplets, Wind, CloudRain } from 'lucide-react';
import type { ChartDataPoint, ChartMetric } from '../types/weather';
import clsx from 'clsx';

interface WeatherChartProps {
  data: ChartDataPoint[];
  unitSystem?: 'metric' | 'imperial';
}

interface MetricConfig {
  key: ChartMetric;
  label: string;
  icon: React.ReactNode;
  color: string;
  gradientId: string;
  unit: string;
  domain?: [number, number];
}

const METRICS: MetricConfig[] = [
  {
    key: 'temperature',
    label: 'Temperature',
    icon: <Thermometer className="w-4 h-4" />,
    color: '#3b82f6',
    gradientId: 'tempGradient',
    unit: '°C',
  },
  {
    key: 'humidity',
    label: 'Humidity',
    icon: <Droplets className="w-4 h-4" />,
    color: '#06b6d4',
    gradientId: 'humidityGradient',
    unit: '%',
    domain: [0, 100],
  },
  {
    key: 'wind',
    label: 'Wind',
    icon: <Wind className="w-4 h-4" />,
    color: '#0ea5e9',
    gradientId: 'windGradient',
    unit: ' km/h',
  },
  {
    key: 'precipitation',
    label: 'Precipitation',
    icon: <CloudRain className="w-4 h-4" />,
    color: '#2563eb',
    gradientId: 'precipGradient',
    unit: '%',
    domain: [0, 100],
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label, metric, unitSystem }: any) {
  if (!active || !payload?.length) return null;

  const config = METRICS.find((m) => m.key === metric);
  let unit = config?.unit;
  if (unitSystem === 'imperial') {
    if (metric === 'temperature') unit = '°F';
    if (metric === 'wind') unit = ' mph';
  }

  return (
    <div
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50
        rounded-xl shadow-lg px-4 py-3 text-sm transition-all duration-200"
    >
      <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">{label}</p>
      <p className="font-semibold text-gray-800 dark:text-white">
        {payload[0].value}
        {unit}
      </p>
    </div>
  );
}

export default function WeatherChart({ data, unitSystem = 'metric' }: WeatherChartProps) {
  const [activeMetric, setActiveMetric] = useState<ChartMetric>('temperature');

  const config = METRICS.find((m) => m.key === activeMetric)!;

  return (
    <div
      className="rounded-xl bg-white dark:bg-white/5
        border border-gray-100 dark:border-white/8
        shadow-sm overflow-hidden"
    >
      {/* Header with metric tabs */}
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wider mb-4">
          Weather Trends
        </h3>

        <div className="flex flex-wrap gap-2">
          {METRICS.map((metric) => (
            <button
              key={metric.key}
              onClick={() => setActiveMetric(metric.key)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                activeMetric === metric.key
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/15'
              )}
            >
              {metric.icon}
              <span className="hidden sm:inline">{metric.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-2 pb-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={config.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-gray-100 dark:text-white/5"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              className="text-gray-400 dark:text-gray-500"
              interval="preserveStartEnd"
            />

            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              className="text-gray-400 dark:text-gray-500"
              domain={config.domain || ['auto', 'auto']}
              width={40}
            />

            <Tooltip
              content={<CustomTooltip metric={activeMetric} unitSystem={unitSystem} />}
              cursor={{
                stroke: config.color,
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
            />

            <Legend
              verticalAlign="top"
              height={0}
              wrapperStyle={{ display: 'none' }}
            />

            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={config.color}
              strokeWidth={2.5}
              fill={`url(#${config.gradientId})`}
              dot={false}
              activeDot={{
                r: 5,
                fill: config.color,
                strokeWidth: 2,
                stroke: 'white',
              }}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
