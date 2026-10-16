'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:underline mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <h1 className="text-3xl font-black text-slate-900">Refund and Cancellation Policy</h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026</p>
        </div>

        <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">1. Subscription Plans</h2>
            <p>
              Users and Owners can cancel their recurring monthly subscriptions at any time via Account Settings. Upon cancellation, your subscription will remain active until the end of your current billing period, after which no further charges will occur.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">2. Refund Eligibility for Digital Services</h2>
            <p>
              If you experience technical issues where a paid service (such as Featured Listing Boost or Digital Tenancy Agreement) fails to generate or activate, you may request a full refund within 7 days of purchase by emailing <a href="mailto:support@staybite.com" className="text-teal-600 font-semibold underline">support@staybite.com</a> with your transaction ID.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">3. Direct Deal Rents & Security Deposits</h2>
            <p>
              StayBite does not hold or escrow monthly rent payments or security deposits unless an optional StayBite Escrow service is specifically contracted. Any refund of security deposits or advance rent is subject to the mutually agreed tenancy agreement terms signed between the Tenant and the Property Owner.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">4. Processing Time</h2>
            <p>
              Approved refunds are credited back to the original payment source (UPI, Credit/Debit card, or Net Banking account) within 5-7 business days through Razorpay payment rails.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
