import { Router } from 'express';
import {
  createEnquiry,
  getMyEnquiries,
  updateEnquiryStatus
} from '../controllers/enquiryController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, createEnquiry);
router.get('/my', authenticate, getMyEnquiries);
router.put('/:id/status', authenticate, updateEnquiryStatus);

export default router;
