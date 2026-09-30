'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { toPersianDigits } from '@/lib/utils';
import { RokadLoader } from '@/components/ui/Loading';
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
  Target,
  Flame,
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
      badge: 'bg-ecosystem-light dark:bg-ecosystem-darker/50 text-ecosystem-darker dark:text-ecosystem-light border-primary/40',
      tagColor: 'text-primary',
    },
    ARTISTS: {
      name: 'آرتیست‌ها و رسانه',
      icon: Palette,
      badge: 'bg-female-light dark:bg-female-darker/50 text-female-darker dark:text-female-light border-female-normal/40',
      tagColor: 'text-female-normal',
    },
    OPS: {
      name: 'آچارفرانسه و عملیات',
      icon: Briefcase,
      badge: 'bg-college-light dark:bg-college-darker/50 text-college-darker dark:text-college-light border-college-normal/40',
      tagColor: 'text-college-normal',
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
      <RokadLoader
        title="در حال بارگذاری مسیرهای یادگیری اجوکاد..."
        subtitle="شتاب‌دهی استعداد، مأموریت‌های واقعی و پروژه‌های باشگاه رکاد"
        type="roadmap"
      />
    );
  }


  if (!user) return null;

  return (
    <div className="space-y-8 pb-16 text-right">
      {/* Hero Welcome Banner */}
      <div className="rokad-card p-6 sm:p-8 bg-gradient-to-l from-ecosystem-light via-white to-gray-50 dark:from-[#151C28] dark:via-[#121824] dark:to-[#0B0F17] border border-[#EAEAEA] dark:border-gray-800 shadow-male dark:shadow-ecosystem relative overflow-hidden rounded-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ecosystem-light dark:bg-ecosystem-darker/60 text-ecosystem-darker dark:text-ecosystem-light text-xs font-bold mb-3 border border-primary/40 shadow-ecosystem">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>باشگاه دانش‌آموزی و شتاب‌دهی استعداد رکاد</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-sec dark:text-white leading-tight">
            سلام {user.fullName} عزیز؛ به سامانه اجوکاد خوش اومدی!
          </h1>

          <p className="text-xs sm:text-sm text-ink-normal/80 dark:text-gray-300 mt-2.5 leading-relaxed font-medium">
            در Edukad هر گره مهارتی، یک مأموریت واقعی برای محصولات کافه و رویدادهای زنده رکاد است. با یادگیری مهارت‌ها، ارسال تحویل‌دادنی‌ها و دریافت تاییدیه منتورها، سطوح جدید را باز کنید و وارد پروژه‌های تجاری شوید.
          </p>

          {/* Quick Actions for Mentors / Admins */}
          <div className="flex flex-wrap items-center gap-3 mt-5">
            {isMentor && (
              <Link
                href="/mentor"
                className="rokad-btn-primary px-4 py-2 text-xs"
              >
                <CheckSquare className="w-4 h-4" />
                <span>ورود به صف بازبینی منتوری</span>
              </Link>
            )}

            {isSuperAdmin && (
              <Link
                href="/admin"
                className="rokad-btn-girl px-4 py-2 text-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>پنل مدیریت و پایش کل</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 1: MY ENROLLED ROADMAPS */}
      {myEnrollments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-sec dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              <span>مسیرهای مهارتی من (در حال پیشرفت)</span>
            </h2>
            <span className="text-xs font-bold text-ink-normal/70 dark:text-gray-400 bg-white dark:bg-[#151C28] px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
              {toPersianDigits(myEnrollments.length)} مسیر فعال
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
                  className="rokad-card p-5 sm:p-6 bg-white dark:bg-[#151C28] border border-[#EAEAEA] dark:border-gray-800 shadow-male dark:shadow-ecosystem flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${dept?.badge}`}
                      >
                        {dept?.name}
                      </span>
                      {enr.mentor && (
                        <span className="text-[11px] font-bold text-ink-normal/70 dark:text-gray-300 bg-gray-50 dark:bg-[#1C2536] px-2.5 py-0.5 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-1">
                          منتور: {enr.mentor.fullName}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-sec dark:text-white mb-1.5 text-right bidi-text" dir="rtl">
                      <bdi>{roadmap.title}</bdi>
                    </h3>
                    <p className="text-xs text-ink-normal/70 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4 text-right bidi-text" dir="rtl">
                      <bdi>{roadmap.description}</bdi>
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 mb-5 bg-gray-50 dark:bg-[#1C2536] p-3.5 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center text-xs font-bold text-ink-normal/80 dark:text-gray-300">
                        <span>میزان پیشرفت در نقشه</span>
                        <span className="text-primary font-black">
                          {toPersianDigits(progressPercent)}٪ ({toPersianDigits(completedNodes)} از {toPersianDigits(totalNodes)} گره)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      {inProgressNodes > 0 && (
                        <span className="text-[11px] text-primary font-bold block pt-1">
                          {toPersianDigits(inProgressNodes)} مأموریت در حال انجام داری!
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/roadmaps/${roadmap.slug}`}
                    className="rokad-btn-primary w-full py-2.5 text-xs"
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
            <h2 className="text-lg sm:text-xl font-black text-sec dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-female-normal" />
              <span>کاتالوگ تمام مسیرهای یادگیری اجوکاد</span>
            </h2>
            <p className="text-xs text-ink-normal/70 dark:text-gray-400 mt-0.5">
              مسیر دلخواهت رو انتخاب کن و همین الان شروع به انجام مأموریت‌های واقعی کن.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی مسیر یا مهارت..."
              className="w-full pl-8 pr-9 py-2 rounded-xl bg-white dark:bg-[#1C2536] border border-gray-200 dark:border-gray-700 text-xs font-bold text-sec dark:text-white placeholder:text-gray-400 focus:border-primary focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-sec dark:hover:text-white"
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
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all shrink-0 border ${
              activeTab === 'ALL'
                ? 'bg-sec text-white border-sec shadow-male dark:bg-primary dark:border-primary dark:shadow-ecosystem'
                : 'bg-white dark:bg-[#151C28] text-ink-normal dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}
          >
            همه مسیرها ({toPersianDigits(tabCounts.ALL)})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ENGINEERS')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all shrink-0 border flex items-center gap-1.5 ${
              activeTab === 'ENGINEERS'
                ? 'bg-primary text-white border-primary shadow-ecosystem'
                : 'bg-white dark:bg-[#151C28] text-ink-normal dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>مهندسی و توسعه ({toPersianDigits(tabCounts.ENGINEERS)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ARTISTS')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all shrink-0 border flex items-center gap-1.5 ${
              activeTab === 'ARTISTS'
                ? 'bg-female-normal text-white border-female-normal shadow-female'
                : 'bg-white dark:bg-[#151C28] text-ink-normal dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>آرتیست‌ها و رسانه ({toPersianDigits(tabCounts.ARTISTS)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('OPS')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all shrink-0 border flex items-center gap-1.5 ${
              activeTab === 'OPS'
                ? 'bg-college-normal text-white border-college-normal shadow-college'
                : 'bg-white dark:bg-[#151C28] text-ink-normal dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>آچارفرانسه و عملیات ({toPersianDigits(tabCounts.OPS)})</span>
          </button>
        </div>

        {/* Roadmaps Grid */}
        {filteredRoadmaps.length === 0 ? (
          <div className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center shadow-sm space-y-3">
            <p className="text-sm font-bold text-ink-normal/60 dark:text-gray-400">
              هیچ مسیری مطابق جستجوی شما یافت نشد.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveTab('ALL');
              }}
              className="rokad-btn-primary px-4 py-1.5 text-xs"
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
                  className="rokad-card p-5 bg-white dark:bg-[#151C28] border border-[#EAEAEA] dark:border-gray-800 shadow-male dark:shadow-ecosystem flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${dept?.badge}`}
                      >
                        {dept?.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#1C2536] text-ink-normal/70 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                          {toPersianDigits(rm._count?.nodes || 0)} گره مهارتی
                        </span>
                        {isEnrolled && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                            عضو هستید
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-black text-base text-sec dark:text-white mb-1.5 text-right bidi-text" dir="rtl">
                      <bdi>{rm.title}</bdi>
                    </h3>
                    <p className="text-xs text-ink-normal/70 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4 text-right bidi-text" dir="rtl">
                      <bdi>{rm.description}</bdi>
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                    <Link
                      href={`/roadmaps/${rm.slug}`}
                      className="text-xs font-bold text-ink-normal/60 dark:text-gray-400 hover:text-sec dark:hover:text-white transition-colors"
                    >
                      پیش‌نمایش مسیر
                    </Link>

                    {isEnrolled ? (
                      <Link
                        href={`/roadmaps/${rm.slug}`}
                        className="rokad-btn-sec px-3.5 py-1.5 text-xs"
                      >
                        <span>ادامه یادگیری</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={isEnrolling}
                        onClick={() => handleSelfEnroll(rm.id, rm.slug)}
                        className="rokad-btn-primary px-3.5 py-1.5 text-xs"
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
