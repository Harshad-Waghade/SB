import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ENV } from './env';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    let uri = ENV.MONGODB_URI;

    if (!uri) {
      console.log('⚡ No MONGODB_URI provided in environment. Initializing high-performance embedded MongoDB...');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'staybite_db',
          port: 27777
        }
      });
      uri = mongoMemoryServer.getUri();
      console.log(`✅ Embedded MongoDB initialized at: ${uri}`);
    }

    await mongoose.connect(uri);
    console.log(`🚀 MongoDB Connected Successfully: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
