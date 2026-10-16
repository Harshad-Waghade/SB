'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-teal-500/40">
                <Image src="/logo.png" alt="StayBite Logo" fill className="object-cover" />
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight">
                  STAY<span className="text-teal-400">BITE</span>
                </span>
                <p className="text-xs text-orange-400 font-medium">"Find Your Stay. Find Your Food."</p>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India's premier verified ecosystem connecting students and working professionals with quality PGs, hostels, private rooms, and authentic daily mess and tiffin services.
            </p>
            <div className="flex items-center space-x-2 text-xs text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Listings & Digital Legal Agreements</span>
            </div>
          </div>

          {/* Col 2: Popular Cities */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Popular Cities</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/rooms?city=Nagpur" className="hover:text-teal-400 transition">
                  Rooms in Nagpur (VNIT, Dharampeth)
                </Link>
              </li>
              <li>
                <Link href="/rooms?city=Pune" className="hover:text-teal-400 transition">
                  PGs in Pune (Hinjewadi, Kothrud)
                </Link>
              </li>
              <li>
                <Link href="/rooms?city=Mumbai" className="hover:text-teal-400 transition">
                  Hostels in Mumbai (Andheri, BKC)
                </Link>
              </li>
              <li>
                <Link href="/rooms?city=Hyderabad" className="hover:text-teal-400 transition">
                  Coliving in Hyderabad (Hitec City)
                </Link>
              </li>
              <li>
                <Link href="/rooms?city=Bengaluru" className="hover:text-teal-400 transition">
                  Suites in Bengaluru (Koramangala)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Food & Messes */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Messes & Tiffins</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/mess?city=Nagpur" className="hover:text-teal-400 transition">
                  Annapurna Mess Nagpur
                </Link>
              </li>
              <li>
                <Link href="/mess?mealType=veg" className="hover:text-teal-400 transition">
                  Pure Veg Dining Halls
                </Link>
              </li>
              <li>
                <Link href="/mess?mealType=jain" className="hover:text-teal-400 transition">
                  Jain & Satvik Food Services
                </Link>
              </li>
              <li>
                <Link href="/mess?tiffinService=true" className="hover:text-teal-400 transition">
                  Daily Office Tiffin Delivery
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-teal-400 transition">
                  Monthly Meal Subscriptions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Support & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/how-it-works" className="hover:text-teal-400 transition">
                  {t('howItWorks')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-teal-400 transition">
                  {t('pricing')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-teal-400 transition">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-teal-400 transition">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-teal-400 transition">
                  {t('refund')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} StayBite Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Students & Professionals across India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
