import { Schema, model } from 'mongoose';
import { TCategory } from './category.interface';

const categorySchema = new Schema<TCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Category = model<TCategory>(
  'Category',
  categorySchema,
  'categories',
);
