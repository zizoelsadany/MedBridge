import mongoose, { Schema, Document } from 'mongoose';

export interface ITerm extends Document {
  term: string;
  phonetic?: string;
  meaning: string;
  description: string;
  category: string;
  relatedTerms: string[];
}

const TermSchema: Schema = new Schema(
  {
    term: { type: String, required: true },
    phonetic: { type: String },
    meaning: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    relatedTerms: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Term || mongoose.model<ITerm>('Term', TermSchema);
