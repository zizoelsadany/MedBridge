'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { initialArticles, initialCategories } from '@/lib/mockData';
import { ArticleCard } from '@/components/ArticleCard';
import { FileText, Search, Filter } from 'lucide-react';

export default function ArticlesPage() {
  const { t, language } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const filtered = initialArticles.filter(art => {
    const matchCat = selectedCat === 'all' || art.category.toLowerCase() === selectedCat.toLowerCase();
    const matchSearch = !search.trim() || art.title.toLowerCase().includes(search.toLowerCase()) || art.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <FileText className="w-8 h-8 text-cyanBrand-500" />
          {t('navArticles')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {language === 'ar' ? 'مقالات وأبحاث سريرية محكمة بقلم أطباء واستشاريين' : 'Peer-reviewed clinical articles and trial reviews'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5 left-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full px-10 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-cyanBrand-500"
          />
        </div>

        <div>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-cyanBrand-500 cursor-pointer"
          >
            <option value="all">{t('allCategories')}</option>
            {initialCategories.map(c => (
              <option key={c._id} value={c.slug}>{language === 'ar' ? c.nameAr : c.nameEn}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map(article => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </div>
  );
}
