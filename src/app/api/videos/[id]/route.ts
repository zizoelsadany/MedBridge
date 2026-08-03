import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import VideoModel from '@/models/Video';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await connectToDatabase();
    const { id } = await params;
    if (db) {
      await VideoModel.findByIdAndDelete(id);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: true }); // fallback if no DB
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
