import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import TermModel from '@/models/Term';
import { initialDictionary } from '@/lib/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('q');
  const letter = searchParams.get('letter');

  try {
    const db = await connectToDatabase();
    if (db) {
      const filter: any = {};
      if (letter) filter.term = { $regex: `^${letter}`, $options: 'i' };
      if (search) {
        filter.$or = [
          { term: { $regex: search, $options: 'i' } },
          { meaning: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      const terms = await TermModel.find(filter).sort({ term: 1 });
      return NextResponse.json(terms);
    }
  } catch (err) {}

  let filtered = [...initialDictionary];
  if (letter) {
    filtered = filtered.filter(t => t.term.toLowerCase().startsWith(letter.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(t =>
      t.term.toLowerCase().includes(q) ||
      t.meaning.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  }
  return NextResponse.json(filtered);
}
