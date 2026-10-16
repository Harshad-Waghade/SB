"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyToReview = exports.voteHelpful = exports.createReview = exports.getReviews = void 0;
const Review_1 = require("../models/Review");
const RoomListing_1 = require("../models/RoomListing");
const MessListing_1 = require("../models/MessListing");
const updateListingRating = async (listingType, listingId) => {
    const reviews = await Review_1.Review.find({ listingType, listingId, status: 'approved' });
    if (reviews.length === 0)
        return;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = Number((total / reviews.length).toFixed(1));
    if (listingType === 'room') {
        await RoomListing_1.RoomListing.findByIdAndUpdate(listingId, {
            ratings: { average: avg, count: reviews.length }
        });
    }
    else {
        await MessListing_1.MessListing.findByIdAndUpdate(listingId, {
            ratings: { average: avg, count: reviews.length }
        });
    }
};
const getReviews = async (req, res) => {
    try {
        const { listingType, listingId } = req.params;
        const reviews = await Review_1.Review.find({
            listingType,
            listingId,
            status: 'approved'
        })
            .populate('userId', 'name avatar role isVerified')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: reviews });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getReviews = getReviews;
const createReview = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { listingType, listingId, rating, cleanlinessRating, foodQualityOrMaintenanceRating, valueForMoneyRating, title, comment, pros, cons } = req.body;
        if (!listingType || !listingId || !rating || !title || !comment) {
            res.status(400).json({ success: false, message: 'Rating, title, and comment are required.' });
            return;
        }
        const review = await Review_1.Review.create({
            userId: req.user._id,
            listingType,
            listingId,
            rating: Number(rating),
            cleanlinessRating: cleanlinessRating ? Number(cleanlinessRating) : undefined,
            foodQualityOrMaintenanceRating: foodQualityOrMaintenanceRating ? Number(foodQualityOrMaintenanceRating) : undefined,
            valueForMoneyRating: valueForMoneyRating ? Number(valueForMoneyRating) : undefined,
            title,
            comment,
            pros: pros || [],
            cons: cons || [],
            status: 'approved'
        });
        await updateListingRating(listingType, listingId);
        const populatedReview = await review.populate('userId', 'name avatar role isVerified');
        res.status(201).json({
            success: true,
            message: 'Review posted successfully! Thank you for your feedback.',
            data: populatedReview
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createReview = createReview;
const voteHelpful = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { id } = req.params;
        const review = await Review_1.Review.findById(id);
        if (!review) {
            res.status(404).json({ success: false, message: 'Review not found' });
            return;
        }
        const hasVoted = review.votedUserIds.some((uid) => uid.toString() === req.user?._id.toString());
        if (hasVoted) {
            review.votedUserIds = review.votedUserIds.filter((uid) => uid.toString() !== req.user?._id.toString());
            review.helpfulVotes = Math.max(0, review.helpfulVotes - 1);
        }
        else {
            review.votedUserIds.push(req.user._id);
            review.helpfulVotes += 1;
        }
        await review.save();
        res.json({ success: true, helpfulVotes: review.helpfulVotes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.voteHelpful = voteHelpful;
const replyToReview = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { id } = req.params;
        const { comment } = req.body;
        const review = await Review_1.Review.findById(id);
        if (!review) {
            res.status(404).json({ success: false, message: 'Review not found' });
            return;
        }
        review.ownerReply = {
            comment,
            repliedAt: new Date()
        };
        await review.save();
        res.json({ success: true, message: 'Owner reply posted successfully', data: review });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.replyToReview = replyToReview;
//# sourceMappingURL=reviewController.js.map