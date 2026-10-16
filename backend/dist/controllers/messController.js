"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnerMesses = exports.deleteMess = exports.updateMess = exports.createMess = exports.getMessById = exports.getFeaturedMesses = exports.getMesses = void 0;
const MessListing_1 = require("../models/MessListing");
const Notification_1 = require("../models/Notification");
const getMesses = async (req, res) => {
    try {
        const { city, locality, query, minPrice, maxPrice, mealType, tiffinService, homeDelivery, breakfast, lunch, dinner, sort, page = '1', limit = '12' } = req.query;
        const filter = { status: 'approved' };
        if (city) {
            filter.city = new RegExp(`^${city.trim()}$`, 'i');
        }
        if (locality) {
            filter.locality = new RegExp(locality.trim(), 'i');
        }
        if (query) {
            const q = query.trim();
            filter.$or = [
                { name: new RegExp(q, 'i') },
                { locality: new RegExp(q, 'i') },
                { city: new RegExp(q, 'i') },
                { address: new RegExp(q, 'i') },
                { description: new RegExp(q, 'i') }
            ];
        }
        if (minPrice || maxPrice) {
            filter.monthlyPrice = {};
            if (minPrice)
                filter.monthlyPrice.$gte = Number(minPrice);
            if (maxPrice)
                filter.monthlyPrice.$lte = Number(maxPrice);
        }
        if (mealType && mealType !== 'all') {
            filter.mealType = { $in: [mealType, 'both'] };
        }
        if (tiffinService !== undefined) {
            filter.tiffinService = tiffinService === 'true';
        }
        if (homeDelivery !== undefined) {
            filter.homeDelivery = homeDelivery === 'true';
        }
        if (breakfast === 'true')
            filter['mealsProvided.breakfast'] = true;
        if (lunch === 'true')
            filter['mealsProvided.lunch'] = true;
        if (dinner === 'true')
            filter['mealsProvided.dinner'] = true;
        let sortOptions = { isFeatured: -1, createdAt: -1 };
        if (sort === 'price_asc')
            sortOptions = { monthlyPrice: 1 };
        if (sort === 'price_desc')
            sortOptions = { monthlyPrice: -1 };
        if (sort === 'rating')
            sortOptions = { 'ratings.average': -1, 'ratings.count': -1 };
        if (sort === 'popular')
            sortOptions = { viewCount: -1, favoriteCount: -1 };
        if (sort === 'newest')
            sortOptions = { createdAt: -1 };
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 12;
        const skip = (pageNum - 1) * limitNum;
        const [messes, total] = await Promise.all([
            MessListing_1.MessListing.find(filter)
                .populate('ownerId', 'name phone email avatar isVerified')
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum),
            MessListing_1.MessListing.countDocuments(filter)
        ]);
        res.json({
            success: true,
            data: messes,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMesses = getMesses;
const getFeaturedMesses = async (req, res) => {
    try {
        const { city } = req.query;
        const filter = { status: 'approved', isFeatured: true };
        if (city) {
            filter.city = new RegExp(`^${city.trim()}$`, 'i');
        }
        let messes = await MessListing_1.MessListing.find(filter)
            .populate('ownerId', 'name phone email avatar isVerified')
            .sort({ 'ratings.average': -1, createdAt: -1 })
            .limit(6);
        if (messes.length < 6) {
            const additional = await MessListing_1.MessListing.find({ status: 'approved', _id: { $nin: messes.map((m) => m._id) } })
                .populate('ownerId', 'name phone email avatar isVerified')
                .sort({ 'ratings.average': -1, viewCount: -1 })
                .limit(6 - messes.length);
            messes = [...messes, ...additional];
        }
        res.json({ success: true, data: messes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getFeaturedMesses = getFeaturedMesses;
const getMessById = async (req, res) => {
    try {
        const { id } = req.params;
        const mess = await MessListing_1.MessListing.findById(id).populate('ownerId', 'name phone email avatar isVerified createdAt');
        if (!mess) {
            res.status(404).json({ success: false, message: 'Mess listing not found.' });
            return;
        }
        await MessListing_1.MessListing.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
        res.json({ success: true, data: mess });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMessById = getMessById;
const createMess = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { name, description, city, locality, address, pincode, coordinates, monthlyPrice, dailyPrice, mealType, mealsProvided, weeklyMenu, timings, tiffinService, homeDelivery, deliveryRadiusKm, images, videos, facilities, rules, fssaiLicenseNumber } = req.body;
        if (!name || !description || !city || !locality || !address || !monthlyPrice || !mealType) {
            res.status(400).json({
                success: false,
                message: 'Please provide all required fields (Name, Description, City, Locality, Address, Monthly Price, Meal Type).'
            });
            return;
        }
        const newMess = await MessListing_1.MessListing.create({
            name,
            description,
            ownerId: req.user._id,
            city,
            locality,
            address,
            pincode: pincode || '440001',
            coordinates: coordinates || { lat: 21.1458, lng: 79.0882 },
            monthlyPrice: Number(monthlyPrice),
            dailyPrice: Number(dailyPrice || Math.round(Number(monthlyPrice) / 30)),
            mealType,
            mealsProvided: mealsProvided || { breakfast: true, lunch: true, dinner: true },
            weeklyMenu: weeklyMenu || [],
            timings: timings || {},
            tiffinService: tiffinService !== undefined ? Boolean(tiffinService) : true,
            homeDelivery: homeDelivery !== undefined ? Boolean(homeDelivery) : false,
            deliveryRadiusKm: deliveryRadiusKm ? Number(deliveryRadiusKm) : 3,
            images: images || [],
            videos: videos || [],
            facilities: facilities || [],
            rules: rules || [],
            fssaiLicenseNumber,
            status: 'pending', // Pending Admin Review
            verifiedBadge: false,
            isFeatured: false
        });
        // Send notification
        await Notification_1.Notification.create({
            userId: req.user._id,
            title: 'Mess Listing Submitted for Review',
            body: `Your mess listing "${name}" has been submitted for admin approval.`,
            type: 'listing_approved',
            link: `/owner/listings`
        });
        res.status(201).json({
            success: true,
            message: 'Mess listing submitted successfully! Pending Admin verification.',
            data: newMess
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createMess = createMess;
const updateMess = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { id } = req.params;
        const mess = await MessListing_1.MessListing.findById(id);
        if (!mess) {
            res.status(404).json({ success: false, message: 'Mess listing not found' });
            return;
        }
        if (mess.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403).json({ success: false, message: 'Forbidden. You do not own this listing.' });
            return;
        }
        const updatedMess = await MessListing_1.MessListing.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        res.json({
            success: true,
            message: 'Mess listing updated successfully!',
            data: updatedMess
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateMess = updateMess;
const deleteMess = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { id } = req.params;
        const mess = await MessListing_1.MessListing.findById(id);
        if (!mess) {
            res.status(404).json({ success: false, message: 'Mess listing not found' });
            return;
        }
        if (mess.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403).json({ success: false, message: 'Forbidden. You do not own this listing.' });
            return;
        }
        await MessListing_1.MessListing.findByIdAndDelete(id);
        res.json({ success: true, message: 'Mess listing deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteMess = deleteMess;
const getOwnerMesses = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const messes = await MessListing_1.MessListing.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: messes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getOwnerMesses = getOwnerMesses;
//# sourceMappingURL=messController.js.map