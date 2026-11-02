'use client';

/* eslint-disable @next/next/no-img-element -- W46_T02: relación de aspecto
   NATIVA y sin recorte. `next/image` exige width/height conocidos; inventarlos
   deformaría el encuadre (o recortaría con `object-cover`), que es justo el
   defecto que esta pieza existe para erradicar. */

/**
 * ⚠️ `'use client'` es obligatorio, no cosmético: `OFFICIAL_OTZARRETA_MENUS`
 * vive en `OtzarretaExperienceExplorer` (módulo cliente). Importar un valor de
 * un módulo `"use client"` desde un Server Component devuelve una *client
 * reference*, no el array: `.filter()` reventaría en build. Se asume el coste
 * de hidratación (la estática ya viaja en el chunk del simulador) antes que
 * duplicar el dataset de menús en un segundo fichero.
 */
import React from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    CalendarCheck,
    Car,
    ExternalLink,
    MapPin,
    Navigation,
    TreePine,
    UtensilsCrossed,
    Volume2,
} from 'lucide-react';
import { EZKERTZA_DERIO_VENUE } from '@/lib/constants/ezkertza-derio-venue';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import { LiquidGlassCard } from '@/components/harvested';
import { OFFICIAL_OTZARRETA_MENUS } from './OtzarretaExperienceExplorer';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * RECORRIDO CINEMÁTICO — RESTAURANTE EZKERTZA BERRIA (W46_T02)
 * ════════════════════════════════════════════════════════════════════════════
 * Reglas de construcción (orden CEO 2026-11-02):
 *  · Cero recortes: alto fijo + `object-contain` + ancho automático = aspecto
 *    nativo. Cero verticales en los carruseles principales (se filtran por la
 *    geometría que declara la propia URL de origen).
 *  · Cero fotos de cartas de menú: la carta se presenta en cristal líquido
 *    (`LiquidGlassCard`), nunca como foto de papel escaneado.
 *  · Cero cifras inventadas: tiempos, plazas y aforo son los que la casa ya
 *    publica en esta misma página; el depósito sale del SSOT.
 *  · Cero iframes de terceros: el vídeo oficial se enlaza, no se embebe
 *    (un embed de Vimeo instala cookies antes del consentimiento — RGPD/LSSI).
 * Server Component: render estático, indexable, cero datos personales.
 * ════════════════════════════════════════════════════════════════════════════
 */

interface EzkertzaCinematicJourneyProps {
    /** CTA de bloqueo de fecha (calendario soberano del proveedor). */
    readonly blockHref: string;
    /** WhatsApp de la Conserjería EAR OS con mensaje pre-cualificado. */
    readonly whatsappUrl: string;
}

/** Sufijo de tamaño de WordPress (`-1024x682`): geometría declarada por la fuente. */
const DIMENSIONES_EN_URL = /-(\d{2,4})x(\d{2,4})\.(?:jpe?g|png|webp)$/i;

/**
 * Descarta retratos y miniaturas usando la geometría real que publica la URL.
 * Las imágenes sin sufijo de tamaño son los originales (apaisados en su web):
 * se conservan. Umbral 1,2 para que un cuadrado no rompa la lectura panorámica.
 */
function esPanoramica(url: string): boolean {
    const match = DIMENSIONES_EN_URL.exec(url);
    if (!match) return true;
    const ancho = Number(match[1]);
    const alto = Number(match[2]);
    if (ancho < 600) return false;
    return ancho / alto >= 1.2;
}

/** Tope de 16: el hero ya muestra la galería completa; aquí manda el peso. */
const FOTOS_PANORAMICAS: readonly string[] = EZKERTZA_DERIO_VENUE.media.galleryPhotos
    .filter(esPanoramica)
    .slice(0, 16);

const MAPA_GOOGLE_DIRECCIONES = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    'Bilbao, Bizkaia',
)}&destination=${encodeURIComponent(EZKERTZA_DERIO_VENUE.fullAddress)}&travelmode=driving`;

const VIDEO_OFICIAL_HREF = `https://vimeo.com/${EZKERTZA_DERIO_VENUE.media.officialVideo.videoId}`;

