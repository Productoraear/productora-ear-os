'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Building2,
  HeartHandshake,
  Music4,
  CalendarCheck2,
  ArrowUpRight,
  Shield,
  Activity,
  Bot,
  MapPin,
  ChevronRight,
  Disc,
  ArrowLeft,
  Volume2,
  Lock,
  Layers,
  FileText,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { VigilCinematicWebGLLogoPortal } from './VigilCinematicWebGLLogoPortal';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  SAFE_LCSP_CEILING_EUR,
  LIMITE_SPL_DB,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

interface SovereignNode {
  id: string;
  name: string;
  domain: string;
  badge: string;
  color: string;
  accentBg: string;
  borderColor: string;
  glowColor: string;
  route: string;
  assistantTitle: string;
  assistantGreeting: string;
  description: string;
  metrics: { label: string; value: string }[];
  subnodes: {
    id: string;
    title: string;
    desc: string;
    tag: string;
    route: string;
  }[];
}

const SOVEREIGN_NODES: SovereignNode[] = [
  {
    id: 'fincasparaboda',
    name: 'fincasparaboda.com',
    domain: 'fincasparaboda.com',
    badge: 'Caballo de Troya · Red Territorial',
    color: '#10b981', // Emerald
    accentBg: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    route: '/fincas',
    assistantTitle: 'Asistente de Fincas & Espacios',
    assistantGreeting: 'Hola, te ayudo a calcular el presupuesto exacto [Aforo x Menú + Alquiler + Depósito 100 €] con fincas verificadas 2FA.',
    description: 'Catálogo soberano de espacios en 52 provincias. Directo sin comisiones opacas de agencias ni secuestro de presupuestos.',
    metrics: [
      { label: 'Provincias', value: '52 Activas' },
      { label: 'Garantía Acústica', value: 'Ley 37/2003' },
      { label: 'Fianza Deducible', value: `${DEPOSITO_STRIPE_EUR} €` },
    ],
    subnodes: [
      {
        id: 'fincas-toledo-madrid',
        title: 'Fincas Madrid & Toledo Hub',
        desc: 'Espacios emblemáticos con calibración acústica a medida desde Hub Méntrida.',
        tag: 'Exclusivas',
        route: '/fincas',
      },
      {
        id: 'fincas-acustica-libre',
        title: 'Espacios Sin Censura Acústica',
        desc: 'Fincas con limitador telemático legal para fiesta sin cortes a las 2:00 AM.',
        tag: 'Sonido Legal',
        route: '/protocolo-acustico',
      },
      {
        id: 'fincas-b2b-alta',
        title: 'Portal B2B Propietarios',
        desc: 'Adhesión directa de recintos con 2FA y teléfono real auditado en sede.',
        tag: 'Partner B2B',
        route: '/fincas/portal-demostrativo',
      },
    ],
  },
  {
    id: 'vimume',
    name: 'viajemusicalporlamemoria.com',
    domain: 'viajemusicalporlamemoria.com (VIMUME)',
    badge: 'Buque Insignia Social · Mayores',
    color: '#8b5cf6', // Violet
    accentBg: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    glowColor: 'rgba(139, 92, 246, 0.25)',
    route: '/vimume',
    assistantTitle: 'Consultor Clínico VIMUME',
    assistantGreeting: 'Te oriento sobre estimulación acústica 40 Hz para residencias y cómo deducir hasta el 80% con la Ley 49/2002.',
    description: 'Protocolo neuroacústico a 40 Hz no invasivo para la memoria, centros de mayores y personas con deterioro cognitivo.',
    metrics: [
      { label: 'Retorno Social', value: '4.85x SROI' },
      { label: 'Frecuencia Gamma', value: '40 Hz Puro' },
      { label: 'Mecenazgo Fiscal', value: 'Hasta 80%' },
    ],
    subnodes: [
      {
        id: 'vimume-demostrador-40hz',
        title: 'Sincronización Gamma 40 Hz',
        desc: 'Gráfico clínico interactivo con selección de patología (Memoria, Enfoque, Relajación).',
        tag: 'Clínica',
        route: '/vimume',
      },
      {
        id: 'vimume-residencias',
        title: 'Dossier Clínico para Residencias',
        desc: 'Visor embebido interactivo para centros de día, residencias senior y AFAs.',
        tag: 'Centros Senior',
        route: '/vimume',
      },
      {
        id: 'vimume-mecenazgo',
        title: 'Mecenazgo Corporativo (Ley 49/2002)',
        desc: 'Empresas patrocinan sesiones con deducción del 80% en el Impuesto de Sociedades.',
        tag: 'Impacto Social',
        route: '/vimume',
      },
    ],
  },
  {
    id: 'artistas-europa',
    name: 'artistas-europa.com',
    domain: 'artistas-europa.com',
    badge: 'Directorio Global S-Class',
    color: '#ecb613', // Gold
    accentBg: 'rgba(236, 182, 19, 0.1)',
    borderColor: 'rgba(236, 182, 19, 0.3)',
    glowColor: 'rgba(236, 182, 19, 0.25)',
    route: '/artistas',
    assistantTitle: 'Agente de Contratación Directa',
    assistantGreeting: 'Reserva artistas sin inflar cachés. El 80% va directo al artista ejecutor con fianza de 100 € deducible.',
    description: 'Directorio global para contratación de solistas líricos, mariachis, tenores y agrupaciones de gala ordenados por cercanía geográfica.',
    metrics: [
      { label: 'Suelo Solista', value: `${TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €` },
      { label: 'Split Neto Artista', value: '80% Directo' },
      { label: 'Fianza Stripe', value: `${DEPOSITO_STRIPE_EUR.toFixed(2)} €` },
    ],
    subnodes: [
      {
        id: 'artistas-edwin-agudelo',
        title: 'Edwin Agudelo · Tenor Insignia',
        desc: 'Voz lírica y repertorio de gala. Tarifa base inviolable de 350,00 €.',
        tag: 'Paciente Cero',
        route: '/reservar/solista',
      },
      {
        id: 'artistas-mariachi',
        title: 'Mariachi Imperial de Gala',
        desc: 'Formaciones de 3 a 8 músicos con puntualidad garantizada por SLA.',
        tag: 'Folclore Gala',
        route: '/artistas',
      },
      {
        id: 'artistas-split-card',
        title: 'Split Soberano 80/10/10',
        desc: 'Tarjeta metálica oscura con desglose exacto de importes en céntimos enteros.',
        tag: 'Transparencia',
        route: '/artistas',
      },
    ],
  },
  {
    id: 'eventos-360',
    name: 'eventos-360.com',
    domain: 'Eventos Propios y de Terceros',
    badge: 'Producción & Experiencias 360',
    color: '#06b6d4', // Cyan
    accentBg: 'rgba(6, 182, 212, 0.1)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    route: '/eventos',
    assistantTitle: 'Director Técnico de Producción',
    assistantGreeting: 'Configura tu evento en 4 pasos con cálculo en tiempo real y cronograma técnico con hora de banquete editable.',
    description: 'Producción integral de eventos corporativos, team building, galas privadas, ferias, montajes de stands y experiencias olfativas.',
    metrics: [
      { label: 'Límite Acústico', value: `< ${LIMITE_SPL_DB} dB SPL` },
      { label: 'Potencia', value: '12 W/pax' },
      { label: 'B2G LCSP', value: `< ${SAFE_LCSP_CEILING_EUR.toLocaleString('es-ES')} €` },
    ],
    subnodes: [
      {
        id: 'eventos-configurador-4pasos',
        title: 'Configurador en 4 Pasos',
        desc: 'Espacio + Sonido + Artista + Iluminación con Dock VIP acumulado.',
        tag: 'Presupuestador',
        route: '/eventos',
      },
      {
        id: 'eventos-cronograma-editable',
        title: 'Cronograma Técnico Interactivo',
        desc: 'Ajusta tu hora de banquete (21:00) y recalcula montaje, soundcheck y show.',
        tag: 'Planificador',
        route: '/eventos',
      },
      {
        id: 'eventos-ferias',
        title: 'Ferias & Montajes de Muestra',
        desc: 'Micro-escenarios, iluminación arquitectónica y refuerzo sonoro.',
        tag: 'Exposiciones',
        route: '/eventos',
      },
    ],
  },
];

