export interface Task {
  id: string;
  name: string;
  category: 'Focus' | 'Fitness' | 'Code' | 'Mind' | 'Habit' | 'Custom';
  colorTag?: string;
  createdAt: string;
  history: Record<string, 'done' | 'skipped' | 'missed'>; // "YYYY-MM-DD"
}

export interface SleepRecord {
  date: string;
  durationHours: number;
  bedTime: string;
  wakeTime: string;
  quality: 'Deep' | 'Restful' | 'Fragmented' | 'Restless';
  notes?: string;
}

export interface PunishmentRecord {
  id: string;
  taskId: string;
  taskName: string;
  missedDates: string[];
  punishmentText: string;
  assignedAt: string;
  served: boolean;
  servedAt?: string;
}

export interface QuoteItem {
  id: string;
  text: string;
  author: string;
  isCustom?: boolean;
}

export interface DailyJournalEntry {
  date: string;       // "YYYY-MM-DD"
  line: string;       // One-line reflection
  mood: 'good' | 'bad' | 'neutral';
}

export interface ProductivityPoint {
  date: string;
  score: number;      // cumulative % change
  tasksCompleted: number;
  totalTasks: number;
}

export interface UserStats {
  dailyPercentage: number;
  monthlyPercentage: number;
  activeStreak: number;
  completedTodayCount: number;
  totalTodayTasks: number;
}

export type ThemeMode = 'dark' | 'light';
