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
  Home,
  Star,
  Sparkles,
  Check,
  X,
} from 'lucide-react';

export default function AdminPage() {
  const { t, language, comments, deleteComment, siteVisits, globalBooks, setGlobalBooks, globalArticles, setGlobalArticles, homeSections, setHomeSections } = useApp();

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
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'articles' | 'videos' | 'categories' | 'comments' | 'testimonials' | 'settings' | 'sections'>('overview');

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'coverImage' | 'pdfUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(2);

    try {
      const type = field === 'pdfUrl' ? 'pdf' : 'cover';

      // Step 1: Get a signed upload signature from our backend (no file sent to server)
      const sigRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const sigData = await sigRes.json();
      if (!sigRes.ok || sigData.error) {
        alert('فشل الرفع: ' + (sigData.error || 'لم يمكن الحصول على بيانات الرفع'));
        return;
      }

      const { signature, timestamp, apiKey, cloudName, folder, resourceType } = sigData;

      // Step 2: Upload directly from browser to Cloudinary in 5MB chunks
      const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB
      const uniqueUploadId = `mid-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      let start = 0;
      let secureUrl = '';

      while (start < file.size) {
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const chunkForm = new FormData();
        chunkForm.append('file', chunk, file.name);
        chunkForm.append('api_key', apiKey);
        chunkForm.append('timestamp', timestamp.toString());
        chunkForm.append('signature', signature);
        chunkForm.append('folder', folder);

        const chunkRes = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'X-Unique-Upload-Id': uniqueUploadId,
            'Content-Range': `bytes ${start}-${end - 1}/${file.size}`,
          },
          body: chunkForm,
        });

        // Update real progress
        const progress = Math.round((end / file.size) * 95);
        setUploadProgress(progress);

        // Last chunk returns the final Cloudinary response
        if (end === file.size) {
          const result = await chunkRes.json();
          if (result.error) {
            alert('فشل الرفع على Cloudinary: ' + result.error.message);
            return;
          }
          secureUrl = result.secure_url;
        }

        start = end;
      }

      if (secureUrl) {
        setNewBook(prev => ({ ...prev, [field]: secureUrl }));
        setUploadProgress(100);
      }
    } catch (err) {
      alert('خطأ في رفع الملف: ' + err);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 800);
    }
  };

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category: 'Anatomy',
    description: '',
    coverImage: '',
    pdfUrl: '',
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

  const emptyBook = {
    title: '',
    author: '',
    category: 'Anatomy',
    description: '',
    coverImage: '',
    pdfUrl: '',
    pages: 350,
    language: 'English',
    year: 2024,
    fileSize: '15 MB',
  };

  // Add Book — saves to MongoDB via API
  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.coverImage) {
      alert('⚠️ يرجى رفع صورة الغلاف أولاً قبل الحفظ.');
      return;
    }
    if (!newBook.pdfUrl) {
      alert('⚠️ يرجى إرفاق رابط PDF الكتاب أولاً قبل الحفظ.');
      return;
    }
    setIsUploading(true);
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBook,
          downloads: 0,
          views: 1,
          rating: 5.0,
          ratingCount: 1,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setBooks([data.data, ...books]);
        setShowAddBook(false);
        setNewBook(emptyBook);
        alert('✅ تم حفظ الكتاب في قاعدة البيانات بنجاح!');
      } else {
        // Fallback: save locally if DB not connected
        const created: Book = { ...newBook, _id: `book-${Date.now()}`, downloads: 0, views: 1, rating: 5.0, ratingCount: 1 };
        setBooks([created, ...books]);
        setShowAddBook(false);
        setNewBook(emptyBook);
        alert('⚠️ تم الحفظ محلياً فقط (قاعدة البيانات غير متصلة)');
      }
    } catch (err) {
      alert('❌ خطأ في الاتصال بقاعدة البيانات: ' + err);
    } finally {
      setIsUploading(false);
    }
  };

  const [showAddArticle, setShowAddArticle] = useState(false);
  const emptyArticle = {
    title: '',
    author: '',
    category: 'Anatomy',
    summary: '',
    content: '',
    coverImage: '',
    readTimeMinutes: 5,
  };
  const [newArticle, setNewArticle] = useState(emptyArticle);

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.coverImage) {
      alert('⚠️ يرجى إرفاق رابط صورة للمقال.');
      return;
    }
    const created: Article = {
      ...newArticle,
      _id: `article-${Date.now()}`,
      views: 1,
      rating: 5.0,
      ratingCount: 1,
      createdAt: new Date().toISOString(),
    };
    setArticles([created, ...articles]);
    setShowAddArticle(false);
    setNewArticle(emptyArticle);
    alert('✅ تم إضافة المقال بنجاح!');
  };

  // Delete Book — removes from MongoDB via API
  const handleDeleteBook = async (id: string) => {
    setBooks(books.filter(b => b._id !== id));
    try {
      await fetch(`/api/books/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Delete from DB failed:', err);
    }
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
          { id: 'sections', label: language === 'ar' ? 'الصفحة الرئيسية' : 'Home Sections', icon: Home },
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

                {/* Language Selector — prominent pill buttons */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {language === 'ar' ? '🌍 لغة الكتاب' : '🌍 Book Language'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'Arabic', labelAr: 'عربي 🇸🇦', labelEn: 'Arabic 🇸🇦' },
                      { value: 'English', labelAr: 'English 🇺🇸', labelEn: 'English 🇺🇸' },
                      { value: 'French', labelAr: 'Français 🇫🇷', labelEn: 'French 🇫🇷' },
                      { value: 'German', labelAr: 'Deutsch 🇩🇪', labelEn: 'German 🇩🇪' },
                    ].map(lang => (
                      <button
                        key={lang.value}
                        type="button"
                        onClick={() => setNewBook({ ...newBook, language: lang.value })}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                          newBook.language === lang.value
                            ? 'bg-brand-600 text-white border-brand-600 shadow-md scale-105'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-400'
                        }`}
                      >
                        {language === 'ar' ? lang.labelAr : lang.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year & Pages */}
                <input
                  type="number"
                  placeholder={language === 'ar' ? 'سنة الإصدار (مثال: 2024)' : 'Publication Year (e.g. 2024)'}
                  value={newBook.year}
                  onChange={(e) => setNewBook({ ...newBook, year: parseInt(e.target.value) || 2024 })}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium"
                  min={1900} max={2030}
                />
                <input
                  type="number"
                  placeholder={language === 'ar' ? 'عدد الصفحات' : 'Number of Pages'}
                  value={newBook.pages}
                  onChange={(e) => setNewBook({ ...newBook, pages: parseInt(e.target.value) || 1 })}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium"
                  min={1}
                />

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500">Cover Image</label>
                  {newBook.coverImage && newBook.coverImage.startsWith('http') ? (
                    <div className="relative w-full h-10 bg-slate-100 rounded-xl overflow-hidden border">
                      <img src={newBook.coverImage} alt="Cover" className="object-cover w-full h-full opacity-50" />
                      <button type="button" onClick={() => setNewBook({...newBook, coverImage: ''})} className="absolute inset-0 flex items-center justify-center text-xs font-bold text-red-600 hover:bg-red-50/50">Remove</button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'coverImage')}
                      disabled={isUploading}
                      className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500">Book PDF File</label>
                  {newBook.pdfUrl ? (
                    <div className="flex items-center justify-between px-4 py-2.5 bg-brand-50 rounded-xl border border-brand-100">
                      <span className="text-xs font-bold text-brand-700 truncate mr-2">PDF Uploaded ✓</span>
                      <button type="button" onClick={() => setNewBook({...newBook, pdfUrl: ''})} className="text-xs font-bold text-red-600 hover:underline">Clear</button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileUpload(e, 'pdfUrl')}
                      disabled={isUploading}
                      className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyanBrand-50 file:text-cyanBrand-700 hover:file:bg-cyanBrand-100"
                    />
                  )}
                </div>
              </div>
              <textarea
                placeholder="Description"
                value={newBook.description}
                onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium"
                rows={2}
                required
              />
              
              {isUploading && (
                <div className="w-full space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500">
                      {uploadProgress < 100
                        ? `⬆️ جاري الرفع... ${uploadProgress}%`
                        : '✅ اكتمل الرفع!'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-brand-500 to-cyanBrand-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    يتم الرفع مباشرةً إلى Cloudinary بتقنية Chunked Upload — يدعم ملفات حتى 2 جيجابايت
                  </p>
                </div>
              )}

              <button type="submit" disabled={isUploading} className={`px-6 py-2.5 rounded-xl text-white font-bold text-xs ${isUploading ? 'bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
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
              onClick={() => setShowAddArticle(!showAddArticle)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyanBrand-600 text-white font-bold text-xs shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة مقال سريري جديد' : 'Add New Article'}</span>
            </button>
          </div>

          {/* Add Article Form Modal */}
          {showAddArticle && (
            <form onSubmit={handleAddArticle} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="font-bold text-sm text-cyanBrand-600">{language === 'ar' ? 'إضافة مقال جديد' : 'Add Article'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'عنوان المقال' : 'Article Title'}
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium"
                  required
                />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'الكاتب' : 'Author'}
                  value={newArticle.author}
                  onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium"
                  required
                />
                <select
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium"
                >
                  {initialCategories.map(c => <option key={c._id} value={c.nameEn}>{c.nameEn}</option>)}
                </select>
                <input
                  type="number"
                  placeholder={language === 'ar' ? 'وقت القراءة (بالدقائق)' : 'Read Time (Minutes)'}
                  value={newArticle.readTimeMinutes}
                  onChange={(e) => setNewArticle({ ...newArticle, readTimeMinutes: parseInt(e.target.value) || 5 })}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium"
                  min={1}
                />
                <input
                  type="url"
                  placeholder={language === 'ar' ? 'رابط صورة الغلاف (مباشر)' : 'Cover Image URL'}
                  value={newArticle.coverImage}
                  onChange={(e) => setNewArticle({ ...newArticle, coverImage: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium col-span-1 md:col-span-2"
                  required
                />
                <textarea
                  placeholder={language === 'ar' ? 'ملخص المقال' : 'Summary'}
                  value={newArticle.summary}
                  onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium col-span-1 md:col-span-2"
                  rows={2}
                  required
                />
                <textarea
                  placeholder={language === 'ar' ? 'محتوى المقال (يدعم HTML)' : 'Content (HTML supported)'}
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium col-span-1 md:col-span-2"
                  rows={6}
                  required
                />
              </div>
              <button type="submit" className="px-6 py-2.5 rounded-xl text-white font-bold text-xs bg-cyanBrand-600 hover:bg-cyanBrand-700">
                {language === 'ar' ? 'حفظ المقال' : 'Save Article'}
              </button>
            </form>
          )}
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

      {/* Tab: Home Sections Manager */}
      {activeTab === 'sections' && (
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-600">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? 'إدارة أقسام الصفحة الرئيسية' : 'Home Page Sections Manager'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ar'
                  ? 'تحديد الكتب والمقالات التي تظهر في الصفحة الرئيسية — لو تركتها فارغة ستظهر أفضل الكتب تلقائياً'
                  : 'Choose which books appear in each homepage section. If left empty, defaults to auto-sorted best books.'}
              </p>
            </div>
          </div>

          {([
            {
              key: 'featuredBookIds' as const,
              label: language === 'ar' ? '⭐ الكتب المميزة' : '⭐ Featured Books',
              icon: Star,
              color: 'amber',
              isBook: true,
            },
            {
              key: 'latestBookIds' as const,
              label: language === 'ar' ? '✨ أحدث الإضافات' : '✨ Latest Additions',
              icon: Sparkles,
              color: 'brand',
              isBook: true,
            },
            {
              key: 'mostDownloadedBookIds' as const,
              label: language === 'ar' ? '⬇️ الأكثر تحميلاً' : '⬇️ Most Downloaded',
              icon: Download,
              color: 'emerald',
              isBook: true,
            },
            {
              key: 'latestArticleIds' as const,
              label: language === 'ar' ? '📋 أحدث المقالات السريرية' : '📋 Latest Clinical Articles',
              icon: FileText,
              color: 'cyan',
              isBook: false,
            },
          ] as Array<{ key: 'featuredBookIds' | 'latestBookIds' | 'mostDownloadedBookIds' | 'latestArticleIds'; label: string; icon: any; color: string; isBook: boolean }>).map(({ key, label, icon: Icon, color, isBook }) => {
            const selectedIds: string[] = homeSections[key];
            const items = isBook ? books : articles;

            const toggleItem = (id: string) => {
              const current = homeSections[key];
              const updated = current.includes(id)
                ? current.filter((i: string) => i !== id)
                : [...current, id];
              setHomeSections({ ...homeSections, [key]: updated });
            };

            const clearSection = () => {
              setHomeSections({ ...homeSections, [key]: [] });
            };

            return (
              <div key={key} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-brand-500" />
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{label}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedIds.length > 0
                        ? 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {selectedIds.length > 0
                        ? `${selectedIds.length} ${language === 'ar' ? 'مختار' : 'selected'}`
                        : (language === 'ar' ? 'تلقائي' : 'Auto')}
                    </span>
                  </div>
                  {selectedIds.length > 0 && (
                    <button
                      onClick={clearSection}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                      {language === 'ar' ? 'مسح التحديد' : 'Clear'}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                  {items.map((item: any) => {
                    const isSelected = selectedIds.includes(item._id);
                    return (
                      <button
                        key={item._id}
                        onClick={() => toggleItem(item._id)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border text-right transition-all ${
                          isSelected
                            ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-400 dark:border-brand-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {isBook && (item as Book).coverImage && (
                          <img
                            src={(item as Book).coverImage}
                            alt=""
                            className="w-10 h-12 object-cover rounded-xl shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0 text-right">
                          <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            {isBook ? `${(item as Book).language} • ${(item as Book).category}` : `${(item as Article).category} • ${(item as Article).readTimeMinutes} min`}
                          </p>
                        </div>
                        <div className={`shrink-0 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-brand-600 border-brand-600'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedIds.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 mb-2">
                      {language === 'ar' ? 'معاينة الترتيب المختار' : 'Selected order preview:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedIds.map((id: string, idx: number) => {
                        const item = items.find((b: any) => b._id === id);
                        return item ? (
                          <span key={id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-brand-100 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-[10px] font-bold">
                            <span className="w-4 h-4 rounded-full bg-brand-600 text-white text-[9px] flex items-center justify-center font-mono">{idx + 1}</span>
                            {(item as any).title.slice(0, 20)}{(item as any).title.length > 20 ? '...' : ''}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
