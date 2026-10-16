import mongoose, { Document, Schema } from 'mongoose';

export interface IReferral extends Document {
  referrerId: mongoose.Types.ObjectId;
  refereeId: mongoose.Types.ObjectId;
  referralCode: string;
  status: 'signed_up' | 'subscribed' | 'reward_credited';
  rewardAmount: number;
  rewardCreditedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSchema = new Schema<IReferral>(
  {
    referrerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    refereeId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    referralCode: { type: String, required: true },
    status: {
      type: String,
      enum: ['signed_up', 'subscribed', 'reward_credited'],
      default: 'signed_up',
      index: true
    },
    rewardAmount: { type: Number, default: 50 },
    rewardCreditedAt: { type: Date }
  },
  { timestamps: true }
);

export const Referral = mongoose.model<IReferral>('Referral', ReferralSchema);
