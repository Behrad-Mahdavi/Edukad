'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Phone, Lock, ArrowLeft, Shield, Award, GraduationCap, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [phone, setPhone] = useState('09120000004'); // default Student Amir
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(phone, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'خطا در ورود به حساب کاربری');
    } finally {
      setLoading(false);
    }
  };

  const setDemoUser = (demoPhone: string) => {
    setPhone(demoPhone);
    setPassword('password123');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        {/* Playful Sticker Badge */}
        <div className="text-center mb-6">
          <div className="inline-block -rotate-2 bg-secondary px-4 py-1.5 rounded-full border-2 border-primary shadow-[3px_4px_0_0_#21295a] text-white font-black text-xs mb-3">
            ✨ هنرستان استارتاپی رکاد
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight">
            ورود به <span className="text-secondary rotate-1 inline-block">ادوکد</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            پلتفرم درخت مهارت و مأموریت‌های واقعی باشگاه محصول
          </p>
        </div>

        {/* Main Card */}
        <div className="sticker-card p-6 sm:p-8 bg-white">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border-2 border-rose-400 text-rose-700 text-xs font-bold text-right">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            <div>
              <label className="block font-bold text-xs text-primary mb-1.5">
                شماره موبایل
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="09120000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border-2 border-primary bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-secondary ltr text-left"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
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
              {loading ? 'در حال ورود...' : 'ورود به پنل کاربری'}
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switcher for Evaluation */}
          <div className="mt-8 pt-5 border-t-2 border-dashed border-slate-200">
            <span className="text-[11px] font-extrabold text-slate-400 block text-center mb-3">
              ورود سریع با کاربران تستی دمو:
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoUser('09120000004')}
                className="p-2 rounded-xl border border-primary/30 bg-bg-mint text-right text-[11px] hover:border-secondary transition-colors"
              >
                <div className="font-extrabold text-primary flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-secondary" />
                  امیررضا رضایی
                </div>
                <div className="text-[9px] text-slate-500 font-semibold">
                  دانش‌آموز (فرانت‌اند)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDemoUser('09120000002')}
                className="p-2 rounded-xl border border-primary/30 bg-bg-lavender text-right text-[11px] hover:border-primary transition-colors"
              >
                <div className="font-extrabold text-primary flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-primary" />
                  علی کاظمی
                </div>
                <div className="text-[9px] text-slate-500 font-semibold">
                  منتور ارشد فرانت‌اند
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDemoUser('09120000003')}
                className="p-2 rounded-xl border border-primary/30 bg-bg-blush text-right text-[11px] hover:border-accent transition-colors"
              >
                <div className="font-extrabold text-primary flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-accent" />
                  سارا حسینی
                </div>
                <div className="text-[9px] text-slate-500 font-semibold">
                  منتور مدیا و آرتیست
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDemoUser('09120000001')}
                className="p-2 rounded-xl border border-primary/30 bg-bg-neutral text-right text-[11px] hover:border-tertiary transition-colors"
              >
                <div className="font-extrabold text-primary flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-tertiary" />
                  مدیر سیستم رکاد
                </div>
                <div className="text-[9px] text-slate-500 font-semibold">
                  سوپرادمین کل
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
