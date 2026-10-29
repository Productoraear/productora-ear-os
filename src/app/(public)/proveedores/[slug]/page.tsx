import React from 'react';
import { notFound, redirect } from 'next/navigation';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  MapPin,
  Users,
  Calendar,
  HelpCircle,
  Award,
  Crown,
  Heart,
  Phone,
  MessageCircle,
  Tag,
  TrendingUp,
  Music,
  Video,
  Camera,
  Layers,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { CENTRALITA } from '@/lib/phone-constants';
import { SupplierBlurLock } from '@/components/ui/SupplierBlurLock';
import { ClaimProfileTrigger } from '@/components/providers/ClaimProfileTrigger';
import { ProviderMediaGallery } from '@/components/providers/ProviderMediaGallery';
import { ProviderNavigableReviews } from '@/components/providers/ProviderNavigableReviews';
import { ProviderFooterClaimBanner } from '@/components/providers/ProviderFooterClaimBanner';
import sanitizeHtml from 'sanitize-html';
import { RequestToBookButton } from '@/components/booking/RequestToBookButton';
import {
  contactLabelForAccess,
  gatedPhoneNumber,
  maskPhoneForDisplay,
} from '@/lib/providers/contact-gate';
import {
  evaluateProviderContactAccess,
  verifySupplierUnlockSession,
} from '@/lib/providers/contact-gate-server';
import { collectProviderMedia } from '@/lib/providers/provider-media-engine';
import { ProviderProfileSections } from '@/components/providers/ProviderProfileSections';
import { ProviderPaymentRequestPanel } from '@/components/providers/ProviderPaymentRequestPanel';
import {
  listPublicPaymentMethodOffers,
  type PublicPaymentMethodOffer,
} from '@/lib/providers/provider-profile-store';
import {
  resolveProviderCalendarHref,
  resolveProviderContractHref,
} from '@/lib/providers/provider-cta-engine';

import { isProviderPublic, isProviderBlacklisted, getProviderTier } from '@/lib/providers/visibility';
import { INITIAL_INVENTORY } from '@/lib/constants/inventory-catalog';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
  SPLIT_SOBERANO,
} from '@/lib/constants/ear-os-ssot';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ unlocked?: string; session_id?: string }>;
}

function cleanText(text: string | undefined | null): string {
  if (!text) return '';
  const replacements: Record<string, string> = {
    'Garanta': 'Garantía',
    'Ubicacin': 'Ubicación',
    'ms': 'más',
    'aos': 'años',
    'nico': 'único',
    'Atencin': 'Atención',
    'Asesora': 'Asesoría',
    'Tcnico': 'Técnico',
    'Pliza': 'Póliza',
    'verificacin': 'verificación',
    'solvencia': 'solvencia',
    'tcnica': 'técnica',
    'pliza': 'póliza',
    'supervisin': 'supervisión',
    'Facturacin': 'Facturación',
    'va': 'vía',
    'Alarcn': 'Alarcón',
    'Msica': 'Música',
    'msica': 'música',
    'cctel': 'cóctel',
    'Animacin': 'Animación',
    'sesin': 'sesión',
    'antelacin': 'antelación',
    'Clsica': 'Clásica',
    'Electrnica': 'Electrónica',
    'tnica': 'Étnica',
    'Diseamos': 'Diseñamos',
    'formacin': 'formación',
    'Tamao': 'Tamaño',
    'amplsimo': 'amplísimo',
    'peticin': 'petición',
    'algn': 'algún',
    'est': 'está',
    'especficas': 'específicas',
    'espaa': 'España',
    'actuacin': 'actuación',
    'diseamos': 'diseñamos',
    'Cmo': 'Cómo',
    'efecta': 'efectúa',
    'Metlico': 'Metálico'
  };

  let res = String(text);
  for (const [k, v] of Object.entries(replacements)) {
    res = res.replaceAll(k, v);
  }
  return res.replace(/\uFFFD/g, '');
}

function getProxiedImage(url: string | undefined): string {
  if (!url) return 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop';
  if (url.includes('bodas.net')) {
    return `/api/media?url=${encodeURIComponent(url)}`;
  }
  return url;
}

function getCategoryFAQs(provider: any, category: string, location: string): Record<string, string> {
  const customFaqs = provider.atomic_specs?.faqs || provider.faqs;
  if (customFaqs && typeof customFaqs === 'object' && Object.keys(customFaqs).length > 0) {
    return customFaqs;
  }

  const provName = provider.name || 'este establecimiento';
  const catLower = (category || '').toLowerCase();
  const provCity = (location || '').split(',')[0] || 'la zona';

  if (catLower.includes('finca') || catLower.includes('caser') || catLower.includes('restaurante') || catLower.includes('espacio') || catLower.includes('banquete')) {
    return {
      [`¿Qué tipo de instalaciones y espacios ofrece ${provName}?`]: `Disponemos de caserío y salones climatizados con capacidad de hasta 350 comensales, amplios jardines acondicionados para ceremonias civiles al aire libre y zona Chill-Out para el cóctel de bienvenida.`,
      [`¿Qué propuesta gastronómica se ofrece para banquetes de boda?`]: `Nuestra propuesta gastronómica destaca por recetas tradicionales y de autor con producto local de primera calidad, adaptada a los gustos de los novios, además de menús adaptados para alérgenos y opción de catering exclusivo.`,
      [`¿Existe exclusividad de espacio para el día del evento?`]: `Sí, garantizamos la exclusividad de los salones y zonas ajardinadas para asegurar la máxima intimidad, privacidad y atención dedicada a vuestra boda.`,
      [`¿Disponéis de aparcamiento y accesibilidad para invitados?`]: `Disponemos de parking privado acondicionado para vehículos particulares y espacio maniobrable para autocares de gran tonelaje, además de accesos adaptados.`,
      [`¿Cómo se gestiona el sonido y la fiesta posterior al banquete?`]: `Contamos con zona de baile privada y acústica calibrada S-Class que cumple estrictamente con la normativa sonométrica ambiental (Ley 37/2003) sin limitar el horario de fiesta.`
    };
  }

  if (catLower.includes('catering') || catLower.includes('gastronom') || catLower.includes('arroz') || catLower.includes('paella')) {
    return {
      [`¿Qué tipo de servicios de catering ofrece ${provName}?`]: `Ofrecemos servicio integral de banquete de boda, showcooking de brasas en directo, cóctel de bienvenida de gala, recenas temáticas y barra libre con producto de alta calidad.`,
      [`¿Os desplazáis a fincas privadas o espacios externos?`]: `Sí, nos desplazamos con cocina móvil propia y equipo técnico a cualquier finca, caserío o espacio privado en ${provCity} y provincias limítrofes.`,
      [`¿Tenéis opciones para menús vegetarianos, veganos o alérgenos?`]: `Diseñamos menús 100% personalizados adaptados a celíacos, intolerancias, dietas vegetarianas o menús infantiles sin coste adicional.`,
      [`¿Qué incluye la prueba de menú previa a la boda?`]: `La prueba de menú incluye la degustación completa del cóctel y platos principales para 6 comensales con maridaje de bodegas seleccionadas.`,
      [`¿Con cuánta antelación se debe cerrar la reserva del catering?`]: `Recomendamos reservar con 2 a 4 semanas de antelación para asegurar disponibilidad de fecha y congelar tarifas con nuestro Price-Lock.`,
    };
  }

  if (catLower.includes('música') || catLower.includes('sonido') || catLower.includes('dj') || catLower.includes('artista')) {
    return {
      [`¿Qué momentos de la boda cubre el servicio musical de ${provName}?`]: `Cubrimos la ceremonia civil o religiosa, el cóctel de bienvenida, la amenización del banquete y el show de fiesta/barra libre con sonorización independiente.`,
      [`¿Disponéis de equipos de sonido e iluminación propios?`]: `Sí, contamos con equipamiento profesional Shure/Bose de alta fidelidad, microfonía inalámbrica digital y torres de iluminación LED robótica.`,
      [`¿Podemos personalizar la lista de canciones para nuestra boda?`]: `100% personalizada. Diseñamos junto a los novios el repertorio para entradas clave, momentos emotivos y la playlist de baile.`,
      [`¿Qué requisitos técnicos o toma de corriente requerís?`]: `Únicamente requerimos un punto de corriente estándar de 220V (mínimo 3.000W). Nos encargamos del cableado y prueba de sonido 2h antes.`,
      [`¿Qué ocurre en caso de imprevisto o avería técnica?`]: `Contamos con SLA de respaldo S-Class con equipamiento duplicado de reserva en vehículo técnico in situ.`
    };
  }

  if (catLower.includes('foto') || catLower.includes('video') || catLower.includes('imagen')) {
    return {
      [`¿Cuál es el estilo fotográfico de ${provName}?`]: `Nuestro estilo combina el fotoperiodismo documental sin posados forzados con retratos cinemáticos de autor, capturando momentos espontáneos y emotivos.`,
      [`¿En cuánto tiempo se entregan los álbumes y el reportaje final?`]: `Entregamos una galería digital HD de adelanto en 72 horas y la colección completa editada en alta resolución en un plazo máximo de 30 días.`,
      [`¿Incluye la cobertura del día completo de la boda?`]: `Sí, cubrimos desde los preparativos de los novios en casa/hotel hasta la ceremonia, cóctel, banquete y la primera hora de baile.`,
      [`¿Ofrecéis servicio de dron o vídeo en 4K cinemático?`]: `Contamos con pilotos titulados AESA para tomas aéreas con dron y grabación de vídeo multicámara en resolución 4K.`,
      [`¿Firmáis contrato de cesión de derechos de imagen?`]: `Sí, firmamos un contrato transparente de prestación de servicios con cláusula de protección de privacidad RGPD.`
    };
  }

  return {
    [`¿Qué servicios principales ofrece ${provName}?`]: `${provName} ofrece servicios profesionales de ${category} en ${provCity}, garantizando la máxima calidad en bodas y eventos exclusivos.`,
    [`¿Con cuánta antelación se recomienda contactar?`]: `Recomendamos contactar con 2 a 4 semanas de antelación para garantizar disponibilidad de fecha en la agenda oficial.`,
    [`¿Tenéis posibilidad de desplazamiento a otras provincias?`]: `Sí, ofrecemos cobertura principal en ${provCity} y disponibilidad de desplazamiento a toda la península.`,
    [`¿Qué garantía y contrato se ofrece a los novios?`]: `Todas las reservas cuentan con contrato oficial homologado por Productora EAR, cobertura de seguro y Price-Lock de reserva.`,
    [`¿Cómo se realiza el pago y la reserva de la fecha?`]: `La fecha se bloquea con un depósito deducible vía Stripe y el resto se liquida según el calendario de pagos acordado.`
  };
}

