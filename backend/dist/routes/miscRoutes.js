"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const miscController_1 = require("../controllers/miscController");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Notifications
router.get('/notifications', auth_1.authenticate, miscController_1.getNotifications);
router.put('/notifications/:id/read', auth_1.authenticate, miscController_1.markNotificationAsRead);
router.put('/notifications/read-all', auth_1.authenticate, miscController_1.markAllNotificationsAsRead);
// Support Tickets
router.post('/support/tickets', auth_1.authenticate, miscController_1.createTicket);
router.get('/support/tickets/my', auth_1.authenticate, miscController_1.getMyTickets);
router.post('/support/tickets/:id/reply', auth_1.authenticate, miscController_1.replyTicket);
// Reports
router.post('/reports', auth_1.authenticate, miscController_1.createReport);
// Referrals
router.get('/referrals/stats', auth_1.authenticate, miscController_1.getReferralStats);
// Public Config (cities, categories, banners)
router.get('/config/public', adminController_1.getSystemConfig);
exports.default = router;
//# sourceMappingURL=miscRoutes.js.map