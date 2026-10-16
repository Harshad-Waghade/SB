import mongoose, { Document, Schema } from 'mongoose';

export type PaymentPurpose = 'subscription' | 'featured_listing' | 'agreement_service' | 'platform_fee' | 'rent_deposit';
export type PaymentStatus = 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  purpose: PaymentPurpose;
  amount: number; // in INR
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  receiptNumber: string;
  couponApplied?: string;
  discountAmount?: number;
  taxAmount?: number;
  metadata?: Record<string, any>;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    purpose: {
      type: String,
      enum: ['subscription', 'featured_listing', 'agreement_service', 'platform_fee', 'rent_deposit'],
      required: true,
      index: true
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
      default: 'created',
      index: true
    },
    paymentMethod: { type: String },
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String, index: true },
    razorpaySignature: { type: String },
    receiptNumber: { type: String, required: true, unique: true },
    couponApplied: { type: String },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    metadata: { type: Schema.Types.Mixed },
    failureReason: { type: String }
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
