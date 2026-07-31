'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Testimonial } from '@/lib/types';
import { StorageManager } from '@/lib/storage';
import { Star, Quote, Send, User, Stethoscope, CheckCircle, Clock, Trash2 } from 'lucide-react';

// Seed default featured testimonials
const defaultTestimonials: Testimonial[] = [
  {
    _id: 'test-1',
    name: 'Prof. Dr. Tariq Al-Sayed',
    role: 'Consultant Cardiovascular Surgeon',
    institution: 'Cairo University Hospital',
    content: 'Med Bridge+ has revolutionized how our residency program accesses clinical textbooks and surgical technique guides. The PDF reader with sepia mode is exceptional.',
    rating: 5,
    approved: true,
    createdAt: '2024-11-15T10:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
  },
  {
    _id: 'test-2',
    name: 'Dr. Nour El-Din Mostafa',
    role: 'Fifth-Year Medical Student',
    institution: 'Faculty of Medicine, Alexandria University',
    content: 'The built-in PDF reader with warm sepia tone and instant dictionary lookup makes long study sessions strain-free. A must-have for every medical student in Egypt!',
    rating: 5,
    approved: true,
    createdAt: '2024-12-01T09:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
  },
  {
    _id: 'test-3',
    name: 'د. أحمد عبد المنعم',
    role: 'أستاذ مساعد في طب الأطفال',
    institution: 'جامعة عين شمس - كلية الطب',
    content: 'منصة رائعة توفر مصادر طبية عالية الجودة للطلاب والأطباء بشكل مجاني. التصنيف حسب التخصص يجعل البحث سريعاً وسهلاً للغاية.',
    rating: 5,
    approved: true,
    createdAt: '2025-01-10T14:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80',
  },
];

const STORAGE_KEY = 'medbridge_testimonials';

function getTestimonialsFromStorage(): Testimonial[] {
  if (typeof window === 'undefined') return defaultTestimonials;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultTestimonials;
    const parsed: Testimonial[] = JSON.parse(stored);
    // Merge defaults with user-submitted (avoid duplicates by _id)
    const ids = new Set(parsed.map(t => t._id));
    const merged = [...parsed, ...defaultTestimonials.filter(d => !ids.has(d._id))];
    return merged;
  } catch {
    return defaultTestimonials;
  }
}

