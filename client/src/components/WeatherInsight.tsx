import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { WeatherInsight as WeatherInsightType } from '../types/weather';

interface WeatherInsightProps {
  insight: WeatherInsightType;
}

export default function WeatherInsight({ insight }: WeatherInsightProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl bg-white dark:bg-white/5
        border shadow-sm overflow-hidden transition-all duration-500
        ${insight.source === 'ai' 
          ? 'border-indigo-200 dark:border-indigo-500/30 shadow-indigo-100 dark:shadow-indigo-900/20' 
          : 'border-gray-100 dark:border-white/8'}`}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/15">
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
              {insight.source === 'ai' ? 'AI Weather Briefing' : 'Weather Analysis'}
            </h3>
            <span className={`text-[10px] font-medium uppercase tracking-wider
              ${insight.source === 'ai' 
                ? 'text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded animate-pulse' 
                : 'text-gray-400 dark:text-gray-500'}`}
            >
              {insight.source === 'ai' ? '✨ Powered by Gemini' : 'Data-Driven Analysis'}
            </span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="px-5 pb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {insight.summary}
        </p>

        {/* Details Toggle */}
        {insight.details.length > 0 && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mt-3 text-xs font-medium
                text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300
                transition-colors"
            >
              {expanded ? 'Show less' : 'View detailed analysis'}
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Expanded details */}
            <div
              className={`transition-all duration-300 overflow-hidden
                ${expanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
            >
              <div className="space-y-2 pl-3 border-l-2 border-blue-200 dark:border-blue-500/30">
                {insight.details.map((detail, index) => (
                  <p
                    key={index}
                    className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"
                  >
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
