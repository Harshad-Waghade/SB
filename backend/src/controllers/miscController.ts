import { Response, Request } from 'express';
import { Notification } from '../models/Notification';
import { SupportTicket } from '../models/SupportTicket';
import { Report } from '../models/Report';
import { Referral } from '../models/Referral';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/auth';

// --- Notifications ---
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });

    res.json({ success: true, data: notifications, unreadCount });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    await Notification.findOneAndUpdate({ _id: id, userId: req.user._id }, { isRead: true });

    res.json({ success: true, message: 'Marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllNotificationsAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Support Tickets ---
export const createTicket = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const ticket = await SupportTicket.create({
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyTickets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const tickets = await SupportTicket.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, data: tickets });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const replyTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { message, attachments } = req.body;

    const ticket = await SupportTicket.findById(id);
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Reports ---
export const createReport = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const report = await Report.create({
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Referrals ---
export const getReferralStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const referrals = await Referral.find({ referrerId: req.user._id }).populate('refereeId', 'name avatar createdAt');
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
