'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { ReviewModal } from '@/components/mentor/ReviewModal';
import { toPersianDigits } from '@/lib/utils';
import { RokadLoader } from '@/components/ui/Loading';
import {
  CheckSquare,
  Clock,
  ExternalLink,
  Users,
  AlertTriangle,
  Award,
  CheckCircle,
  RefreshCw,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function MentorPage() {
  const { user, isMentor, loading } = useAuth();
  const router = useRouter();

  const [queue, setQueue] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [fetching, setFetching] = useState(true);

  const loadData = async () => {
    setFetching(true);
    try {
      const [queueResult, dashResult] = await Promise.allSettled([
        api.submissions.getReviewQueue(),
        api.submissions.getMentorDashboard(),
      ]);

      if (queueResult.status === 'fulfilled' && Array.isArray(queueResult.value)) {
        setQueue(queueResult.value);
      } else if (queueResult.status === 'rejected') {
        console.error('Failed to load review queue:', queueResult.reason);
      }

      if (dashResult.status === 'fulfilled' && Array.isArray(dashResult.value)) {
        setDashboard(dashResult.value);
      } else if (dashResult.status === 'rejected') {
        console.error('Failed to load mentor dashboard:', dashResult.reason);
      }
    } catch (err) {
      console.error('Failed to load mentor data:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!loading && (!user || !isMentor)) {
      router.push('/');
      return;
    }
    if (user && isMentor) {
      loadData();
    }
  }, [user, isMentor, loading, router]);

  if (loading || fetching) {
    return (
      <RokadLoader
        title="در حال بارگذاری صف بازبینی و کارتابل منتوری..."
        subtitle="دریافت مأموریت‌های ارسالی دانش‌آموزان و سوابق پروژه‌ها"
        type="mentor"
      />
    );
  }


  return (
    <div className="space-y-8 pb-12 text-right">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-male-light dark:bg-male-darker/60 text-sec dark:text-male-light border border-sec/30 text-xs font-bold mb-2">
            <CheckSquare className="w-3.5 h-3.5 text-sec dark:text-male-light" />
            <span>پنل منتوری و ارزیابی همتا-به-همتا</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-sec dark:text-white">
            داشبورد و صف بازبینی منتور
          </h1>
          <p className="text-xs text-ink-normal/70 dark:text-gray-400 mt-1">
            بررسی تکالیف واقعی دانش‌آموزان و ارائه بازخورد سازنده برای باز شدن گره‌های بعدی
          </p>
        </div>

        <button
          onClick={loadData}
          className="rokad-btn-outline px-3.5 py-2 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>بروزرسانی صف</span>
        </button>
      </div>

      {/* SECTION 1: REVIEW QUEUE */}
      <div className="rokad-card p-6 bg-white dark:bg-[#151C28] border border-gray-200 dark:border-gray-800 shadow-male dark:shadow-ecosystem">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="font-black text-lg text-sec dark:text-white">
              صف کارهای در انتظار بررسی
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-female-normal text-white font-bold text-xs shadow-sm">
              {toPersianDigits(queue.length)} مورد
            </span>
          </div>
        </div>

        {queue.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-[#1C2536]">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-extrabold text-sec dark:text-white text-sm mb-1">
              صف بررسی خالی است!
            </h3>
            <p className="text-xs text-ink-normal/50 dark:text-gray-400">
              هیچ مأموریتی در حال حاضر در انتظار بازبینی شما نیست.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map((sub) => {
              const student = sub.nodeProgress?.user;
              const node = sub.nodeProgress?.node;

              return (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1C2536] hover:border-primary transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sec dark:text-white text-sm">
                        {student?.fullName || 'دانش‌آموز'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-[#151C28] text-ink-normal/70 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                        {node?.roadmap?.title || 'مسیر مهارتی'}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-primary flex items-center gap-1">
                      <span>مهارت: {node?.title || 'مأموریت'}</span>
                    </div>

                    {sub.submissionNote && (
                      <p className="text-xs text-ink-normal/80 dark:text-gray-300 line-clamp-1 bg-white dark:bg-[#151C28] p-2 rounded-lg border border-gray-200 dark:border-gray-700 mt-1 max-w-md">
                        «{sub.submissionNote}»
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={sub.submissionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rokad-btn-outline px-3 py-2 text-xs"
                    >
                      <span>خروجی</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => setSelectedSubmission(sub)}
                      className="rokad-btn-girl px-4 py-2 text-xs"
                    >
                      بررسی و ارزیابی مأموریت
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: MENTORED STUDENTS & BOTTLENECKS */}
      <div>
        <h2 className="font-black text-xl text-sec dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <span>دانش‌آموزان تحت نظر شما و تحلیل پیشرفت</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dashboard.map((card) => (
            <div
              key={card.enrollmentId}
              className="rokad-card p-5 bg-white dark:bg-[#151C28] border border-gray-200 dark:border-gray-800 shadow-male dark:shadow-ecosystem flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-black text-sm text-sec dark:text-white">
                    {card.student?.fullName || 'دانش‌آموز'}
                  </span>
                  <span className="text-[10px] font-bold text-ink-normal/60 dark:text-gray-400">
                    {toPersianDigits(card.student?.phone || '-')}
                  </span>
                </div>

                <div className="text-xs text-ink-normal/70 dark:text-gray-400 font-medium mb-4">
                  مسیر: {card.roadmap?.title || 'مسیر مهارتی'}
                </div>

                {/* Progress bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-ink-normal/60 dark:text-gray-400">پیشرفت کل</span>
                    <span className="text-primary font-black">
                      {toPersianDigits(card.progressPercent)}٪ ({toPersianDigits(card.completedCount)} از {toPersianDigits(card.totalNodes)})
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${card.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Bottleneck Indicator */}
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1C2536] border border-gray-200 dark:border-gray-700 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-sec dark:text-white mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-college-normal" />
                    <span>گره گلوگاه / وضعیت فعلی:</span>
                  </div>
                  <div className="font-black text-ink-normal dark:text-gray-200">
                    {card.bottleneckNode}
                  </div>
                  <div className="text-[10px] text-ink-normal/60 dark:text-gray-400 mt-1">
                    وضعیت: {card.bottleneckStatus}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                <Link
                  href={`/roadmaps/${card.roadmap.slug}`}
                  className="rokad-btn-outline w-full py-2 text-xs"
                >
                  <span>مشاهده درخت مهارت دانش‌آموز</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {selectedSubmission && (
        <ReviewModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onReviewed={loadData}
        />
      )}
    </div>
  );
}
