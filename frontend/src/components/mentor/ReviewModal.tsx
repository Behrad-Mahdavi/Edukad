'use client';

import React, { useState } from 'react';
import { X, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

interface ReviewModalProps {
  submission: {
    id: string;
    submissionUrl: string;
    submissionNote?: string;
    nodeProgress: {
      user: {
        id: string;
        fullName: string;
        level?: string;
        phone: string;
      };
      node: {
        id: string;
        title: string;
        description: string;
        roadmap: {
          title: string;
        };
      };
    };
  };
  onClose: () => void;
  onReviewed: () => void;
}

export function ReviewModal({ submission, onClose, onReviewed }: ReviewModalProps) {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const student = submission.nodeProgress.user;
  const node = submission.nodeProgress.node;

  const handleReview = async (outcome: 'APPROVED' | 'REJECTED') => {
    if (outcome === 'REJECTED' && !feedback.trim()) {
      setError('برای رد کار، ثبت یادداشت و بازخورد اصلاحی برای دانش‌آموز الزامی است.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.submissions.reviewSubmission(submission.id, outcome, feedback);
      onReviewed();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
      <div className="bg-white border-2 border-primary rounded-3xl w-full max-w-lg shadow-[8px_10px_0_0_#21295a] overflow-hidden text-right">
        {/* Header */}
        <div className="p-5 bg-bg-lavender border-b-2 border-primary flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-secondary-dark block">
              بازبینی مأموریت دانش‌آموز
            </span>
            <h3 className="font-black text-lg text-primary">{student.fullName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border-2 border-primary bg-white hover:bg-slate-100 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border-2 border-rose-400 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Context Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">مسیر یادگیری:</span>
              <span className="font-bold text-primary">{node.roadmap.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">مهارت / گره:</span>
              <span className="font-black text-primary">{node.title}</span>
            </div>
          </div>

          {/* Submission Output URL */}
          <div>
            <label className="block font-bold text-xs text-primary mb-1.5">
              لینک خروجی ارسال‌شده توسط دانش‌آموز:
            </label>
            <a
              href={submission.submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3 rounded-xl border-2 border-secondary bg-bg-mint flex items-center justify-between text-xs font-bold text-secondary-dark hover:bg-secondary/10 transition-colors ltr"
            >
              <span className="truncate">{submission.submissionUrl}</span>
              <ExternalLink className="w-4 h-4 flex-shrink-0 ml-2" />
            </a>
          </div>

          {/* Student Note */}
          {submission.submissionNote && (
            <div>
              <label className="block font-bold text-xs text-primary mb-1">
                توضیحات دانش‌آموز:
              </label>
              <p className="p-3 rounded-xl bg-slate-100 text-xs text-slate-700 leading-relaxed border border-slate-200">
                {submission.submissionNote}
              </p>
            </div>
          )}

          {/* Mentor Feedback Input */}
          <div>
            <label className="block font-bold text-xs text-primary mb-1.5">
              بازخورد و یادداشت شما برای دانش‌آموز:
            </label>
            <textarea
              rows={3}
              placeholder="نکات مثبت کار و مواردی که باید برای بهبود یا اصلاح رعایت شوند را اینجا بنویسید..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary bg-white text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleReview('REJECTED')}
              disabled={loading}
              className="py-2.5 rounded-xl border-2 border-rose-600 bg-rose-50 text-rose-700 font-bold text-xs shadow-[2px_3px_0_0_#e11d48] hover:bg-rose-100 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              رد با یادداشت اصلاحی
            </button>

            <button
              onClick={() => handleReview('APPROVED')}
              disabled={loading}
              className="py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-[2px_3px_0_0_#064e3b] hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              تایید مأموریت ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
