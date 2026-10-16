"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemConfig = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SystemConfigSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.SystemConfig = mongoose_1.default.model('SystemConfig', SystemConfigSchema);
//# sourceMappingURL=SystemConfig.js.map