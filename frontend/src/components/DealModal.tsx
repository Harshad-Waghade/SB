'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../lib/api';
import { X, Handshake, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiry?: any;
  listing?: any;
  onSuccess?: (deal: any) => void;
}

export const DealModal: React.FC<DealModalProps> = ({
  isOpen,
  onClose,
  enquiry,
  listing,
  onSuccess
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [agreedPrice, setAgreedPrice] = useState(
    listing?.rent || listing?.monthlyPrice || 5500
  );
  const [agreedDeposit, setAgreedDeposit] = useState(listing?.deposit || 10000);
  const [durationMonths, setDurationMonths] = useState(11);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [needsAgreement, setNeedsAgreement] = useState<boolean>(true);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    const payload = {
      enquiryId: enquiry?._id || undefined,
      userId: enquiry?.senderId?._id || user._id,
      ownerId: enquiry?.recipientId?._id || listing?.ownerId?._id || user._id,
      listingType: enquiry?.listingType || listing?.listingType || 'room',
      listingId: enquiry?.listingId || listing?._id,
      agreedPrice: Number(agreedPrice),
      agreedDeposit: Number(agreedDeposit),
      startDate,
      durationMonths: Number(durationMonths),
      needsAgreement,
      notes
    };

    const res = await fetchApi('/deals', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      if (needsAgreement) {
        // Redirect to create agreement form for this deal
        router.push(`/dashboard/deals?createAgreementFor=${res.data._id}`);
      }
      if (onSuccess) onSuccess(res.data);
      onClose();
    } else {
      alert(res.message || 'Failed to create deal');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2.5 mb-1">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Finalize Deal & Terms</h3>
              <p className="text-xs text-slate-400">Lock in agreed rent, deposit, and lease duration</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Final Agreed Rent (₹/mo)
              </label>
              <input
                type="number"
                value={agreedPrice}
                onChange={(e) => setAgreedPrice(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Agreed Security Deposit (₹)
              </label>
              <input
                type="number"
                value={agreedDeposit}
                onChange={(e) => setAgreedDeposit(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lease Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Duration (Months)
              </label>
              <input
                type="number"
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                min={1}
                max={36}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* REQUIREMENT 27: DO YOU NEED AN AGREEMENT? */}
          <div className="pt-2">
            <label className="block text-sm font-bold text-white mb-2">
              Do you need a Digital Rental Agreement?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNeedsAgreement(true)}
                className={`p-3.5 rounded-2xl border text-left transition flex items-start space-x-3 ${
                  needsAgreement
                    ? 'border-teal-500 bg-teal-950/40 shadow-lg shadow-teal-950/40'
                    : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800'
                }`}
              >
                <FileText className={`w-5 h-5 flex-shrink-0 mt-0.5 ${needsAgreement ? 'text-teal-400' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-white">Yes, Create Agreement</div>
                  <div className="text-[11px] text-slate-400">Generate legally formatted e-sign document</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setNeedsAgreement(false)}
                className={`p-3.5 rounded-2xl border text-left transition flex items-start space-x-3 ${
                  !needsAgreement
                    ? 'border-teal-500 bg-teal-950/40 shadow-lg shadow-teal-950/40'
                    : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800'
                }`}
              >
                <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${!needsAgreement ? 'text-teal-400' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-white">No, Continue Directly</div>
                  <div className="text-[11px] text-slate-400">Oral / offline agreement outside StayBite</div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Deal Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 1 month advance rent paid, key handover on 1st."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold text-sm shadow-lg shadow-teal-950/40 flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            <Handshake className="w-4 h-4" />
            <span>{isSubmitting ? 'Finalizing...' : 'Accept & Confirm Deal'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default DealModal;
