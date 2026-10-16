"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messController_1 = require("../controllers/messController");
const auth_1 = require("../middlewares/auth");
const role_1 = require("../middlewares/role");
const router = (0, express_1.Router)();
router.get('/', messController_1.getMesses);
router.get('/featured', messController_1.getFeaturedMesses);
router.get('/owner-listings', auth_1.authenticate, role_1.requireOwner, messController_1.getOwnerMesses);
router.get('/:id', messController_1.getMessById);
router.post('/', auth_1.authenticate, role_1.requireOwner, messController_1.createMess);
router.put('/:id', auth_1.authenticate, role_1.requireOwner, messController_1.updateMess);
router.delete('/:id', auth_1.authenticate, role_1.requireOwner, messController_1.deleteMess);
exports.default = router;
//# sourceMappingURL=messRoutes.js.map