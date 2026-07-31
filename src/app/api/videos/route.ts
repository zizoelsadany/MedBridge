import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import VideoModel from '@/models/Video';
import { initialVideos } from '@/lib/mockData';

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
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      const videos = await VideoModel.find(filter).sort({ createdAt: -1 });
      return NextResponse.json(videos);
    }
  } catch (err) {}

  let filtered = [...initialVideos];
  if (category && category !== 'all') {
    filtered = filtered.filter(v => v.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q)
    );
  }
  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await connectToDatabase();
    if (db) {
      const created = await VideoModel.create(body);
      return NextResponse.json(created, { status: 201 });
    }
    const mock = { ...body, _id: `vid-${Date.now()}` };
    return NextResponse.json(mock, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
