"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyFavorites = exports.toggleFavorite = void 0;
const Favorite_1 = require("../models/Favorite");
const RoomListing_1 = require("../models/RoomListing");
const MessListing_1 = require("../models/MessListing");
const toggleFavorite = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { listingType, listingId } = req.body;
        if (!listingType || !listingId) {
            res.status(400).json({ success: false, message: 'Listing type and ID are required.' });
            return;
        }
        const existing = await Favorite_1.Favorite.findOne({
            userId: req.user._id,
            listingType,
            listingId
        });
        if (existing) {
            await Favorite_1.Favorite.findByIdAndDelete(existing._id);
            if (listingType === 'room') {
                await RoomListing_1.RoomListing.findByIdAndUpdate(listingId, { $inc: { favoriteCount: -1 } });
            }
            else {
                await MessListing_1.MessListing.findByIdAndUpdate(listingId, { $inc: { favoriteCount: -1 } });
            }
            res.json({ success: true, isFavorite: false, message: 'Removed from favorites' });
        }
        else {
            await Favorite_1.Favorite.create({
                userId: req.user._id,
                listingType,
                listingId
            });
            if (listingType === 'room') {
                await RoomListing_1.RoomListing.findByIdAndUpdate(listingId, { $inc: { favoriteCount: 1 } });
            }
            else {
                await MessListing_1.MessListing.findByIdAndUpdate(listingId, { $inc: { favoriteCount: 1 } });
            }
            res.json({ success: true, isFavorite: true, message: 'Saved to favorites!' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.toggleFavorite = toggleFavorite;
const getMyFavorites = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const favorites = await Favorite_1.Favorite.find({ userId: req.user._id }).sort({ createdAt: -1 });
        const populatedFavorites = await Promise.all(favorites.map(async (fav) => {
            let listing = null;
            if (fav.listingType === 'room') {
                listing = await RoomListing_1.RoomListing.findById(fav.listingId).populate('ownerId', 'name phone email avatar isVerified');
            }
            else {
                listing = await MessListing_1.MessListing.findById(fav.listingId).populate('ownerId', 'name phone email avatar isVerified');
            }
            return {
                ...fav.toObject(),
                listing
            };
        }));
        res.json({
            success: true,
            data: populatedFavorites.filter((f) => f.listing !== null)
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyFavorites = getMyFavorites;
//# sourceMappingURL=favoriteController.js.map