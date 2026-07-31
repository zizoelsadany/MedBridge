'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ThemeMode } from '@/lib/types';
import { Sun, Moon, BookOpen, Eye, Accessibility } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, readingSettings, updateReadingSettings, t } = useApp();

  const themes: { id: ThemeMode; labelKey: 'themeLight' | 'themeDark' | 'themeSepia' | 'themeHighContrast'; icon: React.ReactNode }[] = [
    { id: 'light', labelKey: 'themeLight', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { id: 'dark', labelKey: 'themeDark', icon: <Moon className="w-4 h-4 text-indigo-400" /> },
    { id: 'sepia', labelKey: 'themeSepia', icon: <BookOpen className="w-4 h-4 text-amber-800" /> },
    { id: 'high-contrast', labelKey: 'themeHighContrast', icon: <Eye className="w-4 h-4 text-yellow-400" /> },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      {themes.map((item) => (
        <button
          key={item.id}
          onClick={() => setTheme(item.id)}
          title={t(item.labelKey)}
          className={`flex items-center justify-center p-2 rounded-lg text-xs font-medium transition-all ${
            theme === item.id
              ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm scale-105'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {item.icon}
        </button>
      ))}

      <button
        onClick={() => updateReadingSettings({ elderlyMode: !readingSettings.elderlyMode })}
        title={t('elderlyMode')}
        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          readingSettings.elderlyMode
            ? 'bg-emerald-500 text-white shadow-md animate-pulse'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        <Accessibility className="w-4 h-4" />
      </button>
    </div>
  );
}
