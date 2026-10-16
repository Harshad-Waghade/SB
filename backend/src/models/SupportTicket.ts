import mongoose, { Document, Schema } from 'mongoose';

export type TicketCategory = 'account' | 'room' | 'mess' | 'payment' | 'agreement' | 'fraud' | 'technical' | 'other';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface ISupportTicket extends Document {
  ticketNumber: string;
  userId: mongoose.Types.ObjectId;
  category: TicketCategory;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  attachments?: string[];
  responses: Array<{
    senderId: mongoose.Types.ObjectId;
    senderRole: 'user' | 'admin';
    senderName: string;
    message: string;
    attachments?: string[];
    createdAt: Date;
  }>;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    ticketNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: {
      type: String,
      enum: ['account', 'room', 'mess', 'payment', 'agreement', 'fraud', 'technical', 'other'],
      required: true,
      index: true
    },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
      index: true
    },
    attachments: [{ type: String }],
    responses: [
      {
        senderId: { type: Schema.Types.ObjectId, ref: 'User' },
        senderRole: { type: String, enum: ['user', 'admin'], default: 'user' },
        senderName: { type: String },
        message: { type: String, required: true },
        attachments: [{ type: String }],
        createdAt: { type: Date, default: Date.now }
      }
    ],
    resolvedAt: { type: Date }
  },
  { timestamps: true }
);

export const SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);
