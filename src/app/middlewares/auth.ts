import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import config from '../config';
import { User } from '../modules/user/user.model';
import AppError from '../errors/AppError';
import { TUserRole } from '../modules/user/user.interface';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not logged in.');
    }

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Invalid token. May be expired.',
      );
    }

    const isUser = await User.findById(decoded.id);

    if (!isUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (
      requiredRoles &&
      requiredRoles.length > 0 &&
      !requiredRoles.includes(decoded.role)
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized.');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
