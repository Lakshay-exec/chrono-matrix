import { 
  ArrowRight, 
  TrendingUp, 
  ShieldAlert, 
  Moon, 
  HardDrive, 
  Sparkles,
  Zap
} from 'lucide-react';

interface LandingHeroProps {
  onGetStarted: () => void;
  onExploreOffline: () => void;
  isLight: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onGetStarted,
  onExploreOffline,
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden page-enter">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[750px] rounded-full bg-white/[0.015] blur-[140px]" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[500px] rounded-full bg-white/[0.01] blur-[100px]" />
      </div>

      {/* Top brand indicator */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-current" />
          <span className="text-sm font-semibold tracking-wider uppercase font-mono">
            CHRONO MATRIX
          </span>
          <span className="font-signature text-xs opacity-60 ml-1">system</span>
        </div>
        <button
          onClick={onGetStarted}
          className="text-xs font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-xl border border-current/20 hover:bg-current/10 transition-all btn-press"
        >
          Sign In →
        </button>
      </div>

      {/* Hero Narrative */}
      <div className="max-w-4xl mx-auto w-full my-auto text-center z-10 py-16 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-[11px] font-mono tracking-widest uppercase opacity-75">
          <Sparkles className="w-3 h-3" />
          The Science of Relentless Compounding
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight font-sans-app leading-[1.08]">
          One percent better,
          <br />
          <span className="font-serif-app italic font-normal opacity-90">
            every single day.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg font-serif-app italic opacity-75 leading-relaxed">
          "If you get one percent better each day for one year, you’ll end up thirty-seven times better. 
          If you deteriorate one percent each day, you decline nearly to zero."
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl btn-solid-invert font-semibold text-base transition-all shadow-2xl flex items-center justify-center gap-3 btn-press"
          >
            <span>Get Started with Google or Email</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={onExploreOffline}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl glass-card hover:bg-white/5 transition-all text-xs font-mono tracking-wider uppercase opacity-80 hover:opacity-100 flex items-center justify-center gap-2 btn-press"
          >
            <HardDrive className="w-4 h-4" />
            <span>Try Offline Guest Mode</span>
          </button>
        </div>
      </div>

      {/* 4 Core Pillars of where it helps */}
      <div className="max-w-6xl mx-auto w-full z-10 pt-8 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 space-y-2">
            <div className="p-2 rounded-xl bg-white/[0.04] w-fit">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold">1% Compounding Curve</h3>
            <p className="text-xs opacity-70 leading-relaxed">
              Real-time mathematical trajectory. Complete rituals to compound upward; missed days dip the curve downward.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-2">
            <div className="p-2 rounded-xl bg-white/[0.04] w-fit">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold">AI Accountability Tribunal</h3>
            <p className="text-xs opacity-70 leading-relaxed">
              Miss a habit 2 days in a row? Google Gemini AI warden intervenes with an immediate disciplinary penalty.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-2">
            <div className="p-2 rounded-xl bg-white/[0.04] w-fit">
              <Moon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold">Sleep & Midday Naps</h3>
            <p className="text-xs opacity-70 leading-relaxed">
              Log nocturnal recovery and power naps. Correlate wakefulness with Google Fit activity telemetry.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-2">
            <div className="p-2 rounded-xl bg-white/[0.04] w-fit">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold">Daily Micro-Journal</h3>
            <p className="text-xs opacity-70 leading-relaxed">
              Capture each day in a single poignant line, marking whether the day pushed your boundaries or weighed you down.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
