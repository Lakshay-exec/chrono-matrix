import { RotateCcw, X, Sparkles } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
  activeStrikesCount: number;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
  activeStrikesCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md page-enter">
      <div 
        className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-7 space-y-5 bg-[var(--bg-app)] text-[var(--text-main)] border border-current/15 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl opacity-50 hover:opacity-100 hover:bg-current/[0.05] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif-app text-current">Discipline Fresh Start</h3>
            <p className="text-[11px] font-mono opacity-50">Reset accountability baseline to Today</p>
          </div>
        </div>

        {/* Narrative */}
        <div className="space-y-2 text-xs font-serif-app italic opacity-85 leading-relaxed">
          <p>
            "Discipline is about momentum today, not drowning in guilt from weeks of absence."
          </p>
          <p className="not-italic text-[11px] opacity-70 font-mono">
            If life happened and you returned after a long break, this resets your accountability counter so you can pick up your rituals immediately without being frozen.
          </p>
        </div>

        {/* What this does */}
        <div className="p-3.5 rounded-2xl bg-current/[0.03] border border-current/[0.08] space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-400">
            <span>✓</span>
            <span>Unlocks all frozen rituals immediately</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <span>✓</span>
            <span>Pardons {activeStrikesCount > 0 ? `${activeStrikesCount} active strike(s)` : 'all active strikes'}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <span>✓</span>
            <span>Resets accountability baseline to Today</span>
          </div>
          <div className="flex items-center gap-2 opacity-65">
            <span>✓</span>
            <span>Preserves all your past logs & streak statistics</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl glass-card text-xs font-mono opacity-70 hover:opacity-100 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="px-5 py-2 rounded-xl btn-solid-invert text-xs font-mono font-bold transition-all btn-press cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Confirm Fresh Start</span>
          </button>
        </div>
      </div>
    </div>
  );
};
