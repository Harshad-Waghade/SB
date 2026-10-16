import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  listingType: 'room' | 'mess';
  listingId: mongoose.Types.ObjectId;
  rating: number; // 1 to 5
  cleanlinessRating?: number;
  foodQualityOrMaintenanceRating?: number;
  valueForMoneyRating?: number;
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  helpfulVotes: number;
  votedUserIds: mongoose.Types.ObjectId[];
  ownerReply?: {
    comment: string;
    repliedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    listingType: { type: String, enum: ['room', 'mess'], required: true },
    listingId: { type: Schema.Types.ObjectId, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    cleanlinessRating: { type: Number, min: 1, max: 5 },
    foodQualityOrMaintenanceRating: { type: Number, min: 1, max: 5 },
    valueForMoneyRating: { type: Number, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    comment: { type: String, required: true },
    pros: [{ type: String }],
    cons: [{ type: String }],
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'flagged'], default: 'approved', index: true },
    helpfulVotes: { type: Number, default: 0 },
    votedUserIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    ownerReply: {
      comment: { type: String },
      repliedAt: { type: Date }
    }
  },
  { timestamps: true }
);

ReviewSchema.index({ listingType: 1, listingId: 1, status: 1 });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
