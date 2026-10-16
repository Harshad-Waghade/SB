import { Router } from 'express';
import {
  getMesses,
  getFeaturedMesses,
  getMessById,
  createMess,
  updateMess,
  deleteMess,
  getOwnerMesses
} from '../controllers/messController';
import { authenticate } from '../middlewares/auth';
import { requireOwner } from '../middlewares/role';

const router = Router();

router.get('/', getMesses);
router.get('/featured', getFeaturedMesses);
router.get('/owner-listings', authenticate, requireOwner, getOwnerMesses);
router.get('/:id', getMessById);
router.post('/', authenticate, requireOwner, createMess);
router.put('/:id', authenticate, requireOwner, updateMess);
router.delete('/:id', authenticate, requireOwner, deleteMess);

export default router;
