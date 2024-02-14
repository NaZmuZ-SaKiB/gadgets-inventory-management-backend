import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Product } from './product.model';
import AppError from '../../errors/AppError';
import { generateProductQuery } from './product.query';
import { USER_ROLE } from '../user/user.constant';

const createProduct = catchAsync(async (req, res) => {
  const user = req.user;

  const isProduct = await Product.findOne({
    name: req.body?.name,
    model: req.body?.model,
  });

  // Can not sale multiple product with both same name and same model
  if (isProduct) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Product: ${req.body?.name} with model ${req.body?.model} already exits. Just update the quantity.`,
    );
  }

  const product = await Product.create({ ...req.body, addedBy: user.id });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Product Created.',
    data: product,
  });
});

const getProductById = catchAsync(async (req, res) => {
  const user = req.user;

  const product = await Product.findById(req.params?.id);

  if (user.role === USER_ROLE.USER && product?.addedBy.toString() !== user.id) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You can not view products added by different person.',
    );
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product fetched.',
    data: product,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const user = req.user;

  const isProduct = await Product.findById(req.params?.id).select('_id');

  if (
    user.role === USER_ROLE.USER &&
    isProduct?.addedBy.toString() !== user.id
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You can not update products added by different person.',
    );
  }

  const product = await Product.findByIdAndUpdate(req.params?.id, req.body, {
    new: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product Updated.',
    data: product,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const user = req.user;

  // handling serch
  const searchQuery = Product.find({
    $or: ['name', 'model', 'description'].map((field) => ({
      [field]: { $regex: req.query?.search ?? '', $options: 'i' },
    })),
  });

  // Generates query for mongodb
  const { mainQuery, limit, sort, skip } = generateProductQuery(req.query);

  // Getts filter for counting documents
  const querycount = searchQuery.getFilter();

  let products;
  let total;

  if (user.role === USER_ROLE.USER) {
    products = await searchQuery
      .find({ ...mainQuery, addedBy: user.id })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    total = await Product.countDocuments({ ...mainQuery, addedBy: user.id });
  } else {
    products = await searchQuery
      .find(mainQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    total = await Product.countDocuments(querycount);
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Products fetched.',
    data: {
      products,
      total,
    },
  });
});

const deleteProducts = catchAsync(async (req, res) => {
  const user = req.user;

  const products = await Product.find({
    addedBy: { $in: req.body?.productIds },
  }).select('addedBy');

  products.forEach((product) => {
    if (product.addedBy.toString() !== user.id) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You can not delete products added by other person.',
      );
    }
  });

  await Product.deleteMany({
    _id: { $in: req.body?.productIds },
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product deleted.',
    data: null,
  });
});

const getProductsCount = catchAsync(async (req, res) => {
  let count: number;

  // If quantity === 0 - get out of stock products. Other wise get in-stock products
  if (req.query?.quantity && Number(req.query?.quantity) !== 0) {
    count = await Product.countDocuments({
      quantity: { $gt: 0 },
    });
  } else {
    count = await Product.countDocuments({
      quantity: 0,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'success',
    data: { count },
  });
});

const getProductCountPurchasedThisMonth = catchAsync(async (req, res) => {
  const count = await Product.countDocuments({
    createdAt: {
      $gte: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'success',
    data: { count },
  });
});

export const ProductController = {
  createProduct,
  updateProduct,
  getAllProducts,
  deleteProducts,
  getProductById,
  getProductsCount,
  getProductCountPurchasedThisMonth,
};
