'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
