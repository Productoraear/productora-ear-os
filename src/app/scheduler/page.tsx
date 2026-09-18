'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Check, CheckCircle2, Star, Shield, Zap, Calendar, 
  Clock, Cpu, Sparkles, Activity, Layers, Lock, ChevronRight,
  Terminal, Globe, Users, PhoneCall, MessageCircle, Landmark
} from 'lucide-react';
import { QronosMultiAgentPipeline } from '@/app/components/qronos/QronosMultiAgentPipeline';
import { QronosGanttScheduler } from '@/app/components/qronos/QronosGanttScheduler';
import { QronosGuardrails } from '@/app/components/qronos/QronosGuardrails';
import { QronosAgentInbox } from '@/app/components/qronos/QronosAgentInbox';
import { QronosInsightsDashboard } from '@/app/components/qronos/QronosInsightsDashboard';
import { QronosHatchingDivider } from '@/app/components/qronos/QronosHatchingDivider';

export default function PublicSchedulerPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const marqueePartners = [
    'Stripe Price-Lock SHA-256',
    'Bose Professional F1 812',
    'Shure Beta 87A Wireless',
    'Vercel Edge Network',
    'Supabase Database',
    'GitHub Bare-Metal DAG',
    'LCSP Art. 118 B2G',
    'Fincas Madrid & Toledo',
    'Ollama GPU RX 7900 XTX',
    'VIMUME Neuroacústica RSC'
  ];

  return (
    <main className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-[#ecb613] selection:text-black">
      
      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* LÍNEAS DE CONTORNO LATERALES ICÓNICAS DE QRONOS                       */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 left-1/2 z-[51] w-full max-w-[1400px] -translate-x-1/2">
        <span className="absolute inset-y-0 left-0 w-px bg-white/10 mix-blend-difference lg:left-5" />
        <span className="absolute inset-y-0 right-0 w-px bg-white/10 mix-blend-difference lg:right-5" />
        <span className="absolute inset-y-0 left-px w-px bg-white/5 mix-blend-difference lg:left-7" />
        <span className="absolute inset-y-0 right-px w-px bg-white/5 mix-blend-difference lg:right-7" />
      </div>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* NAVBAR STICKY VIDRIO OSCURO                                           */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <header className="fixed top-3 left-0 right-0 z-50 transition-all duration-500">
        <nav className="relative mx-auto w-full max-w-[1344px] before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:bg-white/10 after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-px after:bg-white/10 lg:w-[calc(100%-3.5rem)] bg-black/70 backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between px-6">
            
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="size-6 rounded bg-[#ecb613] text-black font-black text-xs flex items-center justify-center font-mono">
                Ω
              </span>
              <span className="font-display font-black tracking-tight text-base sm:text-lg text-white group-hover:text-[#ecb613] transition-colors">
                PRODUCTORA EAR <span className="text-[#ecb613] text-xs font-mono font-normal">/ QRONOS</span>
              </span>
            </Link>

            {/* LINKS CENTRALES */}
            <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider text-white/70">
              <a href="#features" className="hover:text-white transition-colors">CARACTERÍSTICAS</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">PIPELINES</a>
              <a href="#insights" className="hover:text-white transition-colors">TELEMETRÍA</a>
              <a href="#pricing" className="hover:text-white transition-colors">TARIFAS SSOT</a>
              <a href="#testimonials" className="hover:text-white transition-colors">CASOS DE ÉXITO</a>
            </div>

            {/* STAR-BUTTON DE ACCESO */}
            <div className="flex items-center gap-3">
              <Link
                href="/admin/scheduler"
                className="relative inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-[#ecb613] hover:text-black hover:border-[#ecb613] text-white text-xs font-mono font-bold transition-all duration-300 shadow-md group"
              >
                <span>ACCESO COCKPIT</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION CINEMATOGRÁFICA                                      */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center pt-32 pb-20 px-4 text-center overflow-hidden">
        
        {/* RESPLANDOR AMBIENTAL */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#ecb613]/15 via-[#FF2B44]/10 to-transparent blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-[#ecb613]">
            <Sparkles className="w-3.5 h-3.5 text-[#ecb613]" />
            <span>ARQUITECTURA OMEGA v7.0 · VAMPIRE RAG ENGINE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.05] text-balance">
            El sistema de programación y despacho para <span className="bg-gradient-to-r from-white via-zinc-200 to-[#ecb613] bg-clip-text text-transparent">agentes autónomos</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed font-sans">
            Coordina tareas recurrentes entre todos los subsistemas: prospección de bodas, llamadas outbound con voz clonada, licitaciones B2G (&lt;14.250€) y depósitos Stripe SHA-256 sin intermediarios.
          </p>

          {/* BOTONES PRINCIPALES */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/admin/scheduler"
              className="px-6 py-3 rounded-full bg-[#ecb613] text-black font-bold text-sm font-mono hover:bg-[#ffd147] transition-transform hover:scale-105 shadow-xl flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-black" /> ABRIR COCKPIT EN VIVO
            </Link>

            <Link
              href="/admin/simulador"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm font-mono transition-colors"
            >
              SIMULAR EVENTO (350€ + KM)
            </Link>
          </div>
        </div>

        {/* MARQUEE INFINITO DE PARTNERS / ACTIVOS */}
        <div className="w-full max-w-6xl mx-auto mt-20 overflow-hidden mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
          <div className="flex gap-8 whitespace-nowrap animate-marquee font-mono text-xs text-white/40 tracking-widest uppercase">
            {[...marqueePartners, ...marqueePartners].map((partner, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-[#ecb613]/60" />
                <span>{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEPARADOR HATCHING */}
      <QronosHatchingDivider />

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 2. PRODUCT OVERVIEW & GANTT SCHEDULER                                 */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 sm:px-8 max-w-[1400px] mx-auto space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="font-mono text-xs text-[#ecb613] uppercase tracking-wider">01 · CRONOGRAMA REACTIVO</span>
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white">
            Ejecución persistente. Los agentes nunca pierden el ritmo.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Qronos mantiene el estado duradero de la orquestación: restaura memoria, herramientas y límites de gasto en cada disparo programado o reactivo.
          </p>
        </div>

        {/* GANTT COMPONENT */}
        <QronosGanttScheduler />

        {/* 3 COLUMNAS DE CARACTERÍSTICAS QRONOS */}
        <div className="grid gap-8 md:grid-cols-3 pt-6 font-sans">
          <div className="p-6 rounded-xl border border-white/10 bg-zinc-950/60 space-y-2">
            <div className="flex items-center gap-2 text-[#ecb613] font-bold text-sm">
              <Clock className="w-4 h-4" /> Disparo por Señal
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Inicia tareas desde un cron diario (08:30 AM), un webhook de reserva novios o un despertar autónomo decidido por el propio agente.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-zinc-950/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Layers className="w-4 h-4" /> Memoria Zero-Token (ZTM)
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Conserva el contexto del cliente, la finca y el split 80/10/10 entre ejecuciones sin acumular tokens en el LLM local.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-zinc-950/60 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <Shield className="w-4 h-4" /> Guardarraíles Inmutables
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Límites acústicos &lt;75 dB SPL, licitaciones menores &lt;14.250€ y depósito inmutable de 100€ con hash SHA-256 en Stripe.
            </p>
          </div>
        </div>
      </section>

      {/* SEPARADOR HATCHING */}
      <QronosHatchingDivider />

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 3. BENTO GRID: PIPELINES, INBOX & GUARDRAILS                         */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-8 max-w-[1400px] mx-auto space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="font-mono text-xs text-[#ecb613] uppercase tracking-wider">02 · BENTO PIPELINES</span>
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white">
            Flujos autónomos diseñados para producción comercial.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Especialización modular: un agente prospecta, otro califica por teléfono y el orquestador asegura el cierre con depósito en Stripe.
          </p>
        </div>

        {/* PIPELINE LIVE SVG VISUALIZER */}
        <QronosMultiAgentPipeline />

        {/* GRID INFERIOR: GUARDRAILS + INBOX */}
        <div className="grid gap-8 lg:grid-cols-12 items-start pt-6">
          <div className="lg:col-span-7">
            <QronosGuardrails />
          </div>
          <div className="lg:col-span-5">
            <QronosAgentInbox />
          </div>
        </div>
      </section>

      {/* SEPARADOR HATCHING */}
      <QronosHatchingDivider />

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 4. REAL-TIME INSIGHTS & TELEMETRÍA                                    */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <section id="insights" className="py-24 px-4 sm:px-8 max-w-[1400px] mx-auto space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="font-mono text-xs text-[#ecb613] uppercase tracking-wider">03 · CONTROL TOTAL</span>
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white">
            Métricas de rendimiento en tiempo real.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Monitoriza cada tarea de prospección, ahorro de intermediarios y distribución de trabajo en la GPU AMD RX 7900 XTX de 24GB.
          </p>
        </div>

        <QronosInsightsDashboard />
      </section>

      {/* SEPARADOR HATCHING */}
      <QronosHatchingDivider />

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 5. PRICING & MODELO SOBERANO SSOT (SPLIT 80/10/10)                   */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4 sm:px-8 max-w-[1400px] mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-mono text-xs text-[#ecb613] uppercase tracking-wider">04 · TARIFAS Y CONTRATACIÓN</span>
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white">
            Precios sin intermediarios parásitos.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Regla de Negocio Canónica: 80% Artista Ejecutor / 10% Infraestructura EAR OS / 10% VIMUME Impacto Social y Deducción Fiscal.
          </p>
        </div>

        {/* GRID DE 4 TARIFAS */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Tarifa 1: Solista Base */}
          <div className="rounded-xl border border-white/10 bg-zinc-950/80 p-6 flex flex-col justify-between space-y-6 hover:border-[#ecb613]/50 transition-colors">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Solista de Gala</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white font-mono">350 €</span>
                <span className="text-xs text-zinc-500 font-mono">/ actuación</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Edwin Agudelo Solista Insignia. Mariachi & ranchera premium con sistema acústico Bose F1 812.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300 font-mono pt-2 border-t border-zinc-800">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 80% Artista (280,00 €)</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Rider Bose 12 W/pax</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Micrófono Shure Beta 87A</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Depósito Stripe 100€</li>
              </ul>
            </div>
            <Link
              href="/admin/simulador"
              className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold text-center transition-colors block"
            >
              Calcular con Km
            </Link>
          </div>

          {/* Tarifa 2: Alianza Fincas */}
          <div className="rounded-xl border border-[#ecb613]/40 bg-zinc-950/80 p-6 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-lg">
            <span className="absolute top-0 right-0 bg-[#ecb613] text-black text-[9px] font-mono font-black uppercase tracking-wider px-3 py-1 rounded-bl-lg">
              POPULAR FINCAS
            </span>
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[#ecb613]">Alianza Finca Partner</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white font-mono">10%</span>
                <span className="text-xs text-zinc-500 font-mono">comisión neta</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Para fincas y venues de boda. Cero costes fijos, liquidación instantánea por evento cerrado.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300 font-mono pt-2 border-t border-zinc-800">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ecb613]" /> Certificado de Impacto RSC</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ecb613]" /> Exclusividad Acústica &lt;75dB</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ecb613]" /> Centralita WhatsApp propia</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ecb613]" /> Panel de Afiliado en vivo</li>
              </ul>
            </div>
            <Link
              href="/admin/afiliados"
              className="w-full py-2.5 rounded-lg bg-[#ecb613] hover:bg-[#ffd147] text-black font-mono text-xs font-black text-center transition-colors block"
            >
              Unirse como Finca
            </Link>
          </div>

          {/* Tarifa 3: B2G Licitaciones Menores */}
          <div className="rounded-xl border border-white/10 bg-zinc-950/80 p-6 flex flex-col justify-between space-y-6 hover:border-cyan-400/50 transition-colors">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Licitación B2G Menor</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white font-mono">&lt;14.250€</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Para Ayuntamientos y Entidades Públicas. Cumplimiento del Art. 118 LCSP sin necesidad de concurso complejo.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300 font-mono pt-2 border-t border-zinc-800">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Certificado Modelo 182 AEAT</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> SROI Comprobado 4.85x</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Memoria Técnica Completa</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Despacho en 24h</li>
              </ul>
            </div>
            <Link
              href="/admin/licitaciones"
              className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold text-center transition-colors block"
            >
              Ver Licitaciones
            </Link>
          </div>

          {/* Tarifa 4: VIMUME Impacto Social */}
          <div className="rounded-xl border border-white/10 bg-zinc-950/80 p-6 flex flex-col justify-between space-y-6 hover:border-rose-400/50 transition-colors">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400">Impacto VIMUME 10%</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white font-mono">10%</span>
                <span className="text-xs text-zinc-500 font-mono">deducible</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Financiación de sesiones de neuro-musicoterapia para mayores con deterioro cognitivo en residencias (Protocolo 40 Hz Gamma).
              </p>
              <ul className="space-y-2 text-xs text-zinc-300 font-mono pt-2 border-t border-zinc-800">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-400" /> Deducción IRPF hasta 80%</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-400" /> 40%-50% Impuesto Sociedades</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-400" /> Desescalada 74% fármacos</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-400" /> Sello Social S-Class</li>
              </ul>
            </div>
            <Link
              href="/admin/tesoreria"
              className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold text-center transition-colors block"
            >
              Auditar Tesorería
            </Link>
          </div>

        </div>
      </section>

      {/* SEPARADOR HATCHING */}
      <QronosHatchingDivider />

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 6. TESTIMONIOS REALES & CASOS DE ÉXITO                                */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 px-4 sm:px-8 max-w-[1400px] mx-auto space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="font-mono text-xs text-[#ecb613] uppercase tracking-wider">05 · VALIDACIÓN COMERCIAL</span>
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white">
            Resultados contrastados en bodas y administraciones.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          
          <div className="p-8 rounded-2xl border border-white/10 bg-zinc-950/70 space-y-6">
            <p className="text-base sm:text-lg text-zinc-200 leading-relaxed italic">
              "El sistema de Price-Lock con 100€ de señal en Stripe y la orquestación automática de fecha nos ha permitido cerrar 14 bodas en Toledo sin una sola llamada perdida ni disputa de calendario."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
              <span className="size-10 rounded-full bg-[#ecb613] text-black font-black flex items-center justify-center font-mono">
                FL
              </span>
              <div>
                <p className="text-sm font-bold text-white">Dirección de Eventos</p>
                <p className="text-xs text-zinc-400">Finca Monte de los Ángeles (Madrid/Toledo)</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-zinc-950/70 space-y-6">
            <p className="text-base sm:text-lg text-zinc-200 leading-relaxed italic">
              "Para las Fiestas Patronales pudimos tramitar la contratación del solista y el equipamiento acústico Bose como contrato menor bajo el Art. 118 LCSP en menos de 24 horas y con justificación SROI impecable."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
              <span className="size-10 rounded-full bg-cyan-400 text-black font-black flex items-center justify-center font-mono">
                AY
              </span>
              <div>
                <p className="text-sm font-bold text-white">Concejalía de Festejos & Cultura</p>
                <p className="text-xs text-zinc-400">Ayuntamiento de la Comarca de Méntrida</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 7. CTA BANNER FINAL                                                   */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 border-t border-white/10 bg-zinc-950 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white">
            Deja de vigilar tareas manuales. <br />
            <span className="bg-gradient-to-r from-white via-zinc-300 to-[#ecb613] bg-clip-text text-transparent">
              Pon el negocio en piloto automático hoy.
            </span>
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto">
            Convierte cada señal comercial en un cierre de 100€ con depósito Stripe y caché digno de 350€ para el artista.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              href="/admin/scheduler"
              className="px-8 py-4 rounded-full bg-[#ecb613] text-black font-mono font-black text-sm hover:bg-[#ffd147] transition-all hover:scale-105 shadow-2xl flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-black" /> ENTRAR AL COCKPIT DE SCHEDULING
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 8. FOOTER MAESTRO CON BLINDAJE JURÍDICO                               */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 bg-black py-12 px-6 text-xs text-zinc-500 font-mono">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span>Productora EAR OS v7.0 · Qronos Engine Activo</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/admin" className="hover:text-white transition-colors">Admin Catmín</Link>
            <Link href="/aura" className="hover:text-white transition-colors">Aura Portfolio</Link>
            <Link href="/admin/simulador" className="hover:text-white transition-colors">Simulador 21st.dev</Link>
            <Link href="/admin/tesoreria" className="hover:text-white transition-colors">Stripe 100€</Link>
          </div>
          <p>© 2026 Productora EAR. Split Soberano 80/10/10 Inmutable.</p>
        </div>
      </footer>

    </main>
  );
}
