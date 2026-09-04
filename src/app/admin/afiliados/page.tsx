'use client';
import React, { useState } from 'react';
import { MOCK_AFFILIATES, AFFILIATE_TIERS, calcularComisionAfiliado } from '@/modules/affiliates/affiliates_engine';

export default function AffiliatesCockpitView() {
  const [affiliates, setAffiliates] = useState(MOCK_AFFILIATES);
  const [simulacionMonto, setSimulacionMonto] = useState<number>(650);
  const [selectedTier, setSelectedTier] = useState<string>('tier-2');

  const resultadoSimulacion = calcularComisionAfiliado(simulacionMonto, selectedTier);

  return (
    <div className="p-8 bg-neutral-950 min-h-screen text-neutral-100 font-sans">
      <header className="mb-8 border-b border-amber-500/30 pb-4">
        <h1 className="text-3xl font-extrabold text-amber-500 tracking-tight">RED DE AFILIADOS & COMISIONAMIENTO (EAR OS)</h1>
        <p className="text-sm text-neutral-400 mt-1">Motor nativo en TypeScript optimizado para partners, comerciales y red de recomendación.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">👥 Partners Activos</h2>
          <div className="space-y-4">
            {affiliates.map((aff) => {
              const tier = AFFILIATE_TIERS.find(t => t.id === aff.rangoId);
              return (
                <div key={aff.id} className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-amber-400">{aff.nombre}</h3>
                    <p className="text-xs text-neutral-400">Código: <span className="font-mono text-white">{aff.codigoReferido}</span> | Rango: <span className="text-emerald-400">{tier?.nombre}</span></p>
                    <span className="inline-block mt-2 bg-neutral-900 text-neutral-300 text-[10px] px-2 py-0.5 rounded font-mono">
                      Ventas: {aff.totalVentasGeneradas} | Comisiones pagadas: {aff.comisionesAcumuladas.toLocaleString()} €
                    </span>
                  </div>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs px-3 py-1 rounded-lg font-bold">
                    Activo
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">🧮 Simulador de Comisiones</h2>
            <p className="text-xs text-neutral-400 mb-4">Calcula al instante el desglose de comisiones para cualquier importe de cierre.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Importe del Servicio (€):</label>
                <input 
                  type="number" 
                  value={simulacionMonto} 
                  onChange={(e) => setSimulacionMonto(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white font-mono text-sm focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Rango del Partner:</label>
                <select 
                  value={selectedTier} 
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white text-sm focus:border-amber-500 outline-none"
                >
                  {AFFILIATE_TIERS.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre} ({t.porcentajeComision}%)</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-neutral-950 p-4 rounded-xl border border-amber-500/30">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-neutral-400">Comisión Partner:</span>
              <span className="font-mono text-amber-400 font-bold">{resultadoSimulacion.comision} €</span>
            </div>
            <div className="flex justify-between text-xs pt-2 border-t border-neutral-800">
              <span className="text-neutral-400">Neto Productora EAR:</span>
              <span className="font-mono text-emerald-400 font-bold">{resultadoSimulacion.netoPlataforma} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
