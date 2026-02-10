import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || 3001,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN || '30d',
};

