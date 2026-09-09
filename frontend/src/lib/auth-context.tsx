'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, getStoredToken } from './api';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  username?: string;
  email?: string;
  role: 'SUPER_ADMIN' | 'MENTOR' | 'STUDENT';
  level?: 'NOVICE' | 'PRACTITIONER' | 'TEAM_LEAD' | 'MENTOR_CANDIDATE' | null;
  department: 'ENGINEERS' | 'ARTISTS' | 'OPS';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (phone: string, pass: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isSuperAdmin: boolean;
  isMentor: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = getStoredToken();
    if (savedToken) {
      setToken(savedToken);
      setAuthToken(savedToken);
      api.auth
        .getMe()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          setAuthToken(null);
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (phone: string, pass: string) => {
    const res = await api.auth.login(phone, pass);
    setToken(res.accessToken);
    setAuthToken(res.accessToken);
    setUser(res.user);
  };

  const logout = () => {
    setToken(null);
    setAuthToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await api.auth.getMe();
      setUser(userData);
    } catch (e) {
      console.error(e);
    }
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isMentor = user?.role === 'MENTOR' || user?.role === 'SUPER_ADMIN';
  const isStudent = user?.role === 'STUDENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        refreshUser,
        isSuperAdmin,
        isMentor,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
