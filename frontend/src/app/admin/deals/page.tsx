'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import {
  Handshake,
  FileText,
  Calendar,
  DollarSign,
  User,
  Phone,
  MapPin,
  RefreshCw,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Shield
} from 'lucide-react';

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchDeals = async () => {
    setLoading(true);
    const res = await fetchApi('/admin/deals');
    if (res.success && res.data) setDeals(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchDeals(); }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'negotiating': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'accepted': return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
      case 'agreement_requested': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'agreement_completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'cancelled': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Handshake className="w-4 h-4" /> Platform Transactions
          </div>
          <h1 className="text-2xl font-black text-white">Deals & Rental Agreements Oversight</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor every confirmed deal, negotiation, and digital agreement across StayBite's ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDeals}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Deals', value: deals.length, color: 'text-white' },
          { label: 'Active / Negotiating', value: deals.filter(d => d.status === 'negotiating').length, color: 'text-amber-400' },
          { label: 'Accepted Deals', value: deals.filter(d => d.status === 'accepted').length, color: 'text-teal-400' },
          { label: 'Digital Agreements', value: deals.filter(d => d.status === 'agreement_completed').length, color: 'text-purple-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 block mb-1 font-semibold">{stat.label}</span>
            <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Deals Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-500" />
            Loading deals...
          </div>
        ) : deals.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Handshake className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-semibold text-slate-300">No deals recorded yet</p>
            <p className="text-xs mt-1">Confirmed deals between seekers and owners will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {deals.map((deal) => (
              <div key={deal._id} className="p-5 hover:bg-slate-900/30 transition">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                      <Handshake className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-white">
                          {deal.userId?.name || 'Seeker'} ↔ {deal.ownerId?.name || 'Owner'}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusColor(deal.status)}`}>
                          {deal.status?.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                        <span className="text-emerald-400 font-bold">₹{deal.finalRent?.toLocaleString('en-IN') || deal.negotiatedRent?.toLocaleString('en-IN')}/mo</span>
                        <span>•</span>
                        <span className="capitalize">{deal.listingType} listing</span>
                        {deal.agreementId && (
                          <>
                            <span>•</span>
                            <span className="text-purple-400 flex items-center gap-1">
                              <Shield className="w-3 h-3" /> Digital Agreement Created
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 self-start md:self-auto">
                    <span>{new Date(deal.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <button
                      onClick={() => setExpandedId(expandedId === deal._id ? null : deal._id)}
                      className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 text-slate-400 hover:text-white transition"
                    >
                      {expandedId === deal._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === deal._id && (
                  <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-900 p-3.5 rounded-xl space-y-2">
                      <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Seeker</span>
                      <div className="font-bold text-white">{deal.userId?.name}</div>
                      <div className="text-slate-400">{deal.userId?.phone}</div>
                      <div className="text-slate-400">{deal.userId?.email}</div>
                    </div>
                    <div className="bg-slate-900 p-3.5 rounded-xl space-y-2">
                      <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Owner</span>
                      <div className="font-bold text-white">{deal.ownerId?.name}</div>
                      <div className="text-slate-400">{deal.ownerId?.phone}</div>
                      <div className="text-slate-400">{deal.ownerId?.email}</div>
                    </div>
                    <div className="bg-slate-900 p-3.5 rounded-xl space-y-2">
                      <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Deal Details</span>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Agreed Rent:</span>
                        <span className="font-bold text-emerald-400">₹{(deal.finalRent || deal.negotiatedRent)?.toLocaleString('en-IN')}/mo</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Move-in:</span>
                        <span className="font-semibold text-white">
                          {deal.startDate ? new Date(deal.startDate).toLocaleDateString('en-IN') : 'TBD'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Agreement:</span>
                        <span className={`font-semibold ${deal.agreementId ? 'text-teal-400' : 'text-slate-500'}`}>
                          {deal.agreementId ? 'Signed ✓' : 'No agreement'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
