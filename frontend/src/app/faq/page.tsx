'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'seeker',
      question: 'What is StayBite and how does it help me?',
      answer: 'StayBite is India’s premier marketplace connecting students and working professionals with verified rooms, PGs, hostels, and homemade mess services. We eliminate middleman broker commissions, let you connect directly with verified owners, and offer automated digital tenancy agreements.'
    },
    {
      category: 'seeker',
      question: 'Do I have to pay any brokerage fees to StayBite?',
      answer: 'No! StayBite is 100% broker-free. You deal directly with room and mess owners. There are no surprise commission percentages or agent finder fees.'
    },
    {
      category: 'seeker',
      question: 'What is the "StayBite Verified" badge on listings?',
      answer: 'Listings displaying the "StayBite Verified" (✓) badge have been inspected and verified by our administrative team. We verify property photos, owner identity, rent figures, and amenity availability before approving the listing.'
    },
    {
      category: 'seeker',
      question: 'Can I schedule an in-person room visit before finalizing?',
      answer: 'Yes! Send an inquiry on the listing page and you or the owner can pick an inspection date and time directly from your dashboard.'
    },
    {
      category: 'seeker',
      question: 'How does the mess and tiffin service subscription work?',
      answer: 'You can explore local messes, check their daily breakfast, lunch, and dinner menus, meal timings, and dietary categories (Veg, Non-Veg, Jain). You can subscribe for a monthly tiffin or order daily trial meals.'
    },
    {
      category: 'owner',
      question: 'How do I list my property or mess on StayBite?',
      answer: 'Click on "Add Room" or "Add Mess" in the navigation bar. Complete our 8-step wizard by providing your property address, rent, amenities, and photos. Once submitted, our team reviews and approves it within 12-24 hours.'
    },
    {
      category: 'owner',
      question: 'How much does it cost for owners to list?',
      answer: 'Owners can list their first property for free! For multiple listings and featured discovery placements on city search pages, we offer the affordable Owner Pro plan at ₹299/month.'
    },
    {
      category: 'agreement',
      question: 'How does the Digital Tenancy Agreement generator work?',
      answer: 'When a deal is accepted between tenant and owner, StayBite allows you to draft a standardized rental lease agreement. Both parties review the terms, rent, security deposit, and rules, sign digitally with our e-signature pad, and download a complete legal PDF.'
    },
    {
      category: 'agreement',
      question: 'Is the digital agreement legally binding?',
      answer: 'Our digital agreements serve as a legally structured contract between landlord and tenant. Users are advised that stamp duty payment and registration should be completed in accordance with the applicable local tenancy laws of their respective state or municipal jurisdiction.'
    },
    {
      category: 'billing',
      question: 'What payment modes are accepted on StayBite?',
      answer: 'We support all major Indian digital payment modes via Razorpay, including UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking across 50+ banks, Credit Cards, and Debit Cards.'
    }
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <Sparkles className="w-3.5 h-3.5" /> Answers & Guides
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Everything you need to know about rooms, messes, digital agreements, and payments on StayBite.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions (e.g. deposit, agreement, mess delivery)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'seeker', label: 'For Tenants & Seekers' },
            { id: 'owner', label: 'For Room & Mess Owners' },
            { id: 'agreement', label: 'Digital Agreements' },
            { id: 'billing', label: 'Payments & Billing' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-bold text-slate-900 text-sm">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <h3 className="text-xl font-bold">Still have questions?</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Our support team is available 6 days a week to answer your queries and assist with listings.
          </p>
          <div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg"
            >
              <span>Contact Support</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
