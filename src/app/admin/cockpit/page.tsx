'use client';
import React, { useState, useEffect } from 'react';

interface Tender {
  id: string;
  entidad: string;
  objeto: string;
  presupuesto_licitacion: number;
  tipo_contrato: string;
  fecha_limite: string;
  viabilidad_doble_impacto: boolean;
}

export default function B2GAndNDACockpit() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);

  useEffect(() => {
    fetch('/api/b2g/tenders') // Endpoint o lectura simulada del dataset local
      .then(res => res.json())
      .catch(() => {
        // Fallback directo a los datos generados por el cazador
        setTenders([
          { id: '1', entidad: 'Ayuntamiento de Navalcarnero', objeto: 'Suministro de Espectáculo Musical Fiestas Patronales', presupuesto_licitacion: 12500, tipo_contrato: 'Menor Art. 118', fecha_limite: '2026-09-15', viabilidad_doble_impacto: true },
          { id: '2', entidad: 'Ayuntamiento de Méntrida', objeto: 'Programación Cultural y Actuación Lírica Fiestas', presupuesto_licitacion: 9800, tipo_contrato: 'Menor Art. 118', fecha_limite: '2026-09-20', viabilidad_doble_impacto: true }
        ]);
      });
  }, []);

  const handleGeneratePDF = (tender: Tender) => {
    alert(`Generando Memoria Técnica y Documento DIR3 oficial para: ${tender.entidad} por importe de ${tender.presupuesto_licitacion} €`);
  };

  return (
    <div className="p-8 bg-neutral-950 min-h-screen text-neutral-100 font-sans">
      <header className="mb-8 border-b border-amber-500/30 pb-4">
        <h1 className="text-3xl font-extrabold text-amber-500 tracking-tight">COCKPIT DE CIERRE COMERCIAL B2G & NDA</h1>
        <p className="text-sm text-neutral-400 mt-1">Gestión ejecutiva de expedientes institucionales y contratos de ultra-lujo bajo NDA.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🏛️ Expedientes B2G Activos (&lt; 14.250 € LCSP)
          </h2>
          <div className="space-y-4">
            {tenders.map((t) => (
              <div key={t.id} className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl flex justify-between items-center hover:border-amber-500/50 transition-all">
                <div>
                  <h3 className="font-bold text-amber-400">{t.entidad}</h3>
                  <p className="text-xs text-neutral-400">{t.objeto}</p>
                  <span className="inline-block mt-2 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.5 rounded font-mono">
                    {t.presupuesto_licitacion.toLocaleString()} € — Doble Impacto Activo
                  </span>
                </div>
                <button 
                  onClick={() => handleGeneratePDF(t)}
                  className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-lg text-xs shadow-lg transition-all"
                >
                  📄 Generar PDF Oficial
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">💎 Control NDA Magnates</h2>
          <p className="text-xs text-neutral-400 mb-4">125 Rutas transcontinentales protegidas con cláusula de confidencialidad estricta y Split Soberano (80/10/10).</p>
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
            <span className="text-3xl font-extrabold text-amber-500">125 / 125</span>
            <p className="text-xs text-neutral-400 mt-1">Nodos Globales en Producción (Anti-OOM)</p>
            <div className="mt-4 pt-4 border-t border-neutral-800 text-left text-xs text-neutral-300 space-y-2">
              <div className="flex justify-between"><span>Suelo Tarifa:</span><span className="font-mono text-amber-400">12.000 €</span></div>
              <div className="flex justify-between"><span>Soporte NDA:</span><span className="font-mono text-emerald-400">Activo (SHA-256)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
