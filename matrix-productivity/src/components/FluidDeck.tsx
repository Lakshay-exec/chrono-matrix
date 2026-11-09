import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface DeckModule {
  id: string;
  label: string;
  component: React.ReactNode;
}

interface FluidDeckProps {
  activeSection: string;
  modules: DeckModule[];
  potatoMode: boolean;
  onSectionChange?: (id: string) => void;
}

const SECTION_ORDER = [
  'section-matrix',
  'section-curve',
  'section-sleep',
  'section-accountability',
];

export const FluidDeck: React.FC<FluidDeckProps> = ({
  activeSection,
  modules,
  potatoMode,
  onSectionChange,
}) => {
  const activeModule = modules.find((m) => m.id === activeSection) || modules[0];
  const prevIndexRef = useRef(SECTION_ORDER.indexOf(activeSection));
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    const nextIndex = SECTION_ORDER.indexOf(activeSection);
    const prevIndex = prevIndexRef.current;
    setDirection(nextIndex >= prevIndex ? 1 : -1);
    prevIndexRef.current = nextIndex;
  }, [activeSection]);

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollCooldown = useRef(false);

  // Trigger navigation with safety cooldown
  const triggerNavigate = useCallback(
    (dir: 1 | -1) => {
      if (!onSectionChange || scrollCooldown.current) return;
      const curIdx = SECTION_ORDER.indexOf(activeSection);
      const nextIdx = curIdx + dir;
      if (nextIdx >= 0 && nextIdx < SECTION_ORDER.length) {
        scrollCooldown.current = true;
        onSectionChange(SECTION_ORDER[nextIdx]);
        setTimeout(() => {
          scrollCooldown.current = false;
        }, 650);
      }
    },
    [activeSection, onSectionChange]
  );

  // Wheel scroll edge detection for desktop
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 35 || scrollCooldown.current) return;
    const el = contentRef.current;
    if (!el) return;

    const isAtTop = el.scrollTop <= 4;
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 6;

    if (e.deltaY > 50 && isAtBottom) {
      triggerNavigate(1);
    } else if (e.deltaY < -50 && isAtTop) {
      triggerNavigate(-1);
    }
  };

  // Touch swipe support for mobile
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null || scrollCooldown.current) return;

    const dy = touchStartY.current - e.changedTouches[0].clientY;
    const dx = Math.abs(touchStartX.current - e.changedTouches[0].clientX);

    // Only vertical gestures, avoid horizontal gestures so tables/charts can scroll sideways
    if (Math.abs(dy) > 55 && dx < Math.abs(dy) * 0.7) {
      const el = contentRef.current;
      if (el) {
        const isAtTop = el.scrollTop <= 4;
        const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 6;

        if (dy > 0 && isAtBottom) {
          triggerNavigate(1);
        } else if (dy < 0 && isAtTop) {
          triggerNavigate(-1);
        }
      }
    }

    touchStartY.current = null;
    touchStartX.current = null;
  };

  const variants = {
    enter: (dir: number) => ({
      y: dir > 0 ? 32 : -32,
      opacity: 0,
      filter: 'blur(3px)',
    }),
    center: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
    },
    exit: (dir: number) => ({
      y: dir > 0 ? -24 : 24,
      opacity: 0,
      filter: 'blur(2px)',
    }),
  };

  if (potatoMode) {
    return (
      <div className="flex-1 w-full h-full flex flex-col min-h-0 overflow-hidden">
        <div
          ref={contentRef}
          className="flex-1 w-full max-w-6xl mx-auto px-2.5 sm:px-6 py-2 sm:py-4 overflow-y-auto overflow-x-hidden"
          style={{ scrollbarGutter: 'stable' }}
        >
          <div className="w-full">{activeModule.component}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 w-full h-full flex flex-col min-h-0 overflow-hidden relative"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={activeModule.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.32,
            ease: [0.16, 1, 0.3, 1],
          }}
          ref={contentRef}
          className="flex-1 w-full max-w-6xl mx-auto px-2.5 sm:px-6 py-2 sm:py-4 overflow-y-auto overflow-x-hidden absolute inset-0"
          style={{ scrollbarGutter: 'stable' }}
        >
          <div className="w-full">{activeModule.component}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
