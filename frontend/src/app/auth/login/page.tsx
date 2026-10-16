'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { fetchApi } from '../../../lib/api';
import { Lock, Mail, Phone, ArrowRight, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [mode, setMode] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // OTP Login states
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [demoCodeHint, setDemoCodeHint] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const res = await login(identifier, password);
    setIsSubmitting(false);

    if (res.success) {
      router.push('/');
    } else {
      setErrorMsg(res.message || 'Invalid email/phone or password');
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setIsSubmitting(true);
    setErrorMsg('');

    const res = await fetchApi('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
    setIsSubmitting(false);

    if (res.success) {
      setOtpSent(true);
      setDemoCodeHint(res.demoOtp || '123456');
    } else {
      setErrorMsg(res.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const res = await fetchApi('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp: otpCode })
    });
    setIsSubmitting(false);

    if (res.success && res.token) {
      localStorage.setItem('staybite_token', res.token);
      window.location.href = '/';
    } else if (res.isNewUser) {
      router.push(`/auth/signup?phone=${encodeURIComponent(phone)}`);
    } else {
      setErrorMsg(res.message || 'Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 relative z-10">
        {/* LOGO */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-teal-500/40 mb-3 shadow-lg">
              <Image src="/logo.png" alt="StayBite Logo" fill className="object-cover" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              STAY<span className="text-teal-400">BITE</span>
            </h2>
          </Link>
          <p className="text-xs text-slate-400 mt-1">Log in to manage your stays, messes, and deals</p>
        </div>

        {/* Tab Toggle: Password vs OTP */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-800/80 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('password');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              mode === 'password' ? 'bg-teal-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('otp');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              mode === 'otp' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mobile OTP Login
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* PASSWORD LOGIN FORM */}
        {mode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="admin@staybite.com or student email"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-950/40 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Log In to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* OTP LOGIN FORM */}
        {mode === 'otp' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Enter Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 9823011221"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs shadow-lg shadow-orange-950/40 flex items-center justify-center space-x-2 transition disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Sending OTP...' : 'Send Login OTP'}</span>
                  <KeyRound className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs">
                  OTP sent to {phone}. For testing use code: <strong>{demoCodeHint}</strong>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    maxLength={6}
                    placeholder="123456"
                    className="w-full text-center tracking-widest text-lg font-bold px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-xs shadow-lg transition"
                >
                  <span>{isSubmitting ? 'Verifying...' : 'Verify OTP & Continue'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* DEMO CREDENTIALS HELPER */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-slate-300">Quick Demo Accounts (Password: StayBite@123):</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={() => {
                setIdentifier('aarav.sharma@gmail.com');
                setPassword('StayBite@123');
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-teal-400"
            >
              Student (Aarav)
            </button>
            <button
              onClick={() => {
                setIdentifier('rohan.k@gmail.com');
                setPassword('StayBite@123');
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-400"
            >
              Employed (Rohan)
            </button>
            <button
              onClick={() => {
                setIdentifier('ramesh.rooms@staybite.com');
                setPassword('StayBite@123');
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-orange-400"
            >
              Room Owner (Ramesh)
            </button>
            <button
              onClick={() => {
                setIdentifier('annapurna.mess@staybite.com');
                setPassword('StayBite@123');
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400"
            >
              Mess Owner (Mangala)
            </button>
            <button
              onClick={() => {
                setIdentifier('admin@staybite.com');
                setPassword('Admin@StayBite2025!');
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-red-400 font-bold"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-teal-400 font-semibold hover:underline">
            Create new account
          </Link>
        </div>
      </div>
    </div>
  );
}
