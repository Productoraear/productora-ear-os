"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Sparkles, Crown, TrendingUp, MessageCircle, 
  Calendar, DollarSign, Eye, CheckCircle2, XCircle, Settings, 
  ExternalLink, Lock, ArrowUpRight, Sliders, Volume2, MapPin, 
  Phone, RefreshCw, Radio, Bell, FileText, Check, AlertCircle,
  Users, Activity, Flame, ArrowRight, Music, Zap, Award, Target,
  Filter, ShieldAlert, CheckCircle, Percent
} from 'lucide-react';
import Link from 'next/link';
import { CENTRALITA } from '@/lib/phone-constants';
import gscPerformanceData from '@/data/telemetry/gsc-performance-data.json';

interface Reservation {
  id: string;
  client: string;
  roleEvent: string;
  location: string;
  date: string;
  format: string;
  amount: string;
  depositStatus: 'PAID_STRIPE' | 'PRICE_LOCK_ACTIVE' | 'PENDING';
  depositAmount: string;
  status: 'PENDING_REVIEW' | 'ACCEPTED' | 'REJECTED';
  implementerType: 'HIGH_TICKET_IMPLEMENTER' | 'STANDARD_INQUIRY';
}

interface B2GTender {
  id: string;
  organization: string;
  title: string;
  budget: string;
  deadline: string;
  location: string;
  matchScore: number;
  status: 'ANALYZED' | 'APPLIED' | 'READY_BID';
}

