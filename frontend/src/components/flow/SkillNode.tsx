'use client';

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
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
    bg: 'bg-slate-100',
    border: 'border-slate-400',
    text: 'text-slate-600',
    shadow: '#94a3b8',
    dot: 'bg-slate-400',
  },
  UNLOCKED: {
    label: 'آماده شروع',
    icon: Unlock,
    bg: 'bg-sky-50',
    border: 'border-sky-500',
    text: 'text-sky-700',
    shadow: '#0284c7',
    dot: 'bg-sky-500',
  },
  IN_PROGRESS: {
    label: 'در حال انجام',
    icon: BookOpen,
    bg: 'bg-teal-50',
    border: 'border-teal-600',
    text: 'text-teal-800',
    shadow: '#0d9488',
    dot: 'bg-teal-600',
  },
  SUBMITTED: {
    label: 'در انتظار منتور',
    icon: Clock,
    bg: 'bg-amber-50',
    border: 'border-amber-500',
    text: 'text-amber-800',
    shadow: '#ea580c',
    dot: 'bg-amber-500',
  },
  NEEDS_REVISION: {
    label: 'نیازمند اصلاح',
    icon: AlertCircle,
    bg: 'bg-rose-50',
    border: 'border-rose-500',
    text: 'text-rose-700',
    shadow: '#e11d48',
    dot: 'bg-rose-500',
  },
  COMPLETED: {
    label: 'تکمیل شده',
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    border: 'border-emerald-600',
    text: 'text-emerald-800',
    shadow: '#059669',
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
        boxShadow: `5px 6px 0 0 ${config.shadow}`,
      }}
      className={`relative w-72 rounded-tl-2xl rounded-br-2xl bg-white border-2 ${config.border} p-4 text-right transition-all cursor-pointer hover:-translate-y-1 active:scale-[0.98] touch-manipulation select-none`}
    >
      {/* Target Handle (Top: incoming prerequisites from parent nodes) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary !w-3.5 !h-3.5 !border-2 !border-white hover:scale-125 transition-transform"
        title="ورودی (پیش‌نیاز)"
      />

      {/* Header: Status Pill & Deliverable Badge */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full border ${config.bg} ${config.text} ${config.border}`}
        >
          <StatusIcon className="w-3 h-3" />
          {config.label}
        </span>

        {data.hasDeliverable ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-accent bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20">
            <Briefcase className="w-3 h-3" />
            مأموریت واقعی
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
            <Layers className="w-3 h-3" />
            مطالعه
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-extrabold text-primary text-sm leading-snug mb-1">
        {data.title}
      </h3>

      {/* Description Snippet */}
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
        {data.description}
      </p>

      {/* Footer Info */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
        <span>{data.resourceCount > 0 ? `${data.resourceCount} منبع آموزشی` : 'بدون منبع'}</span>
        <span className="text-secondary font-bold hover:underline">
          مشاهده جزئیات ←
        </span>
      </div>

      {/* Source Handle (Bottom: outgoing to dependent nodes) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-secondary !w-3.5 !h-3.5 !border-2 !border-white hover:scale-125 transition-transform"
        title="خروجی (مسیر بعدی)"
      />
    </div>
  );
}

export const SkillNode = memo(SkillNodeComponent);
