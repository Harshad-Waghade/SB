"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReferralStats = exports.createReport = exports.replyTicket = exports.getMyTickets = exports.createTicket = exports.markAllNotificationsAsRead = exports.markNotificationAsRead = exports.getNotifications = void 0;
const Notification_1 = require("../models/Notification");
const SupportTicket_1 = require("../models/SupportTicket");
const Report_1 = require("../models/Report");
const Referral_1 = require("../models/Referral");
// --- Notifications ---
const getNotifications = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const notifications = await Notification_1.Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
        const unreadCount = await Notification_1.Notification.countDocuments({ userId: req.user._id, isRead: false });
        res.json({ success: true, data: notifications, unreadCount });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getNotifications = getNotifications;
const markNotificationAsRead = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { id } = req.params;
        await Notification_1.Notification.findOneAndUpdate({ _id: id, userId: req.user._id }, { isRead: true });
        res.json({ success: true, message: 'Marked as read' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
const markAllNotificationsAsRead = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        await Notification_1.Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
        res.json({ success: true, message: 'All notifications marked as read' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.markAllNotificationsAsRead = markAllNotificationsAsRead;
// --- Support Tickets ---
const createTicket = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { category, subject, description, priority, attachments } = req.body;
        if (!category || !subject || !description) {
            res.status(400).json({ success: false, message: 'Category, subject and description are required.' });
            return;
        }
        const ticketNumber = `TKT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
        const ticket = await SupportTicket_1.SupportTicket.create({
            ticketNumber,
            userId: req.user._id,
            category,
            subject,
            description,
            priority: priority || 'medium',
            attachments: attachments || [],
            responses: [
                {
                    senderId: req.user._id,
                    senderRole: 'user',
                    senderName: req.user.name,
                    message: description,
                    createdAt: new Date()
                }
            ]
        });
        res.status(201).json({
            success: true,
            message: 'Support ticket raised successfully! Support team will respond shortly.',
            data: ticket
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createTicket = createTicket;
const getMyTickets = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const tickets = await SupportTicket_1.SupportTicket.find({ userId: req.user._id }).sort({ updatedAt: -1 });
        res.json({ success: true, data: tickets });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyTickets = getMyTickets;
const replyTicket = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { id } = req.params;
        const { message, attachments } = req.body;
        const ticket = await SupportTicket_1.SupportTicket.findById(id);
        if (!ticket) {
            res.status(404).json({ success: false, message: 'Ticket not found' });
            return;
        }
        ticket.responses.push({
            senderId: req.user._id,
            senderRole: req.user.role === 'admin' ? 'admin' : 'user',
            senderName: req.user.name,
            message,
            attachments: attachments || [],
            createdAt: new Date()
        });
        if (req.user.role === 'admin') {
            ticket.status = 'in_progress';
        }
        await ticket.save();
        res.json({ success: true, message: 'Response added to ticket', data: ticket });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.replyTicket = replyTicket;
// --- Reports ---
const createReport = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { targetType, targetId, reason, description } = req.body;
        if (!targetType || !targetId || !reason || !description) {
            res.status(400).json({ success: false, message: 'All report fields are required.' });
            return;
        }
        const report = await Report_1.Report.create({
            reporterId: req.user._id,
            targetType,
            targetId,
            reason,
            description,
            status: 'pending'
        });
        res.status(201).json({
            success: true,
            message: 'Report submitted. Our trust & safety team will review this listing/user promptly.',
            data: report
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createReport = createReport;
// --- Referrals ---
const getReferralStats = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const referrals = await Referral_1.Referral.find({ referrerId: req.user._id }).populate('refereeId', 'name avatar createdAt');
        const totalEarnings = referrals
            .filter((r) => r.status === 'reward_credited')
            .reduce((sum, r) => sum + r.rewardAmount, 0);
        res.json({
            success: true,
            referralCode: req.user.referralCode,
            totalReferrals: referrals.length,
            rewardedReferrals: referrals.filter((r) => r.status === 'reward_credited').length,
            totalEarnings,
            walletBalance: req.user.walletBalance,
            referrals
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getReferralStats = getReferralStats;
//# sourceMappingURL=miscController.js.map