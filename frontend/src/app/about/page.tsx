'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Heart,
  Users,
  Target,
  Award,
  Sparkles,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <Sparkles className="w-3.5 h-3.5" /> Our Mission & Story
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Find Your Stay. Find Your Food.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            StayBite was founded with a singular mission: to make relocating for education and career in Indian cities completely stress-free, broker-free, and affordable.
          </p>
        </div>

        {/* Vision & Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Verified Properties Only</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every room, PG, and mess service listed on StayBite goes through an administrative verification check to ensure genuine photos, accurate pricing, and authentic hosts.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Zero Middleman Brokerage</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We connect seekers and property owners directly via live chat, scheduled visits, and transparent negotiation — saving tenants up to ₹15,000 in upfront broker commissions.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Digital Tenancy Agreements</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our automated agreement generator drafts legally compliant rental contracts with e-signature capabilities, ensuring tenant protection and clear terms for owners.
            </p>
          </div>
        </div>

        {/* Statistics Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <span className="text-3xl sm:text-4xl font-black text-teal-400">5+</span>
              <span className="text-xs text-slate-300 block mt-1">Major Indian Cities</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-emerald-400">100%</span>
              <span className="text-xs text-slate-300 block mt-1">Verified Hosts</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-amber-400">₹0</span>
              <span className="text-xs text-slate-300 block mt-1">Brokerage Fee</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-purple-400">24/7</span>
              <span className="text-xs text-slate-300 block mt-1">Digital Support</span>
            </div>
          </div>
        </div>

        {/* Cities We Serve */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 text-center">Cities Where StayBite Operates</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            {['Nagpur', 'Pune', 'Mumbai', 'Hyderabad', 'Bengaluru'].map((city) => (
              <div key={city} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <MapPin className="w-5 h-5 text-teal-600 mx-auto" />
                <span className="font-bold text-slate-900 text-xs block">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
