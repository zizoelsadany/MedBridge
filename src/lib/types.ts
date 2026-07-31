export type Language = 'en' | 'ar';

export type ThemeMode = 'light' | 'dark' | 'sepia' | 'high-contrast';

export interface ReadingSettings {
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  lineHeight: 'tight' | 'normal' | 'relaxed';
  paragraphWidth: 'narrow' | 'medium' | 'wide' | 'full';
  fontFamily: 'sans' | 'serif' | 'mono';
  elderlyMode: boolean;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  pages: number;
  language: string;
  year: number;
  fileSize: string;
  downloads: number;
  views: number;
  rating: number;
  ratingCount: number;
  isFeatured?: boolean;
  tableOfContents?: string[];
  isbn?: string;
  publisher?: string;
  createdAt?: string;
}

export interface Article {
  _id: string;
  title: string;
  author: string;
  authorTitle?: string;
  authorAvatar?: string;
  category: string;
  summary: string;
  content: string;
  coverImage: string;
  readTimeMinutes: number;
  views: number;
  rating: number;
  ratingCount: number;
  createdAt: string;
  isFeatured?: boolean;
  tags?: string[];
}

export interface MedicalVideo {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  category: string;
  views: number;
  createdAt: string;
}

export interface MedicalTerm {
  _id: string;
  term: string;
  phonetic?: string;
  meaning: string;
  description: string;
  category: string;
  relatedTerms: string[];
}

export interface Category {
  _id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  iconName: string;
  descriptionEn: string;
  descriptionAr: string;
  bookCount: number;
  articleCount: number;
}

export interface CommentItem {
  _id: string;
  targetId: string; // bookId or articleId
  targetType: 'book' | 'article';
  userName: string;
  userRole?: string;
  content: string;
  createdAt: string;
  rating?: number;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  institution?: string;
  content: string;
  rating: number;
  approved: boolean;
  createdAt: string;
  avatar?: string;
}
