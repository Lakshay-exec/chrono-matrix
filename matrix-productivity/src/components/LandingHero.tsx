import { useState } from 'react';
import { 
  ArrowRight, 
  HardDrive, 
  Check, 
  X, 
  ChevronDown, 
  Flame, 
  TrendingUp 
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
  const [showComparison, setShowComparison] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const FAQS = [
    {
      q: "Is Chrono Matrix truly 100% free with zero subscriptions?",
      a: "Yes, completely. There are no paywalled features, in-app purchases, advertisements, or premium tiers. All core capabilities—including the 30-day matrix, 1% compounding curve, sleep telemetry, and automated tribunal—are unrestricted forever."
    },
    {
      q: "How does the 1% Compounding Curve mathematically work?",
      a: "Inspired by James Clear's atomic compounding principle (1.01^365 = 37.78 vs 0.99^365 = 0.03), Chrono Matrix plots your daily executed habits against missed commitments. Every completed ritual compounds your momentum score upward, while inactive days decelerate your curve toward baseline."
    },
    {
      q: "What is the 2-Day Breach Disciplinary Tribunal?",
      a: "The golden rule of elite consistency is 'never miss twice'. If you miss a ritual on Day 1, a Day 2 warning appears. If you fail to complete it on Day 2, the ritual is frozen and the automated Tribunal assigns a strict stoic penalty (physical exercise, digital detox, or focused study) that must be served before that ritual unlocks."
    },
    {
      q: "Can I use Chrono Matrix offline without an account?",
      a: "Yes. Chrono Matrix is an air-gapped Progressive Web App (PWA) with local-first storage. You can click 'Try Offline Guest Mode' to track habits, sleep, and journals immediately with 100% data persistence on your device without signing in."
    },
    {
      q: "How does Chrono Matrix compare to Notion, Habitica, or Streaks?",
      a: "Unlike Notion (which requires complex database setup and sluggish load times) or Habitica (bloated with cartoon gamification), Chrono Matrix is built on luxury monochrome minimalism. It offers instant 1-tap logging, offline speed, real mathematical curve analytics, and strict accountability."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 sm:px-8 lg:px-12 py-8 sm:py-12 relative overflow-hidden page-enter">
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-white/[0.012] blur-[140px]" />
      </div>

      {/* Top brand indicator */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between z-10 mb-12 sm:mb-20">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-current opacity-80" />
          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase font-mono">
            CHRONO MATRIX
          </span>
        </div>
        <button
          onClick={onGetStarted}
          className="text-xs font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-current/15 hover:bg-current/10 transition-all btn-press cursor-pointer"
        >
          Sign In →
        </button>
      </header>

      {/* Hero Narrative: Ultra-clean, unhurried, breathing */}
      <main className="max-w-3xl mx-auto w-full text-center z-10 py-6 sm:py-12 space-y-6 sm:space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-[11px] font-mono tracking-widest uppercase opacity-75">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 beacon-pulse" />
          Minimalist Discipline Matrix
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight font-sans-app leading-[1.08]">
          One percent better,
          <br />
          <span className="font-serif-app italic font-normal opacity-90">
            every single day.
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-sm sm:text-base font-serif-app italic opacity-70 leading-relaxed">
          A minimalist monochrome habit matrix engineered for relentless consistency. Zero friction, zero distraction, pure execution.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 max-w-md mx-auto sm:max-w-none">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full btn-solid-invert font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-xl flex items-center justify-center gap-2.5 btn-press cursor-pointer"
          >
            <span>Start Tracking (Google / Email)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onExploreOffline}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full glass-card hover:bg-current/[0.05] transition-all text-xs font-mono tracking-wider uppercase opacity-80 hover:opacity-100 flex items-center justify-center gap-2 btn-press cursor-pointer"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Try Offline Guest Mode</span>
          </button>
        </div>
      </main>

      {/* Clean Understated Product Preview: Pure Minimalism without Clutter */}
      <section className="max-w-4xl mx-auto w-full z-10 my-10 sm:my-16 px-2 sm:px-4">
        <div className="glass-card rounded-3xl p-4 sm:p-7 border border-current/[0.1] shadow-2xl relative">
          
          {/* Subtle Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-current/[0.07] text-xs font-mono">
            <div className="flex items-center gap-2 opacity-60">
              <span className="w-2 h-2 rounded-full bg-current opacity-60" />
              <span>Oct 26 — Nov 1</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 fill-amber-500" />
                14d Streak
              </span>
              <span className="text-[10px] opacity-40">·</span>
              <span className="text-[10px] text-emerald-400 font-bold">94% Done</span>
            </div>
          </div>

          {/* Minimal 3-row Matrix Mockup */}
          <div className="space-y-2 font-mono text-xs">
            {/* Habit 1 */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-current/[0.02] border border-current/[0.05]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                <span className="font-semibold text-current text-xs truncate">Deep Focus Work</span>
                <span className="text-[10px] opacity-40 hidden sm:inline">Focus</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {[1, 1, 1, 1, 1, 1, 1].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-lg cell-checked flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                ))}
              </div>
            </div>

            {/* Habit 2 */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-current/[0.02] border border-current/[0.05]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-semibold text-current text-xs truncate">Physical Resistance</span>
                <span className="text-[10px] opacity-40 hidden sm:inline">Fitness</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {[1, 1, 1, 1, 1, 0, 1].map((done, i) => (
                  <div key={i} className={`w-6 h-6 rounded-lg flex items-center justify-center ${done ? 'cell-checked' : 'cell-unchecked'}`}>
                    {done ? <Check className="w-3 h-3" /> : null}
                  </div>
                ))}
              </div>
            </div>

            {/* Habit 3 */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-current/[0.02] border border-current/[0.05]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                <span className="font-semibold text-current text-xs truncate">Evening Stoic Reflection</span>
                <span className="text-[10px] opacity-40 hidden sm:inline">Mind</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {[1, 1, 1, 1, 1, 1, 1].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-lg cell-checked flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Minimal 1% Curve Telemetry Footer */}
          <div className="mt-4 pt-3 border-t border-current/[0.07] flex items-center justify-between text-[11px] font-mono opacity-70">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              (1.01)³⁶⁵ = 37.8× Compounding Law
            </span>
            <span className="hidden sm:inline opacity-50">Local-First · Zero Lag</span>
          </div>

        </div>
      </section>

      {/* Refined 3-Column Architectural Features */}
      <section className="max-w-4xl mx-auto w-full z-10 py-8 border-t border-current/[0.07]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="space-y-2">
            <span className="text-xs font-mono opacity-40 uppercase">01 / Execution</span>
            <h3 className="text-sm font-semibold">1-Tap Consistency</h3>
            <p className="text-xs opacity-70 leading-relaxed font-serif-app italic">
              Clean daily grid. Instant local persistence and cloud sync with zero friction or complex Notion formulas.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono opacity-40 uppercase">02 / Momentum</span>
            <h3 className="text-sm font-semibold">1% Mathematical Curve</h3>
            <p className="text-xs opacity-70 leading-relaxed font-serif-app italic">
              Atomic compounding trajectory. Executed habits compound upward; missed sessions decelerate toward baseline.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono opacity-40 uppercase">03 / Discipline</span>
            <h3 className="text-sm font-semibold">AI Accountability Tribunal</h3>
            <p className="text-xs opacity-70 leading-relaxed font-serif-app italic">
              Never miss twice. A 2-day breach automatically locks rituals until a disciplinary penalty is completed.
            </p>
          </div>
        </div>
      </section>

      {/* Collapsible Deep Specs & SEO Comparison (Tucked cleanly at bottom) */}
      <section className="max-w-4xl mx-auto w-full z-10 py-6 border-t border-current/[0.07]">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="text-xs font-mono opacity-60 hover:opacity-100 px-4 py-2 rounded-full glass-card transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{showComparison ? 'Hide' : 'View'} System Specs vs Other Trackers</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showComparison ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showComparison && (
          <div className="mt-8 space-y-8 page-enter">
            {/* Comparison Table */}
            <div className="glass-card rounded-2xl overflow-x-auto border border-current/[0.09]">
              <table className="w-full text-left text-xs font-mono min-w-[500px]">
                <thead>
                  <tr className="border-b border-current/[0.08] bg-current/[0.02]">
                    <th className="py-3 px-4 opacity-60">Capabilities</th>
                    <th className="py-3 px-4 font-bold text-current bg-current/[0.04]">Chrono Matrix</th>
                    <th className="py-3 px-4 opacity-60">Notion</th>
                    <th className="py-3 px-4 opacity-60">Habitica</th>
                    <th className="py-3 px-4 opacity-60">Streaks App</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-current/[0.06]">
                  <tr>
                    <td className="py-2.5 px-4 font-semibold">100% Free / Zero Paywalls</td>
                    <td className="py-2.5 px-4 text-emerald-400 font-bold bg-current/[0.04]"><Check className="w-3.5 h-3.5 inline" /> Free Forever</td>
                    <td className="py-2.5 px-4 opacity-60">Free / $10/mo</td>
                    <td className="py-2.5 px-4 opacity-60">$5/mo sub</td>
                    <td className="py-2.5 px-4 opacity-60">$5.99 paid</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold">1% Compounding Curve</td>
                    <td className="py-2.5 px-4 text-emerald-400 font-bold bg-current/[0.04]"><Check className="w-3.5 h-3.5 inline" /> Built-in Math</td>
                    <td className="py-2.5 px-4 opacity-60"><X className="w-3.5 h-3.5 inline text-rose-400" /> Manual setup</td>
                    <td className="py-2.5 px-4 opacity-60"><X className="w-3.5 h-3.5 inline text-rose-400" /> XP only</td>
                    <td className="py-2.5 px-4 opacity-60"><X className="w-3.5 h-3.5 inline text-rose-400" /> None</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold">Auto 2-Day Breach Lock</td>
                    <td className="py-2.5 px-4 text-emerald-400 font-bold bg-current/[0.04]"><Check className="w-3.5 h-3.5 inline" /> Automated</td>
                    <td className="py-2.5 px-4 opacity-60"><X className="w-3.5 h-3.5 inline text-rose-400" /> None</td>
                    <td className="py-2.5 px-4 opacity-60">Health loss</td>
                    <td className="py-2.5 px-4 opacity-60"><X className="w-3.5 h-3.5 inline text-rose-400" /> None</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold">Offline Local-First PWA</td>
                    <td className="py-2.5 px-4 text-emerald-400 font-bold bg-current/[0.04]"><Check className="w-3.5 h-3.5 inline" /> 1-Click Guest</td>
                    <td className="py-2.5 px-4 opacity-60"><X className="w-3.5 h-3.5 inline text-rose-400" /> Login needed</td>
                    <td className="py-2.5 px-4 opacity-60"><X className="w-3.5 h-3.5 inline text-rose-400" /> Account needed</td>
                    <td className="py-2.5 px-4 opacity-60"><Check className="w-3.5 h-3.5 inline text-emerald-400" /> iOS only</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Accordion FAQs */}
            <div className="space-y-2 text-left">
              <span className="text-[11px] font-mono uppercase tracking-wider opacity-50 block mb-2 text-center">Frequently Asked Questions</span>
              {FAQS.map((faq, idx) => (
                <div key={idx} className="glass-card rounded-2xl border border-current/[0.08] overflow-hidden">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-3.5 px-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-3.5 text-xs opacity-70 leading-relaxed font-serif-app italic border-t border-current/[0.05] pt-2.5">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Understated Minimalist Footer */}
      <footer className="max-w-5xl mx-auto w-full flex items-center justify-between text-[11px] font-mono opacity-40 z-10 pt-6">
        <span>© 2026 Chrono Matrix</span>
        <span>Minimalist Monochrome Productivity</span>
      </footer>
    </div>
  );
};
