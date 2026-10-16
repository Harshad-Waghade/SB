import { Router } from 'express';
import {
  createAgreement,
  getAgreementById,
  getMyAgreements,
  signAgreement
} from '../controllers/agreementController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, createAgreement);
router.get('/my', authenticate, getMyAgreements);
router.get('/:id', authenticate, getAgreementById);
router.post('/:id/sign', authenticate, signAgreement);

export default router;
