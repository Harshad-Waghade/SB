'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { fetchApi } from '../../../lib/api';
import { PaymentModal } from '../../../components/PaymentModal';
import {
  Home,
  Bed,
  UtensilsCrossed,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Trash2,
  Eye,
  ArrowLeft
} from 'lucide-react';

export default function OwnerListingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [rooms, setRooms] = useState<any[]>([]);
  const [messes, setMesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Feature Promotion Modal
  const [featureModalListing, setFeatureModalListing] = useState<any>(null);

  const fetchListings = () => {
    setIsLoading(true);
    Promise.all([
      fetchApi('/rooms/owner-listings'),
      fetchApi('/messes/owner-listings')
    ]).then(([roomRes, messRes]) => {
      setIsLoading(false);
      if (roomRes.success && roomRes.data) setRooms(roomRes.data);
      if (messRes.success && messRes.data) setMesses(messRes.data);
    });
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDeleteRoom = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room listing?')) return;
    const res = await fetchApi(`/rooms/${id}`, { method: 'DELETE' });
    if (res.success) {
      setRooms(rooms.filter((r) => r._id !== id));
    }
  };

  const handleDeleteMess = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mess listing?')) return;
    const res = await fetchApi(`/messes/${id}`, { method: 'DELETE' });
    if (res.success) {
      setMesses(messes.filter((m) => m._id !== id));
    }
  };

  const getStatusBadge = (status: string, reason?: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Live & Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1" title={reason}>
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case 'changes_requested':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Updates Requested
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center gap-1 animate-pulse">
            <Clock className="w-3 h-3" /> Pending Admin Review
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/owner"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                <Home className="w-6 h-6 text-teal-400" />
                <span>{t('myListings')}</span>
              </h1>
              <p className="text-xs text-slate-400">Manage all your active rooms, PGs, and food services</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/owner/add-room"
              className="px-4 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Room</span>
            </Link>
            <Link
              href="/owner/add-mess"
              className="px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Mess</span>
            </Link>
          </div>
        </div>

        {/* ROOM LISTINGS */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Bed className="w-5 h-5 text-teal-400" />
            <span>Room & PG Listings ({rooms.length})</span>
          </h3>

          {rooms.length === 0 ? (
            <div className="p-8 rounded-3xl glass-panel text-center text-xs text-slate-400">
              No rooms listed yet. Click "+ Add Room" to publish your first property!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <div key={room._id} className="glass-panel p-5 rounded-3xl border border-slate-800 flex gap-4">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0">
                    <Image
                      src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'}
                      alt={room.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-teal-400 uppercase">
                          {room.roomType}
                        </span>
                        {getStatusBadge(room.status, room.rejectionReason)}
                      </div>
                      <h4 className="font-bold text-white text-sm line-clamp-1">{room.title}</h4>
                      <p className="text-xs text-slate-400">{room.locality}, {room.city} • ₹{room.rent}/mo</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <div className="flex items-center space-x-1 text-xs text-slate-400">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{room.viewCount || 0} views</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {!room.isFeatured && room.status === 'approved' && (
                          <button
                            onClick={() => setFeatureModalListing({ ...room, listingType: 'room' })}
                            className="px-2.5 py-1 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40 hover:bg-orange-500/30 text-[11px] font-bold flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Promote</span>
                          </button>
                        )}
                        <Link
                          href={`/rooms/${room._id}`}
                          className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-[11px] font-semibold"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteRoom(room._id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MESS LISTINGS */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-orange-400" />
            <span>Mess & Tiffin Services ({messes.length})</span>
          </h3>

          {messes.length === 0 ? (
            <div className="p-8 rounded-3xl glass-panel text-center text-xs text-slate-400">
              No messes listed yet. Click "+ Add Mess" to start receiving food orders!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messes.map((mess) => (
                <div key={mess._id} className="glass-panel p-5 rounded-3xl border border-slate-800 flex gap-4">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0">
                    <Image
                      src={mess.images?.[0] || 'https://images.unsplash.com/photo-1613292443284-c73fe1674488?auto=format&fit=crop&w=400&q=80'}
                      alt={mess.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-orange-400 uppercase">
                          {mess.mealType}
                        </span>
                        {getStatusBadge(mess.status, mess.rejectionReason)}
                      </div>
                      <h4 className="font-bold text-white text-sm line-clamp-1">{mess.name}</h4>
                      <p className="text-xs text-slate-400">{mess.locality}, {mess.city} • ₹{mess.monthlyPrice}/mo</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <div className="flex items-center space-x-1 text-xs text-slate-400">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{mess.viewCount || 0} views</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {!mess.isFeatured && mess.status === 'approved' && (
                          <button
                            onClick={() => setFeatureModalListing({ ...mess, listingType: 'mess' })}
                            className="px-2.5 py-1 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40 hover:bg-orange-500/30 text-[11px] font-bold flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Promote</span>
                          </button>
                        )}
                        <Link
                          href={`/mess/${mess._id}`}
                          className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-[11px] font-semibold"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteMess(mess._id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured Listing Promotion Modal */}
      {featureModalListing && (
        <PaymentModal
          isOpen={true}
          onClose={() => setFeatureModalListing(null)}
          title={`Promote to Featured: ${featureModalListing.title || featureModalListing.name}`}
          amount={199}
          purpose="featured_listing"
          metadata={{
            listingType: featureModalListing.listingType,
            listingId: featureModalListing._id,
            durationDays: 15
          }}
          onSuccess={() => {
            alert('Congratulations! Your listing is now FEATURED at the top of search results for 15 days.');
            setFeatureModalListing(null);
            fetchListings();
          }}
        />
      )}
    </div>
  );
}
