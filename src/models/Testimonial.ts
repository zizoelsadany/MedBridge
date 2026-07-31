import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role: string;
  institution?: string;
  content: string;
  rating: number;
  approved: boolean;
  avatar?: string;
}

const TestimonialSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    institution: { type: String },
    content: { type: String, required: true },
    rating: { type: Number, default: 5 },
    approved: { type: Boolean, default: false },
    avatar: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
