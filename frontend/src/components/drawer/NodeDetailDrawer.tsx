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
        className="fixed inset-0 bg-primary/20 backdrop-blur-[2px] z-50 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Drawer positioned on the right */}
      <div
        className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white border-l-4 border-primary shadow-[-10px_0_30px_0_rgba(33,41,90,0.2)] z-50 flex flex-col overflow-hidden text-right animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-bg-lavender border-b-2 border-primary flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary mb-2 inline-block">
              جزئیات مهارت
            </span>
            <h2 className="font-black text-xl text-primary leading-snug">
              {node.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 rounded-xl border-2 border-primary bg-white hover:bg-rose-50 text-slate-500 hover:text-accent transition-colors active:scale-95"
            title="بستن پنجره"
            aria-label="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <div className="p-5 border-b border-slate-100 bg-white">
          <p className="text-sm text-slate-700 leading-relaxed">
            {node.description}
          </p>

          {/* Status indicator action bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-500">
              وضعیت شما:{' '}
              <span
                className={`font-black ${status === 'COMPLETED'
                  ? 'text-emerald-600'
                  : status === 'SUBMITTED'
                    ? 'text-amber-600'
                    : status === 'NEEDS_REVISION'
                      ? 'text-rose-600'
                      : status === 'IN_PROGRESS'
                        ? 'text-teal-600'
                        : status === 'UNLOCKED'
                          ? 'text-sky-600'
                          : 'text-slate-400'
                  }`}
              >
                {status === 'COMPLETED' && 'تکمیل شده 🌟'}
                {status === 'SUBMITTED' && 'در انتظار بازبینی منتور ⏳'}
                {status === 'NEEDS_REVISION' && 'نیاز به اصلاح 🔄'}
                {status === 'IN_PROGRESS' && 'در حال مطالعه و انجام'}
                {status === 'UNLOCKED' && 'باز شده (شروع نشده)'}
                {status === 'LOCKED' && 'قفل شده (پیش‌نیازها مانده)'}
              </span>
            </div>

            {status === 'UNLOCKED' && (
              <button
                onClick={handleStartNode}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-secondary text-white font-bold text-xs shadow-[2px_3px_0_0_#347e75] hover:-translate-y-0.5 transition-transform"
              >
                شروع مطالعه
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-primary bg-slate-50 font-bold text-xs">
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex-1 py-3 border-b-2 transition-all flex items-center justify-center gap-1.5 ${activeTab === 'resources'
              ? 'border-primary text-primary bg-white'
              : 'border-transparent text-slate-500 hover:text-primary'
              }`}
          >
            <BookOpen className="w-4 h-4" />
            منابع یادگیری ({node.resources.length})
          </button>

          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-3 border-b-2 transition-all flex items-center justify-center gap-1.5 ${activeTab === 'submit'
              ? 'border-primary text-primary bg-white'
              : 'border-transparent text-slate-500 hover:text-primary'
              }`}
          >
            <Send className="w-4 h-4" />
            تحویل مأموریت
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 border-b-2 transition-all flex items-center justify-center gap-1.5 ${activeTab === 'history'
              ? 'border-primary text-primary bg-white'
              : 'border-transparent text-slate-500 hover:text-primary'
              }`}
          >
            <Clock className="w-4 h-4" />
            تاریخچه ارسال‌ها ({progress?.submissions?.length || 0})
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="m-4 p-3 rounded-xl bg-rose-50 border-2 border-rose-400 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {successMsg && (
          <div className="m-4 p-3 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-700 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: RESOURCES */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              {node.resources.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  منبعی برای این گره ثبت نشده است.
                </div>
              ) : (
                node.resources.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-xl border-2 border-primary/20 bg-bg-mint/30 shadow-[3px_3px_0_0_#58bdaf] hover:border-secondary transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2 font-bold text-xs text-primary">
                      {res.type === 'LINK' && <LinkIcon className="w-4 h-4 text-secondary" />}
                      {res.type === 'VIDEO_URL' && <Video className="w-4 h-4 text-accent" />}
                      {res.type === 'MARKDOWN_TEXT' && <FileText className="w-4 h-4 text-tertiary" />}
                      {res.title}
                    </div>

                    {res.type === 'MARKDOWN_TEXT' ? (
                      <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                        {res.content}
                      </div>
                    ) : (
                      <a
                        href={res.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-secondary-dark hover:underline break-all"
                      >
                        باز کردن لینک منبع
                        <ExternalLink className="w-3.5 h-3.5" />
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
                <div className="p-6 text-center border-2 border-dashed border-primary/30 rounded-2xl bg-bg-mint/40">
                  <Sparkles className="w-10 h-10 text-secondary mx-auto mb-3" />
                  <h3 className="font-extrabold text-primary text-sm mb-1">
                    گره بدون نیاز به تحویل مأموریت
                  </h3>
                  <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                    این گره دانشی/مقدماتی است و تحویل خروجی ندارد. بعد از مطالعه منابع بالا، می‌توانید مستقیماً گره را به اتمام برسانید.
                  </p>

                  {status === 'COMPLETED' ? (
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-100 px-4 py-2 rounded-xl">
                      <CheckCircle2 className="w-4 h-4" />
                      این مهارت تکمیل شده است
                    </div>
                  ) : (
                    <button
                      onClick={handleCompleteDirect}
                      disabled={loading || status === 'LOCKED'}
                      className="w-full py-3 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-[3px_4px_0_0_#064e3b] hover:-translate-y-0.5 transition-transform disabled:opacity-50"
                    >
                      {loading ? 'در حال ثبت...' : 'تکمیل گره و باز شدن مراحل بعدی ✓'}
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  {status === 'COMPLETED' && (
                    <div className="mb-4 p-4 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      مأموریت این گره تایید شده و با موفقیت تکمیل گردید!
                    </div>
                  )}

                  {status === 'SUBMITTED' && (
                    <div className="mb-4 p-4 rounded-xl bg-amber-50 border-2 border-amber-500 text-amber-800 text-xs font-bold flex items-center gap-2">
                      <Clock className="w-5 h-5 flex-shrink-0" />
                      کار شما در صف بازبینی منتور قرار دارد. منتظر بررسی بمانید.
                    </div>
                  )}

                  {status === 'NEEDS_REVISION' && (
                    <div className="mb-4 p-4 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-800 text-xs leading-relaxed">
                      <div className="font-bold flex items-center gap-1.5 mb-1 text-rose-900">
                        <AlertCircle className="w-4 h-4" />
                        منتور نیاز به بازبینی و اصلاح اعلام کرده است:
                      </div>
                      {progress?.submissions?.[0]?.mentorFeedback && (
                        <p className="p-2.5 rounded bg-white/70 border border-rose-200 text-xs mt-1 text-slate-800">
                          {progress.submissions[0].mentorFeedback}
                        </p>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleSubmitDeliverable} className="space-y-4">
                    <div>
                      <label className="block font-bold text-xs text-primary mb-1.5">
                        لینک خروجی مأموریت *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="لینک گوگل‌درایو، گیت‌هاب، فیگما یا..."
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary bg-white text-xs focus:outline-none focus:ring-2 focus:ring-secondary ltr"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        دسترسی مشاهده لینک باید عمومی یا برای ایمیل منتور باز باشد.
                      </span>
                    </div>

                    <div>
                      <label className="block font-bold text-xs text-primary mb-1.5">
                        توضیحات یا یادداشت برای منتور
                      </label>
                      <textarea
                        rows={3}
                        placeholder="توضیحاتی در مورد نحوه انجام مأموریت، چالش‌ها و..."
                        value={submissionNote}
                        onChange={(e) => setSubmissionNote(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary bg-white text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || status === 'LOCKED' || status === 'COMPLETED'}
                      className="w-full py-3 rounded-xl bg-accent text-white font-extrabold text-xs shadow-[3px_4px_0_0_#21295a] hover:-translate-y-0.5 transition-transform disabled:opacity-50"
                    >
                      {loading ? 'در حال ارسال...' : 'ارسال مأموریت به منتور 🚀'}
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
                <div className="text-center py-8 text-slate-400 text-xs">
                  هنوز هیچ ارسالی برای این گره ثبت نشده است.
                </div>
              ) : (
                progress.submissions.map((sub, idx) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-500">
                        ارسال #{progress.submissions!.length - idx}
                      </span>
                      <span
                        className={`font-black px-2 py-0.5 rounded text-[10px] ${sub.outcome === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sub.outcome === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
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
                      className="text-secondary font-bold hover:underline flex items-center gap-1 mb-1 text-[11px]"
                    >
                      مشاهده خروجی ارسال‌شده
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {sub.submissionNote && (
                      <p className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200 mt-1">
                        یادداشت شما: {sub.submissionNote}
                      </p>
                    )}

                    {sub.mentorFeedback && (
                      <div className="mt-2 pt-2 border-t border-slate-200 text-slate-700">
                        <span className="font-bold text-[10px] text-primary block">
                          بازخورد منتور:
                        </span>
                        <p className="text-[11px] bg-bg-mint p-2 rounded border border-secondary/30 mt-1">
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