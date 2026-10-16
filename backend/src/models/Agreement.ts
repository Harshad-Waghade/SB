import mongoose, { Document, Schema } from 'mongoose';

export type AgreementStatus = 'draft' | 'pending_tenant_signature' | 'pending_owner_signature' | 'completed' | 'cancelled';

export interface IAgreement extends Document {
  agreementNumber: string;
  dealId: mongoose.Types.ObjectId;
  listingType: 'room' | 'mess';
  listingId: mongoose.Types.ObjectId;
  
  // Tenant Information
  tenant: {
    userId: mongoose.Types.ObjectId;
    fullName: string;
    phone: string;
    email: string;
    permanentAddress: string;
    idProofType: string;
    idProofNumber: string;
    signature?: string;
    signedAt?: Date;
  };

  // Owner Information
  owner: {
    userId: mongoose.Types.ObjectId;
    fullName: string;
    phone: string;
    email: string;
    permanentAddress: string;
    idProofType?: string;
    idProofNumber?: string;
    signature?: string;
    signedAt?: Date;
  };

  // Property / Service Details
  propertyDetails: {
    propertyTitle: string;
    fullAddress: string;
    city: string;
    pincode: string;
    monthlyRent: number;
    securityDeposit: number;
    maintenanceCharges: number;
    electricityTerms: string;
    waterTerms: string;
    lockInPeriodMonths: number;
    noticePeriodDays: number;
    leaseStartDate: Date;
    leaseEndDate: Date;
  };

  termsAndConditions: string[];
  specialClauses?: string[];
  status: AgreementStatus;
  pdfDocumentUrl?: string;
  
  legalDisclaimerAcknowledged: boolean;
  stampDutyNoticeAcknowledged: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const AgreementSchema = new Schema<IAgreement>(
  {
    agreementNumber: { type: String, required: true, unique: true, uppercase: true },
    dealId: { type: Schema.Types.ObjectId, ref: 'Deal', required: true, index: true },
    listingType: { type: String, enum: ['room', 'mess'], required: true },
    listingId: { type: Schema.Types.ObjectId, required: true },
    
    tenant: {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
  },
  { timestamps: true }
);

export const Agreement = mongoose.model<IAgreement>('Agreement', AgreementSchema);
