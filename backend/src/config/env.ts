import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'staybite_super_secret_jwt_key_987654321',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_staybite12345',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'staybite_razorpay_secret_key',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@staybite.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@StayBite2025!',
  ADMIN_PHONE: process.env.ADMIN_PHONE || '+919876543210'
};
