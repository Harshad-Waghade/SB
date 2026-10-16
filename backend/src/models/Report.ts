import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  reporterId: mongoose.Types.ObjectId;
  targetType: 'room' | 'mess' | 'user' | 'review';
  targetId: mongoose.Types.ObjectId;
  reason: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  adminNotes?: string;
  resolvedBy?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetType: { type: String, enum: ['room', 'mess', 'user', 'review'], required: true, index: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    reason: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'investigating', 'resolved', 'dismissed'],
      default: 'pending',
      index: true
    },
    adminNotes: { type: String },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date }
  },
  { timestamps: true }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
