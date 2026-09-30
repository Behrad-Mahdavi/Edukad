'use client';

import React from 'react';
import { Sparkles, Compass, Workflow, ShieldCheck, CheckSquare, Layers } from 'lucide-react';


interface RokadLoaderProps {
  title?: string;
  subtitle?: string;
  type?: 'general' | 'roadmap' | 'mentor' | 'admin' | 'skill';
  fullScreen?: boolean;
}

export function RokadLoader({
  title = 'در حال بارگذاری اطلاعات...',
  subtitle = 'شتاب‌دهی استعداد و درخت مهارت باشگاه رکاد',
  type = 'general',
  fullScreen = false,
}: RokadLoaderProps) {
  const getIcon = () => {
    switch (type) {
      case 'roadmap':
        return <Compass className="w-7 h-7 sm:w-8 sm:h-8 text-primary animate-pulse" />;
      case 'mentor':
        return <CheckSquare className="w-7 h-7 sm:w-8 sm:h-8 text-female-normal animate-pulse" />;
      case 'admin':
        return <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-college-normal animate-pulse" />;
      case 'skill':
        return <Workflow className="w-7 h-7 sm:w-8 sm:h-8 text-primary animate-pulse" />;
      default:
        return <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-primary animate-pulse" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'mentor':
        return 'border-female-normal shadow-female';
      case 'admin':
        return 'border-college-normal shadow-college';
      default:
        return 'border-primary shadow-ecosystem';
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center text-center p-6 select-none animate-in fade-in duration-300">
      {/* Central Branded Neo-Brutal Animated Orb */}
      <div className="relative mb-6">
        {/* Outer Pulsing Aura Ring */}
        <div className="absolute -inset-3 rounded-3xl bg-primary/20 dark:bg-primary/10 blur-md animate-pulse" />

        {/* Orbiting Multi-Persona Dots */}
        <div className="absolute -inset-2.5 rounded-full border border-dashed border-gray-300 dark:border-gray-700 animate-[spin_8s_linear_infinite]" />

        {/* Main Icon Box */}
        <div
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-[#151C28] border-2 flex items-center justify-center transition-all ${getBorderColor()}`}
        >
          {getIcon()}
          
          {/* Subtle Corner Badge */}
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          </span>
        </div>
      </div>



      {/* Typography & Subtitles */}
      <h3 className="text-base sm:text-lg font-black text-sec dark:text-white tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-xs font-semibold text-ink-normal/60 dark:text-gray-400 max-w-sm mb-4 leading-relaxed">
        {subtitle}
      </p>

      {/* Animated Glowing Progress Bar */}
      <div className="w-44 h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
        <div className="absolute inset-y-0 bg-gradient-to-r from-primary via-college-normal to-female-normal w-1/2 rounded-full animate-[progress_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8F9FA]/90 dark:bg-[#0B0F17]/90 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-[55vh] flex items-center justify-center">
      {content}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rokad-card p-6 bg-white dark:bg-[#151C28] border border-gray-200 dark:border-gray-800 rounded-2xl animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-24 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
      <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      <div className="space-y-2">
        <div className="w-full h-3.5 bg-gray-100 dark:bg-gray-800 rounded-md" />
        <div className="w-5/6 h-3.5 bg-gray-100 dark:bg-gray-800 rounded-md" />
      </div>
      <div className="pt-2">
        <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
