import jwt from 'jsonwebtoken';

export const createToken = (
  userId: string,
  role: string,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(
    {
      userId,
      role,
    },
    secret,
    {
      expiresIn,
    },
  );
};
