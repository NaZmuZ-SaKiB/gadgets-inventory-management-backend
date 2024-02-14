import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createToken } from '../../utils/token';
import { User } from './user.model';
import AppError from '../../errors/AppError';

const isUserLoggedIn = catchAsync((req, res) => {
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in.',
    data: null,
  });
});

const signup = catchAsync(async (req, res) => {
  const user = await User.create(req.body);

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
    // sameSite: 'none', // ! uncomment on production
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Signup successful.',
    data: user,
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
    // sameSite: 'none', // ! uncomment on production
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

export const UserController = {
  signup,
  signin,
  isUserLoggedIn,
  logout,
};
