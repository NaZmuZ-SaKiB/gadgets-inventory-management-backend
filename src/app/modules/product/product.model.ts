import { Schema, model } from 'mongoose';
import { TProduct } from './product.interface';
import {
  compatibilities,
  connectivities,
  operatingSystems,
  powerSources,
} from './product.constants';

const productSchema = new Schema<TProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imgUrl: {
      type: String,
      trim: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Brand',
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    operatingSystem: {
      type: String,
      enum: [...operatingSystems],
    },
    connectivity: [
      {
        type: String,
        enum: [...connectivities],
      },
    ],
    weight: {
      type: Number,
    },
    powerSource: {
      type: String,
      enum: [...powerSources],
    },
    camera: {
      type: Number,
    },
    displaySize: {
      type: Number,
    },
    compatibility: [
      {
        type: String,
        enum: [...compatibilities],
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Product = model<TProduct>('Product', productSchema);
