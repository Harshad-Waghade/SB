'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../lib/api';
import { RoomCard } from '../components/RoomCard';
import { MessCard } from '../components/MessCard';
import { EnquiryModal } from '../components/EnquiryModal';
import {
  Search,
  MapPin,
  Bed,
  UtensilsCrossed,
  ShieldCheck,
  FileCheck,
  Zap,
  Users,
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Download,
  Building,
  Home,
  ChevronRight,
  HelpCircle,
  Plus
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'rooms' | 'mess'>('rooms');
  const [searchCity, setSearchCity] = useState('Nagpur');
  const [searchQuery, setSearchQuery] = useState('');

  const [featuredRooms, setFeaturedRooms] = useState<any[]>([]);
  const [featuredMesses, setFeaturedMesses] = useState<any[]>([]);
  const [systemConfig, setSystemConfig] = useState<any>(null);
  const [selectedListingForEnquiry, setSelectedListingForEnquiry] = useState<any>(null);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    // Fetch featured rooms
    fetchApi('/rooms/featured').then((res) => {
      if (res.success && res.data) setFeaturedRooms(res.data);
    });

    // Fetch featured messes
    fetchApi('/messes/featured').then((res) => {
      if (res.success && res.data) setFeaturedMesses(res.data);
    });

    // Fetch system config (popular cities, banners, categories)
    fetchApi('/config/public').then((res) => {
      if (res.success && res.data) setSystemConfig(res.data);
    });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'rooms') {
      router.push(`/rooms?city=${encodeURIComponent(searchCity)}&query=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/mess?city=${encodeURIComponent(searchCity)}&query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const popularCities = systemConfig?.popularCities || [
    { name: 'Nagpur', state: 'Maharashtra', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80', listingCount: 45 },
    { name: 'Pune', state: 'Maharashtra', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80', listingCount: 68 },
    { name: 'Mumbai', state: 'Maharashtra', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80', listingCount: 82 },
    { name: 'Hyderabad', state: 'Telangana', image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80', listingCount: 39 },
    { name: 'Bengaluru', state: 'Karnataka', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80', listingCount: 94 }
  ];

  const faqs = [
    {
      q: 'How does StayBite verify rooms and mess listings?',
      a: 'Every property and mess listing on StayBite goes through an Admin review process where owner identity documents (Aadhaar/Electricity bill) and FSSAI hygiene certificates are verified before listings are approved with the "StayBite Verified" badge.'
    },
    {
      q: 'Can I generate a legally compliant rental agreement online?',
      a: 'Yes! When a room deal is agreed between tenant and owner, StayBite allows you to generate a standardized Digital Rental Agreement with customized rent, deposit, lock-in period, and terms, complete with digital signatures and instant PDF download.'
    },
    {
      q: 'Is there any brokerage or hidden commission for students?',
      a: 'StayBite connects you directly with genuine room and mess owners. There are zero hidden brokerage fees. You can enquire, chat, and negotiate transparently.'
    },
    {
      q: 'How do monthly mess subscriptions and daily tiffin delivery work?',
      a: 'You can explore weekly menus, daily timings, and choose between Pure Veg, Non-Veg, or Jain meal options. Mess owners provide either dining hall access or daily doorstep tiffin delivery to your PG or office.'
    },
    {
      q: 'How can room or mess owners list their property on StayBite?',
      a: 'Owners can register for free, click "Add Listing", upload photos/videos, set pricing and house rules, and submit for verification. Approved listings go live within hours to thousands of verified students and professionals.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Ambient Gradient Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-orange-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            {/* Startup Pill Tag */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-teal-400 mb-6 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>India's #1 Student & Professional Accommodation Network</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
              Find Your <span className="gradient-text-teal-orange">Stay.</span><br />
              Find Your <span className="text-orange-400">Food.</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
              Discover verified rooms, PGs, hostels, and authentic daily messes near your college or workplace. Zero brokerage, instant owner connect, and digital agreements.
            </p>
          </div>

          {/* DYNAMIC SEARCH BOX */}
          <div className="max-w-4xl mx-auto glass-panel p-4 sm:p-6 rounded-3xl shadow-2xl border border-slate-700/60">
            {/* Category Toggle Tabs */}
            <div className="flex items-center space-x-2 mb-4 border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('rooms')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'rooms'
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Bed className="w-4 h-4" />
                <span>{t('roomsCategory')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('mess')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'mess'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>{t('messCategory')}</span>
              </button>
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* City Dropdown */}
              <div className="md:col-span-4 relative">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 pl-1">
                  Location (City)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-teal-400 absolute left-3.5 top-3.5" />
                  <select
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-white text-sm font-medium focus:border-teal-500 focus:outline-none appearance-none"
                  >
                    <option value="Nagpur">Nagpur (VNIT, Dharampeth, Laxmi Nagar)</option>
                    <option value="Pune">Pune (Hinjewadi, Kothrud, Viman Nagar)</option>
                    <option value="Mumbai">Mumbai (Andheri, Powai, Bandra)</option>
                    <option value="Hyderabad">Hyderabad (Hitec City, Madhapur, Gachibowli)</option>
                    <option value="Bengaluru">Bengaluru (Koramangala, Indiranagar, HSR)</option>
                  </select>
                </div>
              </div>

              {/* Keyword / Locality Search */}
              <div className="md:col-span-5 relative">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 pl-1">
                  {activeTab === 'rooms' ? 'Room Type or Locality' : 'Mess Name, Veg/Non-Veg, Tiffin'}
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      activeTab === 'rooms'
                        ? 'e.g. Single Room, PG near VNIT, AC Flat...'
                        : 'e.g. Pure Veg, Jain Thali, Tiffin Service...'
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="md:col-span-3 flex items-end">
                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-xl flex items-center justify-center space-x-2 transition ${
                    activeTab === 'rooms'
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-teal-950/50'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-950/50'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>{activeTab === 'rooms' ? t('searchRoomsBtn') : t('findMessBtn')}</span>
                </button>
              </div>
            </form>

            {/* Quick Filter Tags */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto text-xs text-slate-400 scrollbar-none">
              <span className="font-semibold text-slate-300 flex-shrink-0">Trending:</span>
              <Link href="/rooms?roomType=pg&city=Nagpur" className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex-shrink-0">
                PG near VNIT Nagpur
              </Link>
              <Link href="/rooms?city=Pune&locality=Hinjewadi" className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex-shrink-0">
                IT Park Hinjewadi PGs
              </Link>
              <Link href="/mess?mealType=veg" className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex-shrink-0">
                Homely Veg Messes
              </Link>
              <Link href="/mess?tiffinService=true" className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex-shrink-0">
                Doorstep Tiffin
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CITIES */}
      <section className="py-12 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {t('popularLocations')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Explore student hubs, educational clusters, and IT corridors
              </p>
            </div>
            <Link
              href="/rooms"
              className="text-xs sm:text-sm font-semibold text-teal-400 hover:text-teal-300 flex items-center space-x-1"
            >
              <span>View All Cities</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {popularCities.map((city: any) => (
              <Link
                key={city.name}
                href={`/rooms?city=${encodeURIComponent(city.name)}`}
                className="group relative h-48 rounded-2xl overflow-hidden border border-slate-800 hover:border-teal-500/50 shadow-lg transition-all"
              >
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10">
                  <h3 className="font-bold text-white text-base group-hover:text-teal-400 transition-colors">
                    {city.name}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 mt-0.5">
                    <span>{city.state}</span>
                    <span className="text-teal-400 font-semibold">{city.listingCount}+ Stays</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BROWSE CATEGORIES */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {t('browseCategories')}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Choose the accommodation or food option tailored to your lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                title: 'Single Rooms',
                desc: 'Private rooms for undisturbed focus',
                icon: <Bed className="w-6 h-6 text-teal-400" />,
                href: '/rooms?roomType=single'
              },
              {
                title: 'Shared PGs',
                desc: 'Budget-friendly 2 & 3 sharing with WiFi',
                icon: <Users className="w-6 h-6 text-blue-400" />,
                href: '/rooms?roomType=pg'
              },
              {
                title: 'Student Hostels',
                desc: 'Warden managed near top colleges',
                icon: <Building className="w-6 h-6 text-indigo-400" />,
                href: '/rooms?roomType=hostel'
              },
              {
                title: 'Daily & Monthly Mess',
                desc: 'Veg, Non-Veg & Satvik thalis',
                icon: <UtensilsCrossed className="w-6 h-6 text-orange-400" />,
                href: '/mess?mealType=veg'
              },
              {
                title: 'Home Tiffin Delivery',
                desc: 'Fresh homemade meals to doorstep',
                icon: <Zap className="w-6 h-6 text-amber-400" />,
                href: '/mess?tiffinService=true'
              }
            ].map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800/80 transition-all flex flex-col justify-between group shadow-md"
              >
                <div className="p-3 rounded-xl bg-slate-800 w-fit mb-4 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-teal-400 transition-colors mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED ROOMS & PGS */}
      <section className="py-12 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {t('featuredRooms')}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Hand-picked, high-rated rooms with verified amenities and genuine photos
              </p>
            </div>
            <Link
              href="/rooms"
              className="text-xs sm:text-sm font-semibold text-teal-400 hover:text-teal-300 flex items-center space-x-1"
            >
              <span>Explore All Rooms</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onEnquireClick={(r) => setSelectedListingForEnquiry({ ...r, listingType: 'room' })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED MESSES & TIFFINS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
                  <UtensilsCrossed className="w-4 h-4" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {t('featuredMesses')}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Hygienic daily mess, healthy tiffin subscriptions, and authentic regional cuisines
              </p>
            </div>
            <Link
              href="/mess"
              className="text-xs sm:text-sm font-semibold text-orange-400 hover:text-orange-300 flex items-center space-x-1"
            >
              <span>Explore All Messes</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMesses.map((mess) => (
              <MessCard
                key={mess._id}
                mess={mess}
                onEnquireClick={(m) => setSelectedListingForEnquiry({ ...m, listingType: 'mess' })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW STAYBITE WORKS */}
      <section className="py-16 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
              Simple 5-Step Process
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-1">
              {t('howItWorks')}
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              From discovering your ideal room to locking in your lease agreement and eating healthy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {[
              { step: '1', title: 'Search', desc: 'Browse verified rooms & messes filtered by college distance & budget.', icon: <Search className="w-5 h-5 text-teal-400" /> },
              { step: '2', title: 'Connect', desc: 'Direct WhatsApp, instant phone call, or in-app live chat with verified owners.', icon: <PhoneCall className="w-5 h-5 text-blue-400" /> },
              { step: '3', title: 'Visit', desc: 'Schedule an in-person property visit or inspect food preparation cleanliness.', icon: <MapPin className="w-5 h-5 text-indigo-400" /> },
              { step: '4', title: 'Deal', desc: 'Negotiate rent, confirm terms, and request a standardized Digital Rental Agreement.', icon: <FileCheck className="w-5 h-5 text-orange-400" /> },
              { step: '5', title: 'Stay & Eat', desc: 'Sign agreement digitally, move in comfortably, and enjoy daily hygienic meals.', icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" /> }
            ].map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center relative group hover:border-teal-500/50 transition-all shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <span className="text-[11px] font-mono font-bold text-teal-400 uppercase tracking-widest mb-1">
                  Step {s.step}
                </span>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHY STAYBITE */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {t('whyStayBite')}
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Designed specifically to solve real housing and food challenges in Indian cities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: '100% Verified Listings',
                desc: 'We physically inspect or document-verify properties and FSSAI hygiene standards before approval.',
                icon: <ShieldCheck className="w-6 h-6 text-teal-400" />
              },
              {
                title: 'Direct Owner Contact',
                desc: 'No middleman fees or broker interference. Talk directly to genuine property and mess owners.',
                icon: <Users className="w-6 h-6 text-orange-400" />
              },
              {
                title: 'Digital Legal Agreement',
                desc: 'Generate, customize, and e-sign digital rental lease agreements in 2 minutes with PDF download.',
                icon: <FileCheck className="w-6 h-6 text-emerald-400" />
              },
              {
                title: 'Razorpay Secure Transactions',
                desc: 'Safe subscription and fee payments with automatic instant GST-compliant receipts.',
                icon: <Zap className="w-6 h-6 text-amber-400" />
              },
              {
                title: 'Multilingual Experience',
                desc: 'Easily navigate and browse listings in English, हिंदी (Hindi), and मराठी (Marathi).',
                icon: <Sparkles className="w-6 h-6 text-indigo-400" />
              },
              {
                title: 'Dedicated Dispute Support',
                desc: 'In-app customer ticketing system and owner moderation for a safe community.',
                icon: <HelpCircle className="w-6 h-6 text-rose-400" />
              }
            ].map((f, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-6 flex items-start space-x-4 transition shadow-md"
              >
                <div className="p-3 rounded-2xl bg-slate-800 flex-shrink-0">{f.icon}</div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1.5">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-16 bg-slate-900/30 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {t('testimonials')}
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Stories from students, techies, and property owners using StayBite
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Aarav Sharma',
                role: 'VNIT Nagpur Student',
                comment: 'Found my PG in Dharampeth within 2 hours of searching on StayBite. The college distance indicator is super helpful and the Digital Agreement saved me paperwork hassle.',
                rating: 5,
                city: 'Nagpur'
              },
              {
                name: 'Priya Nair',
                role: 'Software Engineer @ Infosys',
                comment: 'The mess subscription section is a lifesaver! I get hot, homely tiffin delivered to my desk every lunch. Mangala Tai\'s food is truly delicious.',
                rating: 5,
                city: 'Pune'
              },
              {
                name: 'Ramesh Deshpande',
                role: 'PG Owner (Shree Residency)',
                comment: 'StayBite gave me 15+ verified student leads in the first week itself. Zero fake calls and managing enquiries through the owner dashboard is effortless.',
                rating: 5,
                city: 'Nagpur'
              }
            ].map((test, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center space-x-1 mb-4 text-amber-400">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                    "{test.comment}"
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{test.name}</h4>
                    <p className="text-[11px] text-teal-400">{test.role} • {test.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white tracking-tight">{t('faq')}</h2>
            <p className="text-sm text-slate-400 mt-1">Got questions? We've got answers.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-white hover:text-teal-400 transition"
                  >
                    <span>{faq.q}</span>
                    <Plus className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-45 text-teal-400' : 'text-slate-400'}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. PWA DOWNLOAD CALLOUT */}
      <section className="py-16 bg-gradient-to-r from-teal-950/60 via-slate-900 to-orange-950/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-teal-900/40 via-slate-900 to-orange-900/40 border border-teal-500/30 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="max-w-xl">
              <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Download className="w-4 h-4" />
                <span>Fast & Offline Ready</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
                Experience StayBite as a Mobile App
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Install StayBite directly onto your home screen. Get instant lead notifications, chat seamlessly with owners, and search offline with zero app store downloads.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => alert('Tap your browser options menu and select "Add to Home Screen" or click Install on the banner.')}
                  className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-teal-950/50 flex items-center space-x-2 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Install StayBite PWA</span>
                </button>
                <Link
                  href="/rooms"
                  className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition"
                >
                  Browse Web Version
                </Link>
              </div>
            </div>

            <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex-shrink-0 drop-shadow-2xl">
              <Image src="/logo.png" alt="StayBite App" fill className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      {selectedListingForEnquiry && (
        <EnquiryModal
          isOpen={true}
          onClose={() => setSelectedListingForEnquiry(null)}
          listing={selectedListingForEnquiry}
        />
      )}
    </div>
  );
}
