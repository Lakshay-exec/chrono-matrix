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
  twinkleDuration: number;
  twinkleDelay: number;
  spectralClass: 'O' | 'A' | 'G' | 'M'; // Blue-giant, White, Solar, Red-dwarf
  hasSpike?: boolean;
}

interface CosmicBackgroundProps {
  activeRealm?: GalaxyRealm | string;
  potatoMode?: boolean;
  theme?: 'dark' | 'light';
}

// Galaxy Morphing Palettes (Dark mode deep space vs Light mode celestial observatory)
const GALAXY_REALMS: Record<
  string,
  {
    name: string;
    coreDark: string;
    coreLight: string;
    nebulaDark: string;
    nebulaLight: string;
    rotation: number;
    scale: number;
  }
> = {
  hero: {
    name: 'Cosmic Horizon',
    coreDark:
      'radial-gradient(ellipse 600px 480px at 50% 38%, rgba(255, 255, 255, 0.05) 0%, rgba(56, 189, 248, 0.04) 30%, transparent 75%)',
    coreLight:
      'radial-gradient(ellipse 600px 480px at 50% 38%, rgba(56, 189, 248, 0.12) 0%, rgba(125, 211, 252, 0.08) 35%, transparent 75%)',
    nebulaDark:
      'radial-gradient(circle 480px at 75% 65%, rgba(168, 85, 247, 0.04) 0%, transparent 68%)',
    nebulaLight:
      'radial-gradient(circle 480px at 75% 65%, rgba(192, 132, 252, 0.08) 0%, transparent 68%)',
    rotation: 0,
    scale: 1,
  },
  'section-matrix': {
    name: 'Andromeda Cyan Matrix',
    coreDark:
      'radial-gradient(circle 620px at 68% 28%, rgba(6, 182, 212, 0.11) 0%, rgba(14, 165, 233, 0.05) 35%, transparent 75%)',
    coreLight:
      'radial-gradient(circle 620px at 68% 28%, rgba(6, 182, 212, 0.15) 0%, rgba(14, 165, 233, 0.09) 35%, transparent 75%)',
    nebulaDark:
      'radial-gradient(circle 500px at 25% 72%, rgba(59, 130, 246, 0.06) 0%, transparent 65%)',
    nebulaLight:
      'radial-gradient(circle 500px at 25% 72%, rgba(59, 130, 246, 0.1) 0%, transparent 65%)',
    rotation: 28,
    scale: 1.05,
  },
  'section-curve': {
    name: 'Exponential Jade Helix',
    coreDark:
      'radial-gradient(circle 640px at 28% 62%, rgba(16, 185, 129, 0.12) 0%, rgba(20, 184, 166, 0.055) 40%, transparent 75%)',
    coreLight:
      'radial-gradient(circle 640px at 28% 62%, rgba(16, 185, 129, 0.15) 0%, rgba(20, 184, 166, 0.09) 40%, transparent 75%)',
    nebulaDark:
      'radial-gradient(circle 480px at 80% 25%, rgba(52, 211, 153, 0.05) 0%, transparent 62%)',
    nebulaLight:
      'radial-gradient(circle 480px at 80% 25%, rgba(52, 211, 153, 0.09) 0%, transparent 62%)',
    rotation: -32,
    scale: 1.08,
  },
  'section-sleep': {
    name: 'Circadian Twilight Aurora',
    coreDark:
      'radial-gradient(ellipse 750px 650px at 50% 82%, rgba(99, 102, 241, 0.13) 0%, rgba(168, 85, 247, 0.07) 40%, transparent 75%)',
    coreLight:
      'radial-gradient(ellipse 750px 650px at 50% 82%, rgba(99, 102, 241, 0.16) 0%, rgba(168, 85, 247, 0.1) 40%, transparent 75%)',
    nebulaDark:
      'radial-gradient(circle 520px at 30% 25%, rgba(129, 140, 248, 0.05) 0%, transparent 65%)',
    nebulaLight:
      'radial-gradient(circle 520px at 30% 25%, rgba(129, 140, 248, 0.09) 0%, transparent 65%)',
    rotation: 12,
    scale: 1.03,
  },
  'section-accountability': {
    name: 'Obsidian Crimson Quasar',
    coreDark:
      'radial-gradient(circle 580px at 62% 42%, rgba(244, 63, 94, 0.11) 0%, rgba(249, 115, 22, 0.05) 40%, transparent 72%)',
    coreLight:
      'radial-gradient(circle 580px at 62% 42%, rgba(244, 63, 94, 0.14) 0%, rgba(249, 115, 22, 0.08) 40%, transparent 72%)',
    nebulaDark:
      'radial-gradient(circle 500px at 20% 40%, rgba(225, 29, 72, 0.05) 0%, transparent 60%)',
    nebulaLight:
      'radial-gradient(circle 500px at 20% 40%, rgba(225, 29, 72, 0.08) 0%, transparent 60%)',
    rotation: -18,
    scale: 1.06,
  },
};

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  activeRealm = 'hero',
  potatoMode = false,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';

  // Generate 160 realistic astronomical stars with real spectral classes
  const stars: Star[] = useMemo(() => {
    const list: Star[] = [];
    let seed = 1337;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const count = 150;
    for (let i = 0; i < count; i++) {
      const sVal = random();
      // Most stars are tiny micro-pinpoints (0.8px - 1.4px), few are bright focal stars (2.2px - 3.2px)
      const size = sVal > 0.94 ? 3.0 : sVal > 0.82 ? 2.0 : sVal > 0.5 ? 1.3 : 0.8;
      
      // Spectral types: Class O (blue), Class A (white), Class G (warm yellow), Class M (coral red)
      const specVal = random();
      const spectralClass: Star['spectralClass'] =
        specVal > 0.75 ? 'O' : specVal > 0.45 ? 'A' : specVal > 0.2 ? 'G' : 'M';

      list.push({
        id: i,
        x: Math.round(random() * 10000) / 100,
        y: Math.round(random() * 10000) / 100,
        size,
        baseOpacity: Math.round((0.35 + random() * 0.55) * 100) / 100,
        twinkleDuration: Math.round((2.0 + random() * 4.0) * 10) / 10,
        twinkleDelay: Math.round(random() * 5.0 * 10) / 10,
        spectralClass,
        hasSpike: size >= 2.8,
      });
    }
    return list;
  }, []);

  // Mouse parallax state for desktop
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (potatoMode) return;
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 22;
      const y = (e.clientY / window.innerHeight - 0.5) * 22;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [potatoMode]);

  const currentConfig = GALAXY_REALMS[activeRealm] || GALAXY_REALMS.hero;

  // Star color resolver: Dark mode (cosmic illumination) vs Light mode (astronomical observatory negative)
  const getStarColor = (star: Star): string => {
    if (!isLight) {
      // Dark Mode: Luminous real stellar temperatures
      switch (star.spectralClass) {
        case 'O':
          return 'rgba(186, 230, 253, 0.95)'; // Ice-cyan hot star
        case 'A':
          return 'rgba(255, 255, 255, 0.98)'; // Pure white diamond
        case 'G':
          return 'rgba(254, 240, 138, 0.92)'; // Solar gold/warm white
        case 'M':
          return 'rgba(254, 205, 211, 0.88)'; // Soft stellar coral
      }
    } else {
      // Light Mode: High-contrast astronomical observatory stars (deep midnight sapphire, obsidian, indigo)
      switch (star.spectralClass) {
        case 'O':
          return 'rgba(14, 116, 144, 0.85)'; // Deep cyan-sapphire
        case 'A':
          return 'rgba(15, 23, 42, 0.85)'; // Obsidian charcoal
        case 'G':
          return 'rgba(180, 83, 9, 0.8)'; // Deep bronze gold
        case 'M':
          return 'rgba(190, 24, 93, 0.75)'; // Cosmic ruby dusk
      }
    }
  };

  if (potatoMode) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[var(--bg-app)]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle 1px at 20% 30%, #888 100%, transparent), radial-gradient(circle 1px at 70% 60%, #888 100%, transparent)',
            backgroundSize: '240px 240px',
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
      {/* 1. Base Celestial Void */}
      <div className="absolute inset-0 bg-[var(--bg-app)]" />

      {/* 2. Deep Space Milky Way Gas Lane & Cosmic Dust Cloud */}
      <div
        className="absolute inset-0 will-change-transform opacity-75"
        style={{
          background: isLight
            ? 'radial-gradient(ellipse 90% 60% at 50% 40%, rgba(224, 242, 254, 0.45) 0%, rgba(243, 232, 255, 0.25) 45%, transparent 75%)'
            : 'radial-gradient(ellipse 85% 55% at 50% 42%, rgba(255, 255, 255, 0.02) 0%, rgba(15, 23, 42, 0.4) 50%, transparent 80%)',
          transform: `translate3d(${mouseOffset.x * 0.2}px, ${mouseOffset.y * 0.2}px, 0)`,
        }}
      />

      {/* 3. Spiral Galaxy Arms & Gaseous Morphing Nebulae */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeRealm}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{
            opacity: 1,
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
          {/* Primary Emission Nebula Core */}
          <div
            className="absolute inset-0 transition-all duration-1000"
            style={{
              backgroundImage: isLight ? currentConfig.coreLight : currentConfig.coreDark,
            }}
          />
          {/* Secondary Stellar Filament Cluster */}
          <div
            className="absolute inset-0 transition-all duration-1000"
            style={{
              backgroundImage: isLight ? currentConfig.nebulaLight : currentConfig.nebulaDark,
            }}
          />

          {/* Realistic Spiral Galaxy Arm Overlay SVG */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(750px,90vw)] h-[min(750px,90vw)] opacity-40 mix-blend-screen pointer-events-none">
            <svg viewBox="0 0 500 500" className="w-full h-full animate-[galaxyRotate_120s_linear_infinite]">
              <defs>
                <radialGradient id="galaxyBulge" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={isLight ? '#38bdf8' : '#ffffff'} stopOpacity={isLight ? '0.2' : '0.4'} />
                  <stop offset="25%" stopColor={isLight ? '#818cf8' : '#38bdf8'} stopOpacity={isLight ? '0.1' : '0.2'} />
                  <stop offset="60%" stopColor={isLight ? '#c084fc' : '#a855f7'} stopOpacity={isLight ? '0.04' : '0.08'} />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* Dense Galactic Nucleus Core */}
              <circle cx="250" cy="250" r="120" fill="url(#galaxyBulge)" />
              {/* Spiral Arm Alpha */}
              <path
                d="M 250 250 Q 290 180, 360 170 T 450 260 T 360 380 T 210 430"
                fill="none"
                stroke={isLight ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.12)'}
                strokeWidth="18"
                strokeLinecap="round"
                filter="blur(10px)"
              />
              {/* Spiral Arm Beta */}
              <path
                d="M 250 250 Q 210 320, 140 330 T 50 240 T 140 120 T 290 70"
                fill="none"
                stroke={isLight ? 'rgba(168, 85, 247, 0.12)' : 'rgba(168, 85, 247, 0.12)'}
                strokeWidth="18"
                strokeLinecap="round"
                filter="blur(10px)"
              />
            </svg>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 4. Astronomical Starfield (Visible in Both Dark & Light Modes) */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate3d(${mouseOffset.x * 0.75}px, ${mouseOffset.y * 0.75}px, 0)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {stars.map((star) => {
          const color = getStarColor(star);
          return (
            <div
              key={star.id}
              className="absolute rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: color,
                boxShadow:
                  star.size > 1.8
                    ? isLight
                      ? `0 0 4px ${color}`
                      : `0 0 8px ${color}, 0 0 16px rgba(255,255,255,0.4)`
                    : 'none',
                animation: `starTwinkle ${star.twinkleDuration}s ease-in-out infinite`,
                animationDelay: `${star.twinkleDelay}s`,
                opacity: star.baseOpacity,
              }}
            >
              {/* Authentic JWST 4-ray diffraction spike on bright stellar cores */}
              {star.hasSpike && (
                <>
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{
                      width: '12px',
                      height: '1px',
                      background: isLight ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.75)',
                      boxShadow: isLight ? 'none' : '0 0 4px #ffffff',
                    }}
                  />
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{
                      width: '1px',
                      height: '12px',
                      background: isLight ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.75)',
                      boxShadow: isLight ? 'none' : '0 0 4px #ffffff',
                    }}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. Occasional Meteor Streaks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="shooting-star-meteor"
          style={{
            top: '12%',
            left: '85%',
            animationDelay: '1.5s',
          }}
        />
        <div
          className="shooting-star-meteor"
          style={{
            top: '44%',
            left: '90%',
            animationDelay: '9.2s',
          }}
        />
      </div>

      {/* 6. Subtle Edge Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLight
            ? 'radial-gradient(circle 80% at 50% 50%, transparent 60%, rgba(251, 251, 253, 0.4) 100%)'
            : 'radial-gradient(circle 80% at 50% 50%, transparent 40%, rgba(8, 8, 10, 0.5) 100%)',
        }}
      />
    </div>
  );
};
