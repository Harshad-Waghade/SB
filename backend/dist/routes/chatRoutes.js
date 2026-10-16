"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/conversations', auth_1.authenticate, chatController_1.getConversations);
router.post('/start', auth_1.authenticate, chatController_1.startConversation);
router.get('/conversations/:conversationId/messages', auth_1.authenticate, chatController_1.getMessages);
router.post('/conversations/:conversationId/messages', auth_1.authenticate, chatController_1.sendMessage);
exports.default = router;
//# sourceMappingURL=chatRoutes.js.map