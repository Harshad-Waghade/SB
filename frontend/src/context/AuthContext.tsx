'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../lib/api';

export type UserRole = 'student' | 'employed' | 'room_owner' | 'mess_owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  referralCode: string;
  walletBalance: number;
}

interface AuthContextType {
  user: User | null;
  profile: any | null;
  token: string | null;
  isLoading: boolean;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  registerUser: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUserContext: (user: User, profile?: any) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  token: null,
  isLoading: true,
  login: async () => ({ success: false }),
  registerUser: async () => ({ success: false }),
  logout: () => {},
  refreshUser: async () => {},
  updateUserContext: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('staybite_token');
    if (!storedToken) {
      setUser(null);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    const res = await fetchApi('/auth/me');
    if (res.success && res.user) {
      setUser(res.user);
      setProfile(res.profile || null);
    } else {
      localStorage.removeItem('staybite_token');
      setUser(null);
      setProfile(null);
      setToken(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (identifier: string, pass: string) => {
    const res = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password: pass })
    });

    if (res.success && res.token) {
      localStorage.setItem('staybite_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile || null);
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message || 'Login failed' };
  };

  const registerUser = async (data: any) => {
    const res = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (res.success && res.token) {
      localStorage.setItem('staybite_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    localStorage.removeItem('staybite_token');
    setToken(null);
    setUser(null);
    setProfile(null);
    window.location.href = '/';
  };

  const updateUserContext = (newUser: User, newProfile?: any) => {
    setUser(newUser);
    if (newProfile) setProfile(newProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isLoading,
        login,
        registerUser,
        logout,
        refreshUser,
        updateUserContext
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
