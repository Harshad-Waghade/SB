import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'student' | 'employed' | 'room_owner' | 'mess_owner' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  isBlocked: boolean;
  blockedReason?: string;
  referralCode: string;
  referredBy?: string;
  walletBalance: number;
  fcmToken?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'employed', 'room_owner', 'mess_owner', 'admin'],
      default: 'student',
      required: true
    },
    avatar: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    blockedReason: { type: String },
    referralCode: { type: String, unique: true, index: true },
    referredBy: { type: String },
    walletBalance: { type: Number, default: 0 },
    fcmToken: { type: String },
    lastLoginAt: { type: Date }
  },
  { timestamps: true }
);

UserSchema.index({ role: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
