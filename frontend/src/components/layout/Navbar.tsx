'use client';

import React, { useState } from 'react';
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
  Menu,
  X,
} from 'lucide-react';

export function Navbar() {
  const { user, logout, isSuperAdmin, isMentor } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-2 sm:top-4 z-40 px-2 sm:px-4 max-w-7xl mx-auto">
      <div className="bg-white/95 backdrop-blur-md border-2 border-primary rounded-2xl sm:rounded-full px-3 sm:px-5 py-2 sm:py-3 shadow-[4px_5px_0_0_#21295a] flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-6">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-xl border border-primary text-primary hover:bg-slate-100 active:scale-95"
            aria-label="منوی دسترسی"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/images/Primary Logo Fa-01.svg"
              alt="Edukad Logo"
              className="h-9 w-auto group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Navigation Links */}
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
        <div className="flex items-center gap-2 sm:gap-3">
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
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-accent hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-3 bg-white border-2 border-primary rounded-2xl shadow-[4px_5px_0_0_#21295a] animate-in fade-in duration-150 flex flex-col gap-2 text-right">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="font-bold text-xs text-primary">{user.fullName}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
              {roleNames[user.role]} | دپارتمان {departmentNames[user.department]}
            </span>
          </div>

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-2 ${
              pathname === '/'
                ? 'bg-primary text-white'
                : 'text-primary hover:bg-slate-50'
            }`}
          >
            <Compass className="w-4 h-4" />
            مسیرهای یادگیری
          </Link>

          {isMentor && (
            <Link
              href="/mentor"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-2 ${
                pathname === '/mentor'
                  ? 'bg-secondary-dark text-white'
                  : 'text-primary hover:bg-slate-50'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              صف بازبینی و منتوری
            </Link>
          )}

          {isSuperAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-2 ${
                pathname === '/admin'
                  ? 'bg-accent text-white'
                  : 'text-primary hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              پنل مدیریت کل
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
