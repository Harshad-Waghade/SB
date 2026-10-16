'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Home, Search, Heart, MessageSquare, User, PlusCircle, LayoutDashboard, Shield } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();

  const isOwner = user?.role === 'room_owner' || user?.role === 'mess_owner';
  const isAdmin = user?.role === 'admin';

  // Specific navigation for Owners vs Users
  const userItems = [
    { href: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { href: '/rooms', label: 'Search', icon: <Search className="w-5 h-5" /> },
    { href: '/dashboard/favorites', label: 'Saved', icon: <Heart className="w-5 h-5" /> },
    { href: '/messages', label: 'Chat', icon: <MessageSquare className="w-5 h-5" /> },
    { href: user ? '/dashboard' : '/auth/login', label: user ? 'Account' : 'Login', icon: <User className="w-5 h-5" /> }
  ];

  const ownerItems = [
    { href: '/owner', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/owner/listings', label: 'Listings', icon: <Home className="w-5 h-5" /> },
    { href: user?.role === 'room_owner' ? '/owner/add-room' : '/owner/add-mess', label: 'Add +', icon: <PlusCircle className="w-6 h-6 text-orange-400" /> },
    { href: '/owner/leads', label: 'Leads', icon: <MessageSquare className="w-5 h-5" /> },
    { href: '/settings', label: 'Profile', icon: <User className="w-5 h-5" /> }
  ];

  const adminItems = [
    { href: '/admin', label: 'Overview', icon: <Shield className="w-5 h-5" /> },
    { href: '/admin/approvals', label: 'Approvals', icon: <Home className="w-5 h-5" /> },
    { href: '/admin/users', label: 'Users', icon: <User className="w-5 h-5" /> },
    { href: '/admin/deals', label: 'Deals', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/settings', label: 'Settings', icon: <User className="w-5 h-5" /> }
  ];

  const items = isAdmin ? adminItems : isOwner ? ownerItems : userItems;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-nav bg-slate-950/95 border-t border-slate-800 pb-safe">
      <div className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-all ${
                isActive ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
