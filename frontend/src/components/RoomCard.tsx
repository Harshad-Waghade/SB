'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../lib/api';
import {
  MapPin,
  Star,
  ShieldCheck,
  Heart,
  Users,
  Building,
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';

interface RoomCardProps {
  room: {
    _id: string;
    title: string;
    locality: string;
    city: string;
    rent: number;
    deposit: number;
    roomType: string;
    sharingType: string;
    genderPreference: string;
    images?: string[];
    ratings?: { average: number; count: number };
    verifiedBadge?: boolean;
    isFeatured?: boolean;
    amenities?: string[];
    collegeDistances?: Array<{ collegeName: string; distanceKm: number }>;
  };
  onEnquireClick?: (room: any) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onEnquireClick }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [imgError, setImgError] = useState(false);

  const mainImage = room.images && room.images.length > 0 && !imgError
    ? room.images[0]
    : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to save favorites');
      return;
    }

    const res = await fetchApi('/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify({ listingType: 'room', listingId: room._id })
    });

    if (res.success) {
      setIsFav(res.isFavorite);
    }
  };

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-teal-950/30 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* IMAGE SECTION */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-800">
          <Image
            src={mainImage}
            alt={room.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

          {/* BADGES */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {room.isFeatured && (
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-bold shadow-md">
                <Sparkles className="w-3 h-3" />
                <span>FEATURED</span>
              </span>
            )}
            {room.verifiedBadge && (
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-teal-500/90 text-white text-[11px] font-semibold backdrop-blur-md shadow-md">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified</span>
              </span>
            )}
          </div>

          {/* FAVORITE BUTTON */}
          <button
            onClick={handleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition z-10 ${
              isFav ? 'bg-rose-500 text-white' : 'bg-black/40 text-slate-300 hover:text-white hover:bg-black/60'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
          </button>

          {/* RATING */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-xs font-semibold text-white border border-white/10">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{room.ratings?.average || 4.8}</span>
            <span className="text-[10px] text-slate-300">({room.ratings?.count || 12})</span>
          </div>

          {/* GENDER BADGE */}
          <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-[11px] font-medium text-slate-200 capitalize border border-slate-700/50">
            {room.genderPreference === 'all' ? 'Co-living (All)' : `${room.genderPreference} Only`}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              {room.roomType.toUpperCase()} • {room.sharingType.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-400">
              Deposit: ₹{room.deposit.toLocaleString('en-IN')}
            </span>
          </div>

          <Link href={`/rooms/${room._id}`} className="block">
            <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors line-clamp-1 mb-1.5">
              {room.title}
            </h3>
          </Link>

          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-3.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="line-clamp-1">{room.locality}, {room.city}</span>
          </div>

          {/* College Distance Badge if available */}
          {room.collegeDistances && room.collegeDistances.length > 0 && (
            <div className="mb-3.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 truncate max-w-[150px]">
                🎓 {room.collegeDistances[0].collegeName}
              </span>
              <span className="text-teal-400 font-semibold flex-shrink-0">
                {room.collegeDistances[0].distanceKm} km
              </span>
            </div>
          )}

          {/* AMENITIES PILLS */}
          {room.amenities && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {room.amenities.slice(0, 3).map((amenity, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 text-[11px] text-slate-300 font-medium"
                >
                  {amenity}
                </span>
              ))}
              {room.amenities.length > 3 && (
                <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-[11px] text-slate-400 font-medium">
                  +{room.amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER & PRICING */}
      <div className="px-5 pb-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="text-lg font-black text-white">
            ₹{room.rent.toLocaleString('en-IN')}
            <span className="text-xs font-normal text-slate-400">/mo</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onEnquireClick && (
            <button
              onClick={() => onEnquireClick(room)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
            >
              Enquire
            </button>
          )}
          <Link
            href={`/rooms/${room._id}`}
            className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-xs font-semibold text-white shadow-md transition flex items-center space-x-1"
          >
            <span>View</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
