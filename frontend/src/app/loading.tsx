'use client';

import React from 'react';
import { RokadLoader } from '@/components/ui/Loading';

export default function Loading() {
  return (
    <RokadLoader
      title="در حال بارگذاری محیط Edukad..."
      subtitle="اتصال به سرورها و همگام‌سازی اطلاعات مهارت‌ها"
      type="general"
    />
  );
}
