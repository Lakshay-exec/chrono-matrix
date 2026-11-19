import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const SECTIONS = [
  { id: 'landing-pillar-matrix',   label: 'MATRIX',   sub: 'Daily Rituals',   color: '#22d3ee' },
  { id: 'landing-pillar-curve',    label: 'CURVE',    sub: '1% Math',         color: '#10b981' },
  { id: 'landing-pillar-tribunal', label: 'TRIBUNAL', sub: 'Accountability',  color: '#f43f5e' },
  { id: 'landing-pillar-sleep',    label: 'SLEEP',    sub: 'Circadian',       color: '#818cf8' },
];

// Fan of 4 arms spreading upper-left to upper-right from bottom-right orb
const ANGLES_DEG = [-148, -108, -72, -32];
const ARM_LENGTH = 125;

interface RadialNavProps {
  onScrollToSection: (id: string) => void;
}

export const RadialNav: React.FC<RadialNavProps> = ({ onScrollToSection }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(p => !p);

  const go = useCallback((id: string) => {
    if (onScrollToSection) {
      onScrollToSection(id);
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpen(false);
  }, [onScrollToSection]);

  return (
    <>
      {/* Dim backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-[var(--bg-app)]/70 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Orb + orbiting nav items */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Reference square — same size as the orb (56px), items radiate from its center */}
        <div className="relative w-14 h-14">

          {/* SVG: connector lines from center to each node */}
          <AnimatePresence>
            {open && (
              <svg
                key="svg-arms"
                className="absolute pointer-events-none overflow-visible"
                style={{ width: 1, height: 1, left: 28, top: 28 }}
              >
                {ANGLES_DEG.map((deg, i) => {
                  const rad = (deg * Math.PI) / 180;
                  const ex = Math.cos(rad) * ARM_LENGTH;
                  const ey = Math.sin(rad) * ARM_LENGTH;
                  return (
                    <motion.line
                      key={i}
                      x1={0} y1={0} x2={ex} y2={ey}
                      stroke="currentColor"
                      strokeWidth="0.75"
                      strokeOpacity={0.18}
                      strokeDasharray="3 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      exit={{ pathLength: 0, opacity: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.05 }}
                    />
                  );
                })}
              </svg>
            )}
          </AnimatePresence>

          {/* Nav item nodes */}
          <AnimatePresence>
            {open && ANGLES_DEG.map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const tx = Math.cos(rad) * ARM_LENGTH;
              const ty = Math.sin(rad) * ARM_LENGTH;
              const s = SECTIONS[i];
              // Label placement: left-side items → label to the right; right-side → label to the left
              const isLeft = tx < -20;
              return (
                <motion.button
                  key={s.id}
                  onClick={() => go(s.id)}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                  animate={{ x: tx, y: ty, opacity: 1, scale: 1 }}
                  exit={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                  transition={{
                    type: 'spring', stiffness: 480, damping: 26, mass: 0.7,
                    delay: i * 0.045,
                    opacity: { duration: 0.15, delay: i * 0.045 },
                  }}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute cursor-pointer group"
                  style={{ left: 28, top: 28 }}
                  aria-label={`Navigate to ${s.label}`}
                >
                  {/* Node dot */}
                  <div
                    className="w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-150 shadow-lg"
                    style={{
                      backgroundColor: s.color,
                      boxShadow: `0 0 10px ${s.color}66`,
                    }}
                  />
                  {/* Label */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none ${
                      isLeft ? 'right-5 text-right' : 'left-5 text-left'
                    }`}
                  >
                    <div className="text-[9px] font-mono font-bold tracking-[0.18em]" style={{ color: s.color }}>
                      {s.label}
                    </div>
                    <div className="text-[8px] opacity-50 font-mono">{s.sub}</div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>

          {/* The main orb */}
          <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            className="relative w-14 h-14 rounded-full glass-card border border-current/20 flex items-center justify-center cursor-pointer z-10"
            aria-label="Open section navigation"
          >
            {/* Pulse ring (only when closed) */}
            {!open && (
              <div className="absolute inset-0 rounded-full border border-white/15 animate-ping opacity-40 pointer-events-none" />
            )}
            {/* Icon: rotates to × when open */}
            <motion.div
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
            >
              <Plus className="w-5 h-5" strokeWidth={1.5} />
            </motion.div>
            {/* Inner glow */}
            {open && (
              <div className="absolute inset-0 rounded-full bg-white/[0.04]" />
            )}
          </motion.button>
        </div>

        {/* "NAV" label below orb */}
        <div className="text-center mt-1.5">
          <span className="text-[8px] font-mono tracking-[0.2em] opacity-25">NAV</span>
        </div>
      </div>
    </>
  );
};
