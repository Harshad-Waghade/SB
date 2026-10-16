'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { fetchApi } from '../../../lib/api';
import { EnquiryModal } from '../../../components/EnquiryModal';
import { PaymentModal } from '../../../components/PaymentModal';
import {
  MapPin,
  Star,
  ShieldCheck,
  Heart,
  Phone,
  MessageSquare,
  Share2,
  Calendar,
  CheckCircle2,
  UtensilsCrossed,
  Truck,
  Clock,
  ArrowLeft,
  Lock,
  Send,
  Sparkles
} from 'lucide-react';

export default function MessDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [mess, setMess] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Monday');
  const [isLoading, setIsLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  // Modals
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    fetchApi(`/messes/${id}`).then((res) => {
      setIsLoading(false);
      if (res.success && res.data) {
        setMess(res.data);
      }
    });

    fetchApi(`/reviews/mess/${id}`).then((res) => {
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
      body: JSON.stringify({ listingType: 'mess', listingId: id })
    });
    if (res.success) {
      setIsFav(res.isFavorite);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mess?.name,
        text: `Check out ${mess?.name} on StayBite:`,
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
        recipientId: mess?.ownerId?._id || mess?.ownerId,
        listingType: 'mess',
        listingId: mess?._id
      })
    });
    if (res.success && res.data) {
      router.push(`/messages?conversationId=${res.data._id}`);
    }
  };

  const handleWhatsApp = () => {
    const rawPhone = mess?.ownerId?.phone || '9876543210';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hi, I saw your mess "${mess?.name}" on StayBite. I would like to know more about monthly subscriptions and tiffin delivery.`);
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
        listingType: 'mess',
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
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!mess) {
    return (
      <div className="min-h-screen bg-slate-950 py-20 text-center text-white">
        <h2 className="text-2xl font-bold">Mess listing not found.</h2>
        <Link href="/mess" className="text-orange-400 mt-4 inline-block">
          ← Back to all messes
        </Link>
      </div>
    );
  }

  const galleryImages = mess.images && mess.images.length > 0
    ? mess.images
    : ['https://images.unsplash.com/photo-1613292443284-c73fe1674488?auto=format&fit=crop&w=1200&q=80'];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
  const currentDayMenu = mess.weeklyMenu?.find((m: any) => m.day === selectedDay) || {
    breakfast: 'Poha / Upma & Hot Chai',
    lunch: 'Paneer Butter Masala, Seasonal Sabzi, Dal Tadka, Steamed Rice, 4 Phulkas',
    dinner: 'Shev Bhaji, Dal Fry, Jeera Rice, 4 Phulkas'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* BREADCRUMB & TOP ACTIONS */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/mess"
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all messes</span>
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

        {/* IMAGE GALLERY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
          <div className="lg:col-span-8 relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
            <Image
              src={galleryImages[activeImageIndex]}
              alt={mess.name}
              fill
              className="object-cover"
              priority
            />
            {mess.verifiedBadge && (
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-teal-500/90 text-white text-xs font-bold backdrop-blur-md flex items-center space-x-1 shadow-lg">
                <ShieldCheck className="w-4 h-4" />
                <span>StayBite Food Verified ✓</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[480px] scrollbar-none">
            {galleryImages.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative flex-shrink-0 w-28 lg:w-full aspect-[16/10] rounded-2xl overflow-hidden border-2 transition ${
                  activeImageIndex === idx ? 'border-orange-500 scale-[0.98]' : 'border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`Photo ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* MAIN DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold uppercase">
                  {mess.mealType.toUpperCase()}
                </span>
                {mess.tiffinService && (
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
                    🍱 Tiffin Service
                  </span>
                )}
                {mess.homeDelivery && (
                  <span className="px-3 py-1 rounded-full bg-teal-950/60 border border-teal-800/40 text-teal-300 text-xs font-medium flex items-center gap-1">
                    <Truck className="w-3 h-3 text-teal-400" />
                    <span>Home Delivery ({mess.deliveryRadiusKm || 3}km)</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                {mess.name}
              </h1>

              <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>{mess.address}, {mess.locality}, {mess.city} - {mess.pincode}</span>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-850/80 border border-slate-800 text-center">
                <div>
                  <div className="text-xs text-slate-400">Monthly Meal Subscription</div>
                  <div className="text-2xl font-black text-white mt-0.5">
                    ₹{mess.monthlyPrice.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-400">/mo</span>
                  </div>
                </div>
                <div className="border-l border-slate-800">
                  <div className="text-xs text-slate-400">Daily Single Meal</div>
                  <div className="text-2xl font-black text-orange-400 mt-0.5">
                    ₹{mess.dailyPrice}
                    <span className="text-xs font-normal text-slate-400">/plate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* WEEKLY MENU SCHEDULE (Interactive Monday - Sunday Tabs) */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <UtensilsCrossed className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-bold text-white">{t('weeklyMenu')}</h3>
                </div>
                <span className="text-xs text-teal-400 font-semibold">Updated Weekly</span>
              </div>

              {/* Day Selector Tabs */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex-shrink-0 ${
                      selectedDay === day
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-950/50'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Current Selected Day Menu Items */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-750">
                  <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Breakfast (7:30 AM)</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {currentDayMenu.breakfast || 'Poha, Upma, or Idli Sambar + Special Masala Chai'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-750">
                  <div className="flex items-center space-x-1.5 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>Lunch (12:30 PM)</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {currentDayMenu.lunch || 'Paneer Butter Masala, Seasonal Sabzi, Dal Tadka, Steamed Rice, 4 Phulkas, Salad & Papad'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-750">
                  <div className="flex items-center space-x-1.5 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Dinner (7:30 PM)</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {currentDayMenu.dinner || 'Shev Bhaji, Dal Fry, Jeera Rice, 4 Phulkas, Pickle & Buttermilk'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description & Facilities */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-3">About this Mess / Kitchen</h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line mb-6">
                {mess.description}
              </p>

              {mess.facilities && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Kitchen Facilities</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {mess.facilities.map((fac: string, idx: number) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-800/60 border border-slate-800 text-xs font-medium text-slate-200 flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* REVIEWS & RATINGS */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Ratings & Customer Reviews</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1 text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="font-bold text-sm text-white">{mess.ratings?.average || 4.8}</span>
                    </div>
                    <span className="text-xs text-slate-400">({reviews.length} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Review Input */}
              <form onSubmit={handleSubmitReview} className="mb-8 p-4 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Review Food & Hygiene</h4>
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
                  placeholder="Review Title (e.g. Best homely taste and thin chapatis)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
                <textarea
                  rows={2}
                  placeholder="How was the taste, freshness, spice level, and delivery punctuality?"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:border-orange-500 focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Post Food Review'}
                </button>
              </form>

              {/* Review list */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to share food feedback!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev._id} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center">
                            {rev.userId?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white">{rev.userId?.name || 'Verified Food Seeker'}</span>
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
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: OWNER & SUBSCRIPTION ACTIONS */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 sticky top-28 space-y-6 shadow-2xl">
              {/* Owner Info */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {mess.ownerId?.name?.charAt(0) || 'M'}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span>{mess.ownerId?.name || 'Mess Master'}</span>
                    <ShieldCheck className="w-4 h-4 text-orange-400" />
                  </h4>
                  <p className="text-xs text-orange-400">FSSAI Certified Partner</p>
                  <p className="text-[11px] text-slate-400">Delivery starts 7:00 AM</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={() => setIsSubscribeOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-xl shadow-orange-950/50 flex items-center justify-center space-x-2 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Subscribe Monthly (₹{mess.monthlyPrice.toLocaleString('en-IN')})</span>
                </button>

                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="w-full py-3 rounded-2xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-semibold text-xs flex items-center justify-center space-x-2 border border-teal-500/40 transition"
                >
                  <Send className="w-4 h-4 text-teal-400" />
                  <span>Send Free Inquiry / Trial Request</span>
                </button>

                <button
                  onClick={handleStartChat}
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 border border-slate-700 transition"
                >
                  <MessageSquare className="w-4 h-4 text-orange-400" />
                  <span>Chat with Mess Owner</span>
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 font-semibold text-xs flex items-center justify-center space-x-2 border border-emerald-800/50 transition"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp for Daily Menu</span>
                </button>
              </div>

              {/* Guarantee */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs space-y-2 text-slate-400">
                <div className="flex items-center space-x-2 text-slate-200 font-semibold">
                  <Lock className="w-3.5 h-3.5 text-orange-400" />
                  <span>StayBite Food Hygiene Guarantee</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Every mess operates under valid FSSAI standards. Easily pause or cancel subscriptions with 2 days prior notice.
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
          listing={{ ...mess, listingType: 'mess' }}
        />
      )}

      {/* Payment Modal for Instant Monthly Subscription */}
      {isSubscribeOpen && (
        <PaymentModal
          isOpen={true}
          onClose={() => setIsSubscribeOpen(false)}
          title={`Monthly Subscription: ${mess.name}`}
          amount={mess.monthlyPrice}
          purpose="subscription"
          metadata={{ listingType: 'mess', listingId: mess._id }}
          onSuccess={() => {
            alert('Congratulations! Your monthly meal subscription is active.');
            setIsSubscribeOpen(false);
          }}
        />
      )}
    </div>
  );
}
