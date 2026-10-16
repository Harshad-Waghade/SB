import { Router } from 'express';
import {
  getReviews,
  createReview,
  voteHelpful,
  replyToReview
} from '../controllers/reviewController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/:listingType/:listingId', getReviews);
router.post('/', authenticate, createReview);
router.post('/:id/vote', authenticate, voteHelpful);
router.post('/:id/reply', authenticate, replyToReview);

export default router;
