'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
  Search,
  X,
  Code2,
  Palette,
  Briefcase,
  Zap,
  TrendingUp,
} from 'lucide-react';

export default function HomePage() {
  const { user, loading, isMentor, isSuperAdmin } = useAuth();
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  // Search & Filter State
  const [activeTab, setActiveTab] = useState<'ALL' | 'ENGINEERS' | 'ARTISTS' | 'OPS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [allRoadmaps, enrollments] = await Promise.all([
        api.roadmaps.getAll(),
        api.enrollments.getMyEnrollments(),
      ]);
      setRoadmaps(allRoadmaps);
      setMyEnrollments(enrollments);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadData();
    }
  }, [user, loading, router]);

  const handleSelfEnroll = async (roadmapId: string, slug: string) => {
    try {
      setEnrollingId(roadmapId);
      await api.enrollments.selfEnroll(roadmapId);
      await loadData();
      router.push(`/roadmaps/${slug}`);
    } catch (err: any) {
      alert(err.message || 'خطا در ثبت‌نام مسیر');
    } finally {
      setEnrollingId(null);
    }
  };

  const departmentMeta = {
    ENGINEERS: {
      name: 'مهندسی و توسعه',
      icon: Code2,
      bg: 'bg-primary',
      light: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary',
    },
    ARTISTS: {
      name: 'آرتیست‌ها و رسانه',
      icon: Palette,
      bg: 'bg-accent',
      light: 'bg-accent/10',
      text: 'text-accent',
      border: 'border-accent',
    },
    OPS: {
      name: 'آچارفرانسه و عملیات',
      icon: Briefcase,
      bg: 'bg-tertiary',
      light: 'bg-tertiary/10',
      text: 'text-tertiary',
      border: 'border-tertiary',
    },
  };

  // Filtered roadmaps based on department tab and search query
  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter((rm) => {
      const matchesTab = activeTab === 'ALL' || rm.department === activeTab;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        rm.title.toLowerCase().includes(q) ||
        (rm.description && rm.description.toLowerCase().includes(q));
      return matchesTab && matchesSearch;
    });
  }, [roadmaps, activeTab, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      ALL: roadmaps.length,
      ENGINEERS: roadmaps.filter((r) => r.department === 'ENGINEERS').length,
      ARTISTS: roadmaps.filter((r) => r.department === 'ARTISTS').length,
      OPS: roadmaps.filter((r) => r.department === 'OPS').length,
    };
  }, [roadmaps]);

  if (loading || fetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-secondary/20 border-2 border-primary animate-spin flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div className="text-sm font-extrabold text-primary animate-pulse">
          در حال بارگذاری محیط اجوکاد...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-8 pb-16 text-right">
      {/* Hero Welcome Banner with Neo-Brutalist Sticker Style */}
      <div className="sticker-card pattern-cover p-6 sm:p-8 bg-gradient-to-l from-bg-mint via-white to-bg-lavender border-2 border-primary relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-primary text-xs font-black mb-3 shadow-[2px_2px_0_0_#21295a] border border-primary">
            <Sparkles className="w-3.5 h-3.5" />
            باشگاه دانش‌آموزی و شتاب‌دهی استعداد رکاد
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-primary leading-tight">
            سلام {user.fullName} عزیز؛ به سامانه اجوکاد خوش اومدی!
          </h1>

          <p className="text-xs sm:text-sm text-slate-700 mt-2.5 leading-relaxed font-medium">
            در اجوکاد هر گره مهارتی، یک مأموریت واقعی برای محصولات کافه و رویدادهای زنده رکاد است. با یادگیری مهارت‌ها، ارسال تحویل‌دادنی‌ها و دریافت تاییدیه منتورها، سطوح جدید را باز کنید و وارد پروژه‌های تجاری شوید.
          </p>

          {/* Quick Actions for Mentors / Admins */}
          <div className="flex flex-wrap items-center gap-3 mt-5">
            {isMentor && (
              <Link
                href="/mentor"
                className="px-4 py-2 rounded-xl bg-secondary text-white font-black text-xs shadow-[3px_4px_0_0_#21295a] hover:-translate-y-0.5 transition-transform flex items-center gap-1.5 border border-primary"
              >
                <CheckSquare className="w-4 h-4" />
                ورود به صف بازبینی منتوری
              </Link>
            )}

            {isSuperAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl bg-accent text-white font-black text-xs shadow-[3px_4px_0_0_#21295a] hover:-translate-y-0.5 transition-transform flex items-center gap-1.5 border border-primary"
              >
                <ShieldCheck className="w-4 h-4" />
                پنل مدیریت و پایش کل
              </Link>
            )}
          </div>
        </div>

        {/* Decorative corner element */}
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-secondary/15 border-4 border-dashed border-secondary/40 pointer-events-none" />
      </div>

      {/* SECTION 1: MY ENROLLED ROADMAPS */}
      {myEnrollments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-primary flex items-center gap-2">
              <Compass className="w-5 h-5 text-secondary" />
              مسیرهای مهارتی من (در حال پیشرفت)
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
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
              const inProgressNodes = roadmap.nodes.filter(
                (n: any) =>
                  n.progresses?.[0]?.status === 'IN_PROGRESS' ||
                  n.progresses?.[0]?.status === 'SUBMITTED',
              ).length;
              const progressPercent =
                totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;
              const dept = departmentMeta[roadmap.department as keyof typeof departmentMeta];

              return (
                <div
                  key={enr.id}
                  className="sticker-card p-5 sm:p-6 bg-white flex flex-col justify-between hover:-translate-y-1 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${dept?.border} ${dept?.light} ${dept?.text}`}
                      >
                        {dept?.name}
                      </span>
                      {enr.mentor && (
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 flex items-center gap-1">
                          منتور ناظر: {enr.mentor.fullName}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-primary mb-1.5 text-right bidi-text" dir="rtl">
                      <bdi>{roadmap.title}</bdi>
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 text-right bidi-text" dir="rtl">
                      <bdi>{roadmap.description}</bdi>
                    </p>

                    {/* Progress Bar & Badges */}
                    <div className="space-y-1.5 mb-5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>میزان تسلط بر نقشه</span>
                        <span className="text-secondary-dark font-black">
                          {progressPercent}٪ ({completedNodes} از {totalNodes} گره)
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-secondary transition-all duration-500 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      {inProgressNodes > 0 && (
                        <span className="text-[10px] text-teal-700 font-bold block pt-1">
                          {inProgressNodes} مأموریت در حال انجام داری!
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/roadmaps/${roadmap.slug}`}
                    className="w-full py-2.5 rounded-xl bg-primary text-white font-black text-xs shadow-[3px_4px_0_0_#58bdaf] hover:-translate-y-0.5 active:translate-y-0 transition-transform flex items-center justify-center gap-2 border border-primary"
                  >
                    <span>ورود به درخت مهارت تعاملی</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: ALL ROADMAPS CATALOG WITH SEARCH & TABS */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-primary flex items-center gap-2">
              <Layers className="w-5 h-5 text-accent" />
              کاتالوگ تمام مسیرهای یادگیری اجوکاد
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              مسیر دلخواهت رو انتخاب کن و همین الان شروع به انجام مأموریت‌های واقعی کن.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی مسیر یا مهارت..."
              className="w-full pl-8 pr-9 py-2 rounded-xl bg-white border-2 border-primary text-xs font-bold text-primary placeholder:text-slate-400 shadow-[2px_3px_0_0_#21295a] focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-primary"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Department Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all shrink-0 border-2 border-primary ${
              activeTab === 'ALL'
                ? 'bg-primary text-white shadow-[2px_3px_0_0_#58bdaf]'
                : 'bg-white text-primary hover:bg-slate-50 shadow-[2px_2px_0_0_#21295a]'
            }`}
          >
            همه مسیرها ({tabCounts.ALL})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ENGINEERS')}
            className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all shrink-0 border-2 border-primary flex items-center gap-1.5 ${
              activeTab === 'ENGINEERS'
                ? 'bg-primary text-white shadow-[2px_3px_0_0_#58bdaf]'
                : 'bg-white text-primary hover:bg-slate-50 shadow-[2px_2px_0_0_#21295a]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            مهندسی و توسعه ({tabCounts.ENGINEERS})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ARTISTS')}
            className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all shrink-0 border-2 border-primary flex items-center gap-1.5 ${
              activeTab === 'ARTISTS'
                ? 'bg-accent text-white shadow-[2px_3px_0_0_#21295a]'
                : 'bg-white text-primary hover:bg-slate-50 shadow-[2px_2px_0_0_#21295a]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            آرتیست‌ها و رسانه ({tabCounts.ARTISTS})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('OPS')}
            className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all shrink-0 border-2 border-primary flex items-center gap-1.5 ${
              activeTab === 'OPS'
                ? 'bg-tertiary text-white shadow-[2px_3px_0_0_#21295a]'
                : 'bg-white text-primary hover:bg-slate-50 shadow-[2px_2px_0_0_#21295a]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            آچارفرانسه و عملیات ({tabCounts.OPS})
          </button>
        </div>

        {/* Roadmaps Grid */}
        {filteredRoadmaps.length === 0 ? (
          <div className="bg-white border-2 border-primary rounded-2xl p-8 text-center shadow-[3px_4px_0_0_#21295a] space-y-3">
            <p className="text-sm font-bold text-slate-500">
              هیچ مسیری مطابق جستجوی شما یافت نشد.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveTab('ALL');
              }}
              className="px-4 py-1.5 rounded-xl bg-secondary text-white font-black text-xs border border-primary"
            >
              نمایش همه مسیرها
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRoadmaps.map((rm) => {
              const isEnrolled = myEnrollments.some((e) => e.roadmapId === rm.id);
              const dept = departmentMeta[rm.department as keyof typeof departmentMeta];
              const isEnrolling = enrollingId === rm.id;

              return (
                <div
                  key={rm.id}
                  className="sticker-card p-5 bg-white flex flex-col justify-between hover:-translate-y-1 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${dept?.border} ${dept?.light} ${dept?.text}`}
                      >
                        {dept?.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {rm._count?.nodes || 0} گره مهارتی
                        </span>
                        {isEnrolled && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
                            عضو هستید
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-extrabold text-base text-primary mb-1.5 text-right bidi-text" dir="rtl">
                      <bdi>{rm.title}</bdi>
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4 text-right bidi-text" dir="rtl">
                      <bdi>{rm.description}</bdi>
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/roadmaps/${rm.slug}`}
                      className="text-xs font-bold text-slate-500 hover:text-primary transition-colors"
                    >
                      مشاهده پیش‌نمایش
                    </Link>

                    {isEnrolled ? (
                      <Link
                        href={`/roadmaps/${rm.slug}`}
                        className="px-3.5 py-1.5 rounded-xl bg-primary text-white font-black text-xs shadow-[2px_3px_0_0_#58bdaf] hover:-translate-y-0.5 transition-transform flex items-center gap-1"
                      >
                        ادامه مسیر ←
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={isEnrolling}
                        onClick={() => handleSelfEnroll(rm.id, rm.slug)}
                        className="px-3.5 py-1.5 rounded-xl bg-secondary text-white font-black text-xs shadow-[2px_3px_0_0_#21295a] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-1 border border-primary disabled:opacity-50"
                      >
                        {isEnrolling ? 'در حال فعال‌سازی...' : 'شروع مسیر'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

