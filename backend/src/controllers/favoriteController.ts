import { Response } from 'express';
import { Favorite } from '../models/Favorite';
import { RoomListing } from '../models/RoomListing';
import { MessListing } from '../models/MessListing';
import { AuthRequest } from '../middlewares/auth';

export const toggleFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const existing = await Favorite.findOne({
      userId: req.user._id,
      listingType,
      listingId
    });

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      if (listingType === 'room') {
        await RoomListing.findByIdAndUpdate(listingId, { $inc: { favoriteCount: -1 } });
      } else {
        await MessListing.findByIdAndUpdate(listingId, { $inc: { favoriteCount: -1 } });
      }
      res.json({ success: true, isFavorite: false, message: 'Removed from favorites' });
    } else {
      await Favorite.create({
        userId: req.user._id,
        listingType,
        listingId
      });
      if (listingType === 'room') {
        await RoomListing.findByIdAndUpdate(listingId, { $inc: { favoriteCount: 1 } });
      } else {
        await MessListing.findByIdAndUpdate(listingId, { $inc: { favoriteCount: 1 } });
      }
      res.json({ success: true, isFavorite: true, message: 'Saved to favorites!' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const favorites = await Favorite.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const populatedFavorites = await Promise.all(
      favorites.map(async (fav) => {
        let listing: any = null;
        if (fav.listingType === 'room') {
          listing = await RoomListing.findById(fav.listingId).populate('ownerId', 'name phone email avatar isVerified');
        } else {
          listing = await MessListing.findById(fav.listingId).populate('ownerId', 'name phone email avatar isVerified');
        }
        return {
          ...fav.toObject(),
          listing
        };
      })
    );

    res.json({
      success: true,
      data: populatedFavorites.filter((f) => f.listing !== null)
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
