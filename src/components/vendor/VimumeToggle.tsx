'use client';

import { Component, Suspense, useState, type ErrorInfo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';

interface VimumeToggleProps {
  initialState?: boolean;
  onToggle?: (isActive: boolean) => void;
  disabled?: boolean;
}

class VimumeErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[VimumeToggle] Fallo de render:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const VimumeFallback: React.FC = () => (
  <div className="flex items-center justify-between p-4 bg-[#050508] border border-white/5 rounded-2xl backdrop-blur-md text-sm text-white/70">
    Activación VIMUME temporalmente no disponible.
  </div>
);

export default function VimumeToggle({
  initialState = false,
  onToggle,
  disabled = false,
}: VimumeToggleProps) {
  const [isActive, setIsActive] = useState(initialState);

  const handleToggle = () => {
    if (disabled) return;
    const newState = !isActive;
    setIsActive(newState);
    onToggle?.(newState);
  };

  return (
    <VimumeErrorBoundary fallback={<VimumeFallback />}>
      <Suspense fallback={<VimumeFallback />}>
        <div className="flex items-center justify-between p-4 bg-[#050508] border border-white/5 rounded-2xl backdrop-blur-md transition-all hover:border-white/10">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl transition-colors ${isActive ? 'bg-[#00E5FF]/10 text-[#00E5FF]' : 'bg-white/5 text-zinc-500'}`}>
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-syne font-bold text-white">Activación VIMUME (10%)</h3>
              <p className="text-xs font-mono text-zinc-400 mt-0.5">
                Destina el 10% a musicoterapia para mayores. Desgrava IRPF.
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            disabled={disabled}
            onClick={handleToggle}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/50 focus:ring-offset-2 focus:ring-offset-[#030305] ${isActive ? 'bg-[#00E5FF]' : 'bg-zinc-700'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="sr-only">Activar VIMUME</span>
            <motion.span
              initial={false}
              animate={{ x: isActive ? 22 : 4 }}
              className="inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0"
            />
          </button>
        </div>
      </Suspense>
    </VimumeErrorBoundary>
  );
}
