import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  listingType: 'room' | 'mess';
  listingId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    listingType: { type: String, enum: ['room', 'mess'], required: true },
    listingId: { type: Schema.Types.ObjectId, required: true }
  },
  { timestamps: true }
);

FavoriteSchema.index({ userId: 1, listingType: 1, listingId: 1 }, { unique: true });

export const Favorite = mongoose.model<IFavorite>('Favorite', FavoriteSchema);
