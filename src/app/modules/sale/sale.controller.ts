/* eslint-disable @typescript-eslint/no-explicit-any */
import { startSession } from 'mongoose';
import catchAsync from '../../utils/catchAsync';
import { Sale } from './sale.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Product } from '../product/product.model';
import sendResponse from '../../utils/sendResponse';
import { generateSalesQuery } from './sale.query';

const createSale = catchAsync(async (req, res) => {
  const session = await startSession();

  try {
    session.startTransaction();
    const sale = await Sale.create(req.body);

    if (!sale) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create sale.',
      );
    }

    const product = await Product.findByIdAndUpdate(
      req.body?.product,
      {
        $inc: { quantity: -req.body.quantity },
      },
      { new: true },
    );

    if (!product) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create sale.',
      );
    }

    await session.commitTransaction();
    await session.endSession();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Sale created.',
      data: sale,
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create sale.',
    );
  }
});

const getAllSales = catchAsync(async (req, res) => {
  const { mainQuery, skip, limit, sort } = generateSalesQuery(req.query);
  const sales = await Sale.find(mainQuery)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('product');

  const total = await Sale.countDocuments(mainQuery);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Fetched all sales',
    data: { sales, total },
  });
});

export const SaleController = {
  createSale,
  getAllSales,
};
