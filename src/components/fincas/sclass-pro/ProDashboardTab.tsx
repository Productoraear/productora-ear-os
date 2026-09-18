"use client";

import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Star,
  Eye,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Calendar,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Award
} from 'lucide-react';

interface ProDashboardTabProps {
  onNavigateTab?: (tabId: string) => void;
  onNavigate?: (tabId: string) => void;
}

export const ProDashboardTab: React.FC<ProDashboardTabProps> = ({ onNavigateTab, onNavigate }) => {
  const navigate = (tabId: string) => {
    if (onNavigate) onNavigate(tabId);
    if (onNavigateTab) onNavigateTab(tabId);
  };

  // Datos mensuales reales de los últimos 12 meses (Sep a Sep)
  const monthlyData = [
    { month: 'Sep', count: 2 },
    { month: 'Oct', count: 10 },
    { month: 'Nov', count: 18 },
    { month: 'Dic', count: 7 },
    { month: 'Ene', count: 7 },
    { month: 'Feb', count: 2 },
    { month: 'Mar', count: 3 },
    { month: 'Abr', count: 3 },
    { month: 'May', count: 1 },
    { month: 'Jun', count: 1 },
    { month: 'Jul', count: 1 },
    { month: 'Ago', count: 6 },
    { month: 'Sep', count: 5 }
  ];

  const maxVal = Math.max(...monthlyData.map(d => d.count));

  return (
    <div className="space-y-8 font-sans text-zinc-200">
      {/* 1. Header Banner & Identity */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              PORTAL EMPRESAS &bull; S-CLASS PRO V7.0
            </span>
            <span className="text-xs font-mono text-zinc-500">ID Proveedor: 78903</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-syne text-white tracking-tight">
            PRODUCTORA EAR &bull; EDWIN AGUDELO
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Música en directo, solista acústico de gala, microfonía Shure Beta 87A y sonorización Bose F1 812 (&lt; 75 dB SPL). Operando con Split Soberano 80/10/10 y depósito inmutable de 100 &euro;.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={() => navigate('solicitudes')}
            className="px-4 py-2.5 rounded-full bg-[#ecb613] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(236,182,19,0.3)] active:scale-95"
          >
            Ver 223 Solicitudes
          </button>
          <button
            type="button"
            onClick={() => navigate('escaparate')}
            className="px-4 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-medium transition-all active:scale-95 border border-zinc-700"
          >
            Editar Escaparate (80%)
          </button>
        </div>
      </div>

      {/* 2. Cuatro Métricas SSOT Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Métrica 1: Impresiones */}
        <div className="p-5 rounded-2xl bg-[#09090b] border border-zinc-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#00E5FF]" /> Impresiones
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
              Histórico
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white">4.340</span>
            <span className="text-xs text-zinc-500 font-mono">totales</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans">
            66 impresiones en los últimos 12 meses.
          </p>
        </div>

        {/* Métrica 2: Solicitudes */}
        <div className="p-5 rounded-2xl bg-[#09090b] border border-zinc-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#ecb613]" /> Solicitudes
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
              CRM Activo
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white">223</span>
            <span className="text-xs text-zinc-500 font-mono">recibidas</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans">
            208 atendidas &bull; 1 contratada &bull; 14 descartadas
          </p>
        </div>

        {/* Métrica 3: Opiniones */}
        <div className="p-5 rounded-2xl bg-[#09090b] border border-zinc-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Valoración
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              100% 5 Estrellas
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white">5.0</span>
            <span className="text-xs text-zinc-500 font-mono">/ 5.0</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans">
            4 opiniones auditadas &bull; 0 negativas
          </p>
        </div>

        {/* Métrica 4: Escaparate */}
        <div className="p-5 rounded-2xl bg-[#09090b] border border-zinc-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Homologación
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Falta 1 paso
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white">80%</span>
            <span className="text-xs text-zinc-500 font-mono">completado</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans">
            Solicita 1 opinión más para alcanzar sello S-Class Top.
          </p>
        </div>
      </div>

      {/* 3. Gráfico Interactivo de Impresiones Mensuales */}
      <div className="p-6 rounded-3xl bg-[#09090b] border border-zinc-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-base font-bold font-syne text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#ecb613]" />
              Impresiones en el Catálogo &bull; Últimos 12 Meses
            </h3>
            <p className="text-xs text-zinc-400">
              Visualización de impacto de búsqueda de parejas interesadas en música para bodas (Toledo / Madrid).
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 self-start sm:self-auto">
            Total periodo: 66 visitas
          </span>
        </div>

        <div className="pt-6 pb-2">
          <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-3 px-2">
            {monthlyData.map((item, idx) => {
              const heightPercent = Math.max((item.count / maxVal) * 100, 8);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[11px] font-mono font-bold text-zinc-400 group-hover:text-[#ecb613] transition-colors">
                    {item.count}
                  </span>
                  <div className="w-full max-w-[34px] bg-zinc-800 rounded-t-lg group-hover:bg-[#ecb613] transition-all relative overflow-hidden flex items-end" style={{ height: `${heightPercent}%` }}>
                    <div className="w-full h-full bg-gradient-to-t from-transparent via-white/5 to-white/15" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 group-hover:text-white transition-colors">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Comparativa Demoledora: Directorio Tradicional vs S-Class Pro */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-rose-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 mb-6">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-500/10 border border-rose-500/30 text-rose-400">
            DICTAMEN FINANCIERO DEMOLEDOR
          </span>
          <h3 className="text-xl sm:text-2xl font-black font-syne text-white uppercase tracking-tight">
            ¿Por qué pagar cuotas mensuales a un directorio que oculta tu teléfono?
          </h3>
          <p className="text-xs text-zinc-400 max-w-3xl">
            En los portales tradicionales, cobran entre 1.500 &euro; y 6.000 &euro; al año por un &ldquo;Pack Premium&rdquo; que envía el mismo lead a 40 proveedores a la vez, desatando una subasta de precios a la baja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-rose-900/30 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase">
              <AlertCircle className="w-4 h-4" /> El Modelo Extractivo Tradicional
            </div>
            <ul className="text-xs space-y-2 text-zinc-400 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">&times;</span>
                <span>Cuota fija obligatoria anual (sin garantía de cierre de bolos).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">&times;</span>
                <span>Teléfono oculto si no pagas el pack más caro.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">&times;</span>
                <span>Subasta abierta de precios contra proveedores que revientan el mercado a 150 &euro;.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">&times;</span>
                <span>Cero garantías acústicas y riesgo de multas a la finca.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#ecb613]/5 border border-[#ecb613]/30 space-y-3">
            <div className="flex items-center gap-2 text-[#ecb613] font-mono text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" /> La Infraestructura S-Class Pro (EAR OS)
            </div>
            <ul className="text-xs space-y-2 text-zinc-300 font-sans">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Cero Cuotas Fijas:</strong> No pagas ni un solo euro por adelantado.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Teléfono Visible 24/7 (+34 693 693 048):</strong> Contacto directo e inmediato.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Split Soberano 80/10/10:</strong> 80% artista, 10% EAR OS, 10% VIMUME deducible (Ley 49/2002).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Depósito Inmutable 100 &euro; Stripe:</strong> Price-Lock SHA-256 para congelar la fecha.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
