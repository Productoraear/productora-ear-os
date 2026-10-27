import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Lock, CalendarDays } from 'lucide-react';

import EntityCalendarBoard from '@/components/calendar/EntityCalendarBoard';
import { buildEntityCalendarHref, buildEntityIcalHref } from '@/lib/calendar/entity-calendar-engine';
import { canMutateCalendarEntity } from '@/lib/calendar/entity-calendar-access';
import { getEntityCalendar, sanitizeEntitySlug } from '@/lib/calendar/entity-calendar-store';
import {
  getCalendarEntityKindMeta,
  type CalendarEntityKind,
} from '@/lib/calendar/entity-calendar-types';
import {
  parseCalendarEntityKindParam,
  resolveCalendarEntity,
} from '@/lib/calendar/entity-registry';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ kind: string; slug: string }>;
  searchParams: Promise<{ date?: string; slot?: string; intent?: string }>;
}

interface ResolvedPage {
  kind: CalendarEntityKind;
  slug: string;
}

async function resolvePageParams(params: PageProps['params']): Promise<ResolvedPage | null> {
  const raw = await params;
  const kind = parseCalendarEntityKindParam(raw.kind);
  const slug = sanitizeEntitySlug(raw.slug);
  if (!kind || !slug) return null;
  return { kind, slug };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await resolvePageParams(params);
  if (!resolved) {
    return { title: 'Calendario no encontrado · EAR OS', robots: { index: false, follow: false } };
  }

  const entity = resolveCalendarEntity(resolved.kind, resolved.slug);
  const meta = getCalendarEntityKindMeta(resolved.kind);
  const title = `Disponibilidad de ${entity.displayName} · ${meta.shortLabel} · EAR OS`;
  const description = `Calendario real de ${entity.displayName}. Bloquea tu fecha con depósito deducible y consulta las franjas libres en tiempo real.`;

  return {
    title,
    description,
    alternates: {
      canonical: buildEntityCalendarHref(resolved.kind, resolved.slug),
      types: { 'text/calendar': buildEntityIcalHref(resolved.kind, resolved.slug) },
    },
    openGraph: { title, description, type: 'website' },
    robots: { index: true, follow: true },
  };
}


export default async function EntityCalendarPage({ params, searchParams }: PageProps) {
  const resolved = await resolvePageParams(params);
  if (!resolved) notFound();

  const { kind, slug } = resolved;
  const query = await searchParams;
  const entity = resolveCalendarEntity(kind, slug);
  const meta = getCalendarEntityKindMeta(kind);
  const record = await getEntityCalendar(kind, entity.slug, entity.displayName);
  const canMutate = await canMutateCalendarEntity(entity.slug);

  const initialDate =
    typeof query.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(query.date) ? query.date : null;
  const initialSlot =
    typeof query.slot === 'string' && /^\d{2}:\d{2}$/.test(query.slot) ? query.slot : null;
  const initialIntent = query.intent === 'bloquear' || query.intent === 'ver' ? query.intent : null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: entity.displayName,
    serviceType: meta.label,
    provider: { '@type': 'Organization', name: 'Productora EAR', url: 'https://productoraear.com' },
    areaServed: 'ES',
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: buildEntityCalendarHref(kind, entity.slug),
    },
  };

  return (
    <main className="min-h-screen bg-[#030305] text-white w-full overflow-x-hidden selection:bg-[#ecb613] selection:text-black">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-28 pb-20 space-y-6">
        <nav className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
          <Link href="/proveedores" className="inline-flex items-center gap-2 hover:text-white transition-colors">
            <ArrowLeft size={12} /> Directorio de proveedores
          </Link>
          <span className="inline-flex items-center gap-2 text-emerald-400">
            <ShieldCheck size={12} /> Agenda aislada por rol · sin colisiones cruzadas
          </span>
        </nav>

        <EntityCalendarBoard
          kind={kind}
          slug={entity.slug}
          canMutate={canMutate}
          initialDate={initialDate}
          initialSlot={initialSlot}
          initialIntent={initialIntent}
        />

        <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-widest">
              <CalendarDays size={13} /> Titularidad
            </div>
            <p className="text-[11px] text-zinc-400">
              {entity.source === 'artist'
                ? 'Artista del roster soberano EAR OS con agenda propia.'
                : entity.source === 'provider'
                  ? `Proveedor del Data Lake verificable (gremio: ${entity.category ?? 'n/d'}).`
                  : 'Entidad aún no reclamada: el calendario se activa al reclamar el perfil.'}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-widest">
              <Lock size={13} /> Bloqueo
            </div>
            <p className="text-[11px] text-zinc-400">
              Bloqueos registrados: <strong className="text-white">{record.blockedDates.length}</strong>. Cada entidad
              solo puede bloquear su propio calendario.
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-widest">
              <ShieldCheck size={13} /> Sincronización
            </div>
            <p className="text-[11px] text-zinc-400">
              Exporta a Google/Apple Calendar el feed <code className="text-white">.ics</code> propio de{' '}
              {entity.displayName}.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
