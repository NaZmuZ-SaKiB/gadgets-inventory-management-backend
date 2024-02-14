/* eslint-disable @typescript-eslint/no-explicit-any */
import { startSession } from 'mongoose';
import catchAsync from '../../utils/catchAsync';
import { Sale } from './sale.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Product } from '../product/product.model';
import sendResponse from '../../utils/sendResponse';
import { generateSalesQuery } from './sale.query';
import { USER_ROLE } from '../user/user.constant';

const createSale = catchAsync(async (req, res) => {
  const user = req.user;
  const session = await startSession();

  try {
    session.startTransaction();
    const sale = await Sale.create({ ...req.body, soldBy: user.id });

    if (!sale) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create sale.',
      );
    }

    for (const item of req.body!.products) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: { quantity: -item.quantity },
        },
        {
          new: true,
        },
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
  const user = req.user;

  const { mainQuery, skip, limit, sort } = generateSalesQuery(req.query);
  let sales;
  let total;

  if (user.role === USER_ROLE.USER) {
    sales = await Sale.find({ ...mainQuery, soldBy: user.id })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('products');

    total = await Sale.countDocuments({ ...mainQuery, soldBy: user.id });
  } else {
    sales = await Sale.find(mainQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('products');

    total = await Sale.countDocuments(mainQuery);
  }

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
