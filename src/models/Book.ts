import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  category: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  pages: number;
  language: string;
  year: number;
  fileSize: string;
  downloads: number;
  views: number;
  rating: number;
  ratingCount: number;
  isFeatured?: boolean;
  tableOfContents?: string[];
  isbn?: string;
  publisher?: string;
}

const BookSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    pages: { type: Number, required: true },
    language: { type: String, default: 'English' },
    year: { type: Number, required: true },
    fileSize: { type: String, default: '10 MB' },
    downloads: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 1 },
    isFeatured: { type: Boolean, default: false },
    tableOfContents: [{ type: String }],
    isbn: { type: String },
    publisher: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
