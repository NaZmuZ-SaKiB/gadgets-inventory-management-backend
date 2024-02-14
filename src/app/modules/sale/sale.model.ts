import { Schema, model } from 'mongoose';
import { TSale } from './sale.interface';

const saleSchema = new Schema<TSale>(
  {
    buyerName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfSale: {
      type: Date,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: Number,
        price: Number,
        _id: false,
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  },
);

saleSchema.virtual('total').get(function () {
  return this.products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
});

export const Sale = model<TSale>('Sale', saleSchema);
