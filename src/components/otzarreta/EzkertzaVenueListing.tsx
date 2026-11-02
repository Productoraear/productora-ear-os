import React from 'react';
import {
    Star,
    MapPin,
    Clock,
    Users,
    BadgePercent,
    UtensilsCrossed,
    CalendarCheck,
    MessageCircle,
    CheckCircle2,
    ChevronDown,
    ExternalLink,
    Car,
    TreePine,
} from 'lucide-react';
import { EZKERTZA_DERIO_VENUE } from '@/lib/constants/ezkertza-derio-venue';
import { OTZARRETA_ENTITY } from '@/lib/constants/otzarreta-entity';
import { VenueGallery } from '@/components/otzarreta/VenueGallery';
import { VenueReviewCarousel } from '@/components/otzarreta/VenueReviewCarousel';

/**
 * FICHA DEL VENUE — RESTAURANTE EZKERTZA BERRIA (DERIO · BIZKAIA)
 * Orden de LANDING por lo que busca quien llega:
 *   1 Hero (¿es bonito y fiable?) → 2 Datos clave (¿me cabe, cuánto cuesta?)
 *   3 Galería y vídeo (¿lo veo?) → 4 Opiniones (¿otros lo confirman?)
 *   5 Menús y promoción (¿qué como y qué ahorro?) → 6 Detalles plegables
 *   7 Dudas (FAQ) → 8 Visita y cierre.
 * Server Component: solo las dos piezas interactivas (galería y carrusel) son cliente.
 * Todo contacto sale por la Conserjería EAR OS (peaje soberano): ninguna línea directa.
 */

interface EzkertzaVenueListingProps {
    /** CTA de bloqueo de fecha / presupuesto (calendario soberano del proveedor). */
    readonly blockHref: string;
    /** CTA de visita técnica. */
    readonly visitHref: string;
    /** WhatsApp de la Conserjería EAR OS con mensaje pre-cualificado. */
    readonly whatsappUrl: string;
}

const MAPS_SEARCH_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    EZKERTZA_DERIO_VENUE.fullAddress,
)}`;

const SECTION_CARD = 'rounded-3xl border border-white/10 bg-[#09090d]/80 backdrop-blur-md';
const PRIMARY_CTA =
    'inline-flex items-center justify-center gap-2 rounded-full bg-[#ecb613] px-7 py-3.5 text-sm font-bold text-[#030305] transition-all duration-300 ease-out hover:bg-[#f5cf5b]';
const SECONDARY_CTA =
    'inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 ease-out hover:border-[#ecb613]/60 hover:text-[#ecb613]';

function formatRating(rating: number): string {
    return rating.toFixed(1).replace('.', ',');
}

function StarRow({ rating }: { rating: number }): React.JSX.Element {
    const percent = Math.min(100, Math.max(0, (rating / 5) * 100));
    const row = (colorClass: string): React.JSX.Element => (
        <div className={`flex gap-0.5 flex-nowrap ${colorClass}`}>
            {[0, 1, 2, 3, 4].map((index) => (
                <Star key={index} className="w-5 h-5 shrink-0 fill-current" aria-hidden="true" />
            ))}
        </div>
    );
    return (
        <span className="relative inline-flex" role="img" aria-label={`Valoración ${formatRating(rating)} de 5`}>
            {row('text-zinc-700')}
            <span className="absolute inset-0 overflow-hidden flex-nowrap" style={{ width: `${percent}%` }}>
                {row('text-[#ecb613]')}
            </span>
        </span>
    );
}

function venueJsonLd(): string {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        '@id': 'https://www.productoraear.com/otzarreta#ezkertza-derio',
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

function Accordion({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}): React.JSX.Element {
    return (
        <details className={`group ${SECTION_CARD} open:border-[#ecb613]/30`}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-bold text-white [&::-webkit-details-marker]:hidden">
                {title}
                <ChevronDown
                    className="h-5 w-5 shrink-0 text-[#ecb613] transition-all duration-300 ease-out group-open:rotate-180"
                    aria-hidden="true"
                />
            </summary>
            <div className="px-5 pb-5 text-sm leading-relaxed text-zinc-300">{children}</div>
        </details>
    );
}

