'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Stethoscope, Heart, Shield, BookOpen, FileText, Globe, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { initialCategories } from '@/lib/mockData';

export function Footer() {
  const { t, language } = useApp();
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-lg">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Med Bridge<span className="text-brand-500">+</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t('siteTagline')}
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ar' ? 'منصة مجانية 100% بدون إعلانات مزعجة' : '100% Free & Open Access Digital Library'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'ar' ? 'أقسام الموقع' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link href="/books" className="hover:text-brand-400 transition-colors">{t('navBooks')}</Link></li>
              <li><Link href="/articles" className="hover:text-brand-400 transition-colors">{t('navArticles')}</Link></li>
              <li><Link href="/categories" className="hover:text-brand-400 transition-colors">{t('navCategories')}</Link></li>
              <li><Link href="/videos" className="hover:text-brand-400 transition-colors">{t('navVideos')}</Link></li>
              <li><Link href="/dictionary" className="hover:text-brand-400 transition-colors">{t('navDictionary')}</Link></li>
            </ul>
          </div>

          {/* Top Specialties */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'ar' ? 'أبرز التخصصات' : 'Featured Specialties'}
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {initialCategories.slice(0, 5).map(cat => (
                <li key={cat._id}>
                  <Link href={`/categories?slug=${cat.slug}`} className="hover:text-cyanBrand-400 transition-colors">
                    {language === 'ar' ? cat.nameAr : cat.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Medical Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'ar' ? 'إخلاء مسؤولية' : 'Medical Disclaimer'}
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-800/60 p-3 rounded-2xl border border-slate-800">
              {t('disclaimer')}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {t('footerRights')}</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-slate-300 transition-colors">
              {t('navAdmin')}
            </Link>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" /> for Healthcare Professionals
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
