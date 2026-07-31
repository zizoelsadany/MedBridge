import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  author: string;
  authorTitle?: string;
  authorAvatar?: string;
  category: string;
  summary: string;
  content: string;
  coverImage: string;
  readTimeMinutes: number;
  views: number;
  rating: number;
  ratingCount: number;
  isFeatured?: boolean;
  tags?: string[];
}

const ArticleSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    authorTitle: { type: String },
    authorAvatar: { type: String },
    category: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    readTimeMinutes: { type: Number, default: 5 },
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 1 },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);
