'use client';

import { Component, Suspense, useState, type ErrorInfo, type ReactNode } from 'react';

export interface FilterOption {
  id: string;
  label: string;
}

interface PillFilterBarProps {
  options: FilterOption[];
  onSelect: (id: string) => void;
  defaultActiveId?: string;
}

interface PillBoundaryState {
  hasError: boolean;
}

interface PillBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

class PillErrorBoundary extends Component<PillBoundaryProps, PillBoundaryState> {
  state: PillBoundaryState = { hasError: false };

  static getDerivedStateFromError(): PillBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[PillFilterBar] Fallo de render:', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const PillFallback: React.FC = () => (
  <div className="w-full overflow-x-hidden py-6 flex justify-center">
    <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-4 text-sm text-white/70 backdrop-blur-md">
      Filtros temporalmente no disponibles.
    </div>
  </div>
);

export const PillFilterBar: React.FC<PillFilterBarProps> = ({
  options,
  onSelect,
  defaultActiveId,
}) => {
  const [activeId, setActiveId] = useState(defaultActiveId || options[0]?.id || '');

  const handleSelect = (id: string) => {
    setActiveId(id);
    onSelect(id);
  };

  return (
    <PillErrorBoundary fallback={<PillFallback />}>
      <Suspense fallback={<PillFallback />}>
        <div className="w-full overflow-x-auto py-6 no-scrollbar flex justify-center">
          <div className="flex items-center gap-2 px-4">
            {options.map((option) => {
              const isActive = option.id === activeId;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`px-[18px] py-[8px] rounded-[100px] text-[14px] font-sans transition-all duration-300 ease-out whitespace-nowrap cursor-pointer ${isActive
                      ? 'bg-[#ecb613] text-[#030305] font-medium'
                      : 'bg-transparent text-white/80 border border-white/10 hover:border-[#ecb613]/40 hover:text-[#ecb613] font-normal'
                    }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </Suspense>
    </PillErrorBoundary>
  );
};

export default PillFilterBar;