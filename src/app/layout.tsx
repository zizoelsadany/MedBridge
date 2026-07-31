import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MobileNav } from '@/components/MobileNav';
import { QuickSearchModal } from '@/components/QuickSearchModal';
import { ReadingSettingsModal } from '@/components/ReadingSettingsModal';

export const metadata: Metadata = {
  title: 'Med Bridge+ | Digital Medical Library & Knowledge Hub',
  description: 'Your premier digital hub for medical textbooks, peer-reviewed clinical articles, surgical videos, and interactive medical dictionary.',
  keywords: ['Medical Books', 'Digital Library', 'Medicine', 'Anatomy', 'Surgery', 'Cardiology', 'Medical Dictionary', 'PDF Reader'],
  openGraph: {
    title: 'Med Bridge+ | Premier Medical Hub',
    description: 'Access peer-reviewed medical books, clinical articles, surgical videos, and interactive tools.',
    siteName: 'Med Bridge+',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased selection:bg-brand-500 selection:text-white">
        <AppProvider>
          <Navbar />
          <main className="flex-1 pb-20 lg:pb-0">{children}</main>
          <Footer />
          <MobileNav />
          <QuickSearchModal />
          <ReadingSettingsModal />
        </AppProvider>
      </body>
    </html>
  );
}
