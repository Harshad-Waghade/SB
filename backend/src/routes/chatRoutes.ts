import { Router } from 'express';
import {
  getConversations,
  startConversation,
  getMessages,
  sendMessage
} from '../controllers/chatController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/conversations', authenticate, getConversations);
router.post('/start', authenticate, startConversation);
router.get('/conversations/:conversationId/messages', authenticate, getMessages);
router.post('/conversations/:conversationId/messages', authenticate, sendMessage);

export default router;
