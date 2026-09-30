import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// تبدیل اعداد به ارقام فارسی
export function toPersianDigits(n: number | string | null | undefined): string {
  if (n === null || n === undefined) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (x) => persianDigits[parseInt(x, 10)]);
}

// نام ماه‌های فارسی
export const PERSIAN_MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

// نام روزهای هفته فارسی
export const PERSIAN_WEEKDAY_NAMES = [
  'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'
];

// فرمت تاریخ به شمسی خوانا (مستقل و دقیق)
export function formatToJalali(
  date: Date | string | null | undefined,
  options?: { showMonthName?: boolean; includeDayName?: boolean }
): string {
  if (!date) return '-';
  let d: Date;
  if (typeof date === 'string') {
    const parts = date.split('T')[0].split('-');
    if (parts.length === 3) {
      d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    } else {
      d = new Date(date);
    }
  } else {
    d = date;
  }

  if (isNaN(d.getTime())) return '-';

  // Jalali conversion algorithm
  const gy = d.getFullYear();
  const gm = d.getMonth() + 1;
  const gd = d.getDate();

  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = (gy <= 1600) ? 0 : 979;
  let gy2 = (gy <= 1600) ? gy - 621 : gy - 1600;
  let days = (365 * gy2) + (Math.floor((gy2 + 3) / 4)) - (Math.floor((gy2 + 99) / 100)) + (Math.floor((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
  if (gm > 2 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0))) {
    days++;
  }
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));

  const dayStr = toPersianDigits(jd);
  const yearStr = toPersianDigits(jy);

  if (options?.showMonthName) {
    const monthName = PERSIAN_MONTH_NAMES[jm - 1];
    if (options?.includeDayName) {
      const dayName = PERSIAN_WEEKDAY_NAMES[d.getDay()];
      return `${dayName} ${dayStr} ${monthName} ${yearStr}`;
    }
    return `${dayStr} ${monthName} ${yearStr}`;
  }

  const monthStr = toPersianDigits(jm.toString().padStart(2, '0'));
  return `${yearStr}/${monthStr}/${dayStr.padStart(2, '۰')}`;
}
