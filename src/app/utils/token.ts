import jwt from 'jsonwebtoken';

export const createToken = (
  id: string,
  role: string,
  email: string,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(
    {
      id,
      role,
      email,
    },
    secret,
    {
      expiresIn,
    },
  );
};
