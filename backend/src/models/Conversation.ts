import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  listingType?: 'room' | 'mess';
  listingId?: mongoose.Types.ObjectId;
  lastMessage?: {
    text: string;
    senderId: mongoose.Types.ObjectId;
    createdAt: Date;
  };
  unreadCounts: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    listingType: { type: String, enum: ['room', 'mess'] },
    listingId: { type: Schema.Types.ObjectId },
    lastMessage: {
      text: { type: String },
      senderId: { type: Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  { timestamps: true }
);

ConversationSchema.index({ participants: 1 });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
