"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agreementController_1 = require("../controllers/agreementController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticate, agreementController_1.createAgreement);
router.get('/my', auth_1.authenticate, agreementController_1.getMyAgreements);
router.get('/:id', auth_1.authenticate, agreementController_1.getAgreementById);
router.post('/:id/sign', auth_1.authenticate, agreementController_1.signAgreement);
exports.default = router;
//# sourceMappingURL=agreementRoutes.js.map