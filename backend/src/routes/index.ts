import { Router } from 'express';
import authRoutes from './authRoutes';
import roomRoutes from './roomRoutes';
import messRoutes from './messRoutes';
import enquiryRoutes from './enquiryRoutes';
import dealRoutes from './dealRoutes';
import agreementRoutes from './agreementRoutes';
import subscriptionRoutes from './subscriptionRoutes';
import paymentRoutes from './paymentRoutes';
import chatRoutes from './chatRoutes';
import favoriteRoutes from './favoriteRoutes';
import reviewRoutes from './reviewRoutes';
import miscRoutes from './miscRoutes';
import uploadRoutes from './uploadRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/messes', messRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/deals', dealRoutes);
router.use('/agreements', agreementRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/payments', paymentRoutes);
router.use('/chat', chatRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/reviews', reviewRoutes);
router.use('/upload', uploadRoutes);
router.use('/admin', adminRoutes);
router.use('/misc', miscRoutes);
router.use('/', miscRoutes);

export default router;
