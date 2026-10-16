'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { fetchApi } from '../../lib/api';
import { RoomCard } from '../../components/RoomCard';
import { MessCard } from '../../components/MessCard';
import {
  Home,
  Bed,
  UtensilsCrossed,
  Heart,
  Tag,
  MessageSquare,
  FileCheck,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Calendar,
  CreditCard
} from 'lucide-react';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [recommendedRooms, setRecommendedRooms] = useState<any[]>([]);
  const [recommendedMesses, setRecommendedMesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi('/enquiries/my'),
      fetchApi('/deals/my'),
      fetchApi('/favorites/my'),
      fetchApi('/rooms/featured'),
      fetchApi('/messes/featured')
    ]).then(([enqRes, dealRes, favRes, roomRes, messRes]) => {
      setIsLoading(false);
      if (enqRes.success && enqRes.data) setEnquiries(enqRes.data);
      if (dealRes.success && dealRes.data) setDeals(dealRes.data);
      if (favRes.success && favRes.data) setFavorites(favRes.data);
      if (roomRes.success && roomRes.data) setRecommendedRooms(roomRes.data.slice(0, 3));
      if (messRes.success && messRes.data) setRecommendedMesses(messRes.data.slice(0, 3));
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* WELCOME HEADER */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Welcome Back</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Hello, {user?.name || 'Seeker'}!
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Track your enquiries, scheduled visits, deals, and daily mess services
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/rooms"
              className="px-4 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md transition"
            >
              <Bed className="w-4 h-4" />
              <span>Explore Rooms</span>
            </Link>
            <Link
              href="/mess"
              className="px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md transition"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Find Mess</span>
            </Link>
          </div>
        </div>

        {/* METRIC SHORTCUTS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/dashboard/enquiries"
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 transition p-5 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Active Enquiries</span>
              <MessageSquare className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-white">{enquiries.length}</div>
          </Link>

          <Link
            href="/dashboard/deals"
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 transition p-5 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Deals & Agreements</span>
              <Tag className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-white">{deals.length}</div>
          </Link>

          <Link
            href="/dashboard/favorites"
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition p-5 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Saved Favorites</span>
              <Heart className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-white">{favorites.length}</div>
          </Link>

          <Link
            href="/pricing"
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition p-5 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Seeker Plan</span>
              <CreditCard className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-base font-bold text-teal-400">Free Tier</div>
          </Link>
        </div>

        {/* ONGOING DEALS OR ACTIVE ENQUIRIES PREVIEW */}
        {deals.length > 0 && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-teal-400" />
                <span>Your Active Deals</span>
              </h3>
              <Link href="/dashboard/deals" className="text-xs font-semibold text-teal-400 hover:underline">
                View All Deals →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deals.slice(0, 2).map((d) => (
                <div key={d._id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-teal-400 uppercase">{d.dealCode}</span>
                    <h4 className="font-bold text-white text-sm">{d.listing?.title || d.listing?.name || 'Stay Deal'}</h4>
                    <p className="text-xs text-slate-400">Agreed Rent: ₹{d.agreedPrice}/mo • Status: <span className="text-orange-400 font-semibold uppercase">{d.status}</span></p>
                  </div>
                  {d.agreementId ? (
                    <Link
                      href={`/agreements/${d.agreementId}`}
                      className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs"
                    >
                      View Agreement
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard/deals?createAgreementFor=${d._id}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs"
                    >
                      Create Agreement
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECOMMENDED ROOMS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Bed className="w-5 h-5 text-teal-400" />
              <span>Recommended Rooms For You</span>
            </h3>
            <Link href="/rooms" className="text-xs font-semibold text-teal-400 hover:underline">
              See more →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        </div>

        {/* RECOMMENDED MESSES */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-orange-400" />
              <span>Recommended Messes & Tiffins</span>
            </h3>
            <Link href="/mess" className="text-xs font-semibold text-orange-400 hover:underline">
              See more →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedMesses.map((mess) => (
              <MessCard key={mess._id} mess={mess} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
