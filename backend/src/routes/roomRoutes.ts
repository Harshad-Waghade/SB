import { Router } from 'express';
import {
  getRooms,
  getFeaturedRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getOwnerRooms
} from '../controllers/roomController';
import { authenticate } from '../middlewares/auth';
import { requireOwner } from '../middlewares/role';

const router = Router();

router.get('/', getRooms);
router.get('/featured', getFeaturedRooms);
router.get('/owner-listings', authenticate, requireOwner, getOwnerRooms);
router.get('/:id', getRoomById);
router.post('/', authenticate, requireOwner, createRoom);
router.put('/:id', authenticate, requireOwner, updateRoom);
router.delete('/:id', authenticate, requireOwner, deleteRoom);

export default router;
