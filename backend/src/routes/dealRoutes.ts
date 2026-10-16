import { Router } from 'express';
import {
  createDeal,
  getMyDeals,
  updateDealStatus
} from '../controllers/dealController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, createDeal);
router.get('/my', authenticate, getMyDeals);
router.put('/:id/status', authenticate, updateDealStatus);

export default router;
