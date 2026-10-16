'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import {
  Users,
  Building,
  UtensilsCrossed,
  CheckCircle,
  Clock,
  Handshake,
  CreditCard,
  AlertCircle,
  FileText,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckSquare,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [pendingListings, setPendingListings] = useState<any>({ rooms: [], messes: [] });
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    const [statsRes, pendingRes] = await Promise.all([
      fetchApi('/admin/stats'),
      fetchApi('/admin/listings/pending')
    ]);

    if (statsRes.success && statsRes.stats) {
      setStats(statsRes.stats);
    }
    if (pendingRes.success) {
      setPendingListings({
        rooms: pendingRes.rooms || [],
        messes: pendingRes.messes || []
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleQuickApprove = async (listingType: 'room' | 'mess', listingId: string) => {
    setApprovingId(listingId);
    const res = await fetchApi('/admin/listings/review', {
      method: 'POST',
      body: JSON.stringify({
        listingType,
        listingId,
        action: 'approve',
        verifiedBadge: true
      })
    });

    if (res.success) {
      alert('Listing approved and verified successfully!');
      loadAdminData();
    } else {
      alert(res.message || 'Approval failed');
    }
    setApprovingId(null);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> StayBite Mission Control
          </div>
          <h1 className="text-2xl font-black text-white">Platform Administration Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage verified listings, monitor payments, approve digital agreements, and oversee user permissions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadAdminData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
          <Link
            href="/admin/approvals"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-teal-500/20"
          >
            <CheckSquare className="w-4 h-4" />
            Approvals Queue ({stats?.listings?.totalPending || 0})
          </Link>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-white">
            {stats?.users?.total ?? 0}
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="text-teal-400 font-semibold">{stats?.users?.students ?? 0} Students</span>
            <span>•</span>
            <span className="text-blue-400 font-semibold">{stats?.users?.roomOwners + stats?.users?.messOwners ?? 0} Owners</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-emerald-400">
            ₹{stats?.revenue?.total?.toLocaleString('en-IN') ?? 0}
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
            <span>{stats?.revenue?.transactionCount ?? 0} successful orders</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-amber-400">
            {stats?.listings?.totalPending ?? 0}
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{stats?.listings?.pendingRooms ?? 0} rooms</span>
            <span>{stats?.listings?.pendingMesses ?? 0} messes</span>
          </div>
        </div>

        {/* Deals & Agreements */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deals & Leases</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Handshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-purple-400">
            {stats?.deals?.total ?? 0}
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="text-purple-400 font-semibold">{stats?.deals?.agreements ?? 0} Digital Agreements</span>
          </div>
        </div>
      </div>

      {/* Pending Listings Quick Queue */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Pending Listing Verification Queue
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review new rooms and messes submitted by owners before granting the Verified badge.
            </p>
          </div>
          <Link
            href="/admin/approvals"
            className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
          >
            Full Review Queue &rarr;
          </Link>
        </div>

        {pendingListings.rooms.length === 0 && pendingListings.messes.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CheckCircle className="w-12 h-12 text-teal-400 mx-auto mb-3 opacity-60" />
            <p className="text-sm font-semibold text-white">All caught up!</p>
            <p className="text-xs text-slate-500 mt-1">No pending listings waiting for verification.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {/* Pending Rooms */}
            {pendingListings.rooms.slice(0, 3).map((room: any) => (
              <div key={room._id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-900/50 transition">
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
                    {room.images?.[0] ? (
                      <img src={room.images[0]} alt={room.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <Building className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-500/20 text-teal-400">
                        Room / PG
                      </span>
                      <h4 className="text-sm font-bold text-white">{room.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {room.locality}, {room.city} • Owner: <span className="text-slate-300">{room.ownerId?.name || 'Owner'}</span> ({room.ownerId?.phone || 'No Phone'})
                    </p>
                    <div className="flex items-center gap-3 text-xs mt-1.5 text-slate-300">
                      <span className="font-bold text-emerald-400">₹{room.rent?.toLocaleString('en-IN')}/mo</span>
                      <span>•</span>
                      <span className="capitalize">{room.roomType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/rooms/${room._id}`}
                    target="_blank"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
                  >
                    Inspect
                  </Link>
                  <button
                    onClick={() => handleQuickApprove('room', room._id)}
                    disabled={approvingId === room._id}
                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 text-xs font-bold rounded-lg transition shadow-md"
                  >
                    {approvingId === room._id ? 'Approving...' : '✓ Approve & Verify'}
                  </button>
                </div>
              </div>
            ))}

            {/* Pending Messes */}
            {pendingListings.messes.slice(0, 3).map((mess: any) => (
              <div key={mess._id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-900/50 transition">
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
                    {mess.images?.[0] ? (
                      <img src={mess.images[0]} alt={mess.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <UtensilsCrossed className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-500/20 text-orange-400">
                        Mess / Tiffin
                      </span>
                      <h4 className="text-sm font-bold text-white">{mess.name}</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {mess.locality}, {mess.city} • Owner: <span className="text-slate-300">{mess.ownerId?.name || 'Owner'}</span>
                    </p>
                    <div className="flex items-center gap-3 text-xs mt-1.5 text-slate-300">
                      <span className="font-bold text-orange-400">₹{mess.monthlyPrice?.toLocaleString('en-IN')}/mo</span>
                      <span>•</span>
                      <span className="capitalize">{mess.mealType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/mess/${mess._id}`}
                    target="_blank"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
                  >
                    Inspect
                  </Link>
                  <button
                    onClick={() => handleQuickApprove('mess', mess._id)}
                    disabled={approvingId === mess._id}
                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 text-xs font-bold rounded-lg transition shadow-md"
                  >
                    {approvingId === mess._id ? 'Approving...' : '✓ Approve & Verify'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Platform Breakdown and Fast Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Breakdown */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-400" />
            User Demographic Distribution
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Students</span>
              <span className="font-bold text-white">{stats?.users?.students ?? 0}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-teal-500 h-2 rounded-full"
                style={{ width: `${((stats?.users?.students || 0) / Math.max(1, stats?.users?.total || 1)) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-slate-300 pt-1">
              <span>Employed Professionals</span>
              <span className="font-bold text-white">{stats?.users?.employed ?? 0}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${((stats?.users?.employed || 0) / Math.max(1, stats?.users?.total || 1)) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-slate-300 pt-1">
              <span>Room / PG Owners</span>
              <span className="font-bold text-white">{stats?.users?.roomOwners ?? 0}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${((stats?.users?.roomOwners || 0) / Math.max(1, stats?.users?.total || 1)) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-slate-300 pt-1">
              <span>Mess & Food Providers</span>
              <span className="font-bold text-white">{stats?.users?.messOwners ?? 0}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${((stats?.users?.messOwners || 0) / Math.max(1, stats?.users?.total || 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/users"
              className="w-full block text-center py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-800 transition"
            >
              Open User Directory &rarr;
            </Link>
          </div>
        </div>

        {/* Revenue Streams */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            Revenue Breakdown
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Subscriptions</span>
                <span className="text-[11px] text-slate-400">User & Owner Pro plans</span>
              </div>
              <span className="font-bold text-emerald-400 text-sm">
                ₹{stats?.revenue?.subscription?.toLocaleString('en-IN') ?? 0}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Featured Listings</span>
                <span className="text-[11px] text-slate-400">Owner spotlight boosts</span>
              </div>
              <span className="font-bold text-amber-400 text-sm">
                ₹{stats?.revenue?.featured?.toLocaleString('en-IN') ?? 0}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Digital Agreements</span>
                <span className="text-[11px] text-slate-400">Legal tenancy lease drafting</span>
              </div>
              <span className="font-bold text-purple-400 text-sm">
                ₹{stats?.revenue?.agreements?.toLocaleString('en-IN') ?? 0}
              </span>
            </div>
          </div>

          <div className="pt-1">
            <Link
              href="/admin/payments"
              className="w-full block text-center py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-800 transition"
            >
              View Payment Ledger &rarr;
            </Link>
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            Quick Admin Actions
          </h3>

          <div className="space-y-2.5">
            <Link
              href="/admin/approvals"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 transition group"
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 text-teal-400" />
                <span>Review Pending Listings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 transition group"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Manage Users & Verification Badges</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
            </Link>

            <Link
              href="/admin/coupons"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 transition group"
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>Create Discount Coupon Codes</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
            </Link>

            <Link
              href="/admin/config"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 transition group"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-emerald-400" />
                <span>Configure Popular Cities & Banners</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
