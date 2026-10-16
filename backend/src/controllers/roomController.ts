import { Request, Response } from 'express';
import { RoomListing, IRoomListing } from '../models/RoomListing';
import { AuthRequest } from '../middlewares/auth';
import { Notification } from '../models/Notification';
import { User } from '../models/User';

export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      city,
      locality,
      query,
      minPrice,
      maxPrice,
      roomType,
      sharingType,
      genderPreference,
      furnishedStatus,
      amenities,
      isAvailable,
      sort,
      page = '1',
      limit = '12'
    } = req.query;

    const filter: any = { status: 'approved' };

    if (city) {
      filter.city = new RegExp(`^${(city as string).trim()}$`, 'i');
    }

    if (locality) {
      filter.locality = new RegExp((locality as string).trim(), 'i');
    }

    if (query) {
      const q = (query as string).trim();
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { locality: new RegExp(q, 'i') },
        { city: new RegExp(q, 'i') },
        { address: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') }
      ];
    }

    if (minPrice || maxPrice) {
      filter.rent = {};
      if (minPrice) filter.rent.$gte = Number(minPrice);
      if (maxPrice) filter.rent.$lte = Number(maxPrice);
    }

    if (roomType && roomType !== 'all') {
      filter.roomType = roomType;
    }

    if (sharingType && sharingType !== 'all') {
      filter.sharingType = sharingType;
    }

    if (genderPreference && genderPreference !== 'all') {
      filter.genderPreference = { $in: [genderPreference, 'all'] };
    }

    if (furnishedStatus && furnishedStatus !== 'all') {
      filter.furnishedStatus = furnishedStatus;
    }

    if (amenities) {
      const amenityArray = Array.isArray(amenities) ? amenities : (amenities as string).split(',');
      filter.amenities = { $all: amenityArray.map((a) => (a as string).trim()) };
    }

    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === 'true';
    }

    let sortOptions: any = { isFeatured: -1, createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { rent: 1 };
    if (sort === 'price_desc') sortOptions = { rent: -1 };
    if (sort === 'rating') sortOptions = { 'ratings.average': -1, 'ratings.count': -1 };
    if (sort === 'popular') sortOptions = { viewCount: -1, favoriteCount: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const [rooms, total] = await Promise.all([
      RoomListing.find(filter)
        .populate('ownerId', 'name phone email avatar isVerified')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      RoomListing.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: rooms,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { city } = req.query;
    const filter: any = { status: 'approved', isFeatured: true };
    if (city) {
      filter.city = new RegExp(`^${(city as string).trim()}$`, 'i');
    }

    let rooms = await RoomListing.find(filter)
      .populate('ownerId', 'name phone email avatar isVerified')
      .sort({ 'ratings.average': -1, createdAt: -1 })
      .limit(6);

    // Fallback to top-rated if less than 6 featured
    if (rooms.length < 6) {
      const additional = await RoomListing.find({ status: 'approved', _id: { $nin: rooms.map((r) => r._id) } })
        .populate('ownerId', 'name phone email avatar isVerified')
        .sort({ 'ratings.average': -1, viewCount: -1 })
        .limit(6 - rooms.length);
      rooms = [...rooms, ...additional];
    }

    res.json({ success: true, data: rooms });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoomById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const room = await RoomListing.findById(id).populate('ownerId', 'name phone email avatar isVerified createdAt');

    if (!room) {
      res.status(404).json({ success: false, message: 'Room listing not found.' });
      return;
    }

    // Increment view count asynchronously
    await RoomListing.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    res.json({ success: true, data: room });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      title,
      description,
      city,
      locality,
      address,
      pincode,
      coordinates,
      rent,
      deposit,
      maintenanceCharges,
      electricityChargesType,
      waterChargesType,
      roomType,
      sharingType,
      genderPreference,
      furnishedStatus,
      amenities,
      rules,
      images,
      videos,
      availabilityDate,
      totalRoomsOrBeds,
      availableRoomsOrBeds,
      collegeDistances,
      workplaceDistances
    } = req.body;

    if (!title || !description || !city || !locality || !address || !rent || !deposit || !roomType) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields (Title, Description, City, Locality, Address, Rent, Deposit, Room Type).'
      });
      return;
    }

    const newRoom = await RoomListing.create({
      title,
      description,
      ownerId: req.user._id,
      city,
      locality,
      address,
      pincode: pincode || '440001',
      coordinates: coordinates || { lat: 21.1458, lng: 79.0882 },
      rent: Number(rent),
      deposit: Number(deposit),
      maintenanceCharges: Number(maintenanceCharges || 0),
      electricityChargesType: electricityChargesType || 'per_unit',
      waterChargesType: waterChargesType || 'included',
      roomType,
      sharingType: sharingType || 'private',
      genderPreference: genderPreference || 'all',
      furnishedStatus: furnishedStatus || 'semi-furnished',
      amenities: amenities || [],
      rules: rules || [],
      images: images || [],
      videos: videos || [],
      availabilityDate: availabilityDate ? new Date(availabilityDate) : new Date(),
      totalRoomsOrBeds: Number(totalRoomsOrBeds || 1),
      availableRoomsOrBeds: Number(availableRoomsOrBeds || 1),
      collegeDistances: collegeDistances || [],
      workplaceDistances: workplaceDistances || [],
      status: 'pending', // Pending Admin Approval
      verifiedBadge: false,
      isFeatured: false
    });

    // Notify user
    await Notification.create({
      userId: req.user._id,
      title: 'Room Listing Submitted for Review',
      body: `Your room listing "${title}" has been submitted for admin approval. It will become live within a few hours.`,
      type: 'listing_approved',
      link: `/owner/listings`
    });

    res.status(201).json({
      success: true,
      message: 'Room listing submitted successfully! Pending Admin verification.',
      data: newRoom
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const room = await RoomListing.findById(id);

    if (!room) {
      res.status(404).json({ success: false, message: 'Room listing not found' });
      return;
    }

    if (room.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this listing.' });
      return;
    }

    const updatedRoom = await RoomListing.findByIdAndUpdate(id, { $set: req.body }, { new: true });

    res.json({
      success: true,
      message: 'Room listing updated successfully!',
      data: updatedRoom
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const room = await RoomListing.findById(id);

    if (!room) {
      res.status(404).json({ success: false, message: 'Room listing not found' });
      return;
    }

    if (room.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this listing.' });
      return;
    }

    await RoomListing.findByIdAndDelete(id);

    res.json({ success: true, message: 'Room listing deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOwnerRooms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const rooms = await RoomListing.find({ ownerId: req.user._id }).sort({ createdAt: -1 });

    res.json({ success: true, data: rooms });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
