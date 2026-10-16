'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import {
  GraduationCap,
  Briefcase,
  Home,
  UtensilsCrossed,
  User,
  Mail,
  Phone,
  Lock,
  Tag,
  ArrowRight
} from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'employed' | 'room_owner' | 'mess_owner'>('student');
  const [referralCode, setReferralCode] = useState(searchParams.get('ref') || '');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const res = await registerUser({
      name,
      email,
      phone,
      password,
      role,
      referralCode: referralCode ? referralCode.toUpperCase().trim() : undefined
    });

    setIsSubmitting(false);

    if (res.success) {
      if (role === 'room_owner') {
        router.push('/owner/add-room');
      } else if (role === 'mess_owner') {
        router.push('/owner/add-mess');
      } else {
        router.push('/');
      }
    } else {
      setErrorMsg(res.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <div className="relative w-14 h-14 mx-auto rounded-full overflow-hidden border-2 border-teal-500/40 mb-2 shadow-lg">
              <Image src="/logo.png" alt="StayBite Logo" fill className="object-cover" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Join STAY<span className="text-teal-400">BITE</span>
            </h2>
          </Link>
          <p className="text-xs text-slate-400 mt-0.5">
            Create an account to find or list verified stays and food
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ROLE SELECTOR CARDS */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'student', title: 'Student', icon: <GraduationCap className="w-4 h-4 text-teal-400" /> },
                { id: 'employed', title: 'Employed', icon: <Briefcase className="w-4 h-4 text-blue-400" /> },
                { id: 'room_owner', title: 'Room Owner', icon: <Home className="w-4 h-4 text-orange-400" /> },
                { id: 'mess_owner', title: 'Mess Owner', icon: <UtensilsCrossed className="w-4 h-4 text-amber-400" /> }
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as any)}
                  className={`p-3 rounded-2xl border text-left transition flex items-center space-x-2.5 ${
                    role === r.id
                      ? 'border-teal-500 bg-teal-950/40 text-white shadow-md'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-slate-800">{r.icon}</div>
                  <span className="text-xs font-bold">{r.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Aarav Sharma"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+91 9876543210"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Create Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Referral Code (Optional)
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="e.g. AARA2025"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs uppercase focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white font-bold text-xs shadow-lg shadow-teal-950/40 flex items-center justify-center space-x-2 transition disabled:opacity-50 mt-2"
          >
            <span>{isSubmitting ? 'Creating Account...' : 'Create StayBite Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-teal-400 font-semibold hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400 text-xs">Loading StayBite Signup...</div>}>
      <SignupForm />
    </Suspense>
  );
}
