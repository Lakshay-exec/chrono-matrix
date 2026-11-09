import { useState, useRef, useEffect } from 'react';
import type { Task, DailyJournalEntry, PunishmentRecord } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Check, 
  Flame, 
  AlertTriangle, 
  Calendar, 
  Layers, 
  Lock,
  ShieldAlert,
  X,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { isDay2WarningActive, isTaskLocked } from '../services/accountability';

interface MonthlySchedulerProps {
  tasks: Task[];
  journal?: Record<string, DailyJournalEntry>;
  punishments?: PunishmentRecord[];
  onToggleCell: (taskId: string, dayKey: string) => void;
  onAddTaskClick: () => void;
  onDeleteTask: (taskId: string) => void;
  onNavigateToTribunal?: () => void;
  onOpenResetModal?: () => void;
  potatoMode: boolean;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WDAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

export const MonthlyScheduler: React.FC<MonthlySchedulerProps> = ({
  tasks,
  journal,
  punishments = [],
  onToggleCell,
  onAddTaskClick,
  onDeleteTask,
  onNavigateToTribunal,
  onOpenResetModal,
  potatoMode,
}) => {
  // Mobile / Desktop View Mode: 'week' (compact 7-day) or 'month' (full 30-day matrix)
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [weekOffset, setWeekOffset] = useState(0);

  const [cur, setCur] = useState(new Date());
  const year = cur.getFullYear();
  const month = cur.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const now = new Date();
  const isThisMonth = now.getFullYear() === year && now.getMonth() === month;
  const todayNum = now.getDate();

  // Locked Task Modal State
  const [lockedModal, setLockedModal] = useState<{
    isOpen: boolean;
    task: Task | null;
    penalty: PunishmentRecord | null;
  }>({ isOpen: false, task: null, penalty: null });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to today in Month View on mount or when switching
  const scrollToToday = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const colWidth = 36;
    const stickyWidth = window.innerWidth < 640 ? 130 : 220;
    const targetScroll = Math.max(
      0,
      (todayNum - 1) * colWidth - (container.clientWidth - stickyWidth) / 2 + colWidth
    );
    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  useEffect(() => {
    if (viewMode === 'month' && isThisMonth) {
      const timer = setTimeout(scrollToToday, 120);
      return () => clearTimeout(timer);
    }
  }, [viewMode, month, year]);

  // Handle cell click with lock protection
  const handleClick = (task: Task, dayKey: string, isTodayCell: boolean) => {
    // Check if task is locked by an unresolved punishment
    const pendingPenalty = isTaskLocked(task.id, punishments);
    if (pendingPenalty) {
      setLockedModal({
        isOpen: true,
        task,
        penalty: pendingPenalty,
      });
      return;
    }

    onToggleCell(task.id, dayKey);

    if (isTodayCell && !potatoMode) {
      setTimeout(() => {
        try {
          confetti({
            particleCount: 28,
            spread: 45,
            origin: { y: 0.85 },
            colors: ['#ffffff', '#a1a1aa', '#52525b']
          });
        } catch {}
      }, 50);
    }
  };

  // Streak calculation
  const streak = (task: Task) => {
    let s = 0;
    const d = new Date();
    const todayK = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (task.history?.[todayK] === 'done') { s++; d.setDate(d.getDate()-1); } else d.setDate(d.getDate()-1);
    for (let i = 0; i < 90; i++) {
      const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (task.history?.[k] === 'done') { s++; d.setDate(d.getDate()-1); } else break;
    }
    return s;
  };

  // Calculate 7-day window for Week View (Monday to Sunday)
  const weekDays = (() => {
    const base = new Date();
    const dayOfWeek = base.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(base);
    monday.setDate(base.getDate() + diffToMonday + weekOffset * 7);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const y = d.getFullYear();
      const m = d.getMonth();
      const dt = d.getDate();
      const key = `${y}-${String(m + 1).padStart(2, '0')}-${String(dt).padStart(2, '0')}`;
      const isToday = now.getFullYear() === y && now.getMonth() === m && now.getDate() === dt;
      return {
        dateObj: d,
        year: y,
        month: m,
        dayNum: dt,
        dayKey: key,
        wday: WDAYS[d.getDay()],
        isToday,
      };
    });
  })();

  const weekHeaderLabel = (() => {
    const first = weekDays[0];
    const last = weekDays[6];
    if (first.month === last.month) {
      return `${SHORT_MONTHS[first.month]} ${first.dayNum} – ${last.dayNum}, ${first.year}`;
    }
    return `${SHORT_MONTHS[first.month]} ${first.dayNum} – ${SHORT_MONTHS[last.month]} ${last.dayNum}, ${last.year}`;
  })();

  return (
    <div className="w-full space-y-3.5 page-enter">
      {/* Header Controls: Month/Week Selector, Mode Toggle, Add Ritual */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Left: Month/Week Title & Arrows */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {viewMode === 'week' ? (
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold font-serif-app tracking-tight text-current">
                {weekHeaderLabel}
              </h2>
              <div className="flex items-center gap-0.5 bg-current/[0.03] p-0.5 rounded-xl border border-current/[0.08]">
                <button
                  onClick={() => setWeekOffset((prev) => prev - 1)}
                  className="p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-current/[0.05] transition-all cursor-pointer"
                  title="Previous Week"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {weekOffset !== 0 && (
                  <button
                    onClick={() => setWeekOffset(0)}
                    className="px-1.5 py-0.5 text-[10px] font-mono font-bold opacity-70 hover:opacity-100 transition-all cursor-pointer"
                    title="Jump to Current Week"
                  >
                    Today
                  </button>
                )}
                <button
                  onClick={() => setWeekOffset((prev) => prev + 1)}
                  className="p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-current/[0.05] transition-all cursor-pointer"
                  title="Next Week"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-baseline gap-1.5">
                <h2 className="text-xl sm:text-2xl font-bold font-serif-app tracking-tight text-current">
                  {MONTHS[month]}
                </h2>
                <span className="text-lg sm:text-xl font-light font-serif-app opacity-50">
                  {year}
                </span>
              </div>
              <div className="flex items-center gap-0.5 bg-current/[0.03] p-0.5 rounded-xl border border-current/[0.08]">
                <button
                  onClick={() => setCur(new Date(year, month - 1, 1))}
                  className="p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-current/[0.05] transition-all cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {isThisMonth && (
                  <button
                    onClick={scrollToToday}
                    className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-500 opacity-80 hover:opacity-100 transition-all cursor-pointer"
                    title="Center on Today"
                  >
                    Today
                  </button>
                )}
                <button
                  onClick={() => setCur(new Date(year, month + 1, 1))}
                  className="p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-current/[0.05] transition-all cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: View Toggle (Week / Month) & Add Ritual */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Segmented View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-current/[0.04] border border-current/[0.09] text-xs font-mono">
            <button
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'btn-solid-invert font-bold shadow-sm'
                  : 'opacity-50 hover:opacity-90'
              }`}
              title="7-Day Week View (Best for Mobile)"
            >
              <Calendar className="w-3 h-3" />
              <span>Week</span>
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'btn-solid-invert font-bold shadow-sm'
                  : 'opacity-50 hover:opacity-90'
              }`}
              title="Full 30-Day Month Matrix"
            >
              <Layers className="w-3 h-3" />
              <span>Month</span>
            </button>
          </div>

          <button
            onClick={onAddTaskClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn-solid-invert text-xs font-mono font-medium transition-all btn-press cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Add Ritual</span>
          </button>
        </div>
      </div>

      {/* MATRIX TABLE CONTAINER */}
      <div className="glass-card rounded-2xl overflow-hidden border border-current/[0.08]">
        
        {/* ===================== VIEW 1: WEEK VIEW (100% Screen Fit on Mobile) ===================== */}
        {viewMode === 'week' && (
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="border-b border-current/[0.07] bg-current/[0.015]">
                  {/* Sticky Ritual Column Header */}
                  <th className="sticky left-0 z-20 bg-[var(--bg-app)] px-2 sm:px-3 py-2 text-left text-[10px] sm:text-[11px] font-mono uppercase tracking-wider opacity-60 w-[130px] sm:w-[220px] border-r border-current/[0.07]">
                    Ritual
                  </th>

                  {/* 7 Evenly Distributed Day Columns (Guaranteed 100% screen fit) */}
                  {weekDays.map((wd) => {
                    const dayEntry = journal?.[wd.dayKey];
                    return (
                      <th
                        key={wd.dayKey}
                        className={`text-center py-2 px-0.5 border-r border-current/[0.04] transition-colors ${
                          wd.isToday ? 'bg-current/[0.06] font-bold' : ''
                        }`}
                        style={{ width: 'calc((100% - 130px) / 7)' }}
                        title={dayEntry ? `Thought: "${dayEntry.line}" (${dayEntry.mood})` : undefined}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] sm:text-[9px] font-mono opacity-40 uppercase">{wd.wday}</span>
                          <span className={`text-[11px] sm:text-xs font-mono ${wd.isToday ? 'font-extrabold text-current' : 'opacity-65'}`}>
                            {wd.dayNum}
                          </span>
                          {wd.isToday ? (
                            <div className="w-1 h-1 rounded-full bg-current mt-0.5" />
                          ) : dayEntry ? (
                            <div
                              className={`w-1 h-1 rounded-full mt-0.5 ${
                                dayEntry.mood === 'good'
                                  ? 'bg-emerald-500'
                                  : dayEntry.mood === 'bad'
                                  ? 'bg-rose-500'
                                  : 'bg-current opacity-40'
                              }`}
                            />
                          ) : null}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-current/[0.05]">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <p className="font-serif-app italic text-sm opacity-40">No rituals created yet</p>
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => {
                    const s = streak(task);
                    const isDay2Risk = isDay2WarningActive(task, now);
                    const locked = isTaskLocked(task.id, punishments);

                    return (
                      <tr key={task.id} className="group hover:bg-current/[0.015] transition-colors">
                        {/* Sticky Ritual Column: 2-Line Layout for 100% Full Text Visibility */}
                        <td className="sticky left-0 z-10 bg-[var(--bg-app)] px-2 sm:px-3 py-2 border-r border-current/[0.07] w-[130px] sm:w-[220px]">
                          <div className="flex flex-col justify-center min-w-0">
                            
                            {/* Row 1: Color Tag + Full Ritual Name (NO aggressive truncate!) */}
                            <div className="flex items-start gap-1.5 min-w-0">
                              <div
                                className="w-2 h-2 rounded-full shrink-0 mt-1"
                                style={{ backgroundColor: task.colorTag || '#71717a' }}
                              />
                              <span 
                                className="text-[11px] sm:text-xs font-semibold text-current leading-snug break-words"
                                title={task.name}
                              >
                                {task.name}
                              </span>
                            </div>

                            {/* Row 2: Category + Streak + Warning/Lock Badges + Delete */}
                            <div className="flex items-center gap-1.5 pl-3.5 mt-1 flex-wrap">
                              <span className="text-[9px] opacity-40 font-mono">
                                {task.category}
                              </span>

                              {s > 0 && (
                                <span className="flex items-center gap-0.5 text-[9px] font-mono font-bold text-amber-500">
                                  <Flame className="w-2.5 h-2.5 fill-amber-500" />
                                  {s}d
                                </span>
                              )}

                              {locked ? (
                                <span 
                                  className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-rose-500/15 text-[8px] font-mono text-rose-400 font-bold"
                                  title="Ritual Locked by Tribunal Penalty"
                                >
                                  <Lock className="w-2 h-2" />
                                  Locked
                                </span>
                              ) : isDay2Risk ? (
                                <span 
                                  className="inline-flex items-center gap-0.5 text-[8px] font-mono text-rose-500 font-bold bg-rose-500/10 px-1 py-0.2 rounded"
                                  title="Day 2 Risk: Complete today's target to clear warning!"
                                >
                                  <AlertTriangle className="w-2.5 h-2.5" />
                                  Day 2
                                </span>
                              ) : null}

                              <button
                                onClick={() => onDeleteTask(task.id)}
                                title="Delete ritual"
                                className="opacity-30 hover:opacity-100 hover:text-rose-400 transition-all p-0.5 cursor-pointer ml-auto"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            </div>

                          </div>
                        </td>

                        {/* 7 Day Checkboxes */}
                        {weekDays.map((wd) => {
                          const done = task.history?.[wd.dayKey] === 'done';
                          return (
                            <td
                              key={wd.dayKey}
                              className={`p-0.5 sm:p-1 text-center border-r border-current/[0.04] ${
                                wd.isToday ? 'bg-current/[0.03]' : ''
                              }`}
                            >
                              <button
                                onClick={() => handleClick(task, wd.dayKey, wd.isToday)}
                                className={`w-6 h-6 sm:w-7 sm:h-7 mx-auto rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                  locked
                                    ? 'opacity-40 cursor-not-allowed bg-rose-500/10 border border-rose-500/30'
                                    : done
                                    ? 'cell-checked'
                                    : 'cell-unchecked'
                                }`}
                                title={
                                  locked
                                    ? 'Ritual is Locked: Complete punishment in Accountability Tribunal to unlock.'
                                    : `${task.name} (${wd.dayKey}): ${done ? 'Complete' : 'Click to complete'}`
                                }
                              >
                                {locked ? (
                                  <Lock className="w-3 h-3 text-rose-400" />
                                ) : done ? (
                                  <Check className="w-3 h-3" style={{ strokeWidth: 3 }} />
                                ) : null}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ===================== VIEW 2: MONTH VIEW (Full 30-Day Matrix) ===================== */}
        {viewMode === 'month' && (
          <div ref={scrollContainerRef} className="overflow-x-auto touch-pan-x">
            <table className="w-full border-collapse min-w-[780px] sm:min-w-[950px]">
              <thead>
                <tr className="border-b border-current/[0.07] bg-current/[0.015]">
                  <th className="sticky left-0 z-20 bg-[var(--bg-app)] px-2 sm:px-3 py-2.5 text-left text-[11px] font-mono uppercase tracking-wider opacity-60 w-[130px] sm:w-[220px] border-r border-current/[0.07]">
                    Ritual
                  </th>
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const d = i + 1;
                    const wd = WDAYS[new Date(year, month, d).getDay()];
                    const today = isThisMonth && d === todayNum;
                    const dk = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    const dayEntry = journal?.[dk];
                    return (
                      <th
                        key={d}
                        className={`text-center py-2 px-1 min-w-[32px] sm:min-w-[34px] border-r border-current/[0.04] transition-colors ${
                          today ? 'bg-current/[0.06] font-bold' : ''
                        }`}
                        title={dayEntry ? `Thought on ${dk}: "${dayEntry.line}" (${dayEntry.mood})` : undefined}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] font-mono opacity-40 uppercase">{wd}</span>
                          <span className={`text-xs font-mono ${today ? 'font-extrabold text-current' : 'opacity-65'}`}>
                            {d}
                          </span>
                          {today ? (
                            <div className="w-1 h-1 rounded-full bg-current mt-0.5" />
                          ) : dayEntry ? (
                            <div
                              className={`w-1 h-1 rounded-full mt-0.5 ${
                                dayEntry.mood === 'good'
                                  ? 'bg-emerald-500'
                                  : dayEntry.mood === 'bad'
                                  ? 'bg-rose-500'
                                  : 'bg-current opacity-40'
                              }`}
                            />
                          ) : null}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-current/[0.05]">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={daysInMonth + 1} className="py-14 text-center">
                      <p className="font-serif-app italic text-sm opacity-40">No rituals created yet</p>
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => {
                    const s = streak(task);
                    const isDay2Risk = isDay2WarningActive(task, now);
                    const locked = isTaskLocked(task.id, punishments);

                    return (
                      <tr key={task.id} className="group hover:bg-current/[0.015] transition-colors">
                        <td className="sticky left-0 z-10 bg-[var(--bg-app)] px-2 sm:px-3 py-2 border-r border-current/[0.07] w-[130px] sm:w-[220px]">
                          <div className="flex flex-col justify-center min-w-0">
                            
                            {/* Row 1: Color Tag + Full Ritual Name */}
                            <div className="flex items-start gap-1.5 min-w-0">
                              <div
                                className="w-2 h-2 rounded-full shrink-0 mt-1"
                                style={{ backgroundColor: task.colorTag || '#71717a' }}
                              />
                              <span 
                                className="text-[11px] sm:text-xs font-semibold text-current leading-snug break-words"
                                title={task.name}
                              >
                                {task.name}
                              </span>
                            </div>

                            {/* Row 2: Category + Streak + Warning/Lock Badges + Delete */}
                            <div className="flex items-center gap-1.5 pl-3.5 mt-1 flex-wrap">
                              <span className="text-[9px] opacity-40 font-mono">
                                {task.category}
                              </span>

                              {s > 0 && (
                                <span className="flex items-center gap-0.5 text-[9px] font-mono font-bold text-amber-500">
                                  <Flame className="w-2.5 h-2.5 fill-amber-500" />
                                  {s}d
                                </span>
                              )}

                              {locked ? (
                                <span 
                                  className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-rose-500/15 text-[8px] font-mono text-rose-400 font-bold"
                                  title="Ritual Locked by Tribunal Penalty"
                                >
                                  <Lock className="w-2 h-2" />
                                  Locked
                                </span>
                              ) : isDay2Risk ? (
                                <span 
                                  className="inline-flex items-center gap-0.5 text-[8px] font-mono text-rose-500 font-bold bg-rose-500/10 px-1 py-0.2 rounded"
                                  title="Day 2 Risk: Complete today's target to clear warning!"
                                >
                                  <AlertTriangle className="w-2.5 h-2.5" />
                                  Day 2
                                </span>
                              ) : null}

                              <button
                                onClick={() => onDeleteTask(task.id)}
                                title="Delete ritual"
                                className="opacity-30 hover:opacity-100 hover:text-rose-400 transition-all p-0.5 cursor-pointer ml-auto"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            </div>

                          </div>
                        </td>

                        {Array.from({ length: daysInMonth }, (_, i) => {
                          const d = i + 1;
                          const dk = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                          const done = task.history?.[dk] === 'done';
                          const today = isThisMonth && d === todayNum;

                          return (
                            <td
                              key={dk}
                              className={`p-1 text-center border-r border-current/[0.04] ${
                                today ? 'bg-current/[0.03]' : ''
                              }`}
                            >
                              <button
                                onClick={() => handleClick(task, dk, today)}
                                className={`w-6 h-6 sm:w-7 sm:h-7 mx-auto rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                  locked
                                    ? 'opacity-40 cursor-not-allowed bg-rose-500/10 border border-rose-500/30'
                                    : done
                                    ? 'cell-checked'
                                    : 'cell-unchecked'
                                }`}
                                title={
                                  locked
                                    ? 'Ritual is Locked: Complete punishment in Accountability Tribunal to unlock.'
                                    : `${task.name} (${dk}): ${done ? 'Complete' : 'Click to complete'}`
                                }
                              >
                                {locked ? (
                                  <Lock className="w-3 h-3 text-rose-400" />
                                ) : done ? (
                                  <Check className="w-3.5 h-3.5" style={{ strokeWidth: 3 }} />
                                ) : null}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* RITUAL LOCKED POPUP MODAL */}
      {lockedModal.isOpen && lockedModal.task && lockedModal.penalty && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/65 backdrop-blur-md page-enter">
          <div 
            className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-7 space-y-4 bg-[var(--bg-app)] text-[var(--text-main)] border border-rose-500/30 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLockedModal({ isOpen: false, task: null, penalty: null })}
              className="absolute top-4 right-4 p-1.5 rounded-xl opacity-50 hover:opacity-100 hover:bg-current/[0.05] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif-app text-current">Ritual Locked</h3>
                <p className="text-[11px] font-mono opacity-50">2-Day Consecutive Breach Penalty Active</p>
              </div>
            </div>

            <p className="text-xs font-serif-app italic opacity-85 leading-relaxed">
              You missed <strong className="text-current not-italic font-mono">"{lockedModal.task.name}"</strong> for 2 consecutive days ({lockedModal.penalty.missedDates.join(', ')}). Under the Chrono discipline protocol, this ritual is frozen until your penalty is served.
            </p>

            <div className="p-3.5 rounded-xl bg-current/[0.03] border border-current/[0.08] text-xs font-serif-app italic text-rose-400 leading-relaxed">
              "{lockedModal.penalty.punishmentText}"
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 flex-wrap">
              <button
                onClick={() => setLockedModal({ isOpen: false, task: null, penalty: null })}
                className="px-3 py-1.5 rounded-xl glass-card text-xs font-mono opacity-70 hover:opacity-100 transition-all cursor-pointer"
              >
                Close
              </button>

              {onOpenResetModal && (
                <button
                  onClick={() => {
                    setLockedModal({ isOpen: false, task: null, penalty: null });
                    onOpenResetModal();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-medium hover:bg-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                  title="Returned after a break? Pardon all penalties and restart fresh today"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Fresh Start Today</span>
                </button>
              )}

              {onNavigateToTribunal && (
                <button
                  onClick={() => {
                    setLockedModal({ isOpen: false, task: null, penalty: null });
                    onNavigateToTribunal();
                  }}
                  className="px-4 py-1.5 rounded-xl btn-solid-invert text-xs font-mono font-medium transition-all btn-press cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3" />
                  <span>Go to Tribunal</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
