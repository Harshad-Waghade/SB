'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../lib/api';
import { X, Send, Calendar, Phone, Mail, IndianRupee, CheckCircle2 } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    _id: string;
    title?: string;
    name?: string;
    listingType: 'room' | 'mess';
    rent?: number;
    monthlyPrice?: number;
  };
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose, listing }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState(
    `Hello, I am interested in ${listing.title || listing.name}. Please share details regarding availability and visit schedule.`
  );
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [budgetOffered, setBudgetOffered] = useState<string>(
    String(listing.rent || listing.monthlyPrice || '')
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to send an enquiry');
      return;
    }

    setIsSubmitting(true);
    const res = await fetchApi('/enquiries', {
      method: 'POST',
      body: JSON.stringify({
        listingType: listing.listingType,
        listingId: listing._id,
        message,
        phone,
        email,
        preferredMoveInDate: preferredDate || undefined,
        budgetOffered: budgetOffered ? Number(budgetOffered) : undefined
      })
    });

    setIsSubmitting(false);
    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } else {
      alert(res.message || 'Failed to submit enquiry');
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

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-teal-400 animate-bounce" />
            <h3 className="text-xl font-bold text-white">Enquiry Sent Successfully!</h3>
            <p className="text-sm text-slate-400 max-w-xs">
              The owner has been notified and will contact you via WhatsApp / Phone shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                Direct Owner Inquiry
              </span>
              <h3 className="text-xl font-bold text-white mt-1 line-clamp-1">
                {listing.title || listing.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  <span>Your Phone Number</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+91 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  <span>Preferred Move-In / Visit Date</span>
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-teal-400" />
                  <span>Your Expected Budget (₹)</span>
                </label>
                <input
                  type="number"
                  value={budgetOffered}
                  onChange={(e) => setBudgetOffered(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Message to Owner
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold text-sm shadow-lg shadow-teal-950/40 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending...' : 'Send Free Enquiry to Owner'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
