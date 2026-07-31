'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { initialBooks, initialCategories, initialArticles } from '@/lib/mockData';
import { BookCard } from '@/components/BookCard';
import { ArticleCard } from '@/components/ArticleCard';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import {
  Search,
  BookOpen,
  FileText,
  Download,
  Star,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const { t, language, setQuickSearchOpen } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  const featuredBooks = initialBooks.filter(b => b.isFeatured);
  const latestBooks = [...initialBooks].sort((a, b) => b.year - a.year).slice(0, 4);
  const mostDownloaded = [...initialBooks].sort((a, b) => b.downloads - a.downloads).slice(0, 4);
  const highestRated = [...initialBooks].sort((a, b) => b.rating - a.rating).slice(0, 4);

  const stats = [
    { number: '5,000+', label: t('statsBooks'), icon: BookOpen },
    { number: '12,000+', label: t('statsArticles'), icon: FileText },
    { number: '50,000+', label: t('statsDownloads'), icon: Download },
    { number: '20+', label: t('statsSpecialties'), icon: Award },
  ];

  const testimonials = [
    {
      quoteEn: 'Med Bridge+ has revolutionized how our residency program accesses clinical textbooks and surgical technique guides.',
      quoteAr: 'غيرت منصة Med Bridge+ طريقة وصول برنامج الإقامة لدينا للكتب الطبية وأدلة التقنيات الجراحية بدقة وسهولة عالية.',
      author: 'Prof. Dr. Tariq Al-Sayed',
      roleEn: 'Consultant Cardiovascular Surgeon & University Professor',
      roleAr: 'استشاري جراحة القلب والأوعية الدموية وأستاذ جامعي',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    },
    {
      quoteEn: 'The built-in PDF reader with sepiatone and instant dictionary lookup makes long study sessions strain-free.',
      quoteAr: 'قارئ الملفات المدمج مع الوضع الدافئ والمعجم الفوري جعل جلسات المذاكرة الطويلة مريحة جداً وبدون إجهاد بصري.',
      author: 'Dr. Nour El-Din',
      roleEn: 'Fifth-Year Medical Student',
      roleAr: 'طالبة بالسنة الخامسة بكلية الطب البشري',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const faqs = [
    {
      qEn: 'Are all medical books and articles free to read and download on Med Bridge+?',
      qAr: 'هل جميع الكتب والمقالات الطبية مجانية للقراءة والتحميل في Med Bridge+؟',
      aEn: 'Yes! Med Bridge+ is an open-access medical library designed for education, research, and clinical references without any registration or hidden fees.',
      aAr: 'نعم! منصة Med Bridge+ هي مكتبة رقمية مفتوحة المصدر مخصصة للتعليم والبحث الطبي دون الحاجة للتسجيل أو دفع أي رسوم.',
    },
    {
      qEn: 'How can I adjust font size or enable dark / elderly mode for better accessibility?',
      qAr: 'كيف يمكنني تعديل حجم الخط أو تفعيل الوضع الدافئ / وضع كبار السن؟',
      aEn: 'Click the Sliders icon in the top header to customize font size, line height, font family, or enable Elderly Accessibility Mode instantly.',
      aAr: 'اضغط على أيقونة الإعدادات في الشريط العلوي لتعديل حجم الخط، ارتفاع السطور، نوع الخط، أو تفعيل وضع كبار السن بنقرة واحدة.',
    },
    {
      qEn: 'Can I read PDF textbooks online without downloading them?',
      qAr: 'هل يمكنني قراءة كتب PDF أونلاين مباشرة بدون تحميلها؟',
      aEn: 'Absolutely. Every book includes a Read Online button featuring our built-in PDF reader with zoom, page jumps, and fullscreen capabilities.',
      aAr: 'بالتأكيد. يتضمن كل كتاب زر "قراءة أونلاين" يفتح قارئ PDF تفاعلي مدمج يتيح التكبير والبحث والتنقل السريع بين الصفحات.',
    },
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-transparent dark:from-slate-900/80 dark:via-slate-950 dark:to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100/80 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 text-xs font-bold shadow-xs border border-brand-200 dark:border-brand-800 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>{t('siteTagline')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {t('heroTitle')}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {t('heroSubtitle')}
            </p>

            {/* Floating Search Bar */}
            <div className="pt-4 max-w-2xl mx-auto">
              <div
                onClick={() => setQuickSearchOpen(true)}
                className="flex items-center gap-3 p-3 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-brand-200 dark:border-slate-700 shadow-xl hover:border-brand-500 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Search className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-400 dark:text-slate-500 flex-1 text-right">
                  {t('searchPlaceholder')}
                </span>
                <span className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'بحث سريع' : 'Quick Search'}
                </span>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Free Open Access</span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> No Account Required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-brand-500" /> Verified Medical Texts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Specialties Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t('medicalCategories')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'ar' ? 'تصفح 20 تخصصاً طبقاً لأعلى المعايير الأكاديمية' : 'Explore 20 core clinical specialties'}
            </p>
          </div>
          <Link
            href="/categories"
            className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:gap-2 transition-all"
          >
            <span>{language === 'ar' ? 'عرض كافة التخصصات' : 'View All'}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {initialCategories.slice(0, 10).map((cat) => (
            <Link
              key={cat._id}
              href={`/books?category=${cat.slug}`}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm group-hover:bg-brand-600 group-hover:text-white transition-all">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                  {language === 'ar' ? cat.nameAr : cat.nameEn}
                </h3>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {cat.bookCount} {t('statsBooks')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500 block mb-1">
              Gold Standard References
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t('featuredBooks')}
            </h2>
          </div>
          <Link
            href="/books"
            className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:gap-2 transition-all"
          >
            <span>{t('viewDetails')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </section>

      {/* Latest Books & Most Downloaded Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              {t('latestBooks')}
            </h2>
            <Link href="/books?sort=newest" className="text-xs font-bold text-brand-600">
              {language === 'ar' ? 'عرض الكل' : 'View All'}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {latestBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-6 h-6 text-emerald-500" />
              {t('mostDownloaded')}
            </h2>
            <Link href="/books?sort=popular" className="text-xs font-bold text-brand-600">
              {language === 'ar' ? 'عرض الكل' : 'View All'}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mostDownloaded.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Clinical Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t('latestArticles')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'ar' ? 'مستجدات الأبحاث السريرية والإرشادات العلاجية' : 'Peer-reviewed clinical insights and trial updates'}
            </p>
          </div>
          <Link
            href="/articles"
            className="flex items-center gap-1 text-xs font-bold text-cyanBrand-600 hover:gap-2 transition-all"
          >
            <span>{t('viewDetails')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialArticles.map((art) => (
            <ArticleCard key={art._id} article={art} />
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-r from-brand-600 to-cyanBrand-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="space-y-2 p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
                  <Icon className="w-8 h-8 mx-auto text-cyanBrand-200" />
                  <div className="text-3xl sm:text-4xl font-black">{stat.number}</div>
                  <div className="text-xs font-bold text-cyanBrand-100 uppercase tracking-wider">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('faqTitle')}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-6 text-right flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-base hover:text-brand-600"
                >
                  <span>{language === 'ar' ? faq.qAr : faq.qEn}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180 text-brand-500' : 'text-slate-400'}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4">
                    {language === 'ar' ? faq.aAr : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
