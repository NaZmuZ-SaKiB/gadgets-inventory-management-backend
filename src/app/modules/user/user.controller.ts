import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createToken } from '../../utils/token';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import { USER_ROLE } from './user.constant';
import { UserService } from './user.service';

const isUserLoggedIn = catchAsync(async (req, res) => {
  const user = await User.findById(req.user?.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in.',
    data: user,
  });
});

const signup = catchAsync(async (req, res) => {
  await User.create(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Signup successful.',
    data: null,
  });
});

const signin = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.body?.email }).select(
    '+password',
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  const isCorrectPassword = await bcrypt.compare(
    req.body?.password,
    user.password,
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid Password.');
  }

  const token = createToken(
    user._id.toString(),
    user.role,
    user.email,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  res.cookie('jwt', token, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'none', // ! uncomment on production
  });

  user.password = '';

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Signin successful.',
    data: user,
  });
});

const logout = catchAsync((req, res) => {
  // Sets empty token
  res.cookie('jwt', '', {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'none',
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged out.',
    data: null,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params?.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User fetched.',
    data: user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  if (req.user?.id !== req.params?.id) {
    if (req.user?.role === 'user') {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not allowed to update this user',
      );
    }
  }

  const user = await User.findByIdAndUpdate(req.params?.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Updated',
    data: user,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  // handling serch
  const searchQuery = User.find({
    $or: ['name', 'email'].map((field) => ({
      [field]: { $regex: req.query?.search ?? '', $options: 'i' },
    })),
  });

  // Getts filter for counting documents
  const querycount = searchQuery.getFilter();

  // pagination
  const page = Number(req.query?.page) || 1;
  const limit = Number(req.query?.limit) || 10;
  const skip = (page - 1) * limit;

  // Sorting
  let sort: string = '-createdAt';
  if (req.query?.sort) sort = req.query.sort as string;

  const users = await searchQuery
    .find({ role: { $ne: USER_ROLE.ADMIN } })
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(querycount);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users fetched.',
    data: {
      users,
      total,
    },
  });
});

const assignManager = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select('role');

  await User.findByIdAndUpdate(
    userId,
    {
      role: user?.role === 'user' ? USER_ROLE.MANAGER : USER_ROLE.USER,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Manager assigned',
    data: null,
  });
});

const getDashboardChartsData = catchAsync(async (req, res) => {
  const chartsData = await UserService.getDashboardChartsData();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Charts data fetched.',
    data: chartsData,
  });
});

export const UserController = {
  signup,
  signin,
  isUserLoggedIn,
  logout,
  getAllUsers,
  assignManager,
  updateUser,
  getDashboardChartsData,
  getUserById,
};
