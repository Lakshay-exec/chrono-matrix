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
      className={`shrink-0 w-[94vw] md:w-[90vw] lg:w-[88vw] max-w-7xl snap-center transition-all ${
        !isActive ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        // Focused active tab vs softened inactive tabs (clears instantly on hover or active)
        filter: potatoMode
          ? 'none'
          : isActive
          ? 'none'
          : isHovered
          ? 'none'
          : 'blur(3px)',
        opacity: isActive ? 1 : isHovered ? 0.9 : 0.45,
        transform: potatoMode
          ? 'none'
          : isActive
          ? isHovered
            ? 'translateY(-2px)'
            : 'translateY(0px)'
          : isHovered
          ? 'translateY(-1px) scale(0.995)'
          : 'scale(0.99)',
        transition:
          'filter 0.22s ease-out, opacity 0.22s ease-out, transform 0.22s ease-out',
      }}
    >
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};
