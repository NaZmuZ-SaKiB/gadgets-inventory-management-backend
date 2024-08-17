import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

import { TUser } from './user.interface';
import config from '../../config';
import { userRoles } from './user.constant';

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    dateOfBirth: String,
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    phone: String,
    permanentAddress: String,
    presentAddress: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationShip: String,
    },
    employmentStatus: {
      type: String,
      enum: ['full-time', 'part-time'],
    },
    workLocation: {
      type: String,
      enum: ['on-site', 'remote'],
    },
    employeeType: {
      type: String,
      enum: ['permanent', 'temporary', 'intern'],
    },
    salary: Number,
    joiningDate: String,
    image: String,
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: userRoles,
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

userSchema.post('save', async function (doc, next) {
  doc.password = '';

  next();
});

export const User = model<TUser>('User', userSchema);
