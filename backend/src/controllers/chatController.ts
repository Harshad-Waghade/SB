import { Response } from 'express';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { AuthRequest } from '../middlewares/auth';
import mongoose from 'mongoose';

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'name email phone avatar role isVerified')
      .sort({ updatedAt: -1 });

    res.json({ success: true, data: conversations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const startConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { recipientId, listingType, listingId } = req.body;
    if (!recipientId) {
      res.status(400).json({ success: false, message: 'Recipient ID is required' });
      return;
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
      ...(listingId ? { listingId } : {})
    }).populate('participants', 'name email phone avatar role isVerified');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId],
        listingType,
        listingId,
        unreadCounts: {}
      });
      conversation = await conversation.populate('participants', 'name email phone avatar role isVerified');
    }

    res.json({ success: true, data: conversation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .populate('senderId', 'name avatar role')
      .sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { conversationId, recipientId: req.user._id, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    res.json({ success: true, data: messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { conversationId } = req.params;
    const { text, mediaUrl, messageType, metadata, recipientId } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({ success: false, message: 'Conversation not found.' });
      return;
    }

    const otherParticipant = conversation.participants.find(
      (p) => p.toString() !== req.user?._id.toString()
    );

    const targetRecipient = recipientId || otherParticipant;

    const message = await Message.create({
      conversationId,
      senderId: req.user._id,
      recipientId: targetRecipient,
      text: text || '',
      mediaUrl,
      messageType: messageType || 'text',
      metadata
    });

    conversation.lastMessage = {
      text: text || (messageType === 'image' ? '📷 Image' : '📎 Attachment'),
      senderId: req.user._id,
      createdAt: new Date()
    };
    await conversation.save();

    res.status(201).json({ success: true, data: message });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
