'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  ShieldCheck,
  Zap,
  Volume2,
  CreditCard,
  FileText,
  ArrowRight,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Percent,
  Sliders,
  Download,
  Sparkles,
  Lock,
  MapPin,
  Users,
  ChevronRight,
  TrendingUp,
  Award,
  Truck,
  Check,
  X,
  HelpCircle,
  BarChart3,
  DollarSign,
  Scale
} from 'lucide-react';
import { SCLASS_12_FINCAS_HOMOLOGADAS, FincaHomologada } from '@/lib/constants/fincas-catalog';
import {
  calculateB2BCommission,
  simulateAnnualAffiliateIncome,
  calculateSevenBusinessDaysDueDate,
  type AutoInvoiceDraft
} from '@/lib/b2b-billing-engine';
import { CENTRALITA } from '@/lib/phone-constants';
import FincasNationalCatalogClient from '@/app/fincas/FincasNationalCatalogClient';
import type { B2BHomologacionResponse } from '@/app/api/b2b/homologacion/route';
import {
  calculateFounderFeeMatch,
  PACTO_100_FUNDADORES_SSOT,
  buildComparativaBodasNetVsEarOs,
  type FounderFeeMatchResult,
  type BodasNetVsEarOsRow
} from '@/lib/fincas/fincaMetricsEngine';
import { formatCentsEur } from '@/lib/fincas/fincaMenuPricingEngine';

export type PortalView =
  | 'PACTO_100_FUNDADORES'
  | 'DIRECTORIO_NACIONAL_COMPLETO'
  | 'CATALOGO_12_FINCAS'
  | 'SIMULADOR_AFILIACION'
  | 'ONBOARDING_EXPRESS_15MIN';

