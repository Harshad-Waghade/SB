'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { fetchApi } from '../../../lib/api';
import { EnquiryModal } from '../../../components/EnquiryModal';
import {
  MapPin,
  Star,
  ShieldCheck,
  Heart,
  Phone,
  MessageSquare,
  Share2,
  Flag,
  Calendar,
  CheckCircle2,
  Building,
  Users,
  Wifi,
  Sparkles,
  IndianRupee,
  Clock,
  ArrowLeft,
  Lock,
  Send
} from 'lucide-react';

export default function RoomDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [room, setRoom] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  // Enquiry Modal
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    // Fetch room details
    fetchApi(`/rooms/${id}`).then((res) => {
      setIsLoading(false);
      if (res.success && res.data) {
        setRoom(res.data);
      }
    });

    // Fetch reviews
    fetchApi(`/reviews/room/${id}`).then((res) => {
      if (res.success && res.data) {
        setReviews(res.data);
      }
    });
  }, [id]);

  const handleFavorite = async () => {
    if (!user) {
      alert('Please log in to save to favorites');
      return;
    }
    const res = await fetchApi('/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify({ listingType: 'room', listingId: id })
    });
    if (res.success) {
      setIsFav(res.isFavorite);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: room?.title,
        text: `Check out ${room?.title} on StayBite:`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleStartChat = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    const res = await fetchApi('/chat/start', {
      method: 'POST',
      body: JSON.stringify({
        recipientId: room?.ownerId?._id || room?.ownerId,
        listingType: 'room',
        listingId: room?._id
      })
    });
    if (res.success && res.data) {
      router.push(`/messages?conversationId=${res.data._id}`);
    }
  };

  const handleWhatsApp = () => {
    const rawPhone = room?.ownerId?.phone || '9876543210';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hi, I saw your room "${room?.title}" on StayBite and I am interested. Please share availability.`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to write a review');
      return;
    }
    setReviewSubmitting(true);
    const res = await fetchApi('/reviews', {
      method: 'POST',
      body: JSON.stringify({
        listingType: 'room',
        listingId: id,
        rating: newRating,
        title: newTitle,
        comment: newComment
      })
    });
    setReviewSubmitting(false);
    if (res.success && res.data) {
      setReviews([res.data, ...reviews]);
      setNewTitle('');
      setNewComment('');
      alert('Thank you! Your review has been published.');
    } else {
      alert(res.message || 'Failed to submit review');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 py-12 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-slate-950 py-20 text-center text-white">
        <h2 className="text-2xl font-bold">Room listing not found.</h2>
        <Link href="/rooms" className="text-teal-400 mt-4 inline-block">
          ← Back to all rooms
        </Link>
      </div>
    );
  }

  const galleryImages = room.images && room.images.length > 0
    ? room.images
    : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* BREADCRUMB & TOP ACTIONS */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/rooms"
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to search</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleFavorite}
              className={`p-2.5 rounded-2xl border transition flex items-center space-x-1.5 text-xs font-semibold ${
                isFav
                  ? 'border-rose-500 bg-rose-500/20 text-rose-400'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400' : ''}`} />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* IMAGE GALLERY SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
          {/* Main Large Photo */}
          <div className="lg:col-span-8 relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
            <Image
              src={galleryImages[activeImageIndex]}
              alt={room.title}
              fill
              className="object-cover"
              priority
            />
            {room.verifiedBadge && (
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-teal-500/90 text-white text-xs font-bold backdrop-blur-md flex items-center space-x-1 shadow-lg">
                <ShieldCheck className="w-4 h-4" />
                <span>StayBite Verified ✓</span>
              </div>
            )}
          </div>

          {/* Side Thumbnails */}
          <div className="lg:col-span-4 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[480px] scrollbar-none">
            {galleryImages.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative flex-shrink-0 w-28 lg:w-full aspect-[16/10] rounded-2xl overflow-hidden border-2 transition ${
                  activeImageIndex === idx ? 'border-teal-500 scale-[0.98]' : 'border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`Photo ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* MAIN DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: ROOM SPECS, AMENITIES, DISTANCES, REVIEWS */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Pricing Overview Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-bold uppercase">
                  {room.roomType} • {room.sharingType.replace('_', ' ')}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium capitalize">
                  {room.genderPreference === 'all' ? 'Co-living (All)' : `${room.genderPreference} Only`}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium capitalize">
                  {room.furnishedStatus.replace('-', ' ')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                {room.title}
              </h1>

              <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
                <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>{room.address}, {room.locality}, {room.city} - {room.pincode}</span>
              </div>

              {/* Price Breakdown Highlights */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-850/80 border border-slate-800 text-center">
                <div>
                  <div className="text-xs text-slate-400">Monthly Rent</div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    ₹{room.rent.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="border-x border-slate-800">
                  <div className="text-xs text-slate-400">Security Deposit</div>
                  <div className="text-lg sm:text-xl font-bold text-teal-400 mt-0.5">
                    ₹{room.deposit.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Maintenance</div>
                  <div className="text-lg sm:text-xl font-bold text-slate-300 mt-0.5">
                    {room.maintenanceCharges ? `₹${room.maintenanceCharges}` : 'Included'}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-3">About this Property</h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {room.description}
              </p>
            </div>

            {/* Nearby Colleges & Workplaces Distances */}
            {((room.collegeDistances && room.collegeDistances.length > 0) || (room.workplaceDistances && room.workplaceDistances.length > 0)) && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-4">Nearby Institutions & IT Hubs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {room.collegeDistances?.map((c: any, i: number) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">🎓 {c.collegeName}</span>
                      <span className="text-teal-400 font-bold">{c.distanceKm} km away</span>
                    </div>
                  ))}
                  {room.workplaceDistances?.map((w: any, i: number) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">💼 {w.workplaceName}</span>
                      <span className="text-orange-400 font-bold">{w.distanceKm} km away</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities Grid */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-4">{t('amenities')}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {room.amenities?.map((amenity: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-800/60 border border-slate-800/80 flex items-center space-x-2 text-xs font-medium text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            {room.rules && room.rules.length > 0 && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-3">{t('rules')}</h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {room.rules.map((rule: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-orange-400 font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* REVIEWS & RATINGS */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Ratings & Reviews</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1 text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="font-bold text-sm text-white">{room.ratings?.average || 4.8}</span>
                    </div>
                    <span className="text-xs text-slate-400">based on {reviews.length} genuine reviews</span>
                  </div>
                </div>
              </div>

              {/* Write Review Form */}
              <form onSubmit={handleSubmitReview} className="mb-8 p-4 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Leave a Review</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Your Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-400"
                    >
                      <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'opacity-40'}`} />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Review Title (e.g. Great PG near college)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:border-teal-500 focus:outline-none"
                />
                <textarea
                  rows={2}
                  placeholder="Share your stay experience, food, wifi, owner responsiveness..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:border-teal-500 focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs transition"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Post Review'}
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to review this stay!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev._id} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center">
                            {rev.userId?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white">{rev.userId?.name || 'Verified Seeker'}</span>
                            <span className="text-[10px] text-slate-400 block">{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <h5 className="text-xs font-bold text-slate-200">{rev.title}</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                      {rev.ownerReply && (
                        <div className="mt-2 p-2.5 rounded-xl bg-slate-900 border border-slate-700/60 text-xs">
                          <span className="text-teal-400 font-semibold block mb-0.5">Owner Reply:</span>
                          <span className="text-slate-300">{rev.ownerReply.comment}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: OWNER PROFILE & ACTION PANEL */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 sticky top-28 space-y-6 shadow-2xl">
              {/* Owner Info Card */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {room.ownerId?.name?.charAt(0) || 'O'}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span>{room.ownerId?.name || 'Verified Owner'}</span>
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                  </h4>
                  <p className="text-xs text-teal-400">Verified Property Partner</p>
                  <p className="text-[11px] text-slate-400">Response time: ~10 minutes</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-teal-950/50 flex items-center justify-center space-x-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Free Enquiry</span>
                </button>

                <button
                  onClick={handleStartChat}
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 border border-slate-700 transition"
                >
                  <MessageSquare className="w-4 h-4 text-teal-400" />
                  <span>Live Chat with Owner</span>
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 font-semibold text-xs flex items-center justify-center space-x-2 border border-emerald-800/50 transition"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Owner Direct</span>
                </button>
              </div>

              {/* StayBite Safety & Agreement Promise */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs space-y-2 text-slate-400">
                <div className="flex items-center space-x-2 text-slate-200 font-semibold">
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                  <span>StayBite Safe Rental Guarantee</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Lock this room with zero brokerage. Generate an enforceable Digital Rental Agreement directly from your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {isEnquiryOpen && (
        <EnquiryModal
          isOpen={true}
          onClose={() => setIsEnquiryOpen(false)}
          listing={{ ...room, listingType: 'room' }}
        />
      )}
    </div>
  );
}
