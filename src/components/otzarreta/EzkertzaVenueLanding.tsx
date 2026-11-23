import React from 'react';
import {
    Star,
    MapPin,
    Users,
    Sparkles,
    UtensilsCrossed,
    Music,
    Bus,
    Palette,
    TreePine,
    Car,
    PartyPopper,
    CalendarCheck,
    MessageCircle,
    Award,
    Camera,
    CheckCircle2,
    ChevronDown,
    ExternalLink,
    Lock,
} from 'lucide-react';
import { EZKERTZA_DERIO_VENUE } from '@/lib/constants/ezkertza-derio-venue';
import CinematicVanguardCarousel from '@/components/sclass/CinematicVanguardCarousel';
import VenueReviewsCarousel from './VenueReviewsCarousel';
import VenueExperienceHub from './VenueExperienceHub';
import { EzkertzaCinematicJourney } from './EzkertzaCinematicJourney';
import { PartnerShowcaseMetricsPanel } from './PartnerShowcaseMetricsPanel';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * LANDING DEL VENUE — RESTAURANTE EZKERTZA BERRIA (DERIO · BIZKAIA)
 * ════════════════════════════════════════════════════════════════════════════
 * Orden CEO 2026-10-31: formato landing (flujo Hormozi), cero scroll infinito
 * (acordeones <details>), hero con carrusel de TODAS las imágenes
 * vampirizadas, opiniones en carrusel vanguardista automático+interactivo,
 * galerías en varias vistas (CinematicVanguardCarousel) y LLAVE SOBERANA:
 * la ficha profunda (reseñas, bodas reales, promos, menús) NO se renderiza
 * mientras `EZKERTZA_DERIO_VENUE.sovereignDataUnlocked === false`.
 * Componente server: render estático, indexable, cero datos personales.
 * ════════════════════════════════════════════════════════════════════════════
 */

interface EzkertzaVenueLandingProps {
    /** CTA de bloqueo de fecha / presupuesto (calendario soberano del proveedor). */
    readonly blockHref: string;
    /** CTA de visita técnica. */
    readonly visitHref: string;
    /** WhatsApp de la Conserjería EAR OS con mensaje pre-cualificado. */
    readonly whatsappUrl: string;
}

type IconComponent = React.ComponentType<{ className?: string }>;

const SPACE_ICONS: readonly IconComponent[] = [
    UtensilsCrossed,
    TreePine,
    Sparkles,
    PartyPopper,
    Music,
    Car,
];

const SERVICE_ICONS: readonly IconComponent[] = [
    UtensilsCrossed,
    Award,
    Camera,
    Music,
    Bus,
    Palette,
];

const MAPS_SEARCH_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    EZKERTZA_DERIO_VENUE.fullAddress,
)}`;

function formatRating(rating: number): string {
    return rating.toFixed(1).replace('.', ',');
}

function StarRow({ rating }: { rating: number }): React.JSX.Element {
    const percent = Math.min(100, Math.max(0, (rating / 5) * 100));
    const row = (colorClass: string): React.JSX.Element => (
        <div className={`flex gap-0.5 flex-nowrap ${colorClass}`}>
            {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-4 h-4 shrink-0" />
            ))}
        </div>
    );
    return (
        <span className="relative inline-flex" role="img" aria-label={`Valoración ${formatRating(rating)} de 5`}>
            {row('text-zinc-700')}
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${percent}%` }}>
                {row('text-[#ecb613]')}
            </span>
        </span>
    );
}

function venueJsonLd(): string {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        '@id': 'https://productoraear.com/otzarreta#ezkertza-derio',
        name: EZKERTZA_DERIO_VENUE.name,
        description: EZKERTZA_DERIO_VENUE.about.description,
        address: {
            '@type': 'PostalAddress',
            streetAddress: EZKERTZA_DERIO_VENUE.streetAddress,
            addressLocality: EZKERTZA_DERIO_VENUE.municipality,
            addressRegion: EZKERTZA_DERIO_VENUE.province,
            postalCode: EZKERTZA_DERIO_VENUE.postalCode,
            addressCountry: 'ES',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: EZKERTZA_DERIO_VENUE.geo.lat,
            longitude: EZKERTZA_DERIO_VENUE.geo.lng,
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: EZKERTZA_DERIO_VENUE.rating,
            reviewCount: EZKERTZA_DERIO_VENUE.reviewCount,
            bestRating: EZKERTZA_DERIO_VENUE.ratingMax,
            worstRating: 1,
        },
    }).replace(/</g, '\\u003c');
}

