"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favoriteController_1 = require("../controllers/favoriteController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/toggle', auth_1.authenticate, favoriteController_1.toggleFavorite);
router.get('/my', auth_1.authenticate, favoriteController_1.getMyFavorites);
exports.default = router;
//# sourceMappingURL=favoriteRoutes.js.map