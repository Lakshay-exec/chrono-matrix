import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type GalaxyRealm =
  | 'hero'
  | 'section-matrix'
  | 'section-curve'
  | 'section-sleep'
  | 'section-accountability';

interface Star {
  id: number;
  x: number; // 0 - 100%
  y: number; // 0 - 100%
  size: number; // px
  baseOpacity: number;
  twinkleDuration: number; // seconds
  twinkleDelay: number; // seconds
  color: string;
  hasSpike?: boolean;
}

interface CosmicBackgroundProps {
  activeRealm?: GalaxyRealm | string;
  potatoMode?: boolean;
  theme?: 'dark' | 'light';
}

// Galaxy Color Palettes & Coordinates
const GALAXY_CONFIGS: Record<
  string,
  {
    name: string;
    coreGlow: string;
    accentGlow: string;
    dustGlow: string;
    rotation: number;
    scale: number;
  }
> = {
  hero: {
    name: 'Cosmic Horizon',
    coreGlow: 'radial-gradient(circle 500px at 50% 35%, rgba(255, 255, 255, 0.04) 0%, rgba(56, 189, 248, 0.035) 40%, transparent 75%)',
    accentGlow: 'radial-gradient(circle 420px at 75% 65%, rgba(168, 85, 247, 0.03) 0%, transparent 70%)',
    dustGlow: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 60%)',
    rotation: 0,
    scale: 1,
  },
  'section-matrix': {
    name: 'Andromeda Cyan Matrix',
    coreGlow: 'radial-gradient(circle 540px at 68% 28%, rgba(6, 182, 212, 0.09) 0%, rgba(14, 165, 233, 0.04) 40%, transparent 75%)',
    accentGlow: 'radial-gradient(circle 460px at 25% 70%, rgba(59, 130, 246, 0.05) 0%, transparent 65%)',
    dustGlow: 'radial-gradient(ellipse 65% 55% at 60% 40%, rgba(6, 182, 212, 0.03) 0%, transparent 70%)',
    rotation: 25,
    scale: 1.05,
  },
  'section-curve': {
    name: 'Exponential Jade Helix',
    coreGlow: 'radial-gradient(circle 560px at 28% 62%, rgba(16, 185, 129, 0.1) 0%, rgba(20, 184, 166, 0.045) 45%, transparent 75%)',
    accentGlow: 'radial-gradient(circle 440px at 80% 25%, rgba(52, 211, 153, 0.04) 0%, transparent 60%)',
    dustGlow: 'radial-gradient(ellipse 75% 60% at 40% 55%, rgba(16, 185, 129, 0.035) 0%, transparent 70%)',
    rotation: -30,
    scale: 1.08,
  },
  'section-sleep': {
    name: 'Circadian Twilight Aurora',
    coreGlow: 'radial-gradient(ellipse 70% 60% at 50% 82%, rgba(99, 102, 241, 0.11) 0%, rgba(168, 85, 247, 0.06) 42%, transparent 75%)',
    accentGlow: 'radial-gradient(circle 480px at 30% 25%, rgba(129, 140, 248, 0.04) 0%, transparent 65%)',
    dustGlow: 'radial-gradient(ellipse 85% 45% at 50% 75%, rgba(99, 102, 241, 0.04) 0%, transparent 65%)',
    rotation: 10,
    scale: 1.02,
  },
  'section-accountability': {
    name: 'Obsidian Crimson Quasar',
    coreGlow: 'radial-gradient(circle 520px at 62% 42%, rgba(244, 63, 94, 0.095) 0%, rgba(249, 115, 22, 0.045) 40%, transparent 72%)',
    accentGlow: 'radial-gradient(circle 460px at 20% 40%, rgba(225, 29, 72, 0.04) 0%, transparent 60%)',
    dustGlow: 'radial-gradient(ellipse 65% 55% at 55% 45%, rgba(244, 63, 94, 0.03) 0%, transparent 70%)',
    rotation: -15,
    scale: 1.06,
  },
};

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  activeRealm = 'hero',
  potatoMode = false,
  theme = 'dark',
}) => {
  // Generate 125 static procedural stars with deterministic distribution
  const stars: Star[] = useMemo(() => {
    const starList: Star[] = [];
    const colors = [
      'rgba(255, 255, 255, 0.95)',
      'rgba(224, 242, 254, 0.9)', // ice blue
      'rgba(254, 243, 199, 0.85)', // warm white
      'rgba(237, 233, 254, 0.85)', // stellar violet
      'rgba(207, 250, 254, 0.9)', // cyan tint
    ];

    // Seeded random helper for stable distribution
    let seed = 42;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const count = 120;
    for (let i = 0; i < count; i++) {
      const sizeSeed = random();
      // Sizes: mostly 1px-1.8px, occasional 2.4px with diffraction spikes
      const size = sizeSeed > 0.93 ? 2.4 : sizeSeed > 0.6 ? 1.5 : 1.0;
      starList.push({
        id: i,
        x: Math.round(random() * 10000) / 100, // percentage 0 - 100
        y: Math.round(random() * 10000) / 100,
        size,
        baseOpacity: Math.round((0.2 + random() * 0.65) * 100) / 100,
        twinkleDuration: Math.round((2.5 + random() * 4.5) * 10) / 10,
        twinkleDelay: Math.round(random() * 5 * 10) / 10,
        color: colors[Math.floor(random() * colors.length)],
        hasSpike: size >= 2.4,
      });
    }
    return starList;
  }, []);

  // Mouse parallax state for desktop
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (potatoMode) return;
    const handleMouseMove = (e: MouseEvent) => {
      // Subtle parallax: -15px to +15px
      const x = ((e.clientX / window.innerWidth) - 0.5) * 20;
      const y = ((e.clientY / window.innerHeight) - 0.5) * 20;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [potatoMode]);

  const currentConfig = GALAXY_CONFIGS[activeRealm] || GALAXY_CONFIGS.hero;

  // Potato mode: ultra-lightweight fallback
  if (potatoMode) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[var(--bg-app)]">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle 1px at 20% 30%, #fff 100%, transparent), radial-gradient(circle 1px at 70% 60%, #fff 100%, transparent), radial-gradient(circle 1px at 40% 80%, #fff 100%, transparent)',
            backgroundSize: '300px 300px',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-700"
      aria-hidden="true"
    >
      {/* 1. Base Deep Cosmic Space Void */}
      <div className="absolute inset-0 bg-[var(--bg-app)] opacity-100" />

      {/* 2. Dynamic Morphing Galaxy / Nebula Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeRealm}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{
            opacity: theme === 'light' ? 0.35 : 1,
            scale: currentConfig.scale,
            rotate: currentConfig.rotation,
          }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translate3d(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px, 0)`,
          }}
        >
          {/* Primary Galaxy Core */}
          <div
            className="absolute inset-0 transition-all duration-1000"
            style={{ backgroundImage: currentConfig.coreGlow }}
          />
          {/* Secondary Nebula Cluster */}
          <div
            className="absolute inset-0 transition-all duration-1000"
            style={{ backgroundImage: currentConfig.accentGlow }}
          />
          {/* Cosmic Dust Veil */}
          <div
            className="absolute inset-0 transition-all duration-1000"
            style={{ backgroundImage: currentConfig.dustGlow }}
          />
        </motion.div>
      </AnimatePresence>

      {/* 3. Random Procedural Starfield */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate3d(${mouseOffset.x * 0.8}px, ${mouseOffset.y * 0.8}px, 0)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              boxShadow: star.size > 1.8 ? `0 0 6px ${star.color}` : 'none',
              animation: `starTwinkle ${star.twinkleDuration}s ease-in-out infinite`,
              animationDelay: `${star.twinkleDelay}s`,
              opacity: star.baseOpacity,
            }}
          >
            {/* Cross diffraction spike on rare bright stars */}
            {star.hasSpike && (
              <>
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/40 pointer-events-none"
                  style={{ width: '9px', height: '1px' }}
                />
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/40 pointer-events-none"
                  style={{ width: '1px', height: '9px' }}
                />
              </>
            )}
          </div>
        ))}
      </div>

      {/* 4. Occasional Celestial Shooting Stars / Meteors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="shooting-star-meteor"
          style={{
            top: '12%',
            left: '85%',
            animationDelay: '1.2s',
          }}
        />
        <div
          className="shooting-star-meteor"
          style={{
            top: '38%',
            left: '92%',
            animationDelay: '8.4s',
          }}
        />
        <div
          className="shooting-star-meteor"
          style={{
            top: '64%',
            left: '78%',
            animationDelay: '16.5s',
          }}
        />
      </div>

      {/* 5. Subtle Cosmic Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle 85% at 50% 50%, transparent 40%, rgba(8, 8, 10, 0.45) 100%)',
        }}
      />
    </div>
  );
};
