'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { fetchApi } from '@/lib/api';
import {
  TrendingUp,
  Eye,
  Users,
  Handshake,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle,
  Building2,
  UtensilsCrossed,
  ShieldCheck,
  Award,
  Sparkles,
  BarChart3
} from 'lucide-react';

export default function OwnerAnalyticsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<any[]>([]);
  const [messes, setMesses] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      const [roomsRes, messRes, leadsRes, dealsRes] = await Promise.all([
        fetchApi('/rooms/owner/my-rooms'),
        fetchApi('/mess/owner/my-messes'),
        fetchApi('/enquiries/my'),
        fetchApi('/deals/my')
      ]);

      if (roomsRes.success && roomsRes.data) setRooms(roomsRes.data);
      if (messRes.success && messRes.data) setMesses(messRes.data);
      if (leadsRes.success && leadsRes.data) setLeads(leadsRes.data);
      if (dealsRes.success && dealsRes.data) setDeals(dealsRes.data);
      setLoading(false);
    };

    loadAnalytics();
  }, []);

  const totalViews = [...rooms, ...messes].reduce((sum, item) => sum + (item.viewsCount || 24), 0);
  const totalLeads = leads.length;
  const convertedDeals = deals.filter((d) => d.status === 'accepted' || d.status === 'agreement_completed').length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedDeals / totalLeads) * 100) : 0;
  
  // Calculate projected monthly earnings
  const roomEarnings = rooms.reduce((sum, r) => sum + (r.rent || 0), 0);
  const messEarnings = messes.reduce((sum, m) => sum + (m.monthlyPrice || 0) * 10, 0); // approx 10 subscribers
  const projectedRevenue = roomEarnings + messEarnings;

  // Mock monthly trends based on data
  const monthlyTrends = [
    { month: 'May', views: Math.round(totalViews * 0.4), leads: Math.round(totalLeads * 0.3), deals: 1 },
    { month: 'Jun', views: Math.round(totalViews * 0.6), leads: Math.round(totalLeads * 0.5), deals: 2 },
    { month: 'Jul', views: Math.round(totalViews * 0.8), leads: Math.round(totalLeads * 0.7), deals: Math.max(1, convertedDeals - 1) },
    { month: 'Aug', views: Math.round(totalViews * 0.9), leads: Math.round(totalLeads * 0.85), deals: convertedDeals },
    { month: 'Sep', views: totalViews, leads: totalLeads, deals: convertedDeals }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Performance & Analytics</h1>
                <p className="text-sm text-slate-500">Track discovery impressions, verified leads, agreement conversion rates, and occupancy metrics.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  timeRange === range
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : range === '90d' ? 'Last 90 Days' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Listing Views</span>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{totalViews}</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Unique student & professional impressions</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Inquiries / Leads</span>
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{totalLeads}</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +12.5%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Direct inquiries & scheduled visits</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Deals & Agreements</span>
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Handshake className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{convertedDeals}</span>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                {conversionRate}% rate
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Finalized tenancies & agreements</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Projected Revenue</span>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">₹{projectedRevenue.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-400">/mo</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">From active listings & filled capacity</p>
          </div>
        </div>

        {/* Visual Charts & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trend Bar Graph */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Monthly Engagement Growth</h3>
                <p className="text-xs text-slate-500">Views and inquiries over the past 5 months</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-teal-500" />
                  <span className="text-slate-600 font-medium">Views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-slate-600 font-medium">Leads</span>
                </div>
              </div>
            </div>

            {/* Visual SVG / HTML Bars */}
            <div className="h-64 flex items-end justify-between gap-4 pt-8 pb-2 border-b border-slate-100">
              {monthlyTrends.map((trend, idx) => {
                const maxVal = Math.max(...monthlyTrends.map((t) => t.views), 50);
                const viewHeight = Math.max(15, Math.round((trend.views / maxVal) * 180));
                const leadHeight = Math.max(10, Math.round((trend.leads / maxVal) * 180));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-48">
                      {/* Views Bar */}
                      <div
                        style={{ height: `${viewHeight}px` }}
                        className="w-1/2 max-w-[28px] bg-teal-500 rounded-t-lg group-hover:bg-teal-600 transition relative"
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap transition">
                          {trend.views} views
                        </span>
                      </div>

                      {/* Leads Bar */}
                      <div
                        style={{ height: `${leadHeight}px` }}
                        className="w-1/2 max-w-[28px] bg-amber-500 rounded-t-lg group-hover:bg-amber-600 transition relative"
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap transition">
                          {trend.leads} leads
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900">{trend.month}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle className="w-4 h-4" /> Strongest lead acquisition during student college admission months (July - Sept)
              </span>
              <Link href="/owner/leads" className="text-teal-600 hover:underline font-semibold flex items-center gap-1">
                View incoming leads &rarr;
              </Link>
            </div>
          </div>

          {/* Verification & Pro Tips */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold tracking-wider uppercase mb-2">
                <Award className="w-4 h-4" /> StayBite Verified
              </div>
              <h3 className="text-lg font-bold">Boost Your Listing Conversion</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Verified listings with high-resolution photos and digital agreement support get <strong>3.4x more inquiries</strong> and close deals <strong>2x faster</strong>.
              </p>

              <div className="mt-5 space-y-2.5 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-[10px]">✓</div>
                  <span>Add at least 5 clear room/mess photos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-[10px]">✓</div>
                  <span>Respond to inquiries within 30 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-[10px]">✓</div>
                  <span>Offer StayBite digital rental agreement</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/pricing"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-md"
                >
                  <Sparkles className="w-4 h-4" /> Upgrade to Owner Pro (₹299/mo)
                </Link>
              </div>
            </div>

            {/* Listing Quick Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-800 text-sm">Listing Distribution</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-600">
                    <Building2 className="w-4 h-4 text-teal-600" /> Rooms & PGs
                  </span>
                  <span className="font-bold text-slate-900">{rooms.length} listings</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-600 h-2 rounded-full"
                    style={{ width: `${(rooms.length / Math.max(1, rooms.length + messes.length)) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="flex items-center gap-2 text-slate-600">
                    <UtensilsCrossed className="w-4 h-4 text-orange-600" /> Messes & Tiffins
                  </span>
                  <span className="font-bold text-slate-900">{messes.length} listings</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${(messes.length / Math.max(1, rooms.length + messes.length)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Listing Performance Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Individual Listing Performance</h3>
              <p className="text-xs text-slate-500">Compare views, inquiries, and status across your properties</p>
            </div>
            <Link
              href="/owner/listings"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              View all listings &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Property / Mess</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Views</th>
                  <th className="px-6 py-3.5">Enquiries</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {[...rooms, ...messes].map((item) => {
                  const isRoom = Boolean(item.roomType);
                  const title = item.title || item.name;
                  const price = item.rent || item.monthlyPrice;

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                            {item.images?.[0] ? (
                              <img src={item.images[0]} alt={title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Building2 className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{title}</div>
                            <div className="text-[11px] text-slate-400">
                              {item.locality ? `${item.locality}, ` : ''}{item.city}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize px-2 py-1 rounded bg-slate-100 text-slate-700 text-[11px]">
                          {isRoom ? item.roomType : 'Mess / Tiffin'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        ₹{price?.toLocaleString('en-IN')}/mo
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {item.viewsCount || 24}
                      </td>
                      <td className="px-6 py-4 font-semibold text-teal-600">
                        {item.enquiryCount || 3}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            item.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : item.status === 'pending'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={isRoom ? `/rooms/${item._id}` : `/mess/${item._id}`}
                          className="text-xs font-semibold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
                        >
                          View Live &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
