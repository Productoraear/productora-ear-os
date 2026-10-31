import React from 'react';
import {
    Star,
    MapPin,
    Clock,
    Users,
    Sparkles,
    BadgePercent,
    UtensilsCrossed,
    Camera,
    Music,
    Bus,
    Palette,
    TreePine,
    Car,
    PartyPopper,
    Video,
    CalendarCheck,
    MessageCircle,
    Award,
    CheckCircle2,
    ChevronDown,
    ExternalLink,
} from 'lucide-react';
import { EZKERTZA_DERIO_VENUE } from '@/lib/constants/ezkertza-derio-venue';
import { OTZARRETA_ENTITY } from '@/lib/constants/otzarreta-entity';

/**
 * FICHA COMPLETA DEL VENUE — RESTAURANTE EZKERTZA BERRIA (DERIO · BIZKAIA)
 * Componente 100% server (sin `use client`): render estático, indexable y con
 * cero datos personales. Los CTAs se reciben por props y salen SIEMPRE por el
 * peaje soberano (Conserjería EAR OS): ninguna línea directa del proveedor.
 */

interface EzkertzaVenueListingProps {
    /** CTA de bloqueo de fecha / presupuesto (calendario soberano del proveedor). */
    readonly blockHref: string;
    /** CTA de visita técnica. */
    readonly visitHref: string;
    /** WhatsApp de la Conserjería EAR OS con mensaje pre-cualificado. */
    readonly whatsappUrl: string;
}

type IconComponent = React.ComponentType<{ className?: string }>;

/** Iconos fijos para espacios (mismo orden que `EZKERTZA_DERIO_VENUE.spaces`). */
const SPACE_ICONS: readonly IconComponent[] = [
    UtensilsCrossed,
    TreePine,
    Sparkles,
    PartyPopper,
    Music,
    Car,
];

/** Iconos fijos para servicios (mismo orden que `EZKERTZA_DERIO_VENUE.services`). */
const SERVICE_ICONS: readonly IconComponent[] = [
    UtensilsCrossed,
    Award,
    Camera,
    Music,
    Bus,
    Palette,
];

