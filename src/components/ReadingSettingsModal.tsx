'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { X, Type, AlignLeft, Sliders, Accessibility, Check } from 'lucide-react';

export function ReadingSettingsModal() {
  const { readingSettingsOpen, setReadingSettingsOpen, readingSettings, updateReadingSettings, t, language } = useApp();

  if (!readingSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('readingSettings')}
            </h3>
          </div>
          <button
            onClick={() => setReadingSettingsOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-6">
          {/* Font Size */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block flex items-center gap-2">
              <Type className="w-4 h-4 text-brand-500" />
              {language === 'ar' ? 'حجم الخط' : 'Font Size'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'sm', label: 'Small' },
                { id: 'md', label: 'Medium' },
                { id: 'lg', label: 'Large' },
                { id: 'xl', label: 'XL' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => updateReadingSettings({ fontSize: item.id as any })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    readingSettings.fontSize === item.id
                      ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Line Height */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-cyanBrand-500" />
              {language === 'ar' ? 'ارتفاع السطر' : 'Line Height'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'tight', label: language === 'ar' ? 'مكثف' : 'Tight' },
                { id: 'normal', label: language === 'ar' ? 'متوسط' : 'Normal' },
                { id: 'relaxed', label: language === 'ar' ? 'متباعد' : 'Relaxed' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => updateReadingSettings({ lineHeight: item.id as any })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    readingSettings.lineHeight === item.id
                      ? 'bg-cyanBrand-600 text-white border-cyanBrand-600 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-cyanBrand-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
              {language === 'ar' ? 'نوع الخط' : 'Font Family'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sans', label: 'Sans-Serif' },
                { id: 'serif', label: 'Serif' },
                { id: 'mono', label: 'Monospace' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => updateReadingSettings({ fontFamily: item.id as any })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    readingSettings.fontFamily === item.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Elderly Accessibility Mode Toggle */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Accessibility className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  {t('elderlyMode')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  {t('elderlyModeDesc')}
                </span>
              </div>
            </div>
            <button
              onClick={() => updateReadingSettings({ elderlyMode: !readingSettings.elderlyMode })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                readingSettings.elderlyMode ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <span className="w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
