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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-lg shadow-male dark:shadow-ecosystem overflow-hidden text-right">
        {/* Header */}
        <div className="p-5 bg-gray-50 dark:bg-[#1C2536] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-primary block">
              بازبینی مأموریت دانش‌آموز
            </span>
            <h3 className="font-black text-lg text-sec dark:text-white">{student.fullName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#151C28] hover:bg-gray-100 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-female-light dark:bg-female-darker/40 border border-female-normal/40 text-female-darker dark:text-female-light text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Context Card */}
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#1C2536] border border-gray-200 dark:border-gray-700 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-ink-normal/60 dark:text-gray-400">مسیر یادگیری:</span>
              <span className="font-bold text-sec dark:text-white">{node.roadmap.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-normal/60 dark:text-gray-400">مهارت / گره:</span>
              <span className="font-black text-primary">{node.title}</span>
            </div>
          </div>

          {/* Submission Output URL */}
          <div className="space-y-1.5">
            <label className="block font-bold text-xs text-sec dark:text-white">
              لینک خروجی ارسال‌شده توسط دانش‌آموز:
            </label>
            <a
              href={submission.submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3 rounded-xl border border-primary/40 bg-ecosystem-light dark:bg-ecosystem-darker/40 flex items-center justify-between text-xs font-bold text-ecosystem-darker dark:text-ecosystem-light hover:bg-ecosystem-light-hover transition-colors ltr"
            >
              <span className="truncate">{submission.submissionUrl}</span>
              <ExternalLink className="w-4 h-4 shrink-0 ml-2" />
            </a>
          </div>

          {/* Student Note */}
          {submission.submissionNote && (
            <div className="space-y-1">
              <label className="block font-bold text-xs text-sec dark:text-white">
                توضیحات دانش‌آموز:
              </label>
              <p className="p-3 rounded-xl bg-gray-50 dark:bg-[#1C2536] text-xs text-ink-normal/80 dark:text-gray-300 leading-relaxed border border-gray-200 dark:border-gray-700">
                {submission.submissionNote}
              </p>
            </div>
          )}

          {/* Mentor Feedback Input */}
          <div className="space-y-1.5">
            <label className="block font-bold text-xs text-sec dark:text-white">
              بازخورد و یادداشت شما برای دانش‌آموز:
            </label>
            <textarea
              rows={3}
              placeholder="نکات مثبت کار و مواردی که باید برای بهبود یا اصلاح رعایت شوند را اینجا بنویسید..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-[#1C2536] text-xs font-medium focus:border-primary focus:outline-none transition-all"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleReview('REJECTED')}
              disabled={loading}
              className="rokad-btn-girl py-2.5 text-xs"
            >
              <XCircle className="w-4 h-4" />
              <span>رد با یادداشت اصلاحی</span>
            </button>

            <button
              onClick={() => handleReview('APPROVED')}
              disabled={loading}
              className="rokad-btn-primary py-2.5 text-xs"
            >
              <CheckCircle className="w-4 h-4" />
              <span>تایید مأموریت</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
