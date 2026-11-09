import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Shuffle, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';

export interface TreeNodeModule {
  id: string;
  label: string;
  subtitle: string;
  icon: React.ElementType;
  branchName: string;
  component: React.ReactNode;
}

interface TreeBranchNavigatorProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  modules: TreeNodeModule[];
  potatoMode: boolean;
}

interface BranchCoordinate {
  x: number;      // Canvas X
  y: number;      // Canvas Y
  z: number;      // Canvas Z depth
  rot: number;    // Subtle camera tilt
  pathD: string;  // SVG branch curve
}

export const TreeBranchNavigator: React.FC<TreeBranchNavigatorProps> = ({
  activeSection,
  onSelectSection,
  modules,
  potatoMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 10000));
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Procedurally randomized sequence of modules per session or reshuffle
  const shuffledModules = useMemo(() => {
    // Deterministic pseudo-random shuffle based on seed
    const copy = [...modules];
    let s = seed;
    for (let i = copy.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [modules, seed]);

  // Current active index in the shuffled sequence
  const activeIndex = useMemo(() => {
    const idx = shuffledModules.findIndex(m => m.id === activeSection);
    return idx >= 0 ? idx : 0;
  }, [shuffledModules, activeSection]);

  // Procedural branch coordinates and organic curved paths
  const branchCoords = useMemo((): BranchCoordinate[] => {
    // Generate 4 organic branches sprouting upward from trunk base (0, 1000)
    const baseTrunkX = 0;
    const baseTrunkY = 1100;
    
    // Slight randomized jitter based on seed
    const jitter = (factor: number) => {
      const pseudo = Math.sin(seed * factor) * 35;
      return pseudo;
    };

    return [
      // Branch 0: Lower-left bough
      {
        x: -420 + jitter(1.1),
        y: 750 + jitter(2.2),
        z: -30,
        rot: -2.5,
        pathD: `M ${baseTrunkX} ${baseTrunkY} Q ${-180 + jitter(1.5)} 920, ${-420 + jitter(1.1)} ${750 + jitter(2.2)}`,
      },
      // Branch 1: Middle-right bough
      {
        x: 440 + jitter(3.3),
        y: 460 + jitter(4.4),
        z: -20,
        rot: 2.2,
        pathD: `M ${baseTrunkX} ${baseTrunkY} Q ${160 + jitter(3.5)} 780, ${440 + jitter(3.3)} ${460 + jitter(4.4)}`,
      },
      // Branch 2: Mid-left canopy
      {
        x: -360 + jitter(5.5),
        y: 160 + jitter(6.6),
        z: -10,
        rot: -1.8,
        pathD: `M ${baseTrunkX} ${baseTrunkY} Q ${-120 + jitter(5.2)} 520, ${-360 + jitter(5.5)} ${160 + jitter(6.6)}`,
      },
      // Branch 3: High crown / zenith
      {
        x: 120 + jitter(7.7),
        y: -180 + jitter(8.8),
        z: 0,
        rot: 1.2,
        pathD: `M ${baseTrunkX} ${baseTrunkY} Q ${60 + jitter(7.1)} 320, ${120 + jitter(7.7)} ${-180 + jitter(8.8)}`,
      },
    ];
  }, [seed]);

  // Handle vertical wheel scroll to transition camera between branches
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // If user is scrolling inside a table or card with its own scroll, avoid hijacking unless threshold met
      if (Math.abs(e.deltaY) < 30) return;

      if (isTransitioning) return;

      if (e.deltaY > 50) {
        // Scroll Down -> Fly to next branch
        if (activeIndex < shuffledModules.length - 1) {
          e.preventDefault();
          setIsTransitioning(true);
          onSelectSection(shuffledModules[activeIndex + 1].id);
          setTimeout(() => setIsTransitioning(false), 700);
        }
      } else if (e.deltaY < -50) {
        // Scroll Up -> Fly to previous branch
        if (activeIndex > 0) {
          e.preventDefault();
          setIsTransitioning(true);
          onSelectSection(shuffledModules[activeIndex - 1].id);
          setTimeout(() => setIsTransitioning(false), 700);
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [activeIndex, isTransitioning, shuffledModules, onSelectSection]);

  // Touch Swipe for mobile camera gliding
  const touchStartY = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) < 45 || isTransitioning) return;

    if (deltaY > 0 && activeIndex < shuffledModules.length - 1) {
      setIsTransitioning(true);
      onSelectSection(shuffledModules[activeIndex + 1].id);
      setTimeout(() => setIsTransitioning(false), 700);
    } else if (deltaY < 0 && activeIndex > 0) {
      setIsTransitioning(true);
      onSelectSection(shuffledModules[activeIndex - 1].id);
      setTimeout(() => setIsTransitioning(false), 700);
    }
  };

  // Reshuffle & regrow the tree
  const handleRegrowTree = () => {
    setSeed(Date.now());
  };

  const activeCoord = branchCoords[activeIndex] || branchCoords[0];

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative flex-1 w-full h-full overflow-hidden select-none"
      style={{ perspective: '1400px' }}
    >
      {/* HUD: Tree Telemetry & Shuffle / Regrow Pill */}
      <div className="absolute top-2.5 right-3 sm:right-6 z-30 flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full glass-card text-[11px] font-mono text-current/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 beacon-pulse" />
          <span>BRANCH {activeIndex + 1} / {shuffledModules.length}</span>
          <span className="opacity-40">·</span>
          <span className="text-emerald-400 font-semibold">{shuffledModules[activeIndex]?.branchName}</span>
        </div>

        <button
          onClick={handleRegrowTree}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card hover:bg-current/[0.08] text-[11px] font-mono transition-all btn-press cursor-pointer border border-current/[0.12]"
          title="Regrow Tree with randomized procedural branches and shuffled sequence"
        >
          <Shuffle className="w-3 h-3 text-emerald-400" />
          <span className="hidden xs:inline">Regrow Tree</span>
        </button>

        {/* Vertical Camera Gliders */}
        <div className="flex items-center gap-0.5 glass-card rounded-full p-0.5 border border-current/[0.1]">
          <button
            onClick={() => activeIndex > 0 && onSelectSection(shuffledModules[activeIndex - 1].id)}
            disabled={activeIndex === 0}
            className="p-1 rounded-full opacity-60 hover:opacity-100 disabled:opacity-20 cursor-pointer"
            title="Fly camera to previous branch"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => activeIndex < shuffledModules.length - 1 && onSelectSection(shuffledModules[activeIndex + 1].id)}
            disabled={activeIndex === shuffledModules.length - 1}
            className="p-1 rounded-full opacity-60 hover:opacity-100 disabled:opacity-20 cursor-pointer"
            title="Fly camera to next branch"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D WORLD CONTAINER: Moves opposite to camera target to center active branch */}
      <div 
        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
        style={{
          transformStyle: 'preserve-3d',
          transform: potatoMode
            ? 'none'
            : `translate3d(${-activeCoord.x}px, ${-activeCoord.y}px, ${-activeCoord.z}px) rotateZ(${-activeCoord.rot}deg)`,
          transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* =========================================================================
            PROCEDURAL ORGANIC TREE SVG SKELETON
           ========================================================================= */}
        <svg 
          className="absolute w-[2200px] h-[2200px] pointer-events-none -z-10 opacity-40 dark:opacity-35"
          style={{ 
            left: '50%', 
            top: '50%', 
            transform: 'translate(-50%, -50%)',
            overflow: 'visible'
          }}
          viewBox="-1100 -1100 2200 2200"
        >
          <defs>
            {/* Trunk Gradient */}
            <linearGradient id="treeBarkGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
              <stop offset="70%" stopColor="currentColor" stopOpacity="0.35" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
            </linearGradient>

            {/* Glowing Active Pulse Gradient */}
            <linearGradient id="activePulseGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.4" />
            </linearGradient>

            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Root / Trunk Base */}
          <path
            d="M 0 1100 Q -30 900 0 700 Q 20 500 0 300"
            fill="none"
            stroke="url(#treeBarkGrad)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* 4 Organic Branches */}
          {branchCoords.map((coord, idx) => {
            const isAct = idx === activeIndex;
            return (
              <g key={idx}>
                {/* Branch Stem */}
                <path
                  d={coord.pathD}
                  fill="none"
                  stroke={isAct ? 'url(#activePulseGrad)' : 'currentColor'}
                  strokeWidth={isAct ? 7 : 3.5}
                  strokeLinecap="round"
                  strokeDasharray={isAct ? '10 6' : 'none'}
                  className={isAct ? 'animate-pulse' : 'opacity-40'}
                  filter={isAct ? 'url(#glowFilter)' : undefined}
                />

                {/* Branch Tip Bud / Node Anchor */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={isAct ? 12 : 7}
                  fill={isAct ? '#10b981' : 'currentColor'}
                  opacity={isAct ? 0.95 : 0.4}
                  filter={isAct ? 'url(#glowFilter)' : undefined}
                />
              </g>
            );
          })}
        </svg>

        {/* =========================================================================
            INDIVIDUAL BRANCH MODULE CARDS (Placed on organic branch coordinates)
           ========================================================================= */}
        {shuffledModules.map((mod, idx) => {
          const coord = branchCoords[idx];
          const isAct = idx === activeIndex;
          const Icon = mod.icon;

          return (
            <div
              key={mod.id}
              onClick={() => {
                if (!isAct) onSelectSection(mod.id);
              }}
              className={`absolute pointer-events-auto transition-all duration-700 ${
                isAct ? 'z-20' : 'z-10 cursor-pointer'
              }`}
              style={{
                left: `calc(50% + ${coord.x}px)`,
                top: `calc(50% + ${coord.y}px)`,
                transform: `translate(-50%, -50%) translateZ(${coord.z}px) scale(${
                  isAct ? 1 : 0.62
                }) rotateZ(${coord.rot * 0.5}deg)`,
                opacity: isAct ? 1 : 0.22,
                filter: isAct ? 'none' : 'blur(4px) grayscale(40%)',
                width: 'min(94vw, 1140px)',
              }}
            >
              {/* Branch Node Header Pill */}
              <div className="flex items-center justify-between pb-2 px-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-xl ${isAct ? 'bg-emerald-500/20 text-emerald-400' : 'bg-current/[0.05]'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono uppercase tracking-wider font-bold">
                        {mod.label}
                      </span>
                      <span className="text-[9px] font-mono opacity-50 px-1.5 py-0.2 rounded bg-current/[0.05]">
                        {mod.branchName}
                      </span>
                    </div>
                    <span className="text-[10px] opacity-60 font-serif-app italic hidden sm:inline">
                      {mod.subtitle}
                    </span>
                  </div>
                </div>

                {!isAct && (
                  <span className="text-[10px] font-mono opacity-60 px-2.5 py-1 rounded-full bg-current/[0.06] hover:bg-current/[0.12] transition-colors">
                    Click to fly camera here →
                  </span>
                )}
              </div>

              {/* Module Content Container */}
              <div className={`transition-all duration-500 ${
                isAct 
                  ? 'scale-100 shadow-2xl' 
                  : 'hover:opacity-60'
              }`}>
                {mod.component}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ambient Radial Spotlight following Active Branch */}
      <div 
        className="absolute inset-0 pointer-events-none -z-20 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle 600px at 50% 50%, rgba(16, 185, 129, 0.04) 0%, transparent 80%)`,
        }}
      />
    </div>
  );
};
