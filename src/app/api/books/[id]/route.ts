import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import BookModel from '@/models/Book';
import { initialBooks } from '@/lib/mockData';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = await connectToDatabase();
    if (db) {
      const book = await BookModel.findById(id);
      if (book) return NextResponse.json(book);
    }
  } catch (err) {}

  const book = initialBooks.find(b => b._id === id);
  if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  return NextResponse.json(book);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  try {
    const db = await connectToDatabase();
    if (db) {
      const updated = await BookModel.findByIdAndUpdate(id, body, { new: true });
      return NextResponse.json(updated);
    }
  } catch (err) {}
  return NextResponse.json({ ...body, _id: id });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = await connectToDatabase();
    if (db) {
      await BookModel.findByIdAndDelete(id);
    }
  } catch (err) {}
  return NextResponse.json({ success: true });
}
