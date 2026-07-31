'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, ThemeMode, ReadingSettings, CommentItem, Book, Article } from '@/lib/types';
import { StorageManager } from '@/lib/storage';
import { translations } from '@/lib/translations';
import { initialBooks, initialArticles } from '@/lib/mockData';

const BOOKS_KEY = 'medbridge_admin_books';
const ARTICLES_KEY = 'medbridge_admin_articles';

function loadAdminBooks(): Book[] {
  if (typeof window === 'undefined') return initialBooks;
  try {
    const stored = localStorage.getItem(BOOKS_KEY);
    if (!stored) return initialBooks;
    return JSON.parse(stored) as Book[];
  } catch { return initialBooks; }
}

function loadAdminArticles(): Article[] {
  if (typeof window === 'undefined') return initialArticles;
  try {
    const stored = localStorage.getItem(ARTICLES_KEY);
    if (!stored) return initialArticles;
    return JSON.parse(stored) as Article[];
  } catch { return initialArticles; }
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  readingSettings: ReadingSettings;
  updateReadingSettings: (newSettings: Partial<ReadingSettings>) => void;
  favBookIds: string[];
  toggleFavBook: (id: string) => void;
  favArticleIds: string[];
  toggleFavArticle: (id: string) => void;
  userRatings: Record<string, number>;
  rateItem: (id: string, rating: number) => void;
  comments: CommentItem[];
  addComment: (targetId: string, targetType: 'book' | 'article', content: string, userName: string, rating?: number) => void;
  deleteComment: (id: string) => void;
  quickSearchOpen: boolean;
  setQuickSearchOpen: (open: boolean) => void;
  readingSettingsOpen: boolean;
  setReadingSettingsOpen: (open: boolean) => void;
  siteVisits: number;
  // Global admin-editable books & articles
  globalBooks: Book[];
  setGlobalBooks: (books: Book[]) => void;
  globalArticles: Article[];
  setGlobalArticles: (articles: Article[]) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLangState] = useState<Language>('ar');
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [readingSettings, setReadingSettingsState] = useState<ReadingSettings>({
    fontSize: 'md',
    lineHeight: 'normal',
    paragraphWidth: 'medium',
    fontFamily: 'sans',
    elderlyMode: false,
  });
  const [favBookIds, setFavBookIds] = useState<string[]>([]);
  const [favArticleIds, setFavArticleIds] = useState<string[]>([]);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [comments, setCommentsState] = useState<CommentItem[]>([]);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [readingSettingsOpen, setReadingSettingsOpen] = useState(false);
  const [siteVisits, setSiteVisits] = useState(1);
  const [globalBooks, setGlobalBooksState] = useState<Book[]>(initialBooks);
  const [globalArticles, setGlobalArticlesState] = useState<Article[]>(initialArticles);

  // Initialize from LocalStorage
  useEffect(() => {
    setLangState(StorageManager.getLanguage());
    setThemeState(StorageManager.getTheme());
    setReadingSettingsState(StorageManager.getReadingSettings());
    setFavBookIds(StorageManager.getFavoriteBooks());
    setFavArticleIds(StorageManager.getFavoriteArticles());
    setUserRatings(StorageManager.getRatedItems());
    setCommentsState(StorageManager.getComments());

    // Load admin-managed books & articles
    setGlobalBooksState(loadAdminBooks());
    setGlobalArticlesState(loadAdminArticles());

    // Increment & track site visits
    const updatedVisits = StorageManager.incrementSiteVisits();
    setSiteVisits(updatedVisits);
  }, []);

  // Update HTML tag attributes for RTL/LTR & Theme classes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    root.setAttribute('lang', language);

    // Clean previous reading classes
    root.classList.remove(
      'dark', 'theme-sepia', 'theme-high-contrast', 'elderly-mode',
      'font-sm', 'font-md', 'font-lg', 'font-xl',
      'leading-compact', 'leading-normal', 'leading-loose',
      'font-sans', 'font-serif', 'font-mono'
    );

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'sepia') {
      root.classList.add('theme-sepia');
    } else if (theme === 'high-contrast') {
      root.classList.add('theme-high-contrast');
    }

    if (readingSettings.elderlyMode) {
      root.classList.add('elderly-mode');
    }

    // Apply font size class to html root
    root.classList.add(`font-${readingSettings.fontSize}`);
    root.classList.add(`leading-${readingSettings.lineHeight}`);
    root.classList.add(`font-${readingSettings.fontFamily}`);
  }, [language, theme, readingSettings]);

  const setLanguage = (lang: Language) => {
    setLangState(lang);
    StorageManager.setLanguage(lang);
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    StorageManager.setTheme(newTheme);
  };

  const updateReadingSettings = (newSettings: Partial<ReadingSettings>) => {
    setReadingSettingsState(prev => {
      const updated = { ...prev, ...newSettings };
      StorageManager.saveReadingSettings(updated);
      return updated;
    });
  };

  const toggleFavBook = (id: string) => {
    const updated = StorageManager.toggleFavoriteBook(id);
    setFavBookIds(updated);
  };

  const toggleFavArticle = (id: string) => {
    const updated = StorageManager.toggleFavoriteArticle(id);
    setFavArticleIds(updated);
  };

  const rateItem = (id: string, rating: number) => {
    const updated = StorageManager.rateItem(id, rating);
    setUserRatings(updated);
  };

  const addComment = (targetId: string, targetType: 'book' | 'article', content: string, userName: string, rating?: number) => {
    const created = StorageManager.addComment({
      targetId,
      targetType,
      content,
      userName: userName.trim() || (language === 'ar' ? 'زائر طبيب' : 'Medical Visitor'),
      userRole: language === 'ar' ? 'طالب / طبيب' : 'Medical Scholar',
      rating
    });
    setCommentsState(prev => [created, ...prev]);
  };

  const deleteComment = (id: string) => {
    StorageManager.deleteComment(id);
    setCommentsState(prev => prev.filter(c => c._id !== id));
  };

  const setGlobalBooks = (books: Book[]) => {
    setGlobalBooksState(books);
    if (typeof window !== 'undefined') {
      localStorage.setItem('medbridge_admin_books', JSON.stringify(books));
    }
  };

  const setGlobalArticles = (articles: Article[]) => {
    setGlobalArticlesState(articles);
    if (typeof window !== 'undefined') {
      localStorage.setItem('medbridge_admin_articles', JSON.stringify(articles));
    }
  };

  const t = (key: keyof typeof translations['en']): string => {
    const dict = translations[language] || translations['en'];
    return dict[key] || translations['en'][key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        readingSettings,
        updateReadingSettings,
        favBookIds,
        toggleFavBook,
        favArticleIds,
        toggleFavArticle,
        userRatings,
        rateItem,
        comments,
        addComment,
        deleteComment,
        quickSearchOpen,
        setQuickSearchOpen,
        readingSettingsOpen,
        setReadingSettingsOpen,
        siteVisits,
        globalBooks,
        setGlobalBooks,
        globalArticles,
        setGlobalArticles,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
