'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Language } from '../lib/translations';
import {
  Home,
  Bed,
  UtensilsCrossed,
  HelpCircle,
  Tag,
  Globe,
  Bell,
  Heart,
  PlusCircle,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { fetchApi } from '../lib/api';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      fetchApi('/notifications').then((res) => {
        if (res.success && res.unreadCount !== undefined) {
          setUnreadNotifications(res.unreadCount);
        }
      });
    }
  }, [user, pathname]);

  const navLinks = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/rooms', label: t('roomsCategory'), icon: <Bed className="w-4 h-4" /> },
    { href: '/mess', label: t('messCategory'), icon: <UtensilsCrossed className="w-4 h-4" /> },
    { href: '/how-it-works', label: t('howItWorks'), icon: <HelpCircle className="w-4 h-4" /> },
    { href: '/pricing', label: t('pricing'), icon: <Tag className="w-4 h-4" /> }
  ];

  const isOwner = user?.role === 'room_owner' || user?.role === 'mess_owner';
  const isAdmin = user?.role === 'admin';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'glass-nav shadow-lg' : 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LOGO */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-teal-500/40 group-hover:border-teal-400 transition-all shadow-md">
              <Image src="/logo.png" alt="StayBite Logo" fill className="object-cover" priority />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-black tracking-tight text-white">
                  STAY<span className="text-teal-400">BITE</span>
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  v1.0
                </span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wider hidden sm:inline">
                Find Your Stay • Find Your Food
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-1.5 ${
                    active
                      ? 'bg-teal-500/10 text-teal-400 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE ACTIONS */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
              >
                <Globe className="w-3.5 h-3.5 text-teal-400" />
                <span>
                  {language === 'en' ? 'EN' : language === 'hi' ? 'हिंदी' : 'मराठी'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl py-2 z-50">
                  {[
                    { code: 'en' as Language, label: 'English' },
                    { code: 'hi' as Language, label: 'हिंदी (Hindi)' },
                    { code: 'mr' as Language, label: 'मराठी (Marathi)' }
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs transition ${
                        language === l.code ? 'text-teal-400 font-bold bg-teal-500/10' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* If Logged In */}
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Owner quick Add Listing button */}
                {isOwner && (
                  <Link
                    href={user.role === 'room_owner' ? '/owner/add-room' : '/owner/add-mess'}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-md transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{user.role === 'room_owner' ? t('addRoom') : t('addMess')}</span>
                  </Link>
                )}

                {/* Notifications Link */}
                <Link
                  href="/notifications"
                  className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 pl-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div className="text-left hidden xl:block">
                      <div className="text-xs font-semibold text-white truncate max-w-[100px]">{user.name}</div>
                      <div className="text-[10px] text-teal-400 capitalize">{user.role.replace('_', ' ')}</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-orange-500 flex items-center justify-center font-bold text-xs text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-800">
                        <p className="text-xs font-semibold text-white">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>

                      {isAdmin ? (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2.5 text-xs text-teal-400 hover:bg-slate-800 font-semibold"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Control Center</span>
                        </Link>
                      ) : isOwner ? (
                        <>
                          <Link
                            href="/owner"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800"
                          >
                            <Home className="w-4 h-4 text-teal-400" />
                            <span>Owner Dashboard</span>
                          </Link>
                          <Link
                            href="/owner/listings"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800"
                          >
                            <Bed className="w-4 h-4 text-orange-400" />
                            <span>My Listings</span>
                          </Link>
                          <Link
                            href="/owner/leads"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800"
                          >
                            <Tag className="w-4 h-4 text-blue-400" />
                            <span>Leads & Enquiries</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800"
                          >
                            <Home className="w-4 h-4 text-teal-400" />
                            <span>Seeker Dashboard</span>
                          </Link>
                          <Link
                            href="/dashboard/favorites"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800"
                          >
                            <Heart className="w-4 h-4 text-rose-400" />
                            <span>Saved Favorites</span>
                          </Link>
                          <Link
                            href="/dashboard/deals"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800"
                          >
                            <Tag className="w-4 h-4 text-emerald-400" />
                            <span>My Deals & Agreements</span>
                          </Link>
                        </>
                      )}

                      <Link
                        href="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Settings & Profile</span>
                      </Link>

                      <div className="border-t border-slate-800 mt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t('logout')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-950/40 transition"
                >
                  {t('signup')}
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/notifications"
              className="relative p-2 rounded-lg bg-slate-900 text-slate-300"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE FULL DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-800 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Language:</span>
            <div className="flex space-x-2">
              {(['en', 'hi', 'mr'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    language === l ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {!user ? (
            <div className="pt-4 grid grid-cols-2 gap-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl border border-slate-700 text-sm font-semibold text-white"
              >
                {t('login')}
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl bg-teal-500 text-sm font-semibold text-white"
              >
                {t('signup')}
              </Link>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 space-y-1">
              <Link
                href={isAdmin ? '/admin' : isOwner ? '/owner' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-teal-400 bg-teal-500/10"
              >
                {isAdmin ? 'Admin Panel' : isOwner ? 'Owner Dashboard' : 'User Dashboard'}
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10"
              >
                {t('logout')}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
