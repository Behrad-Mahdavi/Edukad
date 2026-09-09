'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  Compass,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Users,
  CheckSquare,
  ShieldCheck,
  Award,
} from 'lucide-react';

export default function HomePage() {
  const { user, loading, isMentor, isSuperAdmin } = useAuth();
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      Promise.all([api.roadmaps.getAll(), api.enrollments.getMyEnrollments()])
        .then(([allRoadmaps, enrollments]) => {
          setRoadmaps(allRoadmaps);
          setMyEnrollments(enrollments);
        })
        .catch(console.error)
        .finally(() => setFetching(false));
    }
  }, [user, loading, router]);

  if (loading || fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center font-bold text-slate-500 animate-pulse">
          در حال بارگذاری اطلاعات ادوکاد...
        </div>
      </div>
    );
  }

  if (!user) return null;

  const departmentBadge = {
    ENGINEERS: {
      name: 'مهندسی و توسعه',
      bg: 'bg-primary',
      border: 'border-primary',
      light: 'bg-bg-lavender',
      text: 'text-primary',
    },
    ARTISTS: {
      name: 'آرتیست‌ها و رسانه',
      bg: 'bg-accent',
      border: 'border-accent',
      light: 'bg-bg-blush',
      text: 'text-accent',
    },
    OPS: {
      name: 'آچارفرانسه و عملیات',
      bg: 'bg-tertiary',
      border: 'border-tertiary',
      light: 'bg-bg-neutral',
      text: 'text-tertiary',
    },
  };

  return (
    <div className="space-y-8 pb-12 text-right">
      {/* Hero Welcome Banner */}
      <div className="sticker-card pattern-cover p-6 sm:p-8 bg-gradient-to-l from-bg-mint to-white border-2 border-primary relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-secondary-dark text-xs font-black mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            باشگاه دانش‌آموزی محصول رکاد
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary leading-snug">
            سلام {user.fullName} عزیز، به درخت مهارت ادوکاد خوش اومدی! 🎯
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            در این پلتفرم هر گره یک مأموریت واقعی برای محصولات کافه و ایونت‌های رکاد است. با انجام مأموریت‌ها و تایید منتورها، سطوح جدید را باز کنید.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            {isMentor && (
              <Link
                href="/mentor"
                className="px-4 py-2 rounded-xl bg-secondary text-white font-bold text-xs shadow-[3px_4px_0_0_#21295a] hover:-translate-y-0.5 transition-transform flex items-center gap-1.5"
              >
                <CheckSquare className="w-4 h-4" />
                ورود به صف بازبینی منتور
              </Link>
            )}

            {isSuperAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl bg-accent text-white font-bold text-xs shadow-[3px_4px_0_0_#21295a] hover:-translate-y-0.5 transition-transform flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                پنل مدیریت و ثبت‌نام
              </Link>
            )}
          </div>
        </div>

        {/* Decorative corner element */}
        <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-secondary/10 border-4 border-dashed border-secondary/30 pointer-events-none" />
      </div>

      {/* SECTION 1: MY ENROLLED ROADMAPS */}
      {myEnrollments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-primary flex items-center gap-2">
              <Compass className="w-5 h-5 text-secondary" />
              مسیرهای مهارتی من
            </h2>
            <span className="text-xs font-bold text-slate-400">
              {myEnrollments.length} مسیر فعال
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myEnrollments.map((enr) => {
              const roadmap = enr.roadmap;
              const totalNodes = roadmap.nodes.length;
              const completedNodes = roadmap.nodes.filter(
                (n: any) => n.progresses?.[0]?.status === 'COMPLETED',
              ).length;
              const progressPercent =
                totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

              return (
                <div
                  key={enr.id}
                  className="sticker-card p-6 bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                        {departmentBadge[roadmap.department as keyof typeof departmentBadge]?.name}
                      </span>
                      {enr.mentor && (
                        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                          منتور: {enr.mentor.fullName}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-primary mb-1">
                      {roadmap.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {roadmap.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 mb-5">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>میزان تسلط و پیشرفت</span>
                        <span className="text-secondary-dark font-black">
                          {progressPercent}٪ ({completedNodes} از {totalNodes} گره)
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-secondary transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/roadmaps/${roadmap.slug}`}
                    className="w-full py-2.5 rounded-xl bg-primary text-white font-extrabold text-xs shadow-[3px_4px_0_0_#58bdaf] hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2"
                  >
                    مشاهده درخت مهارت تعاملی
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: ALL ROADMAPS CATALOG */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-primary flex items-center gap-2">
            <Layers className="w-5 h-5 text-accent" />
            کاتالوگ تمام مسیرهای یادگیری رکاد
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {roadmaps.map((rm) => {
            const isEnrolled = myEnrollments.some((e) => e.roadmapId === rm.id);
            const dept = departmentBadge[rm.department as keyof typeof departmentBadge];

            return (
              <div
                key={rm.id}
                className="sticker-card p-5 bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${dept?.light} ${dept?.text}`}
                    >
                      {dept?.name}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      نسخه {rm.version}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-primary mb-1.5">
                    {rm.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                    {rm.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    {rm._count?.nodes || 0} گره مهارتی
                  </span>

                  <Link
                    href={`/roadmaps/${rm.slug}`}
                    className="px-3 py-1.5 rounded-xl border-2 border-primary text-primary font-bold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1"
                  >
                    {isEnrolled ? 'ادامه مسیر ←' : 'مشاهده نقشه ←'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
