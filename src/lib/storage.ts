import { ReadingSettings, ThemeMode, Language, CommentItem } from './types';

const KEYS = {
  FAV_BOOKS: 'medbridge_fav_books',
  FAV_ARTICLES: 'medbridge_fav_articles',
  RATED_BOOKS: 'medbridge_rated_books',
  RATED_ARTICLES: 'medbridge_rated_articles',
  USER_COMMENTS: 'medbridge_comments',
  READING_HISTORY: 'medbridge_history',
  RECENTLY_VIEWED: 'medbridge_recently_viewed',
  THEME: 'medbridge_theme',
  LANG: 'medbridge_lang',
  READING_SETTINGS: 'medbridge_reading_settings',
};

// Helper for safe client-side access
const getItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from LocalStorage:`, err);
    return defaultValue;
  }
};

const setItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to LocalStorage:`, err);
  }
};

export const StorageManager = {
  // Favorites
  getFavoriteBooks: (): string[] => getItem<string[]>(KEYS.FAV_BOOKS, []),
  toggleFavoriteBook: (bookId: string): string[] => {
    const favs = StorageManager.getFavoriteBooks();
    const updated = favs.includes(bookId) ? favs.filter(id => id !== bookId) : [...favs, bookId];
    setItem(KEYS.FAV_BOOKS, updated);
    return updated;
  },

  getFavoriteArticles: (): string[] => getItem<string[]>(KEYS.FAV_ARTICLES, []),
  toggleFavoriteArticle: (articleId: string): string[] => {
    const favs = StorageManager.getFavoriteArticles();
    const updated = favs.includes(articleId) ? favs.filter(id => id !== articleId) : [...favs, articleId];
    setItem(KEYS.FAV_ARTICLES, updated);
    return updated;
  },

  // Ratings
  getRatedItems: (): Record<string, number> => getItem<Record<string, number>>(KEYS.RATED_BOOKS, {}),
  rateItem: (id: string, rating: number): Record<string, number> => {
    const current = StorageManager.getRatedItems();
    const updated = { ...current, [id]: rating };
    setItem(KEYS.RATED_BOOKS, updated);
    return updated;
  },

  // Comments
  getComments: (targetId?: string): CommentItem[] => {
    const comments = getItem<CommentItem[]>(KEYS.USER_COMMENTS, []);
    return targetId ? comments.filter(c => c.targetId === targetId) : comments;
  },
  addComment: (comment: Omit<CommentItem, '_id' | 'createdAt'>): CommentItem => {
    const all = getItem<CommentItem[]>(KEYS.USER_COMMENTS, []);
    const newComment: CommentItem = {
      ...comment,
      _id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newComment, ...all];
    setItem(KEYS.USER_COMMENTS, updated);
    return newComment;
  },
  deleteComment: (id: string): void => {
    const all = getItem<CommentItem[]>(KEYS.USER_COMMENTS, []);
    setItem(KEYS.USER_COMMENTS, all.filter(c => c._id !== id));
  },

  // Recently Viewed & Reading History
  getRecentlyViewed: (): string[] => getItem<string[]>(KEYS.RECENTLY_VIEWED, []),
  addRecentlyViewed: (bookId: string): void => {
    const list = StorageManager.getRecentlyViewed().filter(id => id !== bookId);
    setItem(KEYS.RECENTLY_VIEWED, [bookId, ...list].slice(0, 12));
  },

  getReadingHistory: (): { bookId: string; page: number; date: string }[] => getItem(KEYS.READING_HISTORY, []),
  saveReadingProgress: (bookId: string, page: number): void => {
    const history = StorageManager.getReadingHistory().filter(h => h.bookId !== bookId);
    const updated = [{ bookId, page, date: new Date().toISOString() }, ...history];
    setItem(KEYS.READING_HISTORY, updated.slice(0, 20));
  },

  // Theme & Language
  getTheme: (): ThemeMode => getItem<ThemeMode>(KEYS.THEME, 'light'),
  setTheme: (theme: ThemeMode): void => setItem(KEYS.THEME, theme),

  getLanguage: (): Language => getItem<Language>(KEYS.LANG, 'ar'),
  setLanguage: (lang: Language): void => setItem(KEYS.LANG, lang),

  // Site Visit Counter
  getSiteVisits: (): number => getItem<number>('medbridge_site_visits', 1),
  incrementSiteVisits: (): number => {
    const visits = StorageManager.getSiteVisits() + 1;
    setItem('medbridge_site_visits', visits);
    return visits;
  },

  // Reading settings
  getReadingSettings: (): ReadingSettings => getItem<ReadingSettings>(KEYS.READING_SETTINGS, {
    fontSize: 'md',
    lineHeight: 'normal',
    paragraphWidth: 'medium',
    fontFamily: 'sans',
    elderlyMode: false,
  }),
  saveReadingSettings: (settings: ReadingSettings): void => setItem(KEYS.READING_SETTINGS, settings),
};
