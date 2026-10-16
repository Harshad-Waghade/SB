"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEnquiryStatus = exports.getMyEnquiries = exports.createEnquiry = void 0;
const Enquiry_1 = require("../models/Enquiry");
const RoomListing_1 = require("../models/RoomListing");
const MessListing_1 = require("../models/MessListing");
const Notification_1 = require("../models/Notification");
const createEnquiry = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { listingType, listingId, message, phone, email, preferredMoveInDate, budgetOffered, sharingPreference, mealsIncludedPreference } = req.body;
        if (!listingType || !listingId || !message) {
            res.status(400).json({ success: false, message: 'Listing type, ID and message are required.' });
            return;
        }
        let ownerId;
        let listingTitle = '';
        if (listingType === 'room') {
            const room = await RoomListing_1.RoomListing.findById(listingId);
            if (!room) {
                res.status(404).json({ success: false, message: 'Room not found' });
                return;
            }
            ownerId = room.ownerId;
            listingTitle = room.title;
            await RoomListing_1.RoomListing.findByIdAndUpdate(listingId, { $inc: { enquiryCount: 1 } });
        }
        else {
            const mess = await MessListing_1.MessListing.findById(listingId);
            if (!mess) {
                res.status(404).json({ success: false, message: 'Mess not found' });
                return;
            }
            ownerId = mess.ownerId;
            listingTitle = mess.name;
            await MessListing_1.MessListing.findByIdAndUpdate(listingId, { $inc: { enquiryCount: 1 } });
        }
        if (ownerId.toString() === req.user._id.toString()) {
            res.status(400).json({ success: false, message: 'You cannot send an enquiry to your own listing.' });
            return;
        }
        const enquiry = await Enquiry_1.Enquiry.create({
            senderId: req.user._id,
            recipientId: ownerId,
            listingType,
            listingId,
            message,
            phone: phone || req.user.phone,
            email: email || req.user.email,
            preferredMoveInDate: preferredMoveInDate ? new Date(preferredMoveInDate) : undefined,
            budgetOffered: budgetOffered ? Number(budgetOffered) : undefined,
            sharingPreference,
            mealsIncludedPreference,
            status: 'pending'
        });
        // Notify Owner
        await Notification_1.Notification.create({
            userId: ownerId,
            title: 'New Lead / Enquiry Received!',
            body: `${req.user.name} sent an enquiry for "${listingTitle}".`,
            type: 'enquiry_received',
            link: `/owner/leads`
        });
        res.status(201).json({
            success: true,
            message: 'Enquiry sent successfully! The owner will contact you soon.',
            data: enquiry
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createEnquiry = createEnquiry;
const getMyEnquiries = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const isOwner = req.user.role === 'room_owner' || req.user.role === 'mess_owner';
        const filter = isOwner ? { recipientId: req.user._id } : { senderId: req.user._id };
        const enquiries = await Enquiry_1.Enquiry.find(filter)
            .populate('senderId', 'name phone email avatar role')
            .populate('recipientId', 'name phone email avatar role')
            .sort({ createdAt: -1 });
        // Populate listing details manually based on listingType
        const populatedEnquiries = await Promise.all(enquiries.map(async (enq) => {
            let listing = null;
            if (enq.listingType === 'room') {
                listing = await RoomListing_1.RoomListing.findById(enq.listingId).select('title rent city locality images address roomType');
            }
            else {
                listing = await MessListing_1.MessListing.findById(enq.listingId).select('name monthlyPrice city locality images address mealType');
            }
            return {
                ...enq.toObject(),
                listing
            };
        }));
        res.json({ success: true, data: populatedEnquiries });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyEnquiries = getMyEnquiries;
const updateEnquiryStatus = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { id } = req.params;
        const { status, ownerReply, visitDate, visitNotes } = req.body;
        const enquiry = await Enquiry_1.Enquiry.findById(id);
        if (!enquiry) {
            res.status(404).json({ success: false, message: 'Enquiry not found' });
            return;
        }
        if (enquiry.recipientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403).json({ success: false, message: 'Unauthorized' });
            return;
        }
        if (status)
            enquiry.status = status;
        if (ownerReply)
            enquiry.ownerReply = ownerReply;
        if (visitDate)
            enquiry.visitDate = new Date(visitDate);
        if (visitNotes)
            enquiry.visitNotes = visitNotes;
        await enquiry.save();
        // Notify User
        let notificationText = `Owner updated your enquiry status to: ${status}.`;
        if (status === 'visit_scheduled') {
            notificationText = `A visit has been scheduled on ${new Date(visitDate).toLocaleDateString()} for your enquiry.`;
        }
        await Notification_1.Notification.create({
            userId: enquiry.senderId,
            title: 'Enquiry Status Update',
            body: notificationText,
            type: status === 'visit_scheduled' ? 'visit_scheduled' : 'enquiry_accepted',
            link: `/dashboard/enquiries`
        });
        res.json({ success: true, message: 'Enquiry status updated successfully', data: enquiry });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateEnquiryStatus = updateEnquiryStatus;
//# sourceMappingURL=enquiryController.js.map