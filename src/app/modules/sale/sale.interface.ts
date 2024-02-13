import { Types } from 'mongoose';

export type TSale = {
  buyerName: string;
  dateOfSale: Date;
  products: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
};
