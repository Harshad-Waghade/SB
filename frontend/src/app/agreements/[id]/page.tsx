'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { jsPDF } from 'jspdf';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { fetchApi } from '../../../lib/api';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
  PenTool,
  Lock
} from 'lucide-react';

export default function AgreementPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [agreement, setAgreement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [signatureInput, setSignatureInput] = useState(user?.name || '');
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchApi(`/agreements/${id}`).then((res) => {
      setIsLoading(false);
      if (res.success && res.data) {
        setAgreement(res.data);
      }
    });
  }, [id]);

  const handleSign = async () => {
    if (!signatureInput) {
      alert('Please enter your full name as digital signature');
      return;
    }

    setIsSigning(true);
    const res = await fetchApi(`/agreements/${id}/sign`, {
      method: 'POST',
      body: JSON.stringify({ signatureText: signatureInput })
    });
    setIsSigning(false);

    if (res.success && res.data) {
      setAgreement(res.data);
      alert('Agreement digitally signed successfully!');
    } else {
      alert(res.message || 'Failed to sign agreement');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('RESIDENTIAL RENTAL & LEASE AGREEMENT', 20, 20);
    doc.setFontSize(10);
    doc.text(`Agreement Number: ${agreement?.agreementNumber}`, 20, 30);
    doc.text(`Generated on StayBite Platform - ${new Date(agreement?.createdAt).toLocaleDateString()}`, 20, 36);

    doc.setFontSize(12);
    doc.text('1. PARTIES:', 20, 48);
    doc.setFontSize(10);
    doc.text(`Tenant: ${agreement?.tenant?.fullName} (${agreement?.tenant?.phone}, ${agreement?.tenant?.email})`, 25, 56);
    doc.text(`Owner: ${agreement?.owner?.fullName} (${agreement?.owner?.phone}, ${agreement?.owner?.email})`, 25, 62);

    doc.setFontSize(12);
    doc.text('2. PROPERTY & FINANCIAL TERMS:', 20, 74);
    doc.setFontSize(10);
    doc.text(`Property: ${agreement?.propertyDetails?.propertyTitle}`, 25, 82);
    doc.text(`Address: ${agreement?.propertyDetails?.fullAddress}, ${agreement?.propertyDetails?.city}`, 25, 88);
    doc.text(`Monthly Rent: INR ${agreement?.propertyDetails?.monthlyRent}`, 25, 94);
    doc.text(`Security Deposit: INR ${agreement?.propertyDetails?.securityDeposit}`, 25, 100);
    doc.text(`Notice Period: ${agreement?.propertyDetails?.noticePeriodDays} Days`, 25, 106);

    doc.setFontSize(12);
    doc.text('3. STANDARD TERMS & CONDITIONS:', 20, 118);
    doc.setFontSize(9);
    let y = 126;
    agreement?.termsAndConditions?.forEach((term: string, idx: number) => {
      const splitText = doc.splitTextToSize(`${idx + 1}. ${term}`, 165);
      doc.text(splitText, 25, y);
      y += splitText.length * 6;
    });

    doc.setFontSize(11);
    doc.text('4. DIGITAL SIGNATURES:', 20, y + 10);
    doc.setFontSize(9);
    doc.text(`Tenant Signature: ${agreement?.tenant?.signature || 'Pending Signature'} (${agreement?.tenant?.signedAt ? new Date(agreement?.tenant?.signedAt).toLocaleDateString() : 'Unsigned'})`, 25, y + 18);
    doc.text(`Owner Signature: ${agreement?.owner?.signature || 'Pending Signature'} (${agreement?.owner?.signedAt ? new Date(agreement?.owner?.signedAt).toLocaleDateString() : 'Unsigned'})`, 25, y + 24);

    doc.save(`StayBite_Agreement_${agreement?.agreementNumber}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 py-12 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="min-h-screen bg-slate-950 py-20 text-center text-white">
        <h2 className="text-2xl font-bold">Agreement not found.</h2>
        <Link href="/dashboard/deals" className="text-teal-400 mt-4 inline-block">
          ← Back to deals
        </Link>
      </div>
    );
  }

  const isTenant = user && agreement.tenant?.userId?.toString() === user.id;
  const isOwner = user && agreement.owner?.userId?.toString() === user.id;
  const hasUserSigned = isTenant ? !!agreement.tenant?.signature : isOwner ? !!agreement.owner?.signature : false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* TOP BAR WITH ACTIONS */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <Link
            href="/dashboard/deals"
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Deals</span>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Agreement</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md transition"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* STATUTORY LEGAL DISCLAIMER BOX */}
        <div className="no-print p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Important Legal Disclaimer & Stamp Duty Notice:</span>
            This digital rental agreement is generated using standard Indian tenancy clauses. In accordance with applicable state rent control and registration acts, users must ensure proper stamp duty payment and registration if required in their state or local municipality. StayBite provides this document as a technology marketplace facilitator.
          </div>
        </div>

        {/* FORMAL PRINTABLE AGREEMENT DOCUMENT */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl text-slate-200 text-sm space-y-8 print:bg-white print:text-black print:p-0 print:border-none">
          {/* Header */}
          <div className="text-center border-b border-slate-800 print:border-black pb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image src="/logo.png" alt="StayBite" fill className="object-cover" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white print:text-black">
                STAYBITE DIGITAL TENANCY AGREEMENT
              </h1>
            </div>
            <p className="text-xs font-mono text-teal-400 print:text-gray-600 font-bold uppercase">
              Agreement ID: {agreement.agreementNumber}
            </p>
            <p className="text-[11px] text-slate-400 print:text-gray-500">
              Executed on {new Date(agreement.createdAt).toLocaleDateString()} via StayBite Secure Gateway
            </p>
          </div>

          {/* Section 1: Parties */}
          <div className="space-y-3">
            <h3 className="font-bold text-white print:text-black text-base border-b border-slate-800 print:border-gray-400 pb-1">
              1. PARTIES TO THE AGREEMENT
            </h3>
            <p className="leading-relaxed">
              This Residential Tenancy Agreement is entered into between:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-slate-800/60 print:bg-gray-100 border border-slate-700 print:border-gray-300 space-y-1 text-xs">
                <span className="font-bold text-teal-400 print:text-black uppercase block mb-1">
                  LANDLORD / LICENSOR (Owner)
                </span>
                <p><strong>Name:</strong> {agreement.owner.fullName}</p>
                <p><strong>Contact:</strong> {agreement.owner.phone} | {agreement.owner.email}</p>
                <p><strong>Address:</strong> {agreement.owner.permanentAddress}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 print:bg-gray-100 border border-slate-700 print:border-gray-300 space-y-1 text-xs">
                <span className="font-bold text-orange-400 print:text-black uppercase block mb-1">
                  TENANT / LICENSEE (Seeker)
                </span>
                <p><strong>Name:</strong> {agreement.tenant.fullName}</p>
                <p><strong>Contact:</strong> {agreement.tenant.phone} | {agreement.tenant.email}</p>
                <p><strong>ID Proof:</strong> {agreement.tenant.idProofType} ({agreement.tenant.idProofNumber})</p>
                <p><strong>Address:</strong> {agreement.tenant.permanentAddress}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Property & Financial Terms */}
          <div className="space-y-3">
            <h3 className="font-bold text-white print:text-black text-base border-b border-slate-800 print:border-gray-400 pb-1">
              2. DEMISED PREMISES & FINANCIAL CONSIDERATION
            </h3>
            <div className="p-4 rounded-2xl bg-slate-800/40 print:bg-gray-50 border border-slate-800 print:border-gray-300 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 print:text-gray-500 block">Monthly Rent</span>
                <span className="font-bold text-white print:text-black text-sm">₹{agreement.propertyDetails.monthlyRent.toLocaleString('en-IN')}/mo</span>
              </div>
              <div>
                <span className="text-slate-400 print:text-gray-500 block">Refundable Security Deposit</span>
                <span className="font-bold text-teal-400 print:text-black text-sm">₹{agreement.propertyDetails.securityDeposit.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 print:text-gray-500 block">Monthly Maintenance</span>
                <span className="font-bold text-white print:text-black text-sm">₹{agreement.propertyDetails.maintenanceCharges || 0}</span>
              </div>
              <div>
                <span className="text-slate-400 print:text-gray-500 block">Lease Start Date</span>
                <span className="font-medium text-white print:text-black">{new Date(agreement.propertyDetails.leaseStartDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-400 print:text-gray-500 block">Notice Period</span>
                <span className="font-medium text-white print:text-black">{agreement.propertyDetails.noticePeriodDays} Days</span>
              </div>
              <div>
                <span className="text-slate-400 print:text-gray-500 block">Lock-In Period</span>
                <span className="font-medium text-white print:text-black">{agreement.propertyDetails.lockInPeriodMonths} Month(s)</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 print:text-black">
              <strong>Property Address:</strong> {agreement.propertyDetails.fullAddress}, {agreement.propertyDetails.city} - {agreement.propertyDetails.pincode}
            </p>
          </div>

          {/* Section 3: Terms & Conditions */}
          <div className="space-y-3">
            <h3 className="font-bold text-white print:text-black text-base border-b border-slate-800 print:border-gray-400 pb-1">
              3. COVENANTS & TERMS
            </h3>
            <ol className="space-y-2 text-xs text-slate-300 print:text-black list-decimal list-inside leading-relaxed">
              {agreement.termsAndConditions?.map((term: string, idx: number) => (
                <li key={idx} className="pl-1">
                  {term}
                </li>
              ))}
            </ol>
          </div>

          {/* Section 4: Digital Signatures */}
          <div className="space-y-4 pt-4 border-t border-slate-800 print:border-black">
            <h3 className="font-bold text-white print:text-black text-base">
              4. EXECUTION & DIGITAL SIGNATURES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Tenant Signature Box */}
              <div className="p-4 rounded-2xl border border-slate-700 print:border-gray-400 space-y-2">
                <span className="text-xs text-slate-400 print:text-gray-500 font-bold block">
                  Tenant Digital Signature:
                </span>
                {agreement.tenant.signature ? (
                  <div className="p-3 bg-teal-950/40 print:bg-gray-100 rounded-xl border border-teal-800/50 flex items-center justify-between">
                    <div>
                      <span className="font-serif italic text-lg text-teal-300 print:text-black font-bold">
                        {agreement.tenant.signature}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        Signed: {new Date(agreement.tenant.signedAt).toLocaleString()}
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-teal-400" />
                  </div>
                ) : (
                  <div className="p-3 bg-slate-800/40 print:bg-gray-100 rounded-xl text-xs text-amber-400 italic">
                    Pending Tenant Signature
                  </div>
                )}
              </div>

              {/* Owner Signature Box */}
              <div className="p-4 rounded-2xl border border-slate-700 print:border-gray-400 space-y-2">
                <span className="text-xs text-slate-400 print:text-gray-500 font-bold block">
                  Owner / Landlord Digital Signature:
                </span>
                {agreement.owner.signature ? (
                  <div className="p-3 bg-orange-950/40 print:bg-gray-100 rounded-xl border border-orange-800/50 flex items-center justify-between">
                    <div>
                      <span className="font-serif italic text-lg text-orange-300 print:text-black font-bold">
                        {agreement.owner.signature}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        Signed: {new Date(agreement.owner.signedAt).toLocaleString()}
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-orange-400" />
                  </div>
                ) : (
                  <div className="p-3 bg-slate-800/40 print:bg-gray-100 rounded-xl text-xs text-amber-400 italic">
                    Pending Owner Signature
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* E-SIGN PANEL IF CURRENT USER HAS NOT SIGNED */}
        {!hasUserSigned && (
          <div className="no-print glass-panel p-6 sm:p-8 rounded-3xl border-2 border-teal-500/60 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2 text-teal-400">
              <PenTool className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Sign Agreement Digitally</h3>
            </div>
            <p className="text-xs text-slate-300">
              Type your full legal name below to append your cryptographically authenticated digital signature to this agreement.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={signatureInput}
                onChange={(e) => setSignatureInput(e.target.value)}
                placeholder="Enter Full Legal Name"
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white font-serif text-base focus:border-teal-500 focus:outline-none"
              />
              <button
                onClick={handleSign}
                disabled={isSigning}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-teal-950/50 flex items-center justify-center space-x-2 transition disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSigning ? 'Signing...' : 'Sign Agreement Digitally'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
