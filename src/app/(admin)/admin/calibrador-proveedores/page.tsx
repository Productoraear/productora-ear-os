"use client";

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Truck,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  X,
  ExternalLink,
  Sliders,
  Layers,
  Search,
} from 'lucide-react';
import { z } from 'zod';
import CalibratorProxyBoundary from '@/components/admin/CalibratorErrorBoundary';
import SClassVendorHistoricPriceShield from '@/components/vendor/SClassVendorHistoricPriceShield';
import {
  ROLE_METRICS,
  WEDDING_VENDOR_CATEGORIES,
  VENDOR_PRICE_POLICY,
  HISTORIC_PRICE_WINDOW_YEARS,
  HISTORIC_PRICE_ANNUAL_INCREASE_PCT,
  CDN_VENDOR_PARTITION_COUNT,
} from '@/lib/constants/macro-ecosystem-manifest';
import { MetricProvenanceBadge } from '@/components/admin/MetricProvenanceBadge';
import { staticMetric } from '@/lib/admin/metrics-provenance';
import {
  SAFE_LCSP_CEILING_EUR,
  LIMITE_B2G_LCSP_EUR,
  WATTS_PER_PAX,
  VAT_RATE,
} from '@/lib/constants/ear-os-ssot';
import {
  GLOBAL_SYSTEM_INVARIANTS,
  resolveEntityContext,
} from '@/lib/oraculo/entity-resolver';
import {
  executeWaybillLogistica,
  executeExportFacturae,
  executeEidasContract,
  type MultiRailExecutionResult,
} from '@/lib/compiler/multi-rail-execution';
import {
  CHRISTMAS_LIGHTING_PRODUCTS,
  CHRISTMAS_LIGHTING_CATEGORIES,
} from '@/data/luces-navidad';

/* ========================================================================== */
/* CONTRATO DE DATOS ZOD ESTRICTO (NIVEL 5)                                   */
/* ========================================================================== */

export const LightingEngineeringSchema = z
  .object({
    catalogReferencesCount: z.number(),
    selectedCategory: z.string(),
    totalPowerWatts: z.number(),
    recommendedPhase: z.enum(['MONOFASICA_230V', 'TRIFASICA_400V']),
    requiresSpecialTransport: z.boolean(),
    b2gLcspCompliant: z.boolean(),
    ceilingB2gEur: z.number(),
  })
  .strict();

export type LightingEngineering = z.infer<typeof LightingEngineeringSchema>;

