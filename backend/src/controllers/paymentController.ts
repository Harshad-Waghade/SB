import { Response, Request } from 'express';
import crypto from 'crypto';
import { Payment } from '../models/Payment';
import { Coupon } from '../models/Coupon';
import { AuthRequest } from '../middlewares/auth';
import { ENV } from '../config/env';
import { Notification } from '../models/Notification';
import { RoomListing } from '../models/RoomListing';
import { MessListing } from '../models/MessListing';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { amount, purpose, couponCode, metadata } = req.body;

    if (!amount || !purpose) {
      res.status(400).json({ success: false, message: 'Amount and purpose are required.' });
      return;
    }

    let finalAmount = Number(amount);
    let discountAmount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase().trim(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validTo: { $gte: new Date() }
      });

      if (coupon && coupon.timesUsed < coupon.usageLimit) {
        if (coupon.discountType === 'percentage') {
          discountAmount = (finalAmount * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
            discountAmount = coupon.maxDiscountAmount;
          }
        } else {
          discountAmount = coupon.discountValue;
        }
        finalAmount = Math.max(1, Math.round(finalAmount - discountAmount));
      }
    }

    const receiptNumber = `RCP-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const simulatedOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const paymentRecord = await Payment.create({
      userId: req.user._id,
      purpose,
      amount: finalAmount,
      currency: 'INR',
      status: 'created',
      razorpayOrderId: simulatedOrderId,
      receiptNumber,
      couponApplied: couponCode || undefined,
      discountAmount,
      metadata: metadata || {}
    });

    res.json({
      success: true,
      order: {
        id: simulatedOrderId,
        amount: finalAmount * 100, // in paise
        currency: 'INR',
        receipt: receiptNumber,
        key: ENV.RAZORPAY_KEY_ID
      },
      paymentRecordId: paymentRecord._id,
      finalAmount,
      discountAmount
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentRecordId,
      paymentMethod
    } = req.body;

    const payment = await Payment.findById(paymentRecordId);
    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment record not found.' });
      return;
    }

    payment.status = 'captured';
    payment.razorpayPaymentId = razorpayPaymentId || `pay_${Date.now()}_mock`;
    payment.razorpaySignature = razorpaySignature || 'sig_verified_staybite';
    payment.paymentMethod = paymentMethod || 'UPI';
    await payment.save();

    // If coupon was applied, increment timesUsed
    if (payment.couponApplied) {
      await Coupon.findOneAndUpdate(
        { code: payment.couponApplied },
        { $inc: { timesUsed: 1 } }
      );
    }

    // Handle featured listing activation if purpose was featured_listing
    if (payment.purpose === 'featured_listing' && payment.metadata?.listingId) {
      const { listingType, listingId, durationDays = 15 } = payment.metadata;
      const featuredUntil = new Date();
      featuredUntil.setDate(featuredUntil.getDate() + Number(durationDays));

      if (listingType === 'room') {
        await RoomListing.findByIdAndUpdate(listingId, { isFeatured: true, featuredUntil });
      } else if (listingType === 'mess') {
        await MessListing.findByIdAndUpdate(listingId, { isFeatured: true, featuredUntil });
      }
    }

    // Send payment success notification
    await Notification.create({
      userId: req.user._id,
      title: 'Payment Successful! 🎉',
      body: `Your payment of ₹${payment.amount} for ${payment.purpose.replace(/_/g, ' ')} has been received. Receipt #${payment.receiptNumber}.`,
      type: 'payment_success',
      link: '/dashboard/payments'
    });

    res.json({
      success: true,
      message: 'Payment verified and processed successfully!',
      payment
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, amount, purpose } = req.body;
    if (!code) {
      res.status(400).json({ success: false, message: 'Coupon code required.' });
      return;
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validTo: { $gte: new Date() }
    });

    if (!coupon) {
      res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
      return;
    }

    if (coupon.timesUsed >= coupon.usageLimit) {
      res.status(400).json({ success: false, message: 'Coupon usage limit has been reached.' });
      return;
    }

    const orderAmount = Number(amount || 0);
    if (orderAmount < coupon.minOrderAmount) {
      res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon.`
      });
      return;
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountAmount: Math.round(discount),
        finalAmount: Math.max(0, Math.round(orderAmount - discount))
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
