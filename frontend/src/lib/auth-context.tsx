'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, getStoredToken } from './api';
import { supabase } from './supabase';

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

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  department?: 'ENGINEERS' | 'ARTISTS' | 'OPS';
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (emailOrPhone: string, pass: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
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

  // Initialize auth from Supabase session or localStorage
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        // 1. Check active Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          if (!isMounted) return;
          setToken(session.access_token);
          setAuthToken(session.access_token);
          try {
            const userData = await api.auth.getMe();
            if (isMounted) setUser(userData);
          } catch {
            // If getMe fails with Supabase token, fall back
          }
          if (isMounted) setLoading(false);
          return;
        }

        // 2. Fallback to stored token
        const savedToken = getStoredToken();
        if (savedToken) {
          if (!isMounted) return;
          setToken(savedToken);
          setAuthToken(savedToken);
          try {
            const userData = await api.auth.getMe();
            if (isMounted) setUser(userData);
          } catch {
            setAuthToken(null);
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    // Listen to Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.access_token) {
        setToken(session.access_token);
        setAuthToken(session.access_token);
        try {
          const userData = await api.auth.getMe();
          setUser(userData);
        } catch {
          // Token might be newly minted
        }
      } else if (event === 'SIGNED_OUT') {
        setToken(null);
        setAuthToken(null);
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (emailOrPhone: string, pass: string) => {
    setLoading(true);
    try {
      const isEmail = emailOrPhone.includes('@');

      // 1. If email, attempt direct Supabase signIn
      if (isEmail) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailOrPhone.trim(),
          password: pass,
        });

        if (!error && data?.session) {
          const supaToken = data.session.access_token;
          setToken(supaToken);
          setAuthToken(supaToken);
          const userData = await api.auth.getMe();
          setUser(userData);
          return;
        }
      }

      // 2. Fallback to API login (supports phone & fallback)
      const res = await api.auth.login(emailOrPhone.trim(), pass);
      setToken(res.accessToken);
      setAuthToken(res.accessToken);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      // Register through backend which creates user in Supabase with email_confirm: true
      const res = await api.auth.register(data);

      // Now sign in to Supabase client directly
      const { data: loginData } = await supabase.auth.signInWithPassword({
        email: data.email.trim(),
        password: data.password,
      });

      const activeToken = loginData?.session?.access_token || res.accessToken;
      setToken(activeToken);
      setAuthToken(activeToken);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore signOut errors
    }
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
        register,
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
