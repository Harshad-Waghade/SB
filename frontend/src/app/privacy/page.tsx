'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026</p>
        </div>

        <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              When you create an account on StayBite, we collect your name, email address, mobile phone number, preferred language, and role (Student, Employed, Room Owner, Mess Owner). We also collect property addresses, photos, and digital signatures generated during tenancy agreement drafting.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">2. How We Use Your Information</h2>
            <p>
              We use your information to facilitate direct connections between seekers and owners, process digital lease agreements, display verified listings, send transaction receipts, and protect our platform from spam and fraudulent listings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">3. Contact Privacy & Visibility</h2>
            <p>
              Your mobile number and WhatsApp contact are shared only when an inquiry is initiated or when explicitly enabled in your listing and profile settings. We never sell your personal data to third-party telemarketers or advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">4. Payment Information Security</h2>
            <p>
              All online transactions are processed through encrypted, PCI-DSS compliant payment gateways (Razorpay). StayBite does not store your credit card numbers, debit card PINs, or UPI passwords on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">5. Data Retention & Deletion</h2>
            <p>
              You have the right to request the deletion of your account and personal data at any time by contacting our privacy officer at <a href="mailto:privacy@staybite.com" className="text-teal-600 font-semibold underline">privacy@staybite.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
