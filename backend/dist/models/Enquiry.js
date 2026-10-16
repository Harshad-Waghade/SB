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
exports.Enquiry = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const EnquirySchema = new mongoose_1.Schema({
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recipientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    listingType: { type: String, enum: ['room', 'mess'], required: true },
    listingId: { type: mongoose_1.Schema.Types.ObjectId, required: true, refPath: 'listingTypeModel' },
    message: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    preferredMoveInDate: { type: Date },
    budgetOffered: { type: Number },
    sharingPreference: { type: String },
    mealsIncludedPreference: { type: String },
    visitDate: { type: Date },
    visitNotes: { type: String },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'visit_scheduled', 'converted_to_deal', 'closed'],
        default: 'pending',
        index: true
    },
    ownerReply: { type: String }
}, { timestamps: true });
EnquirySchema.virtual('listingTypeModel').get(function () {
    return this.listingType === 'room' ? 'RoomListing' : 'MessListing';
});
exports.Enquiry = mongoose_1.default.model('Enquiry', EnquirySchema);
//# sourceMappingURL=Enquiry.js.map