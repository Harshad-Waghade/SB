import mongoose, { Document, Schema } from 'mongoose';

export type RoomType = 'single' | 'double' | 'triple' | 'pg' | 'hostel' | '1rk' | '1bhk' | '2bhk';
export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested' | 'suspended';

export interface IRoomListing extends Document {
  title: string;
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
  rent: number;
  deposit: number;
  maintenanceCharges: number;
  electricityChargesType: 'included' | 'per_unit' | 'fixed_monthly';
  waterChargesType: 'included' | 'fixed_monthly';
  roomType: RoomType;
  sharingType: 'private' | '2_sharing' | '3_sharing' | '4_sharing' | 'custom';
  genderPreference: 'all' | 'boys' | 'girls' | 'family';
  furnishedStatus: 'unfurnished' | 'semi-furnished' | 'fully-furnished';
  amenities: string[];
  rules: string[];
  images: string[];
  videos: string[];
  availabilityDate: Date;
  isAvailable: boolean;
  totalRoomsOrBeds: number;
  availableRoomsOrBeds: number;
  collegeDistances: Array<{
    collegeName: string;
    distanceKm: number;
  }>;
  workplaceDistances: Array<{
    workplaceName: string;
    distanceKm: number;
  }>;
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

const RoomListingSchema = new Schema<IRoomListing>(
  {
    title: { type: String, required: true, trim: true },
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
    rent: { type: Number, required: true, index: true },
    deposit: { type: Number, required: true },
    maintenanceCharges: { type: Number, default: 0 },
    electricityChargesType: { type: String, enum: ['included', 'per_unit', 'fixed_monthly'], default: 'per_unit' },
    waterChargesType: { type: String, enum: ['included', 'fixed_monthly'], default: 'included' },
    roomType: {
      type: String,
      enum: ['single', 'double', 'triple', 'pg', 'hostel', '1rk', '1bhk', '2bhk'],
      required: true,
      index: true
    },
    sharingType: {
      type: String,
      enum: ['private', '2_sharing', '3_sharing', '4_sharing', 'custom'],
      default: 'private'
    },
    genderPreference: {
      type: String,
      enum: ['all', 'boys', 'girls', 'family'],
      default: 'all',
      index: true
    },
    furnishedStatus: {
      type: String,
      enum: ['unfurnished', 'semi-furnished', 'fully-furnished'],
      default: 'semi-furnished'
    },
    amenities: [{ type: String }],
    rules: [{ type: String }],
    images: [{ type: String }],
    videos: [{ type: String }],
    availabilityDate: { type: Date, default: Date.now },
    isAvailable: { type: Boolean, default: true },
    totalRoomsOrBeds: { type: Number, default: 1 },
    availableRoomsOrBeds: { type: Number, default: 1 },
    collegeDistances: [
      {
        collegeName: { type: String },
        distanceKm: { type: Number }
      }
    ],
    workplaceDistances: [
      {
        workplaceName: { type: String },
        distanceKm: { type: Number }
      }
    ],
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

RoomListingSchema.index({ city: 1, status: 1, rent: 1 });
RoomListingSchema.index({ title: 'text', description: 'text', locality: 'text', city: 'text' });

export const RoomListing = mongoose.model<IRoomListing>('RoomListing', RoomListingSchema);
