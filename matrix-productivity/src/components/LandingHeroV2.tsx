import React, { useState, useRef, useEffect } from 'react';
import { RadialNav } from './RadialNav';
import {
  motion,
  useScroll,
  AnimatePresence,
  useInView,
  useSpring,
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

// ─── Props (same interface as LandingHero) ───────────────────────────────────
interface LandingHeroProps {
  onGetStarted: () => void;
  onExploreOffline: () => void;
  isLight: boolean;
  onRealmChange?: (realm: string) => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

// ─── Live Clock ───────────────────────────────────────────────────────────────
const LiveClock: React.FC = () => {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const p = (n: number) => String(n).padStart(2, '0');
  return (
    <span className="font-mono tabular-nums text-[11px] opacity-40 tracking-widest">
      {p(t.getHours())}:{p(t.getMinutes())}:{p(t.getSeconds())}
    </span>
  );
};

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────
const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[1.5px] bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 origin-left"
      style={{ scaleX }}
    />
  );
};

// ─── Blur-Reveal (Aceternity Text Generate Effect) ────────────────────────────
interface BlurRevealProps {
  text: string;
  className?: string;
  delay?: number;
  splitBy?: 'char' | 'word';
}
const BlurReveal: React.FC<BlurRevealProps> = ({
  text, className = '', delay = 0, splitBy = 'char',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });
  const tokens = splitBy === 'word' ? text.split(' ') : text.split('');
  return (
    <span ref={ref} className={`inline ${className}`}>
      {tokens.map((tk, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{
            duration: 0.6,
            delay: delay + i * (splitBy === 'word' ? 0.08 : 0.03),
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {tk === ' ' ? '\u00A0' : tk}
          {splitBy === 'word' && i < tokens.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  );
};

// ─── Animated CountUp ─────────────────────────────────────────────────────────
interface CountUpProps { to: number; suffix?: string; decimals?: number; duration?: number }
const CountUp: React.FC<CountUpProps> = ({ to, suffix = '', decimals = 0, duration = 1.6 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(parseFloat((eased * to).toFixed(decimals)));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(to);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration, decimals]);
  return (
    <span ref={ref} className="tabular-nums">
      {decimals > 0 ? val.toFixed(decimals) : Math.round(val)}{suffix}
    </span>
  );
};

// ─── Infinite Horizontal Ticker ───────────────────────────────────────────────
const TICKER_ITEMS = [
  '1% COMPOUNDING', '37.78× ANNUAL GROWTH', '0ms OFFLINE LATENCY',
  '100% FREE FOREVER', '2-DAY BREACH TRIBUNAL', 'CIRCADIAN ALIGNMENT',
  'AIR-GAPPED PWA', 'LOCAL-FIRST ARCHITECTURE', 'ZERO TELEMETRY',
  'MATHEMATICAL DISCIPLINE', 'MONOCHROME EXECUTION',
];

const InfiniteTicker: React.FC = () => {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker-wrapper overflow-hidden relative select-none">
      <div className="ticker-fade-left absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" />
      <div className="ticker-fade-right absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" />
      <motion.div
        className="inline-flex gap-0 py-2"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
        style={{ width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="text-[9px] sm:text-[10px] font-mono tracking-[0.22em] opacity-35 uppercase whitespace-nowrap px-6">
            {item}
            <span className="opacity-30 ml-6">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// ─── Beam Lines (Aceternity Background Beams) ─────────────────────────────────
const BeamLines: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
    {[0, 1, 2, 3, 4, 5].map(i => (
      <motion.div
        key={i}
        className="absolute h-px"
        style={{
          top: `${12 + i * 15}%`,
          left: '-25%',
          right: '-25%',
          transform: 'rotate(-6deg)',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.045) 40%, rgba(255,255,255,0.045) 60%, transparent 100%)',
        }}
        animate={{ x: ['-8%', '8%', '-8%'], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 9 + i * 2.3, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
      />
    ))}
  </div>
);

// ─── Lamp Effect (Aceternity Lamp) ────────────────────────────────────────────
const LampEffect: React.FC = () => (
  <div className="absolute inset-0 flex flex-col items-center pointer-events-none overflow-hidden" aria-hidden>
    {/* Top horizontal beam */}
    <motion.div
      initial={{ width: '6rem', opacity: 0.4 }}
      animate={{ width: '28rem', opacity: 1 }}
      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-0 h-px"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.65), transparent)' }}
    />
    {/* Vertical cone */}
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-px"
      style={{
        height: '45%',
        background: 'linear-gradient(to bottom, rgba(34,211,238,0.5) 0%, transparent 100%)',
        filter: 'blur(1.5px)',
      }}
    />
    {/* Floor glow pool */}
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2"
      style={{
        width: '40rem',
        height: '18rem',
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(34,211,238,0.14) 0%, transparent 70%)',
        filter: 'blur(32px)',
      }}
    />
    {/* Secondary warm glow */}
    <div
      className="absolute top-10 left-1/2 -translate-x-1/2"
      style={{
        width: '20rem',
        height: '10rem',
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16,185,129,0.08) 0%, transparent 70%)',
        filter: 'blur(24px)',
      }}
    />
  </div>
);

// ─── Momentum Gauge SVG ───────────────────────────────────────────────────────
const MomentumGauge: React.FC<{ percent: number }> = ({ percent }) => {
  const p = Math.max(0, Math.min(1, percent / 100));
  const value = (1 + 36.78 * p).toFixed(2);
  const totalSweep = 220;
  const startAngleDeg = 160;
  const endAngleDeg = startAngleDeg + totalSweep * p;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const cx = 100, cy = 100, r = 72;
  const arcPath = (fromDeg: number, toDeg: number) => {
    const sx = cx + r * Math.cos(toRad(fromDeg));
    const sy = cy + r * Math.sin(toRad(fromDeg));
    const ex = cx + r * Math.cos(toRad(toDeg));
    const ey = cy + r * Math.sin(toRad(toDeg));
    const large = toDeg - fromDeg > 180 ? 1 : 0;
    return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
  };
  const needleAngle = startAngleDeg + totalSweep * p;
  const nx = cx + 56 * Math.cos(toRad(needleAngle));
  const ny = cy + 56 * Math.sin(toRad(needleAngle));

  return (
    <svg viewBox="0 0 200 160" className="w-40 sm:w-48 mx-auto" aria-label={`Momentum ${value}×`}>
      <path
        d={arcPath(startAngleDeg, startAngleDeg + totalSweep)}
        fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="6" strokeLinecap="round"
      />
      {p > 0.01 && (
        <path
          d={arcPath(startAngleDeg, endAngleDeg)}
          fill="none" stroke="#22d3ee" strokeWidth="6" strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.5))' }}
        />
      )}
      <line
        x1={cx} y1={cy} x2={nx} y2={ny}
        stroke="white" strokeWidth="2" strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={5} fill="white" fillOpacity="0.9" />
      <text x={cx} y={cy + 36} textAnchor="middle" fontSize="18" fontWeight="bold"
        fill="#22d3ee" fontFamily="monospace">{value}×</text>
      <text x={cx} y={cy - 82} textAnchor="middle" fontSize="7" fill="white" fillOpacity="0.3"
        fontFamily="monospace" letterSpacing="3">MOMENTUM COEFFICIENT</text>
    </svg>
  );
};

