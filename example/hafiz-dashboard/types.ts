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

export type Tab = 'dashboard' | 'analytics' | 'settings' | 'coach';