const MENUS_DE_BODA = OFFICIAL_OTZARRETA_MENUS.filter((menu) => menu.category === 'bodas');

/**
 * Rango de ingeniería para salón cerrado (AGENTS.md §3 · Ley 37/2003).
 * Se publica como rango técnico, no como promesa de impunidad (JUR-2).
 */
const RANGO_DBA_SALON = '80–85 dBA';

interface ParadaRuta {
    readonly titulo: string;
    readonly detalle: string;
    readonly icono: React.ComponentType<{ className?: string }>;
}

const PARADAS: readonly ParadaRuta[] = [
    {
        titulo: 'Bilbao · salida',
        detalle: 'Corredor del Txorierri (N-637) dirección Derio.',
        icono: Navigation,
    },
    {
        titulo: 'Derio · Santo Domingo Hiribidea, 13',
        detalle: 'Acceso al caserío con campa de llegada y parking privado.',
        icono: MapPin,
    },
    {
        titulo: 'Coche nupcial · campa',
        detalle: 'Recepciones y carpa para ceremonia civil en los jardines.',
        icono: Car,
    },
];

/** Tres momentos con foto real de la galería oficial (0 recortes, 0 stock). */
const MOMENTOS = [
    {
        titulo: 'La llegada',
        detalle: 'Campa de acceso y aparcamiento propio en el caserío.',
        src: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/05/Fachada-Principal-1.jpg',
    },
    {
        titulo: 'La ceremonia',
        detalle: 'Jardines y carpa para el "sí quiero" civil.',
        src: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/06/24-Bodas-civiles.jpg',
    },
    {
        titulo: 'El banquete',
        detalle: 'Salones climatizados e insonorizados para el banquete.',
        src: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/09/comedor.jpg',
    },
] as const;

