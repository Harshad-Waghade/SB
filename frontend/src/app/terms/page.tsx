'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          <h1 className="text-3xl font-black text-slate-900">Terms and Conditions</h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026</p>
        </div>

        <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the StayBite website, progressive web app, mobile applications, and platform services, you agree to be bound by these Terms and Conditions. If you do not agree to all terms, please refrain from using the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">2. Marketplace Platform Nature</h2>
            <p>
              StayBite acts as a marketplace connecting students, working professionals ("Seekers"), room and hostel owners ("Property Owners"), and mess/tiffin service providers ("Mess Owners"). StayBite does not own, lease, manage, or operate properties directly unless explicitly stated.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">3. User Accounts and Verification</h2>
            <p>
              Users must provide accurate, current, and complete registration information including verified mobile phone numbers and email addresses. Users are responsible for maintaining the confidentiality of their login credentials. StayBite reserves the right to suspend or terminate accounts that provide misleading information or engage in fraudulent activities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">4. Property & Mess Listings</h2>
            <p>
              Owners warrant that all photos, amenity descriptions, rent amounts, and availability statuses provided in their listings are true, accurate, and up-to-date. Every listing is subject to administrative review before being marked as "StayBite Verified".
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">5. Digital Tenancy Agreements</h2>
            <p>
              StayBite provides a digital tenancy agreement drafting tool to assist Seekers and Owners in recording mutually agreed lease terms. Users acknowledge and agree that statutory stamp duty, notarization, and mandatory registration requirements vary by state and local jurisdiction (e.g. Maharashtra Rent Control Act) and are the sole responsibility of the respective parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">6. Payments and Subscriptions</h2>
            <p>
              All online payments on StayBite are processed securely via RBI-authorized payment aggregators (Razorpay). Subscriptions renew automatically unless cancelled before the renewal date. Applicable Goods and Services Tax (GST) is levied as per prevailing Government of India regulations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">7. Code of Conduct</h2>
            <p>
              Users agree not to harass, abuse, or discriminate against other users based on religion, caste, gender, or state of origin. StayBite has a zero-tolerance policy for discriminatory listing requirements.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">8. Contact Us</h2>
            <p>
              For legal inquiries or questions regarding these terms, please contact: <a href="mailto:legal@staybite.com" className="text-teal-600 font-semibold underline">legal@staybite.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
