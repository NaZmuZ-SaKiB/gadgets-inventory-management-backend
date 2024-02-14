import { Types } from 'mongoose';

export type TSale = {
  buyerName: string;
  contactNo: string;
  dateOfSale: Date;
  soldBy: Types.ObjectId;
  products: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
};
