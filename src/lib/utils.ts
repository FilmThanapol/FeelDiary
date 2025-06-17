import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { th, enUS } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Thai date formatting utility
export function formatDateLocalized(date: Date, formatStr: string, language: string = 'en') {
  const locale = language === 'th' ? th : enUS;
  return format(date, formatStr, { locale });
}

// Thai month names
export const thaiMonths = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

// Thai day names
export const thaiDays = [
  'อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'
];

// Get localized month name
export function getLocalizedMonth(monthIndex: number, language: string = 'en') {
  if (language === 'th') {
    return thaiMonths[monthIndex];
  }
  return format(new Date(2024, monthIndex, 1), 'MMM', { locale: enUS });
}

// Get localized day name
export function getLocalizedDay(dayIndex: number, language: string = 'en') {
  if (language === 'th') {
    return thaiDays[dayIndex];
  }
  return format(new Date(2024, 0, dayIndex + 1), 'EEE', { locale: enUS });
}
