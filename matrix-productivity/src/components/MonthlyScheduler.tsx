import { useState, useRef, useEffect } from 'react';
import type { Task, DailyJournalEntry } from '../types';
import { ChevronLeft, ChevronRight, Plus, Trash2, Check, Flame, AlertTriangle, Calendar, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MonthlySchedulerProps {
  tasks: Task[];
  journal?: Record<string, DailyJournalEntry>;
  onToggleCell: (taskId: string, dayKey: string) => void;
  onAddTaskClick: () => void;
  onDeleteTask: (taskId: string) => void;
  onTriggerPunishment: (task: Task, missedDates: string[]) => void;
  potatoMode: boolean;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WDAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

export const MonthlyScheduler: React.FC<MonthlySchedulerProps> = ({
  tasks, journal, onToggleCell, onAddTaskClick, onDeleteTask, onTriggerPunishment, potatoMode,
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

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to today in Month View on mount or when switching
  const scrollToToday = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const colWidth = 36;
    const stickyWidth = window.innerWidth < 640 ? 112 : 220;
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

  // Handle cell click
  const handleClick = (taskId: string, dayKey: string, isTodayCell: boolean) => {
    onToggleCell(taskId, dayKey);
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

  // 2-Day breach warning
  const breach = (task: Task): string[]|null => {
    const y1 = new Date(); y1.setDate(y1.getDate()-1);
    const y2 = new Date(); y2.setDate(y2.getDate()-2);
    const fmt = (dt: Date) => `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
    const k1 = fmt(y2), k2 = fmt(y1);
    return (!task.history?.[k1] || task.history[k1] !== 'done') && (!task.history?.[k2] || task.history[k2] !== 'done') ? [k1, k2] : null;
  };

  // Calculate 7-day window for Week View
  const weekDays = (() => {
    const base = new Date();
    // Start of week: Monday (or adjust with weekOffset)
    const dayOfWeek = base.getDay(); // 0 is Sunday, 1 is Monday...
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
        
        {/* ===================== VIEW 1: WEEK VIEW (Optimized for Mobile) ===================== */}
        {viewMode === 'week' && (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-current/[0.07] bg-current/[0.015]">
                  <th className="sticky left-0 z-20 bg-[var(--bg-app)] px-3 py-2.5 text-left text-[11px] font-mono uppercase tracking-wider opacity-60 w-32 sm:w-56 border-r border-current/[0.07]">
                    Ritual
                  </th>
                  {weekDays.map((wd) => {
                    const dayEntry = journal?.[wd.dayKey];
                    return (
                      <th
                        key={wd.dayKey}
                        className={`text-center py-2 px-1 border-r border-current/[0.04] transition-colors ${
                          wd.isToday ? 'bg-current/[0.06] font-bold' : ''
                        }`}
                        title={dayEntry ? `Thought: "${dayEntry.line}" (${dayEntry.mood})` : undefined}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] font-mono opacity-40 uppercase">{wd.wday}</span>
                          <span className={`text-xs font-mono ${wd.isToday ? 'font-extrabold text-current' : 'opacity-65'}`}>
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
                    const bd = breach(task);
                    return (
                      <tr key={task.id} className="group hover:bg-current/[0.015] transition-colors">
                        {/* Sticky Left Column: Ritual Title & Badges */}
                        <td className="sticky left-0 z-10 bg-[var(--bg-app)] px-3 py-2 border-r border-current/[0.07] max-w-[130px] sm:max-w-none">
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-2 truncate">
                              <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: task.colorTag || '#71717a' }}
                              />
                              <div className="truncate">
                                <span className="text-xs sm:text-sm font-semibold text-current truncate block">
                                  {task.name}
                                </span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[9px] sm:text-[10px] opacity-40 font-mono truncate">
                                    {task.category}
                                  </span>
                                  {s > 0 && (
                                    <span className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-mono font-bold text-amber-500 shrink-0">
                                      <Flame className="w-2.5 h-2.5 fill-amber-500" />
                                      {s}d
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5 opacity-40 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              {bd && (
                                <button
                                  onClick={() => onTriggerPunishment(task, bd)}
                                  title="2-day breach warning"
                                  className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                                >
                                  <AlertTriangle className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                onClick={() => onDeleteTask(task.id)}
                                title="Delete ritual"
                                className="p-1 rounded-lg hover:text-rose-400 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* 7 Days of the Week */}
                        {weekDays.map((wd) => {
                          const done = task.history?.[wd.dayKey] === 'done';
                          return (
                            <td
                              key={wd.dayKey}
                              className={`p-1 text-center border-r border-current/[0.04] ${
                                wd.isToday ? 'bg-current/[0.03]' : ''
                              }`}
                            >
                              <button
                                onClick={() => handleClick(task.id, wd.dayKey, wd.isToday)}
                                className={`w-7 h-7 sm:w-8 sm:h-8 mx-auto rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                  done ? 'cell-checked' : 'cell-unchecked'
                                }`}
                                title={`${task.name} (${wd.dayKey}): ${done ? 'Complete' : 'Click to complete'}`}
                              >
                                {done && (
                                  <Check className="w-3.5 h-3.5" style={{ strokeWidth: 3 }} />
                                )}
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
                  <th className="sticky left-0 z-20 bg-[var(--bg-app)] px-3 py-2.5 text-left text-[11px] font-mono uppercase tracking-wider opacity-60 w-28 sm:w-56 border-r border-current/[0.07]">
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
                    const bd = breach(task);
                    return (
                      <tr key={task.id} className="group hover:bg-current/[0.015] transition-colors">
                        <td className="sticky left-0 z-10 bg-[var(--bg-app)] px-3 py-2 border-r border-current/[0.07] max-w-[112px] sm:max-w-none">
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-2 truncate">
                              <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: task.colorTag || '#71717a' }}
                              />
                              <div className="truncate">
                                <span className="text-xs sm:text-sm font-semibold text-current truncate block">
                                  {task.name}
                                </span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[9px] sm:text-[10px] opacity-40 font-mono truncate">
                                    {task.category}
                                  </span>
                                  {s > 0 && (
                                    <span className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-mono font-bold text-amber-500 shrink-0">
                                      <Flame className="w-2.5 h-2.5 fill-amber-500" />
                                      {s}d
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5 opacity-40 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              {bd && (
                                <button
                                  onClick={() => onTriggerPunishment(task, bd)}
                                  title="2-day breach warning"
                                  className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                                >
                                  <AlertTriangle className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                onClick={() => onDeleteTask(task.id)}
                                title="Delete ritual"
                                className="p-1 rounded-lg hover:text-rose-400 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
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
                                onClick={() => handleClick(task.id, dk, today)}
                                className={`w-6 h-6 sm:w-7 sm:h-7 mx-auto rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                  done ? 'cell-checked' : 'cell-unchecked'
                                }`}
                                title={`${task.name} (${dk}): ${done ? 'Complete' : 'Click to complete'}`}
                              >
                                {done && (
                                  <Check className="w-3.5 h-3.5" style={{ strokeWidth: 3 }} />
                                )}
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
    </div>
  );
};
