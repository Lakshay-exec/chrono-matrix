import type { PunishmentRecord } from '../types';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface PunishmentsWidgetProps {
  punishments: PunishmentRecord[];
  onMarkServed: (id: string) => void;
  onOpenTriggerModal: () => void;
}

export const PunishmentsWidget: React.FC<PunishmentsWidgetProps> = ({
  punishments, onMarkServed, onOpenTriggerModal,
}) => {
  const pending = punishments.filter((p) => !p.served);
  const served = punishments.filter((p) => p.served);

  return (
    <div className="w-full space-y-4 page-enter">
      {/* Minimal Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-serif-app tracking-tight text-current">
          Accountability Tribunal
        </h2>
        <button
          onClick={onOpenTriggerModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn-solid-invert text-xs font-mono font-medium transition-all btn-press cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Summon Council</span>
        </button>
      </div>

      {/* Active Penalties */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider opacity-60">Strikes</span>
          {pending.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-rose-500/15 text-[10px] font-mono font-bold text-rose-400 border border-rose-500/25">
              {pending.length} Unresolved
            </span>
          )}
        </div>

        {pending.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 text-center border border-current/[0.08]">
            <p className="font-serif-app italic text-sm opacity-40">No active strikes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pending.map((p) => (
              <div
                key={p.id}
                className="glass-card rounded-2xl p-4 space-y-2.5 border-l-2 border-l-rose-500 border-current/[0.08] relative"
              >
                <div className="flex items-center justify-between text-[11px] font-mono opacity-60">
                  <span className="font-semibold text-rose-400">2-Day Breach</span>
                  <span>{p.assignedAt.split('T')[0]}</span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-current font-serif-app">{p.taskName}</h4>
                  <p className="text-[10px] font-mono opacity-40">Missed: {p.missedDates.join(', ')}</p>
                </div>

                <div className="p-3 rounded-xl bg-current/[0.025] border border-current/[0.06] text-xs text-current font-serif-app italic leading-relaxed">
                  "{p.punishmentText}"
                </div>

                <div className="flex items-center justify-end pt-1.5 border-t border-current/[0.06]">
                  <button
                    onClick={() => onMarkServed(p.id)}
                    className="px-2.5 py-1 rounded-lg btn-solid-invert font-mono text-xs font-medium transition-all btn-press flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Served</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Served History (Collapsible or Clean List) */}
      {served.length > 0 && (
        <div className="pt-2">
          <span className="text-[10px] font-mono uppercase tracking-wider opacity-40 block mb-2">
            Ledger ({served.length})
          </span>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {served.slice(0, 5).map((s) => (
              <div
                key={s.id}
                className="glass-card rounded-xl px-3 py-1.5 flex items-center justify-between text-xs font-mono opacity-50 border border-current/[0.06]"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span className="truncate">{s.taskName}</span>
                </div>
                <span className="text-[9px] opacity-40 shrink-0">Served</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
