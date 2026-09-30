'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, ExternalLink, X } from 'lucide-react';
import { api } from '@/lib/api';
import { toPersianDigits } from '@/lib/utils';
import Link from 'next/link';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  type: string;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const [list, countRes] = await Promise.all([
        api.notifications.getAll(),
        api.notifications.getUnreadCount(),
      ]);
      setNotifications(list);
      setUnreadCount(countRes.unreadCount);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // 15s poll
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1C2536] text-ink-normal dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        aria-label="اعلان‌ها"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-sec dark:text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-female-normal text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-[#151C28] animate-pulse">
            {unreadCount > 9 ? '+۹' : toPersianDigits(unreadCount)}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Mobile Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Responsive Notification Popover */}
          <div className="fixed left-3 right-3 top-20 sm:absolute sm:left-0 sm:right-auto sm:top-full sm:mt-3 sm:w-96 max-w-lg mx-auto sm:mx-0 bg-white dark:bg-[#151C28] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-male dark:shadow-ecosystem z-50 overflow-hidden text-right animate-in fade-in duration-150">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-3.5 bg-gray-50 dark:bg-[#1C2536] border-b border-gray-200 dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sec dark:text-white text-xs sm:text-sm flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-female-normal" />
                  <span>اعلان‌های شما</span>
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-female-normal text-white">
                    {toPersianDigits(unreadCount)} جدید
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>خوانده شدن همه</span>
                  </button>
                )}
                {/* Mobile Close Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="sm:hidden p-1 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 text-gray-500"
                  aria-label="بستن پنجره"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 overscroll-contain">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-ink-normal/50 dark:text-gray-400 text-xs sm:text-sm font-medium">
                  هیچ اعلانی برای نمایش وجود ندارد
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                    className={`p-3 sm:p-3.5 transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                      !n.isRead ? 'bg-ecosystem-light/50 dark:bg-ecosystem-darker/20 border-r-4 border-r-primary' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-sec dark:text-white leading-snug">
                        {n.title}
                      </h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-female-normal shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-ink-normal/80 dark:text-gray-300 mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    {n.link && (
                      <Link
                        href={n.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] text-primary font-bold mt-2 hover:underline"
                      >
                        <span>مشاهده در پنل</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
