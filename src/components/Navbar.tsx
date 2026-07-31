'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Stethoscope, Search, BookOpen, FileText, Grid, Video,
  Bookmark, Sliders, Menu, X, HeartPulse,
  Sun, Moon, Languages,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const {
    t, language, setLanguage,
    theme, setTheme,
    favBookIds, favArticleIds,
    setQuickSearchOpen, setReadingSettingsOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalFavs = favBookIds.length + favArticleIds.length;

  const navLinks = [
    { href: '/', label: t('navHome'), icon: HeartPulse },
    { href: '/books', label: t('navBooks'), icon: BookOpen },
    { href: '/articles', label: t('navArticles'), icon: FileText },
    { href: '/categories', label: t('navCategories'), icon: Grid },
    { href: '/videos', label: t('navVideos'), icon: Video },
    { href: '/dictionary', label: t('navDictionary'), icon: Stethoscope },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-cyanBrand-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Med Bridge<span className="text-brand-500">+</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-0.5 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-brand-600 hover:bg-white/70 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-500' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">

            {/* Search Button */}
            <button
              onClick={() => setQuickSearchOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 transition-all shadow-xs"
            >
              <Search className="w-4 h-4 text-brand-500" />
              <span>{t('search')}</span>
            </button>

            {/* Favorites */}
            <Link
              href="/books?fav=true"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-rose-300 hover:text-rose-500 transition-all"
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden md:inline">{t('navFavorites')}</span>
              {totalFavs > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white font-black text-[9px] rounded-full flex items-center justify-center">
                  {totalFavs}
                </span>
              )}
            </Link>

            {/* Reading Settings (only shown visually as icon+label) */}
            <button
              onClick={() => setReadingSettingsOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-brand-300 hover:text-brand-600 transition-all"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden lg:inline">{language === 'ar' ? 'القراءة' : 'Reading'}</span>
            </button>

            {/* Theme Toggle: Light / Dark only in Navbar */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setTheme('light')}
                title={language === 'ar' ? 'فاتح' : 'Light'}
                className={`p-1.5 rounded-lg transition-all ${theme === 'light' ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-400 hover:text-amber-400'}`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                title={language === 'ar' ? 'داكن' : 'Dark'}
                className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-slate-700 text-indigo-300 shadow-sm' : 'text-slate-400 hover:text-indigo-400'}`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-brand-300 hover:text-brand-600 transition-all"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'EN' : 'ع'}</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 xl:hidden bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-[80vw] max-w-sm h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-700 to-brand-400 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
                <span className="font-extrabold text-base text-slate-900 dark:text-white">
                  Med Bridge<span className="text-brand-500">+</span>
                </span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 p-4 overflow-y-auto space-y-1">
              {navLinks.map(link => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-brand-500' : 'text-slate-400'}`} />
                    {link.label}
                  </Link>
                );
              })}

              <Link
                href="/books?fav=true"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <Bookmark className="w-5 h-5 text-rose-500" />
                {t('navFavorites')}
                {totalFavs > 0 && (
                  <span className="ms-auto px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">{totalFavs}</span>
                )}
              </Link>

              <button
                onClick={() => { setQuickSearchOpen(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <Search className="w-5 h-5 text-brand-500" />
                {t('search')}
              </button>

              <button
                onClick={() => { setReadingSettingsOpen(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <Sliders className="w-5 h-5 text-brand-500" />
                {language === 'ar' ? 'إعدادات القراءة وإمكانية الوصول' : 'Reading & Accessibility Settings'}
              </button>
            </div>

            {/* Footer: Theme & Lang */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl border-2 text-xs font-extrabold transition-all ${theme === 'light' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  {language === 'ar' ? 'فاتح' : 'Light'}
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl border-2 text-xs font-extrabold transition-all ${theme === 'dark' ? 'border-indigo-500 bg-slate-900 text-indigo-300' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                >
                  <Moon className="w-4 h-4 text-indigo-400" />
                  {language === 'ar' ? 'داكن' : 'Dark'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLanguage('ar')}
                  className={`py-2.5 rounded-2xl border-2 text-xs font-extrabold transition-all ${language === 'ar' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                >
                  🇸🇦 العربية
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`py-2.5 rounded-2xl border-2 text-xs font-extrabold transition-all ${language === 'en' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
