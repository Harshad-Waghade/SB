"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessages = exports.startConversation = exports.getConversations = void 0;
const Conversation_1 = require("../models/Conversation");
const Message_1 = require("../models/Message");
const getConversations = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const conversations = await Conversation_1.Conversation.find({
            participants: req.user._id
        })
            .populate('participants', 'name email phone avatar role isVerified')
            .sort({ updatedAt: -1 });
        res.json({ success: true, data: conversations });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getConversations = getConversations;
const startConversation = async (req, res) => {
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
        let conversation = await Conversation_1.Conversation.findOne({
            participants: { $all: [req.user._id, recipientId] },
            ...(listingId ? { listingId } : {})
        }).populate('participants', 'name email phone avatar role isVerified');
        if (!conversation) {
            conversation = await Conversation_1.Conversation.create({
                participants: [req.user._id, recipientId],
                listingType,
                listingId,
                unreadCounts: {}
            });
            conversation = await conversation.populate('participants', 'name email phone avatar role isVerified');
        }
        res.json({ success: true, data: conversation });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.startConversation = startConversation;
const getMessages = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { conversationId } = req.params;
        const messages = await Message_1.Message.find({ conversationId })
            .populate('senderId', 'name avatar role')
            .sort({ createdAt: 1 });
        // Mark as read
        await Message_1.Message.updateMany({ conversationId, recipientId: req.user._id, isRead: false }, { $set: { isRead: true, readAt: new Date() } });
        res.json({ success: true, data: messages });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMessages = getMessages;
const sendMessage = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { conversationId } = req.params;
        const { text, mediaUrl, messageType, metadata, recipientId } = req.body;
        const conversation = await Conversation_1.Conversation.findById(conversationId);
        if (!conversation) {
            res.status(404).json({ success: false, message: 'Conversation not found.' });
            return;
        }
        const otherParticipant = conversation.participants.find((p) => p.toString() !== req.user?._id.toString());
        const targetRecipient = recipientId || otherParticipant;
        const message = await Message_1.Message.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.sendMessage = sendMessage;
//# sourceMappingURL=chatController.js.map