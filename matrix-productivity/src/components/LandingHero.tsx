import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  ArrowRight,
  HardDrive,
  Check,
  X,
  ChevronDown,
  Flame,
  TrendingUp,
  Sparkles,
  Lock,
  Activity,
  Layers,
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
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile viewport for GPU-safe transform reduction
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 1. Hero Scroll Parallax
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroContainerRef,
    offset: ['start start', 'end start'],
  });

  const heroTitleScale = useTransform(heroScroll, [0, 0.7], [1, isMobile ? 0.95 : 0.88]);
  const heroTitleOpacity = useTransform(heroScroll, [0, 0.55], [1, 0.12]);
  const heroTitleY = useTransform(heroScroll, [0, 0.7], [0, isMobile ? -30 : -60]);

  // Mockup 3D tilt-to-flat animation
  const mockupY = useTransform(heroScroll, [0, 0.7], [isMobile ? 30 : 90, 0]);
  const mockupRotateX = useTransform(heroScroll, [0, 0.7], [isMobile ? 0 : 14, 0]);
  const mockupScale = useTransform(heroScroll, [0, 0.7], [isMobile ? 0.98 : 0.92, 1]);
  const mockupOpacity = useTransform(heroScroll, [0, 0.25], [0.8, 1]);

  // Interactive sample state inside preview mockup
  const [mockChecks, setMockChecks] = useState<boolean[]>([true, true, true, true, true, false, true]);
  const toggleMockCheck = (index: number) => {
    setMockChecks((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const FAQS = [
    {
      q: 'Is Chrono Matrix truly 100% free with zero paywalls?',
      a: 'Yes, permanently. There are no paid subscriptions, locked premium tiers, ads, or data tracking. All core engines—the 30-day matrix, 1% compounding curve, sleep telemetry, and automated disciplinary tribunal—are fully unlocked forever.',
    },
    {
      q: 'How does the 1% Compounding Curve mathematically work?',
      a: "Rooted in James Clear's atomic habits theorem (1.01^365 = 37.78 vs 0.99^365 = 0.03), Chrono Matrix plots your executed daily rituals against missed commitments. Every checkmark compounds your momentum score upward; skipped days decelerate your trajectory toward baseline.",
    },
    {
      q: 'What is the 2-Day Breach Disciplinary Tribunal?',
      a: "The golden rule of peak performance is 'Never miss twice'. Missing a habit on Day 1 raises a yellow warning. Failing to complete it on Day 2 locks the ritual until a stoic accountability penalty (e.g. cold plunge, 50 pushups, 24h digital detox) is completed and marked served.",
    },
    {
      q: 'Can I use Chrono Matrix offline without creating an account?',
      a: "Yes. Chrono Matrix is an air-gapped Progressive Web App (PWA) built with local-first architecture. Click 'Try Offline Guest Mode' to use every single feature with zero latency. Data is saved directly to your device storage.",
    },
    {
      q: 'How does Chrono Matrix compare to Notion or Habitica?',
      a: 'Unlike Notion (which suffers from laggy database renders and formula bloat) or Habitica (cartoonish game mechanics), Chrono Matrix is designed as a luxury monochrome instrument with instantaneous 1-tap logging, mathematical rigor, and real accountability.',
    },
  ];

  // The 4 Stacked Pillar Cards
  const PILLARS = [
    {
      id: 'matrix',
      num: '01',
      tag: 'DAILY EXECUTION',
      title: 'The 30-Day Ritual Matrix',
      desc: 'High-contrast monochrome habit grid. One-tap execution with zero friction, zero loading delay, and automatic streak calculation.',
      color: 'from-cyan-500/20 to-blue-500/5',
      accentColor: 'text-cyan-400',
      badgeColor: 'border-cyan-500/30 text-cyan-300',
      component: (
        <div className="space-y-3 font-mono text-xs mt-2">
          <div className="flex items-center justify-between pb-2 border-b border-current/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-semibold text-current">Deep Focus Session</span>
            </div>
            <span className="text-[10px] opacity-60">Target: 90m daily</span>
          </div>
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] opacity-40">{day}</span>
                <div
                  className={`w-full aspect-square max-w-[36px] max-h-[36px] rounded-lg flex items-center justify-center transition-all ${
                    i < 6
                      ? 'bg-white text-black font-bold shadow-md shadow-white/10 scale-100'
                      : 'border border-dashed border-current/30 text-current/40'
                  }`}
                >
                  {i < 6 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '·'}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] opacity-75 pt-1">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-400" /> 14-Day Unbroken Streak
            </span>
            <span className="text-emerald-400 font-semibold">85.7% Velocity</span>
          </div>
        </div>
      ),
    },
    {
      id: 'curve',
      num: '02',
      tag: 'MATHEMATICAL MOMENTUM',
      title: 'The 1% Compounding Trajectory',
      desc: 'Watch atomic habit compounding unfold in real-time. Calculated dynamically via differential habit weightings: (1.01)³⁶⁵ = 37.78×.',
      color: 'from-emerald-500/20 to-teal-500/5',
      accentColor: 'text-emerald-400',
      badgeColor: 'border-emerald-500/30 text-emerald-300',
      component: (
        <div className="space-y-3 font-mono text-xs mt-2">
          {/* Mini Vector Curve Preview */}
          <div className="relative h-28 w-full rounded-xl bg-current/[0.02] border border-current/10 p-3 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between text-[10px] opacity-50 z-10">
              <span>Day 1 (Baseline: 1.00×)</span>
              <span className="text-emerald-400 font-bold">Day 365 (Apex: 37.78×)</span>
            </div>
            {/* SVG Visual Curve */}
            <svg className="absolute inset-0 w-full h-full p-2 overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 100">
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 10 85 Q 120 80, 200 45 T 290 12 L 290 95 L 10 95 Z"
                fill="url(#curveGradient)"
              />
              <path
                d="M 10 85 Q 120 80, 200 45 T 290 12"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Exponential Dot */}
              <circle cx="290" cy="12" r="4" fill="#10b981" className="animate-ping opacity-75" />
              <circle cx="290" cy="12" r="3" fill="#ffffff" />
            </svg>
            <div className="flex items-center justify-between text-[11px] z-10 pt-4">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +3,678% Compounded Gain
              </span>
              <span className="opacity-40">Zero Degeneration</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'tribunal',
      num: '03',
      tag: 'DISCIPLINARY SANCTION',
      title: 'Automated 2-Day Breach Tribunal',
      desc: 'Strict accountability with zero excuses. If you miss a commitment two days in a row, the automated tribunal locks your matrix until you serve a designated stoic sanction.',
      color: 'from-rose-500/20 to-orange-500/5',
      accentColor: 'text-rose-400',
      badgeColor: 'border-rose-500/30 text-rose-300',
      component: (
        <div className="space-y-3 font-mono text-xs mt-2">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>SANCTION MANDATE ACTIVE</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-semibold">
                BREACH LEVEL II
              </span>
            </div>
            <p className="text-[11px] opacity-80 leading-relaxed font-serif-app italic text-rose-100">
              "Morning Cardio & Breathwork missed for 48 consecutive hours. Matrix ritual frozen."
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-rose-500/20 text-[10px]">
              <span className="opacity-70">Sanction: 45m Digital Blackout + 30 Burpees</span>
              <span className="text-rose-400 font-semibold underline cursor-pointer">Serve to Unlock →</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sleep',
      num: '04',
      tag: 'CIRCADIAN TELEMETRY',
      title: 'Circadian Sleep & Recovery Engine',
      desc: 'Precision sleep latency and circadian alignment tracking. Directly correlative telemetry linking your sleep quality to habit completion velocity.',
      color: 'from-indigo-500/20 to-purple-500/5',
      accentColor: 'text-indigo-400',
      badgeColor: 'border-indigo-500/30 text-indigo-300',
      component: (
        <div className="space-y-3 font-mono text-xs mt-2">
          <div className="p-3 rounded-xl bg-current/[0.02] border border-current/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="opacity-60">Last Night: 23:15 — 07:05</span>
              <span className="text-indigo-400 font-bold">7h 50m (96% Efficiency)</span>
            </div>
            {/* Visual sleep architecture bar */}
            <div className="w-full h-3 rounded-full bg-current/10 flex overflow-hidden">
              <div className="h-full bg-indigo-500 w-[22%]" title="Deep Sleep (22%)" />
              <div className="h-full bg-blue-400 w-[53%]" title="Core Sleep (53%)" />
              <div className="h-full bg-purple-400 w-[25%]" title="REM Sleep (25%)" />
            </div>
            <div className="flex items-center justify-between text-[10px] opacity-50 pt-1">
              <span>Deep: 1h 44m</span>
              <span>Core: 4h 08m</span>
              <span>REM: 1h 58m</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[var(--bg-app)] text-[var(--text-main)] font-sans-app selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          TOP BRAND HUD & NAVIGATION
      ───────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3.5 backdrop-blur-xl bg-[var(--bg-app)]/80 border-b border-current/[0.07] transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 beacon-pulse" />
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase font-mono">
              CHRONO MATRIX
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full border border-current/15 text-[10px] font-mono opacity-50">
              v2.4 AIR-GAPPED
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onExploreOffline}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono opacity-70 hover:opacity-100 hover:bg-current/5 transition-all cursor-pointer"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Guest Mode</span>
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 py-1.5 rounded-full btn-solid-invert text-xs font-semibold tracking-wide transition-all shadow-md flex items-center gap-1.5 btn-press cursor-pointer"
            >
              <span>Launch Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          PHASE 1: STICKY PARALLAX HERO WITH 3D SPECIMEN UNFOLD
      ───────────────────────────────────────────────────────────── */}
      <section
        ref={heroContainerRef}
        className="relative pt-24 sm:pt-32 pb-16 px-4 sm:px-8 min-h-[140vh] sm:min-h-[160vh]"
      >
        {/* Pinned Sticky Content */}
        <div className="sticky top-20 sm:top-28 flex flex-col items-center justify-center max-w-5xl mx-auto text-center">
          
          {/* Animated Hero Narrative */}
          <motion.div
            style={{
              scale: heroTitleScale,
              opacity: heroTitleOpacity,
              y: heroTitleY,
            }}
            className="space-y-5 max-w-3xl mx-auto px-2"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-card text-[11px] font-mono tracking-widest uppercase opacity-80">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>THE MONOCHROME HABIT ARCHITECTURE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              One percent better,
              <br />
              <span className="font-serif-app italic font-normal opacity-90">
                every single day.
              </span>
            </h1>

            <p className="max-w-xl mx-auto text-sm sm:text-base font-serif-app italic opacity-65 leading-relaxed">
              An air-gapped productivity apparatus engineered for relentless execution.
              Zero gamified distractions, zero cloud latency, mathematically compounded consistency.
            </p>

            {/* Hero Action Trigger */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 max-w-sm sm:max-w-none mx-auto">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full btn-solid-invert font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-2xl flex items-center justify-center gap-2.5 btn-press cursor-pointer"
              >
                <span>Initialize Tracker</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onExploreOffline}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full glass-card hover:bg-current/[0.05] transition-all text-xs font-mono tracking-wider uppercase opacity-80 hover:opacity-100 flex items-center justify-center gap-2 btn-press cursor-pointer"
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>1-Tap Offline Guest Mode</span>
              </button>
            </div>
          </motion.div>

          {/* 3D Angled Interactive Specimen Deck Mockup (Un-tilts dynamically on scroll) */}
          <motion.div
            style={{
              y: mockupY,
              rotateX: mockupRotateX,
              scale: mockupScale,
              opacity: mockupOpacity,
              transformPerspective: 1200,
            }}
            className="w-full max-w-4xl mt-10 sm:mt-12 px-2"
          >
            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-current/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden backdrop-blur-2xl">
              
              {/* Device Window Top Bar */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-current/10 text-xs font-mono">
                <div className="flex items-center gap-2 opacity-70">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <span className="ml-2 font-semibold tracking-wider text-[11px] uppercase">
                    CHRONO MATRIX · PROTOCOL V2
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-amber-400" /> 14d Active Streak
                  </span>
                  <span className="opacity-30">|</span>
                  <span className="text-emerald-400 font-bold">100% Zero-Cloud Storage</span>
                </div>
              </div>

              {/* Live Interactive Specimen Table Mockup */}
              <div className="space-y-2 text-left font-mono">
                <div className="flex items-center justify-between p-3 rounded-xl bg-current/[0.03] border border-current/[0.07] hover:border-current/20 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-xs truncate">Deep Cognitive Sprint (90m)</div>
                      <div className="text-[10px] opacity-40">Ritual Class: High Leverage</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {mockChecks.map((checked, i) => (
                      <button
                        key={i}
                        onClick={() => toggleMockCheck(i)}
                        title={`Toggle Day ${i + 1}`}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          checked
                            ? 'bg-white text-black font-bold shadow-md shadow-white/20 scale-105'
                            : 'border border-current/20 text-transparent hover:border-current/50'
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-current/[0.03] border border-current/[0.07]">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-xs truncate">Cardiovascular / Heavy Compound Lift</div>
                      <div className="text-[10px] opacity-40">Ritual Class: Biological Foundation</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {[true, true, true, true, true, true, false].map((c, i) => (
                      <div
                        key={i}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          c ? 'bg-white text-black font-bold shadow-md shadow-white/10' : 'border border-current/20 text-current/30'
                        }`}
                      >
                        {c ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '·'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry Footer */}
              <div className="mt-4 pt-3.5 border-t border-current/10 flex items-center justify-between text-[11px] font-mono opacity-70">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Activity className="w-3.5 h-3.5" />
                  Momentum Coefficient: 1.01^365 = 37.8× Exponential
                </span>
                <span className="hidden sm:inline opacity-50">Click squares to test 1-tap physics</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          PHASE 2: THE 4 PILLARS STICKY STACKING DECK
          (Silky, high-end scroll animation that stacks natively on mobile)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-8 py-20 max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-current/15 text-[10px] font-mono tracking-widest uppercase opacity-70">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>ARCHITECTURAL SYSTEMS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Designed for unyielding consistency.
          </h2>
          <p className="max-w-xl mx-auto text-sm opacity-60 font-serif-app italic">
            Scroll through the four foundational pillars that separate Chrono Matrix from conventional habit trackers.
          </p>
        </div>

        {/* The Stacking Deck Cards */}
        <div className="space-y-8 sm:space-y-12">
          {PILLARS.map((pillar, index) => (
            <div
              key={pillar.id}
              className="sticky top-24 sm:top-28 transition-transform"
              style={{
                zIndex: index + 10,
              }}
            >
              <div
                className={`glass-card rounded-3xl p-6 sm:p-9 border border-current/15 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl bg-gradient-to-br ${pillar.color} relative overflow-hidden`}
              >
                {/* Header Tag and Number */}
                <div className="flex items-center justify-between pb-4 border-b border-current/10">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider border ${pillar.badgeColor}`}>
                    {pillar.tag}
                  </span>
                  <span className="text-2xl sm:text-3xl font-mono font-bold opacity-30">
                    {pillar.num}
                  </span>
                </div>

                {/* Content Body */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mt-5">
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-current">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm opacity-70 leading-relaxed font-serif-app italic">
                      {pillar.desc}
                    </p>
                  </div>
                  
                  {/* Live Interactive Specimen Preview */}
                  <div className="w-full">
                    {pillar.component}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          PHASE 3: THE COMPOUNDING CALCULUS METRICS
      ───────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 py-20 border-t border-current/10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center font-mono">
            <div className="p-5 rounded-2xl glass-card border border-current/10 space-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-emerald-400 tracking-tight">37.78×</div>
              <div className="text-[10px] uppercase opacity-50 tracking-wider">Annual 1% Growth</div>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-current/10 space-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-current tracking-tight">0 ms</div>
              <div className="text-[10px] uppercase opacity-50 tracking-wider">Offline Latency</div>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-current/10 space-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-cyan-400 tracking-tight">100%</div>
              <div className="text-[10px] uppercase opacity-50 tracking-wider">Free Forever</div>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-current/10 space-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-purple-400 tracking-tight">Zero</div>
              <div className="text-[10px] uppercase opacity-50 tracking-wider">Cloud Dependencies</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          PHASE 4: COLLAPSIBLE SYSTEM SPECS & COMPARISON TABLE
      ───────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 py-12 border-t border-current/10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-center">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="text-xs font-mono opacity-70 hover:opacity-100 px-5 py-2.5 rounded-full glass-card transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>{showComparison ? 'Collapse' : 'Inspect'} Full System Specs vs Competitors</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${showComparison ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden space-y-8"
              >
                {/* Comparison Table */}
                <div className="glass-card rounded-2xl overflow-x-auto border border-current/15">
                  <table className="w-full text-left text-xs font-mono min-w-[520px]">
                    <thead>
                      <tr className="border-b border-current/10 bg-current/[0.03]">
                        <th className="py-3 px-4 opacity-50">Feature Capability</th>
                        <th className="py-3 px-4 font-bold text-current bg-current/[0.06]">Chrono Matrix</th>
                        <th className="py-3 px-4 opacity-50">Notion</th>
                        <th className="py-3 px-4 opacity-50">Habitica</th>
                        <th className="py-3 px-4 opacity-50">Streaks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-current/[0.07]">
                      {[
                        ['100% Free / Zero Paywalls', 'Free Forever', 'Free / $10/mo', '$5/mo', '$5.99'],
                        ['1% Mathematical Compounding Curve', 'Built-in Vector Math', null, null, null],
                        ['Automated 2-Day Breach Sanctions', 'Enforced Lockdown', null, 'Health loss', null],
                        ['Air-Gapped Offline PWA', 'Instant Guest Mode', null, null, 'iOS only'],
                        ['Local Data Sovereignty (JSON Export)', '1-Click Portability', 'Complex API', null, 'iCloud only'],
                      ].map(([cap, cm, n, h, s]) => (
                        <tr key={cap as string}>
                          <td className="py-3 px-4 font-semibold">{cap}</td>
                          <td className="py-3 px-4 text-emerald-400 font-bold bg-current/[0.06]">
                            <Check className="w-3.5 h-3.5 inline mr-1 stroke-[3]" />{cm}
                          </td>
                          <td className="py-3 px-4 opacity-60">
                            {n ? n : <X className="w-3.5 h-3.5 inline text-rose-400" />}
                          </td>
                          <td className="py-3 px-4 opacity-60">
                            {h ? h : <X className="w-3.5 h-3.5 inline text-rose-400" />}
                          </td>
                          <td className="py-3 px-4 opacity-60">
                            {s ? (
                              <>
                                <Check className="w-3.5 h-3.5 inline text-emerald-400 mr-1" />{s}
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

                {/* FAQ Accordion */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider opacity-50 text-center mb-3">
                    Frequently Asked Questions
                  </div>
                  {FAQS.map((faq, idx) => (
                    <div key={idx} className="glass-card rounded-2xl border border-current/10 overflow-hidden">
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full py-4 px-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold opacity-90 hover:opacity-100 cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openFaq === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-4 text-xs opacity-70 leading-relaxed font-serif-app italic border-t border-current/5 pt-3">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          PHASE 5: BOTTOM TERMINAL LAUNCHPAD
      ───────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 py-20 sm:py-28 border-t border-current/10 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center mx-auto border border-current/20 shadow-xl">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Stop starting over.
            <br />
            <span className="font-serif-app italic font-normal opacity-75">
              Execute with mathematical discipline.
            </span>
          </h2>

          <p className="text-xs sm:text-sm opacity-60 font-serif-app italic max-w-md mx-auto">
            100% free forever. No account creation required to start. Zero telemetry leaves your machine.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-sm sm:max-w-none mx-auto">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-full btn-solid-invert font-semibold text-sm tracking-wide transition-all shadow-2xl flex items-center justify-center gap-2 btn-press cursor-pointer"
            >
              <span>Initialize Chrono Matrix</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreOffline}
              className="w-full sm:w-auto px-7 py-4 rounded-full glass-card hover:bg-current/10 transition-all text-xs font-mono tracking-wider uppercase opacity-80 hover:opacity-100 flex items-center justify-center gap-2 btn-press cursor-pointer"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Explore as Guest</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-8 py-6 border-t border-current/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono opacity-40 gap-2">
        <span>CHRONO MATRIX · MINIMALIST MONOCHROME PRODUCTIVITY</span>
        <span>ZERO SUBSCRIPTIONS · OPEN SPECIFICATION 2026</span>
      </footer>
    </div>
  );
};
