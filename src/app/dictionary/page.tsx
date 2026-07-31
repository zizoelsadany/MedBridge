'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { initialDictionary } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { Stethoscope, Search, Volume2, BookOpen, Tag } from 'lucide-react';
import Link from 'next/link';

function DictionaryContent() {
  const { t, language } = useApp();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQ);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const filteredTerms = initialDictionary.filter(t => {
    const matchesLetter = !selectedLetter || t.term.toUpperCase().startsWith(selectedLetter);
    const matchesQuery = !query.trim() ||
      t.term.toLowerCase().includes(query.toLowerCase()) ||
      t.meaning.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase());
    return matchesLetter && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <Stethoscope className="w-8 h-8 text-emeraldBrand-500" />
          {t('navDictionary')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {language === 'ar' ? 'معجم سريري شامل يغطي آلاف المصطلحات والسياقات التشخيصية' : 'Comprehensive clinical glossary defining core terms, pathophysiology, and etymology'}
        </p>
      </div>

      {/* Search & Letter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="w-5 h-5 text-slate-400 absolute top-3.5 right-4 left-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedLetter(null);
            }}
            placeholder={language === 'ar' ? 'ابحث عن مصطلح طبي (مثال: Aneurysm, Bradycardia...)' : 'Search medical term (e.g., Cyanosis, Dyspnea...)'}
            className="w-full px-12 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emeraldBrand-500"
          />
        </div>

        {/* Alphabet Bar */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setSelectedLetter(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedLetter === null
                ? 'bg-emeraldBrand-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {language === 'ar' ? 'الكل' : 'All'}
          </button>
          {alphabet.map(letter => (
            <button
              key={letter}
              onClick={() => {
                setSelectedLetter(letter);
                setQuery('');
              }}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                selectedLetter === letter
                  ? 'bg-emeraldBrand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Dictionary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTerms.map(item => (
          <div
            key={item._id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {item.term}
                  </h3>
                  {item.phonetic && (
                    <span className="text-xs font-mono font-medium text-slate-400">
                      {item.phonetic}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-emeraldBrand-600 dark:text-emeraldBrand-400 mt-0.5">
                  {item.meaning}
                </h4>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {item.category}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              {item.description}
            </p>

            {item.relatedTerms && item.relatedTerms.length > 0 && (
              <div className="flex items-center gap-2 pt-2 text-xs">
                <span className="font-bold text-slate-400">{t('relatedTerms')}:</span>
                <div className="flex flex-wrap gap-1.5">
                  {item.relatedTerms.map((rt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(rt)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold hover:bg-emerald-100 transition-colors"
                    >
                      {rt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DictionaryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading dictionary...</div>}>
      <DictionaryContent />
    </Suspense>
  );
}