export function EzkertzaCinematicJourney({
    blockHref,
    whatsappUrl,
}: EzkertzaCinematicJourneyProps): React.JSX.Element {
    return (
        <section
            id="recorrido-cinematico"
            aria-label="Recorrido cinemático y galería panorámica del venue"
            className="mt-16 space-y-6"
        >
            <div className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ecb613]">
                    El día, en tres planos
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Cómo se llega, cómo se entra y cómo se sienta la mesa
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
                    Recorrido visual del caserío antes de la visita técnica: la ruta desde
                    Bilbao, la llegada del coche nupcial y el salón donde se sirve el
                    banquete. Sin recortes, sin fotos de cartas y sin cifras que no estén
                    ya publicadas por la casa.
                </p>
            </div>

            {/* ── PLANO 1 · VISTA DE PÁJARO (sin servicio de mapas externo) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-4">
                <div className="relative rounded-3xl border border-white/10 bg-[#030305] p-4 sm:p-5 overflow-hidden">
                    <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono uppercase tracking-wider">
                        <Navigation className="w-3 h-3" /> Vista de pájaro
                    </span>
                    <svg
                        viewBox="0 0 400 220"
                        className="w-full h-56 sm:h-64"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <defs>
                            <linearGradient id="ear-ruta-derio" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#00E5FF" />
                                <stop offset="100%" stopColor="#ecb613" />
                            </linearGradient>
                        </defs>
                        {[40, 80, 120, 160, 200].map((y) => (
                            <line key={`h-${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#ffffff" strokeOpacity="0.04" />
                        ))}
                        {[80, 160, 240, 320].map((x) => (
                            <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="220" stroke="#ffffff" strokeOpacity="0.04" />
                        ))}
                        <path
                            d="M44 176 C 110 168, 132 120, 186 104 S 288 84, 356 52"
                            fill="none"
                            stroke="url(#ear-ruta-derio)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="7 7"
                        />
                        <circle cx="44" cy="176" r="7" fill="#00E5FF" />
                        <circle cx="44" cy="176" r="14" fill="#00E5FF" fillOpacity="0.18" />
                        <circle cx="186" cy="104" r="5" fill="#ffffff" fillOpacity="0.75" />
                        <circle cx="356" cy="52" r="7" fill="#ecb613" />
                        <circle cx="356" cy="52" r="14" fill="#ecb613" fillOpacity="0.18" />
                        <text x="44" y="204" fill="#9ca3af" fontSize="11" fontFamily="monospace">BILBAO</text>
                        <text x="150" y="130" fill="#6b7280" fontSize="10" fontFamily="monospace">N-637</text>
                        <text x="300" y="38" fill="#ecb613" fontSize="11" fontFamily="monospace">DERIO</text>
                    </svg>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-5 sm:p-6 space-y-4">
                    <ol className="space-y-3">
                        {PARADAS.map((parada, index) => {
                            const Icono = parada.icono;
                            return (
                                <li key={parada.titulo} className="flex items-start gap-3">
                                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#ecb613]/40 bg-[#ecb613]/10 text-[#ecb613] font-mono text-[11px]">
                                        {index + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="flex items-center gap-2 text-sm font-bold text-white">
                                            <Icono className="w-4 h-4 text-[#00E5FF] shrink-0" />
                                            {parada.titulo}
                                        </p>
                                        <p className="text-xs text-gray-400 leading-relaxed">{parada.detalle}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>

                    <dl className="grid grid-cols-3 gap-2">
                        <div className="rounded-xl border border-white/10 bg-black/30 p-2.5 text-center">
                            <dt className="text-[10px] font-mono text-gray-500 uppercase">Bilbao</dt>
                            <dd className="text-sm font-bold text-white">8 min</dd>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-black/30 p-2.5 text-center">
                            <dt className="text-[10px] font-mono text-gray-500 uppercase">Aeropuerto</dt>
                            <dd className="text-sm font-bold text-white">5 min</dd>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-black/30 p-2.5 text-center">
                            <dt className="text-[10px] font-mono text-gray-500 uppercase">Parking</dt>
                            <dd className="text-sm font-bold text-white">150</dd>
                        </div>
                    </dl>

                    <a
                        href={MAPA_GOOGLE_DIRECCIONES}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#00E5FF] hover:text-white transition-colors"
                    >
                        Abrir la ruta real en Google Maps
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                        Tiempos estimados publicados por la casa. El itinerario definitivo
                        lo calcula tu navegador el día del evento (tráfico, obras y cortes
                        no se pueden prometer de antemano).
                    </p>
                </div>
            </div>

            {/* ── PLANOS 2 y 3 · LLEGADA Y BANQUETE ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MOMENTOS.map((momento, index) => (
                    <figure key={momento.titulo} className="rounded-3xl border border-white/10 bg-[#030305] overflow-hidden">
                        <div className="flex h-48 sm:h-56 items-center justify-center bg-[#030305]">
                            <img
                                src={momento.src}
                                alt={`${EZKERTZA_DERIO_VENUE.name} · ${momento.titulo}`}
                                loading={index === 0 ? 'eager' : 'lazy'}
                                decoding="async"
                                className="h-full w-auto max-w-none object-contain"
                            />
                        </div>
                        <figcaption className="p-4 border-t border-white/10">
                            <p className="text-sm font-bold text-white">{momento.titulo}</p>
                            <p className="text-xs text-gray-400 leading-relaxed">{momento.detalle}</p>
                        </figcaption>
                    </figure>
                ))}
            </div>

            {/* ── GALERÍA HORIZONTAL PANORÁMICA · 0 RECORTES · 0 VERTICALES ── */}
            <div>
                <div className="flex flex-wrap items-end justify-between gap-2">
                    <h4 className="text-lg font-bold text-white">Galería panorámica, sin recortes</h4>
                    <span className="text-[11px] font-mono text-gray-500">
                        {FOTOS_PANORAMICAS.length} imágenes apaisadas · desliza →
                    </span>
                </div>
                <div
                    role="region"
                    aria-label="Galería panorámica del caserío"
                    tabIndex={0}
                    className="mt-3 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ecb613] rounded-2xl"
                >
                    {FOTOS_PANORAMICAS.map((foto, index) => (
                        <figure key={foto} className="snap-center shrink-0 min-w-[16rem]">
                            <div className="flex h-52 sm:h-72 items-center justify-center rounded-2xl border border-white/10 bg-[#030305] overflow-hidden">
                                <img
                                    src={foto}
                                    alt={`Instalaciones de ${EZKERTZA_DERIO_VENUE.name} · imagen ${index + 1}`}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full w-auto max-w-none object-contain"
                                />
                            </div>
                        </figure>
                    ))}
                </div>
                <p className="text-[10px] text-gray-500">
                    Fotografía oficial del caserío. Las imágenes verticales se han retirado
                    del carrusel principal: un encuadre retrato dentro de un contenedor
                    apaisado es la causa clásica de salto de layout (CLS).
                </p>
            </div>

            {/* ── CARTAS EN CRISTAL LÍQUIDO · CERO FOTOS DE PAPEL ── */}
            <div>
                <div className="flex flex-wrap items-end justify-between gap-2">
                    <h4 className="text-lg font-bold text-white">Las cartas, en cristal líquido</h4>
                    <Link
                        href="/rider-tecnico"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#00E5FF] hover:text-white transition-colors"
                    >
                        Ver rider técnico
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MENUS_DE_BODA.map((menu) => (
                        <LiquidGlassCard key={menu.id} variant="deep" accent="gold" className="h-full">
                            <div className="flex items-start justify-between gap-3">
                                <UtensilsCrossed className="w-5 h-5 text-[#ecb613]" />
                                <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500">
                                    Carta de boda
                                </span>
                            </div>
                            <h5 className="mt-3 text-base font-bold text-white">{menu.name}</h5>
                            <p className="mt-1 text-xs text-gray-400 leading-relaxed">{menu.subtitle}</p>
                            <p className="mt-3 font-mono text-[11px] text-[#ecb613]">{menu.tag}</p>
                        </LiquidGlassCard>
                    ))}
                    <LiquidGlassCard variant="frosted" accent="cyan" className="h-full">
                        <div className="flex items-start justify-between gap-3">
                            <Volume2 className="w-5 h-5 text-[#00E5FF]" />
                            <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500">
                                Sala
                            </span>
                        </div>
                        <h5 className="mt-3 text-base font-bold text-white">Sonido Bose F1</h5>
                        <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                            Refuerzo calibrado para discursos y banquete en salón cerrado:
                            rango de ingeniería {RANGO_DBA_SALON} (Ley 37/2003).
                        </p>
                        <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] text-[#00E5FF]">
                            <TreePine className="w-3.5 h-3.5" /> Interior insonorizado
                        </p>
                    </LiquidGlassCard>
                </div>
                <p className="mt-2 text-[10px] text-gray-500">
                    Sin fotos de cartas escaneadas: el detalle del menú vive en el simulador
                    de banquetes y en la Conserjería. Los importes se confirman por escrito
                    antes de cualquier pago.
                </p>
            </div>

            {/* ── CIERRE · DOS RUTAS, CERO CLICS MUERTOS ── */}
            <div className="rounded-3xl border border-[#ecb613]/25 bg-gradient-to-r from-[#141209] to-[#09090d] p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-bold text-white">¿Visita técnica o bloqueo de fecha?</p>
                    <p className="text-xs text-gray-400">
                        El depósito de {DEPOSITO_STRIPE_EUR.toFixed(0)} € se descuenta íntegro
                        del presupuesto final del evento.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5">
                    <Link
                        href={blockHref}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#ecb613] text-black text-xs font-extrabold hover:brightness-110 transition-all"
                    >
                        <CalendarCheck className="w-4 h-4" />
                        Bloquear fecha
                    </Link>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-white hover:bg-white/10 transition-all"
                    >
                        Pedir la carta completa
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>

            <p className="text-[10px] text-gray-500">
                Vídeo oficial del caserío:{' '}
                <a
                    href={VIDEO_OFICIAL_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00E5FF] hover:text-white underline underline-offset-2"
                >
                    verlo en su plataforma
                </a>
                {' '}(se enlaza, no se incrusta: un reproductor externo instalaría cookies
                antes de tu consentimiento).
            </p>
        </section>
    );
}

