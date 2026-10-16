'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { fetchApi } from '@/lib/api';
import {
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Handshake,
  FileText,
  MessageSquare,
  ShieldCheck,
  Check,
  Building,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react';

export default function NotificationsPage() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchNotifications = async () => {
    setLoading(true);
    const res = await fetchApi('/misc/notifications');
    if (res.success && res.data) {
      setNotifications(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) fetchNotifications();
  }, [isAuthenticated]);

  const markAsRead = async (id: string) => {
    await fetchApi(`/misc/notifications/${id}/read`, { method: 'PUT' });
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = async () => {
    await fetchApi('/misc/notifications/read-all', { method: 'PUT' });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deal_created':
      case 'deal_accepted':
        return <Handshake className="w-5 h-5 text-teal-600" />;
      case 'agreement_created':
      case 'agreement_signed':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'enquiry_received':
      case 'enquiry_accepted':
      case 'visit_scheduled':
        return <Building className="w-5 h-5 text-amber-600" />;
      case 'listing_approved':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      default:
        return <Bell className="w-5 h-5 text-teal-600" />;
    }
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === 'all' ? true : !n.isRead
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-2xl p-10 max-w-md text-center shadow-sm border border-slate-100 space-y-4">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto">
            <Bell className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Sign in to view notifications</h2>
          <p className="text-slate-500 text-sm">Stay updated on inquiries, deals, and agreement signatures.</p>
          <Link href="/auth/login" className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Updates on enquiries, digital agreements, and deal negotiations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition"
              >
                <Check className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
            <button
              onClick={fetchNotifications}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filter === 'unread'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-slate-100">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600 mb-2" />
            <p className="text-slate-500 text-xs">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-slate-100 space-y-3">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-base font-bold text-slate-800">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You'll receive alerts when owners respond to your enquiries, deals are accepted, or agreements are generated.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden shadow-sm">
            {filteredNotifications.map((item) => (
              <div
                key={item._id}
                onClick={() => !item.isRead && markAsRead(item._id)}
                className={`p-5 flex items-start gap-4 transition hover:bg-slate-50/70 cursor-pointer ${
                  !item.isRead ? 'bg-teal-50/30' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getNotificationIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm font-bold truncate ${!item.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-teal-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.body}
                  </p>

                  {item.link && (
                    <div className="pt-1">
                      <Link
                        href={item.link}
                        className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700"
                      >
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
