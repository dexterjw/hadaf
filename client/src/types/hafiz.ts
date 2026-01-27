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

export type HafizTab = 'dashboard' | 'dashboard-1' | 'dashboard-4' | 'dashboard-4-v1' | 'dashboard-4-v2' | 'dashboard-4-v3' | 'dashboard-5' | 'dashboard-6' | 'dashboard-7-gpt' | 'dashboard-healthy-heart' | 'dashboard-13' | 'journey-roadmap' | 'analytics' | 'settings' | 'coach';

export const DEFAULT_SETTINGS: UserSettings = {
  name: "Student",
  totalPages: 604,
  startPage: 1,
  startDate: new Date(new Date().getFullYear(), 0, 1).toISOString(), // Jan 1st of current year
  currentPage: 45,
  dailyGoalPages: 2,
  revisionGoalPages: 20
};