/** Enlace «Abrir mapa» (deep link de Google Maps, sin marcas en el copy). */
const MAPS_SEARCH_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    EZKERTZA_DERIO_VENUE.fullAddress,
)}`;

/** Valoración en formato español («4,8») sin depender de ICU del build. */
function formatRating(rating: number): string {
    return rating.toFixed(1).replace('.', ',');
}

/** Fila de estrellas con relleno proporcional (render estático, sin JS). */
function StarRow({ rating, starClass }: { rating: number; starClass: string }): React.JSX.Element {
    const percent = Math.min(100, Math.max(0, (rating / 5) * 100));
    const row = (colorClass: string): React.JSX.Element => (
        <div className={`flex gap-0.5 flex-nowrap ${colorClass}`}>
            {[0, 1, 2, 3, 4].map((index) => (
                <Star key={index} className={`${starClass} shrink-0`} />
            ))}
        </div>
    );
    return (
        <span
            className="relative inline-flex"
            role="img"
            aria-label={`Valoración ${formatRating(rating)} de 5`}
        >
            {row('text-zinc-700')}
            <span
                className="absolute inset-0 overflow-hidden flex-nowrap"
                style={{ width: `${percent}%` }}
            >
                {row('text-[#ecb613]')}
            </span>
        </span>
    );
}

/** Nodo JSON-LD acotado al venue (datos estáticos de la ficha, escapado <). */
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
export function EzkertzaVenueListing({
    blockHref,
    visitHref,
    whatsappUrl,
}: EzkertzaVenueListingProps): React.JSX.Element {
    return (
        <section
            id="ficha-ezkertza-derio"
            aria-label="Ficha completa del venue Restaurante Ezkertza Berria"
            className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-24"
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: venueJsonLd() }}
            />

            {/* CABECERA DE VALORACIÓN: RATING, LOCALIZACIÓN Y CTAS */}
            <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#ecb613]/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between">
                    <div className="space-y-5">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono tracking-wider">
                            <MapPin className="w-4 h-4" />
                            <span>
                                {EZKERTZA_DERIO_VENUE.municipality} ·{' '}
                                {EZKERTZA_DERIO_VENUE.provinceAlias}
                            </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            {EZKERTZA_DERIO_VENUE.name}
                        </h2>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-extrabold text-white">
                                    {formatRating(EZKERTZA_DERIO_VENUE.rating)}
                                </span>
                                <div className="space-y-0.5">
                                    <StarRow
                                        rating={EZKERTZA_DERIO_VENUE.rating}
                                        starClass="w-4 h-4"
                                    />
                                    <span className="block text-[11px] text-gray-400">
                                        {EZKERTZA_DERIO_VENUE.reviewCount} opiniones ·{' '}
                                        {EZKERTZA_DERIO_VENUE.ratingLabel}
                                    </span>
                                </div>
                            </div>

                            <span className="hidden sm:block w-px h-8 bg-white/10" />

                            <div className="flex items-center gap-2 text-sm text-gray-200">
                                <Award className="w-4 h-4 text-[#ecb613]" />
                                <span>
                                    Recomendado por el{' '}
                                    <strong className="text-white">
                                        {EZKERTZA_DERIO_VENUE.recommendationPercent}%
                                    </strong>{' '}
                                    de las parejas
                                </span>
                            </div>

                            <span className="hidden sm:block w-px h-8 bg-white/10" />

                            <div className="flex items-center gap-2 text-sm text-gray-200">
                                <Users className="w-4 h-4 text-[#00E5FF]" />
                                <span>{EZKERTZA_DERIO_VENUE.hiredByCouplesLabel}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {EZKERTZA_DERIO_VENUE.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-gray-300"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full lg:w-80 shrink-0">
                        <a
                            href={blockHref}
                            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-[#ecb613] via-[#f7cb45] to-[#ecb613] text-black font-extrabold text-sm hover:brightness-110 transition-all shadow-xl shadow-[#ecb613]/25 flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <CalendarCheck className="w-5 h-5" />
                            <span>Solicitar presupuesto</span>
                        </a>

                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-4 rounded-2xl bg-[#09090d]/80 text-white font-semibold text-sm hover:bg-white/10 transition-all border border-white/15 flex items-center justify-center gap-2.5 backdrop-blur-md"
                        >
                            <MessageCircle className="w-5 h-5 text-emerald-400" />
                            <span>Envía un mensaje</span>
                        </a>

                        <p className="text-center text-[11px] font-mono text-gray-500 flex items-center justify-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {EZKERTZA_DERIO_VENUE.responseTime}
                        </p>
                    </div>
                </div>
            </div>
            {/* DATOS RÁPIDOS: PRECIO, PROMO, AFORO Y TIEMPO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="p-5 rounded-2xl border border-white/10 bg-[#09090d]/80 space-y-2">
                    <UtensilsCrossed className="w-5 h-5 text-[#ecb613]" />
                    <p className="text-lg font-bold text-white">
                        Menús desde {OTZARRETA_ENTITY.weddingPriceFromEur} €
                    </p>
                    <p className="text-[11px] text-gray-400">+ IVA · dossier oficial 2026</p>
                </div>

                <div className="p-5 rounded-2xl border border-white/10 bg-[#09090d]/80 space-y-2">
                    <BadgePercent className="w-5 h-5 text-[#ecb613]" />
                    <p className="text-lg font-bold text-white">
                        Ahorra el {EZKERTZA_DERIO_VENUE.discountPercent}%
                    </p>
                    <p className="text-[11px] text-gray-400">Promoción permanente para novios</p>
                </div>

                <div className="p-5 rounded-2xl border border-white/10 bg-[#09090d]/80 space-y-2">
                    <Users className="w-5 h-5 text-[#00E5FF]" />
                    <p className="text-lg font-bold text-white">
                        {EZKERTZA_DERIO_VENUE.guestRange}
                    </p>
                    <p className="text-[11px] text-gray-400">Banquete nupcial · comedores hasta 350</p>
                </div>

                <div className="p-5 rounded-2xl border border-white/10 bg-[#09090d]/80 space-y-2">
                    <Clock className="w-5 h-5 text-[#00E5FF]" />
                    <p className="text-lg font-bold text-white">
                        {EZKERTZA_DERIO_VENUE.responseTime}
                    </p>
                    <p className="text-[11px] text-gray-400">A través de la Conserjería EAR OS</p>
                </div>
            </div>

            {/* DATOS DE INTERÉS + MULTIMEDIA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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

                <div className="p-6 rounded-3xl border border-white/10 bg-[#09090d]/80 space-y-4">
                    <h3 className="text-base font-bold text-white">Galería y tour virtual</h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-gray-300">
                            <Video className="w-3.5 h-3.5 text-[#00E5FF]" />
                            Tour Virtual 360º
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-gray-300">
                            <Video className="w-3.5 h-3.5 text-[#00E5FF]" />
                            {EZKERTZA_DERIO_VENUE.media.videoCount} vídeos
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-gray-300">
                            <Camera className="w-3.5 h-3.5 text-[#00E5FF]" />
                            {EZKERTZA_DERIO_VENUE.media.photoCount} fotos
                        </span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                        El material audiovisual completo (tour 360º, vídeos y galería fotográfica)
                        se muestra en la visita técnica al caserío.
                    </p>
                </div>
            </div>
            {/* SOBRE EL ESPACIO + BODAS REALES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#09090d]/80 space-y-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-gray-500">
                        <span>En marketplaces de bodas desde {EZKERTZA_DERIO_VENUE.about.onMarketplacesSince}</span>
                        <span>·</span>
                        <span>Última actualización: {EZKERTZA_DERIO_VENUE.about.lastUpdated}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Sobre este espacio</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {EZKERTZA_DERIO_VENUE.about.description}
                    </p>
                </div>

                <div className="p-6 rounded-3xl border border-[#ecb613]/20 bg-gradient-to-b from-[#141209] to-[#09090d] space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Camera className="w-4 h-4 text-[#ecb613]" />
                        Bodas reales
                    </h3>
                    {EZKERTZA_DERIO_VENUE.realWeddings.map((wedding) => (
                        <div key={wedding.couple} className="space-y-2">
                            <p className="text-sm font-bold text-white">
                                La boda de {wedding.couple}
                            </p>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                {wedding.description}
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#ecb613]">
                                <Camera className="w-3.5 h-3.5" />
                                {wedding.photoCount} fotos
                            </span>
                        </div>
                    ))}
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                        La galería completa de bodas reales se proyecta en la visita técnica.
                    </p>
                </div>
            </div>

            {/* ESPACIOS + SERVICIOS + LOCALIZACIÓN */}
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
                    <h3 className="text-base font-bold text-white">Localización</h3>
                    <ul className="space-y-3">
                        {EZKERTZA_DERIO_VENUE.location.map((item) => (
                            <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                                <TreePine className="w-4 h-4 text-[#ecb613] shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <p className="text-xs text-gray-500 pt-2 border-t border-white/10">
                        Alojamiento para invitados:{' '}
                        <span className="text-gray-300">
                            {EZKERTZA_DERIO_VENUE.accommodationForGuests ? 'Sí' : 'No'}
                        </span>
                    </p>
                </div>
            </div>
            {/* OPINIONES */}
            <div className="mt-12 rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 sm:p-10 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h3 className="text-2xl font-extrabold text-white">
                            Opiniones de {EZKERTZA_DERIO_VENUE.name}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                            {formatRating(EZKERTZA_DERIO_VENUE.rating)} ·{' '}
                            {EZKERTZA_DERIO_VENUE.ratingLabel} ·{' '}
                            {EZKERTZA_DERIO_VENUE.reviewCount} opiniones · El{' '}
                            {EZKERTZA_DERIO_VENUE.recommendationPercent}% de las parejas lo recomiendan
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500">
                        <Sparkles className="w-3.5 h-3.5 text-[#ecb613]" />
                        Opiniones agregadas de la ficha pública del venue (ingesta 2026)
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {EZKERTZA_DERIO_VENUE.reviews.map((review) => (
                        <article
                            key={`${review.author}-${review.date}`}
                            className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3 flex flex-col"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <StarRow rating={review.rating} starClass="w-3.5 h-3.5" />
                                <span className="text-xs font-bold text-white shrink-0">
                                    {formatRating(review.rating)}
                                </span>
                            </div>
                            <h4 className="text-sm font-bold text-white">{review.title}</h4>
                            <p className="text-xs text-gray-400 leading-relaxed flex-1">
                                «{review.comment}»
                            </p>
                            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-500">
                                <span className="font-semibold text-gray-300">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#ecb613]/15 text-[#ecb613] font-bold text-[10px] mr-2">
                                        {review.author.charAt(0).toUpperCase()}
                                    </span>
                                    {review.author}
                                </span>
                                <span>{review.date}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
            {/* PROMOCIONES + MENÚS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="p-6 sm:p-8 rounded-3xl border border-[#ecb613]/25 bg-gradient-to-b from-[#141209] to-[#09090d] space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613] text-black text-[11px] font-mono font-bold tracking-wider">
                        <BadgePercent className="w-3.5 h-3.5" />
                        {EZKERTZA_DERIO_VENUE.promos[0]?.badge ?? 'Promoción'}
                    </div>
                    <h3 className="text-xl font-extrabold text-white">
                        {EZKERTZA_DERIO_VENUE.promos[0]?.title ?? 'Promoción'}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {EZKERTZA_DERIO_VENUE.promos[0]?.detail ?? ''}
                    </p>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ecb613] text-black font-bold text-xs hover:brightness-110 transition-all"
                    >
                        <BadgePercent className="w-4 h-4" />
                        Solicitar cupón
                    </a>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 sm:p-8 space-y-5">
                    <h3 className="text-xl font-extrabold text-white">Menús oficiales</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {EZKERTZA_DERIO_VENUE.menus.map((menu) => (
                            <div
                                key={menu.name}
                                className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-2"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="text-sm font-bold text-white">{menu.name}</h4>
                                    {menu.badge !== null && (
                                        <span className="px-2 py-0.5 rounded bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[9px] font-mono shrink-0">
                                            {menu.badge}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] text-gray-400 leading-relaxed">
                                    {menu.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    <p className="text-[11px] text-gray-500">
                        Menús desde {OTZARRETA_ENTITY.weddingPriceFromEur} € + IVA · 7 menús
                        oficiales configurables en el cotizador de la Conserjería.
                    </p>
                </div>
            </div>

            {/* PREGUNTAS FRECUENTES */}
            <div className="mt-12 rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 sm:p-10 space-y-6">
                <h3 className="text-2xl font-extrabold text-white">
                    Preguntas frecuentes sobre {EZKERTZA_DERIO_VENUE.name}
                </h3>
                <div className="space-y-3">
                    {EZKERTZA_DERIO_VENUE.faqs.map((faq) => (
                        <details
                            key={faq.question}
                            className="group rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
                        >
                            <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-sm font-semibold text-white hover:bg-white/[0.03] transition-colors">
                                {faq.question}
                                <ChevronDown className="w-4 h-4 text-[#ecb613] shrink-0 transition-transform duration-300 group-open:rotate-180" />
                            </summary>
                            <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>

            {/* MAPA + VISITA */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#09090d]/80 space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#ecb613]" />
                        Mapa de localización
                    </h3>
                    <p className="text-sm text-gray-300">{EZKERTZA_DERIO_VENUE.fullAddress}</p>
                    <p className="text-[11px] font-mono text-gray-500">
                        Coordenadas: {EZKERTZA_DERIO_VENUE.geo.lat.toFixed(4)},{' '}
                        {EZKERTZA_DERIO_VENUE.geo.lng.toFixed(4)} ·{' '}
                        {EZKERTZA_DERIO_VENUE.municipality} ({EZKERTZA_DERIO_VENUE.province})
                    </p>
                    <a
                        href={MAPS_SEARCH_HREF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 bg-[#09090d] text-white text-xs font-bold hover:bg-white/10 transition-all"
                    >
                        <ExternalLink className="w-4 h-4 text-[#00E5FF]" />
                        Abrir mapa
                    </a>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl border border-[#ecb613]/25 bg-gradient-to-b from-[#141209] to-[#09090d] space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <CalendarCheck className="w-4 h-4 text-[#ecb613]" />
                            Pide una visita
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Descubre su ambiente en persona y deja que respondan a tus preguntas
                            al momento. Visitas coordinadas por la Conserjería EAR OS.
                        </p>
                    </div>
                    <a
                        href={visitHref}
                        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#ecb613] text-black font-extrabold text-sm hover:brightness-110 transition-all"
                    >
                        <CalendarCheck className="w-4 h-4" />
                        Pide una cita
                    </a>
                </div>
            </div>

            {/* NOTA DE PROCEDENCIA Y RETIRADA (JUR-5) */}
            <p className="mt-8 text-center text-[11px] font-mono text-gray-600 leading-relaxed">
                Ficha de venue ingerida de fuente pública en 2026 · cero líneas de contacto
                directo del proveedor (toda demanda entra por la Conserjería EAR OS) · las
                citas de opiniones se retiran por flag en menos de 10 minutos.
            </p>

        </section>
    );
}
