'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/lib/auth-context';
import { Mail, Lock, ArrowLeft, Sparkles, UserPlus, LogIn, User, Code2, Palette, Briefcase } from 'lucide-react';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [department, setDepartment] = useState<'ENGINEERS' | 'ARTISTS' | 'OPS'>('ENGINEERS');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(identifier, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'خطا در ورود به حساب کاربری');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({
        fullName,
        email: regEmail,
        password: regPassword,
        department,
      });
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'خطا در ثبت‌نام کاربر جدید');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6 flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-ecosystem-light dark:bg-ecosystem-darker/50 text-ecosystem-darker dark:text-ecosystem-light border border-primary/40 shadow-ecosystem font-black text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>هنرستان استارتاپی رکاد</span>
          </div>


          <h1 className="text-2xl sm:text-3xl font-black text-sec dark:text-white tracking-tight text-center">
            {mode === 'login' ? 'ورود به' : 'عضویت در'}{' '}
            <span className="text-primary inline-block">سامانه Edukad</span>
          </h1>
          <p className="text-xs text-ink-normal/70 dark:text-gray-400 mt-1 font-medium text-center">
            پلتفرم درخت مهارت و شتابدهی مأموریت‌های واقعی باشگاه رکاد
          </p>
        </div>


        {/* Main Neo-Brutalist Card */}
        <div className="rokad-card p-6 sm:p-8 bg-white dark:bg-[#151C28] border border-[#EAEAEA] dark:border-gray-800 shadow-male dark:shadow-ecosystem rounded-2xl">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-gray-100 dark:bg-[#1C2536] p-1.5 border border-gray-200 dark:border-gray-700 mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-primary text-white font-black shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-sec dark:hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>ورود به حساب</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-primary text-white font-black shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-sec dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>ثبت‌نام جدید</span>
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-female-light dark:bg-female-darker/40 border border-female-normal/40 text-female-darker dark:text-female-light text-xs font-bold text-right">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-right">
              <div className="space-y-1.5">
                <label className="block font-bold text-xs text-ink-normal/90 dark:text-gray-300">
                  ایمیل کاربری
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="name@rokad.ir"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-[#1C2536] text-ink-normal dark:text-white text-xs sm:text-sm font-medium focus:border-primary focus:bg-white dark:focus:bg-[#1C2536] focus:outline-none transition-all ltr text-left"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-xs text-ink-normal/90 dark:text-gray-300">
                  رمز عبور
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-[#1C2536] text-ink-normal dark:text-white text-xs sm:text-sm font-medium focus:border-primary focus:bg-white dark:focus:bg-[#1C2536] focus:outline-none transition-all ltr text-left"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rokad-btn-primary w-full mt-3 py-3 text-sm"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>در حال ورود به حساب کاربری...</span>
                  </div>
                ) : (
                  <>
                    <span>ورود به سامانه</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-right">
              <div className="space-y-1">
                <label className="block font-bold text-xs text-ink-normal/90 dark:text-gray-300">
                  نام و نام خانوادگی
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="مثال: پارسا محمدی"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-[#1C2536] text-ink-normal dark:text-white text-xs sm:text-sm font-medium focus:border-primary focus:bg-white dark:focus:bg-[#1C2536] focus:outline-none transition-all text-right"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-xs text-ink-normal/90 dark:text-gray-300">
                  ایمیل کاربری
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-[#1C2536] text-ink-normal dark:text-white text-xs sm:text-sm font-medium focus:border-primary focus:bg-white dark:focus:bg-[#1C2536] focus:outline-none transition-all ltr text-left"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-xs text-ink-normal/90 dark:text-gray-300">
                  رمز عبور (حداقل ۶ کاراکتر)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-[#1C2536] text-ink-normal dark:text-white text-xs sm:text-sm font-medium focus:border-primary focus:bg-white dark:focus:bg-[#1C2536] focus:outline-none transition-all ltr text-left"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-xs text-ink-normal/90 dark:text-gray-300">
                  دپارتمان مهارتی در رکاد
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-[#1C2536] text-ink-normal dark:text-white text-xs sm:text-sm font-medium focus:border-primary focus:bg-white dark:focus:bg-[#1C2536] focus:outline-none transition-all text-right cursor-pointer"
                >
                  <option value="ENGINEERS">مهندسی و توسعه (کدنویسی، فرانت/بک، UI/UX)</option>
                  <option value="ARTISTS">آرتیست‌ها و رسانه (موشن، تدوین، گرافیک، برندینگ)</option>
                  <option value="OPS">آچارفرانسه و عملیات (مارکتینگ، رویداد، لجستیک)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rokad-btn-sec w-full mt-3 py-3 text-sm"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>در حال ایجاد حساب کاربری...</span>
                  </div>
                ) : (
                  <>
                    <span>عضویت و ورود به پنل</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
