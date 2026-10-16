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
exports.Profile = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProfileSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
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
}, { timestamps: true });
exports.Profile = mongoose_1.default.model('Profile', ProfileSchema);
//# sourceMappingURL=Profile.js.map