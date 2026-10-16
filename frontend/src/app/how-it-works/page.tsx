'use client';

import React from 'react';
import Link from 'next/link';
import {
  Search,
  MessageSquare,
  Calendar,
  Handshake,
  FileText,
  UtensilsCrossed,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function HowItWorksPage() {
  const seekerSteps = [
    {
      step: '01',
      title: 'Discover & Multi-Filter',
      description: 'Search verified rooms, PGs, hostels, and homemade mess services near your college or workplace. Filter by sharing, budget, AC, food preferences, and distance.',
      icon: Search,
      tag: 'Search'
    },
    {
      step: '02',
      title: 'Connect with Verified Owners',
      description: 'Send direct inquiries with your preferred move-in dates and budget offer. Chat in real-time or connect on WhatsApp without middleman broker fees.',
      icon: MessageSquare,
      tag: 'Connect'
    },
    {
      step: '03',
      title: 'Schedule a Visit & Taste Test',
      description: 'Schedule an in-person room inspection or a sample mess meal through the interactive scheduler on your dashboard.',
      icon: Calendar,
      tag: 'Visit'
    },
    {
      step: '04',
      title: 'Negotiate & Accept Deal',
      description: 'Finalize monthly rent and security deposits directly with the owner on StayBite with 100% price transparency.',
      icon: Handshake,
      tag: 'Deal'
    },
    {
      step: '05',
      title: 'Sign Digital Tenancy Agreement',
      description: 'Generate a legally structured digital tenancy agreement with e-signatures, avoiding expensive broker documentation fees.',
      icon: FileText,
      tag: 'Agreement'
    }
  ];

  const ownerSteps = [
    {
      step: '01',
      title: 'List Your Property or Mess',
      description: 'Use our simple 8-step wizard to upload photos, specify amenities, set rents, and outline house rules.',
      icon: Sparkles
    },
    {
      step: '02',
      title: 'Get StayBite Verified',
      description: 'Our admin team reviews your documents and photos to award the StayBite Verified badge (✓), boosting your listing reach 3x.',
      icon: ShieldCheck
    },
    {
      step: '03',
      title: 'Receive Pre-Qualified Leads',
      description: 'Get verified inquiries directly from students and working professionals with their move-in timelines and budget expectations.',
      icon: MessageSquare
    },
    {
      step: '04',
      title: 'Zero Brokerage Deals',
      description: 'Close tenancies and subscriptions without losing a single rupee to property brokers or listing agents.',
      icon: Handshake
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <Sparkles className="w-3.5 h-3.5" /> Fast, Transparent & Broker-Free
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How StayBite Works
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Connecting students, working professionals, room owners, and mess providers across India through a verified, digital-first platform.
          </p>
        </div>

        {/* Seeker Journey */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs uppercase font-bold text-teal-600 tracking-wider">For Seekers</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Your 5-Step Journey to Your New Home</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {seekerSteps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-black text-teal-600/40">{item.step}</span>
                      <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 uppercase self-start">
                    {item.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Owner Journey */}
        <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">For Property & Mess Owners</span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">Fill Your Vacancies 2x Faster</h2>
            <p className="text-xs text-slate-300 mt-2">No broker commissions, no spam inquiries — just verified students and employees.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ownerSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-bold text-teal-400">{step.step}</span>
                    <Icon className="w-5 h-5 text-teal-300" />
                  </div>
                  <h4 className="font-bold text-sm text-white">{step.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/owner/add-room"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-slate-950 font-black rounded-xl text-xs transition shadow-lg shadow-teal-500/20"
            >
              <span>List Your Room / Mess Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-slate-900">Ready to find your ideal room or mess?</h3>
            <p className="text-xs text-slate-500">Explore hundreds of verified listings across Nagpur, Pune, Mumbai and more.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/rooms"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
            >
              Browse Rooms
            </Link>
            <Link
              href="/mess"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
            >
              Browse Messes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
