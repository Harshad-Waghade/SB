"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/create-order', auth_1.authenticate, paymentController_1.createOrder);
router.post('/verify', auth_1.authenticate, paymentController_1.verifyPayment);
router.get('/my', auth_1.authenticate, paymentController_1.getMyPayments);
router.post('/validate-coupon', paymentController_1.validateCoupon);
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map