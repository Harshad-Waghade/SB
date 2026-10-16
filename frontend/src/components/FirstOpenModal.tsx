'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../lib/translations';
import { GraduationCap, Briefcase, Home, UtensilsCrossed, CheckCircle2, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const FirstOpenModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'splash' | 'language' | 'role'>('splash');
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>('student');

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeen = localStorage.getItem('staybite_onboarding_completed');
    if (!hasSeen) {
      setIsOpen(true);
      // Auto transition from splash to language after 2.2 seconds
      const timer = setTimeout(() => {
        setStep('language');
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setStep('role');
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleComplete = () => {
    localStorage.setItem('staybite_onboarding_completed', 'true');
    localStorage.setItem('staybite_preferred_role', selectedRole);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative">
        <AnimatePresence mode="wait">
          {/* STEP 1: SPLASH SCREEN */}
          {step === 'splash' && (
            <motion.div
              key="splash"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="relative w-28 h-28 mb-6 drop-shadow-2xl animate-pulse-subtle">
                <Image
                  src="/logo.png"
                  alt="StayBite Logo"
                  fill
                  className="object-contain rounded-full border-2 border-teal-500/30"
                  priority
                />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
                STAY<span className="text-teal-400">BITE</span>
              </h1>
              <p className="text-lg font-medium text-orange-400 mb-2">
                "Find Your Stay. Find Your Food."
              </p>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                STAY • EAT • LIVE BETTER
              </p>
              <div className="mt-8 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}

          {/* STEP 2: LANGUAGE SELECTION */}
          {step === 'language' && (
            <motion.div
              key="language"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {t('languageSelectTitle')}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {t('languageSelectSubtitle')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5 mb-8">
                {[
                  { code: 'en' as Language, title: 'English', sub: 'Default platform language', flag: '🇬🇧' },
                  { code: 'hi' as Language, title: 'हिंदी (Hindi)', sub: 'सभी खोज और विवरण हिंदी में', flag: '🇮🇳' },
                  { code: 'mr' as Language, title: 'मराठी (Marathi)', sub: 'महाराष्ट्रातील सर्व खोल्या व मेस मराठीत', flag: '🚩' }
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleLanguageSelect(item.code)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                      language === item.code
                        ? 'border-teal-500 bg-teal-950/40 shadow-lg shadow-teal-950/50'
                        : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <span className="text-2xl">{item.flag}</span>
                      <div>
                        <div className="font-semibold text-white text-base">{item.title}</div>
                        <div className="text-xs text-slate-400">{item.sub}</div>
                      </div>
                    </div>
                    {language === item.code && (
                      <CheckCircle2 className="w-5 h-5 text-teal-400" />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep('role')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold transition shadow-lg shadow-teal-900/30"
              >
                {t('saveAndContinue')}
              </button>
            </motion.div>
          )}

          {/* STEP 3: ROLE ONBOARDING */}
          {step === 'role' && (
            <motion.div
              key="role"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {t('onboardingTitle')}
                </h2>
                <p className="text-sm text-slate-400">
                  {t('onboardingSubtitle')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                {[
                  {
                    id: 'student',
                    title: t('roleStudent'),
                    desc: t('roleStudentDesc'),
                    icon: <GraduationCap className="w-6 h-6 text-teal-400" />,
                    badge: 'College Verified'
                  },
                  {
                    id: 'employed',
                    title: t('roleEmployed'),
                    desc: t('roleEmployedDesc'),
                    icon: <Briefcase className="w-6 h-6 text-blue-400" />,
                    badge: 'Near IT Parks'
                  },
                  {
                    id: 'room_owner',
                    title: t('roleRoomOwner'),
                    desc: t('roleRoomOwnerDesc'),
                    icon: <Home className="w-6 h-6 text-orange-400" />,
                    badge: 'List Free'
                  },
                  {
                    id: 'mess_owner',
                    title: t('roleMessOwner'),
                    desc: t('roleMessOwnerDesc'),
                    icon: <UtensilsCrossed className="w-6 h-6 text-amber-400" />,
                    badge: 'Get Food Leads'
                  }
                ].map((r) => (
                  <div
                    key={r.id}
                    onClick={() => handleRoleSelect(r.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      selectedRole === r.id
                        ? 'border-teal-500 bg-teal-950/40 shadow-lg shadow-teal-950/40'
                        : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="p-2 rounded-lg bg-slate-800/80">{r.icon}</div>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {r.badge}
                        </span>
                      </div>
                      <h3 className="font-semibold text-white text-sm mb-1">{r.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setStep('language')}
                  className="px-4 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 via-teal-600 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white font-semibold transition shadow-lg shadow-teal-950/40"
                >
                  Start Exploring StayBite
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
