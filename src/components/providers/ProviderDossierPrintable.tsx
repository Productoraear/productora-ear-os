'use client';

import React from 'react';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';
import { ShieldCheck, Award, FileCheck2, Printer, ArrowLeft } from 'lucide-react';

export interface ProviderDossierData {
  nombreComercial: string;
  categoria: string;
  cifNif: string;
  provincia: string;
  municipioBase: string;
  tarifaDesdeEur: number;
  seguroResponsabilidadCivil: string;
  potenciaAcusticaHomologadaDb?: number;
  descripcionServicio: string;
  repertorioEquipamiento: string[];
  contactoTelefono: string;
  fechaEmisionIso: string;
  hashVerificacionSha256: string;
}

export function ProviderDossierPrintable({
  data,
  onBack,
}: {
  data: ProviderDossierData;
  onBack?: () => void;
}) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-8 font-sans print:p-0 print:bg-white print:text-black">
      {/* Barra de Controles en Pantalla (Oculta en Impresión) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm border border-zinc-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Cockpit</span>
          </button>
        )}
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Guardar como PDF (A4)</span>
        </button>
      </div>

      {/* Hoja A4 Estándar Contrato */}
      <div className="dossier-page max-w-4xl mx-auto bg-[#050507] border border-zinc-800 p-8 sm:p-12 rounded-2xl shadow-2xl print:border-none print:p-8 print:shadow-none print:bg-white print:text-black print:rounded-none">
        
        {/* Cabecera Institucional y Verificación */}
        <header className="border-b-2 border-amber-500/80 pb-6 mb-8 flex justify-between items-start gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 print:text-amber-700 text-xs font-mono uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Proveedor Homologado · Protocolo S-Class
            </div>
            <h1 className="text-3xl font-extrabold text-white print:text-black tracking-tight font-syne">
              {data.nombreComercial}
            </h1>
            <p className="text-sm text-zinc-400 print:text-zinc-600 mt-1">
              Ficha Técnica Oficial · Especialidad: <span className="font-semibold text-zinc-200 print:text-zinc-800">{data.categoria}</span>
            </p>
          </div>

          <div className="text-right font-mono text-xs text-zinc-400 print:text-zinc-600 space-y-1">
            <div className="text-amber-400 print:text-amber-800 font-bold">EAR OS PLATFORM CERTIFIED</div>
            <div>EXP: {data.hashVerificacionSha256.substring(0, 12).toUpperCase()}</div>
            <div>FECHA: {new Date(data.fechaEmisionIso).toLocaleDateString('es-ES')}</div>
          </div>
        </header>

        {/* Cuerpo Principal del Dossier */}
        <main className="space-y-8 text-sm">
          
          {/* Identificación y Blindaje Legal */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-900/60 print:bg-zinc-100 border border-zinc-800 print:border-zinc-300">
            <div>
              <div className="text-xs text-zinc-500 print:text-zinc-500 uppercase">CIF / NIF</div>
              <div className="font-mono font-medium text-zinc-200 print:text-zinc-800">{data.cifNif}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 print:text-zinc-500 uppercase">PLAZA BASE</div>
              <div className="font-medium text-zinc-200 print:text-zinc-800">{data.municipioBase} ({data.provincia})</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 print:text-zinc-500 uppercase">PÓLIZA RC VIGENTE</div>
              <div className="font-medium text-zinc-200 print:text-zinc-800">{data.seguroResponsabilidadCivil}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 print:text-zinc-500 uppercase">ACÚSTICA / HOMOLOGACIÓN</div>
              <div className="font-medium text-zinc-200 print:text-zinc-800">
                {data.potenciaAcusticaHomologadaDb ? `≤ ${data.potenciaAcusticaHomologadaDb} dB (Aforo)` : 'Cumple Normativa'}
              </div>
            </div>
          </section>

          {/* Memoria Descriptiva del Servicio */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white print:text-black uppercase tracking-wide border-b border-zinc-800 print:border-zinc-300 pb-1">
              1. Memoria Descriptiva y Alcance de Servicio
            </h2>
            <p className="text-zinc-300 print:text-zinc-700 leading-relaxed text-justify">
              {data.descripcionServicio}
            </p>
          </section>

          {/* Dotación Técnica / Equipamiento / Repertorio */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-white print:text-black uppercase tracking-wide border-b border-zinc-800 print:border-zinc-300 pb-1">
              2. Dotación Técnica y Recursos Acreditados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.repertorioEquipamiento.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-zinc-300 print:text-zinc-800">
                  <FileCheck2 className="w-4 h-4 text-amber-500 print:text-amber-700 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Cláusula Económica y Garantías */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white print:text-black uppercase tracking-wide border-b border-zinc-800 print:border-zinc-300 pb-1">
              3. Tarifario Oficial y Cláusula Price-Lock
            </h2>
            <div className="flex justify-between items-center p-4 rounded-xl bg-zinc-900/40 print:bg-zinc-50 border border-zinc-800 print:border-zinc-300">
              <div>
                <div className="text-xs text-zinc-400 print:text-zinc-600">Tarifa Base Homologada desde:</div>
                <div className="text-2xl font-extrabold text-amber-400 print:text-black font-mono">
                  {data.tarifaDesdeEur.toLocaleString('es-ES')} € <span className="text-xs font-normal text-zinc-400">+ IVA</span>
                </div>
              </div>
              <div className="text-right text-xs text-zinc-400 print:text-zinc-600 max-w-xs space-y-1">
                <div>• Depósito deducible al 100% de la liquidación.</div>
                <div>• Liquidación protegida bajo Split Soberano garantizado.</div>
              </div>
            </div>
          </section>

          {/* Sello de Retorno Social VIMUME */}
          <section className="p-4 rounded-xl bg-emerald-950/20 print:bg-emerald-50 border border-emerald-500/30 print:border-emerald-300 flex items-center gap-4">
            <Award className="w-8 h-8 text-emerald-400 print:text-emerald-700 flex-shrink-0" />
            <div className="text-xs text-zinc-300 print:text-zinc-700 leading-normal">
              <span className="font-bold text-white print:text-black block text-sm">Compromiso Social Adherido (VIMUME)</span>
              Cada contratación realizada a través de este proveedor transfiere automáticamente el porcentaje canónico a la Fundación VIMUME para sesiones de musicoterapia y estimulación cognitiva en residencias municipales.
            </div>
          </section>

        </main>

        {/* Pie de Página y Firma Digital */}
        <footer className="mt-12 pt-6 border-t border-zinc-800 print:border-zinc-300 flex justify-between items-end text-xs text-zinc-500 print:text-zinc-600 font-mono">
          <div>
            <div>CENTRALITA OFICIAL: {CENTRALITA_EAR_OS}</div>
            <div>VERIFICACIÓN: productoraear.com/verificar/{data.hashVerificacionSha256.substring(0, 16)}</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-zinc-300 print:text-black">SELLO TÉCNICO EAR OS V2</div>
            <div>STATUS: CONTRATO HOMOLOGADO</div>
          </div>
        </footer>

      </div>
    </div>
  );
}
