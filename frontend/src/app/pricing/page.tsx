'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { PaymentModal } from '@/components/PaymentModal';
import {
  Check,
  Zap,
  ShieldCheck,
  Star,
  Sparkles,
  Building,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function PricingPage() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [audience, setAudience] = useState<'seeker' | 'owner'>('seeker');

  // Checkout modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    title: string;
    amount: number;
    planId: string;
  } | null>(null);

  const seekerPlans = [
    {
      id: 'free',
      name: 'Free Starter',
      price: 0,
      description: 'Ideal for casual browsing and basic room discovery.',
      features: [
        'Browse unlimited rooms, PGs & messes',
        'Basic search filters (city, budget, sharing)',
        'Up to 3 free direct owner enquiries',
        'Save up to 5 favorite listings',
        'Community support'
      ],
      popular: false,
      cta: 'Current Free Tier',
      disabled: true
    },
    {
      id: 'seeker_premium',
      name: 'Premium Seeker',
      price: 99,
      duration: '/month',
      description: 'For active students and employees searching for their ideal home.',
      features: [
        'Unlimited direct owner enquiries & chat',
        'Advanced distance & college proximity filters',
        'Priority recommendation algorithm',
        'Direct WhatsApp contact access',
        'Save unlimited favorite properties',
        'Fast response guarantee badge',
        'Standard customer support'
      ],
      popular: true,
      cta: 'Upgrade to Premium',
      badge: 'Most Popular'
    },
    {
      id: 'seeker_premium_plus',
      name: 'Premium Plus',
      price: 199,
      duration: '/month',
      description: 'Complete peace of mind with end-to-end deal and agreement assistance.',
      features: [
        'Everything in Premium Seeker',
        'Free Digital Tenancy Agreement generator (1 lease)',
        'Legal agreement preview & e-signature pad',
        'VIP concierge assistance on WhatsApp',
        'Early access to newly verified rooms',
        'Verified Seeker Trust Badge on profile'
      ],
      popular: false,
      cta: 'Get Premium Plus',
      badge: 'Best Value'
    }
  ];

  const ownerPlans = [
    {
      id: 'owner_free',
      name: 'Basic Owner',
      price: 0,
      description: 'For independent owners listing a single room or PG.',
      features: [
        '1 active approved listing',
        'Standard discovery ranking',
        'Basic lead inquiries & chat',
        'Owner dashboard access'
      ],
      popular: false,
      cta: 'Current Tier',
      disabled: true
    },
    {
      id: 'owner_pro',
      name: 'Owner Pro',
      price: 299,
      duration: '/month',
      description: 'For PG owners and mess providers wanting high tenant occupancy.',
      features: [
        'Up to 5 active property/mess listings',
        'Verified Owner trust badge (✓)',
        'Featured placement on city search',
        'Automated lead notifications & WhatsApp alert',
        'Full analytics: views, clicks & conversion',
        'Unlimited Digital Tenancy Agreements',
        'Priority admin listing verification'
      ],
      popular: true,
      cta: 'Upgrade to Owner Pro',
      badge: 'Recommended'
    },
    {
      id: 'owner_enterprise',
      name: 'Hostel & Coliving Elite',
      price: 699,
      duration: '/month',
      description: 'For multi-branch hostels, large messes and commercial coliving hubs.',
      features: [
        'Unlimited property and mess listings',
        'Top Homepage Carousel spotlight slot',
        'Dedicated account manager',
        'Multi-city listing capability',
        'Custom agreement clauses & terms',
        'Bulk enquiry management tools',
        '0% platform commission on direct deals'
      ],
      popular: false,
      cta: 'Get Elite Plan',
      badge: 'High Volume'
    }
  ];

  const handleSelectPlan = (plan: any) => {
    if (plan.price === 0) return;
    if (!isAuthenticated) {
      window.location.href = '/auth/login?redirect=/pricing';
      return;
    }
    setSelectedPlan({
      title: `${plan.name} Subscription`,
      amount: plan.price,
      planId: plan.id
    });
    setModalOpen(true);
  };

  const currentPlans = audience === 'seeker' ? seekerPlans : ownerPlans;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Title */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <Sparkles className="w-3.5 h-3.5" /> Transparent Pricing, Zero Hidden Fees
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Plans built for Students, Professionals & Owners
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Choose the right tier to discover verified rooms and messes faster, or maximize your property's occupancy rate.
          </p>

          {/* Audience Switcher */}
          <div className="inline-flex items-center p-1.5 bg-slate-200/80 rounded-2xl shadow-inner mt-4">
            <button
              onClick={() => setAudience('seeker')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${
                audience === 'seeker'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎓 For Students & Working Professionals
            </button>
            <button
              onClick={() => setAudience('owner')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${
                audience === 'owner'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏠 For Room & Mess Owners
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {currentPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition relative ${
                plan.popular
                  ? 'bg-gradient-to-b from-teal-900 via-slate-900 to-slate-950 text-white shadow-2xl ring-2 ring-teal-500 scale-105 z-10'
                  : 'bg-white text-slate-900 shadow-sm border border-slate-200/80 hover:shadow-md'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className={`text-xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mt-1.5 leading-relaxed ${plan.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">₹{plan.price}</span>
                  {plan.duration && (
                    <span className={`text-xs font-semibold ${plan.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                      {plan.duration}
                    </span>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100/20 text-xs">
                  <span className={`font-bold uppercase tracking-wider text-[10px] block ${
                    plan.popular ? 'text-teal-400' : 'text-slate-400'
                  }`}>
                    What's included:
                  </span>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-700'
                      }`}>
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className={plan.popular ? 'text-slate-200' : 'text-slate-700'}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={plan.disabled}
                  className={`w-full py-3 px-4 rounded-2xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-slate-950 font-black shadow-lg shadow-teal-500/20'
                      : plan.disabled
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>{plan.cta}</span>
                  {!plan.disabled && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50">
              <h4 className="font-bold text-slate-900 text-sm">Can I cancel my subscription anytime?</h4>
              <p>Yes. Subscriptions renew monthly and can be cancelled anytime with one click in your account settings.</p>
            </div>
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50">
              <h4 className="font-bold text-slate-900 text-sm">How does the Digital Tenancy Agreement work?</h4>
              <p>When you close a deal on StayBite, our system drafts a standard rental lease. Both parties sign digitally and can download a legally structured PDF document.</p>
            </div>
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50">
              <h4 className="font-bold text-slate-900 text-sm">What payment methods are supported?</h4>
              <p>We support all Indian payment options via Razorpay including UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking.</p>
            </div>
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50">
              <h4 className="font-bold text-slate-900 text-sm">Are property listings verified by humans?</h4>
              <p>Yes! Every room and mess is reviewed by our administration team before receiving the StayBite Verified badge.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Checkout Modal */}
      {modalOpen && selectedPlan && (
        <PaymentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={selectedPlan.title}
          amount={selectedPlan.amount}
          purpose="subscription"
          metadata={{ planId: selectedPlan.planId, audience }}
          onSuccess={() => {
            alert('Subscription activated successfully! Welcome to StayBite Premium.');
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
