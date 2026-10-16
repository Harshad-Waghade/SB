import { Router } from 'express';
import { uploadSingle, uploadMultiple } from '../controllers/uploadController';
import { upload } from '../middlewares/upload';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, upload.single('file'), uploadSingle);
router.post('/multiple', authenticate, upload.array('files', 10), uploadMultiple);

export default router;
