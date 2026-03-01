// ESM default-import of the CJS @omnicore/db package.
// module.exports → omnicoreDb = { getPrisma, connectDB, disconnectDB, prisma (getter) }
import omnicoreDb from '@omnicore/db';

const { getPrisma } = omnicoreDb;

// Re-export getPrisma under the same name so existing service code works unchanged.
export { getPrisma };

let isConnected = false;

export const connectDatabase = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  try {
    if (isConnected) return;
    await getPrisma().$connect();
    isConnected = true;
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection failed', error);
    throw error;
  }
};
