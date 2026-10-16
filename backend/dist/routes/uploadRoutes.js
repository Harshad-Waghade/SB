"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadController_1 = require("../controllers/uploadController");
const upload_1 = require("../middlewares/upload");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticate, upload_1.upload.single('file'), uploadController_1.uploadSingle);
router.post('/multiple', auth_1.authenticate, upload_1.upload.array('files', 10), uploadController_1.uploadMultiple);
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map