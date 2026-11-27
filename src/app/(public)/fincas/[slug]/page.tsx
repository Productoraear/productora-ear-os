import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import fs from 'node:fs';
import path from 'node:path';
import {
  ShieldCheck,
  MapPin,
  Users,
  Zap,
  Volume2,
  Building2,
  Phone,
  MessageCircle,
  Lock,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import { CENTRALITA } from '@/lib/phone-constants';
import { getFincaById, type FincaHomologada } from '@/lib/constants/fincas-catalog';
import { getFincaImage } from '@/lib/constants/fincas-images';
import { resolveEntityAsin } from '@/lib/entities/asin';
import { buildClientWhatsAppHandoffUrl } from '@/lib/whatsapp/client-handoff';
import {
  maskPhoneForDisplay,
  resolvePublicProviderDisplayName,
} from '@/lib/providers/contact-gate';
import {
  evaluateProviderContactAccess,
  verifySupplierUnlockSession,
} from '@/lib/providers/contact-gate-server';
import { findFichaBySlug, findFichaByVendorId } from '@/lib/providers/fichaProvider';
import { isProviderBlacklisted } from '@/lib/providers/visibility';
import {
  resolveProviderCalendarHref,
  resolveProviderContractHref,
} from '@/lib/providers/provider-cta-engine';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ session_id?: string }>;
}

const OTZARRETA_ALIASES = new Set([
  'otzarreta',
  'restaurante-otzarreta',
  'restaurante-otzarreta-32714',
  'v-32714',
  '32714',
  'ezkertza-berria',
  'restaurante-ezkertza-berria',
]);

const FINCA_PARTITION_FILES = [
  'finca.json',
  'finca__2.json',
  'finca__3.json',
  'finca__4.json',
  'finca__5.json',
] as const;

interface EdgeFincaRecord {
  id?: string;
  vendorId?: string;
  asin?: string;
  name?: string;
  slug?: string;
  legacySlug?: string;
  category?: string;
  province?: string;
  municipality?: string;
  address?: string;
  phone?: string;
  telephone?: string;
  rating?: number;
  reviews?: number;
  price_eur?: number;
  basePrice?: number;
  img?: string;
  gallery?: string[];
  imageUrls?: string[];
  description?: string;
  description_full?: string;
  services_list?: string[];
}

const fincaPartitionCache = new Map<string, EdgeFincaRecord[]>();

