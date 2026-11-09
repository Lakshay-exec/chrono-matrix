import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Shuffle, 
  ChevronUp, 
  ChevronDown, 
  Compass 
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

// 3D Branch Spline Node
interface SplineNode {
  x: number;       // 3D world X
  y: number;       // 3D world Y
  z: number;       // 3D world Z (depth)
  rotY: number;    // Camera yaw
  tiltX: number;   // Camera pitch
  curveAngle: number;
}

// Particle for background ambient bio-luminescence
interface SporeParticle {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
  vz: number;
}

export const TreeBranchNavigator: React.FC<TreeBranchNavigatorProps> = ({
  activeSection,
  onSelectSection,
  modules,
  potatoMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 10000));

  // Current scroll progress (0.0 to 1.0) and camera coordinates (lerped for silky 60/120fps glide)
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const velocity = useRef(0);
  const lastScrollTop = useRef(0);
  const lastTimestamp = useRef(performance.now());
  const [displayIndex, setDisplayIndex] = useState(0);

  // Procedurally randomized sequence of modules per session or reshuffle
  const shuffledModules = useMemo(() => {
    const copy = [...modules];
    let s = seed;
    for (let i = copy.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [modules, seed]);

  // Procedural 3D Spline Nodes for the 4 branches
  const splineNodes = useMemo((): SplineNode[] => {
    const jitter = (factor: number, range = 60) => Math.sin(seed * factor) * range;

    return [
      // Branch 0: The Root / Canopy Alpha
      {
        x: 0,
        y: 0,
        z: 0,
        rotY: 0,
        tiltX: 0,
        curveAngle: -25 + jitter(1.1, 15),
      },
      // Branch 1: The Ascending Growth Bough (banking left & deep)
      {
        x: -280 + jitter(2.2, 80),
        y: 900,
        z: -140 + jitter(2.5, 40),
        rotY: -14 + jitter(2.8, 6),
        tiltX: 6,
        curveAngle: 35 + jitter(3.3, 15),
      },
      // Branch 2: The Circadian Rest Bough (banking right & high)
      {
        x: 320 + jitter(4.4, 80),
        y: 1800,
        z: -180 + jitter(4.7, 50),
        rotY: 16 + jitter(5.1, 6),
        tiltX: -5,
        curveAngle: -30 + jitter(5.5, 15),
      },
      // Branch 3: The Zenith Thorn of Discipline (crowning apex)
      {
        x: -60 + jitter(6.6, 50),
        y: 2700,
        z: -60 + jitter(6.9, 30),
        rotY: -4 + jitter(7.3, 5),
        tiltX: 9,
        curveAngle: 15 + jitter(7.7, 10),
      },
    ];
  }, [seed]);

  // Generate 3D ambient spore particles
  const particles = useMemo((): SporeParticle[] => {
    const count = potatoMode ? 25 : 75;
    const pts: SporeParticle[] = [];
    let s = seed;
    for (let i = 0; i < count; i++) {
      s = (s * 9301 + 49297) % 233280;
      const x = ((s % 2000) - 1000);
      s = (s * 9301 + 49297) % 233280;
      const y = (s % 3600) - 400;
      s = (s * 9301 + 49297) % 233280;
      const z = (s % 1200) - 400;
      pts.push({
        x,
        y,
        z,
        size: 1.2 + (s % 30) / 10,
        alpha: 0.2 + (s % 60) / 100,
        vx: ((s % 10) - 5) * 0.05,
        vy: -0.2 - (s % 10) * 0.04,
        vz: ((s % 10) - 5) * 0.03,
      });
    }
    return pts;
  }, [seed, potatoMode]);

  // Interpolate camera along spline between nodes
  const getCameraState = useCallback((p: number) => {
    const totalSegments = splineNodes.length - 1;
    const scaled = Math.max(0, Math.min(p * totalSegments, totalSegments));
    const index = Math.floor(scaled);
    const fraction = scaled - index;

    const n1 = splineNodes[index];
    const n2 = splineNodes[Math.min(index + 1, totalSegments)];

    // Smooth hermite / cosine ease for continuous organic camera banking
    const smoothT = fraction * fraction * (3 - 2 * fraction);

    return {
      x: n1.x + (n2.x - n1.x) * smoothT,
      y: n1.y + (n2.y - n1.y) * smoothT,
      z: n1.z + (n2.z - n1.z) * smoothT,
      rotY: n1.rotY + (n2.rotY - n1.rotY) * smoothT,
      tiltX: n1.tiltX + (n2.tiltX - n1.tiltX) * smoothT,
      currentSegment: index,
    };
  }, [splineNodes]);

  // Main 3D Canvas Renderer & Spring Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const now = performance.now();
      lastTimestamp.current = now;

      // Silky smooth lerp interpolation for camera (spring damping)
      const lerpSpeed = potatoMode ? 0.25 : 0.085;
      currentProgress.current += (targetProgress.current - currentProgress.current) * lerpSpeed;
      velocity.current *= 0.92;

      const p = currentProgress.current;
      const cam = getCameraState(p);

      // Determine active display index
      const segIndex = Math.min(Math.round(p * (splineNodes.length - 1)), splineNodes.length - 1);
      setDisplayIndex(segIndex);

      // Check section sync
      const targetMod = shuffledModules[segIndex];
      if (targetMod && targetMod.id !== activeSection) {
        onSelectSection(targetMod.id);
      }

      // Update 3D card deck transform in DOM
      if (containerRef.current) {
        const velSkew = Math.max(-6, Math.min(6, velocity.current * 0.15));
        containerRef.current.style.transform = `
          translate3d(${-cam.x * 0.65}px, ${-cam.y + (p * 2700)}px, ${-cam.z}px)
          rotateY(${-cam.rotY * 0.8}deg)
          rotateX(${(-cam.tiltX + velSkew) * 0.6}deg)
        `;
      }

      // Clear Canvas
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const fov = 800; // 3D Camera focal length

      // 1. Draw 3D Spline Tree Trunk & Organic Branches
      if (!potatoMode) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw organic spline curve connecting nodes
        for (let i = 0; i < splineNodes.length - 1; i++) {
          const nA = splineNodes[i];
          const nB = splineNodes[i + 1];

          // Subdivide segment into 16 spline points for smooth 3D projection
          const steps = 16;
          ctx.beginPath();
          let started = false;

          for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            const easeT = t * t * (3 - 2 * t);
            
            // Interpolate 3D position
            const wx = nA.x + (nB.x - nA.x) * easeT - cam.x * 0.65;
            const wy = (nA.y + (nB.y - nA.y) * easeT) - cam.y;
            const wz = (nA.z + (nB.z - nA.z) * easeT) - cam.z + 1200;

            if (wz <= 50) continue; // Behind camera

            const scale = fov / wz;
            const sx = cx + wx * scale;
            const sy = cy + wy * scale * 0.45;

            if (!started) {
              ctx.moveTo(sx, sy);
              started = true;
            } else {
              ctx.lineTo(sx, sy);
            }
          }

          const isCurrentSegment = i === cam.currentSegment;
          ctx.strokeStyle = isCurrentSegment ? 'rgba(16, 185, 129, 0.45)' : 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = isCurrentSegment ? 4.5 : 2;
          ctx.stroke();

          // Draw Glowing Node Orb
          const orbZ = nA.z - cam.z + 1200;
          if (orbZ > 50) {
            const orbScale = fov / orbZ;
            const ox = cx + (nA.x - cam.x * 0.65) * orbScale;
            const oy = cy + (nA.y - cam.y) * orbScale * 0.45;

            ctx.beginPath();
            ctx.arc(ox, oy, 8 * orbScale, 0, Math.PI * 2);
            ctx.fillStyle = i === segIndex ? 'rgba(16, 185, 129, 0.85)' : 'rgba(255, 255, 255, 0.2)';
            ctx.fill();

            if (i === segIndex) {
              ctx.beginPath();
              ctx.arc(ox, oy, 18 * orbScale, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
              ctx.fill();
            }
          }
        }
        ctx.restore();
      }

      // 2. Draw Floating 3D Bio-Luminescent Spore Particles
      if (!potatoMode) {
        ctx.save();
        for (const pt of particles) {
          // Animate particle velocity
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.z += pt.vz;

          // Wrap boundaries
          if (pt.y < -400) pt.y = 3200;
          if (pt.x < -1000) pt.x = 1000;
          if (pt.x > 1000) pt.x = -1000;

          const pz = (pt.z - cam.z) + 1000;
          if (pz <= 50) continue;

          const scale = fov / pz;
          const px = cx + (pt.x - cam.x * 0.65) * scale;
          const py = cy + (pt.y - cam.y) * scale * 0.45;

          if (px < -20 || px > w + 20 || py < -20 || py > h + 20) continue;

          ctx.beginPath();
          ctx.arc(px, py, pt.size * scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(16, 185, 129, ${pt.alpha * Math.min(scale, 1.2)})`;
          ctx.fill();
        }
        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [getCameraState, particles, potatoMode, activeSection, onSelectSection, shuffledModules, splineNodes]);

  // Handle native smooth scrolling track
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;

    const st = el.scrollTop;
    const progress = Math.max(0, Math.min(st / maxScroll, 1));
    targetProgress.current = progress;

    // Calculate instantaneous velocity for elastic 3D tilt
    velocity.current = st - lastScrollTop.current;
    lastScrollTop.current = st;
  };

  // Direct flight to a branch
  const flyToBranch = (idx: number) => {
    const track = scrollTrackRef.current;
    if (!track) return;
    const maxScroll = track.scrollHeight - track.clientHeight;
    const targetScroll = (idx / (shuffledModules.length - 1)) * maxScroll;
    track.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden select-none bg-[var(--bg-app)]">
      
      {/* =========================================================================
          BACKGROUND 3D ARBORETUM CANVAS: Glowing Vines & Parallax Spores
         ========================================================================= */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* =========================================================================
          AEROSPACE ORBITAL HUD BAR: Branch Telemetry & Interactive Compass
         ========================================================================= */}
      <div className="absolute top-2.5 right-3 sm:right-6 z-30 flex items-center gap-2.5">
        
        {/* Orbital Branch Compass */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border border-current/[0.1] text-xs font-mono shadow-xl backdrop-blur-xl">
          <div className="relative w-4 h-4 flex items-center justify-center">
            <Compass 
              className="w-4 h-4 text-emerald-400 transition-transform duration-500" 
              style={{ transform: `rotate(${(displayIndex / (shuffledModules.length - 1)) * 360}deg)` }}
            />
          </div>
          <span className="font-bold text-current">BRANCH {displayIndex + 1} / {shuffledModules.length}</span>
          <span className="opacity-40">·</span>
          <span className="text-emerald-400 font-semibold">{shuffledModules[displayIndex]?.branchName}</span>
        </div>

        {/* Regrow / Reshuffle Tree Button */}
        <button
          onClick={() => setSeed(Date.now())}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card hover:bg-current/[0.08] text-[11px] font-mono transition-all btn-press cursor-pointer border border-current/[0.12] shadow-lg"
          title="Regenerate procedural 3D branches and re-shuffle module sequence"
        >
          <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Regrow Tree</span>
        </button>

        {/* Vertical Glider Arrows */}
        <div className="flex items-center gap-0.5 glass-card rounded-full p-0.5 border border-current/[0.1] shadow-lg">
          <button
            onClick={() => displayIndex > 0 && flyToBranch(displayIndex - 1)}
            disabled={displayIndex === 0}
            className="p-1 rounded-full opacity-60 hover:opacity-100 disabled:opacity-20 cursor-pointer"
            title="Fly camera to previous branch"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => displayIndex < shuffledModules.length - 1 && flyToBranch(displayIndex + 1)}
            disabled={displayIndex === shuffledModules.length - 1}
            className="p-1 rounded-full opacity-60 hover:opacity-100 disabled:opacity-20 cursor-pointer"
            title="Fly camera to next branch"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          NATIVE SMOOTH SCROLL SENSOR (Tracks mouse wheel, touch, & trackpad)
         ========================================================================= */}
      <div
        ref={scrollTrackRef}
        onScroll={handleScroll}
        className="absolute inset-0 w-full h-full overflow-y-auto snap-y snap-mandatory scroll-smooth z-10"
        style={{ scrollbarWidth: 'none' }}
      >
        {shuffledModules.map((mod, idx) => (
          <div
            key={mod.id}
            data-index={idx}
            className="snap-start min-h-screen w-full flex items-center justify-center pointer-events-none"
          />
        ))}
      </div>

      {/* =========================================================================
          3D DYNAMIC STAGE: The 4 Branch Module Cards Floating along 3D Spline
         ========================================================================= */}
      <div 
        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
        style={{ perspective: '1600px' }}
      >
        <div
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center transition-transform will-change-transform pointer-events-none"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {shuffledModules.map((mod, idx) => {
            const isAct = idx === displayIndex;
            const Icon = mod.icon;
            const node = splineNodes[idx];

            return (
              <div
                key={mod.id}
                className={`absolute pointer-events-auto transition-all duration-700 ${
                  isAct ? 'z-20' : 'z-10 cursor-pointer'
                }`}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `
                    translate(-50%, -50%)
                    translate3d(${node.x * 0.8}px, ${(idx - displayIndex) * 950}px, ${node.z}px)
                    rotateY(${node.rotY * 0.4}deg)
                    scale(${isAct ? 1 : 0.72})
                  `,
                  opacity: isAct ? 1 : 0.28,
                  filter: isAct ? 'none' : 'blur(5px) grayscale(50%)',
                  width: 'min(94vw, 1140px)',
                  transition: 'opacity 0.6s ease, filter 0.6s ease, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onClick={() => {
                  if (!isAct) flyToBranch(idx);
                }}
              >
                {/* Branch Card Title & Indicator */}
                <div className="flex items-center justify-between pb-2 px-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-xl ${isAct ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-current/[0.05]'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-current uppercase tracking-wider text-xs">
                        {mod.label}
                      </span>
                      <span className="text-[10px] opacity-40">
                        [{mod.branchName}]
                      </span>
                    </div>
                  </div>

                  {!isAct && (
                    <button
                      onClick={() => flyToBranch(idx)}
                      className="text-[10px] opacity-50 hover:opacity-100 px-2.5 py-1 rounded-full glass-card hover:bg-current/[0.08] transition-all cursor-pointer"
                    >
                      Fly camera here →
                    </button>
                  )}
                </div>

                {/* Module Body */}
                <div className="relative shadow-2xl">
                  {mod.component}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          ORBITAL DOCK: Bottom 4 Nodes Direct Flight Selector
         ========================================================================= */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1 rounded-full glass-card border border-current/[0.1] shadow-2xl backdrop-blur-2xl">
        {shuffledModules.map((mod, idx) => {
          const isAct = idx === displayIndex;
          const Icon = mod.icon;
          return (
            <button
              key={mod.id}
              onClick={() => flyToBranch(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all btn-press cursor-pointer ${
                isAct
                  ? 'btn-solid-invert font-bold shadow-md'
                  : 'opacity-50 hover:opacity-100 hover:bg-current/[0.05]'
              }`}
              title={`Fly camera to ${mod.label}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{mod.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
