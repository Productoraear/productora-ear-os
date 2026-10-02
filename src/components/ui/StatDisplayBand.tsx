'use client';

import React, { Component, Suspense, type ErrorInfo, type ReactNode } from 'react';

export interface StatItem {
  value: string;
  superscript?: string;
  label: string;
}

interface StatDisplayBandProps {
  stats: StatItem[];
  title?: string;
}

interface StatBoundaryState {
  hasError: boolean;
}

interface StatBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

class StatErrorBoundary extends Component<StatBoundaryProps, StatBoundaryState> {
  state: StatBoundaryState = { hasError: false };

  static getDerivedStateFromError(): StatBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[StatDisplayBand] Fallo de render:', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const StatFallback: React.FC = () => (
  <section className="w-full bg-[#050507] py-20 px-6 border-y border-white/5">
    <div className="max-w-[1200px] mx-auto text-center text-sm text-white/70">
      Métricas temporalmente no disponibles.
    </div>
  </section>
);

export const StatDisplayBand: React.FC<StatDisplayBandProps> = ({ stats, title }) => {
  return (
    <StatErrorBoundary fallback={<StatFallback />}>
      <Suspense fallback={<StatFallback />}>
        <section className="w-full bg-[#050507] py-20 px-6 border-y border-white/5">
          <div className="max-w-[1200px] mx-auto space-y-12">
            {title && (
              <div className="text-center">
                <span className="font-sans font-normal text-[12px] uppercase tracking-widest text-white/50">
                  {title}
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="flex flex-col items-center">
                  <div className="flex items-baseline mb-2">
                    <span className="font-sans font-light text-[80px] md:text-[100px] leading-none tracking-[-0.06em] text-white">
                      {stat.value}
                    </span>
                    {stat.superscript && (
                      <span className="font-sans font-light text-2xl md:text-4xl text-[#ecb613] ml-1">
                        {stat.superscript}
                      </span>
                    )}
                  </div>
                  <span className="font-sans font-normal text-[12px] uppercase tracking-wider text-white/50">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Suspense>
    </StatErrorBoundary>
  );
};

export default StatDisplayBand;