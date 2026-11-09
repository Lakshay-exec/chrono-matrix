import { useState } from 'react';
import { 
  ArrowRight, 
  TrendingUp, 
  ShieldAlert, 
  Moon, 
  HardDrive, 
  Sparkles,
  Zap,
  Check,
  X,
  ChevronDown
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
    <div className="min-h-screen flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative overflow-hidden page-enter">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[750px] rounded-full bg-white/[0.015] blur-[140px]" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[500px] rounded-full bg-white/[0.01] blur-[100px]" />
      </div>

      {/* Top brand indicator */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between z-10 mb-8 sm:mb-12">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-current" />
          <span className="text-sm font-semibold tracking-wider uppercase font-mono">
            CHRONO MATRIX
          </span>
          <span className="font-signature text-xs opacity-60 ml-1">system</span>
        </div>
        <button
          onClick={onGetStarted}
          className="text-xs font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-xl border border-current/20 hover:bg-current/10 transition-all btn-press cursor-pointer"
        >
          Sign In →
        </button>
      </div>

      {/* Hero Narrative */}
      <div className="max-w-4xl mx-auto w-full my-auto text-center z-10 py-10 sm:py-16 space-y-6 sm:space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-[11px] font-mono tracking-widest uppercase opacity-85">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          The Science of Relentless Compounding
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight font-sans-app leading-[1.08]">
          One percent better,
          <br />
          <span className="font-serif-app italic font-normal opacity-90">
            every single day.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-lg font-serif-app italic opacity-75 leading-relaxed">
          "If you get one percent better each day for one year, you’ll end up thirty-seven times better. 
          If you deteriorate one percent each day, you decline nearly to zero."
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 max-w-md mx-auto sm:max-w-none">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl btn-solid-invert font-semibold text-sm sm:text-base transition-all shadow-2xl flex items-center justify-center gap-3 btn-press cursor-pointer"
          >
            <span>Start Tracking (Google / Email)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={onExploreOffline}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl glass-card hover:bg-white/5 transition-all text-xs font-mono tracking-wider uppercase opacity-80 hover:opacity-100 flex items-center justify-center gap-2 btn-press cursor-pointer"
          >
            <HardDrive className="w-4 h-4" />
            <span>Try Offline Guest Mode</span>
          </button>
        </div>
      </div>

      {/* 4 Core Pillars of where it helps */}
      <div className="max-w-6xl mx-auto w-full z-10 pt-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 space-y-2">
            <div className="p-2 rounded-xl bg-white/[0.04] w-fit">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold">1% Compounding Curve</h3>
            <p className="text-xs opacity-70 leading-relaxed">
              Real-time mathematical trajectory. Complete rituals to compound upward; missed days dip the curve downward.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-2">
            <div className="p-2 rounded-xl bg-white/[0.04] w-fit">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <h3 className="text-sm font-semibold">AI Accountability Tribunal</h3>
            <p className="text-xs opacity-70 leading-relaxed">
              Miss a habit 2 days in a row? Google Gemini AI warden intervenes with an immediate disciplinary penalty.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-2">
            <div className="p-2 rounded-xl bg-white/[0.04] w-fit">
              <Moon className="w-4 h-4 text-amber-300" />
            </div>
            <h3 className="text-sm font-semibold">Sleep & Midday Naps</h3>
            <p className="text-xs opacity-70 leading-relaxed">
              Log nocturnal recovery and power naps. Correlate wakefulness with Google Fit activity telemetry.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-2">
            <div className="p-2 rounded-xl bg-white/[0.04] w-fit">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold">Daily Micro-Journal</h3>
            <p className="text-xs opacity-70 leading-relaxed">
              Capture each day in a single poignant line, marking whether the day pushed your boundaries or weighed you down.
            </p>
          </div>
        </div>
      </div>

      {/* SEO SECTION 1: THE MATHEMATICS OF COMPOUNDING */}
      <section className="max-w-5xl mx-auto w-full z-10 py-12 border-t border-current/[0.07]">
        <div className="text-center space-y-3 mb-10">
          <span className="text-[11px] font-mono uppercase tracking-widest opacity-50">Scientific Discipline</span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif-app">The Mathematics of 1% Compounding</h2>
          <p className="text-xs sm:text-sm font-serif-app italic opacity-70 max-w-2xl mx-auto">
            Small disciplines repeated daily create exponential divergence over a calendar year.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4 border border-emerald-500/20 bg-emerald-500/[0.02]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">The Compounding Law</span>
              <span className="text-2xl font-mono font-bold text-emerald-400">37.78×</span>
            </div>
            <div className="font-mono text-base font-bold text-current">
              (1.01)³⁶⁵ = 37.78
            </div>
            <p className="text-xs opacity-75 leading-relaxed font-serif-app italic">
              Improving just 1% every day for 365 days yields a thirty-seven fold increase in capability, focus, and physical mastery. Consistency beats sporadic intensity.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4 border border-rose-500/20 bg-rose-500/[0.02]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">The Decay Law</span>
              <span className="text-2xl font-mono font-bold text-rose-400">0.03×</span>
            </div>
            <div className="font-mono text-base font-bold text-current">
              (0.99)³⁶⁵ = 0.03
            </div>
            <p className="text-xs opacity-75 leading-relaxed font-serif-app italic">
              Allowing 1% slippage or regression every day reduces your discipline to nearly zero. This is why Chrono Matrix enforces the strict 2-Day Breach rule.
            </p>
          </div>
        </div>
      </section>

      {/* SEO SECTION 2: COMPARISON TABLE */}
      <section className="max-w-5xl mx-auto w-full z-10 py-12 border-t border-current/[0.07]">
        <div className="text-center space-y-3 mb-10">
          <span className="text-[11px] font-mono uppercase tracking-widest opacity-50">Feature Breakdown</span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif-app">Chrono Matrix vs Bloated Habit Trackers</h2>
          <p className="text-xs sm:text-sm font-serif-app italic opacity-70 max-w-2xl mx-auto">
            Why modern high-performers choose minimal friction over complex setups.
          </p>
        </div>

        <div className="glass-card rounded-3xl overflow-x-auto border border-current/[0.09]">
          <table className="w-full text-left text-xs font-mono min-w-[550px]">
            <thead>
              <tr className="border-b border-current/[0.08] bg-current/[0.02]">
                <th className="py-3.5 px-4 opacity-60">Capabilities</th>
                <th className="py-3.5 px-4 font-bold text-current bg-current/[0.04]">Chrono Matrix</th>
                <th className="py-3.5 px-4 opacity-60">Notion</th>
                <th className="py-3.5 px-4 opacity-60">Habitica</th>
                <th className="py-3.5 px-4 opacity-60">Streaks App</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/[0.06]">
              <tr>
                <td className="py-3 px-4 font-semibold">100% Free / Zero Paywalls</td>
                <td className="py-3 px-4 text-emerald-400 font-bold bg-current/[0.04]"><Check className="w-4 h-4 inline" /> Free Forever</td>
                <td className="py-3 px-4 opacity-60">Free / $10/mo</td>
                <td className="py-3 px-4 opacity-60">$5/mo sub</td>
                <td className="py-3 px-4 opacity-60">$5.99 paid</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">1% Compounding Trajectory Curve</td>
                <td className="py-3 px-4 text-emerald-400 font-bold bg-current/[0.04]"><Check className="w-4 h-4 inline" /> Built-in Math</td>
                <td className="py-3 px-4 opacity-60"><X className="w-4 h-4 inline text-rose-400" /> Complex manual formula</td>
                <td className="py-3 px-4 opacity-60"><X className="w-4 h-4 inline text-rose-400" /> Cartoon XP only</td>
                <td className="py-3 px-4 opacity-60"><X className="w-4 h-4 inline text-rose-400" /> No trajectory</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Auto 2-Day Breach Tribunal Lock</td>
                <td className="py-3 px-4 text-emerald-400 font-bold bg-current/[0.04]"><Check className="w-4 h-4 inline" /> Automated Penalty</td>
                <td className="py-3 px-4 opacity-60"><X className="w-4 h-4 inline text-rose-400" /> None</td>
                <td className="py-3 px-4 opacity-60">Virtual health loss</td>
                <td className="py-3 px-4 opacity-60"><X className="w-4 h-4 inline text-rose-400" /> None</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Offline PWA & Air-Gapped Guest Mode</td>
                <td className="py-3 px-4 text-emerald-400 font-bold bg-current/[0.04]"><Check className="w-4 h-4 inline" /> 1-Click Guest</td>
                <td className="py-3 px-4 opacity-60"><X className="w-4 h-4 inline text-rose-400" /> Requires Login</td>
                <td className="py-3 px-4 opacity-60"><X className="w-4 h-4 inline text-rose-400" /> Requires Account</td>
                <td className="py-3 px-4 opacity-60"><Check className="w-4 h-4 inline text-emerald-400" /> Local only (iOS)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Circadian Sleep & Nap Tracking</td>
                <td className="py-3 px-4 text-emerald-400 font-bold bg-current/[0.04]"><Check className="w-4 h-4 inline" /> 14-Night Graph</td>
                <td className="py-3 px-4 opacity-60"><X className="w-4 h-4 inline text-rose-400" /> None</td>
                <td className="py-3 px-4 opacity-60"><X className="w-4 h-4 inline text-rose-400" /> None</td>
                <td className="py-3 px-4 opacity-60"><X className="w-4 h-4 inline text-rose-400" /> None</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SEO SECTION 3: FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto w-full z-10 py-12 border-t border-current/[0.07]">
        <div className="text-center space-y-3 mb-10">
          <span className="text-[11px] font-mono uppercase tracking-widest opacity-50">Knowledge Base</span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif-app">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm font-serif-app italic opacity-70">
            Everything you need to know about Chrono Matrix discipline protocol.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="glass-card rounded-2xl border border-current/[0.08] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-4 px-5 flex items-center justify-between text-left gap-4 cursor-pointer hover:bg-current/[0.02]"
                >
                  <span className="text-sm font-semibold font-serif-app text-current">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 opacity-50 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm font-serif-app italic opacity-80 leading-relaxed border-t border-current/[0.05]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <div className="max-w-4xl mx-auto w-full z-10 py-12 text-center space-y-5 border-t border-current/[0.07]">
        <h3 className="text-2xl sm:text-3xl font-bold font-serif-app">Ready to build unbreakable discipline?</h3>
        <p className="text-xs sm:text-sm font-serif-app italic opacity-70 max-w-md mx-auto">
          Start with 4 core rituals today. Watch your compounding trajectory curve rise over the next 30 days.
        </p>
        <button
          onClick={onGetStarted}
          className="px-8 py-3.5 rounded-2xl btn-solid-invert font-semibold text-sm transition-all shadow-xl inline-flex items-center gap-2 btn-press cursor-pointer"
        >
          <span>Open Sovereign Matrix</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Minimal Footer */}
      <footer className="max-w-6xl mx-auto w-full z-10 pt-6 pb-2 border-t border-current/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono opacity-50">
        <div>
          <span>CHRONO MATRIX © 2026 • Minimalist Discipline Protocol</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onExploreOffline} className="hover:underline cursor-pointer">Offline PWA</button>
          <span>•</span>
          <button onClick={onGetStarted} className="hover:underline cursor-pointer">Cloud Sync</button>
        </div>
      </footer>
    </div>
  );
};
