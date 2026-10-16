import mongoose, { Document, Schema } from 'mongoose';

export interface IVerification extends Document {
  userId: mongoose.Types.ObjectId;
  ownerType?: 'room_owner' | 'mess_owner' | 'tenant';
  documentType: 'aadhaar' | 'pan' | 'electricity_bill' | 'property_tax' | 'fssai_license' | 'student_id';
  documentNumber?: string;
  documentUrls: string[];
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  adminNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationSchema = new Schema<IVerification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ownerType: { type: String, enum: ['room_owner', 'mess_owner', 'tenant'] },
    documentType: {
      type: String,
      enum: ['aadhaar', 'pan', 'electricity_bill', 'property_tax', 'fssai_license', 'student_id'],
      required: true
    },
    documentNumber: { type: String },
    documentUrls: [{ type: String, required: true }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    rejectionReason: { type: String },
    adminNotes: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date }
  },
  { timestamps: true }
);

export const Verification = mongoose.model<IVerification>('Verification', VerificationSchema);