export function SovereignHomeHeroNodes() {
  const [activeNodeId, setActiveNodeId] = useState<string>(SOVEREIGN_NODES[0].id);
  const activeNode = SOVEREIGN_NODES.find((n) => n.id === activeNodeId) || SOVEREIGN_NODES[0];

  // Simulador de Fincas en Tiempo Real (Preguntas 41-42)
  const [aforo, setAforo] = useState<number>(120);
  const [incluyeAlquilerFinca, setIncluyeAlquilerFinca] = useState<boolean>(true);
  const precioMenuPax = 85.0;
  const alquilerFincaBase = 2500.0;
  const costeCatering = aforo * precioMenuPax;
  const costeFinca = incluyeAlquilerFinca ? alquilerFincaBase : 0;
  const totalEventoFinca = costeCatering + costeFinca + TARIFA_BASE_SOLISTA_EUR;
  const fianzaDeducible = DEPOSITO_STRIPE_EUR;
  const liquidacionFinca = totalEventoFinca - fianzaDeducible;

  // Selector de Patología VIMUME (Pregunta 43)
  const [patologiaVimume, setPatologiaVimume] = useState<'memoria' | 'enfoque' | 'relajacion'>('memoria');

  // Género Musical Artistas (Pregunta 35)
  const [generoMusical, setGeneroMusical] = useState<string>('lirico');

  // Cronograma Técnico Eventos (Pregunta 48)
  const [horaBanquete, setHoraBanquete] = useState<string>('21:00');

  const scrollToLogo = () => {
    const el = document.getElementById('sovereign-logo-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formattedPhone = CENTRALITA_EAR_OS.replace(/[^0-9]/g, '');

  return (
    <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-24 overflow-hidden">
      {/* 1. VIAJE DEL CLIENTE VIGIL: ATMÓSFERA CINEMÁTICA HORIZONX Y PUERTA SOBERANA */}
      <div id="sovereign-logo-anchor" className="relative flex flex-col items-center text-center mb-10 pt-4 min-h-[160px] justify-center">
        {/* Portal WebGL Cinemático reactivo al Viaje del Cliente (HorizonX Vigil Style) */}
        <VigilCinematicWebGLLogoPortal activeVertical={activeNode.id} verticalColor={activeNode.color} />

        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 backdrop-blur-md z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-300">
            Respuesta por WhatsApp &lt; 5 min · +34 693 693 048
          </span>
        </div>

        <h1 className="text-[22px] sm:text-4xl font-extrabold font-syne text-white tracking-tight max-w-3xl mb-3 leading-snug z-10">
          Música en Vivo, Sonido e Iluminación para{' '}
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            Bodas, Eventos y Fiestas
          </span>
        </h1>

        <p className="text-[14px] sm:text-base text-zinc-300 max-w-2xl mx-auto font-sans z-10 leading-relaxed mb-6">
          Artistas profesionales contrastados, sonido de alta fidelidad adaptado a tu espacio y reserva blindada de fecha con fianza de 100 € deducible.
        </p>

        {/* 3 LLAMADAS A LA ACCIÓN PRINCIPALES (EMBUDO DIRECTO EN MENOS DE 60s) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xl mx-auto z-10 mb-8">
          <a
            href={`https://wa.me/${formattedPhone}?text=${encodeURIComponent('Hola, deseo consultar disponibilidad y presupuesto para un evento. ¿Podéis orientarme?')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all cursor-pointer font-sans"
          >
            <span>💬 Consultar Disponibilidad por WhatsApp</span>
          </a>

          <Link
            href="/artistas"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-white/20 bg-zinc-900/80 hover:bg-zinc-800 text-white text-sm font-semibold transition-all cursor-pointer font-sans"
          >
            <span>Ver Artistas & Formatos</span>
          </Link>

          <Link
            href="/presupuesto"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-sm font-semibold transition-all cursor-pointer font-sans"
          >
            <span>Cotizador en 1 min</span>
          </Link>
        </div>
      </div>

      {/* 2. PUERTAS DE ENTRADA POR TIPO DE CLIENTE */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-8">
        {SOVEREIGN_NODES.map((node) => {
          const isSelected = node.id === activeNodeId;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setActiveNodeId(node.id)}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-300 relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-zinc-900/90 shadow-xl border-amber-400/60'
                  : 'bg-zinc-950/60 hover:bg-zinc-900/50 border-white/10'
              }`}
              style={{
                borderColor: isSelected ? node.color : 'rgba(255, 255, 255, 0.08)',
                boxShadow: isSelected ? `0 0 20px ${node.glowColor}` : 'none',
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-zinc-300">
                  {node.name}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: isSelected ? node.color : '#52525b' }}
                />
              </div>

              <div className="text-[12px] text-zinc-400 font-montserrat line-clamp-1">
                {node.badge.split('·')[1]?.trim() || node.badge}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. EXPERIENCIA BENTO DINÁMICA DEL NODO ACTIVO */}
      <div
        className="rounded-3xl border p-6 sm:p-8 bg-zinc-950/80 backdrop-blur-2xl transition-all duration-500 shadow-2xl relative overflow-hidden mb-12"
        style={{
          borderColor: activeNode.borderColor,
          boxShadow: `0 0 50px ${activeNode.glowColor}`,
        }}
      >
        {/* Subtle Ambient Radial Orb */}
        <div
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: activeNode.color }}
        />

        {/* Top Info Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: activeNode.accentBg,
                  color: activeNode.color,
                }}
              >
                {activeNode.badge}
              </span>

              {/* Insignia Dorada 2FA Verified (Pregunta 32) */}
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>2FA Verified · Teléfono en Sede</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {activeNode.name}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1 font-sans">
              {activeNode.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={activeNode.route}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs font-mono tracking-wider uppercase transition-all shadow-lg hover:scale-105 active:scale-95"
              style={{
                backgroundColor: activeNode.color,
                color: '#030305',
              }}
            >
              <span>Abrir Vertical Completa</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* CONTENIDO INTERACTIVO ESPECÍFICO SEGÚN EL NODO ACTIVO */}

        {/* A. CASO FINCAS: SIMULADOR DE AFORO, MENÚ & RECINTO (Preguntas 31, 41, 42) */}
        {activeNode.id === 'fincasparaboda' && (
          <div className="my-8 p-6 rounded-2xl bg-zinc-900/60 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Simulador de Presupuesto Exacto en Céntimos Enteros
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">Sin Comisiones de Agencia</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                {/* Slider Continuo de Aforo (Pregunta 41) */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-zinc-400">Aforo de Invitados:</span>
                    <span className="text-white font-bold">{aforo} pax</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="500"
                    step="5"
                    value={aforo}
                    onChange={(e) => setAforo(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                    <span>20 pax (Íntimo)</span>
                    <span>12 W/pax telemétrico</span>
                    <span>500 pax (Macro)</span>
                  </div>
                </div>

                {/* Interruptor de Alquiler de Finca (Pregunta 42) */}
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-zinc-200">Canon de Alquiler del Espacio</div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {incluyeAlquilerFinca ? `Incluye recinto homologado (${alquilerFincaBase.toFixed(2)} €)` : 'Solo producción musical y acústica'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncluyeAlquilerFinca(!incluyeAlquilerFinca)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                      incluyeAlquilerFinca ? 'bg-emerald-500' : 'bg-zinc-800'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        incluyeAlquilerFinca ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* HUD de Desglose de Dinero */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Catering ({aforo} pax x {precioMenuPax.toFixed(2)} €)</span>
                  <span className="text-zinc-200">{costeCatering.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Alquiler de Recinto</span>
                  <span className="text-zinc-200">{costeFinca.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Solista Premium (Edwin Agudelo)</span>
                  <span className="text-zinc-200">{TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-emerald-400 pt-2 border-t border-white/5 font-bold">
                  <span>Fianza Deducible Stripe (Price-Lock)</span>
                  <span>-{fianzaDeducible.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-white text-base pt-2 border-t border-white/10 font-bold">
                  <span>Liquidación Final Estimada:</span>
                  <span className="text-emerald-400">{liquidacionFinca.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* B. CASO VIMUME: GRÁFICO CLÍNICO GAMMA 40 HZ & SELECTOR DE PATOLOGÍA (Preguntas 33, 43, 44) */}
        {activeNode.id === 'vimume' && (
          <div className="my-8 p-6 rounded-2xl bg-zinc-900/60 border border-purple-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Sincronización Neuronal Gamma (40 Hz No Invasivo)
                </h3>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">
                  Protocolo neuroacústico de memoria validado para residencias y personas con deterioro cognitivo.
                </p>
              </div>

              {/* Selector de Patología (Pregunta 43) */}
              <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-xl border border-white/10">
                {(['memoria', 'enfoque', 'relajacion'] as const).map((pat) => (
                  <button
                    key={pat}
                    type="button"
                    onClick={() => setPatologiaVimume(pat)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                      patologiaVimume === pat
                        ? 'bg-purple-600 text-white font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {pat}
                  </button>
                ))}
              </div>
            </div>

            {/* Gráfico Clínico SVG Interactivo */}
            <div className="h-28 w-full bg-zinc-950/80 rounded-xl border border-white/5 p-4 flex items-center justify-center relative overflow-hidden mb-4">
              <svg className="w-full h-full text-purple-400" viewBox="0 0 500 100" preserveAspectRatio="none">
                <path
                  d={
                    patologiaVimume === 'memoria'
                      ? 'M0,50 Q25,10 50,50 T100,50 T150,50 T200,50 T250,50 T300,50 T350,50 T400,50 T450,50 T500,50'
                      : patologiaVimume === 'enfoque'
                      ? 'M0,50 Q12.5,20 25,50 T50,50 T75,50 T100,50 T125,50 T150,50 T175,50 T200,50 T225,50 T250,50 T275,50 T300,50 T325,50 T350,50 T375,50 T400,50 T425,50 T450,50 T475,50 T500,50'
                      : 'M0,50 Q50,25 100,50 T200,50 T300,50 T400,50 T500,50'
                  }
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="animate-pulse"
                />
              </svg>
              <div className="absolute bottom-2 right-3 text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                Frecuencia Coherente: 40 Hz Gamma
              </div>
            </div>

            {/* Botón Visor Embebido del Dossier Clínico (Pregunta 44) */}
            <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-white/5">
              <span className="text-zinc-400">Evidencia clínica documentada y deducible Ley 49/2002</span>
              <Link
                href="/vimume"
                className="inline-flex items-center gap-1.5 text-purple-300 hover:text-white hover:underline"
              >
                <FileText className="w-4 h-4" />
                <span>Abrir Visor del Dossier Clínico (PDF)</span>
              </Link>
            </div>
          </div>
        )}

        {/* C. CASO ARTISTAS: BUSCADOR POR GÉNERO & SPLIT METÁLICO 80/10/10 (Preguntas 35, 36, 45, 46) */}
        {activeNode.id === 'artistas-europa' && (
          <div className="my-8 p-6 rounded-2xl bg-zinc-900/60 border border-amber-500/30">
            {/* Buscador Píldora por Género Musical (Pregunta 35) */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {[
                { id: 'lirico', label: 'Lírico (Edwin Agudelo 350 €)' },
                { id: 'mariachi', label: 'Mariachi de Gala' },
                { id: 'jazz', label: 'Jazz & Swing' },
                { id: 'clasico', label: 'Clásico & Cuerda' },
                { id: 'pop', label: 'Pop de Gala' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGeneroMusical(g.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    generoMusical === g.id
                      ? 'bg-amber-400 text-zinc-950 font-bold shadow-md'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* Tarjeta de Metal Oscuro con Holograma de Split 80/10/10 (Preguntas 36 & 46) */}
            <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-5 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Disc className="w-4 h-4 text-amber-400 animate-spin" />
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                    Tarjeta Metal Soberana · Split Inmutable
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">SHA-256 Price-Lock</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-emerald-500/20">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase">80% Artista</div>
                  <div className="text-lg font-bold font-mono text-white">280,00 €</div>
                  <div className="text-[9px] text-zinc-500">Neto Ejecutor</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-cyan-500/20">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase">10% EAR OS</div>
                  <div className="text-lg font-bold font-mono text-white">35,00 €</div>
                  <div className="text-[9px] text-zinc-500">Infraestructura</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-purple-500/20">
                  <div className="text-[10px] font-mono text-purple-400 uppercase">10% VIMUME</div>
                  <div className="text-lg font-bold font-mono text-white">35,00 €</div>
                  <div className="text-[9px] text-zinc-500">Impacto Social</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* D. CASO EVENTOS: CRONOGRAMA INTERACTIVO & HORA BANQUETE (Preguntas 38 & 48) */}
        {activeNode.id === 'eventos-360' && (
          <div className="my-8 p-6 rounded-2xl bg-zinc-900/60 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Cronograma Técnico Paso a Paso (Hora Banquete Editable)
              </h3>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-zinc-400">Banquete:</span>
                <input
                  type="time"
                  value={horaBanquete}
                  onChange={(e) => setHoraBanquete(e.target.value)}
                  className="bg-zinc-950 border border-white/10 text-cyan-400 px-2 py-0.5 rounded font-mono"
                />
              </div>
            </div>

            {/* Línea de Tiempo de 4 Hitos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-white/5">
                <div className="text-cyan-400 font-bold mb-1">16:30 · Montaje</div>
                <div className="text-zinc-400 text-[11px]">Carga, cableado y verificación acústica</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-white/5">
                <div className="text-cyan-400 font-bold mb-1">18:45 · Soundcheck</div>
                <div className="text-zinc-400 text-[11px]">Calibración limitador &lt; 75 dB SPL</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-white/5">
                <div className="text-amber-400 font-bold mb-1">{horaBanquete} · Show en Vivo</div>
                <div className="text-zinc-400 text-[11px]">Directo solista de gala / banquete</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-white/5">
                <div className="text-zinc-400 font-bold mb-1">01:30 · Desmontaje</div>
                <div className="text-zinc-500 text-[11px]">Salida limpia y entrega de acta</div>
              </div>
            </div>
          </div>
        )}

        {/* Live Metrics Row */}
        <div className="grid grid-cols-3 gap-3 my-6">
          {activeNode.metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-4 rounded-xl bg-zinc-900/60 border border-white/5"
            >
              <div className="text-[11px] text-zinc-400 font-mono mb-1">{m.label}</div>
              <div className="text-base sm:text-xl font-bold font-mono text-white">{m.value}</div>
            </div>
          ))}
        </div>

        {/* Sub-nodes Cards */}
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">
            Sub-Nodos & Entradas Directas de Negocio:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeNode.subnodes.map((sub) => (
              <Link
                key={sub.id}
                href={sub.route}
                className="group p-4 sm:p-5 rounded-2xl border border-white/10 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: activeNode.accentBg,
                        color: activeNode.color,
                      }}
                    >
                      {sub.tag}
                    </span>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                    {sub.title}
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    {sub.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-zinc-500 group-hover:text-zinc-300">
                  Entrar a la vertical →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ASISTENTE ACOMPAÑANTE CONTEXTUAL EN VIVO (Pregunta 15) */}
        <div className="mt-8 p-4 rounded-2xl border border-white/10 bg-zinc-900/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: activeNode.accentBg,
                color: activeNode.color,
                border: `1px solid ${activeNode.borderColor}`,
              }}
            >
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white">
                {activeNode.assistantTitle}
              </div>
              <div className="text-xs text-zinc-300 font-sans mt-0.5">
                "{activeNode.assistantGreeting}"
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/${formattedPhone}?text=${encodeURIComponent(`Hola, consulto sobre ${activeNode.name}: ${activeNode.assistantTitle}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-mono font-medium transition-all flex-shrink-0"
          >
            <span>Hablar con el Asistente</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 4. DOCK VIP DE CIERRE (Solo Escritorio para evitar solapes con el HUD móvil) */}
      <div className="hidden lg:block fixed bottom-0 inset-x-0 z-40 p-4 bg-zinc-950/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300">
              Nodo Activo: <strong className="text-white">{activeNode.name}</strong>
            </span>
            <span className="hidden md:inline text-zinc-600">·</span>
            <span className="hidden md:inline text-amber-400 font-bold">
              Fianza Deducible: {DEPOSITO_STRIPE_EUR.toFixed(2)} € (Price-Lock SHA-256)
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Botón 1: WhatsApp con Edwin Agudelo */}
            <a
              href={`https://wa.me/${formattedPhone}?text=${encodeURIComponent(`Hola Edwin, estoy explorando el nodo ${activeNode.name} y deseo asesoría directa.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-mono font-bold transition-all"
            >
              <span>Hablar con Edwin</span>
            </a>

            {/* Botón 2: Bloquear Fecha VIP con Fianza 100 € Stripe */}
            <Link
              href="/booking?tier=vip"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 text-xs font-mono font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(236,182,19,0.3)] hover:scale-105 active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 text-zinc-950" />
              <span>Bloquear Fecha ({DEPOSITO_STRIPE_EUR.toFixed(2)} €)</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
