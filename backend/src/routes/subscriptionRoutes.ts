import { Router } from 'express';
import {
  getSubscriptionPlans,
  getMySubscription,
  subscribePlan
} from '../controllers/subscriptionController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/plans', getSubscriptionPlans);
router.get('/my', authenticate, getMySubscription);
router.post('/subscribe', authenticate, subscribePlan);

export default router;
