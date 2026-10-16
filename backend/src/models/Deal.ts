import mongoose, { Document, Schema } from 'mongoose';

export type DealStatus = 'negotiating' | 'visit_completed' | 'accepted' | 'agreement_requested' | 'agreement_completed' | 'completed' | 'cancelled';

export interface IDeal extends Document {
  dealCode: string;
  enquiryId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  listingType: 'room' | 'mess';
  listingId: mongoose.Types.ObjectId;
  agreedPrice: number;
  agreedDeposit: number;
  maintenanceCharges?: number;
  startDate: Date;
  endDate?: Date;
  durationMonths: number;
  needsAgreement: boolean;
  agreementId?: mongoose.Types.ObjectId;
  paymentStatus: 'pending' | 'partially_paid' | 'paid' | 'waived';
  paidAmount: number;
  status: DealStatus;
  notes?: string;
  cancellationReason?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema = new Schema<IDeal>(
  {
    dealCode: { type: String, required: true, unique: true, uppercase: true },
    enquiryId: { type: Schema.Types.ObjectId, ref: 'Enquiry' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    listingType: { type: String, enum: ['room', 'mess'], required: true },
    listingId: { type: Schema.Types.ObjectId, required: true, refPath: 'listingTypeModel' },
    agreedPrice: { type: Number, required: true },
    agreedDeposit: { type: Number, default: 0 },
    maintenanceCharges: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    durationMonths: { type: Number, default: 11 },
    needsAgreement: { type: Boolean, default: false },
    agreementId: { type: Schema.Types.ObjectId, ref: 'Agreement' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partially_paid', 'paid', 'waived'],
      default: 'pending'
    },
    paidAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['negotiating', 'visit_completed', 'accepted', 'agreement_requested', 'agreement_completed', 'completed', 'cancelled'],
      default: 'negotiating',
      index: true
    },
    notes: { type: String },
    cancellationReason: { type: String },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

export const Deal = mongoose.model<IDeal>('Deal', DealSchema);
