import mongoose, { Document, Schema } from 'mongoose';

export interface ISystemConfig extends Document {
  configKey: string;
  subscriptionPlans: {
    studentFree: { price: number; name: string; features: string[] };
    userPremium: { price: number; name: string; features: string[] };
    userPremiumPlus: { price: number; name: string; features: string[] };
    ownerFree: { price: number; name: string; features: string[] };
    ownerPro: { price: number; name: string; features: string[] };
    ownerBusiness: { price: number; name: string; features: string[] };
  };
  featuredPricing: {
    sevenDays: number;
    fifteenDays: number;
    thirtyDays: number;
  };
  commissionRules: {
    percentage: number;
    fixedFee: number;
    ownerFeePercentage: number;
    userFeePercentage: number;
  };
  popularCities: Array<{
    name: string;
    state: string;
    image: string;
    listingCount: number;
    isActive: boolean;
  }>;
  categories: Array<{
    id: string;
    title: string;
    icon: string;
    description: string;
    isActive: boolean;
  }>;
  bannerAnnouncements: Array<{
    id: string;
    title: string;
    description: string;
    linkUrl?: string;
    isActive: boolean;
  }>;
  referralRewardConfig: {
    referrerBonus: number;
    refereeBonus: number;
    minSpendToUnlock: number;
  };
  updatedAt: Date;
}

const SystemConfigSchema = new Schema<ISystemConfig>(
  {
    configKey: { type: String, default: 'global_config', unique: true },
    subscriptionPlans: {
      studentFree: {
        price: { type: Number, default: 0 },
        name: { type: String, default: 'Free Student/Seeker' },
        features: [{ type: String }]
      },
      userPremium: {
        price: { type: Number, default: 99 },
        name: { type: String, default: 'StayBite Seeker Premium' },
        features: [{ type: String }]
      },
      userPremiumPlus: {
        price: { type: Number, default: 199 },
        name: { type: String, default: 'StayBite Premium Plus' },
        features: [{ type: String }]
      },
      ownerFree: {
        price: { type: Number, default: 0 },
        name: { type: String, default: 'Free Owner Tier' },
        features: [{ type: String }]
      },
      ownerPro: {
        price: { type: Number, default: 299 },
        name: { type: String, default: 'StayBite Owner Pro' },
        features: [{ type: String }]
      },
      ownerBusiness: {
        price: { type: Number, default: 599 },
        name: { type: String, default: 'StayBite Owner Business' },
        features: [{ type: String }]
      }
    },
    featuredPricing: {
      sevenDays: { type: Number, default: 199 },
      fifteenDays: { type: Number, default: 349 },
      thirtyDays: { type: Number, default: 599 }
    },
    commissionRules: {
      percentage: { type: Number, default: 2.5 },
      fixedFee: { type: Number, default: 99 },
      ownerFeePercentage: { type: Number, default: 2 },
      userFeePercentage: { type: Number, default: 0 }
    },
    popularCities: [
      {
        name: { type: String },
        state: { type: String },
        image: { type: String },
        listingCount: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true }
      }
    ],
    categories: [
      {
        id: { type: String },
        title: { type: String },
        icon: { type: String },
        description: { type: String },
        isActive: { type: Boolean, default: true }
      }
    ],
    bannerAnnouncements: [
      {
        id: { type: String },
        title: { type: String },
        description: { type: String },
        linkUrl: { type: String },
        isActive: { type: Boolean, default: true }
      }
    ],
    referralRewardConfig: {
      referrerBonus: { type: Number, default: 100 },
      refereeBonus: { type: Number, default: 50 },
      minSpendToUnlock: { type: Number, default: 100 }
    }
  },
  { timestamps: true }
);

export const SystemConfig = mongoose.model<ISystemConfig>('SystemConfig', SystemConfigSchema);
