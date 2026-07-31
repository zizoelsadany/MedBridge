'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { initialArticles } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { CommentSection } from '@/components/CommentSection';
import { RatingStars } from '@/components/RatingStars';
import { ArticleCard } from '@/components/ArticleCard';
import { Clock, Eye, Bookmark, Share2, ArrowRight, ArrowLeft, User, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, language, favArticleIds, toggleFavArticle, userRatings, rateItem, readingSettings } = useApp();

  const article = initialArticles.find(a => a._id === id) || initialArticles[0];
  const isFav = favArticleIds.includes(article._id);
  const ratingVal = userRatings[article._id] || article.rating;

  const related = initialArticles.filter(a => a._id !== article._id).slice(0, 2);
  const ArrowBackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  const fontClasses = {
    sans: 'font-sans-custom',
    serif: 'font-serif-custom',
    mono: 'font-mono-custom',
  }[readingSettings.fontFamily];

  const sizeClasses = {
    sm: 'reader-sm',
    md: 'reader-md',
    lg: 'reader-lg',
    xl: 'reader-xl',
  }[readingSettings.fontSize];

  const leadingClasses = {
    tight: 'leading-tight-custom',
    normal: 'leading-normal-custom',
    relaxed: 'leading-relaxed-custom',
  }[readingSettings.lineHeight];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Link
        href="/articles"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-cyanBrand-300 transition-all shadow-xs"
      >
        <ArrowBackIcon className="w-4 h-4 text-cyanBrand-500" />
        <span>{t('backToArticles')}</span>
      </Link>

      <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-cyanBrand-50 text-cyanBrand-600 dark:bg-cyanBrand-950/80 dark:text-cyanBrand-400">
              {article.category}
            </span>
            <button
              onClick={() => toggleFavArticle(article._id)}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                isFav ? 'bg-rose-500 text-white shadow' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              {article.authorAvatar ? (
                <img src={article.authorAvatar} alt={article.author} className="w-10 h-10 rounded-full object-cover shadow" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-cyanBrand-100 text-cyanBrand-600 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="font-bold text-slate-900 dark:text-white block text-sm">{article.author}</span>
                <span>{article.authorTitle} • {formatDate(article.createdAt, language)}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 font-semibold">
                <Clock className="w-4 h-4 text-cyanBrand-500" />
                {article.readTimeMinutes} min read
              </span>
              <RatingStars rating={ratingVal} interactive onRate={(r) => rateItem(article._id, r)} />
            </div>
          </div>
        </div>

        <div className="w-full h-80 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md">
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {/* Article Body */}
        <div className={`prose dark:prose-invert max-w-none ${fontClasses} ${sizeClasses} ${leadingClasses} text-slate-800 dark:text-slate-200 space-y-6`}>
          <p className="font-semibold text-lg text-brand-600 dark:text-brand-400 border-l-4 border-brand-500 pl-4 py-1">
            {article.summary}
          </p>
          <div className="whitespace-pre-line leading-relaxed">
            {article.content}
          </div>
        </div>

        {/* Article Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Tag className="w-4 h-4 text-slate-400" />
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Discussion & Reviews */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <CommentSection targetId={article._id} targetType="article" />
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {language === 'ar' ? 'مقالات طبية ذات صلة' : 'Related Clinical Articles'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map(art => (
              <ArticleCard key={art._id} article={art} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
