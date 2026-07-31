'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { initialBooks, initialCategories } from '@/lib/mockData';
import { BookCard } from '@/components/BookCard';
import { BookCardSkeleton } from '@/components/SkeletonLoaders';
import { Book } from '@/lib/types';
import {
  Search,
  Grid,
  List,
  Filter,
  SlidersHorizontal,
  BookOpen,
  Bookmark,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

function BooksContent() {
  const { t, language, favBookIds, setQuickSearchOpen, globalBooks } = useApp();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get('category') || 'all';
  const sortParam = searchParams.get('sort') || 'popular';
  const isFavParam = searchParams.get('fav') === 'true';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedLang, setSelectedLang] = useState('all');
  const [sortBy, setSortBy] = useState(sortParam);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showOnlyFavs, setShowOnlyFavs] = useState(isFavParam);

  const itemsPerPage = 8;

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setShowOnlyFavs(isFavParam);
  }, [isFavParam]);

  const filteredBooks = useMemo(() => {
    let result = [...globalBooks];

    if (showOnlyFavs) {
      result = result.filter(b => favBookIds.includes(b._id));
    }

    if (selectedCategory !== 'all') {
      result = result.filter(b => b.category.toLowerCase() === selectedCategory.toLowerCase() || initialCategories.find(c => c.slug === selectedCategory)?.nameEn.toLowerCase() === b.category.toLowerCase());
    }

    if (selectedLang !== 'all') {
      result = result.filter(b => b.language.toLowerCase() === selectedLang.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'popular') {
      result.sort((a, b) => b.downloads - a.downloads);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [selectedCategory, selectedLang, searchQuery, sortBy, showOnlyFavs, favBookIds, globalBooks]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1;
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const PagePrevIcon = language === 'ar' ? ChevronRight : ChevronLeft;
  const PageNextIcon = language === 'ar' ? ChevronLeft : ChevronRight;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-brand-500" />
            {showOnlyFavs ? t('navFavorites') : t('navBooks')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ar' ? 'استعرض آلاف الكتب الطبية المحكمة والمصنفة سريرياً' : 'Browse thousands of peer-reviewed clinical textbooks and reference guides'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOnlyFavs(!showOnlyFavs)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
              showOnlyFavs
                ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-rose-300'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
            <span>{t('navFavorites')} ({favBookIds.length})</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Language Quick Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {language === 'ar' ? 'لغة الكتاب:' : 'Language:'}
        </span>
        {([
          { value: 'all', labelAr: 'الكل', labelEn: 'All' },
          { value: 'Arabic', labelAr: 'عربي فقط', labelEn: 'Arabic Only' },
          { value: 'English', labelAr: 'English فقط', labelEn: 'English Only' },
          { value: 'French', labelAr: 'Français', labelEn: 'French' },
        ] as const).map(opt => (
          <button
            key={opt.value}
            onClick={() => { setSelectedLang(opt.value); setCurrentPage(1); }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              selectedLang === opt.value
                ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-brand-400'
            }`}
          >
            {language === 'ar' ? opt.labelAr : opt.labelEn}
          </button>
        ))}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5 left-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full px-10 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute top-3.5 left-3.5 right-3.5 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">{t('allCategories')}</option>
              {initialCategories.map((c) => (
                <option key={c._id} value={c.slug}>
                  {language === 'ar' ? c.nameAr : c.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">{t('allLanguages')}</option>
              <option value="English">English</option>
              <option value="Arabic">العربية (Arabic)</option>
              <option value="French">Français (French)</option>
              <option value="German">Deutsch (German)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="popular">{t('sortPopular')}</option>
              <option value="rating">{t('sortRating')}</option>
              <option value="newest">{t('sortNewest')}</option>
              <option value="title">{t('sortTitle')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Book Grid / List */}
      {paginatedBooks.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4">
          <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            {language === 'ar' ? 'لم يتم العثور على كتب تطابق فلتر البحث' : 'No textbooks found matching your search query'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ar' ? 'جرب البحث بكلمات مختلفة أو تصفية تخصص آخر.' : 'Try adjusting your category or language filter.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLang('all');
              setShowOnlyFavs(false);
            }}
            className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md"
          >
            {t('clearAll')}
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'}>
          {paginatedBooks.map((book) => (
            <BookCard key={book._id} book={book} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-40 font-bold text-xs flex items-center gap-1"
          >
            <PagePrevIcon className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-2xl font-bold text-xs transition-all ${
                  currentPage === pageNum
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-40 font-bold text-xs flex items-center gap-1"
          >
            <PageNextIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading books...</div>}>
      <BooksContent />
    </Suspense>
  );
}
