"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomController_1 = require("../controllers/roomController");
const auth_1 = require("../middlewares/auth");
const role_1 = require("../middlewares/role");
const router = (0, express_1.Router)();
router.get('/', roomController_1.getRooms);
router.get('/featured', roomController_1.getFeaturedRooms);
router.get('/owner-listings', auth_1.authenticate, role_1.requireOwner, roomController_1.getOwnerRooms);
router.get('/:id', roomController_1.getRoomById);
router.post('/', auth_1.authenticate, role_1.requireOwner, roomController_1.createRoom);
router.put('/:id', auth_1.authenticate, role_1.requireOwner, roomController_1.updateRoom);
router.delete('/:id', auth_1.authenticate, role_1.requireOwner, roomController_1.deleteRoom);
exports.default = router;
//# sourceMappingURL=roomRoutes.js.map