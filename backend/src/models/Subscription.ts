import mongoose, { Document, Schema } from 'mongoose';

export type SubscriptionPlan = 'free' | 'user_premium' | 'user_premium_plus' | 'owner_free' | 'owner_pro' | 'owner_business';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  planId: SubscriptionPlan;
  role: 'user' | 'owner';
  price: number;
  durationDays: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled';
  autoRenew: boolean;
  paymentId?: mongoose.Types.ObjectId;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    planId: {
      type: String,
      enum: ['free', 'user_premium', 'user_premium_plus', 'owner_free', 'owner_pro', 'owner_business'],
      required: true
    },
    role: { type: String, enum: ['user', 'owner'], required: true },
    price: { type: Number, required: true },
    durationDays: { type: Number, default: 30 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active', index: true },
    autoRenew: { type: Boolean, default: false },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
    features: [{ type: String }]
  },
  { timestamps: true }
);

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
