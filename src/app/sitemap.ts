import { MetadataRoute } from 'next';
import { initialBooks, initialArticles } from '@/lib/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://medbridge-plus.vercel.app';

  const bookUrls = initialBooks.map(b => ({
    url: `${baseUrl}/books/${b._id}`,
    lastModified: new Date(),
  }));

  const articleUrls = initialArticles.map(a => ({
    url: `${baseUrl}/articles/${a._id}`,
    lastModified: new Date(),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/books`, lastModified: new Date() },
    { url: `${baseUrl}/articles`, lastModified: new Date() },
    { url: `${baseUrl}/categories`, lastModified: new Date() },
    { url: `${baseUrl}/videos`, lastModified: new Date() },
    { url: `${baseUrl}/dictionary`, lastModified: new Date() },
    ...bookUrls,
    ...articleUrls,
  ];
}
