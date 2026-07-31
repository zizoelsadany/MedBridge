'use client';

import React from 'react';
import Link from 'next/link';
import { initialCategories } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { Grid, BookOpen, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CategoriesPage() {
  const { t, language } = useApp();
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <Grid className="w-8 h-8 text-brand-500" />
          {t('medicalCategories')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {language === 'ar' ? '20 تخصصاً طبيأ شاملاً تغطي العلوم الأساسية والجراحية والسريرية' : '20 comprehensive medical specialties covering basic sciences, surgery, and clinical care'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialCategories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-lg group-hover:bg-brand-600 group-hover:text-white transition-all shadow-sm">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {cat.bookCount} {t('statsBooks')}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                  {language === 'ar' ? cat.nameAr : cat.nameEn}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {language === 'ar' ? cat.descriptionAr : cat.descriptionEn}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                {cat.articleCount} {t('statsArticles')}
              </span>

              <Link
                href={`/books?category=${cat.slug}`}
                className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                <span>{language === 'ar' ? 'تصفح الكتب' : 'Browse Textbooks'}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
