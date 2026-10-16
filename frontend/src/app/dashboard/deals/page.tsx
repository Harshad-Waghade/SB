'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { fetchApi } from '../../../lib/api';
import {
  Tag,
  ArrowLeft,
  FileText,
  CheckCircle2,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Download,
  AlertTriangle,
  PenTool
} from 'lucide-react';

function DealsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [deals, setDeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Agreement Wizard State (if triggered from deal)
  const createAgreementDealId = searchParams.get('createAgreementFor');
  const [selectedDealForAgreement, setSelectedDealForAgreement] = useState<any>(null);

  const [tenantName, setTenantName] = useState(user?.name || '');
  const [tenantPhone, setTenantPhone] = useState(user?.phone || '');
  const [tenantEmail, setTenantEmail] = useState(user?.email || '');
  const [tenantAddress, setTenantAddress] = useState('');
  const [tenantIdProof, setTenantIdProof] = useState('XXXX-XXXX-XXXX');

  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');

  const [propertyTitle, setPropertyTitle] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('Nagpur');
  const [monthlyRent, setMonthlyRent] = useState(5500);
  const [securityDeposit, setSecurityDeposit] = useState(10000);
  const [maintenanceCharges, setMaintenanceCharges] = useState(300);
  const [leaseStartDate, setLeaseStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [noticePeriodDays, setNoticePeriodDays] = useState(30);

  const [isCreatingAgreement, setIsCreatingAgreement] = useState(false);

  useEffect(() => {
    fetchApi('/deals/my').then((res) => {
      setIsLoading(false);
      if (res.success && res.data) {
        setDeals(res.data);
        if (createAgreementDealId) {
          const matching = res.data.find((d: any) => d._id === createAgreementDealId);
          if (matching) {
            setSelectedDealForAgreement(matching);
            setOwnerName(matching.ownerId?.name || '');
            setOwnerPhone(matching.ownerId?.phone || '');
            setOwnerEmail(matching.ownerId?.email || '');
            setPropertyTitle(matching.listing?.title || matching.listing?.name || 'StayBite Rental Residence');
            setFullAddress(matching.listing?.address || 'Property Address');
            setCity(matching.listing?.city || 'Nagpur');
            setMonthlyRent(matching.agreedPrice || 5500);
            setSecurityDeposit(matching.agreedDeposit || 10000);
          }
        }
      }
    });
  }, [createAgreementDealId]);

  const handleGenerateAgreement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDealForAgreement) return;

    setIsCreatingAgreement(true);
    const payload = {
      dealId: selectedDealForAgreement._id,
      tenant: {
        fullName: tenantName,
        phone: tenantPhone,
        email: tenantEmail,
        permanentAddress: tenantAddress || 'Permanent Resident',
        idProofType: 'Aadhaar',
        idProofNumber: tenantIdProof
      },
      owner: {
        fullName: ownerName || selectedDealForAgreement.ownerId?.name,
        phone: ownerPhone || selectedDealForAgreement.ownerId?.phone,
        email: ownerEmail || selectedDealForAgreement.ownerId?.email,
        permanentAddress: ownerAddress || 'Owner Residence'
      },
      propertyDetails: {
        propertyTitle,
        fullAddress,
        city,
        pincode: '440010',
        monthlyRent: Number(monthlyRent),
        securityDeposit: Number(securityDeposit),
        maintenanceCharges: Number(maintenanceCharges),
        noticePeriodDays: Number(noticePeriodDays),
        leaseStartDate
      }
    };

    const res = await fetchApi('/agreements', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    setIsCreatingAgreement(false);

    if (res.success && res.data) {
      router.push(`/agreements/${res.data._id}`);
    } else {
      alert(res.message || 'Failed to generate agreement');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Tag className="w-6 h-6 text-orange-400" />
              <span>{t('deals')}</span>
            </h1>
            <p className="text-xs text-slate-400">Manage finalized room agreements, leases, and deals</p>
          </div>
        </div>

        {/* AGREEMENT GENERATION WIZARD MODAL / ACCORDION */}
        {selectedDealForAgreement && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-teal-500/50 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Generate Digital Rental Agreement</h3>
                  <p className="text-xs text-slate-400">Deal Code: {selectedDealForAgreement.dealCode}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDealForAgreement(null)}
                className="text-xs text-slate-400 hover:text-white font-medium"
              >
                Cancel
              </button>
            </div>

            {/* Legal Notice */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Statutory & Legal Notice:</span>
                StayBite provides a standardized digital lease template. Legal validity, stamp duty payment, and local rent authority registration must be completed as per your state jurisdiction.
              </div>
            </div>

            <form onSubmit={handleGenerateAgreement} className="space-y-6">
              {/* Tenant Section */}
              <div>
                <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-3">
                  1. Tenant / Seeker Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={tenantPhone}
                      onChange={(e) => setTenantPhone(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Aadhaar / ID Proof Number</label>
                    <input
                      type="text"
                      value={tenantIdProof}
                      onChange={(e) => setTenantIdProof(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">
                  2. Property & Lease Terms
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Monthly Rent (₹)</label>
                    <input
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Security Deposit (₹)</label>
                    <input
                      type="number"
                      value={securityDeposit}
                      onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Lease Start Date</label>
                    <input
                      type="date"
                      value={leaseStartDate}
                      onChange={(e) => setLeaseStartDate(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Notice Period (Days)</label>
                    <input
                      type="number"
                      value={noticePeriodDays}
                      onChange={(e) => setNoticePeriodDays(Number(e.target.value))}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreatingAgreement}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-teal-950/50 flex items-center justify-center space-x-2 transition disabled:opacity-50"
              >
                <PenTool className="w-4 h-4" />
                <span>{isCreatingAgreement ? 'Generating Agreement...' : 'Generate Legal Agreement Preview'}</span>
              </button>
            </form>
          </div>
        )}

        {/* DEALS LIST */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-400">Loading deals...</div>
        ) : deals.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-3xl border border-slate-800 p-8 space-y-4">
            <Tag className="w-16 h-16 text-slate-700 mx-auto" />
            <h3 className="text-xl font-bold text-white">{t('emptyDeals')}</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Once an owner accepts your enquiry and agrees on terms, your deal and agreement contract will appear here.
            </p>
            <Link
              href="/rooms"
              className="inline-block px-6 py-2.5 rounded-xl bg-teal-500 text-white font-semibold text-xs"
            >
              Explore Stays
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {deals.map((deal) => (
              <div
                key={deal._id}
                className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider">
                      {deal.dealCode}
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {deal.listing?.title || deal.listing?.name || 'Stay Deal'}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-bold uppercase">
                    Status: {deal.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
                    <span className="text-slate-400 block">Agreed Rent</span>
                    <span className="text-white font-bold text-sm">₹{deal.agreedPrice}/mo</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
                    <span className="text-slate-400 block">Security Deposit</span>
                    <span className="text-teal-400 font-bold text-sm">₹{deal.agreedDeposit}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
                    <span className="text-slate-400 block">Start Date</span>
                    <span className="text-slate-200 font-medium">{new Date(deal.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
                    <span className="text-slate-400 block">Duration</span>
                    <span className="text-slate-200 font-medium">{deal.durationMonths} Months</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-slate-400">
                    Owner: <span className="text-white font-medium">{deal.ownerId?.name || 'Owner'}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {deal.agreementId ? (
                      <Link
                        href={`/agreements/${deal.agreementId._id || deal.agreementId}`}
                        className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View / Sign Agreement</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => setSelectedDealForAgreement(deal)}
                        className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md"
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        <span>Create Digital Agreement</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DealsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 text-xs">Loading Deals & Agreements...</div>}>
      <DealsContent />
    </Suspense>
  );
}
