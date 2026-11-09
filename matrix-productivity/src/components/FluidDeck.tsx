import React, { useRef, useState, useEffect } from 'react';
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

  // Swipe gesture support for mobile
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const swipeCooldown = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    if (swipeCooldown.current) return;

    const dy = touchStartY.current - e.changedTouches[0].clientY;
    const dx = Math.abs(touchStartX.current - e.changedTouches[0].clientX);

    // Only vertical swipes, not horizontal (don't interfere with horizontal scrollable content)
    if (Math.abs(dy) < 60 || dx > Math.abs(dy) * 0.8) return;

    // Only trigger when content is scrolled to edge
    const el = contentRef.current;
    if (!el) return;
    const atTop = el.scrollTop <= 2;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;

    if (dy > 0 && atBottom && onSectionChange) {
      // Swipe up → next section
      swipeCooldown.current = true;
      const idx = SECTION_ORDER.indexOf(activeSection);
      if (idx < SECTION_ORDER.length - 1) onSectionChange(SECTION_ORDER[idx + 1]);
      setTimeout(() => { swipeCooldown.current = false; }, 600);
    } else if (dy < 0 && atTop && onSectionChange) {
      // Swipe down → prev section
      swipeCooldown.current = true;
      const idx = SECTION_ORDER.indexOf(activeSection);
      if (idx > 0) onSectionChange(SECTION_ORDER[idx - 1]);
      setTimeout(() => { swipeCooldown.current = false; }, 600);
    }

    touchStartY.current = null;
    touchStartX.current = null;
  };

  const variants = {
    enter: (dir: number) => ({
      y: dir > 0 ? 36 : -36,
      opacity: 0,
      filter: 'blur(4px)',
    }),
    center: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
    },
    exit: (dir: number) => ({
      y: dir > 0 ? -24 : 24,
      opacity: 0,
      filter: 'blur(3px)',
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
