import mongoose, { Document, Schema } from 'mongoose';

export type MessageType = 'text' | 'image' | 'listing_card' | 'deal_invite' | 'system';

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  text: string;
  mediaUrl?: string;
  messageType: MessageType;
  metadata?: Record<string, any>;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, default: '' },
    mediaUrl: { type: String },
    messageType: {
      type: String,
      enum: ['text', 'image', 'listing_card', 'deal_invite', 'system'],
      default: 'text'
    },
    metadata: { type: Schema.Types.Mixed },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date }
  },
  { timestamps: true }
);

MessageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
