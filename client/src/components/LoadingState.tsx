export default function LoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Current Weather Skeleton */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-200 to-blue-300 dark:from-slate-700 dark:to-slate-800 p-6 sm:p-8 h-56" />

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 p-4 h-28"
          >
            <div className="w-16 h-3 bg-gray-200 dark:bg-white/10 rounded mb-3" />
            <div className="w-20 h-7 bg-gray-200 dark:bg-white/10 rounded mb-2" />
            <div className="w-12 h-2.5 bg-gray-100 dark:bg-white/5 rounded" />
          </div>
        ))}
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 p-5">
        <div className="w-32 h-3 bg-gray-200 dark:bg-white/10 rounded mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2 py-3 px-4">
              <div className="w-8 h-3 bg-gray-200 dark:bg-white/10 rounded" />
              <div className="w-8 h-8 bg-gray-200 dark:bg-white/10 rounded-full" />
              <div className="w-10 h-3 bg-gray-200 dark:bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Charts + Forecast Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 p-5 h-80">
          <div className="w-28 h-3 bg-gray-200 dark:bg-white/10 rounded mb-4" />
          <div className="flex gap-2 mb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-20 h-7 bg-gray-200 dark:bg-white/10 rounded-lg" />
            ))}
          </div>
          <div className="w-full h-48 bg-gray-100 dark:bg-white/5 rounded-lg" />
        </div>

        {/* 7-day */}
        <div className="rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 p-5">
          <div className="w-24 h-3 bg-gray-200 dark:bg-white/10 rounded mb-4" />
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="w-14 h-3 bg-gray-200 dark:bg-white/10 rounded" />
              <div className="w-6 h-6 bg-gray-200 dark:bg-white/10 rounded-full" />
              <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full" />
              <div className="w-10 h-3 bg-gray-200 dark:bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
