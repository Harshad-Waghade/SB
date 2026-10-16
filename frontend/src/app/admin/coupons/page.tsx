'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import {
  Tag,
  Plus,
  Percent,
  DollarSign,
  Calendar,
  CheckCircle,
  RefreshCw,
  X
} from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    maxDiscountAmount: '',
    minOrderAmount: '0',
    validTo: '',
    usageLimit: '100',
    applicableFor: 'all'
  });

  const fetchCoupons = async () => {
    setLoading(true);
    const res = await fetchApi('/admin/coupons');
    if (res.success && res.data) setCoupons(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    const res = await fetchApi('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify({
        code: form.code,
        description: form.description,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : undefined,
        minOrderAmount: Number(form.minOrderAmount),
        validTo: form.validTo ? new Date(form.validTo).toISOString() : undefined,
        usageLimit: Number(form.usageLimit),
        applicableFor: [form.applicableFor]
      })
    });

    if (res.success) {
      alert('Coupon created successfully!');
      setModalOpen(false);
      setForm({
        code: '', description: '', discountType: 'percentage', discountValue: '',
        maxDiscountAmount: '', minOrderAmount: '0', validTo: '', usageLimit: '100', applicableFor: 'all'
      });
      fetchCoupons();
    } else {
      alert(res.message || 'Failed to create coupon');
    }
    setCreating(false);
  };

  const isExpired = (validTo: string) => new Date(validTo) < new Date();

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Tag className="w-4 h-4" /> Marketing & Promotions
          </div>
          <h1 className="text-2xl font-black text-white">Coupon & Discount Codes</h1>
          <p className="text-xs text-slate-400 mt-1">
            Create promotional coupon codes for subscriptions, featured listings, and agreement services.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-teal-600/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Coupon
        </button>
      </div>

      {/* Coupons Grid */}
      {loading ? (
        <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-500 mb-2" />
          <p className="text-slate-400 text-xs">Loading coupons...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {coupons.map((coupon) => {
            const expired = isExpired(coupon.validTo);
            return (
              <div
                key={coupon._id}
                className={`rounded-2xl border p-5 space-y-3 text-xs relative overflow-hidden shadow-lg ${
                  expired ? 'bg-slate-950 border-slate-800 opacity-60' : 'bg-slate-950 border-slate-800'
                }`}
              >
                {/* Background decor */}
                <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/5 rounded-full translate-x-8 -translate-y-8 blur-xl" />

                <div className="flex items-center justify-between">
                  <span className="text-xl font-black font-mono text-white tracking-wider">
                    {coupon.code}
                  </span>
                  {expired ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">Expired</span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                  )}
                </div>

                <p className="text-slate-400">{coupon.description}</p>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-xl font-bold border border-amber-500/20">
                    {coupon.discountType === 'percentage' ? (
                      <><Percent className="w-3.5 h-3.5" /> {coupon.discountValue}% Off</>
                    ) : (
                      <><DollarSign className="w-3.5 h-3.5" /> ₹{coupon.discountValue} Off</>
                    )}
                  </div>
                  {coupon.maxDiscountAmount && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      (Max ₹{coupon.maxDiscountAmount})
                    </span>
                  )}
                </div>

                <div className="pt-1 space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Min. Order Value:</span>
                    <span className="font-semibold text-slate-200">₹{coupon.minOrderAmount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Valid Until:</span>
                    <span className={`font-semibold ${expired ? 'text-rose-400' : 'text-teal-400'}`}>
                      {new Date(coupon.validTo).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Usage Limit:</span>
                    <span className="font-semibold text-slate-200">{coupon.usedCount || 0} / {coupon.usageLimit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Applicable For:</span>
                    <span className="font-semibold text-slate-200 capitalize">
                      {(coupon.applicableFor || ['all']).join(', ').replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Usage Progress Bar */}
                <div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round(((coupon.usedCount || 0) / coupon.usageLimit) * 100))}%`
                      }}
                    />
                  </div>
                  <div className="text-right text-[10px] text-slate-500 mt-1">
                    {Math.round(((coupon.usedCount || 0) / coupon.usageLimit) * 100)}% used
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {coupons.length === 0 && !loading && (
        <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 space-y-4">
          <Tag className="w-10 h-10 mx-auto opacity-30" />
          <p className="text-sm font-semibold text-slate-300">No coupons created yet</p>
          <p className="text-xs">Create your first promotional code to drive subscription signups and boost engagement.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-xl text-xs transition mt-2"
          >
            <Plus className="w-4 h-4" /> Create First Coupon
          </button>
        </div>
      )}

      {/* Create Coupon Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-800 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <Tag className="w-5 h-5" /> Create New Coupon
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Coupon Code *</label>
                  <input
                    required
                    type="text"
                    placeholder="STUDENT500"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Applicable For</label>
                  <select
                    value={form.applicableFor}
                    onChange={(e) => setForm({ ...form, applicableFor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All Plans</option>
                    <option value="subscription">Subscriptions Only</option>
                    <option value="featured_listing">Featured Listings</option>
                    <option value="agreement_service">Agreement Services</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Student Monsoon Special — 25% off on first premium plan"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {form.discountType === 'percentage' ? 'Percentage (%)' : 'Flat Amount (₹)'} *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder={form.discountType === 'percentage' ? '25' : '200'}
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Max Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="500"
                    value={form.maxDiscountAmount}
                    onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Min. Order (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="99"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="100"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={form.validTo}
                    onChange={(e) => setForm({ ...form, validTo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition"
                >
                  {creating ? 'Creating...' : 'Create Coupon Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
