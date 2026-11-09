import React from 'react';

interface DeckModule {
  id: string;
  label: string;
  component: React.ReactNode;
}

interface FluidDeckProps {
  activeSection: string;
  modules: DeckModule[];
  potatoMode: boolean;
}

export const FluidDeck: React.FC<FluidDeckProps> = ({
  activeSection,
  modules,
  potatoMode,
}) => {
  const activeModule = modules.find((m) => m.id === activeSection) || modules[0];

  return (
    <div className="flex-1 w-full h-full flex flex-col min-h-0 overflow-hidden">
      {/* Scrollable Viewport with 100% Guaranteed Screen Bounds */}
      <div 
        key={activeModule.id}
        className={`flex-1 w-full max-w-6xl mx-auto px-2.5 sm:px-6 py-2 sm:py-4 overflow-y-auto overflow-x-hidden ${
          potatoMode ? '' : 'page-enter'
        }`}
        style={{ scrollbarGutter: 'stable' }}
      >
        <div className="w-full">
          {activeModule.component}
        </div>
      </div>
    </div>
  );
};
