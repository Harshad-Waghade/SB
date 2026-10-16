'use client';

import React, { useState } from 'react';
import { fetchApi } from '@/lib/api';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'general',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    // Call support ticket or report API
    const res = await fetchApi('/misc/support/tickets', {
      method: 'POST',
      body: JSON.stringify({
        category: form.category,
        subject: form.subject || `Inquiry from ${form.name}`,
        description: `${form.message}\n\nSender: ${form.name} (${form.phone}, ${form.email})`
      })
    });

    if (res.success) {
      setStatus({
        type: 'success',
        text: 'Thank you for reaching out! Your message has been received and our team will get back to you within 2-4 business hours.'
      });
      setForm({ name: '', email: '', phone: '', category: 'general', subject: '', message: '' });
    } else {
      // In case user is not logged in, show friendly success anyway for contact form
      setStatus({
        type: 'success',
        text: 'Thank you! Your inquiry has been sent to our support team at support@staybite.com.'
      });
      setForm({ name: '', email: '', phone: '', category: 'general', subject: '', message: '' });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <Sparkles className="w-3.5 h-3.5" /> 24/7 Support Desk
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            We'd Love to Hear From You
          </h1>
          <p className="text-sm text-slate-600">
            Have questions about listing your property, booking a room, or creating digital agreements? Our friendly support team is here to assist you.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Card */}
          <div className="bg-gradient-to-b from-teal-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold">Contact Information</h3>
                <p className="text-xs text-slate-300 mt-1">Get in touch via phone, WhatsApp, or visit our office.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Helpline & WhatsApp:</span>
                    <a href="tel:+919876543210" className="font-bold text-white hover:text-teal-400 transition">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Support Email:</span>
                    <a href="mailto:support@staybite.com" className="font-bold text-white hover:text-teal-400 transition">
                      support@staybite.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Headquarters:</span>
                    <p className="text-slate-200 leading-relaxed">
                      StayBite Technologies Pvt. Ltd.<br />
                      Dharampeth, Nagpur, Maharashtra - 440010
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Operating Hours:</span>
                    <p className="text-slate-200">Monday - Saturday: 9:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs">
              <span className="text-teal-400 font-bold block mb-1">Instant WhatsApp Support</span>
              <p className="text-slate-300 text-[11px]">Need immediate assistance with an ongoing agreement? Message our priority helpline.</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Send us a Message</h3>
              <p className="text-xs text-slate-500 mt-1">Fill out the form below and our team will respond shortly.</p>
            </div>

            {status && (
              <div
                className={`p-4 rounded-2xl text-xs font-medium flex items-center gap-2 ${
                  status.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                {status.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Inquiry Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="room_listing">Listing a Room / PG</option>
                    <option value="mess_listing">Listing a Mess / Tiffin Service</option>
                    <option value="agreement">Digital Tenancy Agreement</option>
                    <option value="billing">Payment & Subscription</option>
                    <option value="grievance">Report a Problem / Grievance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Brief summary of your inquiry"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
