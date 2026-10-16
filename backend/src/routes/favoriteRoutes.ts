import { Router } from 'express';
import { toggleFavorite, getMyFavorites } from '../controllers/favoriteController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/toggle', authenticate, toggleFavorite);
router.get('/my', authenticate, getMyFavorites);

export default router;
