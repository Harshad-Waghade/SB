import { Router } from 'express';
import {
  getAdminStats,
  getAdminUsers,
  updateUserStatus,
  getPendingListings,
  reviewListing,
  getAdminDeals,
  getAdminPayments,
  getAdminReports,
  updateReportStatus,
  getSystemConfig,
  updateSystemConfig,
  getCoupons,
  createCoupon
} from '../controllers/adminController';
import { authenticate } from '../middlewares/auth';
import { requireAdmin } from '../middlewares/role';

const router = Router();

// Protect all admin routes with authentication and requireAdmin
router.use(authenticate, requireAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.put('/users/:id/status', updateUserStatus);

router.get('/listings/pending', getPendingListings);
router.post('/listings/review', reviewListing);

router.get('/deals', getAdminDeals);
router.get('/payments', getAdminPayments);

router.get('/reports', getAdminReports);
router.put('/reports/:id', updateReportStatus);

router.get('/config', getSystemConfig);
router.put('/config', updateSystemConfig);

router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);

export default router;
