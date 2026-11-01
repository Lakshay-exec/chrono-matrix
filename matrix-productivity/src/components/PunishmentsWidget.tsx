import type { PunishmentRecord } from '../types';
import { CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

interface PunishmentsWidgetProps {
  punishments: PunishmentRecord[];
  onMarkServed: (id: string) => void;
}

export const PunishmentsWidget: React.FC<PunishmentsWidgetProps> = ({
  punishments,
  onMarkServed,
}) => {
  const pending = punishments.filter((p) => !p.served);
  const served = punishments.filter((p) => p.served);

  return (
    <div className="w-full space-y-4 page-enter">
      {/* Header (No manual add button — purely automated disciplinary tribunal) */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-app tracking-tight text-current">
            Accountability Tribunal
          </h2>
          <p className="text-[11px] font-mono opacity-50 mt-0.5">
            Automatic disciplinary sanctions triggered upon 2-day ritual breaches
          </p>
        </div>
      </div>

      {/* Active Penalties */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider opacity-60">Active Strikes</span>
          {pending.length > 0 ? (
            <span className="px-2 py-0.5 rounded-md bg-rose-500/15 text-[10px] font-mono font-bold text-rose-400 border border-rose-500/25">
              {pending.length} Ritual{pending.length > 1 ? 's' : ''} Frozen
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/25">
              All Clear
            </span>
          )}
        </div>

        {pending.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 sm:p-8 text-center border border-current/[0.08] space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto opacity-80" />
            <h4 className="font-serif-app font-semibold text-base text-current">Sovereign Discipline Intact</h4>
            <p className="font-serif-app italic text-xs opacity-50 max-w-sm mx-auto">
              No 2-day breaches detected. Keep maintaining consistency every day to prevent your rituals from being locked.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pending.map((p) => (
              <div
                key={p.id}
                className="glass-card rounded-2xl p-4 sm:p-5 space-y-3 border-l-2 border-l-rose-500 border-current/[0.08] relative"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-rose-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    2-Day Breach Penalty
                  </span>
                  <span className="opacity-50">{p.assignedAt.split('T')[0]}</span>
                </div>

                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-current font-serif-app">
                    {p.taskName}
                  </h4>
                  <p className="text-[10px] font-mono opacity-50 mt-0.5">
                    Missed Dates: {p.missedDates.join(', ')}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-current/[0.03] border border-current/[0.08] text-xs font-serif-app italic leading-relaxed text-current/90">
                  "{p.punishmentText}"
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-current/[0.06]">
                  <span className="text-[10px] font-mono opacity-40">
                    Task is locked until served
                  </span>
                  <button
                    onClick={() => onMarkServed(p.id)}
                    className="px-3 py-1.5 rounded-xl btn-solid-invert font-mono text-xs font-medium transition-all btn-press flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Served & Unlock</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolved Penalties History */}
      {served.length > 0 && (
        <div className="space-y-2 pt-4">
          <span className="text-xs font-mono uppercase tracking-wider opacity-40">
            Served Penalties History ({served.length})
          </span>
          <div className="space-y-2">
            {served.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="glass-card rounded-xl p-3 flex items-center justify-between text-xs font-mono opacity-55 hover:opacity-85 transition-opacity"
              >
                <div className="truncate pr-4">
                  <span className="font-bold text-current">{p.taskName}</span>
                  <span className="opacity-60 ml-2 italic text-[11px] font-serif-app">
                    "{p.punishmentText.slice(0, 50)}..."
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 shrink-0 font-bold">
                  ✓ Served
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
