'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  FileText,
  Lock,
  Cookie,
  Scale,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  X,
  BadgeCheck,
} from 'lucide-react';
import { z } from 'zod';
import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  LIMITE_B2G_LCSP_EUR,
  DEPOSITO_STRIPE_EUR,
  LIMITE_SPL_DB,
  SPLIT_SOBERANO,
} from '@/lib/constants/ear-os-ssot';
import {
  GLOBAL_SYSTEM_INVARIANTS,
  resolveEntityContext,
} from '@/lib/oraculo/entity-resolver';
import {
  executeEidasContract,
  executeWebhookN8n,
  type MultiRailExecutionResult,
} from '@/lib/compiler/multi-rail-execution';

export const LegalComplianceConfigSchema = z
  .object({
    cookieConsent: z.enum(['STRICT', 'STANDARD']),
    rgpdAuditPassed: z.boolean(),
    eidasReady: z.boolean(),
  })
  .strict();

function formatEur(amount: number): string {
  const [integer, decimals] = amount.toFixed(2).split('.');
  return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimals} €`;
}

export default function AdminLegalCompliancePage(): React.JSX.Element {
  const [cookieConsentStatus, setCookieConsentStatus] = useState<'STRICT' | 'STANDARD'>('STRICT');
  const [rgpdAuditPassed, setRgpdAuditPassed] = useState<boolean>(true);
  const [activeResult, setActiveResult] = useState<MultiRailExecutionResult | null>(null);
  const [showAuxiliary, setShowAuxiliary] = useState<boolean>(false);

  const handleTriggerEidas = () => {
    const res = executeEidasContract({
      eventId: `EIDAS-AUDIT-${Date.now().toString(36).toUpperCase()}`,
      clientName: 'Gobernanza Legal EAR OS',
      venue: 'Sede Productora EAR',
      eventDate: new Date().toISOString().slice(0, 10),
      grossEur: DEPOSITO_STRIPE_EUR,
      dimensionId: 'TESORERIA_SPLIT',
      entityContext: resolveEntityContext('legal-compliance', 'TESORERIA_SPLIT'),
      pepitaDeOro: 'Certificación eIDAS y RGPD con Hash Inmutable SHA-256',
      rawVision: 'Emisión de contrato marco de cumplimiento normativo y salvaguardas legales',
    });
    setActiveResult(res);
  };

  const handleTriggerN8n = async () => {
    const res = await executeWebhookN8n({
      eventId: `LEGAL-AUDIT-${Date.now().toString(36).toUpperCase()}`,
      clientName: 'Asesoría Jurídica EAR OS',
      venue: 'Sede Productora EAR',
      eventDate: new Date().toISOString().slice(0, 10),
      grossEur: 0,
      dimensionId: 'TESORERIA_SPLIT',
      entityContext: resolveEntityContext('legal-compliance', 'TESORERIA_SPLIT'),
      pepitaDeOro: 'Auditoría Legal Automatizada',
      rawVision: 'Despacho de informe de cumplimiento legal y cookies hacia asesoría jurídica',
    });
    setActiveResult(res);
  };

  return (
    <div className="min-h-screen bg-[#030305] text-zinc-100 font-sans p-6 sm:p-10 space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin/compiler"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al Compilador CEO</span>
            </Link>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <Scale className="w-3.5 h-3.5" />
            <span>Módulo de Gobernanza Legal, RGPD &amp; Políticas</span>
          </div>
          <h1 className="font-[family-name:var(--font-src-syne)] font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
            Consola Jurídica &amp; Cumplimiento Normativo
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-3xl">
            Aislamiento estricto de controles de cookies, contratos de adhesión, marco de privacidad y salvaguardas legales de Productora EAR.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleTriggerEidas}
            className="px-4 py-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 font-mono text-xs font-bold text-cyan-300 hover:bg-cyan-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Emitir Contrato eIDAS</span>
          </button>
          <button
            onClick={handleTriggerN8n}
            className="px-4 py-2 rounded-xl border border-amber-500/40 bg-amber-950/40 font-mono text-xs font-bold text-amber-300 hover:bg-amber-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Despachar Asesoría n8n</span>
          </button>
          <Link
            href="/aviso-legal"
            target="_blank"
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 font-mono text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
          >
            <span>Ver Aviso Legal Público</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/cookies"
            target="_blank"
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 font-mono text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
          >
            <span>Ver Política de Cookies</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid de Controles Legales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Panel 1: Política de Cookies y Consentimiento */}
        <div className="rounded-3xl bg-[#09090d]/90 border border-white/10 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-[#ecb613] uppercase flex items-center gap-1.5">
                <Cookie className="w-4 h-4" /> Cookies &amp; Rastreo AEPD
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Guía 2024 Cumplida
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Gestor de Consentimiento Cero-Terceros
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No se inyectan cookies de terceros sin consentimiento explícito. Solo cookies técnicas estrictamente necesarias para la sesión y el carrito.
            </p>
          </div>

          <div className="space-y-3 pt-3 border-t border-white/5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">Modo de Consentimiento:</span>
              <button
                type="button"
                onClick={() => setCookieConsentStatus(cookieConsentStatus === 'STRICT' ? 'STANDARD' : 'STRICT')}
                className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/15 text-white font-bold hover:border-[#ecb613]"
              >
                {cookieConsentStatus}
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Bloqueo previo verificado en middleware.ts</span>
            </div>
          </div>
        </div>

        {/* Panel 2: Invariantes Jurídicos de Contratación */}
        <div className="rounded-3xl bg-[#09090d]/90 border border-white/10 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                <Scale className="w-4 h-4" /> Contratación Pública B2G
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                Ley 9/2017 LCSP
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Mamparo del Contrato Menor (Art. 118)
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Techo preventivo infranqueable en {formatEur(AJUSTE_PREVENTIVO_B2G_EUR)} para evitar nulidad de pleno derecho por fraccionamiento contractual (límite: {formatEur(LIMITE_B2G_LCSP_EUR)}).
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-white/5 text-xs font-sans text-zinc-300">
            <div className="flex items-center justify-between font-mono">
              <span className="text-zinc-400">Techo Seguro:</span>
              <span className="text-cyan-400 font-bold">{formatEur(AJUSTE_PREVENTIVO_B2G_EUR)}</span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-zinc-400">Depósito Stripe Price-Lock:</span>
              <span className="text-[#ecb613] font-bold">{formatEur(DEPOSITO_STRIPE_EUR)}</span>
            </div>
          </div>
        </div>

        {/* Panel 3: Cumplimiento RGPD & Confort Acústico */}
        <div className="rounded-3xl bg-[#09090d]/90 border border-white/10 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Normativa Ambiental &amp; RGPD
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Ley 37/2003
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Límites Acústicos &amp; Derechos ARCO
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Insonorización certificada de fincas por debajo de {LIMITE_SPL_DB} dB SPL. Protocolo de atención para cancelación y acceso de datos personales en &lt; 24h.
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-white/5 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Certificado acústico activo en Otzarreta</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Delegado de Protección de Datos canalizado a centralita</span>
            </div>
          </div>
        </div>
      </div>

      {/* VISTA PLEGABLE: HERRAMIENTAS SECUNDARIAS Y PÓLIZAS */}
      <div className="rounded-3xl bg-[#09090d]/60 border border-white/10 overflow-hidden">
        <button
          onClick={() => setShowAuxiliary(!showAuxiliary)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-syne text-white uppercase">
                Herramientas Secundarias, Pólizas de Responsabilidad Civil &amp; DPO
              </h4>
              <p className="text-xs text-zinc-400 font-mono">
                Póliza RC 1.000.000 €, salvaguardas eIDAS y canal de atención al cliente
              </p>
            </div>
          </div>
          {showAuxiliary ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
        </button>

        {showAuxiliary && (
          <div className="p-6 pt-0 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-zinc-300">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase">Póliza RC General</span>
              <p className="text-white font-bold">1.000.000 € Cobertura B2G / Eventos</p>
              <p className="text-zinc-400 text-[11px]">Seguro de responsabilidad civil en regla para contrataciones públicas.</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase">Canal de Notificaciones DPO</span>
              <p className="text-white font-bold">+34 693 693 048 (24/7)</p>
              <p className="text-zinc-400 text-[11px]">Canal canónico para solicitudes ARCO y rectificación de datos personales.</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase">Firma Digital &amp; Hash</span>
              <p className="text-emerald-400 font-bold">eIDAS SHA-256 Validado</p>
              <p className="text-zinc-400 text-[11px]">Inmutabilidad contractual en cada presupuesto generado por el sistema.</p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE RESULTADO MULTI-RAIL */}
      {activeResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
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

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                <span className="text-zinc-400">Artefacto:</span>
                <span className="text-white font-bold">{activeResult.filename}</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-zinc-500 text-[10px] block">SELLO SHA-256</span>
                <span className="text-[#ecb613] text-[11px] break-all">{activeResult.sha256}</span>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-400 text-[11px]">Payload / Contenido:</span>
                <pre className="p-3 rounded-xl bg-black border border-zinc-900 text-[11px] text-zinc-300 overflow-x-auto max-h-48 font-mono">
                  {activeResult.previewContent}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
