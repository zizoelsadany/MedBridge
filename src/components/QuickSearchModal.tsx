'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { initialDictionary } from '@/lib/mockData';
import { Search, X, BookOpen, FileText, Bookmark, ArrowRight, ArrowLeft, Shield, Stethoscope } from 'lucide-react';
import Link from 'next/link';

export function QuickSearchModal() {
  const { quickSearchOpen, setQuickSearchOpen, t, language, globalBooks, globalArticles } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (quickSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
    }
  }, [quickSearchOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQuickSearchOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setQuickSearchOpen]);

  if (!quickSearchOpen) return null;

  const filteredBooks = query.trim()
    ? globalBooks.filter(b =>
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase()) ||
        b.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : globalBooks.slice(0, 4);

  const filteredArticles = query.trim()
    ? globalArticles.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.author.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : globalArticles.slice(0, 2);

  const filteredTerms = query.trim()
    ? initialDictionary.filter(t =>
        t.term.toLowerCase().includes(query.toLowerCase()) ||
        t.meaning.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  // Admin access shortcut via search
  const showAdmin = query.trim().toLowerCase() === 'admin' || query.trim() === '/admin';

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  const hasResults = filteredBooks.length > 0 || filteredArticles.length > 0 || filteredTerms.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-slate-900/70 backdrop-blur-md"
      onClick={() => setQuickSearchOpen(false)}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Row — Bigger & More Prominent */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center shrink-0 shadow-md">
            <Search className="w-5 h-5 text-white" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث في الكتب والمقالات والمصطلحات...' : 'Search books, articles, medical terms...'}
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-lg font-semibold"
          />
          <div className="flex items-center gap-2 shrink-0">
            <kbd className="hidden sm:block px-2 py-1 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400">
              ESC
            </kbd>
            <button
              onClick={() => setQuickSearchOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin shortcut */}
        {showAdmin && (
          <div className="px-5 py-3 bg-brand-50 dark:bg-brand-950/40 border-b border-brand-100 dark:border-brand-900">
            <Link
              href="/admin"
              onClick={() => setQuickSearchOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-brand-700 dark:text-brand-300 block">
                  {language === 'ar' ? 'لوحة تحكم الأدمن' : 'Admin Dashboard'}
                </span>
                <span className="text-[11px] text-brand-500">/admin</span>
              </div>
              <ArrowIcon className="w-4 h-4 text-brand-500 ms-auto" />
            </Link>
          </div>
        )}

        {/* Results */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-5">

          {/* Books */}
          {filteredBooks.length > 0 && (
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-brand-500" />
                {language === 'ar' ? 'الكتب الطبية' : 'Medical Textbooks'}
              </span>
              <div className="space-y-1.5 mt-2">
                {filteredBooks.map(book => (
                  <Link
                    key={book._id}
                    href={`/books/${book._id}`}
                    onClick={() => setQuickSearchOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-transparent hover:border-brand-200 dark:hover:border-brand-800 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden shrink-0 shadow-sm">
                        <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-1">
                          {book.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{book.author} · {book.category}</p>
                      </div>
                    </div>
                    <ArrowIcon className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Articles */}
          {filteredArticles.length > 0 && (
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-cyanBrand-500" />
                {language === 'ar' ? 'المقالات السريرية' : 'Clinical Articles'}
              </span>
              <div className="space-y-1.5 mt-2">
                {filteredArticles.map(article => (
                  <Link
                    key={article._id}
                    href={`/articles/${article._id}`}
                    onClick={() => setQuickSearchOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-cyanBrand-50 dark:hover:bg-slate-800 border border-transparent hover:border-cyanBrand-200 transition-all group"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyanBrand-600 line-clamp-1">{article.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{article.author} · {article.readTimeMinutes} min</p>
                    </div>
                    <ArrowIcon className="w-4 h-4 text-slate-300 group-hover:text-cyanBrand-500 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Terms */}
          {filteredTerms.length > 0 && (
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-500" />
                {language === 'ar' ? 'المعجم الطبي' : 'Medical Dictionary'}
              </span>
              <div className="space-y-1.5 mt-2">
                {filteredTerms.map(term => (
                  <Link
                    key={term._id}
                    href={`/dictionary?q=${encodeURIComponent(term.term)}`}
                    onClick={() => setQuickSearchOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-transparent hover:border-emerald-200 transition-all group"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
                        {term.term} <span className="text-emerald-500">({term.meaning})</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{term.description}</p>
                    </div>
                    <ArrowIcon className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {query.trim() && !hasResults && !showAdmin && (
            <div className="text-center py-10 space-y-2">
              <Search className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto" />
              <p className="text-sm font-bold text-slate-400">
                {language === 'ar' ? 'لا توجد نتائج لـ' : 'No results for'} "{query}"
              </p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>{language === 'ar' ? 'اكتب "admin" للوصول للوحة التحكم' : 'Type "admin" to access dashboard'}</span>
          <span>ESC {language === 'ar' ? 'للإغلاق' : 'to close'}</span>
        </div>
      </div>
    </div>
  );
}
