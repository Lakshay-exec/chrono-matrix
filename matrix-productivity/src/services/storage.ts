import type { 
  Task, 
  SleepRecord, 
  PunishmentRecord, 
  QuoteItem, 
  UserStats, 
  DailyJournalEntry, 
  ProductivityPoint,
  ThemeMode 
} from '../types';
import { db, doc, setDoc, getDoc } from './firebase';

const STORAGE_KEYS = {
  TASKS: 'chrono_matrix_tasks',
  SLEEP: 'chrono_matrix_sleep',
  PUNISHMENTS: 'chrono_matrix_punishments',
  CUSTOM_QUOTE: 'chrono_matrix_custom_quote',
  SHOW_QUOTE: 'chrono_matrix_show_quote',
  POTATO_MODE: 'chrono_matrix_potato_mode',
  JOURNAL: 'chrono_matrix_journal',
  THEME: 'chrono_matrix_theme',
};

// Default initial tasks
export const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    name: 'Deep Focus (2 Hours)',
    category: 'Focus',
    colorTag: '#ffffff',
    createdAt: new Date().toISOString(),
    history: {}
  },
  {
    id: 't-2',
    name: 'Physical Training / Mobility',
    category: 'Fitness',
    colorTag: '#a1a1aa',
    createdAt: new Date().toISOString(),
    history: {}
  },
  {
    id: 't-3',
    name: 'Code Architecture / Project Build',
    category: 'Code',
    colorTag: '#71717a',
    createdAt: new Date().toISOString(),
    history: {}
  },
  {
    id: 't-4',
    name: 'Evening Reflection & Offline Reading',
    category: 'Mind',
    colorTag: '#e4e4e7',
    createdAt: new Date().toISOString(),
    history: {}
  }
];

export function getLocalTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local tasks:', e);
  }
  return INITIAL_TASKS;
}

export function saveLocalTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export function getLocalSleep(): SleepRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SLEEP);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local sleep records:', e);
  }
  return [];
}

export function saveLocalSleep(records: SleepRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.SLEEP, JSON.stringify(records));
}

export function getLocalPunishments(): PunishmentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PUNISHMENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local punishments:', e);
  }
  return [];
}

export function saveLocalPunishments(punishments: PunishmentRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.PUNISHMENTS, JSON.stringify(punishments));
}

export function getLocalJournal(): Record<string, DailyJournalEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading journal records:', e);
  }
  return {};
}

export function saveLocalJournal(journal: Record<string, DailyJournalEntry>): void {
  localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(journal));
}

export function getLocalTheme(): ThemeMode {
  const raw = localStorage.getItem(STORAGE_KEYS.THEME);
  return (raw === 'light' || raw === 'dark') ? raw : 'dark';
}

export function saveLocalTheme(theme: ThemeMode): void {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  if (theme === 'light') {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }
}

export function getQuoteSettings(): { showQuote: boolean; customQuote: QuoteItem | null } {
  const showRaw = localStorage.getItem(STORAGE_KEYS.SHOW_QUOTE);
  const customRaw = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUOTE);
  return {
    showQuote: showRaw === null ? true : showRaw === 'true',
    customQuote: customRaw ? JSON.parse(customRaw) : null
  };
}

export function saveQuoteSettings(showQuote: boolean, customQuote?: QuoteItem | null): void {
  localStorage.setItem(STORAGE_KEYS.SHOW_QUOTE, String(showQuote));
  if (customQuote !== undefined) {
    if (customQuote) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_QUOTE, JSON.stringify(customQuote));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_QUOTE);
    }
  }
}

export function getPotatoMode(): boolean {
  return localStorage.getItem(STORAGE_KEYS.POTATO_MODE) === 'true';
}

export function savePotatoMode(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEYS.POTATO_MODE, String(enabled));
}

/**
 * Cloud Sync Layer with Firebase Firestore
 */
export async function syncToCloud(userId: string, data: {
  tasks: Task[];
  sleep: SleepRecord[];
  punishments: PunishmentRecord[];
  journal?: Record<string, DailyJournalEntry>;
}) {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Cloud sync error (running offline):', err);
  }
}

export async function fetchFromCloud(userId: string): Promise<{
  tasks?: Task[];
  sleep?: SleepRecord[];
  punishments?: PunishmentRecord[];
  journal?: Record<string, DailyJournalEntry>;
} | null> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as any;
    }
  } catch (err) {
    console.warn('Cloud fetch error (running offline):', err);
  }
  return null;
}

/**
 * Export full JSON data for offline software backup
 */
