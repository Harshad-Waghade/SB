"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAgreement = exports.getMyAgreements = exports.getAgreementById = exports.createAgreement = void 0;
const Agreement_1 = require("../models/Agreement");
const Deal_1 = require("../models/Deal");
const Notification_1 = require("../models/Notification");
const createAgreement = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { dealId, tenant, owner, propertyDetails, termsAndConditions, specialClauses } = req.body;
        if (!dealId || !tenant || !owner || !propertyDetails) {
            res.status(400).json({ success: false, message: 'Missing agreement parameters.' });
            return;
        }
        const deal = await Deal_1.Deal.findById(dealId);
        if (!deal) {
            res.status(404).json({ success: false, message: 'Deal not found.' });
            return;
        }
        const agreementNumber = `SBA-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
        const defaultTerms = [
            'The Tenant agrees to pay the agreed rent on or before the 5th day of every calendar month.',
            'The Security Deposit is refundable at the time of vacating the premises, subject to deductions for damages or unpaid bills.',
            'The Tenant shall not sublet, assign or part with possession of the premises to any other person.',
            'Either party may terminate this agreement by giving 30 days written notice to the other party.',
            'The Tenant shall keep the premises in a clean and sanitary condition and abide by society / building rules.',
            'Electricity, water, and municipal maintenance charges shall be paid as explicitly agreed herein.',
            'StayBite serves solely as a technology facilitator and marketplace. Users are advised to comply with state-specific stamp duty and registration requirements.'
        ];
        const newAgreement = await Agreement_1.Agreement.create({
            agreementNumber,
            dealId: deal._id,
            listingType: deal.listingType,
            listingId: deal.listingId,
            tenant: {
                userId: deal.userId,
                fullName: tenant.fullName || req.user.name,
                phone: tenant.phone || req.user.phone,
                email: tenant.email || req.user.email,
                permanentAddress: tenant.permanentAddress || 'Not specified',
                idProofType: tenant.idProofType || 'Aadhaar',
                idProofNumber: tenant.idProofNumber || 'XXXX-XXXX-XXXX'
            },
            owner: {
                userId: deal.ownerId,
                fullName: owner.fullName,
                phone: owner.phone,
                email: owner.email,
                permanentAddress: owner.permanentAddress || 'Not specified',
                idProofType: owner.idProofType || 'PAN/Aadhaar',
                idProofNumber: owner.idProofNumber || 'XXXX-XXXX-XXXX'
            },
            propertyDetails: {
                propertyTitle: propertyDetails.propertyTitle,
                fullAddress: propertyDetails.fullAddress,
                city: propertyDetails.city,
                pincode: propertyDetails.pincode || '440001',
                monthlyRent: Number(propertyDetails.monthlyRent || deal.agreedPrice),
                securityDeposit: Number(propertyDetails.securityDeposit || deal.agreedDeposit),
                maintenanceCharges: Number(propertyDetails.maintenanceCharges || 0),
                electricityTerms: propertyDetails.electricityTerms || 'As per meter reading',
                waterTerms: propertyDetails.waterTerms || 'Included in rent',
                lockInPeriodMonths: Number(propertyDetails.lockInPeriodMonths || 1),
                noticePeriodDays: Number(propertyDetails.noticePeriodDays || 30),
                leaseStartDate: new Date(propertyDetails.leaseStartDate || deal.startDate),
                leaseEndDate: new Date(propertyDetails.leaseEndDate || Date.now() + 330 * 24 * 60 * 60 * 1000)
            },
            termsAndConditions: termsAndConditions && termsAndConditions.length > 0 ? termsAndConditions : defaultTerms,
            specialClauses: specialClauses || [],
            status: 'pending_tenant_signature',
            legalDisclaimerAcknowledged: true,
            stampDutyNoticeAcknowledged: true
        });
        // Link agreement to deal
        deal.agreementId = newAgreement._id;
        deal.status = 'agreement_requested';
        deal.needsAgreement = true;
        await deal.save();
        // Send notifications
        await Notification_1.Notification.create({
            userId: deal.userId,
            title: 'Digital Agreement Ready for Signature',
            body: `Rental Agreement #${agreementNumber} has been generated. Please review and sign digitally.`,
            type: 'agreement_created',
            link: `/agreements/${newAgreement._id}`
        });
        res.status(201).json({
            success: true,
            message: 'Digital Agreement created successfully!',
            data: newAgreement
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createAgreement = createAgreement;
const getAgreementById = async (req, res) => {
    try {
        const { id } = req.params;
        const agreement = await Agreement_1.Agreement.findById(id);
        if (!agreement) {
            res.status(404).json({ success: false, message: 'Agreement not found.' });
            return;
        }
        res.json({ success: true, data: agreement });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAgreementById = getAgreementById;
const getMyAgreements = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const agreements = await Agreement_1.Agreement.find({
            $or: [{ 'tenant.userId': req.user._id }, { 'owner.userId': req.user._id }]
        }).sort({ createdAt: -1 });
        res.json({ success: true, data: agreements });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyAgreements = getMyAgreements;
const signAgreement = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { id } = req.params;
        const { signatureText } = req.body;
        const agreement = await Agreement_1.Agreement.findById(id);
        if (!agreement) {
            res.status(404).json({ success: false, message: 'Agreement not found.' });
            return;
        }
        const isTenant = agreement.tenant.userId.toString() === req.user._id.toString();
        const isOwner = agreement.owner.userId.toString() === req.user._id.toString();
        if (!isTenant && !isOwner && req.user.role !== 'admin') {
            res.status(403).json({ success: false, message: 'Forbidden. You are not a party in this agreement.' });
            return;
        }
        if (isTenant) {
            agreement.tenant.signature = signatureText || req.user.name;
            agreement.tenant.signedAt = new Date();
            agreement.status = agreement.owner.signature ? 'completed' : 'pending_owner_signature';
        }
        else if (isOwner) {
            agreement.owner.signature = signatureText || req.user.name;
            agreement.owner.signedAt = new Date();
            agreement.status = agreement.tenant.signature ? 'completed' : 'pending_tenant_signature';
        }
        if (agreement.status === 'completed') {
            await Deal_1.Deal.findByIdAndUpdate(agreement.dealId, { status: 'agreement_completed' });
        }
        await agreement.save();
        res.json({
            success: true,
            message: 'Agreement signed successfully!',
            data: agreement
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.signAgreement = signAgreement;
//# sourceMappingURL=agreementController.js.map