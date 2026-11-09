import type { Task, PunishmentRecord } from '../types';

const OFFLINE_PENALTIES: Record<string, string[]> = {
  Fitness: [
    "Drop and complete 50 crisp pushups right now, followed by a 2-minute wall-sit.",
    "No elevator or escalator for 48 hours: every staircase must be conquered by foot.",
    "Perform 100 jumping jacks and a 3-minute plank before touching any entertainment app."
  ],
  Code: [
    "Refactor your ugliest function or explain your project architecture out loud to a rubber duck for 15 minutes.",
    "Lock down social media and YouTube tabs: spend 45 uninterrupted minutes reading official documentation.",
    "Commit a well-documented bug fix or clean README writeup before going to bed tonight."
  ],
  Focus: [
    "Place your smartphone in another room inside a drawer for 3 consecutive hours of deep work.",
    "Write a concise one-page handwritten post-mortem explaining what broke your discipline.",
    "Zero music with lyrics and zero second screens during your next two work sessions."
  ],
  Mind: [
    "15 minutes of completely silent, unguided meditation with eyes closed in an upright chair.",
    "Turn off all notifications across phone and laptop until tomorrow morning.",
    "Write 3 hard truths about your current habits and how you will overcome them."
  ],
  Habit: [
    "Drink 1 full liter of water immediately and finish tomorrow's hardest chore before 9:00 AM.",
    "Take a 2-minute cold shower without hesitation to shock your system back into alertness.",
    "Wake up 45 minutes earlier tomorrow and tackle this task before breakfast."
  ],
  General: [
    "Execute 40 burpees or take an ice-cold shower to reset your discipline.",
    "No social media or entertainment streaming until you complete tomorrow's target.",
    "Pay a $10 discipline tax to savings or do 60 bodyweight squats immediately."
  ]
};

const USER_JOINED_KEY = 'chrono_user_joined_date';

export function getUserJoinedDate(): string {
  let joined = localStorage.getItem(USER_JOINED_KEY);
  if (!joined) {
    joined = new Date().toISOString().split('T')[0];
    localStorage.setItem(USER_JOINED_KEY, joined);
  }
  return joined;
}

/**
 * Resets the accountability baseline to Today.
 * Any past dates before today will be completely forgiven and ignored for future breaches.
 */
export function resetAccountabilityBaseline(): string {
  const todayStr = formatDate(new Date());
  localStorage.setItem(USER_JOINED_KEY, todayStr);
  return todayStr;
}

/**
 * Pardons all active/unserved punishments, marking them resolved.
 */
export function pardonAllPunishments(punishments: PunishmentRecord[]): PunishmentRecord[] {
  const now = new Date().toISOString();
  return punishments.map((p) =>
    !p.served
      ? {
          ...p,
          served: true,
          servedAt: now,
          punishmentText: `${p.punishmentText} (Pardoned via Fresh Start)`,
        }
      : p
  );
}

export function getTaskEffectiveStartDate(task: Task): string {
  const userJoined = getUserJoinedDate();
  if (!task.createdAt) return userJoined;
  const taskCreated = task.createdAt.split('T')[0];
  // The start date cannot be before user joined date
  return taskCreated > userJoined ? taskCreated : userJoined;
}

/**
 * Format a Date to YYYY-MM-DD
 */
export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Check if a task is currently in Day 2 Warning danger:
 * - Yesterday was missed (and yesterday >= task effective start date).
 * - Today is NOT completed yet.
 * - If today gets completed, this returns false immediately.
 */
export function isDay2WarningActive(task: Task, todayDate: Date = new Date()): boolean {
  // Brand new tasks with zero history should never show warnings on Day 1
  const completedKeys = Object.keys(task.history || {}).filter((k) => task.history[k] === 'done');
  if (completedKeys.length === 0) {
    return false;
  }

  const startDate = getTaskEffectiveStartDate(task);
  const todayStr = formatDate(todayDate);

  // If today is completed, warning is completely dismissed
  if (task.history?.[todayStr] === 'done') {
    return false;
  }

  // Check yesterday
  const yesterday = new Date(todayDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  // If yesterday is before the task/user existed, no warning
  if (yesterdayStr < startDate) {
    return false;
  }

  // If yesterday was NOT completed, today is the crucial Day 2!
  const yesterdayDone = task.history?.[yesterdayStr] === 'done';
  return !yesterdayDone;
}

/**
 * Check if a task is locked by an unserved punishment.
 */
export function isTaskLocked(taskId: string, punishments: PunishmentRecord[]): PunishmentRecord | null {
  const pending = punishments.find((p) => p.taskId === taskId && !p.served);
  return pending || null;
}

/**
 * Scan all tasks for consecutive 2-day breaches that happened since effectiveStartDate.
 * If a breach is found and no punishment exists for it yet, automatically generate one!
 * Returns updated punishments list.
 */
export function scanAndAutoAssignPunishments(
  tasks: Task[],
  currentPunishments: PunishmentRecord[],
  todayDate: Date = new Date()
): PunishmentRecord[] {
  let updated = [...currentPunishments];
  let changed = false;

  for (const task of tasks) {
    const startDate = getTaskEffectiveStartDate(task);

    // If task already has an unserved punishment, it's already locked and punished
    const hasUnserved = updated.some((p) => p.taskId === task.id && !p.served);
    if (hasUnserved) continue;

    // We scan consecutive past days strictly between startDate and yesterday
    // Day 2 breach requires two consecutive past days (both < todayStr) to be missed
    const checkDate = new Date(todayDate);
    checkDate.setDate(checkDate.getDate() - 1); // Yesterday

    while (formatDate(checkDate) >= startDate) {
      const d2Str = formatDate(checkDate);

      const prevDate = new Date(checkDate);
      prevDate.setDate(prevDate.getDate() - 1); // Day before yesterday
      const d1Str = formatDate(prevDate);

      if (d1Str < startDate) {
        // Can't form a 2-day breach before start date
        break;
      }

      const d1Missed = task.history?.[d1Str] !== 'done';
      const d2Missed = task.history?.[d2Str] !== 'done';

      if (d1Missed && d2Missed) {
        // We have a 2-day breach on [d1Str, d2Str]!
        // Check if a punishment was already assigned for this breach pair
        const alreadyAssigned = updated.some(
          (p) => p.taskId === task.id && p.missedDates.includes(d1Str) && p.missedDates.includes(d2Str)
        );

        if (!alreadyAssigned) {
          const pool = OFFLINE_PENALTIES[task.category] || OFFLINE_PENALTIES.General;
          const randomVerdict = pool[Math.floor(Math.random() * pool.length)];

          const newRecord: PunishmentRecord = {
            id: `punish-${task.id}-${d1Str}-${Date.now()}`,
            taskId: task.id,
            taskName: task.name,
            missedDates: [d1Str, d2Str],
            punishmentText: randomVerdict,
            assignedAt: new Date().toISOString(),
            served: false,
          };

          updated = [newRecord, ...updated];
          changed = true;
          break; // One active breach punishment per task is sufficient to lock it
        }
      }

      // Move one day back
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  return changed ? updated : currentPunishments;
}
