'use client';

import React, { useState } from 'react';
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
  Truck
} from 'lucide-react';
import { SCLASS_12_FINCAS_HOMOLOGADAS, FincaHomologada } from '@/lib/constants/fincas-catalog';
import { calculateB2BCommission, simulateAnnualAffiliateIncome, calculateSevenBusinessDaysDueDate } from '@/lib/b2b-billing-engine';
import { CENTRALITA } from '@/lib/phone-constants';

type PortalView = 'CATALOGO_12_FINCAS' | 'SIMULADOR_AFILIACION' | 'ONBOARDING_EXPRESS_15MIN';

export default function FincasB2BPortal() {
  const [activeView, setActiveView] = useState<PortalView>('CATALOGO_12_FINCAS');
  
  // Filtros de Catálogo
  const [provinciaFilter, setProvinciaFilter] = useState<string>('Todas');
  const [selectedFinca, setSelectedFinca] = useState<FincaHomologada | null>(null);

  // Estados del Simulador de Comisiones
  const [eventTicket, setEventTicket] = useState<number>(3800);
  const [commissionRate, setCommissionRate] = useState<number>(0.12);
  const [annualEventsCount, setAnnualEventsCount] = useState<number>(20);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState<boolean>(false);
  const [generatedDraft, setGeneratedDraft] = useState<any>(null);

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
    accesoConvoy14Plazas: true
  });
  const [onboardingResult, setOnboardingResult] = useState<any>(null);
  const [submittingOnboarding, setSubmittingOnboarding] = useState<boolean>(false);

  // Cálculos reactivos
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
        setGeneratedDraft(data.draft);
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
        body: JSON.stringify(onboardingData)
      });
      const result = await res.json();
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
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="text-[#ecb613] font-bold uppercase tracking-wider truncate">Nodo B2B Empresas & Fincas</span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="hidden sm:inline">12 Fincas Clave Homologadas</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[10px] sm:text-[11px]">
            <span>SLA: <strong className="text-white">&lt; 15 min</strong></span>
            <span>Liquidación: <strong className="text-white">&le; 7 días</strong></span>
            <span>Comisión: <strong className="text-emerald-400">10% - 15%</strong></span>
          </div>
        </div>
      </aside>

      {/* ── HERO BANNER CINEMÁTICO ── */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-10 border-b border-white/10">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[450px] w-[800px] max-w-full bg-gradient-radial from-[#ecb613]/10 via-[#258DCD]/5 to-transparent blur-[120px]" />

        <div className="relative mx-auto max-w-7xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[#ecb613] max-w-full truncate">
            <Sparkles size={12} className="shrink-0" />
            <span className="truncate">Bloque 5 SSOT · Red de Afiliación & Homologación de Fincas</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-syne text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-[0.98] break-words">
                No perseguimos espacios.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">
                  Los auditamos y remuneramos.
                </span>
              </h1>
              <p className="text-white/70 text-sm sm:text-base max-w-3xl leading-relaxed">
                Acceso exclusivo para directores de recintos y wedding planners. Comisión transparente de <strong>380 € a 570 € netos por boda cerrada</strong> (10% al 15% del suelo nupcial), autofacturación legal y liquidación bancaria garantizada en un máximo de 7 días hábiles.
              </p>
            </div>

            {/* METRIC BADGE CARD */}
            <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-[#09090d] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs uppercase text-white/50">Umbral Técnico Inmutable</span>
                <span className="rounded-full bg-[#ecb613] px-2 py-0.5 font-mono text-[9px] font-black text-black uppercase">SSOT</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center font-mono">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-lg font-black text-[#ecb613] block">300.000 €</span>
                  <span className="text-[10px] text-white/40 uppercase">Póliza RC Mín.</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-lg font-black text-[#AAD6CD] block">CETAC 32A</span>
                  <span className="text-[10px] text-white/40 uppercase">Trifásico Oblig.</span>
                </div>
              </div>
              <div className="text-[11px] font-mono text-white/50 text-center">
                Protección contra multas acústicas y caídas de tensión.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SELECTOR DE MODO / VISTAS PRINCIPALES ── */}
      <nav aria-label="Navegación del portal de fincas" className="sticky top-0 z-40 border-b border-white/10 bg-[#050507]/90 backdrop-blur-xl px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('CATALOGO_12_FINCAS')}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeView === 'CATALOGO_12_FINCAS'
                  ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Building2 size={14} />
              <span>12 Fincas Homologadas</span>
            </button>

            <button
              onClick={() => setActiveView('SIMULADOR_AFILIACION')}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeView === 'SIMULADOR_AFILIACION'
                  ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Percent size={14} />
              <span>Simulador de Comisiones & Autofactura</span>
            </button>

            <button
              onClick={() => setActiveView('ONBOARDING_EXPRESS_15MIN')}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeView === 'ONBOARDING_EXPRESS_15MIN'
                  ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Clock size={14} />
              <span>Onboarding Express &lt; 15 min</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${CENTRALITA.display}`}
              className="text-xs font-mono text-white/50 hover:text-[#ecb613] flex items-center gap-1.5"
            >
              <Phone size={12} className="text-[#ecb613]" />
              <span>Centralita B2B: {CENTRALITA.display}</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ── CUERPO DINÁMICO SEGÚN VISTA SELECCIONADA ── */}
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        
        {/* ═══════════════════════════════════════════════════════ */}
        {/* VISTA 1: CATÁLOGO DE LAS 12 FINCAS HOMOLOGADAS */}
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
              {filteredFincas.map((finca, idx) => (
                <div
                  key={finca.id}
                  className="rounded-3xl border border-white/10 bg-[#09090d] p-6 flex flex-col justify-between space-y-6 hover:border-[#ecb613]/50 transition-all group"
                >
                  <div className="space-y-4">
                    {/* Header Card */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#AAD6CD]/10 border border-[#AAD6CD]/30 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#AAD6CD] flex items-center gap-1">
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
                        <span className="flex items-center gap-1.5"><Volume2 size={12} className="text-[#AAD6CD]" /> Sonometría:</span>
                        <strong className="text-[#AAD6CD]">{finca.limiteAcustico.interiorDBA} dBA int. / {finca.limiteAcustico.exteriorDBA} dBA ext.</strong>
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
        {/* VISTA 2: SIMULADOR DE COMISIONES & AUTOFACTURA B2B */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeView === 'SIMULADOR_AFILIACION' && (
          <div className="space-y-12">
            
            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#ecb613] font-bold">
                Transparencia Algorítmica & Cash-Flow B2B
              </span>
              <h2 className="font-syne text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                Simulador de Comisiones Cruzadas
              </h2>
              <p className="text-white/60 text-base leading-relaxed">
                Sin acuerdos verbales ni esperas de fin de temporada. Calcule el retorno directo de referenciar Productora EAR en su finca o agencia y compruebe el SLA inviolable de liquidación en 7 días hábiles.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* CONTROLES DEL SIMULADOR */}
              <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#09090d] p-6 md:p-8 space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="font-syne text-lg font-bold uppercase text-white">Parámetros del Evento</h3>
                  <p className="font-mono text-xs text-white/50">Ajuste el ticket y el porcentaje conveniado</p>
                </div>

                {/* Slider Ticket Nupcial */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-white/70">Ticket de Contratación EAR:</span>
                    <span className="text-[#ecb613] font-bold text-base">{eventTicket.toLocaleString('es-ES')} €</span>
                  </div>
                  <input 
                    type="range" 
                    min="3800" 
                    max="14990" 
                    step="100"
                    value={eventTicket} 
                    onChange={(e) => setEventTicket(Number(e.target.value))}
                    className="w-full accent-[#ecb613] cursor-pointer"
                  />
                  <div className="flex justify-between font-mono text-[10px] text-white/40">
                    <span>Suelo Boda (3.800 €)</span>
                    <span>Diamond 360 (7.500 €)</span>
                    <span>Festival / Gala (14.990 €)</span>
                  </div>
                </div>

                {/* Selección de Comisión (10%, 12%, 15%) */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs text-white/70">Porcentaje de Comisión Homologado:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { rate: 0.10, label: '10% (Silver)' },
                      { rate: 0.12, label: '12% (Partner)' },
                      { rate: 0.15, label: '15% (Exclusivo)' }
                    ].map((btn) => (
                      <button
                        key={btn.rate}
                        onClick={() => setCommissionRate(btn.rate)}
                        className={`rounded-xl py-2.5 font-mono text-xs font-bold transition-all cursor-pointer ${
                          commissionRate === btn.rate
                            ? 'bg-[#ecb613] text-black shadow-md'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bodas al Año para Proyección */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-white/70">Eventos Referenciados al Año:</span>
                    <span className="text-white font-bold text-base">{annualEventsCount} bodas/año</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="60" 
                    step="1"
                    value={annualEventsCount} 
                    onChange={(e) => setAnnualEventsCount(Number(e.target.value))}
                    className="w-full accent-[#AAD6CD] cursor-pointer"
                  />
                  <div className="flex justify-between font-mono text-[10px] text-white/40">
                    <span>Mín. Exclusividad (10)</span>
                    <span>Promedio Finca (25)</span>
                    <span>Gran Recinto (50+)</span>
                  </div>
                </div>

                {/* BOTÓN GENERAR AUTOFACTURA PREVIEW */}
                <button
                  onClick={handleGenerateInvoicePreview}
                  disabled={isGeneratingInvoice}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ecb613] to-amber-400 text-black font-mono text-xs font-black uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20 cursor-pointer disabled:opacity-50"
                >
                  <FileText size={16} />
                  <span>{isGeneratingInvoice ? 'Calculando Hash SHA-256...' : 'Generar Borrador de Autofactura'}</span>
                </button>
              </div>

              {/* RESULTADOS Y LIQUIDACIÓN EN VIVO */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* TARJETA DE IMPACTO UNITARIO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-6 space-y-2">
                    <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider block">
                      Comisión Neta por Evento
                    </span>
                    <div className="font-syne text-4xl font-black text-white">
                      {commissionCalc.comisionNeta.toFixed(2)} €
                    </div>
                    <p className="font-mono text-[11px] text-white/50">
                      Total con 21% IVA: <strong>{commissionCalc.comisionConIva.toFixed(2)} €</strong>
                    </p>
                  </div>

                  <div className="rounded-3xl border border-[#AAD6CD]/30 bg-[#081226]/40 p-6 space-y-2">
                    <span className="font-mono text-xs text-[#AAD6CD] uppercase tracking-wider block">
                      Retorno Anual Estimado
                    </span>
                    <div className="font-syne text-4xl font-black text-white">
                      {annualProjection.ingresoNetoAnualFinca.toLocaleString('es-ES')} €
                    </div>
                    <p className="font-mono text-[11px] text-white/50">
                      Promedio de <strong>{annualProjection.ingresoMensualPromedio.toFixed(2)} €/mes</strong> pasivos.
                    </p>
                  </div>
                </div>

                {/* COMPROMISO SLA 7 DÍAS */}
                <div className="rounded-3xl border border-white/10 bg-[#09090d] p-6 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="flex items-center gap-2 text-white/80">
                      <Clock size={15} className="text-[#ecb613]" />
                      <strong>Protocolo de Liquidación Automática EAR OS</strong>
                    </span>
                    <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                      SLA Inviolable
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px]">
                    <div>
                      <span className="text-white/40 block">Días Hábiles:</span>
                      <strong className="text-white">7 Días Máximo</strong>
                    </div>
                    <div>
                      <span className="text-white/40 block">Vencimiento Próximo:</span>
                      <strong className="text-[#ecb613]">{dueDateSLA}</strong>
                    </div>
                    <div>
                      <span className="text-white/40 block">Método de Pago:</span>
                      <strong className="text-white">Transferencia SEPA Inm.</strong>
                    </div>
                  </div>
                </div>

                {/* PREVIEW DEL BORRADOR DE AUTOFACTURA */}
                {generatedDraft && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-[#ecb613]/40 bg-black p-6 space-y-4 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[#ecb613] font-bold block">{generatedDraft.numeroFactura}</span>
                        <span className="text-white/50 text-[10px]">Autofactura Mercantil Emitida por Productora EAR</span>
                      </div>
                      <span className="rounded-full bg-[#ecb613]/20 text-[#ecb613] border border-[#ecb613]/40 px-3 py-1 text-[10px] font-bold">
                        Vencimiento: {generatedDraft.fechaVencimientoSLA7Dias}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[11px]">
                      <div>
                        <span className="text-white/40 block uppercase text-[9px]">Emisor Pagador:</span>
                        <strong className="text-white">{generatedDraft.emisorEAR.razonSocial}</strong>
                        <p className="text-white/50">{generatedDraft.emisorEAR.cif} • {generatedDraft.emisorEAR.hubLogistico}</p>
                      </div>
                      <div>
                        <span className="text-white/40 block uppercase text-[9px]">Receptor Beneficiario:</span>
                        <strong className="text-white">{generatedDraft.receptorPartner.razonSocial}</strong>
                        <p className="text-white/50">CIF: {generatedDraft.receptorPartner.cif} • IBAN: {generatedDraft.receptorPartner.iban.slice(0, 8)}****</p>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-3 space-y-1.5 text-[11px]">
                      <div className="flex justify-between text-white/70">
                        <span>Base Imponible Comisión B2B:</span>
                        <span>{generatedDraft.desgloseEconomico.baseImponibleComision.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>IVA Devengado (21%):</span>
                        <span>{generatedDraft.desgloseEconomico.cuotaIva21.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-[#ecb613] border-t border-white/10 pt-2">
                        <span>Total Líquido a Transferir:</span>
                        <span>{generatedDraft.desgloseEconomico.totalAPagarEnCuenta.toFixed(2)} €</span>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-white/40 gap-1">
                      <span className="truncate max-w-full">Firma de Integridad: {generatedDraft.hashIntegridadSha256}</span>
                      <span className="text-emerald-400 shrink-0">SLA 7 Días Hábiles Activo</span>
                    </div>
                  </motion.div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* VISTA 3: ONBOARDING EXPRESS < 15 MINUTOS */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeView === 'ONBOARDING_EXPRESS_15MIN' && (
          <div className="space-y-12">
            
            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#ecb613] font-bold">
                Homologación Sin Fricción B2B
              </span>
              <h2 className="font-syne text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                Onboarding Express &lt; 15 Minutos
              </h2>
              <p className="text-white/60 text-base leading-relaxed">
                Rellene los datos de su espacio o finca. El motor algorítmico auditará los umbrales de seguridad (RC &ge; 300.000 € y acometida CETAC 32A/16A) y emitirá su dictamen de certificación técnica de inmediato.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* FORMULARIO DE ONBOARDING */}
              <div className="lg:col-span-8 rounded-3xl border border-white/10 bg-[#09090d] p-6 md:p-10 space-y-8">
                
                <form onSubmit={handleSubmitOnboarding} className="space-y-6">
                  
                  {/* SECCIÓN 1: DATOS FISCALES DEL ESPACIO */}
                  <div className="space-y-4">
                    <h3 className="font-syne text-base font-bold uppercase text-[#ecb613] flex items-center gap-2">
                      <Building2 size={16} /> 1. Datos del Espacio & Representación
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
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none font-mono"
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
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none font-mono"
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
                    className={`rounded-2xl p-6 border ${
                      onboardingResult.resultadoAuditoria.aprobado
                        ? 'border-emerald-500/40 bg-emerald-950/30'
                        : 'border-[#FF455B]/40 bg-rose-950/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {onboardingResult.resultadoAuditoria.aprobado ? (
                        <ShieldCheck className="text-emerald-400" size={28} />
                      ) : (
                        <AlertTriangle className="text-[#FF455B]" size={28} />
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
                    <div className="mt-3 font-mono text-[11px] text-white/50 border-t border-white/10 pt-2 flex justify-between">
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
                      auditStatus.score >= 80 ? 'bg-emerald-400' : auditStatus.score >= 50 ? 'bg-[#ecb613]' : 'bg-[#FF455B]'
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
                      <span className="text-[#FF455B] flex items-center gap-1"><AlertTriangle size={12} /> Insuficiente</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Potencia (&ge; 15 kW):</span>
                    {onboardingData.potenciaKw >= 15 ? (
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Aprobada</span>
                    ) : (
                      <span className="text-[#FF455B] flex items-center gap-1"><AlertTriangle size={12} /> Baja</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Toma CETAC:</span>
                    {onboardingData.tomaElectrica.includes('CETAC') ? (
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Normalizada</span>
                    ) : (
                      <span className="text-[#FF455B] flex items-center gap-1"><AlertTriangle size={12} /> No CETAC</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Acceso 14 Plazas:</span>
                    {onboardingData.accesoConvoy14Plazas ? (
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Despejado</span>
                    ) : (
                      <span className="text-[#FF455B] flex items-center gap-1"><AlertTriangle size={12} /> Restringido</span>
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
