import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount: number;
  validFrom: Date;
  validTo: Date;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
  applicableFor: Array<'subscription' | 'featured_listing' | 'agreement_service' | 'all'>;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, required: true },
    discountType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
    discountValue: { type: Number, required: true },
    maxDiscountAmount: { type: Number },
    minOrderAmount: { type: Number, default: 0 },
    validFrom: { type: Date, default: Date.now },
    validTo: { type: Date, required: true },
    usageLimit: { type: Number, default: 100 },
    timesUsed: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    applicableFor: [{ type: String, enum: ['subscription', 'featured_listing', 'agreement_service', 'all'] }]
  },
  { timestamps: true }
);

export const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);
