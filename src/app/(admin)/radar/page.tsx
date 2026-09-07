import React from 'react';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle, Database } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function RadarCoveragePage() {
  const matrixPath = path.join(process.cwd(), 'docs', 'architecture', 'HISTORIC_FORENSIC_GAP_MATRIX.json');
  
  let reportData = {
    audit_date: 'No auditada',
    total_signatures: 0,
    implemented_count: 0,
    missing_count: 0,
    coverage_ratio: 0,
    matrix: [] as Array<{ Type: string; Signature: string; Status: string; Diagnostics: string }>
  };

  if (fs.existsSync(matrixPath)) {
    try {
      const raw = fs.readFileSync(matrixPath, 'utf8');
      reportData = JSON.parse(raw);
    } catch (e) {
      console.error('Error leyendo matriz forense:', e);
    }
  }

  const missingItems = reportData.matrix.filter((item) => item.Status === 'MISSING_IN_REPO');
  const safeRatio = Math.min(Math.max(reportData.coverage_ratio, 0), 100);

  return (
    <main className="min-h-screen bg-[#050505] text-[#FFFFFF] p-6 font-sans">
      {/* HUD Header */}
      <header className="border-b border-[#1a1a1a] pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#258DCD] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#258DCD]">
              EAR_OS // COGNITIVE RADAR HUD
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-white">
            Monitor de Soberanía y Cobertura Histórica
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-mono transition-colors"
          >
            Volver a la Home
          </Link>
          <a
            href="tel:+34693693048"
            className="px-4 py-2 bg-[#258DCD]/10 border border-[#258DCD]/30 text-[#258DCD] hover:bg-[#258DCD]/20 rounded-xl text-xs font-mono transition-colors"
          >
            Centralita: +34 693 693 048
          </a>
        </div>
      </header>

      {/* Tarjetas Métricas */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#081226]/40 border border-[#1a1a1a] p-5 rounded-2xl">
          <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider block">Coverage Ratio</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#258DCD] font-mono">
              {reportData.coverage_ratio}%
            </span>
            <span className="text-xs text-zinc-500">objetivo 100%</span>
          </div>
          <div className="w-full bg-zinc-900 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-[#258DCD] h-full transition-all duration-500"
              style={{ width: `${safeRatio}%` }}
            />
          </div>
        </div>

        <div className="bg-zinc-950 border border-[#1a1a1a] p-5 rounded-2xl">
          <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider block">Total Firmas Auditadas</span>
          <span className="text-3xl font-extrabold text-white font-mono mt-2 block">
            {reportData.total_signatures}
          </span>
          <span className="text-xs text-zinc-500 mt-2 block">Extraídas de Bóveda y Chats</span>
        </div>

        <div className="bg-zinc-950 border border-[#1a1a1a] p-5 rounded-2xl">
          <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider block">Implementadas Activas</span>
          <span className="text-3xl font-extrabold text-[#AAD6CD] font-mono mt-2 block">
            {reportData.implemented_count}
          </span>
          <span className="text-xs text-emerald-500/80 mt-2 block flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Compilando en src/
          </span>
        </div>

        <div className="bg-zinc-950 border border-[#1a1a1a] p-5 rounded-2xl">
          <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider block">Brechas Pendientes</span>
          <span className="text-3xl font-extrabold text-[#FF455B] font-mono mt-2 block">
            {reportData.missing_count}
          </span>
          <span className="text-xs text-[#FF455B]/80 mt-2 block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Faltan por absorber
          </span>
        </div>
      </section>

      {/* Lista de Deuda Técnica / Missing Signatures */}
      <section className="bg-zinc-950 border border-[#1a1a1a] rounded-2xl p-6">
        <div className="border-b border-[#1a1a1a] pb-4 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-[#258DCD]" />
              Entidades Pendientes de Absorción (Filtro ZTM)
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Firmas técnicas detectadas en sesiones de IA que aún no residen en el código físico activo.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
            {missingItems.length} requeridas
          </span>
        </div>

        {missingItems.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-zinc-800 rounded-xl">
            <ShieldCheck className="w-8 h-8 text-[#AAD6CD] mx-auto mb-2" />
            <p className="text-sm text-zinc-300 font-semibold">Soberanía Absoluta Alcanzada</p>
            <p className="text-xs text-zinc-500 mt-1">
              El 100% de los activos históricos están implementados y verificados.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#1a1a1a] max-h-[500px] overflow-y-auto font-mono text-xs">
            {missingItems.map((item, idx) => (
              <div key={idx} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px]">
                    {item.Type}
                  </span>
                  <span className="text-zinc-200 font-semibold">{item.Signature}</span>
                </div>
                <span className="text-zinc-500 text-[11px]">{item.Diagnostics}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
