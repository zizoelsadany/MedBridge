'use client';

import React from 'react';
import Link from 'next/link';
import { Stethoscope, HeartPulse, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function NotFound() {
  const { t, language } = useApp();
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 text-center space-y-6">
      <div className="w-24 h-24 rounded-3xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-xl animate-bounce">
        <Stethoscope className="w-12 h-12" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-6xl font-black text-slate-900 dark:text-white">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          {language === 'ar' ? 'الصفحة الطبية غير موجودة' : 'Medical Page Not Found'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {language === 'ar'
            ? 'عذراً، الرابط الذي تحاول الوصول إليه غير موجود في المكتبة أو تم نقله لعنوان آخر.'
            : 'The resource or medical reference you are attempting to locate could not be found.'}
        </p>
      </div>

      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-lg transition-all"
      >
        <span>{t('navHome')}</span>
        <ArrowIcon className="w-4 h-4" />
      </Link>
    </div>
  );
}
