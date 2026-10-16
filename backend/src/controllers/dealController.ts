import { Response } from 'express';
import { Deal } from '../models/Deal';
import { Enquiry } from '../models/Enquiry';
import { RoomListing } from '../models/RoomListing';
import { MessListing } from '../models/MessListing';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middlewares/auth';
import { v4 as uuidv4 } from 'uuid';

export const createDeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      enquiryId,
      userId,
      listingType,
      listingId,
      agreedPrice,
      agreedDeposit,
      maintenanceCharges,
      startDate,
      durationMonths,
      notes,
      needsAgreement
    } = req.body;

    const dealCode = `SB-DEAL-${Math.floor(100000 + Math.random() * 900000)}`;

    const newDeal = await Deal.create({
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
      await Enquiry.findByIdAndUpdate(enquiryId, { status: 'converted_to_deal' });
    }

    // Send notifications to both parties
    const targetUserId = req.user.role === 'room_owner' || req.user.role === 'mess_owner' ? userId : req.body.ownerId;
    if (targetUserId) {
      await Notification.create({
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyDeals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const isOwner = req.user.role === 'room_owner' || req.user.role === 'mess_owner';
    const filter = isOwner ? { ownerId: req.user._id } : { userId: req.user._id };

    const deals = await Deal.find(filter)
      .populate('userId', 'name email phone avatar')
      .populate('ownerId', 'name email phone avatar')
      .populate('agreementId')
      .sort({ createdAt: -1 });

    const populatedDeals = await Promise.all(
      deals.map(async (deal) => {
        let listing: any = null;
        if (deal.listingType === 'room') {
          listing = await RoomListing.findById(deal.listingId).select('title rent city locality images address');
        } else {
          listing = await MessListing.findById(deal.listingId).select('name monthlyPrice city locality images address');
        }
        return {
          ...deal.toObject(),
          listing
        };
      })
    );

    res.json({ success: true, data: populatedDeals });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDealStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { status, cancellationReason, paymentStatus, paidAmount } = req.body;

    const deal = await Deal.findById(id);
    if (!deal) {
      res.status(404).json({ success: false, message: 'Deal not found' });
      return;
    }

    if (status) deal.status = status;
    if (cancellationReason) deal.cancellationReason = cancellationReason;
    if (paymentStatus) deal.paymentStatus = paymentStatus;
    if (paidAmount !== undefined) deal.paidAmount = Number(paidAmount);
    if (status === 'completed') deal.completedAt = new Date();

    await deal.save();

    res.json({ success: true, message: 'Deal status updated successfully', data: deal });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
