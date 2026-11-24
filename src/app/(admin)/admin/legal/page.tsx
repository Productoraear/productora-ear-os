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
  ArrowLeft,
} from 'lucide-react';
import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  LIMITE_B2G_LCSP_EUR,
  DEPOSITO_STRIPE_EUR,
  LIMITE_SPL_DB,
} from '@/lib/constants/ear-os-ssot';

function formatEur(amount: number): string {
  const [integer, decimals] = amount.toFixed(2).split('.');
  return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimals} €`;
}

export default function AdminLegalCompliancePage(): React.JSX.Element {
  const [cookieConsentStatus, setCookieConsentStatus] = useState<'STRICT' | 'STANDARD'>('STRICT');
  const [rgpdAuditPassed, setRgpdAuditPassed] = useState<boolean>(true);

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

        <div className="flex items-center gap-3">
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
    </div>
  );
}