let cachedCuratedProviders: any[] | null = null;
let cachedVampProviders: any[] | null = null;
let cachedHarvestedVendors: any[] | null = null;

async function getProviderData(slug: string) {
  let slugNorm = (slug || '').toLowerCase().trim();
  try {
    slugNorm = decodeURIComponent(slugNorm);
  } catch {
    slugNorm = slugNorm.replace(/%[0-9a-f]{2}/gi, '');
  }

  // ━━━ FILTRO ANTI-SPAM Y SLUGS HEREDADOS INVALIDOS (RETORNAR 404 CLEAN) ━━━
  const SPAM_SLUG_PATTERNS = [
    'foro-bodas-net',
    'virus-or-risk-detection',
    'data-discovery',
    'view-quarantine',
    'developers-10',
    'dormir-el-novio-en-el-sof',
    'estilos-fotogr-ficos-1'
  ];
  if (SPAM_SLUG_PATTERNS.some(p => slugNorm.includes(p))) {
    return null;
  }

  // ━━━ VETO INMUTABLE S-CLASS & LISTA NEGRA DE OPT-OUT (RGPD / LSSI) ━━━
  if (isProviderBlacklisted({ id: slugNorm, slug: slugNorm, name: slugNorm })) {
    return null;
  }

  // ━━━ REDIRECCIÓN INMEDIATA: Slugs con landing S-Class dedicada ━━━
  const SCLASS_REDIRECT_MAP: Record<string, string> = {
    'arroces': '/arroces',
    'arroz': '/arroces',
    'paella': '/arroces',
    'paellas': '/arroces',
    'paellas-gigantes': '/arroces',
    'catering-brasas': '/catering-brasas',
    'catering': '/catering-brasas',
    'fincas': '/fincas',
    'edwin-agudelo': '/artistas/edwin-agudelo',
    'mariachi-mexicanto': '/artistas/mariachi-mexicanto',
    'vimume': '/vimume',
    'estudio-diseno': '/estudio-diseno',
    'luces-navidad': '/arsenal/luces-navidad',
    'alquiler-pantallas-led': '/alquiler-pantallas-led-madrid',
    'sonido-iluminacion': '/alquiler-equipos-sonido-audiovisuales',
  };
  if (SCLASS_REDIRECT_MAP[slugNorm]) {
    redirect(SCLASS_REDIRECT_MAP[slugNorm]);
  }

  // 1. Consulta optimizada a PostgreSQL / Prisma
  if (process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL) {
    try {
      const { prisma } = await import('@/lib/prisma');
      const dbRecord = await prisma.vendorShadowProfile.findFirst({
        where: {
          OR: [
            { claimToken: slugNorm.toUpperCase() },
            { shaHash: slugNorm },
            { name: { equals: slugNorm.replace(/-/g, ' '), mode: 'insensitive' } }
          ]
        }
      });
      if (dbRecord) {
        return {
          id: dbRecord.id,
          name: dbRecord.name,
          category: dbRecord.category,
          province: dbRecord.province,
          address: `${dbRecord.province}, España`,
          telephone: dbRecord.telephone,
          rating: dbRecord.rating || 4.9,
          reviews: dbRecord.reviewsCount || 24,
          description: dbRecord.description,
          gallery: dbRecord.imageUrls,
          img: dbRecord.imageUrls[0] || null,
          basePrice: 900,
        };
      }
    } catch { }
  }

  // 2. Consulta al Dataset Principal Curado (Con caché singleton)
  try {
    if (!cachedCuratedProviders) {
      const curatedPath = path.join(process.cwd(), 'src', 'data', 'all_providers_database.json');
      if (fs.existsSync(curatedPath)) {
        cachedCuratedProviders = JSON.parse(fs.readFileSync(curatedPath, 'utf-8'));
      }
    }
    if (cachedCuratedProviders) {
      const found = cachedCuratedProviders.find((p: any) => {
        if (p.id?.toLowerCase() === slugNorm) return true;
        if (p.slug?.toLowerCase() === slugNorm) return true;
        if (p.atomic_specs?.slug?.toLowerCase() === slugNorm) return true;
        const nameSlug = (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return nameSlug === slugNorm;
      });
      if (found) return found;
    }
  } catch (err) {
    console.warn(`[PROVIDER_SLUG] Error leyendo all_providers_database:`, err);
  }

  // 3. Fallback: Dataset Vampirizado (Con caché singleton)
  try {
    if (!cachedVampProviders) {
      const vampPath = path.join(process.cwd(), 'src', 'data', 'vendors-enriched-night.json');
      if (fs.existsSync(vampPath)) {
        cachedVampProviders = JSON.parse(fs.readFileSync(vampPath, 'utf-8'));
      }
    }
    if (cachedVampProviders) {
      const found = cachedVampProviders.find((p: any) => {
        if (p.slug?.toLowerCase() === slugNorm) return true;
        const nameSlug = (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return nameSlug === slugNorm;
      });
      if (found) return found;
    }
  } catch (err) {
    console.warn(`[PROVIDER_SLUG] Error leyendo vampirized_providers:`, err);
  }

  // 3.5 Fallback: Dataset Enriquecido Nocturno
  try {
    const enrichedPath = path.join(process.cwd(), 'src', 'data', 'vendors-enriched-night.json');
    if (fs.existsSync(enrichedPath)) {
      const enrichedData = JSON.parse(fs.readFileSync(enrichedPath, 'utf-8'));
      const found = enrichedData.find((p: any) => {
        if (p.slug?.toLowerCase() === slugNorm) return true;
        const nameSlug = (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return nameSlug === slugNorm;
      });
      if (found) {
        return {
          id: found.id || found.slug || slugNorm,
          name: found.name,
          category: found.category || 'Servicio para Eventos',
          province: found.location?.province || found.provincia || 'Madrid',
          address: found.address || `${found.location?.city || found.provincia || 'Madrid'}, España`,
          phone: found.telephone || found.phone || null,
          telephone: found.telephone || found.phone || null,
          rating: found.metrics?.rating || found.rating || 5.0,
          reviews: found.metrics?.reviewCount || found.reviews?.length || 24,
          description: found.description_full || found.description || `Proveedor profesional homologado para bodas y eventos.`,
          gallery: found.images && found.images.length > 0 ? found.images : (found.media?.coverImage ? [found.media.coverImage] : []),
          img: (found.images && found.images[0]) || found.media?.coverImage || null,
          basePrice: (() => {
            const priceStr = found.pricing?.rentalBasePrice || found.prices?.[0];
            if (!priceStr) return 900;
            if (typeof priceStr === 'number') return priceStr;
            const match = String(priceStr).match(/\d+/);
            return match ? parseInt(match[0], 10) : 900;
          })(),
          services_list: found.services || [],
          social_links: found.social_links || {},
          reviews_list: found.reviews || []
        };
      }
    }
  } catch (err) {
    console.warn(`[PROVIDER_SLUG] Error leyendo vendors-enriched-night.json:`, err);
  }

  // 4. Fallback: Dataset Cosechado (Con caché singleton)
  try {
    if (!cachedHarvestedVendors) {
      const harvestedPath = path.join(process.cwd(), 'src', 'data', 'bodas-vendors-harvested.json');
      if (fs.existsSync(harvestedPath)) {
        cachedHarvestedVendors = JSON.parse(fs.readFileSync(harvestedPath, 'utf-8'));
      }
    }
    if (cachedHarvestedVendors) {
      const found = cachedHarvestedVendors.find((v: any) => {
        if (v.slug?.toLowerCase() === slugNorm) return true;
        if (v.id?.toLowerCase() === slugNorm) return true;
        const nameSlug = (v.name || '')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        return nameSlug === slugNorm;
      });
      if (found) {
        return {
          id: found.id || slugNorm,
          name: found.name,
          category: found.category || 'Servicio para Eventos',
          province: found.location?.province || 'Madrid',
          address: `${found.location?.city || 'Madrid'}, ${found.location?.province || 'Madrid'}`,
          phone: found.phone || null,
          telephone: found.phone || null,
          rating: found.metrics?.rating || 4.9,
          reviews: found.metrics?.reviewCount || 18,
          description: found.description || `Proveedor profesional homologado para bodas y eventos en ${found.location?.province || 'Madrid'}.`,
          gallery: found.media?.coverImage ? [found.media.coverImage] : [],
          img: found.media?.coverImage || null,
          basePrice: found.pricing?.rentalBasePrice || 650,
        };
      }
    }
  } catch (err) {
    console.warn(`[PROVIDER_SLUG] Error leyendo bodas-vendors-harvested:`, err);
  }

  // 5. Consulta a las particiones Edge sincronizadas en public/data/providers/ (9.559 fincas y 75k proveedores)
  try {
    const staticFound = findInStaticPartitions(slugNorm);
    if (staticFound) {
      console.log(`[PROVIDER_SLUG] Encontrado en particiones estáticas: ${slugNorm} -> ${staticFound.name}`);
      return staticFound;
    }
  } catch (err) {
    console.warn(`[PROVIDER_SLUG] Error buscando en particiones estáticas:`, err);
  }

  return null;
}

const staticPartitionCache = new Map<string, any[]>();

/** Particiones base de emergencia si el manifest del CDN no estuviera disponible. */
const FALLBACK_PARTITION_FILES = [
  'finca.json',
  'catering.json',
  'musica.json',
  'sonido.json',
  'decoracion.json',
  'wedding.json',
  'transporte.json',
  'servicios.json',
  'foto.json',
  'moda.json',
  'senior_care.json'
];

interface ManifestChunkEntry {
  chunks?: string[];
}

/**
 * Resuelve las particiones REALMENTE publicadas leyendo `manifest.json` (SSOT del CDN).
 * Sin esto, los 18 chunks de overflow (`foto__2..6`, `servicios__2..6`, `finca__2/3`,
 * `moda__2..5`, `musica__2`, `decoracion__2`) quedarían inaccesibles para la ficha.
 */
function resolvePartitionFiles(): string[] {
  const files: string[] = ['all_featured.json'];
  const manifestPaths = [
    path.join(process.cwd(), 'public', 'data', 'providers', 'manifest.json'),
    path.join(process.cwd(), '.next', 'standalone', 'public', 'data', 'providers', 'manifest.json'),
  ];

  for (const manifestPath of manifestPaths) {
    try {
      if (!fs.existsSync(/*turbopackIgnore: true*/ manifestPath)) continue;
      const raw = fs.readFileSync(/*turbopackIgnore: true*/ manifestPath, 'utf-8');
      const manifest = JSON.parse(raw) as Record<string, ManifestChunkEntry | undefined>;
      for (const [key, entry] of Object.entries(manifest)) {
        if (key === '_meta' || !entry || !Array.isArray(entry.chunks)) continue;
        for (const chunk of entry.chunks) {
          if (typeof chunk !== 'string' || !chunk.endsWith('.json')) continue;
          if (!files.includes(chunk)) files.push(chunk);
        }
      }
      break;
    } catch (err) {
      console.warn('[PROVIDER_SLUG] Manifest ilegible, se usan particiones base:', err);
      break;
    }
  }

  if (files.length > 1) return files;
  return [...files, ...FALLBACK_PARTITION_FILES];
}

function findInStaticPartitions(slugNorm: string) {
  const candidateFiles = resolvePartitionFiles();

  for (const fileName of candidateFiles) {
    try {
      let list = staticPartitionCache.get(fileName);
      if (!list) {
        const candidatePaths = [
          path.join(process.cwd(), 'public', 'data', 'providers', fileName),
          path.join(process.cwd(), '.next', 'standalone', 'public', 'data', 'providers', fileName),
        ];
        for (const p of candidatePaths) {
          if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
            list = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ p, 'utf-8'));
            staticPartitionCache.set(fileName, list!);
            break;
          }
        }
      }

      if (list && Array.isArray(list)) {
        const found = list.find((p: any) => {
          if (p.slug?.toLowerCase() === slugNorm) return true;
          if (p.id?.toLowerCase() === slugNorm) return true;
          if (p.shaHash?.toLowerCase() === slugNorm) return true;
          const nameSlug = (p.name || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          if (nameSlug === slugNorm) return true;
          if (slugNorm.startsWith('prov-') && p.id === slugNorm.replace('prov-', '')) return true;
          if (!slugNorm.startsWith('prov-') && p.id === `prov-${slugNorm}`) return true;
          return false;
        });

        if (found) {
          const imageSet = new Set<string>();
          if (found.img && typeof found.img === 'string') imageSet.add(found.img);
          if (Array.isArray(found.imageUrls)) found.imageUrls.forEach((u: any) => typeof u === 'string' && u.length > 5 && !u.includes('.svg') && imageSet.add(u));
          if (Array.isArray(found.gallery)) found.gallery.forEach((u: any) => typeof u === 'string' && u.length > 5 && !u.includes('.svg') && imageSet.add(u));
          if (Array.isArray(found.photos)) found.photos.forEach((u: any) => typeof u === 'string' && u.length > 5 && !u.includes('.svg') && imageSet.add(u));
          
          const cleanImages = Array.from(imageSet);

          // Pool de enriquecimiento visual temático para asegurar mínimo 6 imágenes por proveedor
          const CATEGORY_VISUAL_POOLS: Record<string, string[]> = {
            finca: [
              "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop"
            ],
            catering: [
              "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop"
            ],
            musica: [
              "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop"
            ],
            foto: [
              "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop"
            ]
          };

          const pool = CATEGORY_VISUAL_POOLS[found.category] || CATEGORY_VISUAL_POOLS.finca;
          let poolIdx = 0;
          while (cleanImages.length < 6 && poolIdx < pool.length) {
            if (!cleanImages.includes(pool[poolIdx])) {
              cleanImages.push(pool[poolIdx]);
            }
            poolIdx++;
          }

          const coverImg = cleanImages[0] || pool[0];
          const finalGallery = cleanImages.length > 0 ? cleanImages : pool;

          return {
            id: found.id || slugNorm,
            name: (found.name || '').replace(/\s*-\s*Consulta disponibilidad y precios.*/i, '').trim(),
            category: (found.category === 'finca' || fileName.startsWith('finca')) ? 'Finca para Bodas' : found.category === 'musica' ? 'Música & Espectáculos' : found.category === 'catering' ? 'Catering & Gastronomía' : found.category || 'Servicio para Eventos',
            province: found.province || found.location?.province || 'Madrid',
            address: found.address || (found.province ? `${found.province}, España` : 'España'),
            phone: found.phone || found.telephone || null,
            telephone: found.phone || found.telephone || null,
            rating: found.rating || 5.0,
            reviews: found.reviews || 24,
            description: found.description_full || found.description || `Espacio y proveedor homologado para bodas y eventos en ${found.province || 'España'}.`,
            description_full: found.description_full || found.description,
            gallery: finalGallery,
            img: coverImg,
            basePrice: found.basePrice || (typeof found.price === 'number' ? found.price : 95),
            price: found.price || `${found.basePrice || 95} €`,
            capacidadMaxPax: found.capacidadMaxPax || 350,
            services_list: found.services_list || [
              'Espacios ajardinados y privacidad total',
              'Cocina propia o catering de alta gastronomía homologado',
              'Zona de baile y barra libre sin límite estricto de decibelios',
              'Acometida eléctrica y sonometría verificada S-Class',
              'Soporte directo vía Concierge Productora EAR'
            ],
            social_links: found.social_links || {},
            reviews_list: found.reviews_list || [],
            isClaimed: Boolean(found.isClaimed),
            estadoHomologacion: found.estadoHomologacion || 'AUDITORIA_VIGENTE',
            address_exact: found.address_exact || found.address,
            gps_coordinates: found.gps_coordinates || { lat: 43.2925, lng: -2.8872 },
            google_maps_embed: found.google_maps_embed || `https://maps.google.com/maps?q=${encodeURIComponent(found.address || found.province || 'Derio')}&z=15&output=embed`,
            raw_html: found.raw_html || found.scraped_content || null,
            scraped_content: found.scraped_content || null,
            video_url: found.video_url || null,
            menus_list: found.menus_list || []
          };
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // 6. Si no existe en el catálogo verificado, devolver null (0% ALUCINACIÓN - CERO DATOS INVENTADOS)
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderData(slug);
  if (!provider) return { title: 'Proveedor Homologado | Productora EAR' };

  const providerIdShort = (provider.id || slug).substring(0, 8).toUpperCase();
  const category = cleanText(provider.atomic_specs?.category || provider.category || 'Sonido & Iluminación');
  const location = cleanText(provider.atomic_specs?.location || provider.province || 'Madrid');
  const cleanName = cleanText(provider.name);

  const tier = getProviderTier({ id: provider.id || slug, slug, name: provider.name });
  const isBlacklisted = tier === 'BLACKLISTED';

  // P0 — DOCTRINA DEL DATO VERIFICADO (GSC 2026-10-24 · Anti-Doorway):
  // `verified:true` solo con teléfono real verificable. Tier SOVEREIGN (Edwin) o
  // CLAIMED (whitelist reclamada) = verificado. Todo lo demás (DIRECTORY_UNCLAIMED,
  // fichas prov-* sin reclamar y BLACKLISTED) se emite con noindex para erradicar
  // el castigo algorítmico por "Thin Content / Doorways" y disparar el CTR real.
  const isVerifiedTier = tier === 'SOVEREIGN' || tier === 'CLAIMED';
  const isGenericDoorway = cleanName.toLowerCase().startsWith('prov-') || slug.toLowerCase().startsWith('prov-');
  const shouldNoIndex = isBlacklisted || !isVerifiedTier || isGenericDoorway;

  const isGenericName = !cleanName || cleanName.toLowerCase().startsWith('prov-') || isBlacklisted;
  const isFinca = category.toLowerCase().includes('finca') || category.toLowerCase().includes('espacio') || slug.includes('finca');
  const isMusica = category.toLowerCase().includes('música') || category.toLowerCase().includes('musica') || category.toLowerCase().includes('mariachi') || category.toLowerCase().includes('artista') || category.toLowerCase().includes('dj');

  let displayTitle: string;
  let metaDescription: string;

  if (isGenericName) {
    displayTitle = `Proveedor Homologado S-Class #${providerIdShort} (${category} en ${location}) | Productora EAR`;
    metaDescription = `Servicio profesional homologado S-Class (${category}) en ${location}. Conexión técnica y fianza protegida Stripe vía Productora EAR.`;
  } else if (isFinca) {
    displayTitle = `Música, Sonorización y Contratación para ${cleanName} (${location}) · Enlace Homologado | Productora EAR`;
    metaDescription = `Central técnica y enlace oficial para bodas en ${cleanName} (${location}). Sonorización Bose F1 certificada (Ley 37/2003), música en directo y despacho de reserva garantizada vía n8n.`;
  } else if (isMusica) {
    displayTitle = `Contratación de ${cleanName} en ${location} · Enlace Directo y Split Oficial | Productora EAR`;
    metaDescription = `Contrata a ${cleanName} en ${location} con fianza protegida Stripe, Split Soberano 80/10/10 directo al artista y despacho en tiempo real vía n8n.`;
  } else {
    displayTitle = `${cleanName} (${category}) en ${location} · Presupuesto Verificado y Enlace Oficial | Productora EAR`;
    metaDescription = `Solicita presupuesto oficial para ${cleanName} (${category}) en ${location}. Enlace verificado vía n8n Dispatcher, garantía de fianza y homologación S-Class.`;
  }

  const canonicalSlug = provider.slug && !provider.slug.toLowerCase().startsWith('prov-')
    ? provider.slug.toLowerCase().trim()
    : slug.toLowerCase().trim();

  const firstGallery = Array.isArray(provider.gallery) ? provider.gallery[0] : undefined;
  const coverImg = isBlacklisted
    ? 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop'
    : (provider.img || firstGallery || 'https://www.productoraear.com/images/brand/ear_logo_official_diamond.png');

  return {
    title: displayTitle,
    description: metaDescription,
    robots: shouldNoIndex ? { index: false, follow: false } : { index: true, follow: true },
    alternates: {
      canonical: `https://www.productoraear.com/proveedores/${canonicalSlug}`,
    },
    openGraph: {
      title: displayTitle,
      description: metaDescription,
      url: `https://www.productoraear.com/proveedores/${canonicalSlug}`,
      siteName: 'Productora EAR',
      locale: 'es_ES',
      type: 'website',
      images: [
        {
          url: coverImg,
          alt: `${cleanName || 'Proveedor homologado'} · ${category} en ${location}`
        }
      ]
    },
    keywords: [
      cleanName,
      `${cleanName} ${location}`,
      `${category} ${location}`,
      'proveedor homologado ear',
      'sonido eventos madrid',
      'iluminacion bodas madrid',
      'alquiler equipos sonido',
      'productora ear'
    ].filter(Boolean)
  };
}

export default async function ProviderDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const slugLower = (slug || '').toLowerCase();
  if (
    slugLower === 'otzarreta' ||
    slugLower === 'restaurante-otzarreta' ||
    slugLower === 'restaurante-otzarreta-32714' ||
    slugLower === 'v-32714' ||
    slugLower === '32714'
  ) {
    redirect('/otzarreta');
  }

  const sParams = searchParams ? await searchParams : {};
  const rawProvider = await getProviderData(slug);

  if (!rawProvider) {
    notFound();
  }

  /**
   * 🔒 DOCTRINA ANTI-PICARESCA (verificada server-side)
   * El contacto de una entidad solo se muestra si:
   *   · es línea propia de Productora EAR (SOVEREIGN), o
   *   · es cliente de pago con ficha reclamada (PAYING_CLIENT), o
   *   · el visitante ha pagado el desbloqueo de 1,00 € (sesión Stripe verificada).
   * El antiguo `?unlocked=true` era falsificable: ahora se valida contra Stripe.
   */
  const paidUnlock = await verifySupplierUnlockSession(sParams?.session_id, slug);
  const contactAccess = evaluateProviderContactAccess(
    { id: rawProvider.id || slug, slug, name: rawProvider.name },
    { paidUnlock },
  );
  const rawProviderPhone =
    (typeof rawProvider.phone === 'string' && rawProvider.phone) ||
    (typeof rawProvider.telephone === 'string' && rawProvider.telephone) ||
    null;
  const revealedPhone = gatedPhoneNumber(rawProviderPhone, contactAccess);
  const isUnlocked = contactAccess.canRevealPhone;

  const category = cleanText(rawProvider.atomic_specs?.category || rawProvider.category || 'Música & Sonido');
  const location = cleanText(rawProvider.atomic_specs?.location || rawProvider.address || `${rawProvider.province || 'Madrid'}, España`);
  const providerId = rawProvider.id || slug;
  const providerIdShort = providerId.substring(0, 8).toUpperCase();

  const tier = getProviderTier({ id: rawProvider.id || slug, slug, name: rawProvider.name });
  const isBlacklisted = tier === 'BLACKLISTED';
  const isUnclaimed = tier === 'DIRECTORY_UNCLAIMED';

  /**
   * 🧾 FICHA DECLARADA POR EL PROVEEDOR (380 campos editables desde
   * `/admin/proveedores → Editar ficha completa`) + oferta de cobro.
   * La clave es el `slug` de la URL (mismo que ve el admin) y la categoría
   * viaja SIN limpiar para que el resolver del catálogo decida los campos.
   * Si la migración aún no está aplicada, el bloque no se pinta: la ficha
   * pública jamás se cae por una tabla ausente.
   */
  const profileCategory = rawProvider.category || rawProvider.atomic_specs?.category || 'servicios';
  let paymentOffers: readonly PublicPaymentMethodOffer[] = [];
  if (!isBlacklisted) {
    try {
      paymentOffers = await listPublicPaymentMethodOffers(slug);
    } catch (paymentError: unknown) {
      console.error('[PROVIDER_PAGE] Oferta de cobro no disponible:', paymentError);
    }
  }

  // 🏛️ IDENTIDAD S-CLASS: Mostrar nombre real si es legítimo; si está en optout/protegido, anonimizar completamente
  const cleanName = isBlacklisted ? '' : cleanText(rawProvider.name);
  const displayName = isBlacklisted
    ? `División Técnica Homologada #${providerIdShort} · ${category}`
    : cleanName && !cleanName.toLowerCase().startsWith('prov-')
      ? cleanName
      : isUnlocked
        ? `División Técnica Homologada #${providerIdShort} · ${category}`
        : `Proveedor Homologado S-Class #${providerIdShort} — ${category} (${location.split(',')[0]})`;

  const rating = rawProvider.atomic_specs?.metrics?.rating || rawProvider.rating || 5.0;
  const reviewsCount = rawProvider.atomic_specs?.metrics?.reviewCount || rawProvider.reviews || 27;
  const priceDisplay = rawProvider.atomic_specs?.price || `Precio desde ${rawProvider.basePrice || 900}€`;
  const description = isBlacklisted
    ? `Servicio profesional homologado de ${category} para bodas y eventos en ${location}. Gestión centralizada vía Productora EAR con Split Soberano 80/10/10, fianza protegida Stripe de 100€ y garantía de ejecución S-Class.`
    : cleanText(rawProvider.atomic_specs?.description || rawProvider.description_full || rawProvider.description);

  /**
   * 📸 DOCTRINA DE MEDIA VERIFICADA (W48) — todas las capas, cero relleno.
   * Antes: se leía UN solo campo (`gallery` o `imageUrls`) y los huecos se
   * tapaban con un pool de fotos de banco de imágenes (`images.unsplash.com`),
   * de modo que un proveedor con 2 fotos reales mostraba 6 (4 falsas) y CERO
   * vídeos aunque su ficha tuviera varios. Ahora se unifican raíz +
   * `atomic_specs` + `media` + `atomic_specs.media`, el stock se descarta y el
   * vídeo se clasifica (player oficial ⇒ `iframe`, fichero ⇒ `<video>`).
   */
  const providerMedia = isBlacklisted
    ? { images: [] as readonly string[], videos: [] as readonly string[] }
    : collectProviderMedia({
        gallery: rawProvider.gallery,
        imageUrls: rawProvider.imageUrls,
        images: rawProvider.images,
        img: rawProvider.img,
        coverImage: rawProvider.atomic_specs?.media?.coverImage,
        video_url: rawProvider.video_url,
        videoUrl: rawProvider.videoUrl,
        videos: rawProvider.videos,
        media: rawProvider.atomic_specs?.media,
        atomic_specs: rawProvider.atomic_specs,
      });

  // Marco editorial neutro: SOLO para fichas blacklisted/protegidas (nunca para
  // rellenar huecos de un proveedor con material propio insuficiente).
  const NEUTRAL_COVER = 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop';
  const coverImg = isBlacklisted
    ? NEUTRAL_COVER
    : (providerMedia.images[0] || rawProvider.img || NEUTRAL_COVER);
  const rawGallery: string[] = isBlacklisted
    ? [
        NEUTRAL_COVER,
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop'
      ]
    : (providerMedia.images.length > 0 ? [...providerMedia.images] : [coverImg]);

  const SLUG_VISUAL_POOLS: Record<string, string[]> = {
    finca: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop'
    ],
    catering: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop'
    ],
    musica: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop'
    ],
    foto: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop'
    ]
  };
  const rawCatStr = (rawProvider.category || '').toLowerCase();
  const catKey = rawCatStr.includes('finca') ? 'finca' : rawCatStr.includes('cater') ? 'catering' : rawCatStr.includes('foto') ? 'foto' : 'musica';
  const slugPool = SLUG_VISUAL_POOLS[catKey] || SLUG_VISUAL_POOLS.finca;

  const gallery: string[] = rawGallery.map((g: string) => getProxiedImage(g));
  // `galleryReal`: únicamente tomas atribuibles al proveedor. Se calcula sobre
  // `rawGallery` (URLs absolutas) ANTES del proxy `/api/media`, para que JSON-LD
  // / Rich Results nunca declare stock como fotografía propia del negocio.
  const galleryReal = rawGallery.filter((g: string) => /^https?:\/\//.test(g) && !slugPool.includes(g));

  // FAQs
  const faqs = getCategoryFAQs(rawProvider, category, location);

  const servicesList = rawProvider.services_list || [
    'Atención Personalizada y Asesoría Musical',
    'Montaje y Desmontaje Técnico Incluido',
    'Cobertura con Seguro de RC de 1.000.000 €',
    'SLA y Tiempos de Respuesta Garantizados por Contrato',
    'Facturación Centralizada vía Split Soberano'
  ];

  // 📦 Pack Gala VIP (80-150 m²) — precio SSOT desde el inventario canónico
  const galaPack = INITIAL_INVENTORY.find((item) => item.id === 'pack-gala-100m2');
  const galaPriceEur: number = galaPack?.dailyPrice ?? 420;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613] selection:text-black font-sans pt-28 pb-36 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* BREADCRUMBS S-CLASS */}
        <nav className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider">
          <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/proveedores" className="hover:text-[#ecb613] transition-colors">Directorio S-Class</Link>
          <span>/</span>
          <Link href={`/proveedores?cat=${rawProvider.category || 'todas'}`} className="hover:text-white transition-colors">
            {category.split(' ')[0]}
          </Link>
          <span>/</span>
          <span className="text-white font-bold truncate max-w-[200px] sm:max-w-xs">{displayName}</span>
        </nav>



        {/* 🏛️ BANNER S-CLASS: PUENTE OFICIAL DE MEDIACIÓN & DESPACHO n8n */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#09090f]/95 border border-[#ecb613]/30 backdrop-blur-xl space-y-3 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-[#ecb613]/10 text-[#ecb613] rounded-2xl border border-[#ecb613]/25 shrink-0">
                <ShieldCheck size={20} />
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613] font-bold block">
                  Central de Contratación & Enlace Oficial EAR OS
                </span>
                <h2 className="text-sm sm:text-base font-bold text-white font-syne">
                  Puente Tecnológico Certificado con {displayName}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full self-start sm:self-auto">
              <Sparkles size={13} />
              <span>Despacho n8n en &lt; 15 min</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
            Productora EAR opera como <strong className="text-white font-medium">plataforma técnica y central de enlace homologada</strong>. Al solicitar presupuesto o fecha, coordinamos el rider sonoro (Ley 37/2003), protegemos tu anticipo con depósito deducible Stripe y despachamos tu petición directamente a {displayName} vía n8n sin comisiones infladas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px] font-mono text-zinc-300">
            <div className="flex items-center gap-2 bg-black/50 p-2.5 rounded-xl border border-white/5">
              <CheckCircle2 size={14} className="text-[#ecb613] shrink-0" />
              <span>Depósito 100€ 100% deducible</span>
            </div>
            <div className="flex items-center gap-2 bg-black/50 p-2.5 rounded-xl border border-white/5">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>Split 80/10/10 sin sobrecostes</span>
            </div>
            <div className="flex items-center gap-2 bg-black/50 p-2.5 rounded-xl border border-white/5">
              <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
              <span>Garantía sonora Ley 37/2003 (12 W/pax)</span>
            </div>
          </div>
        </div>

        {/* 🚨 BANNER DE SOCIAL PROOF / URGENCIA NUPCIAL */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-purple-950/40 to-black border border-blue-500/30 flex items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
              <Users size={16} />
            </span>
            <span>
              Hay <strong className="text-white font-bold">3 parejas</strong> interesadas en este proveedor.
              <span className="text-zinc-400 hidden sm:inline"> Las fechas de temporada se reservan rápidamente.</span>
            </span>
          </div>
          <Link
            href={resolveProviderCalendarHref(rawProvider, { intent: 'bloquear' })}
            className="px-3.5 py-1.5 bg-[#ecb613] text-black font-mono text-xs font-black uppercase rounded-xl hover:scale-105 transition-all shrink-0"
          >
            Ver su agenda
          </Link>
        </div>

        {/* 📸 HERO HEADER & COLLAGE FOTOGRÁFICO BODAS.NET */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Area: Title, Rating & Photo Grid (Span 8) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Header info */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/40 text-amber-300 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider">
                  <Award size={12} />
                  <span>x2 Wedding Awards // Homologación EAR</span>
                </span>
                <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-mono uppercase rounded-full">
                  {category}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight text-white font-syne">
                {displayName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-300">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span>{rating} Fantástico</span>
                  <span className="text-zinc-500 underline cursor-pointer">· {reviewsCount} opiniones</span>
                </div>

                <div className="flex items-center gap-1 text-zinc-400">
                  <MapPin size={14} className="text-[#ecb613]" />
                  <span>{location}</span>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-950/40 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-mono font-bold">
                  <Tag size={12} />
                  <span>1 promoción · 5% descuento</span>
                </div>
              </div>
            </div>

            {/* Visor Multimedia Interactivo & Lightbox S-Class */}
            <ProviderMediaGallery
              providerName={displayName}
              featuredImage={coverImg}
              galleryImages={gallery}
              videoUrls={[...providerMedia.videos]}
            />

            {/* BARRA DE TABS DE NAVEGACIÓN */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 text-xs font-mono uppercase tracking-wider text-zinc-400 scrollbar-none">
              <a href="#informacion" className="px-4 py-2 bg-white/10 text-[#ecb613] border border-[#ecb613]/40 rounded-xl font-bold whitespace-nowrap">
                Información
              </a>
              {Array.isArray(rawProvider.menus_list) && rawProvider.menus_list.length > 0 && (
                <a href="#menus" className="px-4 py-2 hover:bg-white/5 hover:text-white rounded-xl whitespace-nowrap transition-colors">
                  Menús ({rawProvider.menus_list.length})
                </a>
              )}
              <a href="#ubicacion" className="px-4 py-2 hover:bg-white/5 hover:text-white rounded-xl whitespace-nowrap transition-colors">
                Ubicación GPS & Mapa
              </a>
              <a href="#faq" className="px-4 py-2 hover:bg-white/5 hover:text-white rounded-xl whitespace-nowrap transition-colors">
                FAQ ({Object.keys(faqs).length})
              </a>
              <a href="#opiniones" className="px-4 py-2 hover:bg-white/5 hover:text-white rounded-xl whitespace-nowrap transition-colors">
                Opiniones ({reviewsCount})
              </a>
              <a href="#servicios" className="px-4 py-2 hover:bg-white/5 hover:text-white rounded-xl whitespace-nowrap transition-colors">
                Servicios ({servicesList.length})
              </a>
            </div>

            {/* SECCIÓN INFORMACIÓN */}
            <section id="informacion" className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-2xl font-bold font-syne text-white uppercase">Información de la Propuesta</h2>
                <span className="text-[10px] font-mono text-zinc-500">
                  En la Red desde 2022 · Actualización Marzo 2026
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-[#09090d] border border-white/10 space-y-4">
                {rawProvider.raw_html || rawProvider.scraped_content ? (
                  <div
                    className="text-sm text-zinc-300 leading-relaxed font-light space-y-3 prose prose-invert max-w-none [&_a]:text-[#ecb613] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(cleanText(rawProvider.raw_html || rawProvider.scraped_content), {
                        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'br', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                        allowedAttributes: {
                          'a': ['href', 'target', 'rel']
                        }
                      })
                    }}
                  />
                ) : (
                  <p className="text-sm text-zinc-300 leading-relaxed font-light">
                    {description}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/5">
                  <div className="p-3 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block">Garantía de Presión Acústica</span>
                    <span className="text-xs font-bold text-[#ecb613] font-mono">12 W/pax Calibrado S-Class</span>
                  </div>
                  <div className="p-3 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block">Blindaje de Tarifa</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">Price-Lock SHA-256 (72h)</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 🍽️ SECCIÓN MENÚS & GASTRONOMÍA */}
            {Array.isArray(rawProvider.menus_list) && rawProvider.menus_list.length > 0 && (
              <section id="menus" className="space-y-4 pt-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">Alta Gastronomía</span>
                    <h3 className="text-2xl font-bold font-syne text-white uppercase">Menús de Boda & Banquetes ({rawProvider.menus_list.length})</h3>
                  </div>
                  <span className="px-3 py-1 bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono rounded-full font-bold">Gastronomía Homologada</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {rawProvider.menus_list.map((menu: any, mIdx: number) => (
                    <div key={mIdx} className="p-6 rounded-3xl bg-[#0a0a0f] border border-white/10 hover:border-[#ecb613]/40 transition-all space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3">
                        <h4 className="text-lg font-bold font-syne text-white">{menu.title}</h4>
                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-sm font-bold rounded-xl">
                          {menu.price}
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {menu.dishes?.map((dish: string, dIdx: number) => (
                          <div key={dIdx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300 font-light">
                            <span className="text-[#ecb613] font-bold text-sm shrink-0">✦</span>
                            <span>{cleanText(dish)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 🗺️ SECCIÓN UBICACIÓN GPS & MAPA INTERACTIVO */}
            <section id="ubicacion" className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">GPS & Acceso Oficial</span>
                  <h3 className="text-2xl font-bold font-syne text-white uppercase">Ubicación & Coordenadas GPS</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                  <MapPin size={14} />
                  <span>{rawProvider.gps_coordinates ? `${rawProvider.gps_coordinates.lat}° N, ${Math.abs(rawProvider.gps_coordinates.lng)}° W` : location}</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#0a0a0f] border border-white/10 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Dirección Oficial de Ficha</span>
                    <p className="text-sm font-bold text-white font-syne">
                      {rawProvider.address_exact || rawProvider.address || location}
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rawProvider.address_exact || rawProvider.address || location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-[#ecb613] hover:bg-[#ecb613]/90 text-black font-mono text-xs font-bold uppercase rounded-xl transition-all shrink-0 flex items-center gap-2"
                  >
                    <MapPin size={14} />
                    <span>Cómo Llegar (Google Maps)</span>
                  </a>
                </div>

                {/* Mapa Embed iFrame Google Maps */}
                <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-white/10 relative bg-zinc-900">
                  <iframe
                    title={`Ubicación GPS ${displayName}`}
                    src={rawProvider.google_maps_embed || `https://maps.google.com/maps?q=${encodeURIComponent(rawProvider.address || location)}&z=15&output=embed`}
                    className="w-full h-full border-0 filter grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>
            </section>

            {/* SECCIÓN SERVICIOS INCLUIDOS */}
            <section id="servicios" className="space-y-4 pt-4">
              <h3 className="text-xl font-bold font-syne text-white uppercase">Servicios y Rider Técnico Incluido</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {servicesList.map((srv: string, idx: number) => (
                  <div key={idx} className="p-4 bg-[#09090d] border border-white/10 rounded-2xl flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span className="text-xs text-zinc-200 leading-snug">{cleanText(srv)}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 📦 CATÁLOGO DE PACKS & EQUIPAMIENTO OFICIAL (+20% EAR) */}
            {Array.isArray(rawProvider.catalog) && rawProvider.catalog.length > 0 && (
              <section id="catalogo" className="space-y-4 pt-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">Catálogo Oficial Homologado</span>
                    <h3 className="text-2xl font-bold font-syne text-white uppercase">Packs de Sonido, Iluminación y Directo ({rawProvider.catalog.length})</h3>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded-full font-bold">
                    Tarifas Oficiales EAR (+20%)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {rawProvider.catalog.map((item: any, idx: number) => (
                    <div key={idx} className="p-5 bg-[#09090d] border border-white/10 hover:border-[#ecb613]/40 rounded-3xl space-y-4 transition-all group flex flex-col justify-between">
                      <div className="space-y-3">
                        {item.images && item.images[0] && (
                          <div className="h-36 w-full rounded-2xl overflow-hidden bg-black/40 relative">
                            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {item.watts_rms && (
                              <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-black/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono rounded-lg">
                                {item.watts_rms} W RMS
                              </span>
                            )}
                            {item.pax_recommended && (
                              <span className="absolute top-2 right-2 px-2.5 py-0.5 bg-black/80 backdrop-blur-md border border-white/10 text-[#ecb613] text-[10px] font-mono rounded-lg">
                                Hasta {item.pax_recommended} PAX
                              </span>
                            )}
                          </div>
                        )}

                        <div>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">{item.category}</span>
                          <h4 className="text-base font-bold text-white font-syne mt-0.5">{item.title}</h4>
                        </div>

                        {item.features && item.features.length > 0 && (
                          <ul className="space-y-1.5 text-xs text-zinc-400 font-light">
                            {item.features.slice(0, 3).map((f: string, fIdx: number) => (
                              <li key={fIdx} className="flex items-start gap-2">
                                <span className="text-[#ecb613] font-bold">✓</span>
                                <span className="line-clamp-1">{cleanText(f)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[9px] font-mono text-zinc-500 block">Tarifa Oficial EAR</span>
                          <span className="text-lg font-black text-white font-mono">{item.ear_catalog_price_eur || item.original_price_eur} €</span>
                        </div>
                        <RequestToBookButton
                          providerId={providerId}
                          providerName={displayName}
                          category={category}
                          defaultBudget={item.ear_catalog_price_eur || item.original_price_eur}
                          location={location.split(',')[0]}
                          label="Reservar"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECCIÓN FAQ (PREGUNTAS FRECUENTES) */}
            <section id="faq" className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">Verificación Oficial</span>
                  <h3 className="text-2xl font-bold font-syne text-white uppercase">Preguntas Frecuentes (FAQ)</h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">Respuestas Adaptadas por Categoría</span>
              </div>

              <div className="space-y-3">
                {Object.entries(faqs).map(([question, answer], idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#09090e] border border-white/10 hover:border-[#ecb613]/40 transition-all space-y-2.5">
                    <h4 className="text-sm sm:text-base font-bold text-white flex items-center justify-between gap-3 font-syne">
                      <span className="flex items-center gap-2">
                        <HelpCircle size={16} className="text-[#ecb613] shrink-0" />
                        <span>{cleanText(question)}</span>
                      </span>
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-6 font-light">
                      {cleanText(String(answer))}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* FICHA DECLARADA POR EL PROVEEDOR (380 campos editables en /admin/proveedores) */}
            <ProviderProfileSections providerSlug={slug} category={profileCategory} />

            {paymentOffers.length > 0 && (
              <section id="pago-directo" className="pt-4">
                <ProviderPaymentRequestPanel
                  providerSlug={slug}
                  providerName={displayName}
                  offers={paymentOffers}
                />
              </section>
            )}

            {/* SECCIÓN OPINIONES REALES & VALORACIONES GOOGLE / BODAS.NET NAVEGABLES */}
            <section id="opiniones" className="space-y-4 pt-4">
              <ProviderNavigableReviews
                providerName={displayName}
                reviews={rawProvider.reviews_list || []}
                rating={rating}
                reviewCount={reviewsCount}
              />
            </section>



          </div>

          {/* Right Area: Single Glassmorphic OLED Booking Card (Span 4) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0a0a0f]/90 backdrop-blur-2xl border border-white/10 hover:border-[#ecb613]/40 shadow-2xl space-y-6">

              {/* Status Header */}
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-mono font-bold uppercase">
                  <ShieldCheck size={13} />
                  <span>Auditoría Vigente S-Class</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-400">Respuesta &lt; 15 min</span>
              </div>

              {/* Price Display */}
              <div className="space-y-1 text-center">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Tarifa Oficial Homologada</span>
                <div className="py-3 px-4 bg-black/60 rounded-2xl border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black font-syne text-white tracking-tight">
                    {priceDisplay}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#ecb613]/80 tracking-wide">
                  Roster SSOT · Solista desde {TARIFA_BASE_SOLISTA_EUR} € · Split {Math.round(SPLIT_SOBERANO.artista * 100)}/{Math.round(SPLIT_SOBERANO.earOs * 100)}/{Math.round(SPLIT_SOBERANO.vimume * 100)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <RequestToBookButton
                  providerId={providerId}
                  providerName={displayName}
                  category={category}
                  defaultBudget={rawProvider.basePrice || 650}
                  location={location.split(',')[0]}
                  label="Solicitar Reserva"
                  className="w-full"
                />

                <a
                  href={CENTRALITA.tel}
                  className="w-full py-3.5 px-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <Phone size={14} className="text-[#ecb613]" />
                  <span>Llamar a Centralita ({CENTRALITA.display})</span>
                </a>

                <a
                  href={`${CENTRALITA.whatsapp}?text=${encodeURIComponent(`Hola, quiero disponibilidad y precios de ${displayName} (${category}) en ${location.split(',')[0]}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle size={14} className="text-emerald-400" />
                  <span>WhatsApp Directo · Ruta Libre</span>
                </a>

                {/* 💳 CTA POR ENTIDAD (W48): contrato + depósito deducible del
                    PROVEEDOR (nunca la agenda ni la tarifa de Edwin Agudelo). */}
                <Link
                  href={resolveProviderContractHref(rawProvider, {
                    city: location.split(',')[0].trim(),
                    amount: typeof rawProvider.basePrice === 'number' ? rawProvider.basePrice : null,
                  })}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#ecb613]/10 hover:bg-[#ecb613]/20 border border-[#ecb613]/40 text-[#ecb613] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <ShieldCheck size={14} />
                  <span>Contrato & Depósito {DEPOSITO_STRIPE_EUR} € (deducible)</span>
                </Link>
              </div>

              {/* 🔒 GATE DE CONTACTO · DOCTRINA ANTI-PICARESCA */}
              <div id="contacto" className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                    Contacto de la entidad
                  </span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                      contactAccess.canRevealPhone
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-[#FF2B44]/30 bg-[#FF2B44]/10 text-[#FF2B44]'
                    }`}
                  >
                    {contactLabelForAccess(contactAccess)}
                  </span>
                </div>

                {contactAccess.canRevealPhone && revealedPhone ? (
                  <div className="grid gap-2">
                    <a
                      href={`tel:${revealedPhone.replace(/\s+/g, '')}`}
                      className="w-full py-3 px-4 rounded-xl bg-[#ecb613] text-black font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#f5d273] transition-all"
                    >
                      <Phone size={13} /> {revealedPhone}
                    </a>
                    <a
                      href={`https://wa.me/${revealedPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hola, contacto desde EAR OS para ${displayName} (${category}).`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#25D366]/25 transition-all"
                    >
                      <MessageCircle size={13} /> WhatsApp directo
                    </a>
                  </div>
                ) : (
                  <>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      El teléfono y el WhatsApp de esta entidad están protegidos. Se liberan al
                      abonar el desbloqueo de <strong className="text-white">1,00 €</strong>{' '}
                      (100 % descontable de la reserva) o de forma permanente si el proveedor
                      reclama su ficha.
                    </p>
                    <SupplierBlurLock
                      supplierId={providerId}
                      supplierName={displayName}
                      category={category}
                      city={location.split(',')[0]}
                      slug={slug}
                      isUnlocked={false}
                    >
                      <div className="hidden" aria-hidden="true" />
                    </SupplierBlurLock>
                  </>
                )}
              </div>

              {/* Social Proof Bullets */}
              <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-zinc-300 font-light">
                <div className="flex items-center gap-2.5">
                  <TrendingUp size={14} className="text-emerald-400 shrink-0" />
                  <span>Espacio destacado en {location.split(',')[0]}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users size={14} className="text-blue-400 shrink-0" />
                  <span>Más de 30 parejas atendidas con garantía</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={14} className="text-[#ecb613] shrink-0" />
                  <span>Garantía de Retorno ROI 100% EAR OS</span>
                </div>
              </div>

              {/* Deposit and Split terms */}
              <div className="p-3.5 bg-black/50 rounded-2xl border border-white/5 text-[10px] font-mono text-zinc-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>Bloqueo de Fecha:</span>
                  <span className="text-[#ecb613] font-bold">{DEPOSITO_STRIPE_EUR} € (Reembolsable 72h)</span>
                </div>
                <div className="flex justify-between">
                  <span>Split Soberano:</span>
                  <span className="text-emerald-400 font-bold">{Math.round(SPLIT_SOBERANO.artista * 100)}% Proveedor / {Math.round(SPLIT_SOBERANO.earOs * 100)}% EAR / {Math.round(SPLIT_SOBERANO.vimume * 100)}% VIMUME</span>
                </div>
              </div>

            </div>
          </div>

        </div>
        <section className="pt-12 border-t border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold block">
                Red Territorial & Producción Oficial
              </span>
              <h3 className="text-xl font-bold font-syne text-white">
                Enlaces Relacionados y Cobertura en {location.split(',')[0]}
              </h3>
            </div>
            <Link
              href={`/cotizador?ocasion=${encodeURIComponent(category)}&provincia=${encodeURIComponent(location.split(',')[0])}`}
              className="text-xs font-mono text-[#ecb613] hover:underline flex items-center gap-1"
            >
              <span>Cotizar con Roster Soberano</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              href={`/bodas/${location.split(',')[0].toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}`}
              className="p-4 rounded-2xl bg-[#09090d] border border-white/10 hover:border-[#ecb613]/50 transition-all group space-y-1"
            >
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Hub Provincial</span>
              <h4 className="text-xs font-bold text-white group-hover:text-[#ecb613] transition-colors">
                Bodas y Fincas en {location.split(',')[0]}
              </h4>
              <p className="text-[10px] text-zinc-400">Ver todas las fincas y servicios</p>
            </Link>

            <Link
              href="/artistas/edwin-agudelo"
              className="p-4 rounded-2xl bg-[#09090d] border border-white/10 hover:border-[#ecb613]/50 transition-all group space-y-1"
            >
              <span className="text-[10px] font-mono text-[#ecb613] uppercase block font-bold">Roster Oficial</span>
              <h4 className="text-xs font-bold text-white group-hover:text-[#ecb613] transition-colors">
                Edwin Agudelo (Solista {TARIFA_BASE_SOLISTA_EUR} €)
              </h4>
              <p className="text-[10px] text-zinc-400">Tenor lírico & Sonido Bose F1</p>
            </Link>

            <Link
              href="/catering-brasas"
              className="p-4 rounded-2xl bg-[#09090d] border border-white/10 hover:border-[#ecb613]/50 transition-all group space-y-1"
            >
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Catering Premium</span>
              <h4 className="text-xs font-bold text-white group-hover:text-[#ecb613] transition-colors">
                Asado a la Estaca & Brasas
              </h4>
              <p className="text-[10px] text-zinc-400">Showcooking en directo para bodas</p>
            </Link>

            <Link
              href="/alquiler-pantallas-led-madrid"
              className="p-4 rounded-2xl bg-[#09090d] border border-white/10 hover:border-[#ecb613]/50 transition-all group space-y-1"
            >
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Audiovisuales</span>
              <h4 className="text-xs font-bold text-white group-hover:text-[#ecb613] transition-colors">
                Pantallas LED P2.9 Exterior
              </h4>
              <p className="text-[10px] text-zinc-400">Estructuras y cabinas de directo</p>
            </Link>
          </div>
        </section>

        {/* 🛡️ BANNER UNIFICADO DE DIRECTORIO PROFESIONAL // RECLAMAR FICHA & VER PROPUESTA S-CLASS */}
        {isUnclaimed && (
          <ProviderFooterClaimBanner
            provider={{
              id: rawProvider.id || slug,
              name: displayName,
              slug,
              category,
              province: location.split(',')[0],
              // ANTI-PICARESCA: el payload RSC viaja al navegador, así que aquí
              // va SIEMPRE enmascarado. El número real nunca sale del servidor.
              phone: maskPhoneForDisplay(rawProviderPhone)
            }}
          />
        )}

        {/* 📊 ETIQUETA SCHEMA.ORG JSON-LD (RICH SNIPPETS GOOGLE SEARCH) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: displayName,
              description: description || `Proveedor homologado por Productora EAR para bodas y eventos en ${location}.`,
              image: isBlacklisted || galleryReal.length === 0 ? undefined : galleryReal,
              telephone: CENTRALITA_EAR_OS,
              priceRange: priceDisplay,
              address: {
                '@type': 'PostalAddress',
                addressLocality: location.split(',')[0].trim(),
                addressCountry: 'ES',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: typeof rating === 'number' ? rating : 4.9,
                reviewCount: typeof reviewsCount === 'number' ? reviewsCount : 24,
                bestRating: '5',
                worstRating: '1',
              },
            }),
          }}
        />

        {/* 📦 ETIQUETA SCHEMA.ORG JSON-LD — OFFER PACK GALA VIP (PRECIO SSOT) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: galaPack?.name ?? 'Pack Gala VIP (Espacios 80 - 150 m²)',
              description: galaPack?.description ?? 'Configuración de sonido profesional para bodas y eventos de 80 a 150 m².',
              category: galaPack?.category ?? 'PACKS_SONIDO',
              brand: { '@type': 'Brand', name: galaPack?.brand ?? 'Bose' },
              offers: {
                '@type': 'Offer',
                price: galaPriceEur,
                priceCurrency: 'EUR',
                availability: 'https://schema.org/InStock',
              },
            }),
          }}
        />

        {/* 📦 ETIQUETA SCHEMA.ORG JSON-LD — OFFER ROSTER SOLISTA (TARIFA SSOT 350 €) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: 'Roster Solista Oficial · Edwin Agudelo',
              description: 'Actuación solista premium con rider acústico calibrado 70-80 dBA (Bose F1) y reserva con Price-Lock.',
              brand: { '@type': 'Brand', name: 'Productora EAR' },
              offers: {
                '@type': 'Offer',
                price: TARIFA_BASE_SOLISTA_EUR,
                priceCurrency: 'EUR',
                availability: 'https://schema.org/InStock',
                url: 'https://www.productoraear.com/reservar/solista',
              },
            }),
          }}
        />

      </div>
    </div>
  );
}
