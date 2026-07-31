'use client';

import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { Clock, Eye, Bookmark, ArrowRight, ArrowLeft } from 'lucide-react';
import { RatingStars } from './RatingStars';

export function ArticleCard({ article }: { article: Article }) {
  const { favArticleIds, toggleFavArticle, t, language } = useApp();
  const isFav = favArticleIds.includes(article._id);
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <button
            onClick={() => toggleFavArticle(article._id)}
            className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
              isFav ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-900/60 text-white hover:bg-slate-900'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
          <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-cyanBrand-600/90 text-white backdrop-blur-md">
            {article.category}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyanBrand-500" />
              {article.readTimeMinutes} min read
            </span>
            <RatingStars rating={article.rating} size="sm" />
          </div>

          <Link href={`/articles/${article._id}`}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyanBrand-600 transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {article.authorAvatar && (
            <img src={article.authorAvatar} alt={article.author} className="w-7 h-7 rounded-full object-cover" />
          )}
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{article.author}</span>
        </div>

        <Link
          href={`/articles/${article._id}`}
          className="flex items-center gap-1 text-xs font-bold text-cyanBrand-600 hover:text-cyanBrand-700 dark:text-cyanBrand-400 transition-all"
        >
          <span>{t('viewDetails')}</span>
          <ArrowIcon className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
