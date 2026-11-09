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

export const TreeBranchNavigator: React.FC<TreeBranchNavigatorProps> = ({
  activeSection,
  onSelectSection,
  modules,
  potatoMode,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 10000));
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

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

  // Current active index in the shuffled sequence
  const activeIndex = useMemo(() => {
    const idx = shuffledModules.findIndex(m => m.id === activeSection);
    return idx >= 0 ? idx : 0;
  }, [shuffledModules, activeSection]);

  // IntersectionObserver to naturally detect which branch is in the focal viewport on native scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const targetId = entry.target.getAttribute('data-module-id');
            if (targetId && targetId !== activeSection) {
              onSelectSection(targetId);
            }
          }
        }
      },
      {
        root: container,
        threshold: [0.5, 0.75],
      }
    );

    shuffledModules.forEach((mod) => {
      const el = cardRefs.current[mod.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [shuffledModules, activeSection, onSelectSection]);

  // Smooth scroll to a target branch
  const scrollToBranch = (sectionId: string) => {
    const el = cardRefs.current[sectionId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      onSelectSection(sectionId);
    }
  };

  // Up/down camera flight
  const handleNextBranch = () => {
    if (activeIndex < shuffledModules.length - 1) {
      scrollToBranch(shuffledModules[activeIndex + 1].id);
    }
  };

  const handlePrevBranch = () => {
    if (activeIndex > 0) {
      scrollToBranch(shuffledModules[activeIndex - 1].id);
    }
  };

  const handleRegrowTree = () => {
    setSeed(Date.now());
  };

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col">
      
      {/* =========================================================================
          HUD BAR: Active Branch Telemetry + Controls
         ========================================================================= */}
      <div className="shrink-0 w-full px-3 sm:px-6 py-2 border-b border-current/[0.06] bg-current/[0.015] flex items-center justify-between text-xs font-mono z-20">
        
        {/* Left: Active Branch Indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 beacon-pulse shrink-0" />
          <span className="font-bold text-current">BRANCH {activeIndex + 1} OF {shuffledModules.length}</span>
          <span className="opacity-40">·</span>
          <span className="text-emerald-400 font-semibold">{shuffledModules[activeIndex]?.label}</span>
          <span className="opacity-40 hidden sm:inline">({shuffledModules[activeIndex]?.branchName})</span>
        </div>

        {/* Right: Regrow Tree + Camera Elevator */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRegrowTree}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-card hover:bg-current/[0.06] text-[11px] font-mono transition-all btn-press cursor-pointer border border-current/[0.1]"
            title="Randomize and regrow branches in a new sequence"
          >
            <Shuffle className="w-3 h-3 text-emerald-400" />
            <span className="hidden xs:inline">Regrow Tree</span>
          </button>

          <div className="flex items-center gap-0.5 glass-card rounded-full p-0.5 border border-current/[0.1]">
            <button
              onClick={handlePrevBranch}
              disabled={activeIndex === 0}
              className="p-1 rounded-full opacity-60 hover:opacity-100 disabled:opacity-20 cursor-pointer"
              title="Previous Branch (Scroll Up)"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextBranch}
              disabled={activeIndex === shuffledModules.length - 1}
              className="p-1 rounded-full opacity-60 hover:opacity-100 disabled:opacity-20 cursor-pointer"
              title="Next Branch (Scroll Down)"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN KINETIC VERTICAL TREE DECK: Butter-Smooth Scroll & Snapping
         ========================================================================= */}
      <div className="relative flex-1 w-full overflow-hidden flex">
        
        {/* Living Organic Tree Spine (Desktop Left Rail) */}
        <aside className="hidden lg:flex flex-col items-center justify-center w-28 shrink-0 relative py-8 select-none z-10 border-r border-current/[0.05]">
          {/* Vertical Trunk Line */}
          <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-0.5 bg-current/[0.08]" />

          {/* 4 Organic Branch Nodes on Spine */}
          <div className="flex flex-col justify-around h-full w-full py-4 z-10">
            {shuffledModules.map((mod, idx) => {
              const isAct = idx === activeIndex;
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  onClick={() => scrollToBranch(mod.id)}
                  className={`group flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    isAct ? 'scale-110' : 'opacity-40 hover:opacity-80'
                  }`}
                  title={`Fly camera to ${mod.label}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isAct 
                      ? 'bg-emerald-500 text-black shadow-[0_0_16px_rgba(16,185,129,0.5)] font-bold' 
                      : 'glass-card border border-current/[0.15] text-current'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-mono tracking-tight text-center max-w-[90px] leading-tight ${
                    isAct ? 'text-emerald-400 font-bold' : 'text-current/60'
                  }`}>
                    {mod.label.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Scrollable Kinetic Viewport */}
        <div
          ref={scrollContainerRef}
          className="flex-1 h-full overflow-y-auto snap-y snap-mandatory scroll-smooth px-2.5 sm:px-6 lg:px-10 py-4 space-y-8"
        >
          {shuffledModules.map((mod, idx) => {
            const isAct = idx === activeIndex;
            const Icon = mod.icon;

            return (
              <section
                key={mod.id}
                ref={(el) => { cardRefs.current[mod.id] = el; }}
                data-module-id={mod.id}
                className="snap-start min-h-[calc(100vh-170px)] flex flex-col justify-center py-4"
              >
                {/* Branch Card Container with smooth kinetic elevation */}
                <div 
                  className={`w-full max-w-6xl mx-auto transition-all duration-500 ${
                    potatoMode
                      ? 'opacity-100'
                      : isAct
                      ? 'opacity-100 scale-100 shadow-2xl'
                      : 'opacity-45 scale-[0.985] hover:opacity-75'
                  }`}
                >
                  {/* Branch Pill Header */}
                  <div className="flex items-center justify-between pb-2 px-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-xl ${isAct ? 'bg-emerald-500/15 text-emerald-400' : 'bg-current/[0.05]'}`}>
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
                        onClick={() => scrollToBranch(mod.id)}
                        className="text-[10px] opacity-50 hover:opacity-100 px-2 py-0.5 rounded-full bg-current/[0.05] transition-all cursor-pointer"
                      >
                        Snap into focus ↑
                      </button>
                    )}
                  </div>

                  {/* Module Component Payload */}
                  <div className="relative">
                    {mod.component}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

      </div>

    </div>
  );
};
