'use client';

import React, { useState } from 'react';
import { MedicalVideo } from '@/lib/types';
import { Play, Clock, Eye, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function VideoCard({ video }: { video: MedicalVideo }) {
  const [playing, setPlaying] = useState(false);
  const { language } = useApp();

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between">
        <div className="relative w-full h-48 bg-slate-900 cursor-pointer overflow-hidden" onClick={() => setPlaying(true)}>
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center group-hover:bg-slate-900/20 transition-all">
            <div className="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>
          </div>

          <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyanBrand-400" />
            {video.duration}
          </span>

          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-brand-600/90 text-white backdrop-blur-md">
            {video.category}
          </span>
        </div>

        <div className="p-5">
          <h3
            onClick={() => setPlaying(true)}
            className="text-base font-bold text-slate-900 dark:text-white hover:text-brand-600 cursor-pointer line-clamp-2 leading-snug mb-2"
          >
            {video.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {video.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-brand-500" />
              {video.views.toLocaleString()} {language === 'ar' ? 'مشاهدة' : 'views'}
            </span>
            <button
              onClick={() => setPlaying(true)}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              {language === 'ar' ? 'تشغيل الفيديو' : 'Watch Video'}
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {playing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setPlaying(false)}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="aspect-video w-full">
              <iframe
                src={`${video.videoUrl}?autoplay=1`}
                title={video.title}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