export function EzkertzaVenueListing({
    blockHref,
    visitHref,
    whatsappUrl,
}: EzkertzaVenueListingProps): React.JSX.Element {
    const venue = EZKERTZA_DERIO_VENUE;
    const photos = venue.media.galleryPhotos;
    const heroPhotos = photos.slice(0, 3);

    return (
        <section
            id="ficha-ezkertza-derio"
            aria-label="Ficha completa del Restaurante Ezkertza Berria"
            className="relative mx-auto my-16 max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8"
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: venueJsonLd() }}
            />

            {/* 1 · HERO */}
            <header className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
                <div className="space-y-6">
                    <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#ecb613]">
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                        {venue.municipality} · {venue.province}
                    </p>
                    <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
                        {venue.name}
                    </h2>
                    <p className="max-w-xl text-base leading-relaxed text-zinc-300">
                        Caserío en el campo con jardines, carpa para ceremonia civil y banquete a la
                        parrilla. Una sola celebración por día: la casa es solo tuya.
                    </p>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <StarRow rating={venue.rating} />
                        <span className="text-2xl font-extrabold text-white">{formatRating(venue.rating)}</span>
                        <span className="text-sm text-zinc-300">
                            {venue.reviewCount} opiniones · {venue.ratingLabel}
                        </span>
                    </div>
                    <p className="text-sm text-zinc-300">
                        <CheckCircle2 className="mr-1.5 inline h-4 w-4 text-[#ecb613]" aria-hidden="true" />
                        Recomendado por el {venue.recommendationPercent}% de las parejas · {venue.hiredByCouplesLabel}
                    </p>

                    <div className="flex flex-wrap gap-3 pt-2">
                        <a href={blockHref} className={PRIMARY_CTA}>
                            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                            Solicitar presupuesto
                        </a>
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={SECONDARY_CTA}>
                            <MessageCircle className="h-4 w-4" aria-hidden="true" />
                            Hablar con la Conserjería
                        </a>
                    </div>
                    <p className="text-xs text-zinc-400">{venue.responseTime} · A través de la Conserjería EAR OS</p>
                </div>

                <div className="grid grid-cols-3 grid-rows-2 gap-3" aria-label="Fotografías reales del caserío">
                    {heroPhotos.map((photo, index) => (
                        <img
                            key={photo}
                            src={photo}
                            alt={`${venue.name} · fotografía real ${index + 1}`}
                            width={index === 0 ? 800 : 400}
                            height={index === 0 ? 600 : 300}
                            loading={index === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                            className={`h-full w-full rounded-3xl border border-white/10 object-cover ${
                                index === 0 ? 'col-span-3 row-span-1 aspect-[16/9]' : 'col-span-1 aspect-[4/3] sm:col-span-1'
                            }`}
                        />
                    ))}
                </div>
            </header>

            {/* 2 · DATOS CLAVE */}
            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <li className={`${SECTION_CARD} p-5`}>
                    <UtensilsCrossed className="mb-2 h-5 w-5 text-[#ecb613]" aria-hidden="true" />
                    <p className="text-xl font-extrabold text-white">Menús desde {OTZARRETA_ENTITY.weddingPriceFromEur} €</p>
                    <p className="text-xs text-zinc-400">+ IVA por comensal</p>
                </li>
                <li className={`${SECTION_CARD} p-5`}>
                    <Users className="mb-2 h-5 w-5 text-[#ecb613]" aria-hidden="true" />
                    <p className="text-xl font-extrabold text-white">{venue.guestRange}</p>
                    <p className="text-xs text-zinc-400">Eventos ampliados hasta 350 comensales: se confirma en la visita</p>
                </li>
                <li className={`${SECTION_CARD} p-5`}>
                    <Clock className="mb-2 h-5 w-5 text-[#ecb613]" aria-hidden="true" />
                    <p className="text-xl font-extrabold text-white">1 evento al día</p>
                    <p className="text-xs text-zinc-400">Exclusividad de fecha</p>
                </li>
                <li className={`${SECTION_CARD} p-5`}>
                    <BadgePercent className="mb-2 h-5 w-5 text-[#ecb613]" aria-hidden="true" />
                    <p className="text-xl font-extrabold text-white">Ahorra el {venue.discountPercent}%</p>
                    <p className="text-xs text-zinc-400">Promoción permanente para novios</p>
                </li>
            </ul>

            {/* 3 · GALERÍA Y VÍDEO */}
            <div className="space-y-4">
                <h3 className="text-2xl font-extrabold text-white">Míralo por dentro y por fuera</h3>
                <VenueGallery
                    photos={photos}
                    altBase={`${venue.name} · boda real`}
                    vimeoId={venue.media.officialVideo.videoId}
                    videoTitle={`Vídeo oficial del ${venue.name}`}
                />
            </div>

            {/* 4 · OPINIONES */}
            <div className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <h3 className="text-2xl font-extrabold text-white">Lo que cuentan las parejas</h3>
                    <p className="text-sm text-zinc-300">
                        {formatRating(venue.rating)} sobre {venue.reviewCount} opiniones publicadas
                    </p>
                </div>
                <VenueReviewCarousel reviews={venue.reviews} />
            </div>

            {/* 5 · MENÚS Y PROMOCIÓN */}
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <div className={`${SECTION_CARD} space-y-4 p-6`}>
                    <h3 className="text-xl font-extrabold text-white">Menús oficiales</h3>
                    <ul className="grid gap-3 sm:grid-cols-2">
                        {venue.menus.map((menu) => (
                            <li key={menu.name} className="space-y-1.5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-sm font-bold text-white">{menu.name}</h4>
                                    {menu.badge !== null && (
                                        <span className="shrink-0 rounded border border-[#ecb613]/30 bg-[#ecb613]/10 px-2 py-0.5 font-mono text-[10px] text-[#ecb613]">
                                            {menu.badge}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs leading-relaxed text-zinc-300">{menu.description}</p>
                            </li>
                        ))}
                    </ul>
                    <p className="text-xs text-zinc-400">
                        Desde {OTZARRETA_ENTITY.weddingPriceFromEur} € + IVA · el precio exacto lo calcula el
                        cotizador de la Conserjería según comensales.
                    </p>
                </div>

                <div className="space-y-4">
                    {venue.promos.map((promo) => (
                        <div key={promo.title} className={`${SECTION_CARD} space-y-3 border-[#ecb613]/30 p-6`}>
                            <span className="inline-block rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#ecb613]">
                                {promo.badge}
                            </span>
                            <h4 className="text-lg font-extrabold text-white">{promo.title}</h4>
                            <p className="text-sm leading-relaxed text-zinc-300">{promo.detail}</p>
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={PRIMARY_CTA}>
                                Solicitar cupón
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* 6 · DETALLES PLEGABLES (sin scroll eterno) */}
            <div className="grid gap-3 lg:grid-cols-2">
                <Accordion title="Sobre este espacio">
                    <p>{venue.about.description}</p>
                </Accordion>
                <Accordion title="Espacios y servicios incluidos">
                    <p className="mb-2 font-semibold text-white">Espacios</p>
                    <ul className="mb-4 flex flex-wrap gap-2">
                        {venue.spaces.map((space) => (
                            <li key={space} className="rounded-full border border-white/10 px-3 py-1 text-xs">
                                {space}
                            </li>
                        ))}
                    </ul>
                    <p className="mb-2 font-semibold text-white">Servicios</p>
                    <ul className="flex flex-wrap gap-2">
                        {venue.services.map((service) => (
                            <li key={service} className="rounded-full border border-white/10 px-3 py-1 text-xs">
                                {service}
                            </li>
                        ))}
                    </ul>
                </Accordion>
                <Accordion title="Datos de interés y localización">
                    <ul className="space-y-2">
                        {venue.datosDeInteres.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                                <TreePine className="h-4 w-4 text-[#ecb613]" aria-hidden="true" />
                                {item}
                            </li>
                        ))}
                        <li className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-[#ecb613]" aria-hidden="true" />
                            {venue.location.join(' · ')}
                        </li>
                        <li className="text-xs text-zinc-400">
                            Alojamiento para invitados: {venue.accommodationForGuests ? 'Sí' : 'No'}
                        </li>
                    </ul>
                </Accordion>
                <Accordion title="Bodas reales">
                    <ul className="space-y-2">
                        {venue.realWeddings.map((wedding) => (
                            <li key={wedding.couple}>
                                <span className="font-semibold text-white">{wedding.couple}</span>
                                <span className="text-zinc-400"> · {wedding.description}</span>
                            </li>
                        ))}
                    </ul>
                </Accordion>
            </div>

            {/* 7 · DUDAS */}
            <div className="space-y-3">
                <h3 className="text-2xl font-extrabold text-white">Dudas habituales</h3>
                {venue.faqs.map((faq) => (
                    <Accordion key={faq.question} title={faq.question}>
                        <p>{faq.answer}</p>
                    </Accordion>
                ))}
            </div>

            {/* 8 · VISITA Y CIERRE */}
            <div className={`${SECTION_CARD} grid gap-6 border-[#ecb613]/30 p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center`}>
                <div className="space-y-3">
                    <h3 className="text-2xl font-extrabold text-white sm:text-3xl">Ven a verlo con tus ojos</h3>
                    <p className="text-sm leading-relaxed text-zinc-300">
                        Visitas coordinadas por la Conserjería EAR OS. Respondemos en 24 horas y bloqueamos tu fecha
                        con un depósito de 100 € que se descuenta íntegro de la liquidación final.
                    </p>
                    <p className="flex items-start gap-2 text-xs text-zinc-400">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#ecb613]" aria-hidden="true" />
                        {venue.fullAddress}
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <a href={visitHref} className={PRIMARY_CTA}>
                        Pedir una visita
                    </a>
                    <a href={MAPS_SEARCH_HREF} target="_blank" rel="noopener noreferrer" className={SECONDARY_CTA}>
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        Abrir mapa
                    </a>
                </div>
            </div>
        </section>
    );
}
