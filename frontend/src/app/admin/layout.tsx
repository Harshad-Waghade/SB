'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Handshake,
  CreditCard,
  Tag,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Bell,
  Menu,
  X,
  AlertTriangle,
  Building,
  UtensilsCrossed
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/auth/login?redirect=/admin');
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Authenticating Admin Access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
        <div className="bg-slate-800 p-8 rounded-2xl max-w-md w-full text-center space-y-4 border border-rose-500/30">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Admin Privileges Required</h2>
          <p className="text-slate-400 text-sm">
            You must be logged in with an authorized Administrator account to access the StayBite Control Center.
          </p>
          <div className="pt-2">
            <Link
              href="/auth/login"
              className="inline-block px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-sm transition"
            >
              Sign In with Admin Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/approvals', label: 'Listing Approvals', icon: CheckSquare },
    { href: '/admin/users', label: 'User Directory', icon: Users },
    { href: '/admin/deals', label: 'Deals & Agreements', icon: Handshake },
    { href: '/admin/payments', label: 'Transactions & Revenue', icon: CreditCard },
    { href: '/admin/coupons', label: 'Coupons & Promos', icon: Tag },
    { href: '/admin/config', label: 'System & City Config', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between hidden md:flex min-h-screen sticky top-0">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-teal-500/20">
                S
              </div>
              <div>
                <span className="font-black text-lg tracking-tight text-white">STAYBITE</span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-teal-400">Admin Portal</span>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Platform Controls
            </div>
            {navLinks.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin User */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{user.name}</div>
                <div className="text-[10px] text-teal-400 font-medium">Super Admin</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white py-2 rounded-lg hover:bg-slate-900 border border-slate-800/80 transition"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 font-black flex items-center justify-center text-base">
            S
          </div>
          <span className="font-bold text-white text-base">StayBite Admin</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-slate-950/95 backdrop-blur-md p-6 space-y-4 overflow-y-auto">
          <nav className="space-y-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                    active ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-slate-300 rounded-xl text-sm font-semibold"
            >
              Public Site <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              onClick={logout}
              className="w-full py-3 bg-rose-600/20 text-rose-400 rounded-xl text-sm font-bold border border-rose-500/30"
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Pane */}
      <main className="flex-1 bg-slate-900 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
