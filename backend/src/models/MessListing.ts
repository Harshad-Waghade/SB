import mongoose, { Document, Schema } from 'mongoose';
import { ListingStatus } from './RoomListing';

export type MealType = 'veg' | 'non-veg' | 'both' | 'jain';

export interface IMessListing extends Document {
  name: string;
  description: string;
  ownerId: mongoose.Types.ObjectId;
  city: string;
  locality: string;
  address: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  monthlyPrice: number;
  dailyPrice: number;
  mealType: MealType;
  mealsProvided: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  weeklyMenu: Array<{
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    specialItem?: string;
  }>;
  timings: {
    breakfastTime?: string;
    lunchTime?: string;
    dinnerTime?: string;
  };
  tiffinService: boolean;
  homeDelivery: boolean;
  deliveryRadiusKm?: number;
  images: string[];
  videos: string[];
  facilities: string[];
  rules: string[];
  fssaiLicenseNumber?: string;
  status: ListingStatus;
  rejectionReason?: string;
  adminNotes?: string;
  isFeatured: boolean;
  featuredUntil?: Date;
  verifiedBadge: boolean;
  viewCount: number;
  favoriteCount: number;
  enquiryCount: number;
  ratings: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MessListingSchema = new Schema<IMessListing>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    city: { type: String, required: true, trim: true, index: true },
    locality: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    coordinates: {
      lat: { type: Number, default: 21.1458 },
      lng: { type: Number, default: 79.0882 }
    },
    monthlyPrice: { type: Number, required: true, index: true },
    dailyPrice: { type: Number, required: true },
    mealType: {
      type: String,
      enum: ['veg', 'non-veg', 'both', 'jain'],
      required: true,
      index: true
    },
    mealsProvided: {
      breakfast: { type: Boolean, default: true },
      lunch: { type: Boolean, default: true },
      dinner: { type: Boolean, default: true }
    },
    weeklyMenu: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        breakfast: { type: String },
        lunch: { type: String },
        dinner: { type: String },
        specialItem: { type: String }
      }
    ],
    timings: {
      breakfastTime: { type: String, default: '07:30 AM - 09:30 AM' },
      lunchTime: { type: String, default: '12:30 PM - 03:00 PM' },
      dinnerTime: { type: String, default: '07:30 PM - 10:00 PM' }
    },
    tiffinService: { type: Boolean, default: true },
    homeDelivery: { type: Boolean, default: false },
    deliveryRadiusKm: { type: Number, default: 3 },
    images: [{ type: String }],
    videos: [{ type: String }],
    facilities: [{ type: String }],
    rules: [{ type: String }],
    fssaiLicenseNumber: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'changes_requested', 'suspended'],
      default: 'pending',
      index: true
    },
    rejectionReason: { type: String },
    adminNotes: { type: String },
    isFeatured: { type: Boolean, default: false, index: true },
    featuredUntil: { type: Date },
    verifiedBadge: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    favoriteCount: { type: Number, default: 0 },
    enquiryCount: { type: Number, default: 0 },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

MessListingSchema.index({ city: 1, status: 1, monthlyPrice: 1 });
MessListingSchema.index({ name: 'text', description: 'text', locality: 'text', city: 'text' });

export const MessListing = mongoose.model<IMessListing>('MessListing', MessListingSchema);
