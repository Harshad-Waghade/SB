import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType =
  | 'listing_approved'
  | 'listing_rejected'
  | 'enquiry_received'
  | 'enquiry_accepted'
  | 'new_message'
  | 'deal_created'
  | 'deal_accepted'
  | 'visit_scheduled'
  | 'agreement_created'
  | 'agreement_signed'
  | 'payment_success'
  | 'subscription_expiring'
  | 'new_match'
  | 'report_update'
  | 'system';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  body: string;
  type: NotificationType;
  link?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'listing_approved',
        'listing_rejected',
        'enquiry_received',
        'enquiry_accepted',
        'new_message',
        'deal_created',
        'deal_accepted',
        'visit_scheduled',
        'agreement_created',
        'agreement_signed',
        'payment_success',
        'subscription_expiring',
        'new_match',
        'report_update',
        'system'
      ],
      default: 'system',
      index: true
    },
    link: { type: String },
    metadata: { type: Schema.Types.Mixed },
    isRead: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