// ─── Pillar Data ──────────────────────────────────────────────────────────────
const PILLARS = [
  {
    id: 'matrix', num: '01', tag: 'DAILY EXECUTION', title: 'The 30-Day Ritual Matrix',
    desc: 'High-contrast monochrome habit grid. One-tap execution with zero friction, zero loading delay, and automatic streak calculation.',
    color: 'from-cyan-500/15 to-blue-500/5', accentColor: 'text-cyan-400',
    badgeColor: 'border-cyan-500/30 text-cyan-300', glowColor: 'rgba(34,211,238,0.12)',
    component: (
      <div className="space-y-3 font-mono text-xs mt-2">
        <div className="flex items-center justify-between pb-2 border-b border-current/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-semibold">Deep Focus Session</span>
          </div>
          <span className="text-[10px] opacity-60">Target: 90m daily</span>
        </div>
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {['M','T','W','T','F','S','S'].map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] opacity-40">{day}</span>
              <div className={`w-full aspect-square max-w-[36px] rounded-lg flex items-center justify-center transition-all ${
                i < 6 ? 'bg-white text-black font-bold shadow-md shadow-white/10' : 'border border-dashed border-current/30 text-current/40'
              }`}>
                {i < 6 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '·'}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-[11px] opacity-75 pt-1">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Flame className="w-3.5 h-3.5 fill-amber-400" /> 14-Day Streak
          </span>
          <span className="text-emerald-400 font-semibold">85.7% Velocity</span>
        </div>
      </div>
    ),
  },
  {
    id: 'curve', num: '02', tag: 'MATHEMATICAL MOMENTUM', title: 'The 1% Compounding Trajectory',
    desc: 'Watch atomic habit compounding unfold in real-time. Calculated via differential habit weightings: (1.01)³⁶⁵ = 37.78×.',
    color: 'from-emerald-500/15 to-teal-500/5', accentColor: 'text-emerald-400',
    badgeColor: 'border-emerald-500/30 text-emerald-300', glowColor: 'rgba(16,185,129,0.12)',
    component: (
      <div className="relative h-32 w-full rounded-xl bg-current/[0.02] border border-current/10 p-3 overflow-hidden font-mono text-xs">
        <div className="flex items-center justify-between text-[10px] opacity-50">
          <span>Day 1 (1.00×)</span><span className="text-emerald-400 font-bold">Day 365 (37.78×)</span>
        </div>
        <svg className="absolute inset-0 w-full h-full p-2 overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 100">
          <defs>
            <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M 10 85 Q 120 80, 200 45 T 290 12 L 290 95 L 10 95 Z" fill="url(#cg)" />
          <path d="M 10 85 Q 120 80, 200 45 T 290 12" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="290" cy="12" r="4" fill="#10b981" className="animate-ping opacity-75" />
          <circle cx="290" cy="12" r="3" fill="#ffffff" />
        </svg>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
          <TrendingUp className="w-3.5 h-3.5" /> +3,678% Compounded Gain
        </div>
      </div>
    ),
  },
  {
    id: 'tribunal', num: '03', tag: 'DISCIPLINARY SANCTION', title: 'Automated 2-Day Breach Tribunal',
    desc: 'If you miss a commitment two days in a row, the tribunal locks your matrix until you serve a designated stoic sanction.',
    color: 'from-rose-500/15 to-orange-500/5', accentColor: 'text-rose-400',
    badgeColor: 'border-rose-500/30 text-rose-300', glowColor: 'rgba(244,63,94,0.12)',
    component: (
      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <Lock className="w-3.5 h-3.5" /><span>SANCTION MANDATE ACTIVE</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-semibold">BREACH II</span>
        </div>
        <p className="text-[11px] opacity-80 leading-relaxed italic text-rose-100">
          "Morning Cardio missed for 48 consecutive hours. Matrix ritual frozen."
        </p>
        <div className="flex items-center justify-between pt-1 border-t border-rose-500/20 text-[10px]">
          <span className="opacity-70">Sanction: 45m Digital Blackout + 30 Burpees</span>
          <span className="text-rose-400 font-semibold">Serve to Unlock →</span>
        </div>
      </div>
    ),
  },
  {
    id: 'sleep', num: '04', tag: 'CIRCADIAN TELEMETRY', title: 'Circadian Sleep & Recovery Engine',
    desc: 'Precision sleep latency and circadian alignment tracking. Correlative telemetry linking sleep quality to habit completion velocity.',
    color: 'from-indigo-500/15 to-purple-500/5', accentColor: 'text-indigo-400',
    badgeColor: 'border-indigo-500/30 text-indigo-300', glowColor: 'rgba(129,140,248,0.12)',
    component: (
      <div className="p-3 rounded-xl bg-current/[0.02] border border-current/10 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="opacity-60">23:15 — 07:05</span>
          <span className="text-indigo-400 font-bold">7h 50m (96% Efficiency)</span>
        </div>
        <div className="w-full h-3 rounded-full bg-current/10 flex overflow-hidden">
          <div className="h-full bg-indigo-500 w-[22%]" />
          <div className="h-full bg-blue-400 w-[53%]" />
          <div className="h-full bg-purple-400 w-[25%]" />
        </div>
        <div className="flex justify-between text-[10px] opacity-50">
          <span>Deep: 1h 44m</span><span>Core: 4h 08m</span><span>REM: 1h 58m</span>
        </div>
      </div>
    ),
  },
];

// ─── Mock ritual rows for the system section ──────────────────────────────────
const MOCK_ROWS = [
  { name: 'Deep Cognitive Sprint (90m)', cls: 'High Leverage',       dot: 'bg-cyan-400',    checks: [1,1,1,1,1,1,0] },
  { name: 'Cardiovascular / Heavy Lift', cls: 'Biological Foundation', dot: 'bg-emerald-400', checks: [1,1,1,1,1,1,1] },
  { name: 'Cold Exposure (10m)',         cls: 'Hormonal Reset',       dot: 'bg-sky-400',     checks: [1,0,1,1,0,1,1] },
  { name: 'Meditation (20m)',            cls: 'Cognitive Architecture',dot: 'bg-purple-400',  checks: [1,1,1,0,1,1,1] },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export const LandingHeroV2: React.FC<LandingHeroProps> = ({
  onGetStarted, onExploreOffline, onRealmChange, onOpenPrivacy, onOpenTerms,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // ── Realm change on scroll ──────────────────────────────────────────────────
  useEffect(() => {
    if (!onRealmChange) return;
    const sections = [
      { id: 'lhv2-hero', realm: 'hero' },
      { id: 'landing-pillar-matrix', realm: 'section-matrix' },
      { id: 'landing-pillar-curve', realm: 'section-curve' },
      { id: 'landing-pillar-tribunal', realm: 'section-accountability' },
      { id: 'landing-pillar-sleep', realm: 'section-sleep' },
    ];
    const obs: IntersectionObserver[] = [];
    sections.forEach(({ id, realm }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) onRealmChange(realm); },
        { threshold: 0.25 }
      );
      o.observe(el); obs.push(o);
    });
    return () => obs.forEach(o => o.disconnect());
  }, [onRealmChange]);

  // Interactive Momentum Gauge state
  const [gaugePercent, setGaugePercent] = useState(72);
  const gaugeValue = (1 + 36.78 * (gaugePercent / 100)).toFixed(2);

  // Interactive mock rows state
  const [heroChecks, setHeroChecks] = useState<Record<number, boolean[]>>({
    0: [true, true, true, true, true, true, false],
    1: [true, true, true, true, true, true, true],
    2: [true, false, true, true, false, true, true],
    3: [true, true, true, false, true, true, true],
  });

  const toggleHeroCheck = (rowIdx: number, dayIdx: number) => {
    setHeroChecks((prev) => {
      const row = [...(prev[rowIdx] || [false, false, false, false, false, false, false])];
      row[dayIdx] = !row[dayIdx];
      return { ...prev, [rowIdx]: row };
    });
  };

  const FAQS = [
    { q: 'Is Chrono Matrix truly 100% free?', a: 'Yes, permanently. No paid tiers, ads, or data tracking. All features unlocked forever.' },
    { q: 'How does 1% Compounding work?', a: '1.01^365 = 37.78 vs 0.99^365 = 0.03. Every checkmark compounds momentum upward; skipped days decelerate toward baseline.' },
    { q: 'What is the 2-Day Breach Tribunal?', a: 'Never miss twice. Missing Day 1 raises a warning. Missing Day 2 locks the ritual until a stoic accountability penalty is served.' },
    { q: 'Can I use it offline without an account?', a: 'Yes. Chrono Matrix is a local-first PWA. Try Offline Guest Mode to use every feature with zero latency.' },
  ];

  return (
    <div className="w-full bg-[var(--bg-app)] text-[var(--text-main)] font-sans-app overflow-x-hidden selection:bg-white selection:text-black">
      <ScrollProgressBar />

      {/* ════════════════════════════════════════════════════════════════
          FIXED HEADER — Minimal
      ════════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 px-5 sm:px-10 py-3.5 backdrop-blur-xl bg-[var(--bg-app)]/80 border-b border-current/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 beacon-pulse" />
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.18em] uppercase">Chrono Matrix</span>
          <span className="hidden sm:block px-2 py-0.5 rounded-full border border-current/12 text-[9px] font-mono opacity-40">v2.4</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExploreOffline}
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono opacity-50 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <HardDrive className="w-3 h-3" /> Guest Mode
          </button>
          <button
            onClick={onGetStarted}
            className="px-4 py-1.5 rounded-full btn-solid-invert text-[11px] font-mono font-semibold tracking-wide flex items-center gap-1.5 btn-press btn-shimmer cursor-pointer"
          >
            Launch <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 1 — HERO SECTION (Seamless, No Dead Zones)
      ════════════════════════════════════════════════════════════════ */}
      <section id="lhv2-hero" className="relative min-h-[92vh] flex flex-col justify-between pt-16 sm:pt-20 pb-10 overflow-hidden">
        <BeamLines />

        {/* Ticker tape */}
        <div className="mt-2 border-b border-current/[0.06] border-t border-current/[0.03]">
          <InfiniteTicker />
        </div>

        {/* Main content grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center max-w-7xl mx-auto w-full px-5 sm:px-10 py-8 sm:py-12">

          {/* LEFT: Editorial headline */}
          <div className="space-y-6 relative z-10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-current/15 text-[9px] font-mono tracking-[0.25em] opacity-60 uppercase mb-3">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>THE MONOCHROME HABIT ARCHITECTURE</span>
              </div>
              <h1 className="font-bold leading-[0.92] tracking-[-0.04em]">
                <BlurReveal
                  text="HABIT"
                  className="block text-[13vw] sm:text-[9vw] md:text-[6.5vw] lg:text-[5.5rem]"
                  delay={0.1}
                />
                <BlurReveal
                  text="ARCHI-"
                  className="block text-[13vw] sm:text-[9vw] md:text-[6.5vw] lg:text-[5.5rem] opacity-80"
                  delay={0.22}
                />
                <span className="block font-serif-app italic font-normal text-[9vw] sm:text-[6vw] md:text-[4.5vw] lg:text-[4.2rem] opacity-60 tracking-[-0.02em] mt-1">
                  <BlurReveal text="TECTURE." delay={0.34} />
                </span>
              </h1>
            </div>

            <BlurReveal
              text="An air-gapped apparatus for mathematical compounding. Zero gamified distractions, zero cloud latency."
              className="block text-sm sm:text-base font-serif-app italic opacity-60 max-w-md leading-relaxed"
              splitBy="word"
              delay={0.5}
            />

            {/* Live clock + Status */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 beacon-pulse" />
              <LiveClock />
              <span className="text-[10px] font-mono opacity-30 tracking-widest">SYSTEM OPERATIONAL</span>
            </div>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-3">
              <button
                onClick={onGetStarted}
                className="group w-full sm:w-auto px-8 py-4 rounded-full btn-solid-invert font-semibold text-sm tracking-wide flex items-center justify-center gap-2.5 btn-press btn-shimmer cursor-pointer shadow-2xl"
              >
                <span>Initialize Tracker</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={onExploreOffline}
                className="text-xs font-mono opacity-50 hover:opacity-85 transition-opacity flex items-center gap-2 cursor-pointer underline underline-offset-4 decoration-current/25"
              >
                <HardDrive className="w-3.5 h-3.5" /> No sign-up → Guest Mode
              </button>
            </div>
          </div>

          {/* RIGHT: Interactive Specimen Preview */}
          <div className="relative">
            <div className="glass-card rounded-2xl border border-current/15 p-4 sm:p-5 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.75)] border-beam">
              <div className="border-beam-content p-4 rounded-xl">
                {/* Window chrome */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-current/10 text-xs font-mono">
                  <div className="flex items-center gap-2 opacity-70">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                    </div>
                    <span className="font-semibold tracking-wider text-[10px] uppercase ml-2">CHRONO MATRIX · PROTOCOL V2</span>
                  </div>
                  <span className="text-amber-400 font-bold flex items-center gap-1 text-[10px]">
                    <Flame className="w-3 h-3 fill-amber-400" /> 14d Active Streak
                  </span>
                </div>
                {/* Ritual rows */}
                <div className="space-y-2">
                  {MOCK_ROWS.map((row, ri) => (
                    <div key={ri} className="flex items-center justify-between p-2.5 rounded-xl bg-current/[0.03] border border-current/[0.07] hover:border-current/20 transition-all">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${row.dot}`} />
                        <div>
                          <div className="font-mono font-semibold text-[11px] truncate">{row.name}</div>
                          <div className="text-[9px] opacity-40 font-mono">{row.cls}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {(heroChecks[ri] || row.checks).map((c, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => toggleHeroCheck(ri, i)}
                            title={`Toggle Day ${i + 1}`}
                            className={`w-6 h-6 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                              c ? 'bg-white text-black font-bold shadow-sm shadow-white/10 scale-105' : 'border border-current/15 text-current/30 hover:border-current/40'
                            }`}
                          >
                            {c ? <Check className="w-3 h-3 stroke-[3]" /> : <span className="text-[9px]">·</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Telemetry footer */}
                <div className="mt-3 pt-2.5 border-t border-current/10 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Activity className="w-3 h-3" /> Momentum: 1.01^365 = 37.8×
                  </span>
                  <span className="opacity-40">100% Zero-Cloud Storage</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-1.5 opacity-40 pt-2 pb-1">
          <span className="text-[9px] font-mono tracking-[0.25em] uppercase">Explore Architecture</span>
          <div className="w-px h-6 bg-gradient-to-b from-current via-current/40 to-transparent scroll-line" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 2 — THE COMPOUNDING ENGINE (Fluid, Continuous Flow)
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-10 border-t border-current/[0.07] relative overflow-hidden">
        <BeamLines />
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* LEFT: Gauge + copy */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-[9px] font-mono tracking-[0.3em] opacity-40 uppercase">THE COMPOUNDING ENGINE</div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
                <BlurReveal text="Designed for" splitBy="word" className="block opacity-60 font-serif-app italic font-normal text-2xl sm:text-4xl" />
                <BlurReveal text="unyielding consistency." splitBy="word" className="block" delay={0.15} />
              </h2>
            </div>
            <p className="text-sm opacity-60 font-serif-app italic leading-relaxed max-w-sm">
              Rooted in atomic habit compounding: (1.01)³⁶⁵ = 37.78× vs (0.99)³⁶⁵ = 0.03×. Every checkmark accelerates momentum; missed commitments trigger disciplinary sanctions.
            </p>

            {/* Interactive Momentum Gauge with Slider */}
            <div className="p-5 rounded-2xl glass-card border border-current/10 space-y-4 max-w-md">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="opacity-60">Calculated Compound:</span>
                <span className="text-emerald-400 font-bold text-sm">{gaugeValue}× Annual Gain</span>
              </div>
              <MomentumGauge percent={gaugePercent} />
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={gaugePercent}
                  onChange={(e) => setGaugePercent(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="font-mono text-xs font-bold w-12 text-right">{gaugePercent}%</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono opacity-40">
                <span>Day 1 (1.00×)</span>
                <span>Day 180 (6.00×)</span>
                <span>Day 365 (37.78×)</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Vector Momentum Telemetry Curve */}
          <div className="space-y-4">
            <div className="text-[9px] font-mono tracking-[0.3em] opacity-40 uppercase">VECTOR MOMENTUM TELEMETRY</div>
            <div className="relative h-64 sm:h-72 w-full rounded-2xl glass-card border border-current/15 p-5 overflow-hidden font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] opacity-60 z-10 relative">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Compounding Orbit
                </span>
                <span className="text-emerald-400 font-bold">+3,678% Net Differential</span>
              </div>
              {/* Dynamic Exponential SVG Curve */}
              <svg className="absolute inset-0 w-full h-full p-4 overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 120">
                <defs>
                  <linearGradient id="cgHero" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 10 105 Q 120 100, 200 55 T 290 15 L 290 115 L 10 115 Z" fill="url(#cgHero)" />
                <path d="M 10 105 Q 120 100, 200 55 T 290 15" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                <circle cx="290" cy="15" r="5" fill="#10b981" className="animate-ping opacity-75" />
                <circle cx="290" cy="15" r="3.5" fill="#ffffff" />
              </svg>
              <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-[11px] z-10 pt-4 border-t border-current/10">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> Relentless Daily Elevation
                </span>
                <span className="opacity-50">Zero Friction Local Storage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 3 — 4 PILLARS STICKY STACKING DECK
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative px-5 sm:px-10 py-24 max-w-5xl mx-auto">
        <div className="text-left space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-current/15 text-[9px] font-mono tracking-[0.25em] uppercase opacity-60">
            <Layers className="w-3 h-3 text-cyan-400" /> ARCHITECTURAL SYSTEMS
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em]">
            <BlurReveal text="Four pillars." splitBy="word" /> {' '}
            <span className="font-serif-app italic font-normal opacity-60">
              <BlurReveal text="Infinite compound." splitBy="word" delay={0.2} />
            </span>
          </h2>
        </div>

        <div className="space-y-10 sm:space-y-14">
          {PILLARS.map((pillar, index) => (
            <div
              key={pillar.id}
              id={`landing-pillar-${pillar.id}`}
              className="sticky top-24"
              style={{ zIndex: index + 10 }}
            >
              <div
                className={`glass-card rounded-3xl p-6 sm:p-10 border border-current/15 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl bg-gradient-to-br ${pillar.color} relative overflow-hidden`}
                style={{ boxShadow: `0 24px 60px -15px rgba(0,0,0,0.8), inset 0 0 60px -20px ${pillar.glowColor}` }}
              >
                {/* Number ghost */}
                <div
                  className="absolute -right-4 -top-4 text-[8rem] sm:text-[12rem] font-bold opacity-[0.04] font-mono select-none pointer-events-none leading-none"
                  aria-hidden
                >{pillar.num}</div>

                <div className="flex items-start justify-between pb-5 border-b border-current/10 mb-5">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider border ${pillar.badgeColor}`}>
                    {pillar.tag}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-3">
                    <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${pillar.accentColor}`}>{pillar.title}</h3>
                    <p className="text-xs sm:text-sm opacity-65 leading-relaxed font-serif-app italic">{pillar.desc}</p>
                  </div>
                  <div className="w-full">{pillar.component}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 4 — METRICS GRID
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-5 sm:px-10 py-20 border-t border-current/[0.07]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <BlurReveal text="The numbers speak." className="text-2xl sm:text-3xl font-bold tracking-tight" splitBy="word" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 font-mono">
            {[
              { val: 37.78, suffix: '×', label: 'Annual 1% Growth', color: 'text-emerald-400', dec: 2 },
              { val: 0,     suffix: 'ms', label: 'Offline Latency',  color: 'text-current',    dec: 0 },
              { val: 100,   suffix: '%',  label: 'Free Forever',     color: 'text-cyan-400',    dec: 0 },
              { val: 0,     suffix: '',   label: 'Cloud Dependencies',color: 'text-purple-400', dec: 0 },
            ].map((m, i) => (
              <div key={i} className="p-6 sm:p-8 rounded-2xl glass-card glass-card-hover border border-current/10 space-y-1 text-center">
                <div className={`text-4xl sm:text-5xl font-bold tracking-tight ${m.color}`}>
                  <CountUp to={m.val} suffix={m.suffix} decimals={m.dec} />
                </div>
                <div className="text-[9px] uppercase tracking-wider opacity-45">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 5 — COMPARISON TABLE + FAQ
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-5 sm:px-10 py-12 border-t border-current/[0.07]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-center">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="text-xs font-mono opacity-60 hover:opacity-100 px-5 py-2.5 rounded-full glass-card transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{showComparison ? 'Collapse' : 'Inspect'} Full System Specs vs Competitors</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showComparison ? 'rotate-180' : ''}`} />
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
                <div className="glass-card rounded-2xl overflow-x-auto border border-current/15">
                  <table className="w-full text-left text-xs font-mono min-w-[520px]">
                    <thead>
                      <tr className="border-b border-current/10 bg-current/[0.03]">
                        <th className="py-3 px-4 opacity-50">Feature</th>
                        <th className="py-3 px-4 font-bold bg-current/[0.06]">Chrono Matrix</th>
                        <th className="py-3 px-4 opacity-50">Notion</th>
                        <th className="py-3 px-4 opacity-50">Habitica</th>
                        <th className="py-3 px-4 opacity-50">Streaks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-current/[0.07]">
                      {[
                        ['100% Free / Zero Paywalls', 'Free Forever', 'Free / $10/mo', '$5/mo', '$5.99'],
                        ['1% Mathematical Compounding Curve', 'Built-in', null, null, null],
                        ['Automated 2-Day Breach Sanctions', 'Enforced Lockdown', null, 'Health loss', null],
                        ['Air-Gapped Offline PWA', 'Instant Guest Mode', null, null, 'iOS only'],
                      ].map(([cap, cm, n, h, s]) => (
                        <tr key={cap as string}>
                          <td className="py-3 px-4 font-semibold">{cap}</td>
                          <td className="py-3 px-4 text-emerald-400 font-bold bg-current/[0.06]">
                            <Check className="w-3.5 h-3.5 inline mr-1 stroke-[3]" />{cm}
                          </td>
                          <td className="py-3 px-4 opacity-60">{n || <X className="w-3.5 h-3.5 inline text-rose-400" />}</td>
                          <td className="py-3 px-4 opacity-60">{h || <X className="w-3.5 h-3.5 inline text-rose-400" />}</td>
                          <td className="py-3 px-4 opacity-60">{s ? <><Check className="w-3.5 h-3.5 inline text-emerald-400 mr-1" />{s}</> : <X className="w-3.5 h-3.5 inline text-rose-400" />}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider opacity-40 text-center mb-3">Frequently Asked</div>
                  {FAQS.map((faq, idx) => (
                    <div key={idx} className="glass-card rounded-2xl border border-current/10 overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
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
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-4 text-xs opacity-65 leading-relaxed font-serif-app italic border-t border-current/5 pt-3">
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

      {/* ════════════════════════════════════════════════════════════════
          SECTION 6 — LAMP CTA (Aceternity Lamp Effect)
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative px-5 sm:px-10 py-28 sm:py-36 border-t border-current/[0.07] text-center overflow-hidden">
        <LampEffect />

        <div className="relative z-10 max-w-2xl mx-auto space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-current/15 text-[10px] font-mono tracking-[0.2em] uppercase opacity-70">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Ready to compound
          </div>

          <h2 className="text-4xl sm:text-6xl font-bold tracking-[-0.03em] leading-[0.95]">
            <BlurReveal text="Stop starting" splitBy="word" />
            <br />
            <span className="font-serif-app italic font-normal opacity-70 text-3xl sm:text-5xl">
              <BlurReveal text="over." delay={0.2} />
            </span>
          </h2>

          <p className="text-sm opacity-50 font-serif-app italic max-w-sm mx-auto leading-relaxed">
            100% free forever. No account required. Zero telemetry leaves your machine.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onGetStarted}
              className="group w-full sm:w-auto px-10 py-4 rounded-full btn-solid-invert font-semibold text-sm tracking-wide flex items-center justify-center gap-2.5 btn-press btn-shimmer cursor-pointer shadow-2xl"
            >
              <span>Initialize Chrono Matrix</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={onExploreOffline}
              className="text-xs font-mono opacity-40 hover:opacity-75 transition-opacity flex items-center gap-2 cursor-pointer underline underline-offset-4 decoration-current/20"
            >
              <HardDrive className="w-3.5 h-3.5" /> Explore as Guest
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════ */}
      <footer className="px-5 sm:px-10 py-6 border-t border-current/[0.07] flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono opacity-40 gap-2">
        <div className="flex items-center gap-2">
          <span>CHRONO MATRIX</span>
          <span className="opacity-30">·</span>
          <span>Built by Lakshay</span>
          <span className="opacity-30">·</span>
          <span>2024</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onOpenPrivacy} className="hover:underline hover:opacity-100 cursor-pointer">Privacy Policy</button>
          <span className="opacity-30">·</span>
          <button onClick={onOpenTerms} className="hover:underline hover:opacity-100 cursor-pointer">Terms of Service</button>
        </div>
      </footer>
      {/* ════════════════════════════════════════════════════════════════
          OUT-OF-THE-BOX FLOATING RADIAL NAVIGATION
      ════════════════════════════════════════════════════════════════ */}
      <RadialNav
        onScrollToSection={(id) => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />
    </div>
  );
};
