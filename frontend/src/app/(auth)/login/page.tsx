'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Mail, Lock, ArrowLeft, Sparkles, UserPlus, LogIn, User } from 'lucide-react';

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
    <div className="min-h-[85vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        {/* Playful Sticker Badge */}
        <div className="text-center mb-6">
          <div className="inline-block -rotate-2 bg-secondary px-4 py-1.5 rounded-full border-2 border-primary shadow-[3px_4px_0_0_#21295a] text-white font-black text-xs mb-3">
            هنرستان استارتاپی رکاد
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight">
            {mode === 'login' ? 'ورود به' : 'عضویت در'}{' '}
            <span className="text-secondary rotate-1 inline-block">اجوکاد</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            سامانه جامع شتاب‌دهی و نقشه مهارت هنرستان استارتاپی رکاد
          </p>
        </div>

        {/* Main Card */}
        <div className="sticker-card p-6 sm:p-8 bg-white">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 border-2 border-primary mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-primary text-white shadow-[2px_2px_0_0_#58bdaf]'
                  : 'text-slate-600 hover:text-primary'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              ورود با ایمیل
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-secondary text-white shadow-[2px_2px_0_0_#21295a]'
                  : 'text-slate-600 hover:text-primary'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              ثبت‌نام فوری
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border-2 border-rose-400 text-rose-700 text-xs font-bold text-right">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-right">
              <div>
                <label className="block font-bold text-xs text-primary mb-1.5">
                  ایمیل حساب کاربری
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="name@rokad.ir"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border-2 border-primary bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-secondary ltr text-left"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-xs text-primary mb-1.5">
                  رمز عبور
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border-2 border-primary bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-secondary ltr text-left"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-primary text-white font-black text-sm shadow-[4px_5px_0_0_#58bdaf] hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'در حال ورود به سوپابیس...' : 'ورود به پنل کاربری'}
                <ArrowLeft className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-right">
              <div>
                <label className="block font-bold text-xs text-primary mb-1">
                  نام و نام خانوادگی
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: پارسا محمدی"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border-2 border-primary bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-secondary text-right"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-xs text-primary mb-1">
                  ایمیل (بدون نیاز به تایید)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border-2 border-primary bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-secondary ltr text-left"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-xs text-primary mb-1">
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
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border-2 border-primary bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-secondary ltr text-left"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-xs text-primary mb-1">
                  دپارتمان مهارتی
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-primary bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-secondary text-right"
                >
                  <option value="ENGINEERS">مهندسی و توسعه (کدنویسی، UI/UX)</option>
                  <option value="ARTISTS">آرتیست‌ها و رسانه (موشن، تدوین، گرافیک)</option>
                  <option value="OPS">آچارفرانسه و عملیات (مارکتینگ، ایونت)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-secondary text-white font-black text-sm shadow-[4px_5px_0_0_#21295a] hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'در حال ثبت در سوپابیس...' : 'ثبت‌نام و ورود آنی'}
                <ArrowLeft className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
