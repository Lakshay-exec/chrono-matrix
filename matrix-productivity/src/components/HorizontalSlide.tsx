import React, { useState } from 'react';

interface HorizontalSlideProps {
  id?: string;
  isActive?: boolean;
  onActivate?: () => void;
  children: React.ReactNode;
  potatoMode?: boolean;
  className?: string;
}

export const HorizontalSlide: React.FC<HorizontalSlideProps> = ({
  id,
  isActive = true,
  onActivate,
  children,
  potatoMode = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      id={id}
      onClick={() => {
        if (!isActive && onActivate) onActivate();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`shrink-0 w-full md:w-[90vw] lg:w-[88vw] max-w-7xl snap-center transition-all ${
        !isActive ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        // On desktop, unfocused slides have subtle soft focus; on mobile or potato mode, keep sharp
        opacity: isActive ? 1 : isHovered ? 0.9 : 0.6,
        transform: potatoMode
          ? 'none'
          : isActive
          ? isHovered
            ? 'translateY(-2px)'
            : 'translateY(0px)'
          : isHovered
          ? 'translateY(-1px) scale(0.995)'
          : 'scale(0.99)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
};
