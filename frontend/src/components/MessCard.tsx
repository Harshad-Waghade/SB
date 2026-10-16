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
  UtensilsCrossed,
  Truck,
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';

interface MessCardProps {
  mess: {
    _id: string;
    name: string;
    locality: string;
    city: string;
    monthlyPrice: number;
    dailyPrice: number;
    mealType: string;
    tiffinService?: boolean;
    homeDelivery?: boolean;
    images?: string[];
    ratings?: { average: number; count: number };
    verifiedBadge?: boolean;
    isFeatured?: boolean;
    facilities?: string[];
  };
  onEnquireClick?: (mess: any) => void;
}

export const MessCard: React.FC<MessCardProps> = ({ mess, onEnquireClick }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [imgError, setImgError] = useState(false);

  const mainImage = mess.images && mess.images.length > 0 && !imgError
    ? mess.images[0]
    : 'https://images.unsplash.com/photo-1613292443284-c73fe1674488?auto=format&fit=crop&w=800&q=80';

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to save favorites');
      return;
    }

    const res = await fetchApi('/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify({ listingType: 'mess', listingId: mess._id })
    });

    if (res.success) {
      setIsFav(res.isFavorite);
    }
  };

  const getMealTypeBadge = (type: string) => {
    switch (type) {
      case 'veg':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">🟢 Pure Veg</span>;
      case 'jain':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold">🟡 Jain Available</span>;
      case 'non-veg':
        return <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold">🔴 Non-Veg</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[11px] font-bold">🟠 Veg & Non-Veg</span>;
    }
  };

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-950/30 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* IMAGE SECTION */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-800">
          <Image
            src={mainImage}
            alt={mess.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

          {/* BADGES */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {mess.isFeatured && (
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-bold shadow-md">
                <Sparkles className="w-3 h-3" />
                <span>FEATURED</span>
              </span>
            )}
            {mess.verifiedBadge && (
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
            <span>{mess.ratings?.average || 4.8}</span>
            <span className="text-[10px] text-slate-300">({mess.ratings?.count || 24})</span>
          </div>

          {/* MEAL TYPE BADGE */}
          <div className="absolute bottom-3 right-3 z-10 backdrop-blur-md">
            {getMealTypeBadge(mess.mealType)}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-orange-400 flex items-center gap-1">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Mess & Tiffin Service</span>
            </span>
            <span className="text-xs text-slate-400">
              ₹{mess.dailyPrice}/meal
            </span>
          </div>

          <Link href={`/mess/${mess._id}`} className="block">
            <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1 mb-1.5">
              {mess.name}
            </h3>
          </Link>

          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-3.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="line-clamp-1">{mess.locality}, {mess.city}</span>
          </div>

          {/* DELIVERY & TIFFIN INDICATOR */}
          <div className="flex items-center gap-2 mb-4">
            {mess.tiffinService && (
              <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs flex items-center gap-1">
                <span>🍱 Tiffin Available</span>
              </span>
            )}
            {mess.homeDelivery && (
              <span className="px-2.5 py-1 rounded-xl bg-teal-950/60 border border-teal-800/40 text-teal-300 text-xs flex items-center gap-1">
                <Truck className="w-3 h-3 text-teal-400" />
                <span>Doorstep Delivery</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER & PRICING */}
      <div className="px-5 pb-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="text-lg font-black text-white">
            ₹{mess.monthlyPrice.toLocaleString('en-IN')}
            <span className="text-xs font-normal text-slate-400">/mo</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onEnquireClick && (
            <button
              onClick={() => onEnquireClick(mess)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
            >
              Enquire
            </button>
          )}
          <Link
            href={`/mess/${mess._id}`}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-xs font-semibold text-white shadow-md transition flex items-center space-x-1"
          >
            <span>View Menu</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
