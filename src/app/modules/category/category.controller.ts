import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';
import { Category } from './category.model';

const createCategory = catchAsync(async (req, res) => {
  const isCategory = await Category.findOne({
    name: req.body?.name?.toUpperCase(),
  });

  if (isCategory) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Category : ${req.body?.name} already exists.`,
    );
  }

  const category = await Category.create({
    name: req.body?.name?.toUpperCase(),
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Category Created.',
    data: category,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'category',
        as: 'products',
        pipeline: [
          {
            $project: {
              _id: 1,
            },
          },
        ],
      },
    },
    {
      $sort: { updatedAt: -1 },
    },
    {
      $project: {
        name: 1,
        productCount: { $size: '$products' },
      },
    },
  ]);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Fetched all categories.',
    data: categories,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
};
