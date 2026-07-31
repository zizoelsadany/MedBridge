'use client';

import React, { use } from 'react';
import { initialBooks } from '@/lib/mockData';
import { PdfReader } from '@/components/PdfReader';
import { useApp } from '@/context/AppContext';

export default function BookReadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { globalBooks } = useApp();
  const book = globalBooks.find((b: any) => b._id === id) || initialBooks[0];

  return <PdfReader book={book} />;
}
