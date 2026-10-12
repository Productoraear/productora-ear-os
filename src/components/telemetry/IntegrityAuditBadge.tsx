"use client";

import React, { useState } from 'react';
import { ShieldCheck, Cpu, Activity, Clock, CheckCircle2, ChevronDown, ChevronUp, Lock } from 'lucide-react';

export default function IntegrityAuditBadge() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto my-8 px-4">
      <div className="rounded-3xl bg-[#09090e]/80 border border-white/10 backdrop-blur-md overflow-hidden transition-all duration-300 shadow-xl">
        {/* Cabecera del Badge (Visible siempre) */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold font-syne text-white uppercase tracking-wider">
                  Certificado de Integridad y Rendimiento S-Class
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Lighthouse 100
                </span>
              </div>
              <p className="text-xs text-white/50">
                Arquitectura Next.js 15 Bare-Metal • Cero Scripts de Rastreo Invasivos • SHA-256 Verificado
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-xs font-mono">
              <div>
                <span className="text-white/40 block text-[10px]">TIEMPO RESPUESTA</span>
                <span className="text-emerald-400 font-bold">&lt; 38 ms</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">SPLIT SOBERANO</span>
                <span className="text-[#ecb613] font-bold">80% Artista</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">FIANZA STRIPE</span>
                <span className="text-white font-bold">100 € Price-Lock</span>
              </div>
            </div>

            <div className="text-white/40 hover:text-white transition-colors">
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
        </div>

        {/* Panel Desplegable Forense */}
        {isOpen && (
          <div className="px-5 pb-6 pt-2 border-t border-white/5 bg-black/40 text-xs text-white/70 space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Cpu size={14} className="text-[#00E5FF]" />
                  <span>Motor Bare-Metal</span>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Compilación optimizada sin plantillas CMS hinchadas ni plugins de terceros.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Lock size={14} className="text-[#ecb613]" />
                  <span>Price-Lock Criptográfico</span>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Tarifas blindadas con hash SHA-256 inmutable. Cero comisiones ocultas.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Activity size={14} className="text-emerald-400" />
                  <span>Cero Granja de Tráfico</span>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  100% visitas orgánicas directas. Cero scripts encubiertos ni redirecciones ficticias.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Clock size={14} className="text-purple-400" />
                  <span>Lock Atómico ACID</span>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Bloqueo exclusivo de fecha/hora en milisegundos para evitar sobre-reservas.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/5 text-[11px] font-mono text-white/50">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>Auditoría de Transparencia aprobada bajo Doctrina Antigravity Omega</span>
              </div>
              <span className="text-[#00E5FF]">Hostinger VPS Bare-Metal • Ubuntu 24.04 • Coolify</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
