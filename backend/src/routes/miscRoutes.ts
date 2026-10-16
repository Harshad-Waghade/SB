import { Router } from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createTicket,
  getMyTickets,
  replyTicket,
  createReport,
  getReferralStats
} from '../controllers/miscController';
import { getSystemConfig } from '../controllers/adminController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Notifications
router.get('/notifications', authenticate, getNotifications);
router.put('/notifications/:id/read', authenticate, markNotificationAsRead);
router.put('/notifications/read-all', authenticate, markAllNotificationsAsRead);

// Support Tickets
router.post('/support/tickets', authenticate, createTicket);
router.get('/support/tickets/my', authenticate, getMyTickets);
router.post('/support/tickets/:id/reply', authenticate, replyTicket);

// Reports
router.post('/reports', authenticate, createReport);

// Referrals
router.get('/referrals/stats', authenticate, getReferralStats);

// Public Config (cities, categories, banners)
router.get('/config/public', getSystemConfig);

export default router;
