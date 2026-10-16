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
exports.RoomListing = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const RoomListingSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
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
}, { timestamps: true });
RoomListingSchema.index({ city: 1, status: 1, rent: 1 });
RoomListingSchema.index({ title: 'text', description: 'text', locality: 'text', city: 'text' });
exports.RoomListing = mongoose_1.default.model('RoomListing', RoomListingSchema);
//# sourceMappingURL=RoomListing.js.map