import React from 'react';
import { MarketplaceDashboard } from '@/features/analytics/components/MarketplaceDashboard';
import { ClosingAnalytics } from '@/features/analytics/components/ClosingAnalytics';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-12 md:p-20">
      <header className="mb-20">
        <span className="text-[#d4a855] text-[10px] font-black tracking-[0.5em] uppercase mb-4 block">S-Class Intelligence Engine</span>
        <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic">Marketplace <span className="text-white/20">Signals</span></h1>
      </header>
      
      <MarketplaceDashboard />
      
      <ClosingAnalytics />
    </div>
  );
}
