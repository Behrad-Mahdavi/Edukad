'use client';

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { toPersianDigits } from '@/lib/utils';
import {
  Lock,
  Unlock,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  Layers,
} from 'lucide-react';

export interface SkillNodeData {
  id: string;
  title: string;
  description: string;
  hasDeliverable: boolean;
  status: 'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS' | 'SUBMITTED' | 'NEEDS_REVISION' | 'COMPLETED';
  resourceCount: number;
  isSelected?: boolean;
}

const statusConfig = {
  LOCKED: {
    label: 'قفل شده',
    icon: Lock,
    bg: 'bg-gray-100 dark:bg-gray-800',
    border: 'border-gray-300 dark:border-gray-700',
    text: 'text-gray-500 dark:text-gray-400',
    shadow: '#94a3b8',
    dot: 'bg-gray-400',
  },
  UNLOCKED: {
    label: 'آماده شروع',
    icon: Unlock,
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    border: 'border-sky-500',
    text: 'text-sky-700 dark:text-sky-300',
    shadow: '#0284c7',
    dot: 'bg-sky-500',
  },
  IN_PROGRESS: {
    label: 'در حال انجام',
    icon: BookOpen,
    bg: 'bg-ecosystem-light dark:bg-ecosystem-darker/40',
    border: 'border-primary',
    text: 'text-ecosystem-darker dark:text-ecosystem-light',
    shadow: '#59BBAF',
    dot: 'bg-primary',
  },
  SUBMITTED: {
    label: 'در انتظار منتور',
    icon: Clock,
    bg: 'bg-college-light dark:bg-college-darker/40',
    border: 'border-college-normal',
    text: 'text-college-darker dark:text-college-light',
    shadow: '#F8A41D',
    dot: 'bg-college-normal',
  },
  NEEDS_REVISION: {
    label: 'نیازمند اصلاح',
    icon: AlertCircle,
    bg: 'bg-female-light dark:bg-female-darker/40',
    border: 'border-female-normal',
    text: 'text-female-darker dark:text-female-light',
    shadow: '#E0195B',
    dot: 'bg-female-normal',
  },
  COMPLETED: {
    label: 'تکمیل شده',
    icon: CheckCircle2,
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-600 dark:border-emerald-500',
    text: 'text-emerald-800 dark:text-emerald-300',
    shadow: '#009966',
    dot: 'bg-emerald-600',
  },
};

function SkillNodeComponent({ data }: { data: SkillNodeData }) {
  const currentStatus = data.status || 'LOCKED';
  const config = statusConfig[currentStatus];
  const StatusIcon = config.icon;

  return (
    <div
      style={{
        boxShadow: `3px 3.5px 0 0 ${config.shadow}`,
      }}
      className={`relative w-72 rounded-2xl bg-white dark:bg-[#151C28] border-2 ${config.border} p-4 text-right transition-all cursor-pointer hover:-translate-y-1 active:scale-[0.98] touch-manipulation select-none`}
      dir="rtl"
    >
      {/* Target Handle (Top: incoming prerequisites from parent nodes) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary !w-3.5 !h-3.5 !border-2 !border-white dark:!border-[#151C28] hover:scale-125 transition-transform"
        title="ورودی (پیش‌نیاز)"
      />

      {/* Header: Status Pill & Deliverable Badge */}
      <div className="flex items-center justify-between gap-2 mb-2.5" dir="rtl">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${config.bg} ${config.text} ${config.border}`}
        >
          <StatusIcon className="w-3 h-3" />
          <span>{config.label}</span>
        </span>

        {data.hasDeliverable ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-black text-female-normal bg-female-light dark:bg-female-darker/40 px-2 py-0.5 rounded-full border border-female-normal/30">
            <Briefcase className="w-3 h-3" />
            <span>مأموریت واقعی</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            <Layers className="w-3 h-3" />
            <span>مطالعه</span>
          </span>
        )}
      </div>

      {/* Title with BiDi Isolation */}
      <h3 className="font-black text-sec dark:text-white text-sm leading-snug mb-1 text-right bidi-text" dir="rtl">
        <bdi>{data.title}</bdi>
      </h3>

      {/* Description Snippet with BiDi Isolation */}
      <p className="text-xs text-ink-normal/70 dark:text-gray-400 line-clamp-2 leading-relaxed text-right bidi-text" dir="rtl">
        <bdi>{data.description}</bdi>
      </p>

      {/* Footer Info */}
      <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 font-semibold">
        <span>{data.resourceCount > 0 ? `${toPersianDigits(data.resourceCount)} منبع آموزشی` : 'بدون منبع'}</span>
        <span className="text-primary font-bold hover:underline">
          مشاهده جزئیات ←
        </span>
      </div>

      {/* Source Handle (Bottom: outgoing to dependent nodes) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary !w-3.5 !h-3.5 !border-2 !border-white dark:!border-[#151C28] hover:scale-125 transition-transform"
        title="خروجی (مسیر بعدی)"
      />
    </div>
  );
}

export const SkillNode = memo(SkillNodeComponent);
