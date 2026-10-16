'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../context/LanguageContext';
import { fetchApi } from '../../../lib/api';
import { RoomCard } from '../../../components/RoomCard';
import { MessCard } from '../../../components/MessCard';
import { Heart, ArrowLeft, Bed, UtensilsCrossed } from 'lucide-react';

export default function FavoritesPage() {
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi('/favorites/my').then((res) => {
      setIsLoading(false);
      if (res.success && res.data) {
        setFavorites(res.data);
      }
    });
  }, []);

  const roomFavorites = favorites.filter((f) => f.listingType === 'room' && f.listing);
  const messFavorites = favorites.filter((f) => f.listingType === 'mess' && f.listing);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              <span>{t('favorites')}</span>
            </h1>
            <p className="text-xs text-slate-400">All your saved rooms, PGs, and food services in one place</p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-slate-400">Loading saved favorites...</div>
        ) : favorites.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-3xl border border-slate-800 p-8 space-y-4">
            <Heart className="w-16 h-16 text-slate-700 mx-auto" />
            <h3 className="text-xl font-bold text-white">{t('emptyFavorites')}</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Click the heart icon on any room or mess listing card to save it for easy access later.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/rooms"
                className="px-5 py-2.5 rounded-xl bg-teal-500 text-white font-semibold text-xs"
              >
                Browse Rooms
              </Link>
              <Link
                href="/mess"
                className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-xs"
              >
                Browse Messes
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {roomFavorites.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Bed className="w-5 h-5 text-teal-400" />
                  <span>Saved Rooms & PGs ({roomFavorites.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roomFavorites.map((fav) => (
                    <RoomCard key={fav._id} room={fav.listing} />
                  ))}
                </div>
              </div>
            )}

            {messFavorites.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-orange-400" />
                  <span>Saved Messes & Tiffins ({messFavorites.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {messFavorites.map((fav) => (
                    <MessCard key={fav._id} mess={fav.listing} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