export function EzkertzaVenueLanding({
    blockHref,
    visitHref,
    whatsappUrl,
}: EzkertzaVenueLandingProps): React.JSX.Element {
    const unlocked = EZKERTZA_DERIO_VENUE.sovereignDataUnlocked;
    const photos: string[] = [...EZKERTZA_DERIO_VENUE.media.galleryPhotos];

    return (
        <section
            id="ficha-ezkertza-derio"
            aria-label="Landing del venue Restaurante Ezkertza Berria"
            className="relative mx-auto my-12 w-full max-w-7xl px-4 sm:my-16 sm:px-6 lg:px-8"
        >
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: venueJsonLd() }} />

            {/* ━━━ 1. HERO: CARRUSEL CON TODAS LAS IMÁGENES VAMPIRIZADAS ━━━
                Alto fluido: 560 px fijos aplastaban los CTAs en 360 px. */}
            <div className="relative min-h-[600px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 sm:min-h-[640px]">
                <CinematicVanguardCarousel
                    images={photos}
                    title={`Galería de ${EZKERTZA_DERIO_VENUE.name}`}
                    className="absolute inset-0 h-full w-full"
                    aspectRatio="wide"
                    defaultMode="cinema"
                    autoPlayInterval={5500}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/35 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-10 pointer-events-none">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
                        <div className="min-w-0 max-w-2xl space-y-3">
                            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#ecb613]/40 bg-[#ecb613]/15 px-3 py-1.5 text-[11px] font-mono tracking-wider text-[#ecb613] backdrop-blur-md sm:px-4 sm:text-xs">
                                <MapPin className="w-4 h-4 shrink-0" />
                                <span className="min-w-0 truncate">
                                    {EZKERTZA_DERIO_VENUE.municipality} · {EZKERTZA_DERIO_VENUE.provinceAlias}
                                </span>
                            </span>
                            <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg [overflow-wrap:break-word] sm:text-5xl">
                                {EZKERTZA_DERIO_VENUE.name}
                            </h2>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-extrabold text-white sm:text-2xl">
                                        {formatRating(EZKERTZA_DERIO_VENUE.rating)}
                                    </span>
                                    <StarRow rating={EZKERTZA_DERIO_VENUE.rating} />
                                    <span className="text-xs text-gray-300">
                                        {EZKERTZA_DERIO_VENUE.reviewCount} opiniones
                                    </span>
                                </div>
                                <span className="hidden sm:flex items-center gap-1.5 text-xs text-gray-300">
                                    <Users className="w-4 h-4 text-[#00E5FF]" />
                                    Recomendado por el {EZKERTZA_DERIO_VENUE.recommendationPercent}% de las parejas
                                </span>
                            </div>
                        </div>
                        <div className="pointer-events-auto flex w-full flex-col gap-3 sm:w-auto">
                            <a
                                href={blockHref}
                                data-ear-track="deposit-lock"
                                className="flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#ecb613] via-[#f7cb45] to-[#ecb613] px-5 py-4 text-sm font-extrabold text-black shadow-xl shadow-[#ecb613]/25 transition-all hover:brightness-110 active:scale-[0.98] sm:w-auto sm:px-7"
                            >
                                <CalendarCheck className="w-5 h-5 shrink-0" />
                                Solicitar presupuesto
                            </a>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-2xl border border-white/15 bg-[#09090d]/85 px-5 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 sm:w-auto sm:px-7"
                            >
                                <MessageCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                                Consultar disponibilidad
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* ━━━ 1B. HUB DE EXPERIENCIA: AUDIENCIA · TEMPERATURA · SIMULADOR ━━━ */}
            <VenueExperienceHub
                blockHref={blockHref}
                visitHref={visitHref}
                whatsappUrl={whatsappUrl}
            />

            {/* ━━━ 1C. RECORRIDO CINEMÁTICO + GALERÍA PANORÁMICA (W46_T02) ━━━
                Vista de pájaro Bilbao→Derio, llegada del coche nupcial, salón y
                cartas en cristal líquido. Sin recortes, sin verticales en el
                carrusel principal y sin iframes de terceros. */}
            <EzkertzaCinematicJourney
                blockHref={blockHref}
                whatsappUrl={whatsappUrl}
            />

            {/* ━━━ 2. PRUEBA SOCIAL INMEDIATA ━━━ */}
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="min-w-0 rounded-2xl border border-white/10 bg-[#09090d]/80 p-3 text-center sm:p-4">
                    <p className="text-xl font-extrabold text-white sm:text-2xl">{formatRating(EZKERTZA_DERIO_VENUE.rating)}</p>
                    <p className="text-[11px] font-mono text-gray-500">Valoración media</p>
                </div>
                <div className="min-w-0 rounded-2xl border border-white/10 bg-[#09090d]/80 p-3 text-center sm:p-4">
                    <p className="text-xl font-extrabold text-white sm:text-2xl">{EZKERTZA_DERIO_VENUE.reviewCount}</p>
                    <p className="text-[11px] font-mono text-gray-500">Opiniones</p>
                </div>
                <div className="min-w-0 rounded-2xl border border-white/10 bg-[#09090d]/80 p-3 text-center sm:p-4">
                    <p className="text-xl font-extrabold text-[#ecb613] sm:text-2xl">{EZKERTZA_DERIO_VENUE.recommendationPercent}%</p>
                    <p className="text-[11px] font-mono text-gray-500">Recomiendan</p>
                </div>
                <div className="min-w-0 rounded-2xl border border-white/10 bg-[#09090d]/80 p-3 text-center sm:p-4">
                    <p className="text-xl font-extrabold text-white sm:text-2xl">{EZKERTZA_DERIO_VENUE.guestRange}</p>
                    <p className="text-[11px] font-mono text-gray-500">Aforo banquete</p>
                </div>
            </div>

            {/* ━━━ 3. RESEÑAS EN CARRUSEL VANGUARDISTA (gated por LLAVE SOBERANA) ━━━ */}
            <div className="mt-16">
                {unlocked ? (
                    <div className="space-y-4">
                        <h3 className="text-xl font-extrabold leading-tight text-white [overflow-wrap:break-word] sm:text-2xl">
                            Lo que cuentan las parejas
                        </h3>
                        <VenueReviewsCarousel reviews={EZKERTZA_DERIO_VENUE.reviews} />
                    </div>
                ) : (
                    <div className="flex flex-col items-start gap-5 rounded-3xl border border-[#ecb613]/25 bg-gradient-to-r from-[#141209] to-[#09090d] p-5 sm:flex-row sm:p-10 sm:gap-6">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/10">
                            <Lock className="w-6 h-6 text-[#ecb613]" />
                        </div>
                        <div className="min-w-0 space-y-2">
                            <h3 className="text-lg font-bold text-white">
                                Ficha profunda bajo llave soberana
                            </h3>
                            <p className="max-w-3xl text-sm text-gray-300 leading-relaxed">
                                Las reseñas íntegras, las bodas reales, las promociones y los
                                menús detallados de la ficha se publican únicamente cuando la
                                alianza con el caserío está activa. Lo que ves hoy procede de
                                la web pública del propio caserío: cero datos ingeridos
                                expuestos sin contrato.
                            </p>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-[#ecb613] hover:brightness-125 transition-all"
                            >
                                Activar la alianza con la Conserjería EAR OS
                                <ChevronDown className="w-4 h-4 -rotate-90" />
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {/* ━━━ 4. ESPACIOS · SERVICIOS · LOCALIZACIÓN ━━━ */}
            {/* El vídeo oficial ya se sirve como enlace soberano (sin iframe ni cookies de
                terceros) desde EzkertzaCinematicJourney: RGPD/SEC-7 sin duplicar el player. */}
            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
                <div className="min-w-0 space-y-4 rounded-3xl border border-white/10 bg-[#09090d]/80 p-5 sm:p-6">
                    <h3 className="text-base font-bold text-white">Espacios</h3>
                    <ul className="space-y-3">
                        {EZKERTZA_DERIO_VENUE.spaces.map((space, index) => {
                            const SpaceIcon = SPACE_ICONS[index] ?? Sparkles;
                            return (
                                <li key={space} className="flex items-center gap-2.5 text-sm text-gray-300">
                                    <SpaceIcon className="w-4 h-4 text-[#ecb613] shrink-0" />
                                    {space}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="min-w-0 space-y-4 rounded-3xl border border-white/10 bg-[#09090d]/80 p-5 sm:p-6">
                    <h3 className="text-base font-bold text-white">Servicios</h3>
                    <ul className="space-y-3">
                        {EZKERTZA_DERIO_VENUE.services.map((service, index) => {
                            const ServiceIcon = SERVICE_ICONS[index] ?? Sparkles;
                            return (
                                <li key={service} className="flex items-center gap-2.5 text-sm text-gray-300">
                                    <ServiceIcon className="w-4 h-4 text-[#00E5FF] shrink-0" />
                                    {service}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="min-w-0 space-y-4 rounded-3xl border border-white/10 bg-[#09090d]/80 p-5 sm:p-6">
                    <h3 className="text-base font-bold text-white">Datos de interés</h3>
                    <ul className="space-y-3">
                        {EZKERTZA_DERIO_VENUE.datosDeInteres.map((item) => (
                            <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                                <CheckCircle2 className="w-4 h-4 text-[#ecb613] shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ━━━ 6. MENÚS Y PROMOS EN ACORDEÓN (gated) ━━━ */}
            <div className="mt-16 space-y-3">
                <h3 className="text-xl font-extrabold leading-tight text-white [overflow-wrap:break-word] sm:text-2xl">Menús y promociones</h3>
                {unlocked ? (
                    <>
                        {EZKERTZA_DERIO_VENUE.promos.map((promo) => (
                            <details
                                key={promo.title}
                                className="group rounded-2xl border border-[#ecb613]/25 bg-gradient-to-r from-[#141209] to-[#09090d] p-5"
                            >
                                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                                    <span className="flex items-center gap-3 text-sm font-bold text-white">
                                        <span className="px-3 py-1 rounded-full bg-[#ecb613]/15 border border-[#ecb613]/40 text-[#ecb613] text-[11px] font-mono">
                                            {promo.badge}
                                        </span>
                                        {promo.title}
                                    </span>
                                    <ChevronDown className="w-5 h-5 text-[#ecb613] transition-transform duration-300 group-open:rotate-180" />
                                </summary>
                                <p className="pt-4 text-sm text-gray-300 leading-relaxed">{promo.detail}</p>
                            </details>
                        ))}
                        {EZKERTZA_DERIO_VENUE.menus.map((menu) => (
                            <details
                                key={menu.name}
                                data-ear-track="menu-simulator"
                                className="group rounded-2xl border border-white/10 bg-[#09090d]/80 p-5"
                            >
                                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                                    <span className="flex items-center gap-3 text-sm font-bold text-white">
                                        <UtensilsCrossed className="w-4 h-4 text-[#ecb613]" />
                                        {menu.name}
                                        {menu.badge ? (
                                            <span className="px-2.5 py-0.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-mono">
                                                {menu.badge}
                                            </span>
                                        ) : null}
                                    </span>
                                    <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-300 group-open:rotate-180" />
                                </summary>
                                <p className="pt-4 text-sm text-gray-300 leading-relaxed">{menu.description}</p>
                            </details>
                        ))}
                        <p className="text-xs text-gray-500 pt-2">
                            Simulador completo de banquetes y cotizador oficial en el módulo
                            inferior de la página. Suelo de menú: desde {EZKERTZA_DERIO_VENUE.menusFromEur} €
                            + IVA por comensal (SSOT).
                        </p>
                    </>
                ) : (
                    <div className="rounded-2xl border border-white/10 bg-[#09090d]/80 p-6">
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Los menús oficiales y las promociones activas se publican al
                            activar la alianza. Para una cotización inmediata, usa el
                            cotizador de la Conserjería EAR OS.
                        </p>
                    </div>
                )}
            </div>

            {/* ━━━ 7. FAQ EN ACORDEÓN (cero scroll infinito) ━━━ */}
            <div className="mt-16 space-y-3">
                <h3 className="text-xl font-extrabold leading-tight text-white [overflow-wrap:break-word] sm:text-2xl">Preguntas frecuentes</h3>
                {EZKERTZA_DERIO_VENUE.faqs.map((faq) => (
                    <details
                        key={faq.question}
                        className="group rounded-2xl border border-white/10 bg-[#09090d]/80 p-5"
                    >
                        <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                            <span className="text-sm font-bold text-white">{faq.question}</span>
                            <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 group-open:rotate-180" />
                        </summary>
                        <p className="pt-4 text-sm text-gray-300 leading-relaxed">{faq.answer}</p>
                    </details>
                ))}
            </div>

            {/* ━━━ 8. MAPA + LOGÍSTICA ━━━ */}
            <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6 sm:mt-16">
                <div className="min-w-0 space-y-4 rounded-3xl border border-white/10 bg-[#09090d]/80 p-5 sm:p-8">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4 shrink-0 text-[#ecb613]" />
                        Dónde estamos
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {EZKERTZA_DERIO_VENUE.fullAddress}
                    </p>
                    <a
                        href={MAPS_SEARCH_HREF}
                        data-ear-track="map-route"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-xs font-semibold text-white transition-all duration-300 ease-out hover:border-[#ecb613]/50 hover:bg-white/5"
                    >
                        <ExternalLink className="w-4 h-4 shrink-0 text-[#ecb613]" />
                        Abrir mapa
                    </a>
                </div>
                <div className="min-w-0 space-y-4 rounded-3xl border border-white/10 bg-[#09090d]/80 p-5 sm:p-8">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Bus className="w-4 h-4 shrink-0 text-[#00E5FF]" />
                        Accesos y logística
                    </h3>
                    <ul className="space-y-3">
                        {EZKERTZA_DERIO_VENUE.location.map((item) => (
                            <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#ecb613]" />
                                <span className="min-w-0">{item}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-xs text-gray-500 leading-relaxed pt-2 border-t border-white/10">
                        Transporte de invitados disponible como servicio del caserío: la
                        logística se cierra en la visita técnica con la Conserjería EAR OS.
                    </p>
                </div>
            </div>

            {/* ━━━ 8bis. PANEL DE ALIANZA: ESCAPARATE SOBERANO + TELEMETRÍA (Eduardo) ━━━ */}
            <PartnerShowcaseMetricsPanel />

            {/* ━━━ 9. CTA FINAL: VISITA TÉCNICA ━━━ */}
            <div className="mt-12 space-y-6 rounded-3xl border border-[#ecb613]/25 bg-gradient-to-r from-[#141209] via-[#0e0e14] to-[#09090d] p-5 text-center sm:mt-16 sm:p-12">
                <h3 className="text-xl font-extrabold leading-tight text-white [overflow-wrap:break-word] sm:text-3xl">
                    Reserva tu visita técnica al caserío
                </h3>
                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-300">
                    Conoce los jardines, la carpa de ceremonias y los salones en una visita
                    privada, y deja tu fecha bloqueada con depósito 100% deducible del
                    presupuesto final.
                </p>
                <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                    <a
                        href={visitHref}
                        data-ear-track="visit-request"
                        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#ecb613] via-[#f7cb45] to-[#ecb613] px-6 py-4 text-sm font-extrabold text-black shadow-xl shadow-[#ecb613]/25 transition-all hover:brightness-110 active:scale-[0.98] sm:w-auto sm:px-8"
                    >
                        <CalendarCheck className="w-5 h-5 shrink-0" />
                        Pedir visita técnica
                    </a>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-2xl border border-white/15 bg-[#09090d]/80 px-6 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 sm:w-auto sm:px-8"
                    >
                        <MessageCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                        Consultar por WhatsApp
                    </a>
                </div>
                <p className="text-[11px] font-mono text-gray-500">
                    Peaje soberano: toda la coordinación pasa por la Conserjería EAR OS.
                </p>
            </div>
        </section>
    );
}





