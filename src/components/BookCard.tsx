'use client';

import React from 'react';
import Link from 'next/link';
import { Book } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { RatingStars } from './RatingStars';
import { BookOpen, Download, Bookmark, Globe, Eye, FileText } from 'lucide-react';

interface BookCardProps {
  book: Book;
  viewMode?: 'grid' | 'list';
}

export function BookCard({ book, viewMode = 'grid' }: BookCardProps) {
  const { favBookIds, toggleFavBook, t, language } = useApp();
  const isFav = favBookIds.includes(book._id);

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-5 items-center group">
        <div className="relative w-32 h-44 shrink-0 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-all">
          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
          <button
            onClick={() => toggleFavBook(book._id)}
            className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all ${
              isFav ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-900/60 text-white hover:bg-slate-900'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
                {book.category}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                {book.language}
              </span>
            </div>

            <Link href={`/books/${book._id}`}>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors line-clamp-1">
                {book.title}
              </h3>
            </Link>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">{book.author}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
              {book.description}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <RatingStars rating={book.rating} count={book.ratingCount} size="sm" />

            <div className="flex items-center gap-2">
              <a
                href={`https://docs.google.com/viewer?url=${encodeURIComponent(book.pdfUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow transition-all"
              >
                <BookOpen className="w-4 h-4" />
                {t('readOnline')}
              </a>
              <a
                href={book.pdfUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all"
              >
                <Download className="w-4 h-4" />
                {t('downloadPdf')}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative">
      <div>
        <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all mb-4 bg-slate-100 dark:bg-slate-800">
          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          
          <button
            onClick={() => toggleFavBook(book._id)}
            className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
              isFav ? 'bg-rose-500 text-white shadow-md scale-110' : 'bg-slate-900/60 text-white hover:bg-slate-900'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>

          <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/70 text-white backdrop-blur-md">
            {book.category}
          </span>
        </div>

        <div className="space-y-1.5">
          <RatingStars rating={book.rating} count={book.ratingCount} size="sm" />
          <Link href={`/books/${book._id}`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
              {book.title}
            </h3>
          </Link>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-1">{book.author}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <a
          href={`https://docs.google.com/viewer?url=${encodeURIComponent(book.pdfUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow transition-all"
        >
          <BookOpen className="w-4 h-4" />
          {t('readOnline')}
        </a>
        <a
          href={book.pdfUrl}
          download
          target="_blank"
          rel="noreferrer"
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all"
          title={t('downloadPdf')}
        >
          <Download className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
