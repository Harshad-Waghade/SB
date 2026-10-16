"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dealController_1 = require("../controllers/dealController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticate, dealController_1.createDeal);
router.get('/my', auth_1.authenticate, dealController_1.getMyDeals);
router.put('/:id/status', auth_1.authenticate, dealController_1.updateDealStatus);
exports.default = router;
//# sourceMappingURL=dealRoutes.js.map