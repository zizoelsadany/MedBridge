import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import BookModel from '@/models/Book';
import ArticleModel from '@/models/Article';
import VideoModel from '@/models/Video';
import TermModel from '@/models/Term';
import { initialBooks, initialArticles, initialVideos, initialDictionary } from '@/lib/mockData';

export async function POST() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ message: 'MongoDB not connected. Operating in mock mode.' });
    }

    await BookModel.deleteMany({});
    await ArticleModel.deleteMany({});
    await VideoModel.deleteMany({});
    await TermModel.deleteMany({});

    await BookModel.insertMany(initialBooks);
    await ArticleModel.insertMany(initialArticles);
    await VideoModel.insertMany(initialVideos);
    await TermModel.insertMany(initialDictionary);

    return NextResponse.json({ success: true, message: 'Database seeded successfully!' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
