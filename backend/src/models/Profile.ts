import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  preferredLanguage: 'en' | 'hi' | 'mr';
  collegeOrWorkplace?: string;
  courseOrDesignation?: string;
  yearOrExp?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: Date;
  bio?: string;
  currentCity?: string;
  preferredLocations: string[];
  budgetMin?: number;
  budgetMax?: number;
  roomPreference?: 'single' | 'double' | 'triple' | 'pg' | 'hostel' | 'flat';
  foodPreference?: 'veg' | 'non-veg' | 'both' | 'jain';
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  address?: {
    permanentAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
  verificationDocuments: Array<{
    docType: 'aadhaar' | 'pan' | 'college_id' | 'employment_id' | 'fssai_cert' | 'property_tax' | 'electricity_bill';
    docUrl: string;
    docNumber?: string;
    status: 'pending' | 'verified' | 'rejected';
    verifiedAt?: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    preferredLanguage: { type: String, enum: ['en', 'hi', 'mr'], default: 'en' },
    collegeOrWorkplace: { type: String, trim: true },
    courseOrDesignation: { type: String, trim: true },
    yearOrExp: { type: String, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    dateOfBirth: { type: Date },
    bio: { type: String, trim: true },
    currentCity: { type: String, trim: true },
    preferredLocations: [{ type: String, trim: true }],
    budgetMin: { type: Number },
    budgetMax: { type: Number },
    roomPreference: { type: String, enum: ['single', 'double', 'triple', 'pg', 'hostel', 'flat'] },
    foodPreference: { type: String, enum: ['veg', 'non-veg', 'both', 'jain'] },
    emergencyContact: {
      name: { type: String },
      relation: { type: String },
      phone: { type: String }
    },
    address: {
      permanentAddress: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String }
    },
    verificationDocuments: [
      {
        docType: {
          type: String,
          enum: ['aadhaar', 'pan', 'college_id', 'employment_id', 'fssai_cert', 'property_tax', 'electricity_bill']
        },
        docUrl: { type: String, required: true },
        docNumber: { type: String },
        status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
        verifiedAt: { type: Date }
      }
    ]
  },
  { timestamps: true }
);

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
