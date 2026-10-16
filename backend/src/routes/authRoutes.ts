import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  sendOtp,
  verifyOtp
} from '../controllers/authController';
import { authenticate } from '../middlewares/auth';
import { authRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/send-otp', authRateLimiter, sendOtp);
router.post('/verify-otp', authRateLimiter, verifyOtp);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);

export default router;
