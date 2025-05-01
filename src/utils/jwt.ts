import jwt, { SignOptions } from 'jsonwebtoken';

const SECRET_KEY = (process.env.JWT_SECRET || 'your-secret-key') as string;
const EXPIRED_IN = (process.env.JWT_EXPIRED_IN || '1d') as string;

export const generateToken = (payload: { id: string }): string => {
  const options: SignOptions = {
    expiresIn: EXPIRED_IN as jwt.SignOptions['expiresIn'],
    algorithm: 'HS256',
  };
  return jwt.sign(payload, SECRET_KEY, options);
};

export const verifyToken = (token: string): object | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as { id: string };
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};