export default function PacienteCeroDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState<'METRICAS' | 'POWER_NUMBERS' | 'RESERVAS' | 'RADAR_B2G' | 'CALENDARIO'>('METRICAS');
  
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 'RES-9901',
      client: 'Familia Morales (Boda Carmen)',
      roleEvent: 'Regalo de Boda & Serenata',
      location: 'Finca La Gaivota, Madrid',
      date: '19 Septiembre 2026',
      format: 'Ensamble de Gala (6 Músicos)',
      amount: '750 €',
      depositStatus: 'PAID_STRIPE',
      depositAmount: '100.00 €',
      status: 'PENDING_REVIEW',
      implementerType: 'HIGH_TICKET_IMPLEMENTER'
    },
    {
      id: 'RES-9902',
      client: 'Carlos Valenzuela',
      roleEvent: 'Cumpleaños Madre (60 Años)',
      location: 'Finca Los Aljibes, Albacete',
      date: '04 Julio 2026',
      format: 'Edwin Agudelo Solista Premium',
      amount: '350 €',
      depositStatus: 'PAID_STRIPE',
      depositAmount: '100.00 €',
      status: 'PENDING_REVIEW',
      implementerType: 'HIGH_TICKET_IMPLEMENTER'
    },
    {
      id: 'RES-9903',
      client: 'Marta & Javier (Aniversario Plata)',
      roleEvent: 'Bodas de Plata (25 Años)',
      location: 'Cigarral del Ángel, Toledo',
      date: '12 Agosto 2026',
      format: 'Grupo de Gala Imperial (9 Músicos)',
      amount: '1.250 €',
      depositStatus: 'PRICE_LOCK_ACTIVE',
      depositAmount: '0.50 €',
      status: 'ACCEPTED',
      implementerType: 'HIGH_TICKET_IMPLEMENTER'
    },
    {
      id: 'RES-9904',
      client: 'Asociación Empresarial Levante',
      roleEvent: 'Jubilación Director General',
      location: 'Huerto de Santa María, Valencia',
      date: '28 Octubre 2026',
      format: 'Banda Monumental (13 Músicos)',
      amount: '1.800 €',
      depositStatus: 'PAID_STRIPE',
      depositAmount: '100.00 €',
      status: 'ACCEPTED',
      implementerType: 'HIGH_TICKET_IMPLEMENTER'
    },
    {
      id: 'RES-9905',
      client: 'Consulta Web General',
      roleEvent: 'Cumpleaños Particular',
      location: 'Madrid',
      date: '15 Mayo 2026',
      format: 'Trío Básico',
      amount: '550 €',
      depositStatus: 'PENDING',
      depositAmount: '0.00 €',
      status: 'PENDING_REVIEW',
      implementerType: 'STANDARD_INQUIRY'
    }
  ]);

  const [tenders, setTenders] = useState<B2GTender[]>([
    {
      id: 'LCSP-2026-TO-04',
      organization: 'Ayuntamiento de Toledo (Festejos)',
      title: 'Contrato Menor: Actuación Mariachi de Gala Fiestas de Agosto',
      budget: '14.500 €',
      deadline: 'En 6 días',
      location: 'Toledo',
      matchScore: 98,
      status: 'READY_BID'
    },
    {
      id: 'LCSP-2026-AB-12',
      organization: 'Diputación de Albacete',
      title: 'Programación Cultural Circuitos de Verano: Música Tradicional',
      budget: '13.800 €',
      deadline: 'En 9 días',
      location: 'Albacete',
      matchScore: 94,
      status: 'READY_BID'
    },
    {
      id: 'LCSP-2026-GU-08',
      organization: 'Ayuntamiento de Guadalajara',
      title: 'Noche en Blanco Cultural: Concierto Lírico de Gala',
      budget: '11.200 €',
      deadline: 'En 12 días',
      location: 'Guadalajara',
      matchScore: 92,
      status: 'ANALYZED'
    }
  ]);

  const handleAcceptReservation = (id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'ACCEPTED' } : r));
  };

  const handleRejectReservation = (id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#09090d] border border-[#ecb613]/30 space-y-6 text-center shadow-[0_0_50px_rgba(236,182,19,0.1)]">
          <div className="w-16 h-16 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613] mx-auto">
            <Crown size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase text-white font-syne">Centro de Mando Paciente Cero</h2>
            <p className="text-xs text-white/50">Acceso exclusivo para Edwin Agudelo (CEO & Master Artist)</p>
          </div>
          <button
            onClick={() => setIsAuthenticated(true)}
            className="w-full py-4 rounded-xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider hover:scale-105 transition-transform"
          >
            Iniciar Sesión Soberana
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613]/30 font-sans pb-24">
      
      {/* 1. BARRA SUPERIOR DE MANDO SOBERANO */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-2xl border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <Crown size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black uppercase tracking-tight text-white font-syne">
                  Edwin Agudelo
                </span>
                <span className="text-[8px] font-mono font-black uppercase tracking-widest text-[#ecb613] bg-[#ecb613]/10 border border-[#ecb613]/20 px-2 py-0.5 rounded-md">
                  Paciente Cero #001
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/40 block">
                {CENTRALITA.display} • hola@productoraear.com
              </span>
            </div>
          </div>

          {/* Selector de Vistas / Pestañas */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1">
            <button
              onClick={() => setActiveTab('METRICAS')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                activeTab === 'METRICAS' ? 'bg-[#ecb613] text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              Telemetría
            </button>
            <button
              onClick={() => setActiveTab('POWER_NUMBERS')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                activeTab === 'POWER_NUMBERS' ? 'bg-[#ecb613] text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              Power Numbers™
            </button>
            <button
              onClick={() => setActiveTab('RESERVAS')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all relative ${
                activeTab === 'RESERVAS' ? 'bg-[#ecb613] text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              <span>Reservas</span>
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[8px] font-mono">
                {reservations.filter(r => r.status === 'PENDING_REVIEW').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('RADAR_B2G')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                activeTab === 'RADAR_B2G' ? 'bg-[#ecb613] text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              Radar B2G
            </button>
            <button
              onClick={() => setActiveTab('CALENDARIO')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                activeTab === 'CALENDARIO' ? 'bg-[#ecb613] text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              Price-Locking
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-[10px] font-mono text-white/40 hover:text-rose-400 transition-colors uppercase"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* 2. CUERPO PRINCIPAL DEL CENTRO DE MANDO */}
      <main className="max-w-7xl mx-auto px-6 pt-10 space-y-12">
        
        {/* KPI CARDS EN TIEMPO REAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* KPI 1: TELEMETRÍA LLAMADAS & WHATSAPP */}
          <div className="p-6 rounded-[2rem] bg-[#09090d] border border-white/10 space-y-4 relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <MessageCircle size={24} />
              </div>
              <span className="text-[9px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                En Directo
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-white/40 block">
                Inbound WhatsApp & Llamadas
              </span>
              <div className="text-3xl font-black text-white font-mono">
                142 <span className="text-sm font-normal text-emerald-400">+28%</span>
              </div>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed">
              98.6% de llamadas atendidas en &lt;15s canalizadas a través de la centralita oficial.
            </p>
          </div>

          {/* KPI 2: IMPRESIONES RELACIONALES */}
          <div className="p-6 rounded-[2rem] bg-[#09090d] border border-white/10 space-y-4 relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
                <Eye size={24} />
              </div>
              <span className="text-[9px] font-mono uppercase text-[#ecb613] bg-[#ecb613]/10 px-2 py-0.5 rounded-full">
                52 Provincias
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-white/40 block">
                Impresiones Matriz Relacional
              </span>
              <div className="text-3xl font-black text-white font-mono">
                48.920 <span className="text-sm font-normal text-[#ecb613]">+42%</span>
              </div>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed">
              100+ landings relacionales capturando intenciones de "cumpleaños madre", "aniversario suegro".
            </p>
          </div>

          {/* KPI 3: RADAR B2G */}
          <div className="p-6 rounded-[2rem] bg-[#09090d] border border-white/10 space-y-4 relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Radio size={24} />
              </div>
              <span className="text-[9px] font-mono uppercase text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                PLACSP 24h
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-white/40 block">
                Licitaciones B2G en Radar
              </span>
              <div className="text-3xl font-black text-white font-mono">
                39.500 € <span className="text-xs text-blue-400 font-normal">3 Activas</span>
              </div>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed">
              Expedientes de contratos menores &lt;15k€ listos para emisión de memoria técnica Art. 118 LCSP.
            </p>
          </div>

          {/* KPI 4: VOLUMEN STRIPE CONGELADO */}
          <div className="p-6 rounded-[2rem] bg-[#09090d] border border-white/10 space-y-4 relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <DollarSign size={24} />
              </div>
              <span className="text-[9px] font-mono uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                Stripe Live
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-white/40 block">
                Depósitos en Custodia
              </span>
              <div className="text-3xl font-black text-white font-mono">
                4.150 € <span className="text-sm font-normal text-purple-400">Garantizados</span>
              </div>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed">
              Depósitos de 100€ y señales de Price-Locking con custodia criptográfica en Stripe.
            </p>
          </div>

        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* PESTAÑA 1: TELEMETRÍA & TRÁFICO */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'METRICAS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* TOP LANDINGS & CONSULTAS GSC CAPTURADAS */}
            <div className="lg:col-span-8 p-8 rounded-[2.5rem] bg-[#09090d] border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold uppercase text-[#ecb613] block">
                      Google Search Console Telemetry (SSOT)
                    </span>
                    <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      Auto-Ingested
                    </span>
                  </div>
                  <h3 className="text-xl font-black uppercase text-white font-syne">
                    Consultas y Oportunidades Orgánicas Reales
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-white/40">Dataset:</span>
                  <span className="text-white/80 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                    {gscPerformanceData.totals.totalImpressions.toLocaleString()} Impresiones • {gscPerformanceData.totals.totalUniqueQueries} Consultas
                  </span>
                </div>
              </div>

              {/* LISTADO DE CONSULTAS CON DATOS REALES DE GSC */}
              <div className="space-y-3">
                {gscPerformanceData.topOpportunityQueries.slice(0, 6).map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#ecb613]/30 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#ecb613] font-bold">#{idx + 1}</span>
                        <span className="text-xs font-black uppercase text-white">{item.query}</span>
                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          Pos. Media: {item.position}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-white/40 block">
                        Score de Oportunidad de Tráfico: <strong className="text-emerald-400">{item.opportunityScore} pts</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-xs font-mono">
                      <div>
                        <span className="text-[9px] text-white/40 block">Clics</span>
                        <span className="font-bold text-white">{item.clicks}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-white/40 block">Impresiones</span>
                        <span className="font-bold text-[#ecb613]">{item.impressions}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-white/40 block">CTR</span>
                        <span className="font-bold text-white/70">{item.ctr}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
                <span>Rango de Datos: {gscPerformanceData.meta.dateRange}</span>
                <span className="text-[10px] text-white/30">Para actualizar: <code className="text-[#ecb613]">npm run gsc:ingest</code></span>
              </div>
            </div>

            {/* ESTADO OPERATIVO & SPLIT SOBERANO */}
            <div className="lg:col-span-4 p-8 rounded-[2.5rem] bg-[#09090d] border border-white/10 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
                  <Activity size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black uppercase text-white font-syne">
                    Split Soberano 80/10/10
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Liquidación atómica en servidor protegida por ledger contable inmutable.
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center text-xs">
                    <span className="text-white/60">Honorarios Artista (Edwin)</span>
                    <span className="font-mono font-bold text-emerald-400">80% (Directo)</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center text-xs">
                    <span className="text-white/60">Infraestructura EAR OS</span>
                    <span className="font-mono font-bold text-[#ecb613]">10% (SLA 99.9%)</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center text-xs">
                    <span className="text-white/60">Mecenazgo Social VIMUME</span>
                    <span className="font-mono font-bold text-purple-400">10% (Tercera Edad)</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <a
                  href="https://dashboard.stripe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-xs uppercase flex items-center justify-center gap-2 transition-all"
                >
                  <span>Abrir Stripe Express Portal</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* PESTAÑA 2: POWER NUMBERS™ & FILTRO DE IMPLEMENTADOR (INCUBADORA) */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'POWER_NUMBERS' && (
          <div className="space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-[#09090d] border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold uppercase text-[#ecb613] block">
                    Gobernanza Financiera & Umbrales de Liberación
                  </span>
                  <h3 className="text-2xl font-black uppercase text-white font-syne">
                    Power Numbers™ Progress (Incubadora Despegue)
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
                  Estado: EN CRECIMIENTO ACELERADO
                </span>
              </div>

              {/* MEDIDORES VISUALES DE LOS 2 POWER NUMBERS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* POWER NUMBER 1: SAAS B2B (4.900 € MRR) */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase text-[#ecb613] font-bold block">
                        Power Number 1 (SaaS B2B Fincas)
                      </span>
                      <h4 className="text-lg font-black uppercase text-white font-syne">
                        100 Fincas x 49 €/mes = 4.900 € MRR
                      </h4>
                    </div>
                    <span className="text-lg font-black font-mono text-[#ecb613]">68%</span>
                  </div>

                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-[#ecb613] h-full rounded-full transition-all duration-1000" style={{ width: '68%' }} />
                  </div>

                  <div className="flex justify-between text-xs font-mono text-white/60 pt-1">
                    <span>68 Fincas Activas (3.332 € MRR)</span>
                    <span className="text-[#ecb613] font-bold">Meta: 4.900 € MRR</span>
                  </div>
                  
                  <p className="text-[11px] text-white/50 leading-relaxed pt-2 border-t border-white/5">
                    Cubre el 100% de la infraestructura cloud, base de datos vectorial, Vercel, Supabase y el SDR dedicado.
                  </p>
                </div>

                {/* POWER NUMBER 2: B2G MENOR (14.850 € / ADJUDICACIÓN) */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase text-blue-400 font-bold block">
                        Power Number 2 (Contratos Menores B2G)
                      </span>
                      <h4 className="text-lg font-black uppercase text-white font-syne">
                        Adjudicación Art. 118 LCSP = 14.850 €
                      </h4>
                    </div>
                    <span className="text-lg font-black font-mono text-blue-400">97.6%</span>
                  </div>

                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: '97.6%' }} />
                  </div>

                  <div className="flex justify-between text-xs font-mono text-white/60 pt-1">
                    <span>Expediente Toledo Festejos: 14.500 €</span>
                    <span className="text-blue-400 font-bold">Techo Menor: 14.999 €</span>
                  </div>

                  <p className="text-[11px] text-white/50 leading-relaxed pt-2 border-t border-white/5">
                    Financia la adquisición y amortización completa de sistemas Bose F1 y rider de sonido propio sin recurrir a deuda externa.
                  </p>
                </div>

              </div>
            </div>

            {/* SECCIÓN DEL FILTRO DE IMPLEMENTADOR */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-3xl bg-[#09090d] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle size={20} />
                </div>
                <h4 className="text-sm font-black uppercase text-white font-syne">Filtro de Implementador</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Identifica leads VIP que buscan excelencia, póliza de 1M€ y Mariachi de Gala. Respuesta prioritaria &lt; 15 min.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#09090d] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
                  <ShieldAlert size={20} />
                </div>
                <h4 className="text-sm font-black uppercase text-white font-syne">Filtro de Energía</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Buscadores de descuentos y regateo son redirigidos al cotizador autodidacta para no consumir tiempo del Paciente Cero.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#09090d] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Award size={20} />
                </div>
                <h4 className="text-sm font-black uppercase text-white font-syne">Estándar de Suficiencia</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  No damos precios planos. Desplegamos la Bóveda del Artista, audio en vivo, diagnóstico de riesgo y depósito Stripe 1-clic.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* PESTAÑA 3: BANDEJA DE ENTRADA DE RESERVAS CON FILTRO */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'RESERVAS' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase text-white font-syne">
                  Bandeja de Entrada de Reservas con Cualificación
                </h3>
                <p className="text-xs text-white/50 font-mono">
                  Expedientes clasificados por el Filtro de Implementador y procesados con depósito Stripe.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="p-6 rounded-3xl bg-[#09090d] border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:border-[#ecb613]/30 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#ecb613]">{res.id}</span>
                      <span className="text-base font-black text-white uppercase">{res.client}</span>
                      
                      {/* Badge de Implementador */}
                      {res.implementerType === 'HIGH_TICKET_IMPLEMENTER' ? (
                        <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Crown size={10} /> IMPLEMENTADOR VIP
                        </span>
                      ) : (
                        <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">
                          CONSULTA ESTÁNDAR
                        </span>
                      )}

                      <span className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full ${
                        res.status === 'ACCEPTED' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                          : res.status === 'REJECTED'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                      }`}>
                        {res.status === 'ACCEPTED' ? '✓ CONFIRMADA' : res.status === 'REJECTED' ? '✕ RECHAZADA' : '⏳ PENDIENTE DECISIÓN'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 font-mono">
                      <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#ecb613]" /> {res.date}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={13} className="text-[#ecb613]" /> {res.location}</span>
                      <span className="flex items-center gap-1.5"><Music size={13} className="text-[#ecb613]" /> {res.format}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto justify-between border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] font-mono text-white/40 block">Tarifa Total / Depósito</span>
                      <span className="text-lg font-black text-white font-mono">{res.amount}</span>
                      <span className="text-[10px] text-emerald-400 font-mono block">Depósito: {res.depositAmount}</span>
                    </div>

                    {res.status === 'PENDING_REVIEW' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAcceptReservation(res.id)}
                          className="px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-black text-xs uppercase tracking-wider hover:scale-105 transition-transform flex items-center gap-1.5"
                        >
                          <Check size={14} />
                          <span>Aceptar</span>
                        </button>
                        <button
                          onClick={() => handleRejectReservation(res.id)}
                          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/20 hover:text-rose-400 text-white/60 font-black text-xs uppercase tracking-wider transition-all"
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* PESTAÑA 4: RADAR B2G */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'RADAR_B2G' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase text-white font-syne">
                  Radar B2G & Licitaciones Públicas (PLACSP)
                </h3>
                <p className="text-xs text-white/50 font-mono">
                  Contratos menores (&lt;15.000 €) detectados para ayuntamientos y comisiones de festejos.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {tenders.map((tender) => (
                <div
                  key={tender.id}
                  className="p-6 rounded-3xl bg-[#09090d] border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:border-blue-500/40 transition-all"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-blue-400">{tender.id}</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        Match Score: {tender.matchScore}%
                      </span>
                    </div>

                    <h4 className="text-base font-black text-white uppercase">{tender.title}</h4>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 font-mono">
                      <span>Organismo: {tender.organization}</span>
                      <span>Plazo: {tender.deadline}</span>
                      <span>Ubicación: {tender.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto justify-between border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] font-mono text-white/40 block">Presupuesto Base</span>
                      <span className="text-xl font-black text-white font-mono">{tender.budget}</span>
                    </div>

                    <button
                      onClick={() => alert(`Generando Memoria Técnica Art. 118 LCSP para ${tender.id}...`)}
                      className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105"
                    >
                      <FileText size={14} />
                      <span>Generar Memoria Art. 118</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* PESTAÑA 5: CALENDARIO & FECHAS CONGELADAS */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'CALENDARIO' && (
          <div className="p-8 rounded-[2.5rem] bg-[#09090d] border border-white/10 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase text-[#ecb613] block">
                  Gestión de Disponibilidad Inmutable
                </span>
                <h3 className="text-xl font-black uppercase text-white font-syne">
                  Calendario & Fechas Congeladas (Price-Locking)
                </h3>
              </div>
              <button 
                onClick={() => alert("Función de bloqueo manual activada. Selecciona la fecha en el calendario.")}
                className="px-4 py-2 rounded-xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider"
              >
                + Congelar Nueva Fecha
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              {[
                { month: 'Junio 2026', slots: '18 / 20 Ocupados', status: 'ALTA DEMANDA' },
                { month: 'Julio 2026', slots: '14 / 20 Ocupados', status: 'MEDIA DEMANDA' },
                { month: 'Agosto 2026', slots: '19 / 20 Ocupados', status: 'CASI AGOTADO' },
                { month: 'Septiembre 2026', slots: '16 / 20 Ocupados', status: 'ALTA DEMANDA' }
              ].map((m, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <span className="text-xs font-black uppercase text-white block">{m.month}</span>
                  <span className="text-lg font-black text-[#ecb613] font-mono block">{m.slots}</span>
                  <span className="text-[8px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
