import { useState, useMemo } from 'react';
import type { DailyJournalEntry } from '../types';
import { X, Search, Calendar, Trash2, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface JournalHistoryModalProps {
  journal: Record<string, DailyJournalEntry>;
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  onDeleteEntry?: (date: string) => void;
}

export const JournalHistoryModal: React.FC<JournalHistoryModalProps> = ({
  journal,
  isOpen,
  onClose,
  onSelectDate,
  onDeleteEntry,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [inspectDate, setInspectDate] = useState(todayStr);
  const [filterMood, setFilterMood] = useState<'all' | 'good' | 'neutral' | 'bad'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const entriesList = useMemo(() => {
    return Object.values(journal).sort((a, b) => b.date.localeCompare(a.date));
  }, [journal]);

  const inspectEntry = journal[inspectDate];

  const filteredEntries = useMemo(() => {
    return entriesList.filter((entry) => {
      if (filterMood !== 'all' && entry.mood !== filterMood) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return entry.line.toLowerCase().includes(q) || entry.date.includes(q);
      }
      return true;
    });
  }, [entriesList, filterMood, searchQuery]);

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      const today = new Date();
      const isToday = today.toISOString().split('T')[0] === dateStr;
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = yesterday.toISOString().split('T')[0] === dateStr;

      if (isToday) return 'Today · ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      if (isYesterday) return 'Yesterday · ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md page-enter">
      <div 
        className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl glass-card border border-current/[0.1] shadow-2xl overflow-hidden bg-[var(--bg-app)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-current/[0.08] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-current/[0.04]">
              <Calendar className="w-4 h-4 opacity-70" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif-app text-current">Check Saved Thoughts & History</h3>
              <p className="text-[11px] font-mono opacity-50">{entriesList.length} recorded daily reflections</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl opacity-50 hover:opacity-100 hover:bg-current/[0.05] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. SELECT SPECIFIC DATE TO CHECK */}
        <div className="p-4 sm:p-5 border-b border-current/[0.08] bg-current/[0.02] space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Select Date to Check</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setInspectDate(todayStr)}
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-current/[0.05] hover:bg-current/[0.1] transition-all cursor-pointer"
              >
                Today
              </button>
              <button
                onClick={() => {
                  const y = new Date();
                  y.setDate(y.getDate() - 1);
                  setInspectDate(y.toISOString().split('T')[0]);
                }}
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-current/[0.05] hover:bg-current/[0.1] transition-all cursor-pointer"
              >
                Yesterday
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            <input
              type="date"
              value={inspectDate}
              onChange={(e) => setInspectDate(e.target.value)}
              className="bg-current/[0.04] border border-current/[0.12] rounded-xl px-3 py-1.5 text-xs font-mono font-semibold text-current focus:outline-none cursor-pointer"
            />
            <span className="text-xs font-mono opacity-60">
              {inspectEntry ? '✓ Saved thought found for this date' : 'No reflection saved for this date'}
            </span>
          </div>

          {/* Result Card for the Selected Date */}
          {inspectEntry ? (
            <div className="glass-card rounded-2xl p-3.5 border border-current/[0.12] bg-current/[0.025] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-current">{formatDate(inspectEntry.date)}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                      inspectEntry.mood === 'good'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : inspectEntry.mood === 'bad'
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        : 'bg-current/[0.05] text-current opacity-70 border-current/15'
                    }`}
                  >
                    {inspectEntry.mood === 'good' ? '▲ Ascending' : inspectEntry.mood === 'bad' ? '▼ Heavy' : '● Steady'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onSelectDate(inspectEntry.date);
                    onClose();
                  }}
                  className="px-3 py-1 rounded-lg btn-solid-invert text-xs font-mono font-medium flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Load in Bar</span>
                </button>
              </div>
              <p className="text-sm font-serif-app italic text-current tracking-wide">
                "{inspectEntry.line}"
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-current/[0.02] border border-current/[0.06] flex items-center justify-between">
              <p className="text-xs font-serif-app italic opacity-50">
                No reflection recorded for {formatDate(inspectDate)}.
              </p>
              <button
                onClick={() => {
                  onSelectDate(inspectDate);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg btn-solid-invert text-xs font-mono cursor-pointer"
              >
                Write for this date
              </button>
            </div>
          )}
        </div>

        {/* 2. ALL PAST REFLECTIONS LIST HEADER & FILTERS */}
        <div className="px-6 py-3 border-b border-current/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 bg-current/[0.015]">
          {/* Mood Filter Pills */}
          <div className="flex items-center gap-1 bg-current/[0.03] p-0.5 rounded-xl border border-current/[0.07] shrink-0 text-xs font-mono">
            <button
              onClick={() => setFilterMood('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filterMood === 'all' ? 'btn-solid-invert font-semibold' : 'opacity-50 hover:opacity-90'
              }`}
            >
              All ({entriesList.length})
            </button>
            <button
              onClick={() => setFilterMood('good')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                filterMood === 'good' ? 'btn-solid-invert font-semibold' : 'opacity-50 hover:opacity-90'
              }`}
            >
              ▲ Ascending
            </button>
            <button
              onClick={() => setFilterMood('neutral')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                filterMood === 'neutral' ? 'btn-solid-invert font-semibold' : 'opacity-50 hover:opacity-90'
              }`}
            >
              ● Steady
            </button>
            <button
              onClick={() => setFilterMood('bad')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                filterMood === 'bad' ? 'btn-solid-invert font-semibold' : 'opacity-50 hover:opacity-90'
              }`}
            >
              ▼ Heavy
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search thoughts..."
              className="w-full bg-current/[0.03] border border-current/[0.08] rounded-xl pl-8 pr-3 py-1 text-xs font-mono text-current placeholder-current/35 focus:outline-none"
            />
          </div>
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredEntries.length === 0 ? (
            <div className="py-12 text-center space-y-1">
              <p className="font-serif-app italic text-base opacity-40">
                {entriesList.length === 0 ? 'No thoughts saved yet' : 'No matching entries found'}
              </p>
              <p className="text-xs font-mono opacity-30">
                {entriesList.length === 0 ? 'Type a line in the reflection bar and hit Save.' : 'Try clearing your search query or mood filter.'}
              </p>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const isGood = entry.mood === 'good';
              const isBad = entry.mood === 'bad';
              return (
                <div
                  key={entry.date}
                  className="glass-card rounded-2xl p-4 border border-current/[0.08] glass-card-hover transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono opacity-50 font-medium">
                        {formatDate(entry.date)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                          isGood
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : isBad
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                            : 'bg-current/[0.05] text-current opacity-70 border-current/15'
                        }`}
                      >
                        {isGood ? '▲ Ascending' : isBad ? '▼ Heavy' : '● Steady'}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base font-serif-app italic text-current tracking-wide">
                      "{entry.line}"
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        onSelectDate(entry.date);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg btn-solid-invert text-xs font-mono transition-all flex items-center gap-1 cursor-pointer"
                      title="Open and edit this date in the top bar"
                    >
                      <span>Load in Bar</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>

                    {onDeleteEntry && (
                      <button
                        onClick={() => onDeleteEntry(entry.date)}
                        className="p-1 rounded-lg opacity-40 hover:opacity-100 hover:text-rose-400 transition-all cursor-pointer"
                        title="Delete this reflection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
