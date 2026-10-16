'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  User,
  Tag,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purposeFilter, setPurposeFilter] = useState('all');

  const fetchPayments = async () => {
    setLoading(true);
    const res = await fetchApi('/admin/payments');
    if (res.success && res.data) setPayments(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchPayments(); }, []);

  const filteredPayments = payments.filter((p) =>
    purposeFilter === 'all' || p.purpose === purposeFilter
  );

  const totalRevenue = payments
    .filter((p) => p.status === 'captured')
    .reduce((sum, p) => sum + p.amount, 0);

  const byPurpose = (purpose: string) =>
    payments.filter((p) => p.purpose === purpose && p.status === 'captured').reduce((s, p) => s + p.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'captured':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"><CheckCircle className="w-3 h-3" /> Captured</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30"><Clock className="w-3 h-3" /> Pending</span>;
      case 'failed':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30"><XCircle className="w-3 h-3" /> Failed</span>;
      default:
        return <span className="text-[10px] text-slate-400 font-bold">{status}</span>;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" /> Payment Ledger
          </div>
          <h1 className="text-2xl font-black text-white">Transactions & Revenue</h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete ledger of all Razorpay payments, subscription purchases, and refunds.
          </p>
        </div>
        <button
          onClick={fetchPayments}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Revenue Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Total Revenue</span>
          <span className="text-2xl font-black text-emerald-400">₹{totalRevenue.toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Subscriptions</span>
          <span className="text-2xl font-black text-teal-400">₹{byPurpose('subscription').toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Featured Listings</span>
          <span className="text-2xl font-black text-amber-400">₹{byPurpose('featured_listing').toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Agreement Services</span>
          <span className="text-2xl font-black text-purple-400">₹{byPurpose('agreement_service').toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        {[
          { id: 'all', label: 'All Payments' },
          { id: 'subscription', label: 'Subscriptions' },
          { id: 'featured_listing', label: 'Featured Boosts' },
          { id: 'agreement_service', label: 'Agreements' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPurposeFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              purposeFilter === tab.id
                ? 'bg-teal-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-400">
            <thead className="bg-slate-900/80 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Purpose</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Coupon</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-teal-500" />
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-slate-900/40 transition">
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[11px] text-slate-300">
                        {payment.razorpayOrderId || payment._id?.slice(-12) || 'SB-PAY-01'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-white">{payment.userId?.name || 'User'}</div>
                      <div className="text-[11px] text-slate-500">{payment.userId?.role?.replace('_', ' ')}</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 capitalize">
                        {payment.purpose?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-bold text-emerald-400 text-sm">
                      ₹{payment.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-3.5 text-slate-400 text-[11px]">
                      {payment.couponUsed ? (
                        <span className="text-amber-400 flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {payment.couponUsed}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-3.5">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 text-[11px]">
                      {new Date(payment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