export default function AdminCalibratorProxyPage(): React.ReactElement {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [activeResult, setActiveResult] = useState<MultiRailExecutionResult | null>(null);

  // Filtrado de referencias del catálogo 2026
  const filteredProducts = CHRISTMAS_LIGHTING_PRODUCTS.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Métricas eléctricas y técnicas derivadas
  const totalPowerWatts = filteredProducts.reduce((acc, p) => acc + (p.powerWatts ?? 0), 0);
  const requiresSpecialTransport = filteredProducts.some((p) => p.specialTransport);
  const recommendedPhase = totalPowerWatts > 10000 ? 'TRIFASICA_400V' : 'MONOFASICA_230V';

  // Validación estricta en runtime
  const validatedMetrics = LightingEngineeringSchema.parse({
    catalogReferencesCount: CHRISTMAS_LIGHTING_PRODUCTS.length,
    selectedCategory,
    totalPowerWatts,
    recommendedPhase,
    requiresSpecialTransport,
    b2gLcspCompliant: true,
    ceilingB2gEur: SAFE_LCSP_CEILING_EUR,
  });

  const handleWaybillLogistica = () => {
    const res = executeWaybillLogistica({
      eventId: `LUCES-FLEET-${Date.now().toString(36).toUpperCase()}`,
      clientName: 'Ayuntamiento / Coordinación Técnica Alumbrado',
      venue: 'Centro Urbano / Recinto Ferial',
      eventDate: new Date().toISOString().slice(0, 10),
      grossEur: 9500.0,
      dimensionId: 'PROVEEDORES_CATALOGO',
      entityContext: resolveEntityContext('luces-navidad-2026', 'PROVEEDORES_CATALOGO'),
      pepitaDeOro: `Rider Técnico Iluminación ${validatedMetrics.recommendedPhase} (${validatedMetrics.totalPowerWatts} W)`,
      rawVision: `Manifiesto de carga y waybill para ${filteredProducts.length} referencias de alumbrado monumental`,
    });
    setActiveResult(res);
  };

  const handleExportFacturae = () => {
    const res = executeExportFacturae({
      eventId: `B2G-LUCES-${Date.now().toString(36).toUpperCase()}`,
      clientName: 'Ayuntamiento de Toledo - Concejalía de Festejos',
      clientTaxId: 'P4516800E',
      venue: 'Toledo Casco Histórico',
      eventDate: new Date().toISOString().slice(0, 10),
      grossEur: 12800.0,
      dimensionId: 'B2G_AYUNTAMIENTOS',
      entityContext: resolveEntityContext('b2g-luces', 'B2G_AYUNTAMIENTOS'),
      pepitaDeOro: `Licitación Alumbrado Menor Art. 118 LCSP (< ${SAFE_LCSP_CEILING_EUR.toLocaleString('es-ES')} €)`,
      rawVision: `Facturae 3.2.2 oficial con códigos DIR3 para suministro e instalación de motivos navideños`,
    });
    setActiveResult(res);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out font-sans pb-16">
      <header className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[10px] font-mono text-[#ecb613] font-bold uppercase mb-3">
            🎛️ Gestión Delegada · Catálogo de Iluminación 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-syne text-white tracking-tight">
            Calibrador de Proveedores &amp; Catálogo
          </h1>
          <p className="text-sm text-zinc-400 font-light mt-2 max-w-2xl font-mono">
            {CHRISTMAS_LIGHTING_PRODUCTS.length} referencias normalizadas por esquema Zod • Potencia, acometida trifásica y pliegos LCSP (&lt; {SAFE_LCSP_CEILING_EUR.toLocaleString('es-ES')} €).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleWaybillLogistica}
            className="px-4 py-2 rounded-xl bg-orange-500/15 border border-orange-500/40 text-orange-300 hover:text-white text-xs font-mono font-bold flex items-center gap-2 transition-all"
          >
            <Truck className="w-4 h-4 text-orange-400" />
            <span>Waybill Logística A4</span>
          </button>

          <button
            type="button"
            onClick={handleExportFacturae}
            className="px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-mono font-bold flex items-center gap-2 transition-all"
          >
            <FileCheck className="w-4 h-4 text-purple-400" />
            <span>Facturae 3.2.2 B2G</span>
          </button>
        </div>
      </header>

      {/* KPI ROW: INGENIERÍA ELÉCTRICA Y LICITACIÓN LCSP */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 font-mono">
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm">
          <span className="text-xs text-zinc-400 block uppercase">Referencias Activas</span>
          <div className="text-2xl font-bold text-white mt-1">
            {filteredProducts.length} / {CHRISTMAS_LIGHTING_PRODUCTS.length}
          </div>
          <span className="text-[10px] text-[#ecb613] mt-1 block">Esquema Transductivo Zod</span>
        </div>

        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm">
          <span className="text-xs text-zinc-400 block uppercase">Potencia Eléctrica Total</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {totalPowerWatts.toLocaleString('es-ES')} W
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">
            Acometida recomendada: <strong className="text-white">{validatedMetrics.recommendedPhase}</strong>
          </span>
        </div>

        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm">
          <span className="text-xs text-zinc-400 block uppercase">Logística &amp; Transporte</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">
            {requiresSpecialTransport ? 'Especial (Góndola)' : 'Estándar (Sprinter)'}
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">Flota Méntrida Km 0</span>
        </div>

        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm">
          <span className="text-xs text-zinc-400 block uppercase">Tope Preventivo B2G LCSP</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            &lt; {SAFE_LCSP_CEILING_EUR.toLocaleString('es-ES')} €
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">Art. 118 Contrato Menor</span>
        </div>
      </div>

      <CalibratorProxyBoundary />

      {/* TELEMETRÍA MULTI-ROL & BLINDAJE DE PRECIO HISTÓRICO */}
      <section className="space-y-6">
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-[0.3em] font-bold">
                TELEMETRÍA INDIVIDUAL POR ROL // {CDN_VENDOR_PARTITION_COUNT.toLocaleString('es-ES')} PROVEEDORES CDN
              </span>
              <MetricProvenanceBadge
                metric={staticMetric('calibrador_cdn_partition', 'Particiones CDN', CDN_VENDOR_PARTITION_COUNT, 'macro-ecosystem-manifest.ts', 'proveedores')}
                size="sm"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-syne text-white uppercase">
              Matriz de Métricas del Ecosistema
            </h2>
            <p className="text-xs text-zinc-400 max-w-2xl font-mono">
              Métricas de conversión, volumen de leads y retención tipadas por rol, consumidas
              directamente del manifest canónico (cero mocks quemados).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {ROLE_METRICS.map((metric) => (
              <div
                key={metric.role}
                className="rounded-2xl bg-white/5 border border-white/5 p-4 space-y-2.5 transition-all duration-300 hover:border-[#ecb613]/30 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white uppercase font-mono">
                    {metric.label}
                  </span>
                  <span className="text-[9px] font-mono text-[#ecb613] uppercase tracking-wider">
                    {metric.role}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
                  {metric.description}
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                  <div className="bg-black/40 rounded-xl p-2 text-center">
                    <div className="text-[9px] font-mono text-white/40 uppercase">Conversión</div>
                    <div className="text-sm font-black text-white font-syne">
                      {metric.conversionTargetPct}%
                    </div>
                  </div>
                  <div className="bg-black/40 rounded-xl p-2 text-center">
                    <div className="text-[9px] font-mono text-white/40 uppercase">Leads/mes</div>
                    <div className="text-sm font-black text-white font-syne">
                      {metric.leadVolumeBaseline}
                    </div>
                  </div>
                  <div className="bg-black/40 rounded-xl p-2 text-center">
                    <div className="text-[9px] font-mono text-white/40 uppercase">Retención</div>
                    <div className="text-sm font-black text-white font-syne">
                      {metric.retentionTargetPct}%
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {metric.kpiFocus.map((kpi) => (
                    <span
                      key={kpi}
                      className="px-2 py-0.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-[9px] font-mono uppercase"
                    >
                      {kpi}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-[0.3em] font-bold">
              BLINDAJE DE PRECIO HISTÓRICO // {VENDOR_PRICE_POLICY}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-syne text-white uppercase">
              Categorías Homologadas &amp; Sello de Precio Congelado
            </h2>
            <p className="text-xs text-zinc-400 max-w-2xl font-mono">
              Precio medio histórico de {HISTORIC_PRICE_WINDOW_YEARS} años con{' '}
              {HISTORIC_PRICE_ANNUAL_INCREASE_PCT}% de subida anual. Categorías del
              marketplace nupcial servidas por gremio en particiones CDN.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {WEDDING_VENDOR_CATEGORIES.map((category) => (
              <span
                key={category}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[10px] font-mono uppercase tracking-wider transition-all hover:border-[#ecb613]/40 hover:text-[#ecb613]"
              >
                {category}
              </span>
            ))}
          </div>

          <SClassVendorHistoricPriceShield
            category={WEDDING_VENDOR_CATEGORIES[0]}
            vendorName="Productora EAR · Proveedores Homologados"
            frozenSinceIso={new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString()}
          />
        </div>
      </section>

      {/* MODAL MULTI-RAIL ARTIFACT */}
      {activeResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
          <div className="w-full max-w-2xl bg-[#09090d] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold font-syne text-white uppercase tracking-wider">
                  {activeResult.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                <span className="text-zinc-400">Archivo:</span>
                <span className="text-white font-bold">{activeResult.filename}</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-zinc-500 text-[10px] block">SELLO SHA-256</span>
                <span className="text-[#ecb613] text-[11px] break-all">{activeResult.sha256}</span>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-400 text-[11px]">Vista Previa:</span>
                <pre className="p-3 rounded-xl bg-black border border-zinc-900 text-[11px] text-zinc-300 overflow-x-auto max-h-48 font-mono">
                  {activeResult.previewContent}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs transition-colors"
              >
                Cerrar
              </button>
              {activeResult.downloadUrl && (
                <a
                  href={activeResult.downloadUrl}
                  download={activeResult.filename}
                  className="px-4 py-2 rounded-xl bg-[#ecb613] hover:bg-[#d8a40f] text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
