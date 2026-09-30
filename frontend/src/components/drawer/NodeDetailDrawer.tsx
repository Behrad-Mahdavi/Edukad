'use client';

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Clock,
  Video,
  FileText,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toPersianDigits } from '@/lib/utils';

interface Resource {
  id: string;
  title: string;
  type: 'LINK' | 'VIDEO_URL' | 'MARKDOWN_TEXT' | 'FILE';
  content: string;
}

interface Submission {
  id: string;
  submissionUrl: string;
  submissionNote?: string;
  mentorFeedback?: string;
  outcome: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface NodeDetailProps {
  node: {
    id: string;
    title: string;
    description: string;
    hasDeliverable: boolean;
    resources: Resource[];
  };
  progress?: {
    id: string;
    status: 'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS' | 'SUBMITTED' | 'NEEDS_REVISION' | 'COMPLETED';
    submissions?: Submission[];
  };
  onClose: () => void;
  onRefresh: () => void;
}

export function NodeDetailDrawer({
  node,
  progress,
  onClose,
  onRefresh,
}: NodeDetailProps) {
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'resources' | 'submit' | 'history'>('resources');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const status = progress?.status || 'LOCKED';

  const handleStartNode = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.progress.startNode(node.id);
      setSuccessMsg('مطالعه این گره آغاز شد!');
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDirect = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.progress.completeDirect(node.id);
      setSuccessMsg('این گره با موفقیت تکمیل شد و گره‌های بعدی باز شدند!');
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl) {
      setError('لطفاً لینک خروجی کار را وارد کنید.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.submissions.submitDeliverable({
        nodeId: node.id,
        submissionUrl,
        submissionNote,
      });
      setSuccessMsg('مأموریت با موفقیت ارسال شد و در صف بازبینی منتور قرار گرفت.');
      setSubmissionUrl('');
      setSubmissionNote('');
      onRefresh();
      setActiveTab('history');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Drawer positioned on the right */}
      <div
        className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white dark:bg-[#151C28] border-l border-gray-200 dark:border-gray-800 shadow-2xl z-50 flex flex-col overflow-hidden text-right animate-in slide-in-from-right duration-200"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gray-50 dark:bg-[#1C2536] border-b border-gray-200 dark:border-gray-800 flex items-start justify-between gap-3" dir="rtl">
          <div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-ecosystem-light dark:bg-ecosystem-darker/60 text-ecosystem-darker dark:text-ecosystem-light border border-primary/30 mb-2 inline-block">
              جزئیات مهارت
            </span>
            <h2 className="font-black text-xl text-sec dark:text-white leading-snug text-right bidi-text" dir="rtl">
              <bdi>{node.title}</bdi>
            </h2>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#151C28] hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-female-normal transition-colors active:scale-95 shrink-0"
            title="بستن پنجره"
            aria-label="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#151C28]" dir="rtl">
          {(() => {
            const descText = node.description || '';
            const tierMatch = descText.match(/\*\*سطح:\*\*\s*([^\|\n]+)/);
            const tierBadge = tierMatch ? tierMatch[1].trim() : '';

            const levelMatch = descText.match(/\*\*اهمیت:\*\*\s*([^\|\n]+)/);
            const levelBadge = levelMatch ? levelMatch[1].trim() : '';

            const cleanBody = descText.replace(/^\*\*سطح:\*\*.*?\n+/i, '').trim();

            return (
              <div className="space-y-3 text-right" dir="rtl">
                {(tierBadge || levelBadge) && (
                  <div className="flex items-center gap-2 flex-wrap mb-2" dir="rtl">
                    {tierBadge && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-ecosystem-light dark:bg-ecosystem-darker text-ecosystem-darker dark:text-ecosystem-light border border-primary/30">
                        سطح: {tierBadge}
                      </span>
                    )}
                    {levelBadge && (
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
                          levelBadge.includes('ضروری')
                            ? 'bg-female-light dark:bg-female-darker text-female-darker dark:text-female-light border-female-normal/30'
                            : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                        }`}
                      >
                        اهمیت: {levelBadge}
                      </span>
                    )}
                  </div>
                )}
                <p className="text-xs sm:text-sm text-ink-normal/80 dark:text-gray-300 leading-relaxed whitespace-pre-line text-right bidi-text" dir="rtl">
                  <bdi>{cleanBody || descText}</bdi>
                </p>
              </div>
            );
          })()}

          {/* Status indicator action bar */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between" dir="rtl">
            <div className="text-xs font-bold text-ink-normal/60 dark:text-gray-400">
              وضعیت شما:{' '}
              <span
                className={`font-black ${status === 'COMPLETED'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : status === 'SUBMITTED'
                    ? 'text-college-normal'
                    : status === 'NEEDS_REVISION'
                      ? 'text-female-normal'
                      : status === 'IN_PROGRESS'
                        ? 'text-primary'
                        : status === 'UNLOCKED'
                          ? 'text-sky-600'
                          : 'text-gray-400'
                  }`}
              >
                {status === 'COMPLETED' && 'تکمیل شده'}
                {status === 'SUBMITTED' && 'در انتظار بازبینی منتور'}
                {status === 'NEEDS_REVISION' && 'نیاز به اصلاح'}
                {status === 'IN_PROGRESS' && 'در حال مطالعه و انجام'}
                {status === 'UNLOCKED' && 'باز شده (شروع نشده)'}
                {status === 'LOCKED' && 'قفل شده (پیش‌نیازها مانده)'}
              </span>
            </div>

            {status === 'UNLOCKED' && (
              <button
                onClick={handleStartNode}
                disabled={loading}
                className="rokad-btn-primary px-3 py-1.5 text-xs"
              >
                شروع مطالعه
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1C2536] font-bold text-xs">
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex-1 py-3 border-b-2 transition-all flex items-center justify-center gap-1.5 ${activeTab === 'resources'
              ? 'border-primary text-primary bg-white dark:bg-[#151C28]'
              : 'border-transparent text-ink-normal/60 dark:text-gray-400 hover:text-sec dark:hover:text-white'
              }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>منابع یادگیری ({toPersianDigits(node.resources.length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-3 border-b-2 transition-all flex items-center justify-center gap-1.5 ${activeTab === 'submit'
              ? 'border-primary text-primary bg-white dark:bg-[#151C28]'
              : 'border-transparent text-ink-normal/60 dark:text-gray-400 hover:text-sec dark:hover:text-white'
              }`}
          >
            <Send className="w-4 h-4" />
            <span>تحویل مأموریت</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 border-b-2 transition-all flex items-center justify-center gap-1.5 ${activeTab === 'history'
              ? 'border-primary text-primary bg-white dark:bg-[#151C28]'
              : 'border-transparent text-ink-normal/60 dark:text-gray-400 hover:text-sec dark:hover:text-white'
              }`}
          >
            <Clock className="w-4 h-4" />
            <span>تاریخچه ({toPersianDigits(progress?.submissions?.length || 0)})</span>
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="m-4 p-3 rounded-xl bg-female-light dark:bg-female-darker/40 border border-female-normal/40 text-female-darker dark:text-female-light text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="m-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: RESOURCES */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              {node.resources.length === 0 ? (
                <div className="text-center py-8 text-ink-normal/50 dark:text-gray-500 text-xs">
                  منبعی برای این گره ثبت نشده است.
                </div>
              ) : (
                node.resources.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1C2536] shadow-sm hover:border-primary transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2 font-bold text-xs text-sec dark:text-white text-right" dir="rtl">
                      {res.type === 'LINK' && <LinkIcon className="w-4 h-4 text-primary shrink-0" />}
                      {res.type === 'VIDEO_URL' && <Video className="w-4 h-4 text-female-normal shrink-0" />}
                      {res.type === 'MARKDOWN_TEXT' && <FileText className="w-4 h-4 text-college-normal shrink-0" />}
                      <span className="bidi-text text-right" dir="rtl"><bdi>{res.title}</bdi></span>
                    </div>

                    {res.type === 'MARKDOWN_TEXT' ? (
                      <div className="text-xs text-ink-normal/80 dark:text-gray-300 whitespace-pre-line leading-relaxed bg-white dark:bg-[#151C28] p-3.5 rounded-lg border border-gray-200 dark:border-gray-700 text-right bidi-text" dir="rtl">
                        <bdi>{res.content}</bdi>
                      </div>
                    ) : (
                      <a
                        href={res.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline break-all"
                        dir="ltr"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span>باز کردن لینک منبع</span>
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SUBMIT DELIVERABLE */}
          {activeTab === 'submit' && (
            <div>
              {!node.hasDeliverable ? (
                <div className="p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-[#1C2536]">
                  <Sparkles className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-extrabold text-sec dark:text-white text-sm mb-1">
                    گره بدون نیاز به تحویل مأموریت
                  </h3>
                  <p className="text-xs text-ink-normal/70 dark:text-gray-400 mb-5 leading-relaxed">
                    این گره دانشی/مقدماتی است و تحویل خروجی ندارد. بعد از مطالعه منابع بالا، می‌توانید مستقیماً گره را به اتمام برسانید.
                  </p>

                  {status === 'COMPLETED' ? (
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-4 py-2 rounded-xl">
                      <CheckCircle2 className="w-4 h-4" />
                      این مهارت تکمیل شده است
                    </div>
                  ) : (
                    <button
                      onClick={handleCompleteDirect}
                      disabled={loading || status === 'LOCKED'}
                      className="rokad-btn-primary w-full py-3 text-xs"
                    >
                      {loading ? 'در حال ثبت...' : 'تکمیل گره و باز شدن مراحل بعدی'}
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  {status === 'COMPLETED' && (
                    <div className="mb-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      مأموریت این گره تایید شده و با موفقیت تکمیل گردید!
                    </div>
                  )}

                  {status === 'SUBMITTED' && (
                    <div className="mb-4 p-4 rounded-xl bg-college-light dark:bg-college-darker/40 border border-college-normal/30 text-college-darker dark:text-college-light text-xs font-bold flex items-center gap-2">
                      <Clock className="w-5 h-5 shrink-0" />
                      کار شما در صف بازبینی منتور قرار دارد. منتظر بررسی بمانید.
                    </div>
                  )}

                  {status === 'NEEDS_REVISION' && (
                    <div className="mb-4 p-4 rounded-xl bg-female-light dark:bg-female-darker/40 border border-female-normal/30 text-female-darker dark:text-female-light text-xs leading-relaxed">
                      <div className="font-bold flex items-center gap-1.5 mb-1 text-female-normal">
                        <AlertCircle className="w-4 h-4" />
                        منتور نیاز به بازبینی و اصلاح اعلام کرده است:
                      </div>
                      {progress?.submissions?.[0]?.mentorFeedback && (
                        <p className="p-2.5 rounded-lg bg-white dark:bg-[#151C28] border border-female-normal/30 text-xs mt-1 text-ink-normal dark:text-white">
                          {progress.submissions[0].mentorFeedback}
                        </p>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleSubmitDeliverable} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block font-bold text-xs text-ink-normal/90 dark:text-gray-300">
                        لینک خروجی مأموریت *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="لینک گوگل‌درایو، گیت‌هاب، فیگما یا..."
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-[#1C2536] text-xs font-medium focus:border-primary focus:outline-none transition-all ltr"
                      />
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        دسترسی مشاهده لینک باید عمومی یا برای ایمیل منتور باز باشد.
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold text-xs text-ink-normal/90 dark:text-gray-300">
                        توضیحات یا یادداشت برای منتور
                      </label>
                      <textarea
                        rows={3}
                        placeholder="توضیحاتی در مورد نحوه انجام مأموریت، چالش‌ها و..."
                        value={submissionNote}
                        onChange={(e) => setSubmissionNote(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-[#1C2536] text-xs font-medium focus:border-primary focus:outline-none transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || status === 'LOCKED' || status === 'COMPLETED'}
                      className="rokad-btn-sec w-full py-3 text-xs"
                    >
                      {loading ? 'در حال ارسال...' : 'ارسال مأموریت به منتور'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SUBMISSION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {!progress?.submissions || progress.submissions.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  هنوز هیچ ارسالی برای این گره ثبت نشده است.
                </div>
              ) : (
                progress.submissions.map((sub, idx) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1C2536] text-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-ink-normal/60 dark:text-gray-400">
                        ارسال #{toPersianDigits(progress.submissions!.length - idx)}
                      </span>
                      <span
                        className={`font-black px-2 py-0.5 rounded-full text-[10px] ${sub.outcome === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : sub.outcome === 'REJECTED'
                            ? 'bg-female-light text-female-darker dark:bg-female-darker/60 dark:text-female-light'
                            : 'bg-college-light text-college-darker dark:bg-college-darker/60 dark:text-college-light'
                          }`}
                      >
                        {sub.outcome === 'APPROVED' && 'تایید شده'}
                        {sub.outcome === 'REJECTED' && 'نیازمند اصلاح'}
                        {sub.outcome === 'PENDING' && 'در انتظار بررسی'}
                      </span>
                    </div>

                    <a
                      href={sub.submissionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-bold hover:underline flex items-center gap-1 mb-1 text-[11px]"
                    >
                      <span>مشاهده خروجی ارسال‌شده</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {sub.submissionNote && (
                      <p className="text-[11px] text-ink-normal/80 dark:text-gray-300 bg-white dark:bg-[#151C28] p-2 rounded-lg border border-gray-200 dark:border-gray-700 mt-1">
                        یادداشت شما: {sub.submissionNote}
                      </p>
                    )}

                    {sub.mentorFeedback && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-ink-normal/80 dark:text-gray-300">
                        <span className="font-bold text-[10px] text-sec dark:text-white block">
                          بازخورد منتور:
                        </span>
                        <p className="text-[11px] bg-ecosystem-light dark:bg-ecosystem-darker/40 p-2 rounded-lg border border-primary/30 mt-1 text-ecosystem-darker dark:text-ecosystem-light">
                          {sub.mentorFeedback}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}