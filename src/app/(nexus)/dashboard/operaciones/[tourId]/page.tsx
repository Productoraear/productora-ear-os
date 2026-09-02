'use client';

import React from 'react';
import { TourCenterAdapter } from '@/features/tour-logistics/ui/TourCenterAdapter';
import EarBottomNav from '@/components/SClassScreens/EarBottomNav';

export default function TourOperationsPage({ params }: { params: Promise<{ tourId: string }> }) {
  const resolvedParams = React.use(params);
  return (
    <div className="bg-[#050505] min-h-screen text-white relative pb-24">
      {/* 
        El padding-bottom permite que la navegación inferior 
        no tape contenido crítico de telemetría.
      */}
      <div className="p-4 md:p-8">
        <TourCenterAdapter tourId={resolvedParams.tourId} />
      </div>
      
      {/* Navegación Soberana Constante */}
      <EarBottomNav />
    </div>
  );
}
