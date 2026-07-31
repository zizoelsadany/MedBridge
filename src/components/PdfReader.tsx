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
      {/* Top Floating Pro Reader Toolbar */}
      <header className={`px-4 sm:px-6 py-3 border-b backdrop-blur-md sticky top-0 z-50 flex items-center justify-between gap-4 shadow-md transition-colors ${getHeaderBg()}`}>
        {/* Left: Back to Book & Title */}
        <div className="flex items-center gap-3">
          <Link
            href={`/books/${book._id}`}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-xs font-extrabold transition-all border border-current/10 shrink-0"
          >
            <ArrowBackIcon className="w-4 h-4 text-brand-500" />
            <span className="hidden sm:inline">{t('backToBooks')}</span>
          </Link>

          <div className="hidden lg:block border-r dir-ltr:border-l border-current/10 pl-3 dir-ltr:pr-3">
            <h2 className="text-xs font-extrabold line-clamp-1 max-w-xs">{book.title}</h2>
            <p className="text-[11px] opacity-70 line-clamp-1">{book.author} • {book.category}</p>
          </div>
        </div>

        {/* Center: Page Jump Navigation */}
        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/10 p-1.5 rounded-2xl border border-current/10">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/20 disabled:opacity-30 transition-all"
            title={language === 'ar' ? 'الصفحة السابقة' : 'Previous Page'}
          >
            <PagePrevIcon className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 text-xs font-extrabold px-2">
            <span>{t('page')}</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= 1 && val <= totalPages) setCurrentPage(val);
              }}
              className="w-14 text-center bg-black/10 dark:bg-black/40 border border-current/20 rounded-xl py-1 font-mono text-xs focus:outline-none focus:border-brand-500"
            />
            <span className="opacity-70">{t('of')} {totalPages}</span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/20 disabled:opacity-30 transition-all"
            title={language === 'ar' ? 'الصفحة التالية' : 'Next Page'}
          >
            <PageNextIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Theme, Zoom & Actions */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="hidden md:flex items-center gap-1 bg-black/5 dark:bg-white/10 p-1.5 rounded-2xl border border-current/10 text-xs">
            <button
              onClick={() => setZoom(z => Math.max(50, z - 15))}
              className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/20 transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(100)}
              className="px-2 font-mono font-bold hover:underline"
              title="Reset Zoom"
            >
              {zoom}%
            </button>
            <button
              onClick={() => setZoom(z => Math.min(200, z + 15))}
              className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/20 transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Reader Theme Picker & Elderly Mode */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 p-1 rounded-2xl border border-current/10">
            <button
              onClick={() => setReaderTheme('light')}
              className={`p-1.5 rounded-xl transition-all ${readerTheme === 'light' ? 'bg-white text-slate-900 shadow-md scale-105' : 'opacity-60 hover:opacity-100'}`}
              title="Light Theme"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setReaderTheme('sepia')}
              className={`p-1.5 rounded-xl transition-all ${readerTheme === 'sepia' ? 'bg-[#FBF0D9] text-[#3D3223] shadow-md scale-105' : 'opacity-60 hover:opacity-100'}`}
              title="Sepia Theme"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={() => setReaderTheme('dark')}
              className={`p-1.5 rounded-xl transition-all ${readerTheme === 'dark' ? 'bg-slate-950 text-white shadow-md scale-105' : 'opacity-60 hover:opacity-100'}`}
              title="Dark Theme"
            >
              <Moon className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-4 bg-current/20 mx-0.5" />

            <button
              onClick={() => updateReadingSettings({ elderlyMode: !readingSettings.elderlyMode })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                readingSettings.elderlyMode
                  ? 'bg-amber-500 text-white shadow-md scale-105 ring-2 ring-amber-300'
                  : 'opacity-70 hover:opacity-100'
              }`}
              title={language === 'ar' ? 'وضع كبار السن (خط كبير جداً)' : 'Elderly Mode (Extra Large Text)'}
            >
              <UserCheck className="w-4 h-4" />
              <span className="hidden xl:inline">{language === 'ar' ? 'كبار السن' : 'Elderly'}</span>
            </button>
          </div>

          {/* Favorites Toggle */}
          <button
            onClick={() => toggleFavBook(book._id)}
            className={`p-2 rounded-2xl border transition-all ${
              isFav ? 'bg-rose-500 border-rose-500 text-white shadow-md' : 'bg-black/5 dark:bg-white/10 border-current/10 hover:bg-black/10'
            }`}
            title={t('addToFavorites')}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-2xl bg-black/5 dark:bg-white/10 border border-current/10 hover:bg-black/10 transition-all"
            title={t('fullscreen')}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Download PDF */}
          <a
            href={book.pdfUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t('downloadPdf')}</span>
          </a>
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

          {/* Core Page Content */}
          <div className="my-8 space-y-6 leading-relaxed">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-current/10 text-[11px] font-extrabold tracking-wider uppercase">
              {language === 'ar' ? `المكثّف الطبي - صفحة ${currentPage}` : `High-Yield Review - Page ${currentPage}`}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {language === 'ar' ? `الفصل ${currentPage}: دراسة سريرية متعمقة` : `Chapter ${currentPage}: Comprehensive Medical Review`}
            </h1>

            <p className="text-base sm:text-lg leading-relaxed opacity-95">
              {language === 'ar'
                ? `تعتبر هذه الصفحة من الكتاب المرجعي (${book.title}) مدخلاً سريرياً وتطبيقياً كبيراً لقضايا التخصص في قسم (${book.category}). تهدف الدراسة لتزويد الطالب والباحث الطبي بالمعطيات الأساسية، والتشخيص التفريقي، وأساليب الرعاية السريرية المتقدمة.`
                : `This section from the gold-standard reference (${book.title}) delivers high-yield clinical insights for ${book.category}. Designed for medical students and practicing clinicians to master pathophysiology, diagnostic algorithms, and evidence-based therapeutics.`}
            </p>

            <div className="p-6 rounded-3xl bg-current/5 border border-current/15 space-y-4 my-6">
              <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 text-brand-600 dark:text-brand-400">
                <Layers className="w-4 h-4" />
                {language === 'ar' ? 'نقاط التقييم السريع واللؤلؤات السريرية (Clinical Pearls)' : 'High-Yield Clinical Pearls'}
              </h3>
              <ul className="list-disc list-inside space-y-2.5 text-sm sm:text-base opacity-90 leading-relaxed">
                <li>{language === 'ar' ? 'الربط المباشر بين التركيب التشريحي والأعراض السريرية للمريض.' : 'Direct correlation between anatomical landmarks and patient presentation.'}</li>
                <li>{language === 'ar' ? 'البروتوكولات الأحدث المعتمدة عالمياً للتشخيص المبكر والمعالجة.' : 'Updated international consensus guidelines for early intervention.'}</li>
                <li>{language === 'ar' ? 'ملاحظات الأمان الدوائي والآثار الجانبية الحرجة.' : 'Critical pharmacotherapeutic safety margins and adverse drug reactions.'}</li>
              </ul>
            </div>

            {/* Embedded Interactive PDF Viewer */}
            <div className="mt-8 rounded-3xl overflow-hidden border border-current/20 h-[500px] shadow-lg bg-black/10">
              <iframe
                src={`${book.pdfUrl}#page=${currentPage}`}
                title="PDF Document View"
                className="w-full h-full border-none"
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
