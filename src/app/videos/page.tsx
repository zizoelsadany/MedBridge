'use client';

import React, { useState } from 'react';
import { initialVideos, initialCategories } from '@/lib/mockData';
import { VideoCard } from '@/components/VideoCard';
import { useApp } from '@/context/AppContext';
import { Video, Search } from 'lucide-react';

export default function VideosPage() {
  const { t, language } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const filtered = initialVideos.filter(v => {
    const matchCat = selectedCat === 'all' || v.category.toLowerCase() === selectedCat.toLowerCase();
    const matchSearch = !search.trim() || v.title.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <Video className="w-8 h-8 text-brand-500" />
          {t('navVideos')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {language === 'ar' ? 'فيديوهات جراحية ومحاضرات توضيحية فائقة الدقة' : 'High-definition surgical demonstrations and medical lectures'}
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
            className="w-full px-10 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="all">{t('allCategories')}</option>
            {initialCategories.map(c => (
              <option key={c._id} value={c.slug}>{language === 'ar' ? c.nameAr : c.nameEn}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map(video => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}
