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
            className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-16"
        >
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: venueJsonLd() }} />

            {/* ━━━ 1. HERO: CARRUSEL CON TODAS LAS IMÁGENES VAMPIRIZADAS ━━━ */}
            <div className="relative h-[560px] sm:h-[640px] rounded-3xl overflow-hidden border border-white/10 bg-black/40">
                <CinematicVanguardCarousel
                    images={photos}
                    title={`Galería de ${EZKERTZA_DERIO_VENUE.name}`}
                    className="h-full w-full"
                    aspectRatio="wide"
                    defaultMode="cinema"
                    autoPlayInterval={5500}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/35 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 pointer-events-none">
                    <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:justify-between">
                        <div className="space-y-3 max-w-2xl">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/15 border border-[#ecb613]/40 text-[#ecb613] text-xs font-mono tracking-wider backdrop-blur-md">
                                <MapPin className="w-4 h-4" />
                                {EZKERTZA_DERIO_VENUE.municipality} · {EZKERTZA_DERIO_VENUE.provinceAlias}
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
                                {EZKERTZA_DERIO_VENUE.name}
                            </h2>
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-extrabold text-white">
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
                        <div className="flex flex-col gap-3 w-full sm:w-auto pointer-events-auto">
                            <a
                                href={blockHref}
                                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#ecb613] via-[#f7cb45] to-[#ecb613] text-black font-extrabold text-sm hover:brightness-110 transition-all shadow-xl shadow-[#ecb613]/25 flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <CalendarCheck className="w-5 h-5" />
                                Solicitar presupuesto
                            </a>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-7 py-4 rounded-2xl bg-[#09090d]/85 text-white font-semibold text-sm hover:bg-white/10 transition-all border border-white/15 flex items-center justify-center gap-2.5 backdrop-blur-md"
                            >
                                <MessageCircle className="w-5 h-5 text-emerald-400" />
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

            {/* ━━━ 2. PRUEBA SOCIAL INMEDIATA ━━━ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="p-4 rounded-2xl border border-white/10 bg-[#09090d]/80 text-center">
                    <p className="text-2xl font-extrabold text-white">{formatRating(EZKERTZA_DERIO_VENUE.rating)}</p>
                    <p className="text-[11px] font-mono text-gray-500">Valoración media</p>
                </div>
                <div className="p-4 rounded-2xl border border-white/10 bg-[#09090d]/80 text-center">
                    <p className="text-2xl font-extrabold text-white">{EZKERTZA_DERIO_VENUE.reviewCount}</p>
                    <p className="text-[11px] font-mono text-gray-500">Opiniones</p>
                </div>
                <div className="p-4 rounded-2xl border border-white/10 bg-[#09090d]/80 text-center">
                    <p className="text-2xl font-extrabold text-[#ecb613]">{EZKERTZA_DERIO_VENUE.recommendationPercent}%</p>
                    <p className="text-[11px] font-mono text-gray-500">Recomiendan</p>
                </div>
                <div className="p-4 rounded-2xl border border-white/10 bg-[#09090d]/80 text-center">
                    <p className="text-2xl font-extrabold text-white">{EZKERTZA_DERIO_VENUE.guestRange}</p>
                    <p className="text-[11px] font-mono text-gray-500">Aforo banquete</p>
                </div>
            </div>

            {/* ━━━ 3. RESEÑAS EN CARRUSEL VANGUARDISTA (gated por LLAVE SOBERANA) ━━━ */}
            <div className="mt-16">
                {unlocked ? (
                    <div className="space-y-4">
                        <h3 className="text-2xl font-extrabold text-white">
                            Lo que cuentan las parejas
                        </h3>
                        <VenueReviewsCarousel reviews={EZKERTZA_DERIO_VENUE.reviews} />
                    </div>
                ) : (
                    <div className="rounded-3xl border border-[#ecb613]/25 bg-gradient-to-r from-[#141209] to-[#09090d] p-8 sm:p-10 flex flex-col sm:flex-row items-start gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center shrink-0">
                            <Lock className="w-6 h-6 text-[#ecb613]" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-white">
                                Ficha profunda bajo llave soberana
                            </h3>
                            <p className="text-sm text-gray-300 leading-relaxed max-w-3xl">
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

            {/* ━━━ 4. VÍDEO OFICIAL ━━━ */}
            <div className="grid grid-cols-1 gap-6 mt-16">
                <div className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white">Vídeo oficial del caserío</h3>
                    <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                        <iframe
                            src={`https://player.vimeo.com/video/${EZKERTZA_DERIO_VENUE.media.officialVideo.videoId}?title=0&byline=0&portrait=0&dnt=1`}
                            title="Vídeo oficial del Restaurante Ezkertza Berria"
                            className="w-full h-full"
                            loading="lazy"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                        Vídeo publicado por el propio caserío (ezkertzaberria.com). En
                        producción el iframe exigirá consentimiento de cookies (RGPD) y CSP
                        (SEC-7) — pendiente de G-6.
                    </p>
                </div>
            </div>

            {/* ━━━ 5. ESPACIOS · SERVICIOS · LOCALIZACIÓN ━━━ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="p-6 rounded-3xl border border-white/10 bg-[#09090d]/80 space-y-4">
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
                <div className="p-6 rounded-3xl border border-white/10 bg-[#09090d]/80 space-y-4">
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
                <div className="p-6 rounded-3xl border border-white/10 bg-[#09090d]/80 space-y-4">
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
                <h3 className="text-2xl font-extrabold text-white">Menús y promociones</h3>
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
                <h3 className="text-2xl font-extrabold text-white">Preguntas frecuentes</h3>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-16">
                <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#09090d]/80 space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#ecb613]" />
                        Dónde estamos
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {EZKERTZA_DERIO_VENUE.fullAddress}
                    </p>
                    <a
                        href={MAPS_SEARCH_HREF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-white text-xs font-semibold hover:border-[#ecb613]/50 hover:bg-white/5 transition-all duration-300 ease-out"
                    >
                        <ExternalLink className="w-4 h-4 text-[#ecb613]" />
                        Abrir mapa
                    </a>
                </div>
                <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#09090d]/80 space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Bus className="w-4 h-4 text-[#00E5FF]" />
                        Accesos y logística
                    </h3>
                    <ul className="space-y-3">
                        {EZKERTZA_DERIO_VENUE.location.map((item) => (
                            <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                                <CheckCircle2 className="w-4 h-4 text-[#ecb613] shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <p className="text-xs text-gray-500 leading-relaxed pt-2 border-t border-white/10">
                        Transporte de invitados disponible como servicio del caserío: la
                        logística se cierra en la visita técnica con la Conserjería EAR OS.
                    </p>
                </div>
            </div>

            {/* ━━━ 9. CTA FINAL: VISITA TÉCNICA ━━━ */}
            <div className="mt-16 rounded-3xl border border-[#ecb613]/25 bg-gradient-to-r from-[#141209] via-[#0e0e14] to-[#09090d] p-8 sm:p-12 text-center space-y-6">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Reserva tu visita técnica al caserío
                </h3>
                <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    Conoce los jardines, la carpa de ceremonias y los salones en una visita
                    privada, y deja tu fecha bloqueada con depósito 100% deducible del
                    presupuesto final.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                        href={visitHref}
                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ecb613] via-[#f7cb45] to-[#ecb613] text-black font-extrabold text-sm hover:brightness-110 transition-all shadow-xl shadow-[#ecb613]/25 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2.5"
                    >
                        <CalendarCheck className="w-5 h-5" />
                        Pedir visita técnica
                    </a>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 rounded-2xl bg-[#09090d]/80 border border-white/15 text-white font-semibold text-sm hover:bg-white/10 transition-all backdrop-blur-md inline-flex items-center gap-2.5"
                    >
                        <MessageCircle className="w-5 h-5 text-emerald-400" />
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





