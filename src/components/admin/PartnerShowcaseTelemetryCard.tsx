'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Crown,
  ExternalLink,
  Eye,
  UtensilsCrossed,
  MapPin,
  Lock,
  MessageCircle,
  CalendarCheck,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import {
  getEzkertzaVenueSnapshot,
  type VenueShowcaseSnapshot
} from '@/lib/analytics/venue-showcase-telemetry';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * TARJETA EJECUTIVA — ESCAPARATE FLAGSHIP EZKERTZA BERRIA (Eduardo · Derio)
 * ════════════════════════════════════════════════════════════════════════════
 * El CEO audita en `/admin` EXACTAMENTE las mismas cifras que Eduardo ve en su
 * ficha `/otzarreta`. Una sola fuente: `getEzkertzaVenueSnapshot()`.
 *
 * Honestidad estructural (AF-1/AF-2): lo auditado se declara auditado y lo que
 * produce el navegador se declara como contador local. Aquí no se maquilla una
 * cifra de campo como si fuera tiempo real del servidor.
 *
 * Se hidrata en `useEffect` para no leer `localStorage` durante el SSR
 * (evita desajuste de hidratación y mantiene el render estático del dashboard).
 * ════════════════════════════════════════════════════════════════════════════
 */
interface PartnerShowcaseTelemetryCardProps {
  /** Destino del enlace "Ver ficha" (ficha pública o detalle del propio dashboard). */
  detailHref?: string;
}

export function PartnerShowcaseTelemetryCard({
  detailHref = '/otzarreta#ficha-ezkertza-derio'
}: PartnerShowcaseTelemetryCardProps): React.JSX.Element {
  const [snapshot, setSnapshot] = useState<VenueShowcaseSnapshot | null>(null);

  useEffect(() => {
    setSnapshot(getEzkertzaVenueSnapshot());
  }, []);

  const live = snapshot?.live ?? null;
  const metricasVivas: ReadonlyArray<{
    label: string;
    value: number | null;
    icon: typeof Eye;
  }> = [
    { label: 'Visitas', value: live ? live.views : null, icon: Eye },
    { label: 'Menús 2026', value: live ? live.simulator_interactions : null, icon: UtensilsCrossed },
    { label: 'Ruta Bilbao', value: live ? live.map_route_clicks : null, icon: MapPin },
    { label: 'Visitas técnicas', value: live ? live.visit_requests : null, icon: CalendarCheck },
    { label: 'Bloqueos 100 €', value: live ? live.deposit_lock_clicks : null, icon: Lock },
    { label: 'WhatsApp', value: live ? live.whatsapp_concierge_clicks : null, icon: MessageCircle }
  ];

  return (
    <section
      aria-label="Telemetría del escaparate flagship Ezkertza Berria"
      className="w-full overflow-x-hidden rounded-3xl border border-[#ecb613]/25 bg-[#09090d]/80 backdrop-blur-md p-5 sm:p-6 space-y-5"
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613]">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Escaparate Flagship · Aliado Estratégico Bizkaia
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {snapshot ? snapshot.venueName : 'Restaurante Ezkertza Berria'}
            </h2>
            <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
              Propietario: {snapshot ? snapshot.proprietorName : 'Eduardo'} ·{' '}
              {snapshot ? snapshot.municipiosCubiertosCount : '—'} municipios ·{' '}
              {snapshot ? snapshot.landingsPropietariasCount : '—'} landings exclusivas
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase tracking-wider inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" />
            {snapshot ? snapshot.provenance.mode : 'SIN_EVIDENCIA'}
          </span>
          <Link
            href={detailHref}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#ecb613]/50 transition-all text-[10px] font-mono uppercase tracking-wider inline-flex items-center gap-1.5"
          >
            Ver ficha <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-white/10 bg-[#030305] p-3.5">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            <Award className="w-3.5 h-3.5 text-[#ecb613]" /> Landings propias
          </div>
          <p className="text-xl font-bold font-mono text-white mt-1.5">
            {snapshot ? snapshot.landingsPropietariasCount : '—'}
          </p>
          <p className="text-[10px] text-zinc-600 mt-0.5">Exclusividad sin competidores</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#030305] p-3.5">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            <TrendingUp className="w-3.5 h-3.5 text-[#00E5FF]" /> URLs pSEO red
          </div>
          <p className="text-xl font-bold font-mono text-white mt-1.5">
            {snapshot ? snapshot.redGlobalUrlsPseo.toLocaleString('es-ES') : '—'}
          </p>
          <p className="text-[10px] text-zinc-600 mt-0.5">Indexación soberana activa</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#030305] p-3.5">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            <Eye className="w-3.5 h-3.5 text-[#FF2B44]" /> Sesiones auditadas
          </div>
          <p className="text-xl font-bold font-mono text-white mt-1.5">
            {snapshot ? snapshot.redGlobalSesionesAuditadas.toLocaleString('es-ES') : '—'}
          </p>
          <p className="text-[10px] text-zinc-600 mt-0.5">Microsoft Clarity · campo</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#030305] p-3.5">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Red proveedores
          </div>
          <p className="text-xl font-bold font-mono text-white mt-1.5">
            {snapshot ? snapshot.redGlobalProveedores.toLocaleString('es-ES') : '—'}
          </p>
          <p className="text-[10px] text-zinc-600 mt-0.5">Catálogo Edge verificado</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#030305] p-3.5">
        <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2.5">
          Contador de este navegador (no es tráfico de servidor)
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {metricasVivas.map((metrica) => {
            const Icono = metrica.icon;
            return (
              <div
                key={metrica.label}
                className="rounded-xl border border-white/5 bg-white/[0.02] px-2.5 py-2"
              >
                <Icono className="w-3.5 h-3.5 text-zinc-400" />
                <p className="text-sm font-mono font-bold text-white mt-1">
                  {metrica.value === null ? '—' : metrica.value.toLocaleString('es-ES')}
                </p>
                <p className="text-[9px] font-mono uppercase tracking-wider text-zinc-600 leading-tight">
                  {metrica.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 border-t border-white/10 pt-3">
        <p className="text-[10px] font-mono text-zinc-500">
          {snapshot ? snapshot.provenance.baseAuditada : 'Base auditada pendiente de hidratación'}
        </p>
        <p className="text-[10px] font-mono text-zinc-600">
          {snapshot ? snapshot.ahorroComisionesCompetenciaAnual : ''}
        </p>
      </div>
    </section>
  );
}

export default PartnerShowcaseTelemetryCard;
