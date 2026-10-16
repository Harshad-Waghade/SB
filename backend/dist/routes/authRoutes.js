"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = (0, express_1.Router)();
router.post('/register', rateLimiter_1.authRateLimiter, authController_1.register);
router.post('/login', rateLimiter_1.authRateLimiter, authController_1.login);
router.post('/send-otp', rateLimiter_1.authRateLimiter, authController_1.sendOtp);
router.post('/verify-otp', rateLimiter_1.authRateLimiter, authController_1.verifyOtp);
router.get('/me', auth_1.authenticate, authController_1.getMe);
router.put('/profile', auth_1.authenticate, authController_1.updateProfile);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map