'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Ban,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  RefreshCw,
  MoreVertical,
  UserCheck,
  UserX,
  Edit,
  GraduationCap,
  Briefcase,
  Building,
  UtensilsCrossed
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');
  const [blockedFilter, setBlockedFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Block Modal
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [blockReason, setBlockReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    let query = `/admin/users?page=${page}&limit=15`;
    if (roleFilter !== 'all') query += `&role=${roleFilter}`;
    if (verifiedFilter !== 'all') query += `&isVerified=${verifiedFilter}`;
    if (blockedFilter !== 'all') query += `&isBlocked=${blockedFilter}`;
    if (search.trim()) query += `&search=${encodeURIComponent(search.trim())}`;

    const res = await fetchApi(query);
    if (res.success) {
      setUsers(res.data || []);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages || 1);
        setTotalCount(res.pagination.total || 0);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, verifiedFilter, blockedFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const toggleVerify = async (userId: string, currentStatus: boolean) => {
    const res = await fetchApi(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isVerified: !currentStatus })
    });

    if (res.success) {
      setUsers(users.map((u) => (u._id === userId ? { ...u, isVerified: !currentStatus } : u)));
    } else {
      alert(res.message || 'Failed to update verification status');
    }
  };

  const handleBlockUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setProcessingAction(true);

    const isBlocking = !selectedUser.isBlocked;
    const res = await fetchApi(`/admin/users/${selectedUser._id}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        isBlocked: isBlocking,
        blockedReason: isBlocking ? blockReason : undefined
      })
    });

    if (res.success) {
      alert(isBlocking ? 'User suspended successfully' : 'User unblocked successfully');
      setBlockModalOpen(false);
      setSelectedUser(null);
      setBlockReason('');
      fetchUsers();
    } else {
      alert(res.message || 'Action failed');
    }
    setProcessingAction(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="w-3.5 h-3.5 text-teal-400" />;
      case 'employed':
        return <Briefcase className="w-3.5 h-3.5 text-blue-400" />;
      case 'room_owner':
        return <Building className="w-3.5 h-3.5 text-purple-400" />;
      case 'mess_owner':
        return <UtensilsCrossed className="w-3.5 h-3.5 text-orange-400" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" /> Identity & Access Management
          </div>
          <h1 className="text-2xl font-black text-white">User Accounts Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Total of {totalCount} registered students, professionals, room owners, and food service providers.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, phone (+91...), email, referral code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-xl text-xs transition"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-slate-500 font-semibold text-[11px]">Role:</span>
            {[
              { id: 'all', label: 'All Roles' },
              { id: 'student', label: 'Students' },
              { id: 'employed', label: 'Employed' },
              { id: 'room_owner', label: 'Room Owners' },
              { id: 'mess_owner', label: 'Mess Owners' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setRoleFilter(tab.id);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  roleFilter === tab.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Verification Status */}
            <select
              value={verifiedFilter}
              onChange={(e) => {
                setVerifiedFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">All Verification</option>
              <option value="true">Verified Only (✓)</option>
              <option value="false">Unverified</option>
            </select>

            {/* Blocked Status */}
            <select
              value={blockedFilter}
              onChange={(e) => {
                setBlockedFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">All Account Status</option>
              <option value="false">Active Only</option>
              <option value="true">Suspended Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-400">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Contact Details</th>
                <th className="px-6 py-4">StayBite Verified</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-500" />
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No users found matching current filters.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-700 text-slate-950 font-bold flex items-center justify-center flex-shrink-0">
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            {u.name}
                            {u.isVerified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" title="StayBite Verified" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Ref: {u.referralCode || 'SB-USER'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-[11px] capitalize">
                        {getRoleIcon(u.role)}
                        {u.role?.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-6 py-4 space-y-0.5">
                      <div className="text-slate-300 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" /> {u.phone}
                      </div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-500" /> {u.email}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleVerify(u._id, Boolean(u.isVerified))}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                          u.isVerified
                            ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30'
                            : 'bg-slate-900 text-slate-500 border border-slate-800 hover:bg-teal-500/10 hover:text-teal-400'
                        }`}
                        title="Click to toggle verified status"
                      >
                        {u.isVerified ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5" /> Unverified
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      {u.isBlocked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                          <Ban className="w-3 h-3" /> Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-slate-500 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {u.isBlocked ? (
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setBlockModalOpen(true);
                          }}
                          className="px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-lg text-xs font-semibold transition"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setBlockReason('');
                            setBlockModalOpen(true);
                          }}
                          className="px-3 py-1 bg-rose-600/10 text-rose-400 hover:bg-rose-600/20 border border-rose-500/20 rounded-lg text-xs font-semibold transition"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-40 hover:text-white"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-40 hover:text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Block / Unblock Modal */}
      {blockModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-800 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                <Ban className="w-5 h-5" />
                <span>{selectedUser.isBlocked ? 'Unblock User Account' : 'Suspend User Account'}</span>
              </div>
              <button
                onClick={() => setBlockModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBlockUser} className="space-y-4 text-xs">
              <p className="text-slate-300">
                Are you sure you want to {selectedUser.isBlocked ? 'restore access for' : 'suspend'}{' '}
                <strong>{selectedUser.name}</strong> ({selectedUser.phone})?
              </p>

              {!selectedUser.isBlocked && (
                <div>
                  <label className="block text-xs font-semibold text-rose-300 mb-1">
                    Suspension Reason *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Terms of service violation, fraudulent property listing, abusive chat behavior."
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setBlockModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingAction}
                  className={`px-5 py-2 font-bold rounded-xl shadow-lg transition ${
                    selectedUser.isBlocked
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  {processingAction
                    ? 'Processing...'
                    : selectedUser.isBlocked
                    ? 'Confirm Unblock'
                    : 'Confirm Suspension'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
