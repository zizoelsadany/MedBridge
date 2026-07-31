import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ArticleModel from '@/models/Article';
import { initialArticles } from '@/lib/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  try {
    const db = await connectToDatabase();
    if (db) {
      const filter: any = {};
      if (category && category !== 'all') filter.category = category;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { summary: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
        ];
      }
      const articles = await ArticleModel.find(filter).sort({ createdAt: -1 });
      return NextResponse.json(articles);
    }
  } catch (err) {}

  let filtered = [...initialArticles];
  if (category && category !== 'all') {
    filtered = filtered.filter(a => a.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q)
    );
  }
  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await connectToDatabase();
    if (db) {
      const created = await ArticleModel.create(body);
      return NextResponse.json(created, { status: 201 });
    }
    const mock = { ...body, _id: `art-${Date.now()}` };
    return NextResponse.json(mock, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
