"use client";

import React from 'react';

interface CareerMilestone {
  title: string;
  category: string;
  impactScore: number;
}

interface DigitalAsset {
  name: string;
  roiCurrent: number;
  roiProjected: number;
  status: string;
}

interface UserSovereignProps {
  name: string;
  rank: string;
  xp: number;
  maxXp: number;
  milestones: CareerMilestone[];
  assets: DigitalAsset[];
}

export const UserSovereign: React.FC<UserSovereignProps> = ({
  name,
  rank,
  xp,
  maxXp,
  milestones,
  assets
}) => {
  const xpPercentage = (xp / maxXp) * 100;

  return (
    <div className="bg-black/80 border border-gold/20 rounded-xl p-8 text-white backdrop-blur-xl">
      {/* Header Soberano */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gold via-white to-gold">
            {name}
          </h1>
          <p className="text-gold/60 font-mono tracking-widest text-sm uppercase mt-1">
            {rank} • PACIENTE CERO
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono text-gold">{xp} <span className="text-sm text-white/40">/ {maxXp} XP</span></div>
          <div className="w-48 h-1 bg-white/10 mt-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gold transition-all duration-1000 ease-out" 
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Impact Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {milestones.map((m, index) => (
          <div key={index} className="bg-white/5 border border-white/10 p-4 rounded-lg hover:border-gold/40 transition-colors">
            <div className="text-xs text-gold/40 mb-1 font-mono">{m.category}</div>
            <div className="text-lg font-medium">{m.title}</div>
            <div className="flex items-center mt-2">
              <div className="text-sm text-white/60">Impacto:</div>
              <div className="ml-2 text-sm text-gold font-bold">{m.impactScore}%</div>
            </div>
          </div>
        ))}
      </div>

      {/* Digital Assets Analytics */}
      <div>
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <span className="w-2 h-2 bg-gold rounded-full mr-3 animate-pulse" />
          BÓVEDA DE ACTIVOS DIGITALES
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-white/40 text-xs uppercase tracking-widest border-b border-white/10">
              <tr>
                <th className="pb-4">Activo</th>
                <th className="pb-4">Estado</th>
                <th className="pb-4 text-right">ROI Actual</th>
                <th className="pb-4 text-right">ROI Proyectado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assets.map((asset, index) => (
                <tr key={index} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 font-medium">{asset.name}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-gold/10 text-gold text-[10px] rounded border border-gold/20">
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-4 text-right font-mono text-white/80">{asset.roiCurrent.toLocaleString()} €</td>
                  <td className="py-4 text-right font-mono text-gold">{asset.roiProjected.toLocaleString()} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
