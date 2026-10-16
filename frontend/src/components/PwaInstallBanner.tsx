'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, X, Smartphone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if user hasn't closed it in this session
      const dismissed = sessionStorage.getItem('staybite_pwa_dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('To install StayBite on iOS: Tap Share button in Safari -> "Add to Home Screen". On Android: Tap browser 3-dots -> "Install app".');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('staybite_pwa_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950 border border-teal-500/40 rounded-2xl shadow-2xl p-4 flex items-center justify-between animate-bounce-subtle">
      <div className="flex items-center space-x-3">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-teal-500/50 flex-shrink-0">
          <Image src="/logo.png" alt="StayBite" fill className="object-cover" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <span>Install StayBite App</span>
            <span className="text-[10px] bg-teal-500/20 text-teal-400 px-1.5 py-0.5 rounded font-mono">PWA</span>
          </h4>
          <p className="text-xs text-slate-300 line-clamp-1">
            {t('installPrompt')}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 pl-3">
        <button
          onClick={handleInstallClick}
          className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold shadow-md flex items-center space-x-1 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
