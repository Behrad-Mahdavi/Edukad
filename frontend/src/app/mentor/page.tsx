'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { ReviewModal } from '@/components/mentor/ReviewModal';
import {
  CheckSquare,
  Clock,
  ExternalLink,
  Users,
  AlertTriangle,
  Award,
  CheckCircle,
  RefreshCw,
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
      const [queueData, dashData] = await Promise.all([
        api.submissions.getReviewQueue(),
        api.submissions.getMentorDashboard(),
      ]);
      setQueue(queueData);
      setDashboard(dashData);
    } catch (err) {
      console.error(err);
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center font-bold text-slate-500 animate-pulse">
          در حال بارگذاری اطلاعات صف بازبینی منتور...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 text-right">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-secondary-dark text-xs font-black mb-2">
            <CheckSquare className="w-3.5 h-3.5" />
            پنل منتوری و یادگیری همتا-به-همتا
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary">
            داشبورد و صف بازبینی منتور
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            بررسی تکالیف واقعی دانش‌آموزان و ارائه بازخورد سازنده برای باز شدن گره‌های بعدی
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-3.5 py-2 rounded-xl border-2 border-primary bg-white text-primary text-xs font-bold shadow-[2px_3px_0_0_#21295a] hover:bg-slate-50 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          بروزرسانی لیست
        </button>
      </div>

      {/* SECTION 1: REVIEW QUEUE */}
      <div className="sticker-card p-6 bg-white">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="font-black text-lg text-primary">
              صف کارهای در انتظار بررسی
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-accent text-white font-black text-xs">
              {queue.length} مورد
            </span>
          </div>
        </div>

        {queue.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-extrabold text-primary text-sm mb-1">
              صف بررسی خالی است!
            </h3>
            <p className="text-xs text-slate-400">
              هیچ مأموریتی در حال حاضر در انتظار بازبینی شما نیست.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map((sub) => {
              const student = sub.nodeProgress.user;
              const node = sub.nodeProgress.node;

              return (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl border-2 border-primary/20 bg-bg-mint/40 hover:border-secondary transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[3px_4px_0_0_#58bdaf]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-primary text-sm">
                        {student.fullName}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-500 border border-slate-200">
                        {node.roadmap.title}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-secondary-dark flex items-center gap-1">
                      <span>مهارت: {node.title}</span>
                    </div>

                    {sub.submissionNote && (
                      <p className="text-xs text-slate-600 line-clamp-1 bg-white/80 p-1.5 rounded border border-slate-200 mt-1 max-w-md">
                        «{sub.submissionNote}»
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={sub.submissionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl border-2 border-secondary bg-white text-secondary-dark font-bold text-xs hover:bg-secondary/10 transition-colors flex items-center gap-1 ltr"
                    >
                      خروجی
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>

                    <button
                      onClick={() => setSelectedSubmission(sub)}
                      className="px-4 py-2 rounded-xl bg-accent text-white font-black text-xs shadow-[2px_3px_0_0_#21295a] hover:-translate-y-0.5 transition-transform"
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
        <h2 className="font-black text-xl text-primary mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-secondary" />
          دانش‌آموزان تحت نظر شما و تحلیل پیشرفت
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dashboard.map((card) => (
            <div
              key={card.enrollmentId}
              className="sticker-card p-5 bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-extrabold text-sm text-primary">
                    {card.student.fullName}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {card.student.phone}
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-semibold mb-4">
                  مسیر: {card.roadmap.title}
                </div>

                {/* Progress bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">پیشرفت کل</span>
                    <span className="text-secondary-dark font-black">
                      {card.progressPercent}٪ ({card.completedCount} از {card.totalNodes})
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-secondary transition-all"
                      style={{ width: `${card.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Bottleneck Indicator */}
                <div className="p-3 rounded-xl bg-bg-lavender border border-primary/20 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-primary mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    گره گلوگاه / وضعیت فعلی:
                  </div>
                  <div className="font-black text-slate-700">
                    {card.bottleneckNode}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    وضعیت: {card.bottleneckStatus}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  href={`/roadmaps/${card.roadmap.slug}`}
                  className="w-full py-2 rounded-xl border-2 border-primary text-primary font-bold text-xs hover:bg-slate-50 flex items-center justify-center gap-1"
                >
                  مشاهده گراف پیشرفت دانش‌آموز ←
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