function saveTestimonialsToStorage(list: Testimonial[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

interface TestimonialsSectionProps {
  isAdminMode?: boolean;
}

export function TestimonialsSection({ isAdminMode = false }: TestimonialsSectionProps) {
  const { t, language } = useApp();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '',
    role: '',
    institution: '',
    content: '',
    rating: 5,
  });

  useEffect(() => {
    setTestimonials(getTestimonialsFromStorage());
  }, []);

  const approvedTestimonials = testimonials.filter(t => t.approved);
  const pendingTestimonials = testimonials.filter(t => !t.approved);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) return;

    const newT: Testimonial = {
      _id: `test-user-${Date.now()}`,
      name: form.name.trim(),
      role: form.role.trim() || (language === 'ar' ? 'طبيب / طالب طب' : 'Medical Professional'),
      institution: form.institution.trim(),
      content: form.content.trim(),
      rating: form.rating,
      approved: true, // Immediately visible on website, admin can delete/manage anytime
      createdAt: new Date().toISOString(),
    };

    const updated = [newT, ...testimonials];
    setTestimonials(updated);
    saveTestimonialsToStorage(updated);
    setSubmitted(true);
    setForm({ name: '', role: '', institution: '', content: '', rating: 5 });
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
    }, 3000);
  };

  const handleApprove = (id: string) => {
    const updated = testimonials.map(t => t._id === id ? { ...t, approved: true } : t);
    setTestimonials(updated);
    saveTestimonialsToStorage(updated);
  };

  const handleDelete = (id: string) => {
    const updated = testimonials.filter(t => t._id !== id);
    setTestimonials(updated);
    saveTestimonialsToStorage(updated);
  };

  const StarDisplay = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
        />
      ))}
    </div>
  );

  // ─── Admin View ─────────────────────────────────────────────────────────────
  if (isAdminMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'ar' ? `الآراء والتوصيات (${testimonials.length})` : `Testimonials (${testimonials.length})`}
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
              ✅ {language === 'ar' ? 'موافق عليها' : 'Approved'}: {approvedTestimonials.length}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
              ⏳ {language === 'ar' ? 'قيد المراجعة' : 'Pending'}: {pendingTestimonials.length}
            </span>
          </div>
        </div>

        {pendingTestimonials.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {language === 'ar' ? '⏳ آراء قيد المراجعة' : '⏳ Pending Approval'}
            </h4>
            {pendingTestimonials.map(item => (
              <div key={item._id} className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-500">{item.role}</span>
                    </div>
                    <StarDisplay rating={item.rating} />
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">{item.content}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(item._id)}
                      className="p-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm"
                      title="Approve"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {language === 'ar' ? '✅ الآراء المنشورة' : '✅ Published Testimonials'}
          </h4>
          {approvedTestimonials.map(item => (
            <div key={item._id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                {item.avatar ? (
                  <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover shadow shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-slate-700 text-brand-600 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">{item.name}</span>
                  <span className="text-xs text-slate-500">{item.role} {item.institution ? `• ${item.institution}` : ''}</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{item.content}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-all shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Public View ─────────────────────────────────────────────────────────────
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-extrabold border border-brand-200 dark:border-brand-800">
          <Stethoscope className="w-4 h-4" />
          <span>{language === 'ar' ? 'آراء الأطباء والأكاديميين' : 'Medical Professionals Speak'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('testimonialsTitle')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {language === 'ar'
            ? 'ماذا يقول الأطباء وأساتذة الكليات الطبية عن منصة Med Bridge+'
            : 'What doctors and medical faculty say about Med Bridge+'}
        </p>
      </div>

      {/* Testimonials Grid */}
      {approvedTestimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedTestimonials.map((item) => (
            <div
              key={item._id}
              className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Quote icon */}
              <div className="absolute top-5 left-5 text-brand-100 dark:text-slate-800">
                <Quote className="w-8 h-8 fill-current" />
              </div>

              <div className="space-y-4">
                <StarDisplay rating={item.rating} />
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium italic">
                  "{item.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                {item.avatar ? (
                  <img src={item.avatar} alt={item.name} className="w-11 h-11 rounded-full object-cover shadow-md shrink-0" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-brand-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 font-bold text-base">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">{item.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{item.role}</p>
                  {item.institution && (
                    <p className="text-[11px] text-brand-500 dark:text-brand-400 font-semibold leading-tight">{item.institution}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-slate-400">
          {language === 'ar' ? 'لا توجد آراء معتمدة بعد.' : 'No approved testimonials yet.'}
        </div>
      )}

      {/* Add Testimonial Section */}
      <div className="max-w-2xl mx-auto">
        {!showForm ? (
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'ar' ? 'شاركنا رأيك وتوصيتك' : 'Share Your Experience'}</span>
            </button>
            <p className="text-xs text-slate-400 mt-2">
              {language === 'ar'
                ? 'سيظهر رأيك بعد موافقة الإدارة'
                : 'Your review will appear after admin approval'}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Quote className="w-5 h-5 text-brand-500" />
              {language === 'ar' ? 'شاركنا رأيك وتجربتك مع المنصة' : 'Share Your Professional Review'}
            </h3>

            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
                  {language === 'ar' ? 'شكراً! تم إرسال رأيك بنجاح وسيظهر بعد مراجعة الإدارة' : 'Thank you! Your review has been submitted and is awaiting admin approval.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating Stars */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {language === 'ar' ? 'التقييم العام' : 'Overall Rating'}
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm({ ...form, rating: s })}
                        className="p-1 transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${s <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder={language === 'ar' ? 'د. محمد أحمد...' : 'Dr. John Smith...'}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      {language === 'ar' ? 'التخصص / المنصب *' : 'Specialty / Role *'}
                    </label>
                    <input
                      type="text"
                      value={form.role}
                      onChange={e => setForm({ ...form, role: e.target.value })}
                      placeholder={language === 'ar' ? 'استشاري قلب / طالب طب...' : 'Cardiologist / Medical Student...'}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'المستشفى / الجامعة (اختياري)' : 'Hospital / University (optional)'}
                  </label>
                  <input
                    type="text"
                    value={form.institution}
                    onChange={e => setForm({ ...form, institution: e.target.value })}
                    placeholder={language === 'ar' ? 'مستشفى القاهرة / جامعة الإسكندرية...' : 'Cairo University Hospital...'}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'رأيك وتجربتك مع المنصة *' : 'Your Experience & Review *'}
                  </label>
                  <textarea
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    placeholder={language === 'ar' ? 'اكتب رأيك في المنصة وكيف ساعدتك في دراستك أو عملك...' : 'Share how Med Bridge+ helped your medical studies or clinical practice...'}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 resize-none"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-md transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إرسال رأيي' : 'Submit Review'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 transition-all"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
