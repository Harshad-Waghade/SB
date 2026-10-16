'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { fetchApi } from '../../../lib/api';
import {
  UtensilsCrossed,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Plus,
  Sparkles,
  Clock,
  Truck
} from 'lucide-react';

export default function AddMessPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('Nagpur');
  const [locality, setLocality] = useState('Dharampeth');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('440010');

  const [monthlyPrice, setMonthlyPrice] = useState<number | string>(2800);
  const [dailyPrice, setDailyPrice] = useState<number | string>(110);
  const [mealType, setMealType] = useState('veg');

  const [tiffinService, setTiffinService] = useState(true);
  const [homeDelivery, setHomeDelivery] = useState(true);
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState(5);
  const [fssaiLicenseNumber, setFssaiLicenseNumber] = useState('');

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1613292443284-c73fe1674488?auto=format&fit=crop&w=1200&q=80'
  ]);

  const [weeklyMenu, setWeeklyMenu] = useState([
    { day: 'Monday', breakfast: 'Poha + Tea', lunch: 'Paneer Butter Masala, Dal Tadka, Rice, 4 Chapatis', dinner: 'Shev Bhaji, Dal, Rice, Chapatis' },
    { day: 'Tuesday', breakfast: 'Upma + Chutney', lunch: 'Aloo Gobi, Chana Masala, Rice, Chapatis', dinner: 'Baingan Bharta, Dal, Rice' },
    { day: 'Wednesday', breakfast: 'Idli Sambar', lunch: 'Chole Masala, Bhindi Fry, Dal, Rice, Chapatis', dinner: 'Mix Veg, Dal Tadka, Rice' },
    { day: 'Thursday', breakfast: 'Misal Pav', lunch: 'Palak Paneer, Aloo Jeera, Dal, Rice, Chapatis', dinner: 'Kadhi Pakoda, Khichdi, Papad' },
    { day: 'Friday', breakfast: 'Aloo Paratha + Dahi', lunch: 'Dal Makhani, Gobi Masala, Rice, Chapatis', dinner: 'Soyabean Curry, Dal, Rice' },
    { day: 'Saturday', breakfast: 'Sabudana Khichdi', lunch: 'Rajma Masala, Jeera Rice, Chapatis', dinner: 'Dal Fry, Jeera Rice, Bhaji' },
    { day: 'Sunday', breakfast: 'Poori Bhaji', lunch: 'Special Puran Poli / Gulab Jamun, Shahi Paneer, Pulav', dinner: 'Veg Biryani, Raita' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !address) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name,
      description,
      city,
      locality,
      address,
      pincode,
      monthlyPrice: Number(monthlyPrice),
      dailyPrice: Number(dailyPrice),
      mealType,
      tiffinService,
      homeDelivery,
      deliveryRadiusKm: Number(deliveryRadiusKm),
      fssaiLicenseNumber,
      images,
      weeklyMenu,
      facilities: ['Air Cooled Dining Hall', 'Pure RO Water', 'Stainless Steel Utensils', 'Doorstep Tiffin Delivery']
    };

    const res = await fetchApi('/messes', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    setIsSubmitting(false);

    if (res.success) {
      alert('Mess listing submitted successfully! Pending Admin verification.');
      router.push('/owner/listings');
    } else {
      alert(res.message || 'Failed to submit mess listing');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center space-x-3">
          <Link
            href="/owner"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-orange-400" />
              <span>Add New Mess / Tiffin Service</span>
            </h1>
            <p className="text-xs text-slate-400">List your meal plans, weekly menus, and delivery radius</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
              1. Mess & Kitchen Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mess Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Annapurna Pure Veg Maharashtrian Mess & Tiffin"
                className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Food Quality</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Describe your hygiene, oil quality, specials, unlimited chapati policy..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Subscription (₹)</label>
                <input
                  type="number"
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Meal Price (₹)</label>
                <input
                  type="number"
                  value={dailyPrice}
                  onChange={(e) => setDailyPrice(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Diet / Meal Type</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-orange-500 focus:outline-none"
                >
                  <option value="veg">Pure Veg 🟢</option>
                  <option value="both">Veg & Non-Veg 🟠</option>
                  <option value="jain">Jain Food Available 🟡</option>
                  <option value="non-veg">Non-Veg Only 🔴</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-orange-500 focus:outline-none"
                >
                  <option value="Nagpur">Nagpur</option>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Locality</label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">FSSAI License # (Optional)</label>
                <input
                  type="text"
                  value={fssaiLicenseNumber}
                  onChange={(e) => setFssaiLicenseNumber(e.target.value)}
                  placeholder="14-digit FSSAI number"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kitchen / Dining Hall Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Delivery Options */}
          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
              2. Delivery & Service Options
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tiffinService}
                  onChange={(e) => setTiffinService(e.target.checked)}
                  className="rounded bg-slate-800 text-orange-500"
                />
                <span>🍱 Provide Daily Tiffin Boxes</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={homeDelivery}
                  onChange={(e) => setHomeDelivery(e.target.checked)}
                  className="rounded bg-slate-800 text-orange-500"
                />
                <span>🚚 Doorstep Delivery to PGs/Offices</span>
              </label>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Delivery Radius (Km)</label>
                <input
                  type="number"
                  value={deliveryRadiusKm}
                  onChange={(e) => setDeliveryRadiusKm(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
              3. Kitchen & Food Photos
            </h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Paste Food / Dining Hall photo URL"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold"
              >
                Add Photo
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-slate-700 bg-slate-800">
                  <Image src={img} alt="Mess" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-xl shadow-orange-950/50 flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Mess for Admin Approval'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
