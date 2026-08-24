import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import type { Theme } from '../types/weather';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('weather-theme') as Theme | null;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('weather-theme', theme);
  }, [theme]);

  const toggle = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggle}
      className={`relative flex items-center justify-center w-10 h-10 rounded-xl
        bg-white/80 dark:bg-white/10 backdrop-blur-sm
        border border-gray-200 dark:border-white/10
        hover:bg-blue-50 dark:hover:bg-white/20
        transition-all duration-300 shadow-sm hover:shadow-md
        group ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun
        className={`w-5 h-5 text-amber-500 absolute transition-all duration-300
          ${theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}`}
      />
      <Moon
        className={`w-5 h-5 text-blue-300 absolute transition-all duration-300
          ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}
      />
    </button>
  );
}
