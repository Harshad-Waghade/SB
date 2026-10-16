import mongoose, { Document, Schema } from 'mongoose';

export type EnquiryStatus = 'pending' | 'accepted' | 'declined' | 'visit_scheduled' | 'converted_to_deal' | 'closed';

export interface IEnquiry extends Document {
  senderId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  listingType: 'room' | 'mess';
  listingId: mongoose.Types.ObjectId;
  message: string;
  phone: string;
  email: string;
  preferredMoveInDate?: Date;
  budgetOffered?: number;
  sharingPreference?: string;
  mealsIncludedPreference?: string;
  visitDate?: Date;
  visitNotes?: string;
  status: EnquiryStatus;
  ownerReply?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    listingType: { type: String, enum: ['room', 'mess'], required: true },
    listingId: { type: Schema.Types.ObjectId, required: true, refPath: 'listingTypeModel' },
    message: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    preferredMoveInDate: { type: Date },
    budgetOffered: { type: Number },
    sharingPreference: { type: String },
    mealsIncludedPreference: { type: String },
    visitDate: { type: Date },
    visitNotes: { type: String },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'visit_scheduled', 'converted_to_deal', 'closed'],
      default: 'pending',
      index: true
    },
    ownerReply: { type: String }
  },
  { timestamps: true }
);

EnquirySchema.virtual('listingTypeModel').get(function () {
  return this.listingType === 'room' ? 'RoomListing' : 'MessListing';
});

export const Enquiry = mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
