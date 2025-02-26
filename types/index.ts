// src/types/index.ts

export type WorkType = 'SHIFT' | 'LESSON';
export type DayStatus = 'WORKING' | 'OFF';

export interface WorkEntry {
  id: string;
  date: string; // ISO format date string
  type: WorkType;
  startTime: string; // 24-hour format, e.g. "08:00"
  endTime: string; // 24-hour format, e.g. "16:00"
  hourlyRate: number;
  location: string;
  notes?: string;
}

export interface Shift extends WorkEntry {
  type: 'SHIFT';
}

export interface Lesson extends WorkEntry {
  type: 'LESSON';
  student: string;
}

export interface DayData {
  date: string; // ISO format date string
  status: DayStatus;
  entries: WorkEntry[];
}

export interface WorkMonth {
  month: number; // 0-11
  year: number;
  days: DayData[];
  totalEarnings: number;
  totalHours: number;
}

// Helper function to calculate hours between two time strings
export const calculateHours = (startTime: string, endTime: string): number => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  
  return (endTotalMinutes - startTotalMinutes) / 60;
};

// Helper function to calculate earnings for a work entry
export const calculateEarnings = (entry: WorkEntry): number => {
  const hours = calculateHours(entry.startTime, entry.endTime);
  return hours * entry.hourlyRate;
};

// Helper to format currency in ILS (Israeli New Shekel)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 2
  }).format(amount);
};