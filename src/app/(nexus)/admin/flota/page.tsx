'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Truck, 
  MapPin, 
  Users, 
  Radio, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  Phone, 
  Layers, 
  Clock, 
  Navigation, 
  Award, 
  Volume2, 
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { LiveSonometryGuard } from '@/components/vimume/LiveSonometryGuard';

interface CuadrillaFleetItem {
  id: string;
  name: string;
  leader: string;
  format: 'Solista' | 'Dúo' | 'Trío' | 'Cuarteto' | 'Quinteto' | 'Imperial';
  status: 'EN_RUTA' | 'EN_TARIMA' | 'DISPONIBLE' | 'COMPLETADO';
  venueName: string;
  city: string;
  distanceFromMentridaKm: number;
  eta: string;
  soundSystem: string;
  totalBudgetEuro: number;
  musiciansPayoutEuro: number; // 80%
  contactPhone: string;
}

export default function AdminFlotaPage() {
  const [selectedHub, setSelectedHub] = useState<string>('Méntrida (Hub Central)');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [dispatchModalOpen, setDispatchModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'FLEET' | 'SONOMETRY'>('FLEET');

  // Cuadrillas activas de la flota EAR OS
  const [cuadrillas, setCuadrillas] = useState<CuadrillaFleetItem[]>([
    {
      id: 'FL-001',
      name: 'Cuadrilla 1 — Solista de Gala',
      leader: 'Edwin Agudelo',
      format: 'Solista',
      status: 'EN_RUTA',
      venueName: 'Finca El Regajal',
      city: 'Aranjuez (Madrid)',
      distanceFromMentridaKm: 65,
      eta: '18:30 (En Hora)',
      soundSystem: 'Bose F1 Model 812 + Shure Beta 87A',
      totalBudgetEuro: 372.50,
      musiciansPayoutEuro: 298.00, // 80%
      contactPhone: '+34 693 693 048'
    },
    {
      id: 'FL-002',
      name: 'Cuadrilla 2 — Trío Tradicional',
      leader: 'Marco Aurelio / Vihuela',
      format: 'Trío',
      status: 'EN_TARIMA',
      venueName: 'Hotel Santo Mauro',
      city: 'Madrid Capital',
      distanceFromMentridaKm: 52,
      eta: 'En Tarima (Finaliza 21:15)',
      soundSystem: 'Bose F1 Model 812 Array',
      totalBudgetEuro: 603.00,
      musiciansPayoutEuro: 482.40, // 80%
      contactPhone: '+34 611 223 344'
    },
    {
      id: 'FL-003',
      name: 'Cuadrilla 3 — Quinteto Imperial',
      leader: 'Carlos Mendoza / Trompeta',
      format: 'Quinteto',
      status: 'DISPONIBLE',
      venueName: 'Base de Operaciones',
      city: 'Méntrida (Toledo)',
      distanceFromMentridaKm: 0,
      eta: 'Listo para despacho inmediato',
      soundSystem: 'Bose F1 812 + Subwoofer Array',
      totalBudgetEuro: 900.00,
      musiciansPayoutEuro: 720.00, // 80%
      contactPhone: '+34 622 334 455'
    },
    {
      id: 'FL-004',
      name: 'Cuadrilla 4 — Ensamble VIMUME',
      leader: 'Dúo Terapéutico VIMUME',
      format: 'Dúo',
      status: 'COMPLETADO',
      venueName: 'Residencia Los Nogales',
      city: 'Madrid (Distrito Centro)',
      distanceFromMentridaKm: 48,
      eta: 'Bolo Finalizado con Éxito (<75 dB)',
      soundSystem: 'Bose S1 Pro Compact (Atenuado)',
      totalBudgetEuro: 480.00,
      musiciansPayoutEuro: 384.00, // 80%
      contactPhone: '+34 633 445 566'
    }
  ]);

  // Métricas Consolidadas de la Flota
  const totalActiveGigs = cuadrillas.filter(c => c.status === 'EN_RUTA' || c.status === 'EN_TARIMA').length;
  const totalFleetRevenue = cuadrillas.reduce((acc, c) => acc + c.totalBudgetEuro, 0);
  const totalMusiciansPayout = cuadrillas.reduce((acc, c) => acc + c.musiciansPayoutEuro, 0); // 80%
  const totalEarInfrastructure = totalFleetRevenue * 0.10;
  const totalVimumeFund = totalFleetRevenue * 0.10;

  const filteredCuadrillas = cuadrillas.filter(c => {
    if (filterStatus === 'ALL') return true;
    return c.status === filterStatus;
  });

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-28 pb-32 px-4 md:px-8 font-sans selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Central de Despacho */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0d0d14] via-[#161624] to-[#0d0d14] border border-[#ecb613]/30 p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> Mariachi Uber Fleet Command
                </span>
                <span className="px-3 py-1 bg-blue-950/80 text-blue-300 border border-blue-500/30 rounded-full text-xs font-mono">
                  Hub: Méntrida (Toledo) · 586 Hubs Activos
                </span>
                <span className="px-3 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-mono">
                  Split: 80% Artista / 10% EAR / 10% VIMUME
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-serif">
                Centralita de Despacho & Control de Flota 24/7
              </h1>
              <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-3xl leading-relaxed">
                Asignación de cuadrillas en tiempo real, cálculo de kilometraje logístico (1,50 €/km a partir del km 50) y verificación de riders acústicos homologados.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/checkout/presupuesto"
                className="py-3 px-5 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Nuevo Despacho S-Class
              </Link>
            </div>
          </div>
        </div>

        {/* Tarjetas de Métricas de Operaciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#09090d] border border-white/10 space-y-1">
            <span className="text-[11px] font-mono text-gray-400 uppercase">Cuadrillas en Acción</span>
            <div className="text-3xl font-black text-white font-mono">{totalActiveGigs} / {cuadrillas.length}</div>
            <span className="text-[10px] text-emerald-400 font-mono">100% puntualidad en carretera</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#09090d] border border-white/10 space-y-1">
            <span className="text-[11px] font-mono text-gray-400 uppercase">Facturación Flota Hoy</span>
            <div className="text-3xl font-black text-[#ecb613] font-mono">{totalFleetRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</div>
            <span className="text-[10px] text-gray-400 font-mono">4 eventos ejecutados</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#09090d] border border-white/10 space-y-1">
            <span className="text-[11px] font-mono text-gray-400 uppercase">Split Músicos (80% Neto)</span>
            <div className="text-3xl font-black text-emerald-400 font-mono">{totalMusiciansPayout.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</div>
            <span className="text-[10px] text-emerald-300 font-mono">Liquidación garantizada</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#09090d] border border-white/10 space-y-1">
            <span className="text-[11px] font-mono text-gray-400 uppercase">Fondo EAR (10%) + VIMUME (10%)</span>
            <div className="text-3xl font-black text-[#258DCD] font-mono">{(totalEarInfrastructure + totalVimumeFund).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</div>
            <span className="text-[10px] text-blue-300 font-mono">Infraestructura & I+D</span>
          </div>
        </div>

        {/* Pestañas de Vista: Cuadrillas vs Sonometría en Vivo */}
        <div className="flex border-b border-white/10 gap-4">
          <button
            onClick={() => setActiveTab('FLEET')}
            className={`pb-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === 'FLEET'
                ? 'text-[#ecb613] border-[#ecb613]'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            ● Cuadrillas & Despacho ({cuadrillas.length})
          </button>
          <button
            onClick={() => setActiveTab('SONOMETRY')}
            className={`pb-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === 'SONOMETRY'
                ? 'text-emerald-400 border-emerald-400'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            🔊 Telemetría Acústica & Sonometría Guard
          </button>
        </div>

        {/* CONTENIDO 1: MATRIZ DE CUADRILLAS */}
        {activeTab === 'FLEET' ? (
          <div className="space-y-4">
            {/* Filtros Rápidos */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {['ALL', 'EN_RUTA', 'EN_TARIMA', 'DISPONIBLE', 'COMPLETADO'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      filterStatus === status
                        ? 'bg-white/20 text-white font-bold border border-white/30'
                        : 'bg-white/5 text-gray-400 hover:text-white border border-transparent'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono text-gray-500">
                Mostrando {filteredCuadrillas.length} cuadrillas
              </span>
            </div>

            {/* Listado de Cuadrillas Figma S-Class */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCuadrillas.map((c) => {
                const isEnRuta = c.status === 'EN_RUTA';
                const isEnTarima = c.status === 'EN_TARIMA';
                const isDisponible = c.status === 'DISPONIBLE';

                return (
                  <div
                    key={c.id}
                    className="p-6 rounded-2xl bg-[#09090d] border border-white/10 hover:border-[#ecb613]/40 transition-all space-y-4 relative overflow-hidden"
                  >
                    {/* Status Badge */}
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">{c.id}</span>
                        <h4 className="text-base font-bold text-white font-serif">{c.name}</h4>
                        <span className="text-xs text-gray-400">Director: <strong className="text-[#ecb613]">{c.leader}</strong> ({c.format})</span>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                        isEnTarima 
                          ? 'bg-purple-950 text-purple-300 border-purple-500/50 animate-pulse'
                          : isEnRuta
                          ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                          : isDisponible
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                          : 'bg-gray-900 text-gray-400 border-gray-700'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    {/* Datos de Ruta y Recinto */}
                    <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#258DCD]" /> Recinto:
                        </span>
                        <span className="font-semibold text-white">{c.venueName} · {c.city}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5 text-amber-400" /> Distancia Hub:
                        </span>
                        <span className="font-mono text-gray-300">{c.distanceFromMentridaKm} km ({c.eta})</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-purple-400" /> Rider Acústico:
                        </span>
                        <span className="font-mono text-purple-300 text-[11px]">{c.soundSystem}</span>
                      </div>
                    </div>

                    {/* Desglose Económico Soberano (80% / 10% / 10%) */}
                    <div className="flex justify-between items-center pt-2 border-t border-white/10 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-mono">BOLO TOTAL (IVA incl.)</span>
                        <span className="text-base font-bold font-mono text-white">{c.totalBudgetEuro.toFixed(2)} €</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 block font-mono">SPLIT MÚSICOS (80%)</span>
                        <span className="text-base font-bold font-mono text-emerald-400">{c.musiciansPayoutEuro.toFixed(2)} €</span>
                      </div>
                    </div>

                    {/* Acciones de Despacho Inmediato */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`https://wa.me/${c.contactPhone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(c.leader)},%20te%20enviamos%20la%20hoja%20de%20ruta%20para%20${encodeURIComponent(c.venueName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
                      >
                        <Phone className="w-3.5 h-3.5" /> WhatsApp Cuadrilla
                      </a>

                      <button
                        onClick={() => alert(`Hoja de ruta digital re-emitida y certificada para ${c.name}`)}
                        className="py-2 px-3 rounded-xl bg-[#14141e] hover:bg-[#1e1e2c] border border-white/10 text-gray-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-[#ecb613]" /> Hoja de Ruta
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* CONTENIDO 2: SONOMETRÍA Y TELEMETRÍA EN VIVO */
          <div className="space-y-6">
            <LiveSonometryGuard />
          </div>
        )}
      </div>
    </main>
  );
}
