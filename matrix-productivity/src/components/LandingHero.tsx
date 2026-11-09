import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  HardDrive,
  Check,
  X,
  ChevronDown,
  Flame,
  TrendingUp,
  Zap,
  Shield,
  Moon,
} from 'lucide-react';

interface LandingHeroProps {
  onGetStarted: () => void;
  onExploreOffline: () => void;
  isLight: boolean;
}

// Hook: triggers animation class once element enters viewport
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function RevealBlock({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(28px)',
        transition: `opacity 0.72s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.72s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
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
      q: 'Is Chrono Matrix truly 100% free with zero subscriptions?',
      a: 'Yes, completely. There are no paywalled features, in-app purchases, advertisements, or premium tiers. All core capabilities—including the 30-day matrix, 1% compounding curve, sleep telemetry, and automated tribunal—are unrestricted forever.',
    },
    {
      q: 'How does the 1% Compounding Curve mathematically work?',
      a: "Inspired by James Clear's atomic compounding principle (1.01^365 = 37.78 vs 0.99^365 = 0.03), Chrono Matrix plots your daily executed habits against missed commitments. Every completed ritual compounds your momentum score upward, while inactive days decelerate your curve toward baseline.",
    },
    {
      q: 'What is the 2-Day Breach Disciplinary Tribunal?',
      a: "The golden rule of elite consistency is 'never miss twice'. If you miss a ritual on Day 1, a Day 2 warning appears. If you fail to complete it on Day 2, the ritual is frozen and the automated Tribunal assigns a strict stoic penalty that must be served before that ritual unlocks.",
    },
    {
      q: 'Can I use Chrono Matrix offline without an account?',
      a: "Yes. Chrono Matrix is an air-gapped Progressive Web App (PWA) with local-first storage. You can click 'Try Offline Guest Mode' to track habits, sleep, and journals immediately with 100% data persistence on your device without signing in.",
    },
    {
      q: 'How does Chrono Matrix compare to Notion, Habitica, or Streaks?',
      a: 'Unlike Notion (which requires complex database setup) or Habitica (bloated with cartoon gamification), Chrono Matrix is built on luxury monochrome minimalism. Instant 1-tap logging, offline speed, real mathematical curve analytics, and strict accountability.',
    },
  ];

  const FEATURES = [
    {
      icon: Zap,
      label: '01 / Execution',
      title: '1-Tap Consistency',
      desc: 'Clean daily grid. Instant local persistence and cloud sync with zero friction.',
    },
    {
      icon: TrendingUp,
      label: '02 / Momentum',
      title: '1% Mathematical Curve',
      desc: 'Atomic compounding trajectory. Executed habits compound upward; missed sessions decelerate.',
    },
    {
      icon: Shield,
      label: '03 / Discipline',
      title: 'AI Accountability Tribunal',
      desc: 'Never miss twice. A 2-day breach automatically locks rituals until a disciplinary penalty is completed.',
    },
    {
      icon: Moon,
      label: '04 / Recovery',
      title: 'Circadian Sleep Telemetry',
      desc: 'Log sleep, track patterns, visualize your circadian consistency week over week.',
    },
  ];

  return (
    <div
      className="w-full min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-main)] font-sans-app overflow-x-hidden"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 text-center overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 'min(680px, 90vw)',
              height: 'min(680px, 90vw)',
              background: 'radial-gradient(circle, rgba(255,255,255,0.028) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
        </div>

        {/* Top bar */}
        <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-8 lg:px-12 py-5 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
            <span className="text-xs font-semibold tracking-widest uppercase font-mono opacity-90">
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

        {/* Hero content — staggered fade-in on mount */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-7 pt-20 pb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-[11px] font-mono tracking-widest uppercase opacity-80"
            style={{ animation: 'fadeSlideIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 beacon-pulse" />
            Minimalist Discipline Matrix
          </div>

          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.06]"
            style={{ animation: 'fadeSlideIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.22s both' }}
          >
            One percent better,
            <br />
            <span className="font-serif-app italic font-normal opacity-90">
              every single day.
            </span>
          </h1>

          <p
            className="max-w-lg mx-auto text-sm sm:text-base font-serif-app italic opacity-60 leading-relaxed"
            style={{ animation: 'fadeSlideIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.36s both' }}
          >
            A minimalist monochrome habit matrix engineered for relentless consistency.
            Zero friction, zero distraction, pure execution.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full max-w-xs sm:max-w-none mx-auto"
            style={{ animation: 'fadeSlideIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.48s both' }}
          >
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full btn-solid-invert font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-xl flex items-center justify-center gap-2.5 btn-press cursor-pointer"
            >
              <span>Start Tracking</span>
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
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
          style={{ animation: 'fadeSlideIn 1s cubic-bezier(0.16,1,0.3,1) 1.1s both' }}
        >
          <span className="text-[10px] font-mono tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-current/40 scroll-line" />
        </div>
      </section>

      {/* ── PRODUCT PREVIEW ──────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <RevealBlock className="glass-card rounded-3xl p-4 sm:p-7 border border-current/[0.1] shadow-2xl">
            {/* Header */}
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

            {/* Matrix mockup rows */}
            <div className="space-y-2 font-mono text-xs">
              {[
                { color: 'bg-cyan-400', name: 'Deep Focus Work', tag: 'Focus', days: [1, 1, 1, 1, 1, 1, 1] },
                { color: 'bg-emerald-400', name: 'Physical Resistance', tag: 'Fitness', days: [1, 1, 1, 1, 1, 0, 1] },
                { color: 'bg-purple-400', name: 'Evening Stoic Reflection', tag: 'Mind', days: [1, 1, 1, 1, 1, 1, 1] },
              ].map((row) => (
                <div
                  key={row.name}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-current/[0.02] border border-current/[0.05]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${row.color} shrink-0`} />
                    <span className="font-semibold text-current text-xs truncate">{row.name}</span>
                    <span className="text-[10px] opacity-40 hidden sm:inline">{row.tag}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {row.days.map((done, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center ${done ? 'cell-checked' : 'cell-unchecked'}`}
                      >
                        {done ? <Check className="w-3 h-3" /> : null}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-current/[0.07] flex items-center justify-between text-[11px] font-mono opacity-70">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                (1.01)³⁶⁵ = 37.8× Compounding Law
              </span>
              <span className="hidden sm:inline opacity-50">Local-First · Zero Lag</span>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-20 border-t border-current/[0.07]">
        <div className="max-w-4xl mx-auto">
          <RevealBlock className="text-center mb-10 sm:mb-16 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest opacity-40">
              The System
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Everything you need.
              <br />
              <span className="font-serif-app italic font-normal opacity-80">
                Nothing you don't.
              </span>
            </h2>
          </RevealBlock>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <RevealBlock key={f.title} delay={i * 90}>
                  <div className="glass-card rounded-2xl p-5 border border-current/[0.08] hover:border-current/[0.15] transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-current/[0.06] flex items-center justify-center shrink-0 group-hover:bg-current/[0.1] transition-colors">
                        <Icon className="w-4 h-4 opacity-80" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <span className="text-[10px] font-mono opacity-40 uppercase">{f.label}</span>
                        <h3 className="text-sm font-semibold">{f.title}</h3>
                        <p className="text-xs opacity-60 leading-relaxed font-serif-app italic">{f.desc}</p>
                      </div>
                    </div>
                  </div>
                </RevealBlock>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STAT ROW ─────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-20 border-t border-current/[0.07]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 text-center">
          {[
            { val: '100%', label: 'Free forever' },
            { val: '37.8×', label: 'Growth in 1 year' },
            { val: '0ms', label: 'Offline load time' },
            { val: '∞', label: 'No paywalls' },
          ].map((s, i) => (
            <RevealBlock key={s.label} delay={i * 80} className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight">{s.val}</div>
              <div className="text-[11px] font-mono uppercase tracking-wider opacity-40">{s.label}</div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* ── SPECS / FAQ (collapsed) ───────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-12 py-10 border-t border-current/[0.07]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-center">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="text-xs font-mono opacity-60 hover:opacity-100 px-4 py-2 rounded-full glass-card transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{showComparison ? 'Hide' : 'View'} System Specs vs Other Trackers</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${showComparison ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {showComparison && (
            <div className="space-y-8 page-enter">
              {/* Comparison Table */}
              <div className="glass-card rounded-2xl overflow-x-auto border border-current/[0.09]">
                <table className="w-full text-left text-xs font-mono min-w-[500px]">
                  <thead>
                    <tr className="border-b border-current/[0.08] bg-current/[0.02]">
                      <th className="py-3 px-4 opacity-60">Capabilities</th>
                      <th className="py-3 px-4 font-bold bg-current/[0.04]">Chrono Matrix</th>
                      <th className="py-3 px-4 opacity-60">Notion</th>
                      <th className="py-3 px-4 opacity-60">Habitica</th>
                      <th className="py-3 px-4 opacity-60">Streaks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-current/[0.06]">
                    {[
                      ['100% Free / Zero Paywalls', 'Free Forever', 'Free / $10/mo', '$5/mo sub', '$5.99 paid'],
                      ['1% Compounding Curve', 'Built-in Math', null, null, null],
                      ['Auto 2-Day Breach Lock', 'Automated', null, 'Health loss', null],
                      ['Offline Local-First PWA', '1-Click Guest', null, null, 'iOS only'],
                    ].map(([cap, cm, n, h, s]) => (
                      <tr key={cap as string}>
                        <td className="py-2.5 px-4 font-semibold">{cap}</td>
                        <td className="py-2.5 px-4 text-emerald-400 font-bold bg-current/[0.04]">
                          <Check className="w-3.5 h-3.5 inline mr-1" />{cm}
                        </td>
                        <td className="py-2.5 px-4 opacity-60">
                          {n ? n : <X className="w-3.5 h-3.5 inline text-rose-400" />}
                        </td>
                        <td className="py-2.5 px-4 opacity-60">
                          {h ? h : <X className="w-3.5 h-3.5 inline text-rose-400" />}
                        </td>
                        <td className="py-2.5 px-4 opacity-60">
                          {s ? (
                            <>
                              <Check className="w-3.5 h-3.5 inline text-emerald-400 mr-1" />
                              {s}
                            </>
                          ) : (
                            <X className="w-3.5 h-3.5 inline text-rose-400" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* FAQs */}
              <div className="space-y-2 text-left">
                <span className="text-[11px] font-mono uppercase tracking-wider opacity-50 block mb-4 text-center">
                  Frequently Asked Questions
                </span>
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="glass-card rounded-2xl border border-current/[0.08] overflow-hidden">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full py-3.5 px-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="px-4 pb-3.5 text-xs opacity-70 leading-relaxed font-serif-app italic border-t border-current/[0.05] pt-2.5 page-enter">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24 border-t border-current/[0.07]">
        <RevealBlock className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Start your discipline protocol.
            <br />
            <span className="font-serif-app italic font-normal opacity-80">Today.</span>
          </h2>
          <p className="text-sm opacity-50 font-serif-app italic">
            Free forever. No account required. No data leaving your device until you say so.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-none mx-auto">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-full btn-solid-invert font-semibold text-sm tracking-wide transition-all shadow-xl flex items-center justify-center gap-2.5 btn-press cursor-pointer"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreOffline}
              className="w-full sm:w-auto px-7 py-4 rounded-full glass-card hover:bg-current/[0.05] transition-all text-xs font-mono tracking-wider uppercase opacity-80 hover:opacity-100 flex items-center justify-center gap-2 btn-press cursor-pointer"
            >
              <HardDrive className="w-3.5 h-3.5" />
              Try Offline
            </button>
          </div>
        </RevealBlock>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="px-4 sm:px-8 lg:px-12 py-6 border-t border-current/[0.07] flex items-center justify-between text-[11px] font-mono opacity-35">
        <span>© 2026 Chrono Matrix</span>
        <span>Minimalist Monochrome Productivity</span>
      </footer>
    </div>
  );
};