export default function FincasB2BPortal() {
  const [activeView, setActiveView] = useState<PortalView>('PACTO_100_FUNDADORES');

  // Filtros de Catálogo
  const [provinciaFilter, setProvinciaFilter] = useState<string>('Todas');
  const [selectedFinca, setSelectedFinca] = useState<FincaHomologada | null>(null);

  // Estados del Pacto de 100 Fundadores & Simulador Price-Match
  const [previousPortal, setPreviousPortal] = useState<string>('Bodas.net');
  const [previousMonthlyFee, setPreviousMonthlyFee] = useState<number>(250);
  const [founderHorizonYears, setFounderHorizonYears] = useState<number>(5);
  const [founderAnnualWeddings, setFounderAnnualWeddings] = useState<number>(20);
  const [showYearlyBreakdown, setShowYearlyBreakdown] = useState<boolean>(false);

  // Cálculo reactivo del Price-Match
  const founderMatch = useMemo<FounderFeeMatchResult>(() => {
    return calculateFounderFeeMatch(previousMonthlyFee, {
      currentFoundersEnrolled: 42,
      horizonYears: founderHorizonYears,
      projectedAnnualWeddings: founderAnnualWeddings,
      averageWeddingTicketEur: 3800,
    });
  }, [previousMonthlyFee, founderHorizonYears, founderAnnualWeddings]);

  // Filas de comparativa SSOT Bodas.net vs EAR OS
  const comparativaRows = useMemo<BodasNetVsEarOsRow[]>(() => {
    return buildComparativaBodasNetVsEarOs();
  }, []);

  // Estados del Simulador de Comisiones Tradicional
  const [eventTicket, setEventTicket] = useState<number>(3800);
  const [commissionRate, setCommissionRate] = useState<number>(0.12);
  const [annualEventsCount, setAnnualEventsCount] = useState<number>(20);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState<boolean>(false);
  const [generatedDraft, setGeneratedDraft] = useState<AutoInvoiceDraft | null>(null);

  // Estados del Onboarding Express
  const [onboardingData, setOnboardingData] = useState({
    name: '',
    location: '',
    provincia: 'Madrid',
    cif: '',
    director: '',
    telefono: '',
    email: '',
    potenciaKw: 25,
    tomaElectrica: 'CETAC 32A 3P+N+T',
    polizaRCEuros: 300000,
    aseguradora: 'Mapfre Empresas',
    numeroPoliza: '',
    limiteInteriorDBA: 88,
    limiteExteriorDBA: 90,
    accesoConvoy14Plazas: true,
    // Campos del Pacto 100 Fundadores
    isFounderPactApplied: true,
    portalAnterior: 'Bodas.net',
    cuotaAnteriorEurMes: 250,
  });
  const [onboardingResult, setOnboardingResult] = useState<B2BHomologacionResponse | null>(null);
  const [submittingOnboarding, setSubmittingOnboarding] = useState<boolean>(false);

  // Cálculos reactivos tradicionales
  const commissionCalc = calculateB2BCommission(eventTicket, commissionRate, true);
  const annualProjection = simulateAnnualAffiliateIncome(annualEventsCount, eventTicket, commissionRate);
  const dueDateSLA = calculateSevenBusinessDaysDueDate();

  // Filtrado de fincas
  const filteredFincas = provinciaFilter === 'Todas'
    ? SCLASS_12_FINCAS_HOMOLOGADAS
    : SCLASS_12_FINCAS_HOMOLOGADAS.filter(f => f.provincia.toLowerCase() === provinciaFilter.toLowerCase());

  // Auditoría en tiempo real para el formulario de onboarding
  const computeAuditScore = () => {
    let score = 100;
    const issues: string[] = [];
    if (onboardingData.polizaRCEuros < 300000) {
      score -= 40;
      issues.push('Póliza RC inferior al mínimo regulatorio (300.000 €)');
    }
    if (onboardingData.potenciaKw < 15) {
      score -= 30;
      issues.push('Potencia eléctrica insuficiente (< 15 kW)');
    }
    if (!onboardingData.tomaElectrica.includes('CETAC')) {
      score -= 20;
      issues.push('Toma no normalizada CETAC');
    }
    if (!onboardingData.accesoConvoy14Plazas) {
      score -= 15;
      issues.push('Acceso no verificado para furgón 14 plazas');
    }
    return { score: Math.max(0, score), issues };
  };

  const auditStatus = computeAuditScore();

  const handleApplyFounderPactFromSimulator = () => {
    setOnboardingData((prev) => ({
      ...prev,
      isFounderPactApplied: true,
      portalAnterior: previousPortal,
      cuotaAnteriorEurMes: previousMonthlyFee,
    }));
    setActiveView('ONBOARDING_EXPRESS_15MIN');
  };

  const handleGenerateInvoicePreview = async () => {
    setIsGeneratingInvoice(true);
    try {
      const res = await fetch('/api/b2b/autofactura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razonSocial: selectedFinca ? selectedFinca.name + ' S.L.' : 'Finca Partner Homologada S.L.',
          cif: 'B-' + Math.floor(10000000 + Math.random() * 89999999),
          iban: 'ES9121000418450200051332',
          direccionFiscal: selectedFinca ? selectedFinca.location : 'Madrid, España',
          tipoPartner: 'FINCA_HOMOLOGADA',
          eventos: [
            {
              eventoId: `EVT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
              fechaEvento: new Date().toISOString().split('T')[0],
              clienteNombre: 'Boda S-Class Referenciada',
              formatoContratado: 'Boda S-Class Diamond 360',
              importeBrutoEvento: eventTicket,
              comisionPct: commissionRate,
              comisionNeta: commissionCalc.comisionNeta,
              ivaPct: 0.21,
              ivaImporte: Math.round(commissionCalc.comisionNeta * 0.21 * 100) / 100,
              totalLiquidable: commissionCalc.comisionConIva,
              fincaHomologadaId: selectedFinca?.id || 'finca-partner'
            }
          ]
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedDraft(data.draft as AutoInvoiceDraft);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const handleSubmitOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingOnboarding(true);
    try {
      const res = await fetch('/api/b2b/homologacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...onboardingData,
          cuotaAnteriorEurMes: onboardingData.isFounderPactApplied
            ? Number(onboardingData.cuotaAnteriorEurMes)
            : undefined,
          portalAnterior: onboardingData.isFounderPactApplied
            ? onboardingData.portalAnterior
            : undefined,
          isFounderPactApplied: onboardingData.isFounderPactApplied
        })
      });
      const result: B2BHomologacionResponse = await res.json();
      setOnboardingResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingOnboarding(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-[#050507] text-white selection:bg-[#ecb613] selection:text-black font-sans">

      {/* ── TOPBAR DE GOBERNANZA B2B ── */}
      <aside aria-label="Gobernanza B2B" className="w-full border-b border-white/10 bg-[#09090d]/90 backdrop-blur-md px-4 sm:px-6 py-2 text-xs text-white/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="text-[#ecb613] font-bold uppercase tracking-wider truncate">Nodo B2B Empresas & Fincas</span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="hidden sm:inline">Pacto de los 100 Fundadores (42/100 Asignadas)</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[10px] sm:text-[11px]">
            <span>SLA: <strong className="text-white">&lt; 15 min</strong></span>
            <span>Liquidación: <strong className="text-white">&le; 7 días</strong></span>
            <span>Comisión: <strong className="text-emerald-400">10% - 15%</strong></span>
            <span>Fuga: <strong className="text-emerald-400">0% Contractual</strong></span>
          </div>
        </div>
      </aside>

      {/* ── HERO BANNER CINEMÁTICO ── */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-10 border-b border-white/10">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[450px] w-[800px] max-w-full bg-gradient-radial from-[#ecb613]/10 via-[#00E5FF]/5 to-transparent blur-[120px] z-0" />

        <div className="relative z-10 mx-auto max-w-7xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[#ecb613] max-w-full truncate">
            <Sparkles size={12} className="shrink-0" aria-hidden="true" />
            <span className="truncate">Programa de Captación Exclusiva · Top 100 Fincas de España</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-syne text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-[0.98] break-words">
                Pacto de los 100 Fundadores:<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">
                  Igualamos tu cuota con tarifa vitalicia y 0% de fuga.
                </span>
              </h1>
              <p className="text-white/70 text-sm sm:text-base max-w-3xl leading-relaxed">
                Acceso reservado a directores y propietarios de fincas. Si estás pagando cuotas en Bodas.net o portales tradicionales, <strong>igualamos tu tarifa mensual como cuota vitalicia congelada (0% IPC)</strong>, garantizamos que ningún competidor se anunciará en tu ficha y te liquidamos de <strong>10% al 15% de comisión por cada banquete</strong> vía SEPA en 7 días.
              </p>
            </div>

            {/* METRIC BADGE CARD */}
            <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-[#09090d] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs uppercase text-white/50">Cupo 100 Fundadores</span>
                <span className="rounded-full bg-[#ecb613] px-2 py-0.5 font-mono text-[9px] font-black text-black uppercase">
                  58 Libres
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center font-mono">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-2xl font-black text-[#ecb613] block">42 / 100</span>
                  <span className="text-[10px] text-white/40 uppercase">Plazas Asignadas</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-2xl font-black text-emerald-400 block">0% Fuga</span>
                  <span className="text-[10px] text-white/40 uppercase">Cero Anunciantes</span>
                </div>
              </div>
              <div className="text-[11px] font-mono text-white/50 text-center">
                Tarifa congelada de por vida para las primeras 100 fincas homologadas.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SELECTOR DE MODO / VISTAS PRINCIPALES ── */}
      <nav aria-label="Navegación del portal de fincas" className="sticky top-0 z-40 border-b border-white/10 bg-[#050507]/90 backdrop-blur-xl px-4 sm:px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            
            {/* PESTAÑA PRINCIPAL: PACTO 100 FUNDADORES */}
            <button
              onClick={() => setActiveView('PACTO_100_FUNDADORES')}
              aria-pressed={activeView === 'PACTO_100_FUNDADORES'}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeView === 'PACTO_100_FUNDADORES'
                  ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 ring-1 ring-amber-300'
                  : 'text-white/80 hover:bg-white/5 hover:text-white border border-[#ecb613]/30 bg-[#ecb613]/5'
              }`}
            >
              <Sparkles size={14} className="text-[#ecb613] shrink-0" aria-hidden="true" />
              <span>Pacto 100 Fundadores</span>
              <span className="ml-1 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                42/100
              </span>
            </button>

            <button
              onClick={() => setActiveView('DIRECTORIO_NACIONAL_COMPLETO')}
              aria-pressed={activeView === 'DIRECTORIO_NACIONAL_COMPLETO'}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeView === 'DIRECTORIO_NACIONAL_COMPLETO'
                  ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <MapPin size={14} aria-hidden="true" />
              <span>Directorio Nacional (9.559)</span>
            </button>

            <button
              onClick={() => setActiveView('CATALOGO_12_FINCAS')}
              aria-pressed={activeView === 'CATALOGO_12_FINCAS'}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeView === 'CATALOGO_12_FINCAS'
                  ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Building2 size={14} aria-hidden="true" />
              <span>12 Fincas Homologadas</span>
            </button>

            <button
              onClick={() => setActiveView('SIMULADOR_AFILIACION')}
              aria-pressed={activeView === 'SIMULADOR_AFILIACION'}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeView === 'SIMULADOR_AFILIACION'
                  ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Percent size={14} aria-hidden="true" />
              <span>Simulador de Comisiones & Autofactura</span>
            </button>

            <button
              onClick={() => setActiveView('ONBOARDING_EXPRESS_15MIN')}
              aria-pressed={activeView === 'ONBOARDING_EXPRESS_15MIN'}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeView === 'ONBOARDING_EXPRESS_15MIN'
                  ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Clock size={14} aria-hidden="true" />
              <span>Onboarding Express &lt; 15 min</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={`https://wa.me/${CENTRALITA.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                'Hola Edwin, deseo información técnica sobre el Pacto de los 100 Fundadores para mi finca.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-white/70 hover:text-[#ecb613] flex items-center gap-1.5 transition-colors"
            >
              <Phone size={12} className="text-[#ecb613]" aria-hidden="true" />
              <span>Centralita: {CENTRALITA.display}</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ── CUERPO DINÁMICO SEGÚN VISTA SELECCIONADA ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:px-8">

        {/* ═══════════════════════════════════════════════════════ */}
        {/* VISTA 0: PACTO DE LOS 100 FUNDADORES (PRICE-MATCH SSOT)  */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeView === 'PACTO_100_FUNDADORES' && (
          <div className="space-y-12">

            {/* BLOQUE A: CONTADOR DINÁMICO DE PLAZAS (SLOT ALLOCATION METER) */}
            <div className="rounded-3xl border border-[#ecb613]/40 bg-gradient-to-r from-[#09090d] via-[#14120a] to-[#09090d] p-6 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#ecb613]/5 blur-3xl rounded-full pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-mono text-xs uppercase tracking-wider">
                    <Award size={14} />
                    <span>Convocatoria Oficial Limitada a 100 Fincas en España</span>
                  </div>
                  <h2 className="font-syne text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                    Plazas de Fundador: 42 Asignadas / 58 Disponibles
                  </h2>
                  <p className="text-zinc-300 text-sm leading-relaxed font-sans">
                    Al unirte a las 100 primeras fincas homologadas, tu cuota mensual queda <strong className="text-white">igualada a lo que pagas actualmente en tu portal anterior</strong> y blindada con un <strong className="text-white">0% de incremento por IPC de por vida</strong>. 
                    Una vez completada la plaza 100, la adhesión se cerrará y pasará al tarifario regular sin posibilidad de igualación vitalicia.
                  </p>
                </div>

                <div className="shrink-0 rounded-2xl bg-black/60 border border-white/10 p-6 text-center space-y-2 min-w-[220px]">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block">
                    Próxima Plaza Asignable
                  </span>
                  <div className="font-syne text-5xl font-black text-[#ecb613]">
                    #{founderMatch.founderSlotNumber ?? 43}
                  </div>
                  <div className="text-xs font-mono text-emerald-400 flex items-center justify-center gap-1.5 pt-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{founderMatch.remainingSlots} plazas libres</span>
                  </div>
                </div>
              </div>

              {/* Barra de progreso de cupo de fundadores */}
              <div className="space-y-2 relative z-10">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                  <span>Progreso de Adhesión Nacional</span>
                  <span className="text-white font-bold">42% (Cierre automático en plaza 100)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden p-0.5">
                  <div
                    style={{ width: '42%' }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-[#ecb613] to-amber-300 shadow-md shadow-[#ecb613]/30"
                  />
                </div>
              </div>
            </div>

            {/* BLOQUE B: SIMULADOR INTERACTIVO DE PRICE-MATCH */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Controles de entrada del simulador (7 cols) */}
              <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#09090d]/90 p-6 sm:p-8 space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-wider mb-1">
                    <Scale size={14} />
                    <span>Calculadora de Igualación Vitalicia</span>
                  </div>
                  <h3 className="font-syne text-xl sm:text-2xl font-black uppercase text-white">
                    Simula tu Cuota Actual y Proyección de Ahorro
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Compara el coste real frente a la inflación tradicional y la fuga de clientes.
                  </p>
                </div>

                {/* Selección rápida de portal anterior */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase text-zinc-400">
                    Portal Anterior donde te anuncias:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { name: 'Bodas.net', fee: 250 },
                      { name: 'Zankyou', fee: 180 },
                      { name: 'Guía Regional', fee: 120 },
                      { name: 'Personalizado', fee: previousMonthlyFee },
                    ].map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => {
                          setPreviousPortal(p.name);
                          if (p.name !== 'Personalizado') {
                            setPreviousMonthlyFee(p.fee);
                          }
                        }}
                        className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold transition-all border cursor-pointer ${
                          previousPortal === p.name
                            ? 'bg-[#ecb613] text-black border-[#ecb613] shadow-md'
                            : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider de cuota mensual */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-400">Cuota Mensual Actual en tu Portal:</span>
                    <strong className="text-lg text-white font-syne">{previousMonthlyFee} € / mes</strong>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={1000}
                    step={10}
                    value={previousMonthlyFee}
                    onChange={(e) => setPreviousMonthlyFee(Number(e.target.value))}
                    className="w-full accent-[#ecb613] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>50 €/mes (Mínimo homologado)</span>
                    <span>250 €/mes (Media mercado)</span>
                    <span>1.000 €/mes (Macro-directorios)</span>
                  </div>
                </div>

                {/* Horizonte temporal de proyección */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase text-zinc-400">
                    Horizonte Temporal de Comparativa:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 5, 10].map((years) => (
                      <button
                        key={years}
                        type="button"
                        onClick={() => setFounderHorizonYears(years)}
                        className={`py-2 rounded-xl font-mono text-xs font-bold transition-all border cursor-pointer ${
                          founderHorizonYears === years
                            ? 'bg-emerald-500 text-black border-emerald-500'
                            : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                        }`}
                      >
                        {years} Años
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider de bodas anuales proyectadas para comisión */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-400">Bodas Producidas al Año con Productora EAR:</span>
                    <strong className="text-base text-emerald-400 font-syne">{founderAnnualWeddings} bodas / año</strong>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={1}
                    value={founderAnnualWeddings}
                    onChange={(e) => setFounderAnnualWeddings(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>5 bodas (Boutique)</span>
                    <span>20 bodas (Media recinto)</span>
                    <span>50 bodas (Gran finca)</span>
                  </div>
                </div>

                {/* Nota de garantía de 0% de IPC */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-[#ecb613]">
                    <ShieldCheck size={16} />
                    <span className="font-bold">Garantía Contractual de Congelación 0% IPC</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
                    Mientras los macro-portales aplican una subida media estimada del 6% anual acumulativo a sus tarifas, EAR OS congela tu cuota de por vida bajo contrato mercantil.
                  </p>
                </div>
              </div>

              {/* Resultado consolidado del Price-Match (5 cols) */}
              <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#09090d] p-6 sm:p-8 space-y-6 shadow-2xl sticky top-24">
                <div className="border-b border-white/10 pb-4">
                  <span className="font-mono text-xs uppercase text-zinc-500 block">Dictamen de Price-Match</span>
                  <h3 className="font-syne text-xl font-bold uppercase text-white">Propuesta de Fundador</h3>
                </div>

                {/* Cuota igualada */}
                <div className="p-4 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 space-y-1">
                  <span className="text-xs font-mono uppercase text-[#ecb613] font-bold">Cuota Mensual Congelada</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-syne text-3xl sm:text-4xl font-black text-white">
                      {founderMatch.matchedMonthlyFeeEur.toFixed(2)} €
                    </span>
                    <span className="text-xs font-mono text-zinc-400">/ mes (vitalicia)</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 pt-1">
                    Igualada exactamente a tu tarifa de <strong>{previousPortal}</strong>.
                  </p>
                </div>

                {/* Métricas clave de retorno en el horizonte */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>Ahorro por Subida de IPC ({founderHorizonYears} años):</span>
                    <strong className="text-white">
                      +{founderMatch.summaryLifetimeSavingsEur.totalFeeInflationSavingsEur.toLocaleString('es-ES')} €
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>Ahorro por Fuga Retenida (3.800 €/año):</span>
                    <strong className="text-white">
                      +{founderMatch.summaryLifetimeSavingsEur.totalFugaRetentionSavingsEur.toLocaleString('es-ES')} €
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>Ingresos Comisión Afiliado (10%-15%):</span>
                    <strong className="text-emerald-400">
                      +{founderMatch.summaryLifetimeSavingsEur.totalAffiliateEarningsEur.toLocaleString('es-ES')} €
                    </strong>
                  </div>
                  
                  <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                    <span className="text-white font-bold uppercase text-xs">Ventaja Neta Acumulada:</span>
                    <span className="font-syne text-2xl font-black text-emerald-400">
                      +{founderMatch.summaryLifetimeSavingsEur.totalNetLifetimeAdvantageEur.toLocaleString('es-ES')} €
                    </span>
                  </div>
                </div>

                {/* Botón para alternar desglose anual */}
                <button
                  type="button"
                  onClick={() => setShowYearlyBreakdown(!showYearlyBreakdown)}
                  className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white font-mono text-xs uppercase transition-colors cursor-pointer"
                >
                  {showYearlyBreakdown ? 'Ocultar desglose año a año ↑' : 'Ver desglose año a año ↓'}
                </button>

                {showYearlyBreakdown && (
                  <div className="rounded-2xl bg-black/60 border border-white/10 p-4 space-y-2 font-mono text-[11px] max-h-60 overflow-y-auto">
                    {founderMatch.breakdownByYear.map((yr) => (
                      <div key={yr.year} className="flex justify-between items-center py-1 border-b border-white/5">
                        <span className="text-zinc-400">Año {yr.year}:</span>
                        <div className="text-right">
                          <span className="text-zinc-500 line-through mr-2">{yr.competitorFeeEur} €</span>
                          <span className="text-white font-bold">{yr.earOsFounderFeeEur} €</span>
                          <span className="text-emerald-400 ml-2">(+{yr.cumulativeBenefitEur.toLocaleString('es-ES')} € acum.)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Acciones de Adhesión Transaccional */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleApplyFounderPactFromSimulator}
                    className="w-full py-4 px-6 rounded-2xl bg-[#ecb613] text-black font-syne text-xs font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-[#ecb613]/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Solicitar Homologación con Cuota Igualada ({founderMatch.matchedMonthlyFeeEur.toFixed(0)} €/mes)</span>
                    <ArrowRight size={16} />
                  </button>

                  <a
                    href={`https://wa.me/${CENTRALITA.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hola Edwin, deseo solicitar la plaza de Fundador #${founderMatch.founderSlotNumber ?? 43} con cuota igualada a ${founderMatch.matchedMonthlyFeeEur.toFixed(0)} €/mes de ${previousPortal}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone size={14} className="text-[#ecb613]" />
                    <span>Consultar por WhatsApp Directivo</span>
                  </a>
                </div>
              </div>

            </div>

            {/* BLOQUE C: MATRIZ COMPARATIVA OFICIAL BODAS.NET VS EAR OS (0% FUGA) */}
            <div className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 sm:p-10 space-y-6">
              <div className="border-b border-white/10 pb-4 max-w-3xl">
                <span className="text-xs font-mono uppercase tracking-widest text-[#ecb613] font-bold">
                  Transparencia Contractual Absoluta
                </span>
                <h3 className="font-syne text-2xl sm:text-3xl font-black uppercase text-white mt-1">
                  Comparativa: Portales Tradicionales vs Productora EAR OS
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                  Descubre por qué los recintos más exclusivos de España están migrando hacia el escaparate soberano de EAR OS.
                </p>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400 uppercase text-[11px]">
                      <th className="py-3 px-4">Concepto Evaluado</th>
                      <th className="py-3 px-4 text-zinc-400">Bodas.net / Directorios Tradicionales</th>
                      <th className="py-3 px-4 text-[#ecb613] font-bold">Productora EAR OS (Escaparate Exclusivo)</th>
                      <th className="py-3 px-4 text-right">Ventaja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {comparativaRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4 font-bold text-white font-sans">{row.concepto}</td>
                        <td className="py-4 px-4 text-zinc-400">{row.bodasNet}</td>
                        <td className="py-4 px-4 text-emerald-300 font-bold bg-[#ecb613]/5 rounded-xl">
                          {row.earOs}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase">
                            {row.ventaja === 'EAR' ? 'Soberanía EAR' : 'Estándar'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* VISTA 1: DIRECTORIO NACIONAL COMPLETO (9.559 FINCAS)    */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeView === 'DIRECTORIO_NACIONAL_COMPLETO' && (
          <FincasNationalCatalogClient />
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* VISTA 2: CATÁLOGO DE LAS 12 FINCAS HOMOLOGADAS          */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeView === 'CATALOGO_12_FINCAS' && (
          <div className="space-y-10">

            {/* BARRA DE FILTRADO */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#09090d] p-4">
              <div className="flex items-center gap-3">
                <Building2 className="text-[#ecb613]" size={20} />
                <div>
                  <h3 className="font-syne text-sm font-bold uppercase text-white">Red Oficial Certificada</h3>
                  <p className="font-mono text-xs text-white/50">Mostrando {filteredFincas.length} de 12 fincas auditadas</p>
                </div>
              </div>

              {/* Botones de Provincias */}
              <div className="flex flex-wrap items-center gap-2">
                {['Todas', 'Madrid', 'Toledo', 'Guadalajara'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setProvinciaFilter(p)}
                    className={`rounded-lg px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors cursor-pointer ${
                      provinciaFilter === p
                        ? 'bg-[#ecb613] text-black'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* GRID DE LAS 12 FINCAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFincas.map((finca) => (
                <div
                  key={finca.id}
                  className="rounded-3xl border border-white/10 bg-[#09090d] p-6 flex flex-col justify-between space-y-6 hover:border-[#ecb613]/50 transition-all group"
                >
                  <div className="space-y-4">
                    {/* Header Card */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#00E5FF] flex items-center gap-1">
                        <ShieldCheck size={11} />
                        <span>Auditada EAR OS</span>
                      </span>
                      <span className="font-mono text-xs text-white/50">
                        {finca.distanciaHubMentridaKm === 0 ? 'Hub Central' : `+${finca.distanciaHubMentridaKm} km`}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-syne text-xl font-bold uppercase text-white group-hover:text-[#ecb613] transition-colors">
                        {finca.name}
                      </h3>
                      <p className="flex items-center gap-1 font-mono text-xs text-white/50 mt-1">
                        <MapPin size={12} className="text-[#ecb613]" />
                        <span>{finca.location}</span>
                      </p>
                    </div>

                    <p className="text-xs text-white/65 leading-relaxed">
                      {finca.description}
                    </p>

                    {/* MATRIZ DE AUDITORÍA TÉCNICA */}
                    <div className="rounded-2xl border border-white/5 bg-black/40 p-3.5 space-y-2 font-mono text-[11px]">
                      <div className="flex items-center justify-between text-white/70">
                        <span className="flex items-center gap-1.5"><Users size={12} /> Aforo Máximo:</span>
                        <strong className="text-white">{finca.capacidadMaxPax} pax</strong>
                      </div>
                      <div className="flex items-center justify-between text-white/70">
                        <span className="flex items-center gap-1.5"><Zap size={12} className="text-[#ecb613]" /> Acometida:</span>
                        <strong className="text-[#ecb613]">{finca.potenciaKw} kW ({finca.tomaElectrica})</strong>
                      </div>
                      <div className="flex items-center justify-between text-white/70">
                        <span className="flex items-center gap-1.5"><Volume2 size={12} className="text-[#00E5FF]" /> Sonometría:</span>
                        <strong className="text-[#00E5FF]">{finca.limiteAcustico.interiorDBA} dBA int. / {finca.limiteAcustico.exteriorDBA} dBA ext.</strong>
                      </div>
                      <div className="flex items-center justify-between text-white/70">
                        <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-400" /> Póliza RC:</span>
                        <strong className="text-emerald-400">{finca.polizaRC.coberturaEuros.toLocaleString('es-ES')} € ({finca.polizaRC.aseguradora})</strong>
                      </div>
                    </div>
                  </div>

                  {/* FOOTER & ACCIONES */}
                  <div className="space-y-2 border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-white/50">Comisión Referida:</span>
                      <strong className="text-emerald-400 font-bold">{Math.round(finca.comisionAfiliacionPct * 100)}% (380 € - 570 €)</strong>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFinca(finca);
                        setCommissionRate(finca.comisionAfiliacionPct);
                        setActiveView('SIMULADOR_AFILIACION');
                      }}
                      className="w-full rounded-xl bg-white/10 py-3 text-center font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-[#ecb613] hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Percent size={13} />
                      <span>Simular Ingresos de esta Finca</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CALL TO ACTION PARA NUEVAS FINCAS */}
            <div className="rounded-3xl border border-[#ecb613]/30 bg-gradient-to-r from-[#0c0c12] via-[#12121c] to-[#0c0c12] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ecb613] font-bold">
                  ¿Gestiona una Finca o Espacio para Bodas en la Zona Centro?
                </span>
                <h3 className="font-syne text-2xl sm:text-3xl font-black uppercase text-white">
                  Solicite la Homologación S-Class de su Espacio
                </h3>
                <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
                  Verificamos su cuadro eléctrico, registramos sus zonas de sonido y comenzamos a canalizar parejas VIP y solicitudes corporativas de Productora EAR con liquidación semanal de comisiones.
                </p>
              </div>
              <button
                onClick={() => setActiveView('ONBOARDING_EXPRESS_15MIN')}
                className="shrink-0 rounded-xl bg-[#ecb613] px-7 py-4 font-mono text-xs font-black uppercase tracking-widest text-black hover:bg-white transition-all shadow-lg shadow-[#ecb613]/20 cursor-pointer"
              >
                Iniciar Onboarding &lt; 15 min
              </button>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* VISTA 3: SIMULADOR DE COMISIONES & AUTOFACTURA B2B       */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeView === 'SIMULADOR_AFILIACION' && (
          <div className="space-y-12">

            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#ecb613] font-bold">
                Transparencia Algorítmica & Cash-Flow B2B
              </span>
              <h2 className="font-syne text-3xl sm:text-4xl font-black uppercase text-white">
                Simulador de Comisiones & Autofacturación
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Cada evento producido en su finca genera una comisión automática del 10% al 15% que se liquida a los 7 días hábiles vía transferencia SEPA.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Formulario de Parámetros */}
              <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#09090d] p-6 sm:p-8 space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/50 mb-2">
                    Ticket Medio del Evento Contratado (€):
                  </label>
                  <input
                    type="range"
                    min="1500"
                    max="15000"
                    step="100"
                    value={eventTicket}
                    onChange={(e) => setEventTicket(Number(e.target.value))}
                    className="w-full accent-[#ecb613] cursor-pointer"
                  />
                  <div className="flex justify-between text-xs font-mono text-white/50 mt-1">
                    <span>1.500 €</span>
                    <strong className="text-white text-sm">{eventTicket.toLocaleString('es-ES')} €</strong>
                    <span>15.000 €</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/50 mb-2">
                    Tasa de Afiliación Acordada (%):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[0.10, 0.12, 0.15].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setCommissionRate(rate)}
                        className={`py-2.5 rounded-xl font-mono text-xs font-bold transition-all border cursor-pointer ${
                          commissionRate === rate
                            ? 'bg-[#ecb613] text-black border-[#ecb613]'
                            : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                        }`}
                      >
                        {Math.round(rate * 100)}%
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/50 mb-2">
                    Eventos Anuales Proyectados:
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    value={annualEventsCount}
                    onChange={(e) => setAnnualEventsCount(Number(e.target.value))}
                    className="w-full accent-[#00E5FF] cursor-pointer"
                  />
                  <div className="flex justify-between text-xs font-mono text-white/50 mt-1">
                    <span>5 eventos</span>
                    <strong className="text-[#00E5FF] text-sm">{annualEventsCount} eventos/año</strong>
                    <span>50 eventos</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleGenerateInvoicePreview}
                    disabled={isGeneratingInvoice}
                    className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-[#ecb613] hover:text-black font-mono text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <FileText size={15} />
                    <span>{isGeneratingInvoice ? 'Generando Autofactura...' : 'Generar Borrador de Autofactura Real'}</span>
                  </button>
                </div>
              </div>

              {/* Resultado de la simulación */}
              <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#09090d] p-6 sm:p-8 space-y-6">
                <div>
                  <span className="font-mono text-xs uppercase text-white/50 block">Liquidación por Evento</span>
                  <div className="font-syne text-4xl font-black text-[#ecb613] mt-1">
                    {commissionCalc.comisionNeta.toLocaleString('es-ES')} €
                  </div>
                  <span className="text-xs font-mono text-white/40 block">
                    (+ IVA: {commissionCalc.comisionConIva.toLocaleString('es-ES')} €)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-white/70">
                    <span>Ingreso Anual Proyectado:</span>
                    <strong className="text-emerald-400 text-sm">{annualProjection.ingresoNetoAnualFinca.toLocaleString('es-ES')} €</strong>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Vencimiento Legal SLA:</span>
                    <span>{dueDateSLA}</span>
                  </div>
                </div>

                {generatedDraft && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2 font-mono text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <CheckCircle2 size={15} />
                      <span>Borrador Autofactura Generado</span>
                    </div>
                    <div className="text-[11px] text-zinc-300">
                      ID: {generatedDraft.numeroFactura} · Total: {generatedDraft.desgloseEconomico.totalAPagarEnCuenta.toLocaleString('es-ES')} €
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* VISTA 4: ONBOARDING EXPRESS & AUDITORÍA EN 15 MIN        */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeView === 'ONBOARDING_EXPRESS_15MIN' && (
          <div className="space-y-10">

            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#ecb613] font-bold">
                Protocolo de Homologación S-Class
              </span>
              <h2 className="font-syne text-3xl sm:text-4xl font-black uppercase text-white">
                Onboarding Express & Auditoría en 15 Minutos
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Complete los datos técnicos de su espacio. Nuestro motor algorítmico evaluará el cuadro de carga, la compatibilidad CETAC y la cobertura de responsabilidad civil de inmediato.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Formulario */}
              <div className="lg:col-span-8 rounded-3xl border border-white/10 bg-[#09090d] p-6 sm:p-8 space-y-8">
                
                <form onSubmit={handleSubmitOnboarding} className="space-y-6">

                  {/* SECCIÓN 0: PACTO DE LOS 100 FUNDADORES */}
                  <div className="rounded-2xl border border-[#ecb613]/40 bg-gradient-to-r from-amber-950/20 via-black to-black p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Award size={18} className="text-[#ecb613]" />
                        <span className="font-syne text-sm font-bold uppercase text-[#ecb613]">
                          Pacto de los 100 Fundadores (Price-Match Vitalicio)
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={onboardingData.isFounderPactApplied}
                        onChange={(e) => setOnboardingData({ ...onboardingData, isFounderPactApplied: e.target.checked })}
                        className="h-5 w-5 accent-[#ecb613] cursor-pointer"
                      />
                    </div>

                    {onboardingData.isFounderPactApplied && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                        <div>
                          <label className="block font-mono text-xs text-white/60 mb-1">Portal Anterior Donde te Anuncias:</label>
                          <input
                            type="text"
                            placeholder="Bodas.net, Zankyou, Guía..."
                            value={onboardingData.portalAnterior}
                            onChange={(e) => setOnboardingData({ ...onboardingData, portalAnterior: e.target.value })}
                            className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-xs text-white/60 mb-1">Cuota Mensual Anterior (€/mes):</label>
                          <input
                            type="number"
                            min="50"
                            placeholder="250"
                            value={onboardingData.cuotaAnteriorEurMes}
                            onChange={(e) => setOnboardingData({ ...onboardingData, cuotaAnteriorEurMes: Number(e.target.value) })}
                            className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none font-mono"
                          />
                        </div>
                        <p className="text-[11px] font-mono text-[#ecb613] sm:col-span-2">
                          ✓ Al aprobarse la homologación técnica, tu cuota quedará igualada de por vida a {onboardingData.cuotaAnteriorEurMes} €/mes (0% IPC).
                        </p>
                      </div>
                    )}
                  </div>

                  {/* SECCIÓN 1: DATOS FISCALES Y DE CONTACTO */}
                  <div className="space-y-4">
                    <h3 className="font-syne text-base font-bold uppercase text-[#ecb613] flex items-center gap-2">
                      <Building2 size={16} /> 1. Datos Identificativos de la Finca
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-xs text-white/60 mb-1">Nombre Comercial de la Finca *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Finca Monte Real"
                          value={onboardingData.name}
                          onChange={(e) => setOnboardingData({ ...onboardingData, name: e.target.value })}
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-white/60 mb-1">Ubicación / Municipio *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: San Lorenzo de El Escorial (Madrid)"
                          value={onboardingData.location}
                          onChange={(e) => setOnboardingData({ ...onboardingData, location: e.target.value })}
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-white/60 mb-1">CIF / NIF de la Empresa *</label>
                        <input
                          type="text"
                          required
                          placeholder="B-12345678"
                          value={onboardingData.cif}
                          onChange={(e) => setOnboardingData({ ...onboardingData, cif: e.target.value })}
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-white/60 mb-1">Director o Wedding Planner Responsable *</label>
                        <input
                          type="text"
                          required
                          placeholder="Nombre y Apellidos"
                          value={onboardingData.director}
                          onChange={(e) => setOnboardingData({ ...onboardingData, director: e.target.value })}
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-white/60 mb-1">Teléfono Directo *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+34 600 000 000"
                          value={onboardingData.telefono}
                          onChange={(e) => setOnboardingData({ ...onboardingData, telefono: e.target.value })}
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-white/60 mb-1">Email de Contacto *</label>
                        <input
                          type="email"
                          required
                          placeholder="direccion@finca.es"
                          value={onboardingData.email}
                          onChange={(e) => setOnboardingData({ ...onboardingData, email: e.target.value })}
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECCIÓN 2: SEGURIDAD ELÉCTRICA Y RIDER */}
                  <div className="space-y-4 border-t border-white/10 pt-6">
                    <h3 className="font-syne text-base font-bold uppercase text-[#ecb613] flex items-center gap-2">
                      <Zap size={16} /> 2. Auditoría de Potencia Eléctrica
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-xs text-white/60 mb-1">Potencia Contratada Dedicada (kW) *</label>
                        <input
                          type="number"
                          min="5"
                          max="150"
                          value={onboardingData.potenciaKw}
                          onChange={(e) => setOnboardingData({ ...onboardingData, potenciaKw: Number(e.target.value) })}
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none font-mono"
                        />
                        <span className="text-[10px] font-mono text-white/40">Mínimo exigido: 15 kW trifásico</span>
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-white/60 mb-1">Toma Eléctrica en Zona de Baile *</label>
                        <select
                          value={onboardingData.tomaElectrica}
                          onChange={(e) => setOnboardingData({ ...onboardingData, tomaElectrica: e.target.value })}
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none font-mono cursor-pointer"
                        >
                          <option value="CETAC 32A 3P+N+T">CETAC 32A 3P+N+T (Recomendado)</option>
                          <option value="CETAC 16A 3P+N+T">CETAC 16A 3P+N+T (Válido)</option>
                          <option value="Schuko Convencional (Sin CETAC)">Schuko Convencional (Requiere Adaptación)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SECCIÓN 3: PÓLIZA DE RESPONSABILIDAD CIVIL */}
                  <div className="space-y-4 border-t border-white/10 pt-6">
                    <h3 className="font-syne text-base font-bold uppercase text-[#ecb613] flex items-center gap-2">
                      <ShieldCheck size={16} /> 3. Póliza de Responsabilidad Civil (RC)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-mono text-xs text-white/60 mb-1">Cobertura en Póliza (€) *</label>
                        <select
                          value={onboardingData.polizaRCEuros}
                          onChange={(e) => setOnboardingData({ ...onboardingData, polizaRCEuros: Number(e.target.value) })}
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none font-mono cursor-pointer"
                        >
                          <option value={150000}>150.000 € (Insuficiente)</option>
                          <option value={300000}>300.000 € (Mínimo Homologado)</option>
                          <option value={600000}>600.000 € (S-Class Platinum)</option>
                          <option value={1000000}>1.000.000 € (Corporativo)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-white/60 mb-1">Aseguradora *</label>
                        <input
                          type="text"
                          placeholder="Mapfre, Allianz, Zurich..."
                          value={onboardingData.aseguradora}
                          onChange={(e) => setOnboardingData({ ...onboardingData, aseguradora: e.target.value })}
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-white/60 mb-1">Nº de Póliza *</label>
                        <input
                          type="text"
                          placeholder="POL-RC-XXXXXX"
                          value={onboardingData.numeroPoliza}
                          onChange={(e) => setOnboardingData({ ...onboardingData, numeroPoliza: e.target.value })}
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECCIÓN 4: LOGÍSTICA DE ACCESO CONVOY */}
                  <div className="space-y-4 border-t border-white/10 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="font-syne text-sm font-bold uppercase text-white block">Acceso Convoy Logístico de 14 Plazas</span>
                        <p className="text-xs text-white/50 font-mono">¿Cuenta la finca con radio de giro y acceso despejado para furgoneta de producción y carga?</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={onboardingData.accesoConvoy14Plazas}
                        onChange={(e) => setOnboardingData({ ...onboardingData, accesoConvoy14Plazas: e.target.checked })}
                        className="h-5 w-5 accent-[#ecb613] cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingOnboarding}
                    className="w-full py-4 rounded-xl bg-[#ecb613] text-black font-mono text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-[#ecb613]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    <span>{submittingOnboarding ? 'Verificando con Servidor B2B...' : 'Validar Homologación Técnica (< 15 min)'}</span>
                  </button>

                </form>

                {/* RESULTADO DEL ONBOARDING */}
                {onboardingResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`rounded-2xl p-6 border space-y-4 ${
                      onboardingResult.resultadoAuditoria.aprobado
                        ? 'border-emerald-500/40 bg-emerald-950/30'
                        : 'border-[#FF2B44]/40 bg-rose-950/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {onboardingResult.resultadoAuditoria.aprobado ? (
                        <ShieldCheck className="text-emerald-400 shrink-0" size={28} />
                      ) : (
                        <AlertTriangle className="text-[#FF2B44] shrink-0" size={28} />
                      )}
                      <div>
                        <h4 className="font-syne text-base font-bold uppercase text-white">
                          {onboardingResult.resultadoAuditoria.aprobado
                            ? 'Finca Homologada Provisionalmente (SLA < 15 min superado)'
                            : 'Requiere Subsanación Técnica'}
                        </h4>
                        <p className="font-mono text-xs text-white/70">{onboardingResult.mensaje}</p>
                      </div>
                    </div>

                    {/* TARJETA DORADA DE PLAZA DE FUNDADOR ASIGNADA */}
                    {onboardingResult.pactoFundadores?.applied && (
                      <div className="rounded-xl border border-[#ecb613]/50 bg-gradient-to-r from-amber-950/40 via-black to-[#09090d] p-4 font-mono text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[#ecb613] font-bold uppercase flex items-center gap-1.5">
                            <Award size={15} /> Plaza de Fundador Reservada:
                          </span>
                          <strong className="text-white text-sm font-syne">
                            #{onboardingResult.pactoFundadores.founderSlotNumber} de 100
                          </strong>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-white/10">
                          <div>
                            <span className="text-zinc-400 block">Cuota Igualada Vitalicia:</span>
                            <span className="text-white font-bold">{onboardingResult.pactoFundadores.cuotaIgualadaEurMes} €/mes (0% IPC)</span>
                          </div>
                          <div>
                            <span className="text-zinc-400 block">Garantía Anti-Fuga:</span>
                            <span className="text-emerald-400 font-bold">0% Competidores en Ficha</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="font-mono text-[11px] text-white/50 border-t border-white/10 pt-2 flex justify-between">
                      <span>Expediente: {onboardingResult.expedicionId}</span>
                      <span>Puntuación Técnica: {onboardingResult.resultadoAuditoria.score}/100</span>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* AUDITORÍA ALGORÍTMICA EN TIEMPO REAL */}
              <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-[#09090d] p-6 space-y-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#ecb613] font-bold">
                    Score de Cumplimiento Técnico
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-syne text-5xl font-black text-white">{auditStatus.score}</span>
                    <span className="font-mono text-sm text-white/40">/ 100</span>
                  </div>
                </div>

                {/* BARRA DE PROGRESO */}
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      auditStatus.score >= 80 ? 'bg-emerald-400' : auditStatus.score >= 50 ? 'bg-[#ecb613]' : 'bg-[#FF2B44]'
                    }`}
                    style={{ width: `${auditStatus.score}%` }}
                  />
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Póliza RC (&ge; 300k €):</span>
                    {onboardingData.polizaRCEuros >= 300000 ? (
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Válida</span>
                    ) : (
                      <span className="text-[#FF2B44] flex items-center gap-1"><AlertTriangle size={12} /> Insuficiente</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Potencia (&ge; 15 kW):</span>
                    {onboardingData.potenciaKw >= 15 ? (
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Aprobada</span>
                    ) : (
                      <span className="text-[#FF2B44] flex items-center gap-1"><AlertTriangle size={12} /> Baja</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Toma CETAC:</span>
                    {onboardingData.tomaElectrica.includes('CETAC') ? (
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Normalizada</span>
                    ) : (
                      <span className="text-[#FF2B44] flex items-center gap-1"><AlertTriangle size={12} /> No CETAC</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Acceso 14 Plazas:</span>
                    {onboardingData.accesoConvoy14Plazas ? (
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Despejado</span>
                    ) : (
                      <span className="text-[#FF2B44] flex items-center gap-1"><AlertTriangle size={12} /> Restringido</span>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-black/40 border border-white/5 p-4 space-y-2">
                  <span className="font-mono text-[10px] uppercase text-[#ecb613] font-bold block">
                    Beneficio para la Finca Certificada
                  </span>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Al certificarse, su recinto se incluye en el directorio preferencial de novios con presupuesto cerrado y recibe el press kit 4K co-brandeado de Productora EAR para sus jornadas de puertas abiertas.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ── FOOTER B2B CORPORATIVO ── */}
      <footer className="border-t border-white/10 bg-[#070709] px-6 py-10 text-xs text-white/50 font-mono">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong className="text-white font-syne uppercase">Productora EAR B2B Partner Network</strong>
            <p>Soberanía técnica para fincas, recintos y wedding planners de la Zona Centro.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/empresarios" className="text-white hover:text-[#ecb613]">
              Canal Empresarios
            </Link>
            <span>•</span>
            <Link href="/artistas" className="text-white hover:text-[#ecb613]">
              Roster de Artistas
            </Link>
            <span>•</span>
            <a href="tel:+34693693048" className="text-[#ecb613]">
              +34 693 693 048
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
