"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
exports.ENV = {
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
//# sourceMappingURL=env.js.map