import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ArticleModel from '@/models/Article';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDatabase();
    if (db) {
      await ArticleModel.findByIdAndDelete(params.id);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
