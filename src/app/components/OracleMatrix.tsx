'use client';
import React, { useState } from 'react';
import { useEarStore, InvestmentNode } from '../../store/useEarStore';

const OracleMatrix: React.FC = () => {
  const { xpArtista, totalAura, investments, projectedROI, addInvestment, removeInvestment } = useEarStore();
  
  // Nodos S-Class simulados (Phantom Nodes)
  const phantomNodes: InvestmentNode[] = [
    { id: 'pn-1', name: 'Phantom Rigging', type: 'EQUIPMENT', cost: 1500, roiProjected: 3200, auraLevel: 8.5, reliabilityScore: 99.9 },
    { id: 'pn-2', name: 'Astra Neural Link', type: 'VENDOR', cost: 5000, roiProjected: 12000, auraLevel: 9.8, reliabilityScore: 100 },
    { id: 'pn-3', name: 'Vimume Artist', type: 'ARTIST', cost: 800, roiProjected: 2400, auraLevel: 7.2, reliabilityScore: 92.5 }
  ];

  const handleClaimNode = (node: InvestmentNode) => {
    // Si no está invertido, añadirlo
    if (!investments.find(i => i.id === node.id)) {
      addInvestment(node);
    }
  };

  return (
    <div className="surface-card p-6 md:p-8 rounded-3xl w-full max-w-5xl mx-auto mt-8 border border-white/10 shadow-[0_0_30px_rgba(212,168,85,0.1)] transition-all duration-700 hover:shadow-[0_0_50px_rgba(212,168,85,0.2)]">
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gold-gradient tracking-tight">ORACLE MATRIX V3</h2>
          <p className="text-on-surface-muted text-sm mt-1 uppercase tracking-widest font-syne">Motor de Inversión Predictiva S-Class</p>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase text-on-surface-muted mb-1">Impacto Global ROI</div>
          <div className="text-4xl font-black text-[#d4a855] drop-shadow-[0_0_10px_rgba(212,168,85,0.8)]">
            €{projectedROI.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Panel Izquierdo: Estado del Artista / Flota */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-morphism p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4a855]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-sm uppercase tracking-widest text-on-surface-muted mb-4">Métricas Base</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60 font-medium">Experiencia (XP)</span>
                <span className="text-xl font-bold text-white">{xpArtista} <span className="text-xs text-gold">XP</span></span>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
              <div className="flex justify-between items-center">
                <span className="text-white/60 font-medium">Nivel de Aura Total</span>
                <span className="text-xl font-bold text-white">{totalAura.toFixed(1)} <span className="text-xs text-blue-400">⚡</span></span>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
              <div className="flex justify-between items-center">
                <span className="text-white/60 font-medium">Nodos Activos</span>
                <span className="text-xl font-bold text-white">{investments.length}</span>
              </div>
            </div>
          </div>

          <div className="glass-morphism p-5 rounded-2xl">
            <h3 className="text-sm uppercase tracking-widest text-on-surface-muted mb-4">Nodos Soberanos Adquiridos</h3>
            {investments.length === 0 ? (
              <p className="text-white/30 text-sm italic">Bóveda vacía. Reclama nodos para incrementar el ROI.</p>
            ) : (
              <ul className="space-y-3">
                {investments.map((node) => (
                  <li key={node.id} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{node.name}</span>
                      <span className="text-[10px] text-white/50 uppercase tracking-wider">{node.type}</span>
                    </div>
                    <button 
                      onClick={() => removeInvestment(node.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Eliminar Nodo"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Panel Derecho: Phantom Market (Nodos de simulación) */}
        <div className="lg:col-span-8">
          <h3 className="text-sm uppercase tracking-widest text-on-surface-muted mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
            Mercado OMEGA en vivo
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {phantomNodes.map((node) => {
              const isClaimed = investments.some(i => i.id === node.id);
              
              return (
                <div key={node.id} className={`glass-morphism p-5 rounded-2xl border \${isClaimed ? 'border-gold/30 bg-gold/5' : 'border-white/5 hover:border-white/20'} transition-all duration-300`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-white">{node.name}</h4>
                      <span className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full uppercase tracking-wider">{node.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/50">Costo</div>
                      <div className="text-sm font-medium text-white">€{node.cost}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-5 bg-black/20 rounded-lg p-3 border border-white/5">
                    <div>
                      <div className="text-[10px] uppercase text-on-surface-muted">Aura</div>
                      <div className="text-sm font-bold text-blue-400">{node.auraLevel}⚡</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-on-surface-muted">Proyección ROI</div>
                      <div className="text-sm font-bold text-green-400">+€{node.roiProjected}</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleClaimNode(node)}
                    disabled={isClaimed}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold tracking-widest transition-all duration-300 \${isClaimed 
                      ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5' 
                      : 'bg-gradient-to-r from-[#d4a855] to-[#b68d3a] text-black shadow-[0_0_15px_rgba(212,168,85,0.4)] hover:shadow-[0_0_25px_rgba(212,168,85,0.6)] hover:scale-[1.02]'}`}
                  >
                    {isClaimed ? 'NODO ASEGURADO' : 'INYECTAR NODO'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OracleMatrix;
