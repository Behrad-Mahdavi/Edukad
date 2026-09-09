'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { NotificationBell } from '../notifications/NotificationBell';
import {
  Compass,
  CheckSquare,
  ShieldCheck,
  LogOut,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';

export function Navbar() {
  const { user, logout, isSuperAdmin, isMentor } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const departmentNames = {
    ENGINEERS: 'مهندسی',
    ARTISTS: 'آرتیست‌ها',
    OPS: 'آچارفرانسه',
  };

  const roleNames = {
    SUPER_ADMIN: 'مدیر ارشد',
    MENTOR: 'منتور',
    STUDENT: 'دانش‌آموز',
  };

  const levelNames: Record<string, string> = {
    NOVICE: 'نوآموز',
    PRACTITIONER: 'مجری',
    TEAM_LEAD: 'تیم‌لید',
    MENTOR_CANDIDATE: 'نامزد منتوری',
  };

  return (
    <header className="sticky top-4 z-40 px-4 max-w-7xl mx-auto">
      <div className="bg-white/95 backdrop-blur-md border-2 border-primary rounded-full px-5 py-3 shadow-[5px_6px_0_0_#21295a] flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg shadow-[2px_2px_0_0_#58bdaf] group-hover:rotate-6 transition-transform">
              E
            </span>
            <div className="flex flex-col">
              <span className="font-black text-xl text-primary leading-tight tracking-tight">
                Edukad
              </span>
              <span className="text-[10px] font-semibold text-secondary-dark leading-none">
                درخت مهارت رکاد
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 text-sm font-bold">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                pathname === '/'
                  ? 'bg-primary text-white shadow-[2px_2px_0_0_#58bdaf]'
                  : 'text-primary hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              مسیرهای یادگیری
            </Link>

            {isMentor && (
              <Link
                href="/mentor"
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  pathname === '/mentor'
                    ? 'bg-secondary-dark text-white shadow-[2px_2px_0_0_#21295a]'
                    : 'text-primary hover:bg-slate-100'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                صف بازبینی و منتوری
              </Link>
            )}

            {isSuperAdmin && (
              <Link
                href="/admin"
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  pathname === '/admin'
                    ? 'bg-accent text-white shadow-[2px_2px_0_0_#21295a]'
                    : 'text-primary hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                مدیریت کل
              </Link>
            )}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          {/* User Badges */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="text-right">
              <div className="font-bold text-xs text-primary flex items-center gap-1.5">
                <span>{user.fullName}</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  {roleNames[user.role]}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-medium text-slate-500">
                  دپارتمان {departmentNames[user.department]}
                </span>
                {user.level && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-secondary/20 text-secondary-dark flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    {levelNames[user.level]}
                  </span>
                )}
              </div>
            </div>
          </div>

          <NotificationBell />

          <button
            onClick={logout}
            title="خروج از حساب"
            className="p-2 rounded-xl text-slate-500 hover:text-accent hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
