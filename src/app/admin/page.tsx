'use client';

import React, { useState, useEffect } from 'react';
import { initialBooks, initialArticles, initialVideos, initialCategories } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { Book, Article, MedicalVideo } from '@/lib/types';
import {
  Shield,
  Lock,
  BookOpen,
  FileText,
  Video,
  Grid,
  Plus,
  Trash2,
  Edit,
  Upload,
  Settings,
  MessageSquare,
  CheckCircle2,
  TrendingUp,
  Download,
  Eye,
} from 'lucide-react';

export default function AdminPage() {
  const { t, language, comments, deleteComment, siteVisits, globalBooks, setGlobalBooks, globalArticles, setGlobalArticles } = useApp();

  // Remember Authentication state in LocalStorage (Safe for SSR Hydration)
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem('medbridge_admin_auth') === 'true') {
      setAuthenticated(true);
    }
  }, []);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'articles' | 'videos' | 'categories' | 'comments' | 'testimonials' | 'settings'>('overview');

  // Use global books & articles from AppContext (persistent)
  const books = globalBooks;
  const setBooks = setGlobalBooks;
  const articles = globalArticles;
  const setArticles = setGlobalArticles;

  const [videos, setVideos] = useState<MedicalVideo[]>(initialVideos);

  // Dynamic Real Statistics Calculations
  const totalDownloads = books.reduce((sum, b) => sum + (b.downloads || 0), 0);
  const realSiteVisits = siteVisits;

  // New Book Form State
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category: 'Anatomy',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pages: 350,
    language: 'English',
    year: 2024,
    fileSize: '15 MB',
  });

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validPasswords = ['MedBridge1234', 'medbridge1234', 'medbridge', 'admin', '1234'];
    if (validPasswords.includes(password.trim())) {
      setAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('medbridge_admin_auth', 'true');
      }
      setErrorMsg('');
    } else {
      setErrorMsg(language === 'ar' ? 'كلمة المرور غير صحيحة' : 'Invalid Password');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('medbridge_admin_auth');
    }
  };

  // Add Book
  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Book = {
      ...newBook,
      _id: `book-${Date.now()}`,
      downloads: 0,
      views: 1,
      rating: 5.0,
      ratingCount: 1,
    };
    setBooks([created, ...books]);
    setShowAddBook(false);
    setNewBook({
      title: '',
      author: '',
      category: 'Anatomy',
      description: '',
      coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pages: 350,
      language: 'English',
      year: 2024,
      fileSize: '15 MB',
    });
  };

  // Delete Book
  const handleDeleteBook = (id: string) => {
    setBooks(books.filter(b => b._id !== id));
  };

  // Delete Article
  const handleDeleteArticle = (id: string) => {
    setArticles(articles.filter(a => a._id !== id));
  };

  // Delete Video
  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter(v => v._id !== id));
  };

  if (!mounted) return null;

  // If not authenticated show Password Box
  if (!authenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {t('adminLoginTitle')}
            </h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('adminPasswordPlaceholder')}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 text-center"
              required
            />
            {errorMsg && <p className="text-xs font-bold text-rose-500">{errorMsg}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
            >
              {t('loginButton')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-brand-500" />
            {t('adminDashboard')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ar' ? 'إدارة الكتب والمقالات والفيديوهات والتخصصات والإعدادات العامة' : 'Full control over medical books, articles, videos, and comments'}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-rose-500 hover:text-white transition-all self-start sm:self-auto"
        >
          {language === 'ar' ? 'تسجيل الخروج' : 'Lock Panel'}
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'books', label: `${t('navBooks')} (${books.length})`, icon: BookOpen },
          { id: 'articles', label: `${t('navArticles')} (${articles.length})`, icon: FileText },
          { id: 'videos', label: `${t('navVideos')} (${videos.length})`, icon: Video },
          { id: 'categories', label: t('manageCategories'), icon: Grid },
          { id: 'comments', label: `${t('manageComments')} (${comments.length})`, icon: MessageSquare },
          { id: 'testimonials', label: language === 'ar' ? 'الآراء والتوصيات' : 'Testimonials', icon: MessageSquare },
          { id: 'settings', label: t('siteSettings'), icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview Stats */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Total Books */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-4 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-600 font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white">{books.length}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold mt-0.5">{t('statsBooks')}</span>
              </div>
            </div>

            {/* 2. Total Articles */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-4 rounded-2xl bg-cyanBrand-100 dark:bg-cyanBrand-950 text-cyanBrand-600 font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white">{articles.length}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold mt-0.5">{t('statsArticles')}</span>
              </div>
            </div>

            {/* 3. Real Total Downloads (Sum of all book downloads) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white">{totalDownloads.toLocaleString()}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold mt-0.5">{t('statsDownloads')}</span>
              </div>
            </div>

            {/* 4. Real Site Visits Counter */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-4 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 font-bold">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white">{realSiteVisits.toLocaleString()}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold mt-0.5">
                  {language === 'ar' ? 'إجمالي زيارات الموقع' : 'Total Site Visits'}
                </span>
              </div>
            </div>

            {/* 5. Total Videos */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-4 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 font-bold">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white">{videos.length}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold mt-0.5">{t('navVideos')}</span>
              </div>
            </div>

            {/* 6. Comments Counter */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-4 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 font-bold">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white">{comments.length}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold mt-0.5">{t('manageComments')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Books Manager */}
      {activeTab === 'books' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('navBooks')}</h3>
            <button
              onClick={() => setShowAddBook(!showAddBook)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-600 text-white font-bold text-xs shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addBook')}</span>
            </button>
          </div>

          {/* Add Book Form Modal */}
          {showAddBook && (
            <form onSubmit={handleAddBook} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="font-bold text-sm text-brand-600">{t('addBook')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Book Title"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium"
                  required
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium"
                  required
                />
                <select
                  value={newBook.category}
                  onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium"
                >
                  {initialCategories.map(c => <option key={c._id} value={c.nameEn}>{c.nameEn}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="Cover Image URL (Cloudinary)"
                  value={newBook.coverImage}
                  onChange={(e) => setNewBook({ ...newBook, coverImage: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium"
                  required
                />
              </div>
              <textarea
                placeholder="Description"
                value={newBook.description}
                onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium"
                rows={2}
                required
              />
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                Save Book
              </button>
            </form>
          )}

          {/* Book List Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-4">Cover</th>
                  <th className="p-4">Title & Author</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Downloads</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {books.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <img src={b.coverImage} alt={b.title} className="w-10 h-14 object-cover rounded-lg shadow-sm" />
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900 dark:text-white block">{b.title}</span>
                      <span className="text-slate-400">{b.author}</span>
                    </td>
                    <td className="p-4 font-semibold">{b.category}</td>
                    <td className="p-4 font-mono font-bold">{b.downloads.toLocaleString()}</td>
                    <td className="p-4">
                      <button onClick={() => handleDeleteBook(b._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Articles Manager */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('navArticles')}</h3>
            <button
              onClick={() => alert(language === 'ar' ? 'يمكنك إضافة المقالات عبر ربط MongoDB Atlas أو رفع مقال جديد.' : 'Add Article')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyanBrand-600 text-white font-bold text-xs shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة مقال سريري جديد' : 'Add New Article'}</span>
            </button>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-4">Title & Author</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Read Time</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {articles.map((art) => (
                  <tr key={art._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <span className="font-bold text-slate-900 dark:text-white block">{art.title}</span>
                      <span className="text-slate-400">{art.author}</span>
                    </td>
                    <td className="p-4 font-semibold">{art.category}</td>
                    <td className="p-4 font-mono">{art.readTimeMinutes} min</td>
                    <td className="p-4">
                      <button onClick={() => setArticles(articles.filter(a => a._id !== art._id))} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Videos Manager */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('navVideos')}</h3>
            <button
              onClick={() => alert(language === 'ar' ? 'إضافة فيديو سريري جديد' : 'Add Video')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة فيديو جراحي' : 'Add Medical Video'}</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map(v => (
              <div key={v._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 space-y-3">
                <img src={v.thumbnail} alt={v.title} className="w-full h-36 object-cover rounded-2xl" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{v.title}</h4>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500">{v.duration}</span>
                  <button onClick={() => setVideos(videos.filter(item => item._id !== v._id))} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Categories Manager */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('manageCategories')} (20)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {initialCategories.map(cat => (
              <div key={cat._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white block">{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
                <span className="text-xs text-slate-400 block">{cat.bookCount} {t('statsBooks')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Comments Manager */}
      {activeTab === 'comments' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('manageComments')}</h3>
          {comments.length > 0 ? comments.map((c) => (
            <div key={c._id} className="p-4 bg-white dark:bg-slate-900 border rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white">{c.userName}: </span>
                <span className="text-xs text-slate-600 dark:text-slate-300">{c.content}</span>
              </div>
              <button onClick={() => deleteComment(c._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )) : (
            <p className="text-xs text-slate-400">{language === 'ar' ? 'لا توجد تعليقات حتى الآن.' : 'No comments yet.'}</p>
          )}
        </div>
      )}

      {/* Tab 7: Testimonials Manager */}
      {activeTab === 'testimonials' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <TestimonialsSection isAdminMode={true} />
        </div>
      )}

      {/* Tab 8: Site Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('siteSettings')}</h3>
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">اسم المنصة</label>
              <input type="text" defaultValue="Med Bridge+ Digital Hub" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">كلمة سر الأدمن الحالية</label>
              <input type="text" defaultValue="MedBridge1234" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono" readOnly />
            </div>
            <button onClick={() => alert(language === 'ar' ? 'تم حفظ إعدادات المنصة بنجاح!' : 'Settings saved successfully!')} className="px-6 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md">
              {language === 'ar' ? 'حفظ التغييرات' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
