"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDealStatus = exports.getMyDeals = exports.createDeal = void 0;
const Deal_1 = require("../models/Deal");
const Enquiry_1 = require("../models/Enquiry");
const RoomListing_1 = require("../models/RoomListing");
const MessListing_1 = require("../models/MessListing");
const Notification_1 = require("../models/Notification");
const createDeal = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { enquiryId, userId, listingType, listingId, agreedPrice, agreedDeposit, maintenanceCharges, startDate, durationMonths, notes, needsAgreement } = req.body;
        const dealCode = `SB-DEAL-${Math.floor(100000 + Math.random() * 900000)}`;
        const newDeal = await Deal_1.Deal.create({
            dealCode,
            enquiryId: enquiryId || undefined,
            userId: userId || req.user._id,
            ownerId: req.user.role === 'room_owner' || req.user.role === 'mess_owner' ? req.user._id : req.body.ownerId,
            listingType,
            listingId,
            agreedPrice: Number(agreedPrice),
            agreedDeposit: Number(agreedDeposit || 0),
            maintenanceCharges: Number(maintenanceCharges || 0),
            startDate: new Date(startDate || Date.now()),
            durationMonths: Number(durationMonths || 11),
            notes,
            needsAgreement: Boolean(needsAgreement),
            status: 'accepted'
        });
        if (enquiryId) {
            await Enquiry_1.Enquiry.findByIdAndUpdate(enquiryId, { status: 'converted_to_deal' });
        }
        // Send notifications to both parties
        const targetUserId = req.user.role === 'room_owner' || req.user.role === 'mess_owner' ? userId : req.body.ownerId;
        if (targetUserId) {
            await Notification_1.Notification.create({
                userId: targetUserId,
                title: '🎉 New Deal Finalized!',
                body: `A new deal has been created with code ${dealCode}. Check your deals section.`,
                type: 'deal_accepted',
                link: '/dashboard/deals'
            });
        }
        res.status(201).json({
            success: true,
            message: 'Deal created and finalized successfully!',
            data: newDeal
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createDeal = createDeal;
const getMyDeals = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const isOwner = req.user.role === 'room_owner' || req.user.role === 'mess_owner';
        const filter = isOwner ? { ownerId: req.user._id } : { userId: req.user._id };
        const deals = await Deal_1.Deal.find(filter)
            .populate('userId', 'name email phone avatar')
            .populate('ownerId', 'name email phone avatar')
            .populate('agreementId')
            .sort({ createdAt: -1 });
        const populatedDeals = await Promise.all(deals.map(async (deal) => {
            let listing = null;
            if (deal.listingType === 'room') {
                listing = await RoomListing_1.RoomListing.findById(deal.listingId).select('title rent city locality images address');
            }
            else {
                listing = await MessListing_1.MessListing.findById(deal.listingId).select('name monthlyPrice city locality images address');
            }
            return {
                ...deal.toObject(),
                listing
            };
        }));
        res.json({ success: true, data: populatedDeals });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyDeals = getMyDeals;
const updateDealStatus = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { id } = req.params;
        const { status, cancellationReason, paymentStatus, paidAmount } = req.body;
        const deal = await Deal_1.Deal.findById(id);
        if (!deal) {
            res.status(404).json({ success: false, message: 'Deal not found' });
            return;
        }
        if (status)
            deal.status = status;
        if (cancellationReason)
            deal.cancellationReason = cancellationReason;
        if (paymentStatus)
            deal.paymentStatus = paymentStatus;
        if (paidAmount !== undefined)
            deal.paidAmount = Number(paidAmount);
        if (status === 'completed')
            deal.completedAt = new Date();
        await deal.save();
        res.json({ success: true, message: 'Deal status updated successfully', data: deal });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateDealStatus = updateDealStatus;
//# sourceMappingURL=dealController.js.map