import { useState } from 'react';
import type { Task, PunishmentRecord } from '../types';
import { generateAIPunishment } from '../services/gemini';
import { ShieldAlert, Sparkles, X, Loader2, Check, RefreshCw, CheckCircle2 } from 'lucide-react';

interface PunishmentModalProps {
  tasks: Task[];
  initialTask?: Task | null;
  initialMissedDates?: string[];
  onClose: () => void;
  onAssignPunishment: (record: PunishmentRecord) => void;
}

export const PunishmentModal: React.FC<PunishmentModalProps> = ({
  tasks, initialTask, initialMissedDates, onClose, onAssignPunishment,
}) => {
  const [selectedId, setSelectedId] = useState(initialTask?.id || tasks[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState('');
  const selected = tasks.find((t) => t.id === selectedId);

  const defaultDates = initialMissedDates || [
    new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    new Date(Date.now() - 86400000).toISOString().split('T')[0],
  ];

  const generate = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const result = await generateAIPunishment({
        taskName: selected.name, category: selected.category, missedDates: defaultDates,
      });
      setVerdict(result);
    } catch {
      setVerdict(`50 pushups and 2 hours of deep work for missing ${selected.name}.`);
    } finally {
      setLoading(false);
    }
  };

  const accept = () => {
    if (!selected || !verdict) return;
    onAssignPunishment({
      id: 'punish-' + Date.now(),
      taskId: selected.id,
      taskName: selected.name,
      missedDates: defaultDates,
      punishmentText: verdict,
      assignedAt: new Date().toISOString(),
      served: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md page-enter">
      <div 
        className="w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 relative space-y-5 bg-[var(--bg-app)] text-[var(--text-main)] border border-current/[0.1] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl opacity-50 hover:opacity-100 hover:bg-current/[0.05] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-current/[0.04] border border-current/[0.08]">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif-app text-current">Disciplinary Council</h3>
            <p className="text-[11px] font-mono opacity-50 mt-0.5">Accountability protocol for streak breaches</p>
          </div>
        </div>

        {/* Task Selection with 100% Visible Custom Cards */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] font-mono uppercase tracking-[0.1em] opacity-60">
              Select Offending Habit
            </label>
            <span className="text-[10px] font-mono opacity-40">
              Missed: {defaultDates.join(' & ')}
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-current/20 text-center text-xs font-mono opacity-50">
              No tasks currently tracked. Create a task in the matrix first.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {tasks.map((t) => {
                const isChosen = t.id === selectedId;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedId(t.id);
                      setVerdict('');
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isChosen
                        ? 'border-current/40 bg-current/[0.08] shadow-sm'
                        : 'border-current/[0.07] bg-current/[0.02] hover:bg-current/[0.05] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: t.colorTag || '#71717a' }}
                      />
                      <span className="text-sm font-semibold text-current truncate">
                        {t.name}
                      </span>
                      <span className="text-[10px] font-mono opacity-50 px-1.5 py-0.5 rounded bg-current/[0.05]">
                        {t.category}
                      </span>
                    </div>

                    {isChosen ? (
                      <CheckCircle2 className="w-4 h-4 text-current shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-current/20 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Verdict or Generate */}
        <div>
          {verdict ? (
            <div className="space-y-3.5">
              <span className="text-[10px] font-mono uppercase tracking-wider opacity-60 font-semibold block">
                Disciplinary Mandate
              </span>
              <div className="p-4 rounded-2xl bg-current/[0.03] border border-current/[0.08] text-sm sm:text-base text-current font-serif-app italic leading-relaxed">
                "{verdict}"
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={generate}
                  disabled={loading}
                  className="flex-1 py-2.5 px-3 rounded-xl glass-card text-xs font-mono font-medium opacity-80 hover:opacity-100 glass-card-hover transition-all btn-press flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reroll</span>
                </button>
                <button
                  onClick={accept}
                  className="flex-1 py-2.5 px-4 rounded-xl btn-solid-invert font-semibold text-xs font-mono transition-all btn-press shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept Penalty</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-2 space-y-3">
              <button
                onClick={generate}
                disabled={loading || !selected}
                className="w-full py-2.5 px-4 rounded-2xl btn-solid-invert font-semibold text-xs font-mono transition-all btn-press shadow-md flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Consulting AI Warden...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Penalty for {selected ? selected.name : 'Task'}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