export function exportDataAsJSON(): string {
  const payload = {
    version: '1.2.0',
    exportedAt: new Date().toISOString(),
    tasks: getLocalTasks(),
    sleep: getLocalSleep(),
    punishments: getLocalPunishments(),
    journal: getLocalJournal(),
    theme: getLocalTheme(),
    quoteSettings: getQuoteSettings(),
  };
  return JSON.stringify(payload, null, 2);
}

export function importDataFromJSON(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.tasks) saveLocalTasks(data.tasks);
    if (data.sleep) saveLocalSleep(data.sleep);
    if (data.punishments) saveLocalPunishments(data.punishments);
    if (data.journal) saveLocalJournal(data.journal);
    if (data.theme) saveLocalTheme(data.theme);
    if (data.quoteSettings) {
      saveQuoteSettings(data.quoteSettings.showQuote, data.quoteSettings.customQuote);
    }
    return true;
  } catch (err) {
    console.error('Import failed:', err);
    return false;
  }
}

/**
 * Statistics Calculator for Today % & Month % & Streaks
 */
export function calculateStats(tasks: Task[], currentDate: Date): UserStats {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  
  const todayDay = currentDate.getDate();
  const todayKey = `${monthStr}-${String(todayDay).padStart(2, '0')}`;
  
  const daysInMonth = new Date(year, month, 0).getDate();

  let completedTodayCount = 0;
  const totalTodayTasks = tasks.length;

  let totalMonthChecked = 0;
  let totalScheduledMonthPossible = 0;

  tasks.forEach(task => {
    // Today
    if (task.history?.[todayKey] === 'done') {
      completedTodayCount++;
    }

    // Month
    for (let d = 1; d <= daysInMonth; d++) {
      const dayKey = `${monthStr}-${String(d).padStart(2, '0')}`;
      if (d <= todayDay) {
        totalScheduledMonthPossible++;
        if (task.history?.[dayKey] === 'done') {
          totalMonthChecked++;
        }
      }
    }
  });

  const dailyPercentage = totalTodayTasks > 0 ? Math.round((completedTodayCount / totalTodayTasks) * 100) : 0;
  const monthlyPercentage = totalScheduledMonthPossible > 0 ? Math.round((totalMonthChecked / totalScheduledMonthPossible) * 100) : 0;

  // Continuous overall streak
  let activeStreak = 0;
  const checkDate = new Date(currentDate);
  const checkedToday = tasks.some(t => t.history?.[todayKey] === 'done');
  if (checkedToday) {
    activeStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  for (let i = 0; i < 60; i++) {
    const y = checkDate.getFullYear();
    const m = String(checkDate.getMonth() + 1).padStart(2, '0');
    const d = String(checkDate.getDate()).padStart(2, '0');
    const k = `${y}-${m}-${d}`;

    const anyDone = tasks.some(t => t.history?.[k] === 'done');
    if (anyDone) {
      activeStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    dailyPercentage,
    monthlyPercentage,
    activeStreak,
    completedTodayCount,
    totalTodayTasks
  };
}

/**
 * Atomic 1% Compounding Trajectory Calculator
 * Every day where at least 60% of tasks are completed: +1% compounding (score * 1.01)
 * Every day where tasks are missed/below threshold: -1% decay (score * 0.99)
 * Respective proportional factor based on ratio of completed tasks
 */
export function calculateCompoundingTrajectory(tasks: Task[], daysCount = 30): ProductivityPoint[] {
  const points: ProductivityPoint[] = [];
  const now = new Date();
  let currentScore = 100.0; // Baseline 100%

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    const total = tasks.length;
    let completed = 0;
    tasks.forEach(t => {
      if (t.history?.[dateStr] === 'done') completed++;
    });

    if (total > 0) {
      const ratio = completed / total;
      // Proportional compounding adjustment:
      // Ratio 1.0 -> +1.5% boost
      // Ratio >= 0.6 -> +1.0% boost
      // Ratio between 0.3 and 0.6 -> neutral 0.0%
      // Ratio < 0.3 or 0 -> -1.0% to -1.5% drop
      let dailyFactor = 1.0;
      if (ratio >= 0.8) {
        dailyFactor = 1.015;
      } else if (ratio >= 0.5) {
        dailyFactor = 1.01;
      } else if (ratio >= 0.25) {
        dailyFactor = 0.995;
      } else {
        dailyFactor = 0.99;
      }
      currentScore = Number((currentScore * dailyFactor).toFixed(2));
    }

    points.push({
      date: dateStr,
      score: currentScore,
      tasksCompleted: completed,
      totalTasks: total,
    });
  }

  return points;
}
