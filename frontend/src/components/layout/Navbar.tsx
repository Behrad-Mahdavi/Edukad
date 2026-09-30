'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { NotificationBell } from '../notifications/NotificationBell';
import { formatToJalali } from '@/lib/utils';
import {
  Compass,
  CheckSquare,
  ShieldCheck,
  LogOut,
  Sparkles,
  Menu,
  X,
  Sun,
  Moon,
  Calendar,
  User,
} from 'lucide-react';

export function Navbar() {
  const { user, logout, isSuperAdmin, isMentor } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentJalaliDate, setCurrentJalaliDate] = useState<string>('');

  useEffect(() => {
    // Initial theme check
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    // Set Jalali date
    setCurrentJalaliDate(formatToJalali(new Date(), { showMonthName: true, includeDayName: true }));
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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
    <header className="sticky top-2 sm:top-4 z-40 px-2 sm:px-4 max-w-7xl mx-auto mb-2">
      <div className="bg-white/95 dark:bg-[#151C28]/95 backdrop-blur-md border border-[#EAEAEA] dark:border-gray-800 rounded-2xl px-3 sm:px-5 py-2.5 shadow-male dark:shadow-ecosystem flex items-center justify-between gap-2 sm:gap-4 transition-all">
        {/* Brand & Desktop Navigation */}
        <div className="flex items-center gap-2 sm:gap-5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sec dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 cursor-pointer"
            aria-label="منوی دسترسی"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center gap-2">
              <div className="relative w-9 h-9 rounded-xl bg-white dark:bg-[#1C2536] border-2 border-primary overflow-hidden shadow-ecosystem flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform">
                <Image
                  src="/images/edukad-logo.jpg"
                  alt="Edukad Logo"
                  width={36}
                  height={36}
                  className="object-contain w-full h-full rounded-lg"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-sm sm:text-base text-sec dark:text-white tracking-tight leading-none flex items-center gap-1">
                  Edukad
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                </span>
                <span className="text-[10px] font-bold text-primary dark:text-ecosystem-light">
                  هنرستان رکاد
                </span>
              </div>
            </div>
          </Link>


          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-bold mr-2">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 border ${
                pathname === '/'
                  ? 'bg-ecosystem-light dark:bg-ecosystem-darker/60 text-ecosystem-darker dark:text-ecosystem-light border-primary/40 font-black'
                  : 'text-ink-normal dark:text-gray-300 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Compass className="w-4 h-4 text-primary" />
              <span>مسیرهای یادگیری</span>
            </Link>

            {isMentor && (
              <Link
                href="/mentor"
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 border ${
                  pathname === '/mentor'
                    ? 'bg-male-light dark:bg-male-darker/60 text-sec dark:text-male-light border-sec/40 font-black'
                    : 'text-ink-normal dark:text-gray-300 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <CheckSquare className="w-4 h-4 text-sec dark:text-male-light" />
                <span>صف بازبینی منتور</span>
              </Link>
            )}

            {isSuperAdmin && (
              <Link
                href="/admin"
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 border ${
                  pathname === '/admin'
                    ? 'bg-female-light dark:bg-female-darker/60 text-female-darker dark:text-female-light border-female-normal/40 font-black'
                    : 'text-ink-normal dark:text-gray-300 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-female-normal" />
                <span>مدیریت کل</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Jalali Date + Dark Mode Switch + User Profile Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Jalali Date Pill */}
          {currentJalaliDate && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-[#1C2536] border border-gray-200 dark:border-gray-700 text-ink-normal/80 dark:text-gray-300 text-[11px] font-bold">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>{currentJalaliDate}</span>
            </div>
          )}

          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleDarkMode}
            title={isDarkMode ? 'تغییر به تم روز' : 'تغییر به تم شب'}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1C2536] text-ink-normal dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sec" />}
          </button>

          {/* User Info Badge */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
            <div className="text-right">
              <div className="font-bold text-xs text-sec dark:text-white flex items-center gap-1.5">
                <span>{user.fullName}</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary dark:text-ecosystem-light">
                  {roleNames[user.role]}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-medium text-ink-normal/60 dark:text-gray-400">
                  {departmentNames[user.department]}
                </span>
                {user.level && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-college-light dark:bg-college-darker text-college-darker dark:text-college-light border border-college-normal/30 flex items-center gap-0.5">
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
            className="p-2 rounded-xl text-gray-400 hover:text-female-normal hover:bg-female-light dark:hover:bg-female-darker/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-3 bg-white dark:bg-[#151C28] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-male dark:shadow-ecosystem animate-in fade-in duration-150 flex flex-col gap-2 text-right">
          <div className="pb-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="font-bold text-xs text-sec dark:text-white">{user.fullName}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
              {roleNames[user.role]} | دپارتمان {departmentNames[user.department]}
            </span>
          </div>

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-2 ${
              pathname === '/'
                ? 'bg-ecosystem-light dark:bg-ecosystem-darker/60 text-ecosystem-darker dark:text-ecosystem-light border border-primary/40'
                : 'text-ink-normal dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Compass className="w-4 h-4 text-primary" />
            <span>مسیرهای یادگیری</span>
          </Link>

          {isMentor && (
            <Link
              href="/mentor"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-2 ${
                pathname === '/mentor'
                  ? 'bg-male-light dark:bg-male-darker/60 text-sec dark:text-male-light border border-sec/40'
                  : 'text-ink-normal dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-sec dark:text-male-light" />
              <span>صف بازبینی و منتوری</span>
            </Link>
          )}

          {isSuperAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-2 ${
                pathname === '/admin'
                  ? 'bg-female-light dark:bg-female-darker/60 text-female-darker dark:text-female-light border border-female-normal/40'
                  : 'text-ink-normal dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-female-normal" />
              <span>پنل مدیریت کل</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
