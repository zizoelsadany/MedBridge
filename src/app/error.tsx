'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Auto hard-reload on chunk loading failures (stale Vercel deployment cache)
    const isChunkError =
      error.message?.includes('Loading chunk') ||
      error.message?.includes('ChunkLoadError') ||
      error.message?.includes('Failed to fetch dynamically imported module') ||
      error.name === 'ChunkLoadError';

    if (isChunkError) {
      // Hard reload clears old chunks
      window.location.reload();
    }
  }, [error]);

  const isChunkError =
    error.message?.includes('Loading chunk') ||
    error.message?.includes('ChunkLoadError') ||
    error.message?.includes('Failed to fetch dynamically imported module') ||
    error.name === 'ChunkLoadError';

  if (isChunkError) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center shadow-lg animate-pulse">
          <RefreshCw className="w-8 h-8" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">جاري تحديث الصفحة...</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Refreshing to load the latest version...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center shadow-lg">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Unexpected Error Occurred
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {error.message || 'An error occurred while displaying medical resources.'}
        </p>
      </div>

      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 text-white font-bold text-xs shadow-md"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
