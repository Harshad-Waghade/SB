'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { fetchApi } from '@/lib/api';
import {
  User,
  Globe,
  Shield,
  Phone,
  Mail,
  Building,
  GraduationCap,
  Briefcase,
  Heart,
  Save,
  LogOut,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const { user, profile, isAuthenticated, logout, setUser, setProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'language' | 'security'>('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    collegeOrWorkplace: '',
    courseOrDesignation: '',
    gender: 'prefer_not_to_say',
    bio: '',
    currentCity: '',
    budgetMin: 3000,
    budgetMax: 15000,
    roomPreference: 'single',
    foodPreference: 'both',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'student',
        collegeOrWorkplace: profile?.collegeOrWorkplace || '',
        courseOrDesignation: profile?.courseOrDesignation || '',
        gender: profile?.gender || 'prefer_not_to_say',
        bio: profile?.bio || '',
        currentCity: profile?.currentCity || 'Nagpur',
        budgetMin: profile?.budgetMin || 3000,
        budgetMax: profile?.budgetMax || 15000,
        roomPreference: profile?.roomPreference || 'single',
        foodPreference: profile?.foodPreference || 'both',
        emergencyContactName: profile?.emergencyContact?.name || '',
        emergencyContactPhone: profile?.emergencyContact?.phone || '',
        emergencyContactRelation: profile?.emergencyContact?.relation || ''
      });
    }
  }, [user, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      name: formData.name,
      collegeOrWorkplace: formData.collegeOrWorkplace,
      courseOrDesignation: formData.courseOrDesignation,
      gender: formData.gender,
      bio: formData.bio,
      currentCity: formData.currentCity,
      budgetMin: Number(formData.budgetMin),
      budgetMax: Number(formData.budgetMax),
      roomPreference: formData.roomPreference,
      foodPreference: formData.foodPreference,
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relation: formData.emergencyContactRelation
      }
    };

    const res = await fetchApi('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    if (res.success) {
      if (res.user) setUser(res.user);
      if (res.profile) setProfile(res.profile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to update profile' });
    }
    setSaving(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-2xl p-10 max-w-md text-center shadow-sm border border-slate-100 space-y-4">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Please sign in</h2>
          <p className="text-slate-500 text-sm">Sign in to edit your profile and preferences.</p>
          <a href="/auth/login" className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm">
            Sign In
          </a>
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
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
                {user?.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')} • {user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'preferences', label: 'Stay & Food Preferences', icon: Heart },
            { id: 'language', label: 'Language & Region', icon: Globe },
            { id: 'security', label: 'Account & Safety', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <h3 className="font-bold text-slate-900 text-sm">Personal Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current City</label>
                  <input
                    type="text"
                    value={formData.currentCity}
                    onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">College or Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. VNIT Nagpur or TCS Infotech"
                    value={formData.collegeOrWorkplace}
                    onChange={(e) => setFormData({ ...formData, collegeOrWorkplace: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course or Job Role</label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech Computer Science or Software Engineer"
                    value={formData.courseOrDesignation}
                    onChange={(e) => setFormData({ ...formData, courseOrDesignation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Role</label>
                  <input
                    type="text"
                    disabled
                    value={formData.role.replace('_', ' ').toUpperCase()}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">About Me / Bio</label>
                <textarea
                  rows={3}
                  placeholder="Share a short bio with roommates and owners..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-xs mb-3">Emergency Contact (Optional)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Phone (+91...)"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Relation (e.g. Parent, Guardian)"
                    value={formData.emergencyContactRelation}
                    onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-5">
              <h3 className="font-bold text-slate-900 text-sm">Accommodation & Food Preferences</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room Preference</label>
                  <select
                    value={formData.roomPreference}
                    onChange={(e) => setFormData({ ...formData, roomPreference: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="single">Single Room (Private)</option>
                    <option value="double">Double Sharing</option>
                    <option value="triple">Triple Sharing</option>
                    <option value="pg">Paying Guest (PG)</option>
                    <option value="flat_1bhk">1 BHK Flat</option>
                    <option value="flat_2bhk">2 BHK Flat</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Food Preference</label>
                  <select
                    value={formData.foodPreference}
                    onChange={(e) => setFormData({ ...formData, foodPreference: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="veg">Pure Vegetarian</option>
                    <option value="non_veg">Non-Vegetarian</option>
                    <option value="jain">Jain Food Only</option>
                    <option value="both">Both Veg & Non-Veg</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Budget Min (₹)</label>
                  <input
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Budget Max (₹)</label>
                  <input
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Select Application Language</h3>
              <p className="text-xs text-slate-500">
                Choose your preferred interface language across StayBite:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { id: 'en', name: 'English', native: 'English' },
                  { id: 'hi', name: 'Hindi', native: 'हिंदी' },
                  { id: 'mr', name: 'Marathi', native: 'मराठी' }
                ].map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setLanguage(lang.id as any)}
                    className={`p-4 rounded-xl border text-left transition ${
                      language === lang.id
                        ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-base font-bold text-slate-900">{lang.native}</div>
                    <div className="text-xs text-slate-500">{lang.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">Account Security</h3>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Mobile Verification</span>
                    <span className="text-slate-500">{formData.phone}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-bold border border-emerald-200">
                    Verified ✓
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Referral Code</span>
                    <span className="font-mono text-slate-600">{user?.referralCode || 'SB-USER'}</span>
                  </div>
                  <span className="text-teal-600 font-bold">Wallet: ₹{user?.walletBalance || 0}</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
