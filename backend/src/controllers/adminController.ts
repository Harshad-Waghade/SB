import { Response, Request } from 'express';
import { User } from '../models/User';
import { RoomListing } from '../models/RoomListing';
import { MessListing } from '../models/MessListing';
import { Deal } from '../models/Deal';
import { Agreement } from '../models/Agreement';
import { Payment } from '../models/Payment';
import { Subscription } from '../models/Subscription';
import { Report } from '../models/Report';
import { SupportTicket } from '../models/SupportTicket';
import { Coupon } from '../models/Coupon';
import { SystemConfig } from '../models/SystemConfig';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middlewares/auth';

export const getAdminStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      studentsCount,
      employedCount,
      roomOwnersCount,
      messOwnersCount,
      totalRooms,
      approvedRooms,
      pendingRooms,
      totalMesses,
      approvedMesses,
      pendingMesses,
      totalDeals,
      activeDeals,
      totalAgreements,
      payments,
      pendingReports,
      openTickets
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'employed' }),
      User.countDocuments({ role: 'room_owner' }),
      User.countDocuments({ role: 'mess_owner' }),
      RoomListing.countDocuments(),
      RoomListing.countDocuments({ status: 'approved' }),
      RoomListing.countDocuments({ status: 'pending' }),
      MessListing.countDocuments(),
      MessListing.countDocuments({ status: 'approved' }),
      MessListing.countDocuments({ status: 'pending' }),
      Deal.countDocuments(),
      Deal.countDocuments({ status: { $in: ['negotiating', 'accepted', 'agreement_requested'] } }),
      Agreement.countDocuments(),
      Payment.find({ status: 'captured' }),
      Report.countDocuments({ status: 'pending' }),
      SupportTicket.countDocuments({ status: { $in: ['open', 'in_progress'] } })
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const subscriptionRevenue = payments
      .filter((p) => p.purpose === 'subscription')
      .reduce((sum, p) => sum + p.amount, 0);
    const featuredRevenue = payments
      .filter((p) => p.purpose === 'featured_listing')
      .reduce((sum, p) => sum + p.amount, 0);
    const agreementRevenue = payments
      .filter((p) => p.purpose === 'agreement_service')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          students: studentsCount,
          employed: employedCount,
          roomOwners: roomOwnersCount,
          messOwners: messOwnersCount
        },
        listings: {
          totalRooms,
          approvedRooms,
          pendingRooms,
          totalMesses,
          approvedMesses,
          pendingMesses,
          totalPending: pendingRooms + pendingMesses
        },
        deals: {
          total: totalDeals,
          active: activeDeals,
          agreements: totalAgreements
        },
        revenue: {
          total: totalRevenue,
          subscription: subscriptionRevenue,
          featured: featuredRevenue,
          agreements: agreementRevenue,
          transactionCount: payments.length
        },
        moderation: {
          pendingReports,
          openTickets
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, isVerified, isBlocked, search, page = '1', limit = '20' } = req.query;

    const filter: any = {};
    if (role && role !== 'all') filter.role = role;
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
    if (isBlocked !== undefined) filter.isBlocked = isBlocked === 'true';
    if (search) {
      const q = (search as string).trim();
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
        { phone: new RegExp(q, 'i') },
        { referralCode: new RegExp(q, 'i') }
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isVerified, isBlocked, blockedReason, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (isVerified !== undefined) user.isVerified = Boolean(isVerified);
    if (isBlocked !== undefined) {
      user.isBlocked = Boolean(isBlocked);
      user.blockedReason = blockedReason || undefined;
    }
    if (role) user.role = role;

    await user.save();

    res.json({ success: true, message: 'User updated successfully', data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPendingListings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [pendingRooms, pendingMesses] = await Promise.all([
      RoomListing.find({ status: 'pending' }).populate('ownerId', 'name phone email avatar isVerified').sort({ createdAt: -1 }),
      MessListing.find({ status: 'pending' }).populate('ownerId', 'name phone email avatar isVerified').sort({ createdAt: -1 })
    ]);

    res.json({
      success: true,
      rooms: pendingRooms,
      messes: pendingMesses,
      totalPending: pendingRooms.length + pendingMesses.length
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reviewListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { listingType, listingId, action, rejectionReason, adminNotes, isFeatured, verifiedBadge } = req.body;

    if (!listingType || !listingId || !action) {
      res.status(400).json({ success: false, message: 'Listing type, ID, and review action are required.' });
      return;
    }

    // action: 'approve' | 'reject' | 'changes_requested' | 'suspend'
    let newStatus: any = 'pending';
    if (action === 'approve') newStatus = 'approved';
    if (action === 'reject') newStatus = 'rejected';
    if (action === 'changes_requested') newStatus = 'changes_requested';
    if (action === 'suspend') newStatus = 'suspended';

    let updatedListing: any;
    let ownerId: any;
    let listingTitle = '';

    const updatePayload: any = {
      status: newStatus,
      rejectionReason: rejectionReason || undefined,
      adminNotes: adminNotes || undefined
    };

    if (action === 'approve') {
      updatePayload.verifiedBadge = true;
    }

    if (isFeatured !== undefined) {
      updatePayload.isFeatured = Boolean(isFeatured);
    }
    if (verifiedBadge !== undefined) {
      updatePayload.verifiedBadge = Boolean(verifiedBadge);
    }

    if (listingType === 'room') {
      updatedListing = await RoomListing.findByIdAndUpdate(listingId, { $set: updatePayload }, { new: true });
      if (updatedListing) {
        ownerId = updatedListing.ownerId;
        listingTitle = updatedListing.title;
      }
    } else {
      updatedListing = await MessListing.findByIdAndUpdate(listingId, { $set: updatePayload }, { new: true });
      if (updatedListing) {
        ownerId = updatedListing.ownerId;
        listingTitle = updatedListing.name;
      }
    }

    if (!updatedListing) {
      res.status(404).json({ success: false, message: 'Listing not found' });
      return;
    }

    // Send Notification to Owner
    if (ownerId) {
      let title = `Listing Approved: "${listingTitle}"`;
      let body = `Congratulations! Your listing is now LIVE on StayBite with the Verified badge.`;
      let type: any = 'listing_approved';

      if (action === 'reject') {
        title = `Listing Rejected: "${listingTitle}"`;
        body = `Your listing was rejected. Reason: ${rejectionReason || 'Does not meet listing guidelines'}.`;
        type = 'listing_rejected';
      } else if (action === 'changes_requested') {
        title = `Changes Requested: "${listingTitle}"`;
        body = `Admin requested updates: ${adminNotes || 'Please review information and re-submit'}.`;
      }

      await Notification.create({
        userId: ownerId,
        title,
        body,
        type,
        link: '/owner/listings'
      });
    }

    res.json({
      success: true,
      message: `Listing ${newStatus.toUpperCase()} successfully!`,
      data: updatedListing
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminDeals = async (_req: Request, res: Response): Promise<void> => {
  try {
    const deals = await Deal.find()
      .populate('userId', 'name email phone avatar')
      .populate('ownerId', 'name email phone avatar')
      .populate('agreementId')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: deals });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminPayments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email phone role')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: payments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminReports = async (_req: Request, res: Response): Promise<void> => {
  try {
    const reports = await Report.find()
      .populate('reporterId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reports });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReportStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const report = await Report.findByIdAndUpdate(
      id,
      {
        status,
        adminNotes,
        resolvedBy: req.user?._id,
        resolvedAt: new Date()
      },
      { new: true }
    );

    res.json({ success: true, message: 'Report updated', data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSystemConfig = async (_req: Request, res: Response): Promise<void> => {
  try {
    let config = await SystemConfig.findOne({ configKey: 'global_config' });
    if (!config) {
      config = await SystemConfig.create({
        configKey: 'global_config',
        popularCities: [
          { name: 'Nagpur', state: 'Maharashtra', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80', listingCount: 45, isActive: true },
          { name: 'Pune', state: 'Maharashtra', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80', listingCount: 68, isActive: true },
          { name: 'Mumbai', state: 'Maharashtra', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80', listingCount: 82, isActive: true },
          { name: 'Hyderabad', state: 'Telangana', image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80', listingCount: 39, isActive: true },
          { name: 'Bengaluru', state: 'Karnataka', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80', listingCount: 94, isActive: true }
        ],
        categories: [
          { id: 'rooms', title: 'Single & Shared Rooms', icon: 'Bed', description: 'Affordable private and sharing rooms', isActive: true },
          { id: 'pg', title: 'Paying Guest (PG)', icon: 'Home', description: 'Fully managed PGs with food & laundry', isActive: true },
          { id: 'hostel', title: 'Student Hostels', icon: 'Building', description: 'Hostels near top universities and colleges', isActive: true },
          { id: 'mess', title: 'Daily & Monthly Mess', icon: 'UtensilsCrossed', description: 'Nutritious Veg, Non-Veg & Jain meals', isActive: true },
          { id: 'tiffin', title: 'Home Tiffin Service', icon: 'ShoppingBag', description: 'Fresh hot homemade tiffins delivered to doorstep', isActive: true }
        ],
        bannerAnnouncements: [
          { id: 'b1', title: '🎓 Special Student Monsoon Discount!', description: 'Get ₹500 off on first month agreement using code STUDENT500', linkUrl: '/rooms', isActive: true },
          { id: 'b2', title: '🍱 Free Delivery on Mess Subscriptions', description: 'Subscribe to any verified monthly mess and enjoy 0 delivery fee', linkUrl: '/mess', isActive: true }
        ]
      });
    }

    res.json({ success: true, data: config });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSystemConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await SystemConfig.findOneAndUpdate(
      { configKey: 'global_config' },
      { $set: req.body },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: 'System configuration updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCoupons = async (_req: Request, res: Response): Promise<void> => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, description, discountType, discountValue, maxDiscountAmount, minOrderAmount, validTo, usageLimit, applicableFor } = req.body;

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      description,
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
      minOrderAmount: Number(minOrderAmount || 0),
      validTo: new Date(validTo || Date.now() + 60 * 24 * 60 * 60 * 1000),
      usageLimit: Number(usageLimit || 100),
      applicableFor: applicableFor || ['all']
    });

    res.status(201).json({ success: true, message: 'Coupon created successfully', data: coupon });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
