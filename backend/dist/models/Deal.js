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
exports.Deal = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DealSchema = new mongoose_1.Schema({
    dealCode: { type: String, required: true, unique: true, uppercase: true },
    enquiryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Enquiry' },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    listingType: { type: String, enum: ['room', 'mess'], required: true },
    listingId: { type: mongoose_1.Schema.Types.ObjectId, required: true, refPath: 'listingTypeModel' },
    agreedPrice: { type: Number, required: true },
    agreedDeposit: { type: Number, default: 0 },
    maintenanceCharges: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    durationMonths: { type: Number, default: 11 },
    needsAgreement: { type: Boolean, default: false },
    agreementId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Agreement' },
    paymentStatus: {
        type: String,
        enum: ['pending', 'partially_paid', 'paid', 'waived'],
        default: 'pending'
    },
    paidAmount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['negotiating', 'visit_completed', 'accepted', 'agreement_requested', 'agreement_completed', 'completed', 'cancelled'],
        default: 'negotiating',
        index: true
    },
    notes: { type: String },
    cancellationReason: { type: String },
    completedAt: { type: Date }
}, { timestamps: true });
exports.Deal = mongoose_1.default.model('Deal', DealSchema);
//# sourceMappingURL=Deal.js.map