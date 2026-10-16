"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCoupon = exports.getCoupons = exports.updateSystemConfig = exports.getSystemConfig = exports.updateReportStatus = exports.getAdminReports = exports.getAdminPayments = exports.getAdminDeals = exports.reviewListing = exports.getPendingListings = exports.updateUserStatus = exports.getAdminUsers = exports.getAdminStats = void 0;
const User_1 = require("../models/User");
const RoomListing_1 = require("../models/RoomListing");
const MessListing_1 = require("../models/MessListing");
const Deal_1 = require("../models/Deal");
const Agreement_1 = require("../models/Agreement");
const Payment_1 = require("../models/Payment");
const Report_1 = require("../models/Report");
const SupportTicket_1 = require("../models/SupportTicket");
const Coupon_1 = require("../models/Coupon");
const SystemConfig_1 = require("../models/SystemConfig");
const Notification_1 = require("../models/Notification");
const getAdminStats = async (_req, res) => {
    try {
        const [totalUsers, studentsCount, employedCount, roomOwnersCount, messOwnersCount, totalRooms, approvedRooms, pendingRooms, totalMesses, approvedMesses, pendingMesses, totalDeals, activeDeals, totalAgreements, payments, pendingReports, openTickets] = await Promise.all([
            User_1.User.countDocuments(),
            User_1.User.countDocuments({ role: 'student' }),
            User_1.User.countDocuments({ role: 'employed' }),
            User_1.User.countDocuments({ role: 'room_owner' }),
            User_1.User.countDocuments({ role: 'mess_owner' }),
            RoomListing_1.RoomListing.countDocuments(),
            RoomListing_1.RoomListing.countDocuments({ status: 'approved' }),
            RoomListing_1.RoomListing.countDocuments({ status: 'pending' }),
            MessListing_1.MessListing.countDocuments(),
            MessListing_1.MessListing.countDocuments({ status: 'approved' }),
            MessListing_1.MessListing.countDocuments({ status: 'pending' }),
            Deal_1.Deal.countDocuments(),
            Deal_1.Deal.countDocuments({ status: { $in: ['negotiating', 'accepted', 'agreement_requested'] } }),
            Agreement_1.Agreement.countDocuments(),
            Payment_1.Payment.find({ status: 'captured' }),
            Report_1.Report.countDocuments({ status: 'pending' }),
            SupportTicket_1.SupportTicket.countDocuments({ status: { $in: ['open', 'in_progress'] } })
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAdminStats = getAdminStats;
const getAdminUsers = async (req, res) => {
    try {
        const { role, isVerified, isBlocked, search, page = '1', limit = '20' } = req.query;
        const filter = {};
        if (role && role !== 'all')
            filter.role = role;
        if (isVerified !== undefined)
            filter.isVerified = isVerified === 'true';
        if (isBlocked !== undefined)
            filter.isBlocked = isBlocked === 'true';
        if (search) {
            const q = search.trim();
            filter.$or = [
                { name: new RegExp(q, 'i') },
                { email: new RegExp(q, 'i') },
                { phone: new RegExp(q, 'i') },
                { referralCode: new RegExp(q, 'i') }
            ];
        }
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 20;
        const skip = (pageNum - 1) * limitNum;
        const [users, total] = await Promise.all([
            User_1.User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
            User_1.User.countDocuments(filter)
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAdminUsers = getAdminUsers;
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isVerified, isBlocked, blockedReason, role } = req.body;
        const user = await User_1.User.findById(id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        if (isVerified !== undefined)
            user.isVerified = Boolean(isVerified);
        if (isBlocked !== undefined) {
            user.isBlocked = Boolean(isBlocked);
            user.blockedReason = blockedReason || undefined;
        }
        if (role)
            user.role = role;
        await user.save();
        res.json({ success: true, message: 'User updated successfully', data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateUserStatus = updateUserStatus;
const getPendingListings = async (_req, res) => {
    try {
        const [pendingRooms, pendingMesses] = await Promise.all([
            RoomListing_1.RoomListing.find({ status: 'pending' }).populate('ownerId', 'name phone email avatar isVerified').sort({ createdAt: -1 }),
            MessListing_1.MessListing.find({ status: 'pending' }).populate('ownerId', 'name phone email avatar isVerified').sort({ createdAt: -1 })
        ]);
        res.json({
            success: true,
            rooms: pendingRooms,
            messes: pendingMesses,
            totalPending: pendingRooms.length + pendingMesses.length
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getPendingListings = getPendingListings;
const reviewListing = async (req, res) => {
    try {
        const { listingType, listingId, action, rejectionReason, adminNotes, isFeatured, verifiedBadge } = req.body;
        if (!listingType || !listingId || !action) {
            res.status(400).json({ success: false, message: 'Listing type, ID, and review action are required.' });
            return;
        }
        // action: 'approve' | 'reject' | 'changes_requested' | 'suspend'
        let newStatus = 'pending';
        if (action === 'approve')
            newStatus = 'approved';
        if (action === 'reject')
            newStatus = 'rejected';
        if (action === 'changes_requested')
            newStatus = 'changes_requested';
        if (action === 'suspend')
            newStatus = 'suspended';
        let updatedListing;
        let ownerId;
        let listingTitle = '';
        const updatePayload = {
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
            updatedListing = await RoomListing_1.RoomListing.findByIdAndUpdate(listingId, { $set: updatePayload }, { new: true });
            if (updatedListing) {
                ownerId = updatedListing.ownerId;
                listingTitle = updatedListing.title;
            }
        }
        else {
            updatedListing = await MessListing_1.MessListing.findByIdAndUpdate(listingId, { $set: updatePayload }, { new: true });
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
            let type = 'listing_approved';
            if (action === 'reject') {
                title = `Listing Rejected: "${listingTitle}"`;
                body = `Your listing was rejected. Reason: ${rejectionReason || 'Does not meet listing guidelines'}.`;
                type = 'listing_rejected';
            }
            else if (action === 'changes_requested') {
                title = `Changes Requested: "${listingTitle}"`;
                body = `Admin requested updates: ${adminNotes || 'Please review information and re-submit'}.`;
            }
            await Notification_1.Notification.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.reviewListing = reviewListing;
const getAdminDeals = async (_req, res) => {
    try {
        const deals = await Deal_1.Deal.find()
            .populate('userId', 'name email phone avatar')
            .populate('ownerId', 'name email phone avatar')
            .populate('agreementId')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: deals });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAdminDeals = getAdminDeals;
const getAdminPayments = async (_req, res) => {
    try {
        const payments = await Payment_1.Payment.find()
            .populate('userId', 'name email phone role')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: payments });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAdminPayments = getAdminPayments;
const getAdminReports = async (_req, res) => {
    try {
        const reports = await Report_1.Report.find()
            .populate('reporterId', 'name email phone')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: reports });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAdminReports = getAdminReports;
const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;
        const report = await Report_1.Report.findByIdAndUpdate(id, {
            status,
            adminNotes,
            resolvedBy: req.user?._id,
            resolvedAt: new Date()
        }, { new: true });
        res.json({ success: true, message: 'Report updated', data: report });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateReportStatus = updateReportStatus;
const getSystemConfig = async (_req, res) => {
    try {
        let config = await SystemConfig_1.SystemConfig.findOne({ configKey: 'global_config' });
        if (!config) {
            config = await SystemConfig_1.SystemConfig.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getSystemConfig = getSystemConfig;
const updateSystemConfig = async (req, res) => {
    try {
        const updated = await SystemConfig_1.SystemConfig.findOneAndUpdate({ configKey: 'global_config' }, { $set: req.body }, { new: true, upsert: true });
        res.json({ success: true, message: 'System configuration updated successfully', data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateSystemConfig = updateSystemConfig;
const getCoupons = async (_req, res) => {
    try {
        const coupons = await Coupon_1.Coupon.find().sort({ createdAt: -1 });
        res.json({ success: true, data: coupons });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCoupons = getCoupons;
const createCoupon = async (req, res) => {
    try {
        const { code, description, discountType, discountValue, maxDiscountAmount, minOrderAmount, validTo, usageLimit, applicableFor } = req.body;
        const coupon = await Coupon_1.Coupon.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createCoupon = createCoupon;
//# sourceMappingURL=adminController.js.map