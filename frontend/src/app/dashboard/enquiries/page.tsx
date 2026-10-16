'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../context/LanguageContext';
import { fetchApi } from '../../../lib/api';
import {
  MessageSquare,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  Bed,
  UtensilsCrossed
} from 'lucide-react';

export default function EnquiriesPage() {
  const { t } = useLanguage();
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi('/enquiries/my').then((res) => {
      setIsLoading(false);
      if (res.success && res.data) {
        setEnquiries(res.data);
      }
    });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'visit_scheduled':
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center gap-1"><Calendar className="w-3 h-3" /> Visit Scheduled</span>;
      case 'accepted':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">✓ Accepted</span>;
      case 'converted_to_deal':
        return <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-bold">🎉 Deal Finalized</span>;
      case 'declined':
        return <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold">Declined</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Pending Review</span>;
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
              <MessageSquare className="w-6 h-6 text-teal-400" />
              <span>{t('enquiries')}</span>
            </h1>
            <p className="text-xs text-slate-400">Track owner responses, visit appointments, and negotiations</p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-slate-400">Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-3xl border border-slate-800 p-8 space-y-4">
            <MessageSquare className="w-16 h-16 text-slate-700 mx-auto" />
            <h3 className="text-xl font-bold text-white">{t('emptyEnquiries')}</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              You haven't sent any enquiries yet. Browse rooms or messes and click "Send Enquiry" to contact owners directly.
            </p>
            <Link
              href="/rooms"
              className="inline-block px-6 py-2.5 rounded-xl bg-teal-500 text-white font-semibold text-xs"
            >
              Browse Rooms & PGs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div
                key={enq._id}
                className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-lg hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    {enq.listingType === 'room' ? (
                      <Bed className="w-4 h-4 text-teal-400" />
                    ) : (
                      <UtensilsCrossed className="w-4 h-4 text-orange-400" />
                    )}
                    <span className="font-bold text-white text-base">
                      {enq.listing?.title || enq.listing?.name || 'Accommodation Enquiry'}
                    </span>
                  </div>
                  <div>{getStatusBadge(enq.status)}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Your Message:</span>
                    <p className="text-slate-200 bg-slate-850 p-3 rounded-xl border border-slate-800">
                      "{enq.message}"
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Details Sent:</span>
                    <div className="space-y-1 text-slate-300">
                      <p>Phone: {enq.phone}</p>
                      {enq.budgetOffered && <p>Offered Budget: ₹{enq.budgetOffered}</p>}
                      <p>Sent on: {new Date(enq.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Owner Contact / Status:</span>
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-750 space-y-1.5">
                      <div className="font-semibold text-white">{enq.recipientId?.name || 'Owner'}</div>
                      <div className="text-slate-300 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-teal-400" />
                        <span>{enq.recipientId?.phone || 'Contact provided on call'}</span>
                      </div>
                      {enq.visitDate && (
                        <div className="text-teal-400 font-medium">
                          📅 Scheduled Visit: {new Date(enq.visitDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {enq.ownerReply && (
                  <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-800/40 text-xs">
                    <span className="text-teal-400 font-bold block mb-0.5">Owner Response:</span>
                    <p className="text-slate-200">{enq.ownerReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
