"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enquiryController_1 = require("../controllers/enquiryController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticate, enquiryController_1.createEnquiry);
router.get('/my', auth_1.authenticate, enquiryController_1.getMyEnquiries);
router.put('/:id/status', auth_1.authenticate, enquiryController_1.updateEnquiryStatus);
exports.default = router;
//# sourceMappingURL=enquiryRoutes.js.map