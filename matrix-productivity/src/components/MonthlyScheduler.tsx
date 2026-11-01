import { useState } from 'react';
import type { Task, DailyJournalEntry } from '../types';
import { ChevronLeft, ChevronRight, Plus, Trash2, Check, Flame, AlertTriangle } from 'lucide-react';
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
const WDAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

export const MonthlyScheduler: React.FC<MonthlySchedulerProps> = ({
  tasks, journal, onToggleCell, onAddTaskClick, onDeleteTask, onTriggerPunishment, potatoMode,
}) => {
  const [cur, setCur] = useState(new Date());
  const year = cur.getFullYear();
  const month = cur.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const now = new Date();
  const isThisMonth = now.getFullYear() === year && now.getMonth() === month;
  const todayNum = now.getDate();

  const handleClick = (taskId: string, dayKey: string, dayNum: number) => {
    onToggleCell(taskId, dayKey);
    if (isThisMonth && dayNum === todayNum && !potatoMode) {
      setTimeout(() => {
        try { confetti({ particleCount: 30, spread: 50, origin: { y: 0.85 }, colors: ['#ffffff','#a1a1aa','#52525b'] }); } catch {}
      }, 50);
    }
  };

  const streak = (task: Task) => {
    let s = 0;
    const d = new Date();
    const todayK = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (task.history?.[todayK]==='done') { s++; d.setDate(d.getDate()-1); } else d.setDate(d.getDate()-1);
    for (let i=0;i<90;i++){
      const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if(task.history?.[k]==='done'){s++;d.setDate(d.getDate()-1);}else break;
    }
    return s;
  };

  const breach = (task: Task): string[]|null => {
    const y1=new Date(); y1.setDate(y1.getDate()-1);
    const y2=new Date(); y2.setDate(y2.getDate()-2);
    const fmt=(dt:Date)=>`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
    const k1=fmt(y2),k2=fmt(y1);
    return (!task.history?.[k1] || task.history[k1]!=='done') && (!task.history?.[k2] || task.history[k2]!=='done') ? [k1,k2] : null;
  };

  return (
    <div className="w-full space-y-4 page-enter">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-app tracking-tight text-current">
              {MONTHS[month]}
            </h2>
            <span className="text-xl sm:text-2xl font-light font-serif-app opacity-50">
              {year}
            </span>
          </div>

          <div className="flex items-center gap-0.5 bg-current/[0.03] p-0.5 rounded-xl border border-current/[0.08]">
            <button 
              onClick={()=>setCur(new Date(year,month-1,1))} 
              className="p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-current/[0.05] transition-all"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4"/>
            </button>
            <button 
              onClick={()=>setCur(new Date(year,month+1,1))} 
              className="p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-current/[0.05] transition-all"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4"/>
            </button>
          </div>
        </div>

        <button
          onClick={onAddTaskClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl btn-solid-invert text-xs font-mono font-medium transition-all btn-press self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5"/>
          <span>Add Ritual</span>
        </button>
      </div>

      {/* Minimal Matrix Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-current/[0.08]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-current/[0.07] bg-current/[0.015]">
                <th className="sticky left-0 z-20 bg-[var(--bg-app)] px-4 py-3 text-left
                  text-[11px] font-mono uppercase tracking-wider opacity-60 w-64 border-r border-current/[0.07]">
                  Ritual
                </th>
                {Array.from({length:days},(_,i)=>{
                  const d=i+1;
                  const wd=WDAYS[new Date(year,month,d).getDay()];
                  const today=isThisMonth && d===todayNum;
                  const dk=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                  const dayEntry = journal?.[dk];
                  return(
                    <th key={d} className={`text-center py-2 px-1 min-w-[32px] border-r border-current/[0.04]
                      transition-colors ${today?'bg-current/[0.06] font-bold':''}`}
                      title={dayEntry ? `Thought on ${dk}: "${dayEntry.line}" (${dayEntry.mood})` : undefined}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-mono opacity-40 uppercase">{wd}</span>
                        <span className={`text-xs font-mono ${today?'font-extrabold text-current':'opacity-65'}`}>
                          {d}
                        </span>
                        {today ? (
                          <div className="w-1 h-1 rounded-full bg-current mt-0.5"/>
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
              {tasks.length===0?(
                <tr>
                  <td colSpan={days+1} className="py-14 text-center">
                    <p className="font-serif-app italic text-sm opacity-40">No rituals created yet</p>
                  </td>
                </tr>
              ):(
                tasks.map((task)=>{
                  const s=streak(task);
                  const bd=breach(task);
                  return(
                    <tr key={task.id} className="group hover:bg-current/[0.015] transition-colors">
                      <td className="sticky left-0 z-10 bg-[var(--bg-app)] px-4 py-2.5 border-r border-current/[0.07]">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 truncate">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{backgroundColor:task.colorTag||'#71717a'}}/>
                            <div className="truncate">
                              <span className="text-xs sm:text-sm font-semibold text-current truncate block">
                                {task.name}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] opacity-50 font-mono">
                                  {task.category}
                                </span>
                                {s>0&&(
                                  <span className="flex items-center gap-0.5 text-[10px] font-mono font-bold text-amber-500">
                                    <Flame className="w-2.5 h-2.5 fill-amber-500"/>
                                    {s}d
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {bd&&(
                              <button onClick={()=>onTriggerPunishment(task,bd)} title="2-day breach warning"
                                className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-all">
                                <AlertTriangle className="w-3.5 h-3.5"/>
                              </button>
                            )}
                            <button onClick={()=>onDeleteTask(task.id)} title="Delete ritual"
                              className="p-1 rounded-lg opacity-40 hover:opacity-100 hover:text-rose-400 transition-all">
                              <Trash2 className="w-3.5 h-3.5"/>
                            </button>
                          </div>
                        </div>
                      </td>
                      {Array.from({length:days},(_,i)=>{
                        const d=i+1;
                        const dk=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                        const done = task.history?.[dk] === 'done';
                        const today = isThisMonth && d === todayNum;
                        return(
                          <td key={dk} className={`p-1 text-center border-r border-current/[0.04] ${today?'bg-current/[0.03]':''}`}>
                            <button
                              onClick={()=>handleClick(task.id,dk,d)}
                              className={`w-6 h-6 sm:w-7 sm:h-7 mx-auto rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                done ? 'cell-checked' : 'cell-unchecked'
                              }`}
                              title={`${task.name} (${dk}): ${done ? 'Complete' : 'Click to complete'}`}
                            >
                              {done && (
                                <Check 
                                  className="w-3.5 h-3.5" 
                                  style={{ strokeWidth: 3 }}
                                />
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
      </div>
    </div>
  );
};
