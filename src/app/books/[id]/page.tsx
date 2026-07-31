'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { initialBooks } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { RatingStars } from '@/components/RatingStars';
import { CommentSection } from '@/components/CommentSection';
import { BookCard } from '@/components/BookCard';
import {
  BookOpen,
  Download,
  Bookmark,
  Globe,
  Calendar,
  FileText,
  Eye,
  Star,
  Share2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Hash,
} from 'lucide-react';

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, language, favBookIds, toggleFavBook, userRatings, rateItem, globalBooks } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'comments' | 'details'>('overview');

  const book = globalBooks.find((b: any) => b._id === id) || initialBooks[0];
  const isFav = favBookIds.includes(book._id);
  const userRating = userRatings[book._id] || book.rating;

  const relatedBooks = globalBooks.filter((b: any) => b.category === book.category && b._id !== book._id).slice(0, 3);

  const ArrowBackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back Button */}
      <Link
        href="/books"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-brand-300 transition-all shadow-xs"
      >
        <ArrowBackIcon className="w-4 h-4 text-brand-500" />
        <span>{t('backToBooks')}</span>
      </Link>

      {/* Main Book Detail Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cover Image */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="relative w-full max-w-sm h-[440px] rounded-3xl overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 group">
            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <button
              onClick={() => toggleFavBook(book._id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-lg ${
                isFav ? 'bg-rose-500 text-white scale-110' : 'bg-slate-900/60 text-white hover:bg-slate-900'
              }`}
            >
              <Bookmark className="w-5 h-5 fill-current" />
            </button>
          </div>

          <div className="mt-6 w-full max-w-sm flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('rateNow')}:</span>
            <RatingStars rating={userRating} size="md" interactive onRate={(r) => rateItem(book._id, r)} />
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-brand-50 text-brand-600 dark:bg-brand-950/80 dark:text-brand-400">
                {book.category}
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                {book.language}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {book.title}
            </h1>

            <p className="text-sm font-bold text-brand-600 dark:text-brand-400">
              {t('author')}: {book.author}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block">{t('pages')}</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">{book.pages}</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block">{t('fileSize')}</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">{book.fileSize}</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block">{t('downloads')}</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">{book.downloads.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block">{t('rating')}</span>
              <div className="pt-0.5">
                <RatingStars rating={book.rating} count={book.ratingCount} size="sm" />
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {book.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              href={`/books/${book._id}/read`}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-lg hover:shadow-xl transition-all"
            >
              <BookOpen className="w-5 h-5" />
              <span>{t('readOnline')}</span>
            </Link>

            <a
              href={book.pdfUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-all"
            >
              <Download className="w-5 h-5" />
              <span>{t('downloadPdf')}</span>
            </a>

            <button
              onClick={() => toggleFavBook(book._id)}
              className={`p-3.5 rounded-2xl border transition-all ${
                isFav
                  ? 'bg-rose-500 border-rose-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              title={t('addToFavorites')}
            >
              <Bookmark className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        {/* Tab Headers */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: 'overview', label: t('tabOverview') },
            { id: 'comments', label: t('tabComments') },
            { id: 'details', label: t('tabDetails') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'ar' ? 'محتويات الكتاب والفصول الدراسية' : 'Table of Contents & Core Topics'}
            </h3>

            {book.tableOfContents ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {book.tableOfContents.map((ch, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{ch}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {book.description}
              </p>
            )}
          </div>
        )}

        {/* Tab 2: Comments */}
        {activeTab === 'comments' && (
          <CommentSection targetId={book._id} targetType="book" />
        )}

        {/* Tab 3: Details */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
              <span className="text-slate-400 font-bold block">{t('isbn')}</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{book.isbn || '978-0323393041'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
              <span className="text-slate-400 font-bold block">{t('publisher')}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{book.publisher || 'Elsevier Health Sciences'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
              <span className="text-slate-400 font-bold block">{t('publishedYear')}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{book.year}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
              <span className="text-slate-400 font-bold block">{t('language')}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{book.language}</span>
            </div>
          </div>
        )}
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('relatedBooks')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook._id} book={relBook} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
