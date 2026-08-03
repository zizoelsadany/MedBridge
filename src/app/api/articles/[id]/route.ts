import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ArticleModel from '@/models/Article';
import { initialArticles } from '@/lib/mockData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await connectToDatabase();
    const { id } = await params;
    if (db) {
      const article = await ArticleModel.findById(id);
      if (article) return NextResponse.json(article);
    }
  } catch (err) {}

  const { id } = await params;
  const article = initialArticles.find(a => a._id === id);
  if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const db = await connectToDatabase();
    const { id } = await params;
    if (db) {
      const updated = await ArticleModel.findByIdAndUpdate(id, body, { new: true });
      return NextResponse.json(updated);
    }
    return NextResponse.json({ ...body, _id: id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await connectToDatabase();
    const { id } = await params;
    if (db) {
      await ArticleModel.findByIdAndDelete(id);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
