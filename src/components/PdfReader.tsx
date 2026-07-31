'use client';

import React, { useState, useEffect } from 'react';
import { Book } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Download,
  Bookmark,
  Sun,
  Moon,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Layers,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

export function PdfReader({ book }: { book: Book }) {
  const { language, t, favBookIds, toggleFavBook, readingSettings, updateReadingSettings } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [readerTheme, setReaderTheme] = useState<'light' | 'dark' | 'sepia'>('sepia');
  const isFav = favBookIds.includes(book._id);

  const totalPages = book.pages || 1392;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const ArrowBackIcon = language === 'ar' ? ArrowRight : ArrowLeft;
  const PageNextIcon = language === 'ar' ? ChevronLeft : ChevronRight;
  const PagePrevIcon = language === 'ar' ? ChevronRight : ChevronLeft;

  // Reader Stage Backgrounds
  const getStageBg = () => {
    if (readerTheme === 'dark') return 'bg-slate-950 text-slate-100';
    if (readerTheme === 'sepia') return 'bg-[#F4ECE1] text-[#3D3223]';
    return 'bg-slate-100 text-slate-900';
  };

  // Canvas Paper Sheet Backgrounds
  const getPaperBg = () => {
    if (readerTheme === 'dark') return 'bg-slate-900 text-slate-100 border-slate-800 shadow-2xl';
    if (readerTheme === 'sepia') return 'bg-[#FBF0D9] text-[#3D3223] border-[#E5D7BF] shadow-2xl';
    return 'bg-white text-slate-900 border-slate-200 shadow-2xl';
  };

  // Header Toolbar Backgrounds
  const getHeaderBg = () => {
    if (readerTheme === 'dark') return 'bg-slate-900/95 border-slate-800 text-slate-100';
    if (readerTheme === 'sepia') return 'bg-[#EADBBF]/90 border-[#D8C7A7] text-[#3D3223]';
    return 'bg-white/95 border-slate-200 text-slate-800';
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${getStageBg()} transition-colors duration-300 font-sans`}>
      {/* ── Top Toolbar ─────────────────────────────────── */}
      <header className={`px-3 sm:px-5 border-b backdrop-blur-md sticky top-0 z-50 shadow-md transition-colors ${getHeaderBg()}`}>

        {/* ROW 1: Back | Title | Actions */}
        <div className="flex items-center justify-between gap-2 py-2.5">
          {/* Back button */}
          <Link
            href={`/books/${book._id}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-extrabold transition-all border border-current/10 shrink-0"
          >
            <ArrowBackIcon className="w-4 h-4 text-brand-500" />
            <span className="hidden sm:inline">{t('backToBooks')}</span>
          </Link>

          {/* Title — center, mobile */}
          <div className="flex-1 min-w-0 px-2 hidden sm:block">
            <h2 className="text-xs font-extrabold line-clamp-1">{book.title}</h2>
            <p className="text-[10px] opacity-60 line-clamp-1">{book.author} • {book.category}</p>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Theme switcher — always visible (compact) */}
            <div className="flex items-center gap-0.5 bg-black/5 dark:bg-white/10 p-1 rounded-xl border border-current/10">
              <button onClick={() => setReaderTheme('light')} className={`p-1.5 rounded-lg transition-all ${readerTheme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'opacity-50 hover:opacity-100'}`} title="Light">
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setReaderTheme('sepia')} className={`p-1.5 rounded-lg transition-all ${readerTheme === 'sepia' ? 'bg-[#FBF0D9] text-[#3D3223] shadow-sm' : 'opacity-50 hover:opacity-100'}`} title="Sepia">
                <BookOpen className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setReaderTheme('dark')} className={`p-1.5 rounded-lg transition-all ${readerTheme === 'dark' ? 'bg-slate-900 text-white shadow-sm' : 'opacity-50 hover:opacity-100'}`} title="Dark">
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Elderly mode */}
            <button
              onClick={() => updateReadingSettings({ elderlyMode: !readingSettings.elderlyMode })}
              className={`p-2 rounded-xl border transition-all ${readingSettings.elderlyMode ? 'bg-amber-500 border-amber-500 text-white shadow-md' : 'bg-black/5 dark:bg-white/10 border-current/10 opacity-70 hover:opacity-100'}`}
              title={language === 'ar' ? 'وضع كبار السن' : 'Elderly Mode'}
            >
              <UserCheck className="w-4 h-4" />
            </button>

            {/* Fav */}
            <button
              onClick={() => toggleFavBook(book._id)}
              className={`p-2 rounded-xl border transition-all ${isFav ? 'bg-rose-500 border-rose-500 text-white shadow-md' : 'bg-black/5 dark:bg-white/10 border-current/10 hover:bg-black/10'}`}
              title={t('addToFavorites')}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-black/5 dark:bg-white/10 border border-current/10 hover:bg-black/10 transition-all"
              title={t('fullscreen')}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Download */}
            <a
              href={book.pdfUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">{t('downloadPdf')}</span>
            </a>
          </div>
        </div>

        {/* ROW 2: Zoom | Page Navigation — full width on mobile */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-t border-current/10 pt-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 p-1 rounded-xl border border-current/10 text-xs">
            <button onClick={() => setZoom(z => Math.max(50, z - 15))} className="p-1.5 rounded-lg hover:bg-black/10 transition-all" title="Zoom Out">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setZoom(100)} className="px-2 font-mono font-bold text-xs hover:underline min-w-[36px] text-center" title="Reset">
              {zoom}%
            </button>
            <button onClick={() => setZoom(z => Math.min(200, z + 15))} className="p-1.5 rounded-lg hover:bg-black/10 transition-all" title="Zoom In">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Page Navigation — center */}
          <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/10 px-2 py-1.5 rounded-xl border border-current/10">
            <button onClick={handlePrevPage} disabled={currentPage <= 1} className="p-1.5 rounded-lg hover:bg-black/10 disabled:opacity-30 transition-all" title={language === 'ar' ? 'السابقة' : 'Prev'}>
              <PagePrevIcon className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 text-xs font-extrabold">
              <span className="opacity-60 text-[10px]">{t('page')}</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => { const v = parseInt(e.target.value); if (v >= 1 && v <= totalPages) setCurrentPage(v); }}
                className="w-12 text-center bg-black/10 dark:bg-black/40 border border-current/20 rounded-lg py-0.5 font-mono text-xs focus:outline-none focus:border-brand-500"
              />
              <span className="opacity-50 text-[10px]">/ {totalPages}</span>
            </div>
            <button onClick={handleNextPage} disabled={currentPage >= totalPages} className="p-1.5 rounded-lg hover:bg-black/10 disabled:opacity-30 transition-all" title={language === 'ar' ? 'التالية' : 'Next'}>
              <PageNextIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Spacer to balance layout */}
          <div className="w-[80px]" />
        </div>
      </header>

      {/* Main Canvas Paper Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 flex justify-center items-start">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className={`w-full max-w-4xl min-h-[900px] rounded-3xl p-6 sm:p-10 md:p-14 border transition-all duration-300 flex flex-col justify-between ${getPaperBg()}`}
        >
          {/* Header Bar inside page */}
          <div className="flex items-center justify-between pb-6 border-b border-current/15 text-xs font-bold opacity-75">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              {book.title}
            </span>
            <span>{book.category} • {book.author}</span>
          </div>

          {/* Embedded Interactive PDF Viewer */}
            <div className="mt-8 rounded-3xl overflow-hidden border border-current/20 h-[800px] shadow-lg bg-black/10">
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(book.pdfUrl)}&embedded=true`}
                title="PDF Document View"
                className="w-full h-full border-none bg-white"
              />
            </div>
          </div>

          {/* Footer Bar inside page */}
          <div className="flex items-center justify-between pt-6 border-t border-current/15 text-xs font-extrabold opacity-75">
            <span>Med Bridge+ Digital Medical Library</span>
            <span>{t('page')} {currentPage} {t('of')} {totalPages}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
