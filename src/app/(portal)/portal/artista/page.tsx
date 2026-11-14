'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Radio,
  Calendar,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sliders,
  FileText,
  Music2,
  Users2,
  Lock,
  PhoneCall
} from 'lucide-react';
import ArtistPlatformCockpit from '@/components/artists/ArtistPlatformCockpit';
import ArtistNotificationPreferences from '@/components/artists/ArtistNotificationPreferences';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
  SPLIT_SOBERANO
} from '@/lib/constants/ear-os-ssot';

export default function ArtistPortalHubPage() {
  const [activeTab, setActiveTab] = useState<'cockpit' | 'agenda' | 'liquidaciones' | 'preferencias'>('cockpit');

  const whatsappHref = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Hola Centralita EAR OS, solicito soporte técnico sobre mi perfil de artista y agenda.'
  )}`;

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#030305] text-white pt-24 pb-40 px-4 md:px-8 selection:bg-[#ecb613] selection:text-black font-sans">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* CABECERA INDUSTRIAL DEL ARTISTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#09090d]/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.25em] font-bold">
              <Sparkles size={12} />
              S-CLASS ARTIST CAREER OS · CENTRO DE MANDO
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-syne">
              Portal del <span className="text-[#ecb613] italic">Artista Soberano</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Gestión multicanal de streaming, agenda iCal anti-overbooking, liquidaciones automáticas 100% pre-evento y agente autónomo de atención.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-xs font-mono uppercase tracking-wider transition-all"
            >
              <PhoneCall size={14} className="text-[#ecb613]" />
              <span>Gabinete Centralita</span>
            </a>
            <Link
              href="/artistas/edwin-agudelo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4a855] text-black font-bold text-xs font-mono uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_20px_rgba(236,182,19,0.25)]"
            >
              <span>Ver Ficha Pública</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>

        {/* NAVEGACIÓN POR PESTAÑAS DEL CENTRO DE MANDO */}
        <div className="p-1.5 bg-[#0b0c13] border border-white/10 rounded-2xl max-w-2xl shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              onClick={() => setActiveTab('cockpit')}
              className={`px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'cockpit'
                  ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Radio size={14} />
              <span>Plataformas</span>
            </button>

            <button
              onClick={() => setActiveTab('agenda')}
              className={`px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'agenda'
                  ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar size={14} />
              <span>Agenda iCal</span>
            </button>

            <button
              onClick={() => setActiveTab('liquidaciones')}
              className={`px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'liquidaciones'
                  ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <DollarSign size={14} />
              <span>Finanzas</span>
            </button>

            <button
              onClick={() => setActiveTab('preferencias')}
              className={`px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'preferencias'
                  ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders size={14} />
              <span>Avisos</span>
            </button>
          </div>
        </div>

        {/* CONTENIDO DE PESTAÑAS */}
        {activeTab === 'cockpit' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <ArtistPlatformCockpit />
              <ArtistNotificationPreferences />
            </div>
          </div>
        )}

        {activeTab === 'agenda' && (
          <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[#ecb613] tracking-widest font-bold">
                SINCRONIZACIÓN SOBERANA DE CALENDARIO
              </span>
              <h2 className="text-2xl font-bold font-syne text-white uppercase">
                Feed iCal & Bloqueo Atómico Anti-Overbooking
              </h2>
              <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                Conecta tu Google Calendar, Apple Calendar u Outlook para bloquear fechas automáticamente. Las reservas en la web ejecutan bloqueo serializable en base de datos con depósito de 100,00 € en Stripe.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <div className="text-white font-bold uppercase flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#ecb613]" /> Bloqueo Atómico
                </div>
                <p className="text-zinc-400">Aislamiento transaccional estricto: cero colisiones de fecha entre eventos privados y públicos.</p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <div className="text-white font-bold uppercase flex items-center gap-2">
                  <Lock size={16} className="text-[#ecb613]" /> Price-Lock 100 €
                </div>
                <p className="text-zinc-400">Fianza deducible del importe total garantizando el compromiso mutuo del contratante.</p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <div className="text-white font-bold uppercase flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#ecb613]" /> Liquidación Previa
                </div>
                <p className="text-zinc-400">100% de los honorarios abonados o custodiados antes de pisar el escenario.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'liquidaciones' && (
          <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[#ecb613] tracking-widest font-bold">
                CONTRATOS FINANCIEROS Y SPLIT SOBERANO
              </span>
              <h2 className="text-2xl font-bold font-syne text-white uppercase">
                Estructura de Retribución y Cero Comisiones en Plan Pro
              </h2>
              <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                Transparencia total de cobros conforme a los contratos vigentes de EAR OS.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="text-white font-bold font-mono uppercase text-sm flex items-center justify-between">
                  <span>Directorio Gratuito</span>
                  <span className="text-zinc-400 text-xs">Split 80/10/10</span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Para artistas sin membresía de pago, la plataforma aplica el reparto canónico:
                  80% para el artista, 10% para soporte y servidores EAR OS, y 10% para el fondo social VIMUME de musicoterapia en residencias.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 space-y-3">
                <div className="text-white font-bold font-mono uppercase text-sm flex items-center justify-between">
                  <span className="text-[#ecb613]">Membresía Pro / Club Fundadores</span>
                  <span className="text-emerald-400 text-xs">0% Comisión EAR OS</span>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  Para artistas suscritos a cuota anual o Club Fundadores, la plataforma elimina el 100% de la comisión de mediación en contrataciones directas. El artista retiene el 100% íntegro de su caché.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferencias' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ArtistNotificationPreferences />
          </div>
        )}

      </div>
    </main>
  );
}

