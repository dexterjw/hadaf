export interface UserSettings {
  name: string;
  totalPages: number; // Standard is 604
  startPage: number;
  startDate: string; // ISO Date string
  currentPage: number;
  dailyGoalPages: number;
  revisionGoalPages: number; // Pages of revision per day
}

export interface CompletionData {
  daysRemaining: number;
  estimatedCompletionDate: Date;
  progressPercentage: number;
  juzCompleted: number;
  pagesRemaining: number;
}

export type HafizTab = 'dash1' | 'dash2' | 'dash3' | 'dash4' | 'dash5' | 'dash7' | 'dash8' | 'dash9' | 'dash10' | 'dash11' | 'dash12' | 'dash13' | 'settings' | 'coach';

export const DEFAULT_SETTINGS: UserSettings = {
  name: "Student",
  totalPages: 604,
  startPage: 1,
  startDate: new Date(new Date().getFullYear(), 0, 1).toISOString(), // Jan 1st of current year
  currentPage: 45,
  dailyGoalPages: 2,
  revisionGoalPages: 20
};
