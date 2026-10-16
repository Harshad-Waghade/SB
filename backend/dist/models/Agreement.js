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
exports.Agreement = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AgreementSchema = new mongoose_1.Schema({
    agreementNumber: { type: String, required: true, unique: true, uppercase: true },
    dealId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Deal', required: true, index: true },
    listingType: { type: String, enum: ['room', 'mess'], required: true },
    listingId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    tenant: {
        userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        permanentAddress: { type: String, required: true },
        idProofType: { type: String, default: 'Aadhaar' },
        idProofNumber: { type: String, default: 'XXXX-XXXX-XXXX' },
        signature: { type: String },
        signedAt: { type: Date }
    },
    owner: {
        userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        permanentAddress: { type: String, required: true },
        idProofType: { type: String, default: 'PAN/Aadhaar' },
        idProofNumber: { type: String, default: 'XXXX-XXXX-XXXX' },
        signature: { type: String },
        signedAt: { type: Date }
    },
    propertyDetails: {
        propertyTitle: { type: String, required: true },
        fullAddress: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true },
        monthlyRent: { type: Number, required: true },
        securityDeposit: { type: Number, required: true },
        maintenanceCharges: { type: Number, default: 0 },
        electricityTerms: { type: String, default: 'As per meter reading / sub-meter' },
        waterTerms: { type: String, default: 'Included in rent' },
        lockInPeriodMonths: { type: Number, default: 1 },
        noticePeriodDays: { type: Number, default: 30 },
        leaseStartDate: { type: Date, required: true },
        leaseEndDate: { type: Date, required: true }
    },
    termsAndConditions: [{ type: String }],
    specialClauses: [{ type: String }],
    status: {
        type: String,
        enum: ['draft', 'pending_tenant_signature', 'pending_owner_signature', 'completed', 'cancelled'],
        default: 'draft',
        index: true
    },
    pdfDocumentUrl: { type: String },
    legalDisclaimerAcknowledged: { type: Boolean, default: true },
    stampDutyNoticeAcknowledged: { type: Boolean, default: true }
}, { timestamps: true });
exports.Agreement = mongoose_1.default.model('Agreement', AgreementSchema);
//# sourceMappingURL=Agreement.js.map