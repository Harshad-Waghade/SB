"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middlewares/auth");
const role_1 = require("../middlewares/role");
const router = (0, express_1.Router)();
// Protect all admin routes with authentication and requireAdmin
router.use(auth_1.authenticate, role_1.requireAdmin);
router.get('/stats', adminController_1.getAdminStats);
router.get('/users', adminController_1.getAdminUsers);
router.put('/users/:id/status', adminController_1.updateUserStatus);
router.get('/listings/pending', adminController_1.getPendingListings);
router.post('/listings/review', adminController_1.reviewListing);
router.get('/deals', adminController_1.getAdminDeals);
router.get('/payments', adminController_1.getAdminPayments);
router.get('/reports', adminController_1.getAdminReports);
router.put('/reports/:id', adminController_1.updateReportStatus);
router.get('/config', adminController_1.getSystemConfig);
router.put('/config', adminController_1.updateSystemConfig);
router.get('/coupons', adminController_1.getCoupons);
router.post('/coupons', adminController_1.createCoupon);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map