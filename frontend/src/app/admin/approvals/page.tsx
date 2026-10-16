'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import {
  CheckSquare,
  Building,
  UtensilsCrossed,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Star,
  MapPin,
  Phone,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';

export default function AdminApprovalsPage() {
  const [activeTab, setActiveTab] = useState<'rooms' | 'messes'>('rooms');
  const [pendingRooms, setPendingRooms] = useState<any[]>([]);
  const [pendingMesses, setPendingMesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Action Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'changes_requested' | 'suspend'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    const res = await fetchApi('/admin/listings/pending');
    if (res.success) {
      setPendingRooms(res.rooms || []);
      setPendingMesses(res.messes || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const openReviewModal = (listing: any, action: 'approve' | 'reject' | 'changes_requested') => {
    setSelectedListing(listing);
    setReviewAction(action);
    setRejectionReason('');
    setAdminNotes('');
    setIsFeatured(Boolean(listing.isFeatured));
    setModalOpen(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;
    setSubmittingReview(true);

    const isRoom = Boolean(selectedListing.roomType);
    const payload = {
      listingType: isRoom ? 'room' : 'mess',
      listingId: selectedListing._id,
      action: reviewAction,
      rejectionReason: reviewAction === 'reject' ? rejectionReason : undefined,
      adminNotes: reviewAction === 'changes_requested' ? adminNotes : undefined,
      isFeatured,
      verifiedBadge: reviewAction === 'approve'
    };

    const res = await fetchApi('/admin/listings/review', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (res.success) {
      alert(`Listing marked as ${reviewAction.toUpperCase()} successfully!`);
      setModalOpen(false);
      setSelectedListing(null);
      fetchPending();
    } else {
      alert(res.message || 'Action failed');
    }
    setSubmittingReview(false);
  };

  const currentListings = activeTab === 'rooms' ? pendingRooms : pendingMesses;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" /> Moderation & Quality Control
          </div>
          <h1 className="text-2xl font-black text-white">Listing Verification Queue</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review room and mess property listings before they go public. Verify photos, amenities, prices, and owner credibility.
          </p>
        </div>
        <button
          onClick={fetchPending}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh List
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'rooms'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Pending Rooms ({pendingRooms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('messes')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'messes'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Pending Messes ({pendingMesses.length})</span>
        </button>
      </div>

      {/* Listings Container */}
      {loading ? (
        <div className="p-16 text-center bg-slate-950 rounded-2xl border border-slate-800">
          <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">Fetching pending verification requests...</p>
        </div>
      ) : currentListings.length === 0 ? (
        <div className="p-16 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
          <div className="w-16 h-16 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Pending {activeTab === 'rooms' ? 'Rooms' : 'Messes'}</h3>
          <p className="text-slate-400 max-w-md mx-auto text-xs leading-relaxed">
            All submitted {activeTab === 'rooms' ? 'rooms & PGs' : 'messes & tiffins'} have been reviewed. New submissions from owners will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {currentListings.map((item) => {
            const isRoom = Boolean(item.roomType);
            const title = item.title || item.name;
            const price = item.rent || item.monthlyPrice;

            return (
              <div
                key={item._id}
                className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl p-6 space-y-6 hover:border-slate-700 transition"
              >
                {/* Header Row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 relative">
                      {item.images?.[0] ? (
                        <img src={item.images[0]} alt={title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          {isRoom ? <Building className="w-8 h-8" /> : <UtensilsCrossed className="w-8 h-8" />}
                        </div>
                      )}
                      {item.images?.length > 1 && (
                        <span className="absolute bottom-1 right-1 bg-slate-900/80 text-[10px] text-white px-1.5 py-0.5 rounded font-bold">
                          +{item.images.length - 1}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isRoom ? 'bg-teal-500/20 text-teal-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {isRoom ? item.roomType : item.mealType}
                        </span>
                        <h3 className="text-lg font-bold text-white">{title}</h3>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock className="w-3 h-3" /> Awaiting Review
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {item.address || `${item.locality}, ${item.city}`}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-300 mt-2 font-medium">
                        <span className="text-emerald-400 font-bold text-sm">₹{price?.toLocaleString('en-IN')}/month</span>
                        {isRoom && item.deposit && <span>Deposit: ₹{item.deposit?.toLocaleString('en-IN')}</span>}
                        {isRoom && item.genderPreference && <span className="capitalize">For: {item.genderPreference}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Owner Badge */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1 self-start">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Submitted By Owner:</span>
                    <div className="font-bold text-white">{item.ownerId?.name || 'Owner Profile'}</div>
                    <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Phone className="w-3 h-3" /> {item.ownerId?.phone || 'No phone'}
                    </div>
                    <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Mail className="w-3 h-3" /> {item.ownerId?.email || 'No email'}
                    </div>
                  </div>
                </div>

                {/* Description & Amenities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                    <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Description & Highlights:</span>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {item.description || 'No detailed description provided by owner.'}
                    </p>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                    <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                      {isRoom ? 'Amenities Included:' : 'Mess & Tiffin Features:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(item.amenities || item.features || ['Wi-Fi', 'Water Supply', 'Attached Washroom']).map((amenity: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-[11px] font-medium border border-slate-700/60"
                        >
                          ✓ {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Photo Gallery Grid */}
                {item.images && item.images.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Listing Photos ({item.images.length}):</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {item.images.map((img: string, idx: number) => (
                        <a
                          key={idx}
                          href={img}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative rounded-xl overflow-hidden aspect-video bg-slate-800 border border-slate-700 block"
                        >
                          <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition" />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <ExternalLink className="w-4 h-4 text-white" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <Link
                    href={isRoom ? `/rooms/${item._id}` : `/mess/${item._id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
                  >
                    <Eye className="w-4 h-4" /> Preview Live Listing Page
                  </Link>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => openReviewModal(item, 'changes_requested')}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition"
                    >
                      Request Changes
                    </button>
                    <button
                      onClick={() => openReviewModal(item, 'reject')}
                      className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition"
                    >
                      Reject Listing
                    </button>
                    <button
                      onClick={() => openReviewModal(item, 'approve')}
                      className="px-5 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-slate-950 rounded-xl text-xs font-black transition shadow-lg shadow-teal-500/20 flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" /> Approve & Grant Verified Badge
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Action Modal */}
      {modalOpen && selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-800 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {reviewAction === 'approve' && <ShieldCheck className="w-5 h-5 text-teal-400" />}
                {reviewAction === 'reject' && <XCircle className="w-5 h-5 text-rose-400" />}
                {reviewAction === 'changes_requested' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                <h3 className="font-bold text-base capitalize">
                  {reviewAction === 'approve'
                    ? 'Approve Listing & Grant Verified Badge'
                    : reviewAction === 'reject'
                    ? 'Reject Listing'
                    : 'Request Changes from Owner'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Listing:</span>
                <span className="font-bold text-white text-sm">
                  {selectedListing.title || selectedListing.name}
                </span>
                <span className="text-slate-400 block mt-0.5">
                  Owner: {selectedListing.ownerId?.name || 'Owner'}
                </span>
              </div>

              {reviewAction === 'approve' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 space-y-1">
                    <p className="font-bold">✓ This listing will become immediately searchable and visible to all users.</p>
                    <p className="text-[11px] text-teal-200">The "StayBite Verified" trust badge will be awarded.</p>
                  </div>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-teal-500 focus:ring-0 bg-slate-900 border-slate-700"
                    />
                    <div>
                      <span className="font-bold text-white block">Feature on Homepage Carousel</span>
                      <span className="text-[10px] text-slate-400">Give high discovery placement on top cities</span>
                    </div>
                  </label>
                </div>
              )}

              {reviewAction === 'reject' && (
                <div>
                  <label className="block text-xs font-semibold text-rose-300 mb-1">
                    Rejection Reason (Sent to owner) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Blurry or unverified photos, duplicate listing, inaccurate location address."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              )}

              {reviewAction === 'changes_requested' && (
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    Requested Changes / Corrections *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Please upload at least 3 photos showing the room interior and attached washroom."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className={`px-5 py-2 font-bold rounded-xl shadow-lg transition ${
                    reviewAction === 'approve'
                      ? 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                      : reviewAction === 'reject'
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  {submittingReview ? 'Submitting...' : 'Confirm Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
