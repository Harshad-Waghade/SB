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
exports.MessListing = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const MessListingSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
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
}, { timestamps: true });
MessListingSchema.index({ city: 1, status: 1, monthlyPrice: 1 });
MessListingSchema.index({ name: 'text', description: 'text', locality: 'text', city: 'text' });
exports.MessListing = mongoose_1.default.model('MessListing', MessListingSchema);
//# sourceMappingURL=MessListing.js.map