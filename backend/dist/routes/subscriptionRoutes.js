"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptionController_1 = require("../controllers/subscriptionController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/plans', subscriptionController_1.getSubscriptionPlans);
router.get('/my', auth_1.authenticate, subscriptionController_1.getMySubscription);
router.post('/subscribe', auth_1.authenticate, subscriptionController_1.subscribePlan);
exports.default = router;
//# sourceMappingURL=subscriptionRoutes.js.map