'use client';

import React from 'react';

export function BookCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 animate-pulse flex flex-col h-full shadow-sm">
      <div className="w-full h-56 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-2" />
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-3" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-4" />
      <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between gap-2">
        <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/2" />
        <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/2" />
      </div>
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 animate-pulse flex flex-col shadow-sm">
      <div className="w-full h-44 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-3" />
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-5/6 mb-3" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mb-4" />
    </div>
  );
}
