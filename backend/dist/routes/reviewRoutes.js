"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controllers/reviewController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/:listingType/:listingId', reviewController_1.getReviews);
router.post('/', auth_1.authenticate, reviewController_1.createReview);
router.post('/:id/vote', auth_1.authenticate, reviewController_1.voteHelpful);
router.post('/:id/reply', auth_1.authenticate, reviewController_1.replyToReview);
exports.default = router;
//# sourceMappingURL=reviewRoutes.js.map