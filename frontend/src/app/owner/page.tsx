'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { fetchApi } from '../../lib/api';
import {
  Home,
  Bed,
  UtensilsCrossed,
  PlusCircle,
  Users,
  Tag,
  TrendingUp,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  MessageSquare,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [rooms, setRooms] = useState<any[]>([]);
  const [messes, setMesses] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi('/rooms/owner-listings'),
      fetchApi('/messes/owner-listings'),
      fetchApi('/enquiries/my'),
      fetchApi('/deals/my')
    ]).then(([roomRes, messRes, leadRes, dealRes]) => {
      setIsLoading(false);
      if (roomRes.success && roomRes.data) setRooms(roomRes.data);
      if (messRes.success && messRes.data) setMesses(messRes.data);
      if (leadRes.success && leadRes.data) setLeads(leadRes.data);
      if (dealRes.success && dealRes.data) setDeals(dealRes.data);
    });
  }, []);

  const totalListings = rooms.length + messes.length;
  const approvedListings = [...rooms, ...messes].filter((l) => l.status === 'approved').length;
  const pendingListings = [...rooms, ...messes].filter((l) => l.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* HEADER */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Owner Control Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, {user?.name || 'Partner Owner'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage your properties, inspect student leads, and track revenue conversions
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/owner/add-room"
              className="px-4 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Room / PG</span>
            </Link>
            <Link
              href="/owner/add-mess"
              className="px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Mess Service</span>
            </Link>
          </div>
        </div>

        {/* METRICS OVERVIEW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Total Properties</span>
              <Home className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-white">{totalListings}</div>
            <div className="text-[11px] text-teal-400 mt-1 font-medium">{approvedListings} Live & Verified</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Pending Admin Review</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{pendingListings}</div>
            <div className="text-[11px] text-slate-400 mt-1">Verification in progress</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Tenant Leads</span>
              <Users className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-black text-white">{leads.length}</div>
            <div className="text-[11px] text-orange-400 mt-1 font-medium">From verified students</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Deals Finalized</span>
              <Tag className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{deals.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">Leases active</div>
          </div>
        </div>

        {/* QUICK SHORTCUTS & RECENT LEADS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Leads */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-400" />
                <span>Recent Inquiries & Leads</span>
              </h3>
              <Link href="/owner/leads" className="text-xs font-semibold text-orange-400 hover:underline">
                View All Leads →
              </Link>
            </div>

            {leads.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No leads received yet. Promote your listings to get featured leads!</p>
            ) : (
              <div className="space-y-3">
                {leads.slice(0, 3).map((lead) => (
                  <div key={lead._id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-white text-sm">{lead.senderId?.name || 'Student Lead'}</div>
                      <p className="text-slate-400 line-clamp-1">"{lead.message}"</p>
                      <p className="text-[10px] text-teal-400 mt-0.5">Phone: {lead.phone} • Status: {lead.status}</p>
                    </div>
                    <Link
                      href="/owner/leads"
                      className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs text-center flex-shrink-0"
                    >
                      Respond / Schedule
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">Owner Shortcuts</h3>
            <div className="space-y-2.5">
              <Link
                href="/owner/listings"
                className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between text-xs font-semibold text-slate-200 transition"
              >
                <div className="flex items-center space-x-2">
                  <Home className="w-4 h-4 text-teal-400" />
                  <span>Manage All My Listings ({totalListings})</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/owner/analytics"
                className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between text-xs font-semibold text-slate-200 transition"
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                  <span>Listing Views & Lead Analytics</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/pricing"
                className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between text-xs font-semibold text-slate-200 transition"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Upgrade to Owner Pro (₹299/mo)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
