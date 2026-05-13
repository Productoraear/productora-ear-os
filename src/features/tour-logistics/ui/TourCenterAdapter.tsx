import React from 'react';
import { LiveCommandCenter } from './LiveCommandCenter';

interface TourCenterAdapterProps {
  tourId: string;
}

export const TourCenterAdapter: React.FC<TourCenterAdapterProps> = ({ tourId }) => {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Logística <span className="text-[#d4a855]">S-Class</span></h1>
        <p className="text-[11px] text-white/40 uppercase tracking-widest font-bold">Lote 03 - Módulo Uber Activo</p>
      </div>
      
      <LiveCommandCenter tourId={tourId} />
    </div>
  );
};
