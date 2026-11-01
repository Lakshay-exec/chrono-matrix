import { useState, useEffect } from 'react';
import type { DailyJournalEntry } from '../types';
import { Check, Calendar, BookOpen, RotateCcw } from 'lucide-react';
import { JournalHistoryModal } from './JournalHistoryModal';

interface DailyReflectionBarProps {
  journal: Record<string, DailyJournalEntry>;
  onSaveEntry: (entry: DailyJournalEntry) => void;
  onDeleteEntry?: (date: string) => void;
}

export const DailyReflectionBar: React.FC<DailyReflectionBarProps> = ({
  journal,
  onSaveEntry,
  onDeleteEntry,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [line, setLine] = useState('');
  const [mood, setMood] = useState<'good' | 'bad' | 'neutral'>('neutral');
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const isViewingPast = selectedDate !== todayStr;
  const pastCount = Object.keys(journal).length;

  useEffect(() => {
    const existing = journal[selectedDate];
    if (existing) {
      setLine(existing.line);
      setMood(existing.mood);
    } else {
      setLine('');
      setMood('neutral');
    }
  }, [selectedDate, journal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!line.trim()) return;

    onSaveEntry({
      date: selectedDate,
      line: line.trim(),
      mood,
    });

    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  return (
    <>
      <div className="w-full">
        <div className="glass-card line-box-float rounded-2xl px-3 sm:px-4 py-2 transition-all">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            
            {/* Row 1 on Mobile / Left side on Desktop: Date + Mood + History */}
            <div className="flex items-center justify-between sm:justify-start gap-1.5 flex-wrap">
              {/* Dedicated Date Selector Pill */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-current/[0.04] border border-current/[0.1] shrink-0">
                <Calendar className="w-3.5 h-3.5 opacity-60" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  title="Select any date to check or write its daily thought"
                  className="bg-transparent text-[11px] sm:text-xs font-mono font-semibold text-current focus:outline-none cursor-pointer"
                />
                {isViewingPast && (
                  <button
                    type="button"
                    onClick={() => setSelectedDate(todayStr)}
                    title="Jump back to Today"
                    className="p-0.5 rounded hover:bg-current/[0.1] opacity-60 hover:opacity-100 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Minimalist Mood Selector */}
              <div className="flex items-center gap-0.5 bg-current/[0.03] p-0.5 rounded-xl border border-current/[0.08] shrink-0">
                <button
                  type="button"
                  onClick={() => setMood('good')}
                  title="Good (Growth / Discipline)"
                  className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg text-[11px] sm:text-xs font-mono transition-all cursor-pointer ${
                    mood === 'good'
                      ? 'btn-solid-invert font-bold shadow-sm'
                      : 'opacity-50 hover:opacity-90'
                  }`}
                >
                  <span className="text-[10px]">▲</span>
                  <span className="hidden xs:inline">Ascending</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMood('neutral')}
                  title="Steady (Balanced)"
                  className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg text-[11px] sm:text-xs font-mono transition-all cursor-pointer ${
                    mood === 'neutral'
                      ? 'btn-solid-invert font-bold shadow-sm'
                      : 'opacity-50 hover:opacity-90'
                  }`}
                >
                  <span className="text-[10px]">●</span>
                  <span className="hidden xs:inline">Steady</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMood('bad')}
                  title="Heavy (Missed / Struggled)"
                  className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg text-[11px] sm:text-xs font-mono transition-all cursor-pointer ${
                    mood === 'bad'
                      ? 'btn-solid-invert font-bold shadow-sm'
                      : 'opacity-50 hover:opacity-90'
                  }`}
                >
                  <span className="text-[10px]">▼</span>
                  <span className="hidden xs:inline">Heavy</span>
                </button>
              </div>

              {/* History button on mobile */}
              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="px-2 py-1 rounded-xl bg-current/[0.04] hover:bg-current/[0.08] border border-current/[0.08] text-[11px] font-mono opacity-65 hover:opacity-100 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                title="Select date to check or browse past thoughts"
              >
                <BookOpen className="w-3 h-3" />
                <span>({pastCount})</span>
              </button>
            </div>

            {/* Row 2 on Mobile / Center & Right on Desktop: Text Input + Save Button */}
            <div className="flex items-center gap-1.5 flex-1 w-full min-w-0">
              <input
                type="text"
                value={line}
                onChange={(e) => setLine(e.target.value)}
                placeholder={isViewingPast ? `Thought for ${selectedDate}...` : "One line about today..."}
                className="flex-1 min-w-0 bg-transparent px-2 py-1 text-xs sm:text-sm text-current placeholder-current/35 focus:outline-none font-serif-app italic tracking-wide"
              />

              <button
                type="submit"
                className="px-3 py-1 rounded-xl btn-solid-invert text-xs font-mono font-medium transition-all btn-press flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSavedRecently ? 'Saved' : 'Save'}</span>
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Full Past Reflections Modal */}
      <JournalHistoryModal
        journal={journal}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectDate={(dt) => setSelectedDate(dt)}
        onDeleteEntry={onDeleteEntry}
      />
    </>
  );
};
