import { Router } from 'express';
import {
  createOrder,
  verifyPayment,
  getMyPayments,
  validateCoupon
} from '../controllers/paymentController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/create-order', authenticate, createOrder);
router.post('/verify', authenticate, verifyPayment);
router.get('/my', authenticate, getMyPayments);
router.post('/validate-coupon', validateCoupon);

export default router;
