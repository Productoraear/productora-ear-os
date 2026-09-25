/**
 * 📊 EAR OS V2 — PIPELINE DE PROPUESTAS COMERCIALES S-CLASS
 * ------------------------------------------------------------------
 * Panel de control para el seguimiento y conversión de propuestas,
 * telemetría de lectura, estado de firma y depósitos Stripe 100 €.
 */

import React from 'react';
import Link from 'next/link';
import {
  Plus,
  Mic,
  ExternalLink,
  CheckCircle2,
  Eye,
  Clock,
  Send,
  Calendar,
  Building2,
  Users,
} from 'lucide-react';
import { listarPropuestas } from '@/lib/proposals/proposal-store';
import { formatoEuros, formatoEurosCorto } from '@/lib/proposals/proposal-calculator';

export const metadata = {
  title: 'Pipeline de Propuestas & Cierre · EAR OS Admin',
};

export const dynamic = 'force-dynamic';

export default async function PropuestasAdminPage() {
  const propuestas = await listarPropuestas();

  // Métricas
  const totalPropuestas = propuestas.length;
  const ganadas = propuestas.filter(p => p.estado === 'ganado');
  const vistas = propuestas.filter(p => p.estado === 'visto');

  return (
    <div className="w-full min-h-screen bg-[#030305] text-white p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Cabecera y acciones */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#ecb613]">
              Productora EAR · Motor de Ventas & Cierre
            </span>
            <h1 className="text-3xl font-extrabold text-white font-syne tracking-tight mt-1">
              Propuestas Comerciales & Telemetría
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Seguimiento de propuestas en tiempo real con detección de lectura, firma manuscrita y fianza Stripe.
            </p>
          </div>

          <Link
            href="/admin/propuestas/nueva"
            className="px-5 py-2.5 rounded-xl bg-[#ecb613] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#d8a40f] flex items-center gap-2 transition-all shadow-lg shadow-[#ecb613]/20"
          >
            <Mic className="w-4 h-4" />
            + Nueva por Voz
          </Link>
        </div>

        {/* KPIs de conversión */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#07070a] p-5">
            <span className="text-xs text-neutral-400 font-mono uppercase">Total Propuestas</span>
            <div className="mt-2 text-3xl font-bold font-mono text-white">
              {totalPropuestas}
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Generadas con cruce determinista
            </span>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <span className="text-xs text-emerald-400 font-mono uppercase">Propuestas Ganadas</span>
            <div className="mt-2 text-3xl font-bold font-mono text-emerald-400">
              {ganadas.length}
            </div>
            <span className="text-[11px] text-emerald-500/80 mt-1 block">
              Firmadas con fianza o confirmación
            </span>
          </div>

          <div className="rounded-2xl border border-[#ecb613]/20 bg-[#ecb613]/5 p-5">
            <span className="text-xs text-[#ecb613] font-mono uppercase">Leídas por el Cliente</span>
            <div className="mt-2 text-3xl font-bold font-mono text-[#ecb613]">
              {vistas.length}
            </div>
            <span className="text-[11px] text-[#ecb613]/80 mt-1 block">
              Telemetría de apertura registrada
            </span>
          </div>
        </div>

        {/* Tabla / Lista de Propuestas */}
        <div className="rounded-2xl border border-white/10 bg-[#07070a] overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white font-syne uppercase tracking-wider">
              Bandeja de Propuestas
            </h2>
          </div>

          {propuestas.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm text-neutral-400">
                Aún no has generado ninguna propuesta con el asistente de voz.
              </p>
              <Link
                href="/admin/propuestas/nueva"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
              >
                <Mic className="w-4 h-4 text-[#ecb613]" />
                Crear la primera propuesta dictando notas
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {propuestas.map((p) => {
                const totalCéntimos = p.lineas
                  .filter(l => !l.esOpcional || l.seleccionada)
                  .reduce((acc, l) => acc + l.totalCéntimos, 0) * 1.21;

                return (
                  <div
                    key={p.id}
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-[#ecb613]">
                          #{p.numero}
                        </span>
                        <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                          {p.cliente.nombre}
                        </h3>
                        {p.estado === 'ganado' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            GANADO
                          </span>
                        ) : p.estado === 'visto' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> VISTO
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-800 text-neutral-400 border border-neutral-700">
                            {p.estado}
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-neutral-500" />
                          {p.cliente.fincaOEspacio}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                          {p.cliente.fechaEvento}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-neutral-500" />
                          {p.cliente.paxEstimado} pax
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-base font-mono font-bold text-white block">
                          {formatoEurosCorto(totalCéntimos)}
                        </span>
                        <span className="text-[10px] text-neutral-500 block">Total con IVA</span>
                      </div>

                      <a
                        href={`/propuesta/${p.token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <span>Ver Dossier</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#ecb613]" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
