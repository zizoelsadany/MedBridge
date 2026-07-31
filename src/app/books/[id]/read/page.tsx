'use client';

import React, { use } from 'react';
import { initialBooks } from '@/lib/mockData';
import { PdfReader } from '@/components/PdfReader';

export default function BookReadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const book = initialBooks.find(b => b._id === id) || initialBooks[0];

  return <PdfReader book={book} />;
}
