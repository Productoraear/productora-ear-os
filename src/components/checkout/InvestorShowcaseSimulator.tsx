'use client';

import React, { useState } from 'react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  SAFE_LCSP_CEILING_EUR,
  SPLIT_SOBERANO,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';
import {
  useCart,
  CartItem,
  calculateHareNiemeyerSplit,
  computeCryptographicSha256,
  SovereignSettlementSplit,
} from '@/components/checkout/CartContext';
import {
  Play,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  HeartHandshake,
  DollarSign,
  Copy,
  Terminal,
  FileCheck2,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

/* ========================================================================== */
/* TIPOS Y CONTRATOS DEL MODO INVERSORES                                      */
/* ========================================================================== */

export type InvestorScenarioId = 'A' | 'B' | 'C';

export interface InvestorSimulationScenario {
  id: InvestorScenarioId;
  name: string;
  tagline: string;
  description: string;
  expectedTotalEur: number;
  expectedDepositEur: number;
  items: CartItem[];
  lcspCeilingCheck?: {
    compliant: boolean;
    ceilingEur: number;
    sroi: string;
  };
}

export interface SepaDispersionAccount {
  recipient: 'ARTISTAS_PROVIDERS' | 'EAR_OS_INFRASTRUCTURE' | 'VIMUME_FOUNDATION';
  recipientLabel: string;
  ibanMasked: string;
  bic: string;
  amountCents: number;
  amountEur: number;
  percentage: number;
  transferReference: string;
  bankName: string;
}

export interface InvestorSimulationResult {
  scenarioId: InvestorScenarioId;
  totalCents: number;
  depositCents: number;
  pendingCents: number;
  split: {
    providersCents: number;
    earOsCents: number;
    vimumeCents: number;
  };
  sepaDispersions: SepaDispersionAccount[];
  priceLockSha256: string;
  simulatedWebhookEvent: {
    id: string;
    type: 'checkout.session.completed';
    stripeSessionId: string;
    amountTotal: number;
    currency: 'eur';
    paymentStatus: 'paid';
    created: number;
  };
  durationMs: number;
}

/* ========================================================================== */
/* ESCENARIOS PREDEFINIDOS CANÓNICOS (F9)                                     */
/* ========================================================================== */

export const INVESTOR_SCENARIOS: readonly InvestorSimulationScenario[] = Object.freeze([
  {
    id: 'A',
    name: 'Escenario A: Boda Completa S-Class',
    tagline: 'Finca + Tenor Edwin Agudelo + Sonido Bose F1 + Catering Gourmet',
    description: 'Demostración de contratación colectiva multi-proveedor con liquidación automática y depósito Price-Lock.',
    expectedTotalEur: 5890.0,
    expectedDepositEur: DEPOSITO_STRIPE_EUR,
    items: [
      {
        id: 'finca-villa-escorial',
        name: 'Villa Escorial Park (Finca Señorial)',
        category: 'finca',
        providerId: 'prov-villa-escorial',
        providerName: 'Villa Escorial Park',
        unitPriceEur: 3200.0,
        priceEur: 3200.0,
        priceCents: 320000,
        quantity: 1,
        description: 'Exclusiva 1 boda por día, suites 30 pax y acometida CETAC 32A.',
      },
      {
        id: 'artista-edwin-agudelo',
        name: 'Edwin Agudelo · Tenor Solista de Gala',
        category: 'artista',
        providerId: 'prov-edwin-agudelo',
        providerName: 'Edwin Agudelo Tenor',
        unitPriceEur: TARIFA_BASE_SOLISTA_EUR, // 350.00 €
        priceEur: TARIFA_BASE_SOLISTA_EUR,
        priceCents: Math.round(TARIFA_BASE_SOLISTA_EUR * 100),
        quantity: 1,
        description: 'Voz lírica y repertorio de ópera con calibración acústica < 75 dB SPL.',
      },
      {
        id: 'sonido-bose-f1',
        name: 'Sistema Line Array Bose F1 Model 812 + Sub',
        category: 'sonido_audiovisual',
        providerId: 'prov-bose-f1',
        providerName: 'Bose Professional Audio',
        unitPriceEur: 450.0,
        priceEur: 450.0,
        priceCents: 45000,
        quantity: 1,
        description: '2.000 W RMS continuo y limitador telemático Cesva Ley 37/2003.',
      },
      {
        id: 'catering-eduardo-martinez',
        name: 'Brasa de Encina Catering Eduardo Martínez',
        category: 'catering_gastronomia',
        providerId: 'prov-eduardo-martinez',
        providerName: 'Eduardo Martínez Gourmet',
        unitPriceEur: 1890.0,
        priceEur: 1890.0,
        priceCents: 189000,
        quantity: 1,
        description: 'Showcooking en vivo al fuego de leña y bodega Méntrida.',
      },
    ],
  },
  {
    id: 'B',
    name: 'Escenario B: Gala Corporativa S-Class',
    tagline: 'Tenor Solista + Microfonía Shure Axient + Trío Aurora + Coordinación',
    description: 'Demostración de evento corporativo premium con inmunidad RF y facturación NIF desglosada.',
    expectedTotalEur: 1530.0,
    expectedDepositEur: DEPOSITO_STRIPE_EUR,
    items: [
      {
        id: 'artista-edwin-agudelo-corp',
        name: 'Edwin Agudelo · Tenor Solista',
        category: 'artista',
        providerId: 'prov-edwin-agudelo',
        providerName: 'Edwin Agudelo Tenor',
        unitPriceEur: TARIFA_BASE_SOLISTA_EUR, // 350.00 €
        priceEur: TARIFA_BASE_SOLISTA_EUR,
        priceCents: 35000,
        quantity: 1,
        description: 'Apertura lírica solemne con himnos y canción napolitana.',
      },
      {
        id: 'sonido-shure-axient',
        name: 'Pack Microfonía Inalámbrica Shure Axient Digital',
        category: 'sonido_audiovisual',
        providerId: 'prov-shure-axient',
        providerName: 'Shure Pro Audio',
        unitPriceEur: 90.0,
        priceEur: 90.0,
        priceCents: 9000,
        quantity: 1,
        description: 'Transmisión Quadversity inmune a interferencias RF.',
      },
      {
        id: 'artista-trio-aurora',
        name: 'Trío Aurora (Cuerdas & Piano)',
        category: 'artista',
        providerId: 'prov-trio-aurora',
        providerName: 'Trío Aurora',
        unitPriceEur: 600.0,
        priceEur: 600.0,
        priceCents: 60000,
        quantity: 1,
        description: 'Ensamble de cámara clásico para recepción de autoridades.',
      },
      {
        id: 'coordinacion-tecnica',
        name: 'Coordinación Técnica & Conserjería 360',
        category: 'coordinador_boda',
        providerId: 'prov-coordinacion-ear',
        providerName: 'EAR OS Event Management',
        unitPriceEur: 490.0,
        priceEur: 490.0,
        priceCents: 49000,
        quantity: 1,
        description: 'Regiduría en directo, sincronización de protocolo y control sonométrico.',
      },
    ],
  },
  {
    id: 'C',
    name: 'Escenario C: Licitación Municipal B2G VIMUME',
    tagline: 'Contrato Menor Art. 118 LCSP (< 14.250 €) + SROI 4.85x Certificado',
    description: 'Demostración de expediente municipal B2G con tope legal seguro y retorno social certificado.',
    expectedTotalEur: 14250.0,
    expectedDepositEur: DEPOSITO_STRIPE_EUR,
    lcspCeilingCheck: {
      compliant: true,
      ceilingEur: SAFE_LCSP_CEILING_EUR, // 14.250,00 €
      sroi: '4.85x',
    },
    items: [
      {
        id: 'vimume-intervencion-clinica',
        name: 'Intervención Neuroacústica VIMUME 40 Hz (Senior)',
        category: 'vimume',
        providerId: 'prov-vimume-neuro',
        providerName: 'Fundación VIMUME',
        unitPriceEur: 6500.0,
        priceEur: 6500.0,
        priceCents: 650000,
        quantity: 1,
        description: 'Estimulación gamma 40 Hz no invasiva para bienestar y memoria en centros senior.',
      },
      {
        id: 'artista-gran-ensamble',
        name: 'Gran Ensamble Sinfónico Mariachi / Lírico de Gala',
        category: 'artista',
        providerId: 'prov-ensamble-sinfonico',
        providerName: 'Orquesta Sinfónica Productora EAR',
        unitPriceEur: 5250.0,
        priceEur: 5250.0,
        priceCents: 525000,
        quantity: 1,
        description: 'Concierto institucional en plaza pública con aforo de 1.500 espectadores.',
      },
      {
        id: 'sonido-descentralizado-cesva',
        name: 'Sistema Sonorización Descentralizado Cesva LRF-05',
        category: 'sonido_audiovisual',
        providerId: 'prov-sonido-municipal',
        providerName: 'EAR Acoustic Engineering',
        unitPriceEur: 2500.0,
        priceEur: 2500.0,
        priceCents: 250000,
        quantity: 1,
        description: 'Sonometría telemática homologada Ley 37/2003 con telemetría en tiempo real.',
      },
    ],
  },
]);

/* ========================================================================== */
/* SIMULADOR ORÁCULO DE PAGO Y DISPERSIÓN SEPA                                */
/* ========================================================================== */

export function simulateInvestorCheckout(scenarioId: InvestorScenarioId): InvestorSimulationResult {
  const start = Date.now();
  const scenario = INVESTOR_SCENARIOS.find((s) => s.id === scenarioId) ?? INVESTOR_SCENARIOS[0];

  const totalCents = Math.round(scenario.expectedTotalEur * 100);
  const depositCents = Math.round(scenario.expectedDepositEur * 100);

  const providerBreakdownInput = scenario.items.map((i) => ({
    id: i.providerId ?? i.id,
    name: i.providerName ?? i.name,
    category: String(i.category),
    cents: i.priceCents ?? Math.round((i.priceEur ?? i.unitPriceEur) * 100),
  }));

  const split = calculateHareNiemeyerSplit(totalCents, depositCents, providerBreakdownInput);

  const transferRef = `TX-INVESTOR-${scenarioId}-${Date.now().toString(36).toUpperCase()}`;

  const sepaDispersions: SepaDispersionAccount[] = [
    {
      recipient: 'ARTISTAS_PROVIDERS',
      recipientLabel: 'Artistas & Proveedores Homologados',
      ibanMasked: 'ES91 2100 **** **** 8891',
      bic: 'CAIXESBBXXX',
      amountCents: split.providersTotalCents,
      amountEur: split.providersTotalCents / 100,
      percentage: 80,
      transferReference: `${transferRef}-ART`,
      bankName: 'CaixaBank Empresas',
    },
    {
      recipient: 'EAR_OS_INFRASTRUCTURE',
      recipientLabel: 'EAR OS Infraestructura & Plataforma',
      ibanMasked: 'ES34 0049 **** **** 4410',
      bic: 'BSCHESMMXXX',
      amountCents: split.earOsCents,
      amountEur: split.earOsCents / 100,
      percentage: 10,
      transferReference: `${transferRef}-EAR`,
      bankName: 'Banco Santander Corporate',
    },
    {
      recipient: 'VIMUME_FOUNDATION',
      recipientLabel: 'Fundación VIMUME Impacto Social',
      ibanMasked: 'ES76 0081 **** **** 1122',
      bic: 'BBSVESMMXXX',
      amountCents: split.vimumeCents,
      amountEur: split.vimumeCents / 100,
      percentage: 10,
      transferReference: `${transferRef}-VIM`,
      bankName: 'Banco Sabadell Tercer Sector',
    },
  ];

  const simulatedWebhookEvent = {
    id: `evt_sim_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    type: 'checkout.session.completed' as const,
    stripeSessionId: `cs_test_investor_${Date.now()}`,
    amountTotal: totalCents,
    currency: 'eur' as const,
    paymentStatus: 'paid' as const,
    created: Math.floor(Date.now() / 1000),
  };

  return {
    scenarioId,
    totalCents,
    depositCents: split.depositDeductedCents,
    pendingCents: split.pendingFinalSettlementCents,
    split: {
      providersCents: split.providersTotalCents,
      earOsCents: split.earOsCents,
      vimumeCents: split.vimumeCents,
    },
    sepaDispersions,
    priceLockSha256: split.priceLockSha256,
    simulatedWebhookEvent,
    durationMs: Date.now() - start,
  };
}

/* ========================================================================== */
/* COMPONENTE INTERACTIVO: InvestorShowcaseSimulator                          */
/* ========================================================================== */

export function InvestorShowcaseSimulator() {
  const { setItems, setIsOpen } = useCart();

  const [selectedScenarioId, setSelectedScenarioId] = useState<InvestorScenarioId>('A');
  const [simulationState, setSimulationState] = useState<'IDLE' | 'PROCESSING' | 'COMPLETED'>('IDLE');
  const [simulationResult, setSimulationResult] = useState<InvestorSimulationResult | null>(null);
  const [copiedSha, setCopiedSha] = useState<boolean>(false);
  const [cartLoaded, setCartLoaded] = useState<boolean>(false);

  const selectedScenario = INVESTOR_SCENARIOS.find((s) => s.id === selectedScenarioId) ?? INVESTOR_SCENARIOS[0];

  const handleRunSimulation = () => {
    setSimulationState('PROCESSING');
    setTimeout(() => {
      const res = simulateInvestorCheckout(selectedScenarioId);
      setSimulationResult(res);
      setSimulationState('COMPLETED');
    }, 450);
  };

  const handleCopySha = () => {
    if (!simulationResult) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(simulationResult.priceLockSha256);
      setCopiedSha(true);
      setTimeout(() => setCopiedSha(false), 2500);
    }
  };

  const handleLoadScenarioIntoCart = () => {
    setItems(selectedScenario.items);
    setCartLoaded(true);
    setIsOpen(true);
    setTimeout(() => setCartLoaded(false), 3000);
  };

  return (
    <div className="rounded-3xl border border-amber-400/30 bg-[#050507] p-6 sm:p-8 space-y-6 text-zinc-100 font-sans shadow-2xl">
      {/* Cabecera del Simulador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INVESTOR SHOWCASE MODE · DEMOSTRACIÓN TRANSACCIONAL EN VIVO</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold font-display text-white">
            Simulador de Liquidación y Dispersión SEPA Instantánea
          </h3>
          <p className="text-xs text-zinc-400 font-sans mt-1 max-w-2xl">
            Simula en tiempo real el cobro de la fianza Stripe Price-Lock (100 €), el disparo del webhook seguro,
            el reparto exacto Split 80/10/10 en céntimos enteros y la dispersión bancaria inmediata a 3 cuentas virtuales.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunSimulation}
          disabled={simulationState === 'PROCESSING'}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(236,182,19,0.4)] cursor-pointer whitespace-nowrap"
        >
          {simulationState === 'PROCESSING' ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Simulando Dispersión...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-zinc-950" />
              <span>Ejecutar Simulación en Vivo</span>
            </>
          )}
        </button>
      </div>

      {/* Selector de los 3 Escenarios Canónicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {INVESTOR_SCENARIOS.map((sc) => {
          const isSelected = selectedScenarioId === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => {
                setSelectedScenarioId(sc.id);
                setSimulationState('IDLE');
                setSimulationResult(null);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(236,182,19,0.15)]'
                  : 'border-white/10 bg-zinc-900/40 hover:bg-zinc-900/70 text-zinc-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono font-bold uppercase ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`}>
                    Escenario {sc.id}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {sc.expectedTotalEur.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                  </span>
                </div>
                <div className="text-xs font-bold text-zinc-100 font-display">{sc.name.split(':')[1] || sc.name}</div>
                <div className="text-[11px] text-zinc-400 font-sans mt-1 line-clamp-2">{sc.tagline}</div>
              </div>

              {sc.lcspCeilingCheck && (
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Art. 118 LCSP &lt; 14.250 € · SROI 4.85x</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desglose de Servicios del Escenario Seleccionado */}
      <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Servicios Incluidos en el Escenario {selectedScenario.id} ({selectedScenario.items.length})</span>
          </span>
          <button
            type="button"
            onClick={handleLoadScenarioIntoCart}
            className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{cartLoaded ? '¡Cargado en Carrito!' : 'Cargar en Carrito Real'}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          {selectedScenario.items.map((i) => (
            <div key={i.id} className="p-2.5 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center justify-between">
              <span className="text-zinc-300 truncate max-w-[70%]">{i.name}</span>
              <span className="text-white font-bold">{i.unitPriceEur.toFixed(2)} €</span>
            </div>
          ))}
        </div>
      </div>

      {/* RESULTADOS DE LA SIMULACIÓN EN VIVO */}
      {simulationResult && (
        <div className="space-y-6 pt-4 border-t border-white/10 animate-fade-in">
          {/* Fila de Métricas Financieras */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-4 rounded-xl bg-zinc-950 border border-white/10">
              <div className="text-zinc-400 text-[11px] uppercase">Total Contratación</div>
              <div className="text-lg font-bold text-white mt-1">
                {(simulationResult.totalCents / 100).toFixed(2)} €
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">{simulationResult.totalCents} céntimos enteros</div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/20">
              <div className="text-emerald-400 text-[11px] uppercase">Fianza Stripe Deducida</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">
                -{(simulationResult.depositCents / 100).toFixed(2)} €
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Price-Lock Bloqueado</div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-white/10">
              <div className="text-zinc-400 text-[11px] uppercase">Restante Liquidación</div>
              <div className="text-lg font-bold text-amber-400 mt-1">
                {(simulationResult.pendingCents / 100).toFixed(2)} €
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Día del Evento</div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-cyan-500/20">
              <div className="text-cyan-400 text-[11px] uppercase">Latencia de Ejecución</div>
              <div className="text-lg font-bold text-cyan-400 mt-1">
                {simulationResult.durationMs} ms
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Cálculo Determinista</div>
            </div>
          </div>

          {/* Tarjeta de Dispersión SEPA a las 3 Cuentas Virtuales */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-amber-400/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>Dispersión Bancaria SEPA Instantánea (Split Soberano 80 / 10 / 10)</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ejecución Inmediata Confirmada</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {simulationResult.sepaDispersions.map((acc) => (
                <div
                  key={acc.recipient}
                  className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-2 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      {acc.percentage}% Split
                    </span>
                    <span className="text-zinc-500 text-[10px]">{acc.bic}</span>
                  </div>

                  <div className="font-bold text-white text-sm font-sans">{acc.recipientLabel}</div>

                  <div className="text-xs text-zinc-400 space-y-0.5">
                    <div>IBAN: <strong className="text-zinc-200">{acc.ibanMasked}</strong></div>
                    <div>Banco: {acc.bankName}</div>
                    <div className="truncate text-[10px] text-zinc-500">Ref: {acc.transferReference}</div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between font-bold">
                    <span className="text-zinc-400">Importe Dispersado:</span>
                    <span className="text-emerald-400 text-sm">{acc.amountEur.toFixed(2)} €</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sello Criptográfico SHA-256 e Inspector de Webhook */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sello SHA-256 */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sello Criptográfico SHA-256 (Price-Lock)</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopySha}
                  className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedSha ? '¡Copiado!' : 'Copiar Hash'}</span>
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/5 text-[11px] text-zinc-300 break-all select-all font-mono">
                {simulationResult.priceLockSha256}
              </div>
              <div className="text-[10px] text-zinc-500">
                Hash canónico de 64 caracteres calculado sobre cuotas enteras y depósito.
              </div>
            </div>

            {/* Evento Webhook Stripe Simulado */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Evento Webhook Stripe Simulado</span>
                </span>
                <span className="text-emerald-400 text-[10px] font-bold">Status: 200 OK</span>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/5 text-[10px] text-zinc-300 font-mono overflow-x-auto space-y-0.5">
                <div>event: <span className="text-amber-300">"{simulationResult.simulatedWebhookEvent.type}"</span></div>
                <div>id: <span className="text-zinc-400">"{simulationResult.simulatedWebhookEvent.id}"</span></div>
                <div>session: <span className="text-zinc-400">"{simulationResult.simulatedWebhookEvent.stripeSessionId}"</span></div>
                <div>amount_total: <span className="text-emerald-400">{simulationResult.simulatedWebhookEvent.amountTotal}</span> ({simulationResult.totalCents / 100} €)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
