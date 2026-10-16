'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { fetchApi } from '@/lib/api';
import DealModal from '@/components/DealModal';
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock3,
  MessageSquare,
  Handshake,
  DollarSign,
  ArrowRight,
  RefreshCw,
  Eye,
  Send,
  UserCheck
} from 'lucide-react';

export default function OwnerLeadsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<any>(null);

  // Visit Modal
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [visitLead, setVisitLead] = useState<any>(null);
  const [visitDate, setVisitDate] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  const [schedulingVisit, setSchedulingVisit] = useState(false);

  // Reply Modal
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyLead, setReplyLead] = useState<any>(null);
  const [ownerReplyText, setOwnerReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState('contacted');
  const [sendingReply, setSendingReply] = useState(false);

  // Deal Modal
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [dealTarget, setDealTarget] = useState<any>(null);

  const fetchLeads = async () => {
    setLoading(true);
    const res = await fetchApi('/enquiries/my');
    if (res.success && res.data) {
      setLeads(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleScheduleVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitLead || !visitDate) return;
    setSchedulingVisit(true);

    const res = await fetchApi(`/enquiries/${visitLead._id}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status: 'visit_scheduled',
        visitDate,
        visitNotes
      })
    });

    if (res.success) {
      alert('Visit scheduled successfully! Seeker has been notified.');
      setVisitModalOpen(false);
      setVisitLead(null);
      setVisitDate('');
      setVisitNotes('');
      fetchLeads();
    } else {
      alert(res.message || 'Failed to schedule visit');
    }
    setSchedulingVisit(false);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyLead || !ownerReplyText) return;
    setSendingReply(true);

    const res = await fetchApi(`/enquiries/${replyLead._id}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status: replyStatus,
        ownerReply: ownerReplyText
      })
    });

    if (res.success) {
      alert('Reply sent & status updated successfully!');
      setReplyModalOpen(false);
      setReplyLead(null);
      setOwnerReplyText('');
      fetchLeads();
    } else {
      alert(res.message || 'Failed to send reply');
    }
    setSendingReply(false);
  };

  const openDealCreation = (lead: any) => {
    setDealTarget({
      seekerId: lead.senderId?._id,
      seekerName: lead.senderId?.name,
      listingType: lead.listingType,
      listingId: lead.listingId,
      listingTitle: lead.listing?.title || lead.listing?.name || 'Property',
      defaultRent: lead.listing?.rent || lead.listing?.monthlyPrice || lead.budgetOffered || 5000,
      enquiryId: lead._id
    });
    setDealModalOpen(true);
  };

  const filteredLeads = leads.filter((item) => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const name = item.senderId?.name || '';
    const phone = item.phone || item.senderId?.phone || '';
    const email = item.email || item.senderId?.email || '';
    const title = item.listing?.title || item.listing?.name || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><Clock3 className="w-3.5 h-3.5" /> New Lead</span>;
      case 'contacted':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"><Phone className="w-3.5 h-3.5" /> Contacted</span>;
      case 'visit_scheduled':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200"><Calendar className="w-3.5 h-3.5" /> Visit Scheduled</span>;
      case 'converted_to_deal':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><Handshake className="w-3.5 h-3.5" /> Converted to Deal</span>;
      case 'closed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"><XCircle className="w-3.5 h-3.5" /> Closed / Rejected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Leads & Enquiries Manager</h1>
                <p className="text-sm text-slate-500">Track and respond to verified seeker inquiries, schedule property visits, and convert leads into digital deals.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchLeads}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium text-sm transition shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              href="/owner/listings"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium text-sm transition shadow-sm"
            >
              Manage Listings
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by seeker name, phone, listing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'All Leads' },
              { id: 'pending', label: 'New (Pending)' },
              { id: 'contacted', label: 'Contacted' },
              { id: 'visit_scheduled', label: 'Visit Scheduled' },
              { id: 'converted_to_deal', label: 'Converted' },
              { id: 'closed', label: 'Closed' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  statusFilter === tab.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leads List */}
        {loading ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-slate-100">
            <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Loading incoming enquiries...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-slate-100 space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No enquiries found</h3>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              {searchTerm || statusFilter !== 'all'
                ? 'No inquiries match your current filters. Try changing or clearing your search criteria.'
                : 'When students or working professionals enquire about your rooms or messes, they will show up here.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredLeads.map((lead) => (
              <div
                key={lead._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  {/* Seeker Info */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      {lead.senderId?.name ? lead.senderId.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900">{lead.senderId?.name || 'Seeker'}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-600 capitalize">
                          {lead.senderId?.role || 'Seeker'}
                        </span>
                        {getStatusBadge(lead.status)}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Received {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {lead.phone && (
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {lead.phone}
                          </span>
                        )}
                        {lead.email && (
                          <span className="flex items-center gap-1 text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {lead.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Listing Badge */}
                  <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-100/60 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {lead.listing?.images?.[0] ? (
                        <img src={lead.listing.images[0]} alt="Listing" className="w-full h-full object-cover" />
                      ) : (
                        <MapPin className="w-5 h-5 text-teal-600" />
                      )}
                    </div>
                    <div className="text-xs">
                      <div className="font-semibold text-slate-900 truncate max-w-[200px]">
                        {lead.listing?.title || lead.listing?.name || 'Listing'}
                      </div>
                      <div className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {lead.listing?.locality ? `${lead.listing.locality}, ` : ''}{lead.listing?.city || ''}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message & Request Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-xl text-xs">
                  <div className="md:col-span-2 space-y-1.5">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Seeker Message:</span>
                    <p className="text-slate-800 text-sm font-normal bg-white p-3 rounded-lg border border-slate-200/60 leading-relaxed">
                      "{lead.message}"
                    </p>
                    {lead.ownerReply && (
                      <div className="mt-2 bg-teal-50/70 p-3 rounded-lg border border-teal-100 text-slate-800">
                        <span className="font-semibold text-teal-800 text-[10px] uppercase block mb-0.5">Your Reply:</span>
                        <p className="text-slate-700 text-xs leading-relaxed">{lead.ownerReply}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200/60 pt-3 md:pt-0 md:pl-4">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Preferred Move-In:</span>
                      <span className="font-semibold text-slate-800 text-xs">
                        {lead.preferredMoveInDate
                          ? new Date(lead.preferredMoveInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'Immediate / Flexible'}
                      </span>
                    </div>

                    {lead.budgetOffered && (
                      <div>
                        <span className="text-slate-500 block text-[11px]">Budget Offered:</span>
                        <span className="font-bold text-teal-700 text-sm">₹{lead.budgetOffered.toLocaleString('en-IN')}/mo</span>
                      </div>
                    )}

                    {lead.visitDate && (
                      <div className="bg-purple-50 p-2 rounded-lg border border-purple-200">
                        <span className="text-purple-700 font-semibold block text-[11px] flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Visit Confirmed:
                        </span>
                        <span className="font-bold text-purple-900 text-xs">
                          {new Date(lead.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {lead.visitNotes && <p className="text-purple-800 text-[10px] mt-0.5">{lead.visitNotes}</p>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        Call
                      </a>
                    )}
                    {lead.phone && (
                      <a
                        href={`https://wa.me/91${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.senderId?.name || '')},%20regarding%20your%20StayBite%20enquiry...`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        WhatsApp
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setReplyLead(lead);
                        setOwnerReplyText(lead.ownerReply || '');
                        setReplyStatus(lead.status === 'pending' ? 'contacted' : lead.status);
                        setReplyModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition"
                    >
                      <Send className="w-3.5 h-3.5 text-slate-500" />
                      Reply / Note
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setVisitLead(lead);
                        setVisitModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-semibold transition border border-purple-200"
                    >
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      Schedule Visit
                    </button>

                    <button
                      onClick={() => openDealCreation(lead)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 text-white hover:bg-teal-700 rounded-lg text-xs font-bold transition shadow-sm"
                    >
                      <Handshake className="w-3.5 h-3.5" />
                      Create Deal & Agreement
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Visit Modal */}
      {visitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-lg">
                <Calendar className="w-5 h-5" />
                <span>Schedule Property Visit</span>
              </div>
              <button
                onClick={() => setVisitModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleVisit} className="space-y-4 text-sm">
              <p className="text-xs text-slate-500">
                Scheduling a visit for <strong>{visitLead?.senderId?.name}</strong> for{' '}
                <strong>{visitLead?.listing?.title || visitLead?.listing?.name}</strong>.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Visit Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Meeting Instructions / Directions (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Please ring the main bell or call when at the gate. Bring college ID."
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVisitModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={schedulingVisit}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {schedulingVisit ? 'Scheduling...' : 'Confirm & Notify Seeker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-teal-700 font-bold text-lg">
                <Send className="w-5 h-5" />
                <span>Reply & Update Status</span>
              </div>
              <button
                onClick={() => setReplyModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Update Lead Status
                </label>
                <select
                  value={replyStatus}
                  onChange={(e) => setReplyStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs"
                >
                  <option value="contacted">Contacted Seeker</option>
                  <option value="pending">Pending</option>
                  <option value="visit_scheduled">Visit Scheduled</option>
                  <option value="converted_to_deal">Converted to Deal</option>
                  <option value="closed">Closed / Not Interested</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message / Response *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type your reply to the seeker..."
                  value={ownerReplyText}
                  onChange={(e) => setOwnerReplyText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {sendingReply ? 'Sending...' : 'Save & Send Reply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deal Modal */}
      {dealModalOpen && dealTarget && (
        <DealModal
          isOpen={dealModalOpen}
          onClose={() => setDealModalOpen(false)}
          seekerId={dealTarget.seekerId}
          seekerName={dealTarget.seekerName}
          listingType={dealTarget.listingType}
          listingId={dealTarget.listingId}
          listingTitle={dealTarget.listingTitle}
          defaultRent={dealTarget.defaultRent}
          enquiryId={dealTarget.enquiryId}
          onDealCreated={() => {
            fetchLeads();
          }}
        />
      )}
    </div>
  );
}
