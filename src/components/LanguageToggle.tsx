'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useApp();

  return (
    <button
      onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all shadow-sm"
      title={language === 'ar' ? 'Switch to English' : 'التحويل للغة العربية'}
    >
      <Globe className="w-4 h-4 text-brand-500" />
      <span>{language === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
    </button>
  );
}
