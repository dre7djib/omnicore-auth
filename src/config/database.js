import pkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
const { PrismaClient } = pkg;
import { env } from './env.js';

let isConnected = false;
let prisma;

export const getPrisma = () => {
  if (!prisma) {
    const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
};

export const connectDatabase = async () => {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  try {
    prisma = getPrisma();
    if (isConnected) {
      return;
    }
    await prisma.$connect();
    isConnected = true;
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection failed', error);
    throw error;
  }
};