function normalizeSlugToken(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function findEdgeFincaBySlug(slug: string): EdgeFincaRecord | null {
  const clean = slug.toLowerCase().trim();
  const baseDir = path.join(process.cwd(), 'public', 'data', 'providers');

  for (const fileName of FINCA_PARTITION_FILES) {
    let records = fincaPartitionCache.get(fileName);
    if (!records) {
      const fullPath = path.join(baseDir, fileName);
      if (!fs.existsSync(fullPath)) {
        fincaPartitionCache.set(fileName, []);
        continue;
      }
      try {
        const parsed: unknown = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        records = Array.isArray(parsed) ? (parsed as EdgeFincaRecord[]) : [];
      } catch {
        records = [];
      }
      fincaPartitionCache.set(fileName, records);
    }

    const found = records.find((item) => {
      const itemSlug = (item.slug || '').toLowerCase().trim();
      const itemId = (item.id || '').toLowerCase().trim();
      const legacy = (item.legacySlug || '').toLowerCase().trim();
      const nameSlug = item.name ? normalizeSlugToken(item.name) : '';
      return itemSlug === clean || itemId === clean || legacy === clean || (nameSlug.length > 2 && nameSlug === clean);
    });

    if (found) {
      if (isProviderBlacklisted({ id: found.id, slug: found.slug, name: found.name })) {
        return null;
      }
      return found;
    }
  }
  return null;
}

function resolveFincaMetadataTarget(slug: string): {
  asin: string;
  entityName: string;
  description: string;
  canonicalSlug: string;
} | null {
  const catalogFinca: FincaHomologada | undefined = getFincaById(slug);
  if (catalogFinca) {
    const publicName = resolvePublicProviderDisplayName({
      id: catalogFinca.id,
      slug: catalogFinca.slug,
      name: catalogFinca.name,
      category: 'finca',
      province: catalogFinca.provincia,
    });
    return {
      asin: resolveEntityAsin('finca', catalogFinca.slug),
      entityName: publicName,
      description: catalogFinca.description,
      canonicalSlug: catalogFinca.slug,
    };
  }

  const edgeFinca = findEdgeFincaBySlug(slug);
  if (edgeFinca) {
    const canonicalSlug = edgeFinca.slug || slug;
    const explicitAsin =
      edgeFinca.asin ||
      findFichaBySlug(canonicalSlug)?.asin ||
      (edgeFinca.vendorId || edgeFinca.id ? findFichaByVendorId(edgeFinca.vendorId || edgeFinca.id)?.asin : undefined);
    const publicName = resolvePublicProviderDisplayName({
      id: edgeFinca.id || canonicalSlug,
      slug: canonicalSlug,
      name: edgeFinca.name || canonicalSlug,
      category: 'finca',
      province: edgeFinca.province,
      municipality: edgeFinca.municipality,
    });
    return {
      asin: resolveEntityAsin('finca', canonicalSlug, explicitAsin ?? null),
      entityName: publicName,
      description:
        edgeFinca.description_full ||
        edgeFinca.description ||
        `Espacio homologado en ${edgeFinca.province || 'España'} con garantía técnica Productora EAR.`,
      canonicalSlug,
    };
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugLower = slug.toLowerCase().trim();

  if (OTZARRETA_ALIASES.has(slugLower)) {
    const asin = resolveEntityAsin('finca', 'otzarreta');
    return {
      title: 'Restaurante Otzarreta | Bodas, Asador & Banquetes en Derio (Bizkaia)',
      description: 'Caserío tradicional vasco para banquetes de boda exclusivos en Derio (Bizkaia).',
      other: {
        'ear:asin': asin,
        'ear:entity-name': 'Restaurante Otzarreta',
        'ear:category': 'Fincas',
      },
    };
  }

  const resolved = resolveFincaMetadataTarget(slugLower);
  if (!resolved) {
    return { title: 'Finca Homologada | Productora EAR' };
  }

  return {
    title: `${resolved.entityName} | Fincas Homologadas EAR OS`,
    description: resolved.description,
    alternates: {
      canonical: `https://productoraear.com/fincas/${resolved.canonicalSlug}`,
    },
    other: {
      'ear:asin': resolved.asin,
      'ear:entity-name': resolved.entityName,
      'ear:category': 'Fincas',
    },
  };
}

export default async function FincaDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const slugLower = (slug || '').toLowerCase().trim();

  if (OTZARRETA_ALIASES.has(slugLower)) {
    redirect('/otzarreta');
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const catalogFinca = getFincaById(slugLower);

  if (catalogFinca) {
    const asin = resolveEntityAsin('finca', catalogFinca.slug);
    const publicName = resolvePublicProviderDisplayName({
      id: catalogFinca.id,
      slug: catalogFinca.slug,
      name: catalogFinca.name,
      category: 'finca',
      province: catalogFinca.provincia,
    });
    const maskedPhone = maskPhoneForDisplay(catalogFinca.directorioContacto.telefono);
    const coverImg = getFincaImage(catalogFinca.id);
    const waHref = buildClientWhatsAppHandoffUrl({
      phoneDigits: CENTRALITA.raw,
      text: `Hola Productora EAR, deseo consultar disponibilidad y visita técnica para ${publicName} (${catalogFinca.location}).`,
      asin,
    });
    const calendarHref = resolveProviderCalendarHref(
      { slug: catalogFinca.slug, category: 'finca' },
      { intent: 'bloquear' },
    );
    const contractHref = resolveProviderContractHref(
      { slug: catalogFinca.slug, category: 'finca' },
      { city: catalogFinca.provincia },
    );

    return (
      <main
        data-ear-asin={asin}
        data-ear-entity-name={publicName}
        data-ear-category="Fincas"
        className="min-h-screen bg-[#030305] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 font-sans"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/fincas"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-[#ecb613] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Catálogo de Fincas</span>
            </Link>
            <span className="px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-mono text-[10px] uppercase tracking-widest">
              {asin}
            </span>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden border border-white/10 bg-[#09090d]">
                <img src={coverImg} alt={publicName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-transparent" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 border border-[#ecb613]/30 text-[#ecb613] font-mono text-[10px] uppercase">
                  <ShieldCheck size={12} /> Finca Homologada S-Class
                </span>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-[#09090d] border border-white/10 space-y-4">
                <p className="text-xs font-mono uppercase tracking-wider text-[#ecb613] flex items-center gap-1.5">
                  <MapPin size={13} /> {catalogFinca.location} ({catalogFinca.provincia})
                </p>
                <h1 className="text-2xl sm:text-4xl font-black font-syne text-white leading-tight">
                  {publicName}
                </h1>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {catalogFinca.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Users size={12} className="text-[#ecb613]" /> Aforo
                    </span>
                    <span className="text-white font-bold mt-1 block">{catalogFinca.capacidadMaxPax} pax</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Zap size={12} className="text-[#ecb613]" /> Potencia
                    </span>
                    <span className="text-white font-bold mt-1 block">{catalogFinca.potenciaKw} kW</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Volume2 size={12} className="text-[#ecb613]" /> Acústica
                    </span>
                    <span className="text-white font-bold mt-1 block">{catalogFinca.limiteAcustico.exteriorDBA} dBA</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Building2 size={12} className="text-[#ecb613]" /> Póliza RC
                    </span>
                    <span className="text-white font-bold mt-1 block">
                      {catalogFinca.polizaRC.coberturaEuros.toLocaleString('es-ES')} €
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Espacios disponibles
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {catalogFinca.espaciosDisponibles.map((space) => (
                      <span
                        key={space}
                        className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-200"
                      >
                        {space}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#09090d] border border-[#ecb613]/30 space-y-6 lg:sticky lg:top-28">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613]">
                  Bloqueo de Visita Técnica & Reserva
                </span>
                <div className="text-3xl font-black font-syne text-white">
                  Depósito {DEPOSITO_STRIPE_EUR} € <span className="text-sm font-normal text-zinc-400">deducible</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Lock size={12} className="text-[#ecb613]" /> Contacto del recinto:
                  </span>
                  <span>{maskedPhone}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Atención oficial EAR OS:</span>
                  <span className="text-[#ecb613] font-bold">{CENTRALITA.display}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href={calendarHref}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#ecb613] hover:bg-amber-300 text-black font-syne font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Calendar size={15} />
                  <span>Ver agenda y bloquear ({DEPOSITO_STRIPE_EUR} €)</span>
                </Link>

                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={15} />
                  <span>Consultar disponibilidad por WhatsApp</span>
                </a>

                <Link
                  href={contractHref}
                  className="w-full py-3.5 px-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <ShieldCheck size={15} className="text-[#ecb613]" />
                  <span>Expediente contractual B2B</span>
                </Link>

                <a
                  href={CENTRALITA.tel}
                  className="w-full py-3 px-5 rounded-2xl bg-white/[0.03] hover:bg-white/10 border border-white/10 text-zinc-300 font-mono text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone size={13} className="text-[#ecb613]" />
                  <span>{CENTRALITA.display}</span>
                </a>
              </div>
            </aside>
          </section>
        </div>
      </main>
    );
  }

  const edgeFinca = findEdgeFincaBySlug(slugLower);
  if (!edgeFinca) {
    notFound();
  }

  const canonicalSlug = edgeFinca.slug || slugLower;
  const paidUnlock = await verifySupplierUnlockSession(resolvedParams?.session_id, canonicalSlug);
  const contactAccess = evaluateProviderContactAccess(
    { id: edgeFinca.id || canonicalSlug, slug: canonicalSlug, name: edgeFinca.name },
    { paidUnlock },
  );
  const explicitAsin =
    edgeFinca.asin ||
    findFichaBySlug(canonicalSlug)?.asin ||
    (edgeFinca.vendorId || edgeFinca.id ? findFichaByVendorId(edgeFinca.vendorId || edgeFinca.id)?.asin : undefined);
  const asin = resolveEntityAsin('finca', canonicalSlug, explicitAsin ?? null);
  const displayName = resolvePublicProviderDisplayName({
    id: edgeFinca.id || canonicalSlug,
    slug: canonicalSlug,
    name: edgeFinca.name || canonicalSlug,
    category: 'finca',
    province: edgeFinca.province,
    municipality: edgeFinca.municipality,
    tier: contactAccess.tier,
    paidUnlock: contactAccess.canRevealPhone,
  });

  const rawEdgePhone =
    (typeof edgeFinca.phone === 'string' && edgeFinca.phone) ||
    (typeof edgeFinca.telephone === 'string' && edgeFinca.telephone) ||
    null;
  const maskedPhone = maskPhoneForDisplay(rawEdgePhone);
  const locationLabel = [edgeFinca.municipality, edgeFinca.province].filter(Boolean).join(', ') || 'España';
  const coverImg =
    (Array.isArray(edgeFinca.imageUrls) && edgeFinca.imageUrls[0]) ||
    (Array.isArray(edgeFinca.gallery) && edgeFinca.gallery[0]) ||
    edgeFinca.img ||
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop';

  const waHref = buildClientWhatsAppHandoffUrl({
    phoneDigits: CENTRALITA.raw,
    text: `Hola Productora EAR, deseo consultar disponibilidad y presupuesto para ${displayName} (${locationLabel}).`,
    asin,
  });
  const calendarHref = resolveProviderCalendarHref(
    { id: edgeFinca.id, slug: canonicalSlug, category: 'finca' },
    { intent: 'bloquear' },
  );
  const contractHref = resolveProviderContractHref(
    { id: edgeFinca.id, slug: canonicalSlug, category: 'finca' },
    { city: edgeFinca.province },
  );

  return (
    <main
      data-ear-asin={asin}
      data-ear-entity-name={displayName}
      data-ear-category="Fincas"
      className="min-h-screen bg-[#030305] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/fincas"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-[#ecb613] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Catálogo de Fincas</span>
          </Link>
          <span className="px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-mono text-[10px] uppercase tracking-widest">
            {asin}
          </span>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden border border-white/10 bg-[#09090d]">
              <img src={coverImg} alt={displayName} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-transparent" />
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#09090d] border border-white/10 space-y-4">
              <p className="text-xs font-mono uppercase tracking-wider text-[#ecb613] flex items-center gap-1.5">
                <MapPin size={13} /> {locationLabel}
              </p>
              <h1 className="text-2xl sm:text-4xl font-black font-syne text-white leading-tight">
                {displayName}
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                {edgeFinca.description_full ||
                  edgeFinca.description ||
                  `Espacio homologado en ${locationLabel} con gestión centralizada y garantía acústica EAR OS.`}
              </p>
            </div>
          </div>

          <aside className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#09090d] border border-[#ecb613]/30 space-y-6 lg:sticky lg:top-28">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613]">
                Disponibilidad y Bloqueo
              </span>
              <div className="text-3xl font-black font-syne text-white">
                Depósito {DEPOSITO_STRIPE_EUR} € <span className="text-sm font-normal text-zinc-400">deducible</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Lock size={12} className="text-[#ecb613]" /> Teléfono del recinto:
                </span>
                <span>{maskedPhone}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Atención oficial EAR OS:</span>
                <span className="text-[#ecb613] font-bold">{CENTRALITA.display}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={calendarHref}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#ecb613] hover:bg-amber-300 text-black font-syne font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Calendar size={15} />
                <span>Ver agenda y bloquear ({DEPOSITO_STRIPE_EUR} €)</span>
              </Link>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle size={15} />
                <span>Consultar disponibilidad por WhatsApp</span>
              </a>

              <Link
                href={contractHref}
                className="w-full py-3.5 px-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck size={15} className="text-[#ecb613]" />
                <span>Expediente contractual</span>
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
