'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { HeartPulse, BookOpen, FileText, Grid, Stethoscope, Search } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();
  const { setQuickSearchOpen, t } = useApp();

  const items = [
    { href: '/', label: t('navHome'), icon: HeartPulse },
    { href: '/books', label: t('navBooks'), icon: BookOpen },
    { href: '/articles', label: t('navArticles'), icon: FileText },
    { href: '/categories', label: t('navCategories'), icon: Grid },
    { href: '/dictionary', label: t('navDictionary'), icon: Stethoscope },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl text-[10px] font-bold transition-all ${
              isActive
                ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-slate-800'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-brand-500' : 'text-slate-400'}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <button
        onClick={() => setQuickSearchOpen(true)}
        className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl text-[10px] font-bold text-slate-500 dark:text-slate-400"
      >
        <Search className="w-5 h-5 text-brand-500" />
        <span>{t('search')}</span>
      </button>
    </div>
  );
}
