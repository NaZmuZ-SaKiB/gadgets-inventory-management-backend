import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Brand } from './brand.model';
import AppError from '../../errors/AppError';

const createBrand = catchAsync(async (req, res) => {
  const isBrand = await Brand.findOne({ name: req.body?.name?.toUpperCase() });

  if (isBrand) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Brand : ${req.body?.name} already exists.`,
    );
  }

  const brand = await Brand.create({ name: req.body?.name?.toUpperCase() });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Brand Created.',
    data: brand,
  });
});

const updateBrand = catchAsync(async (req, res) => {
  const isBrand = await Brand.findOne({ name: req.body?.name?.toUpperCase() });

  if (isBrand) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Brand : ${req.body?.name} already exists.`,
    );
  }

  const brand = await Brand.findByIdAndUpdate(
    req.params?.id,
    {
      name: req.body?.name?.toUpperCase(),
    },
    { new: true },
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brand updated.',
    data: brand,
  });
});

const getAllBrands = catchAsync(async (req, res) => {
  const brands = await Brand.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'brand',
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
    message: 'Fetched all brands.',
    data: brands,
  });
});

export const BrandController = {
  createBrand,
  getAllBrands,
  updateBrand,
};
