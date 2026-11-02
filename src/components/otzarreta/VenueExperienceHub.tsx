'use client';

import React, { useEffect, useState } from 'react';
import {
    Heart,
    Building2,
    UserRound,
    Flame,
    CalendarCheck,
    MessageCircle,
    ArrowRight,
} from 'lucide-react';
import { EZKERTZA_DERIO_VENUE } from '@/lib/constants/ezkertza-derio-venue';
import { CENTRALITA_EAR_OS, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import {
    OtzarretaExperienceExplorer,
    OFFICIAL_OTZARRETA_MENUS,
} from './OtzarretaExperienceExplorer';

type AudienceId = 'pareja' | 'empresa' | 'particular';
type EventoId = 'bodas' | 'comuniones' | 'otros';

interface VenueExperienceHubProps {
    readonly blockHref: string;
    readonly visitHref: string;
    readonly whatsappUrl: string;
}

interface SegmentCopy {
    readonly headline: string;
    readonly subhead: string;
    readonly bullets: readonly string[];
    readonly ctaPrimaryLabel: string;
    readonly ctaPrimaryHref: string;
    readonly conciergeHref: string;
}

type IconComponent = React.ComponentType<{ className?: string }>;

const WA_DIGITS = CENTRALITA_EAR_OS.replace(/\D/g, '');

const AUDIENCE_TABS: readonly { id: AudienceId; label: string; icon: IconComponent }[] = [
    { id: 'pareja', label: 'Pareja', icon: Heart },
    { id: 'empresa', label: 'Empresa', icon: Building2 },
    { id: 'particular', label: 'Particular', icon: UserRound },
];

const EVENTO_SUBTABS: readonly { id: EventoId; label: string }[] = [
    { id: 'bodas', label: 'Bodas' },
    { id: 'comuniones', label: 'Comuniones' },
    { id: 'otros', label: 'Otros eventos' },
];

function buildWaHref(message: string): string {
    return `https://wa.me/${WA_DIGITS}?text=${encodeURIComponent(message)}`;
}

/**
 * Copia por segmento. Regla de oro (orden CEO 2026-10-31): toda cifra y
 * promesa bebe SOLO de la ficha del proveedor (EZKERTZA_DERIO_VENUE /
 * OFFICIAL_OTZARRETA_MENUS) y del SSOT (DEPOSITO_STRIPE_EUR).
 */
function buildSegmentCopy(
    audiencia: AudienceId,
    evento: EventoId,
    blockHref: string,
    whatsappUrl: string,
): SegmentCopy {
    const name = EZKERTZA_DERIO_VENUE.name;
    const muni = EZKERTZA_DERIO_VENUE.municipality;
    const ratingText = EZKERTZA_DERIO_VENUE.rating.toFixed(1).replace('.', ',');
    const comunionesCount = OFFICIAL_OTZARRETA_MENUS.filter(
        (m) => m.category === 'comuniones',
    ).length;
    const gruposCount = OFFICIAL_OTZARRETA_MENUS.filter((m) => m.category === 'grupos').length;
    const baseBullets: readonly string[] = [...EZKERTZA_DERIO_VENUE.datosDeInteres.slice(0, 3)];

    if (audiencia === 'pareja' && evento === 'bodas') {
        return {
            headline: `Tu boda en ${name}`,
            subhead: `Aforo de banquete ${EZKERTZA_DERIO_VENUE.guestRange} · ${ratingText}/5 sobre ${EZKERTZA_DERIO_VENUE.reviewCount} opiniones · el ${EZKERTZA_DERIO_VENUE.recommendationPercent}% de las parejas lo recomienda.`,
            bullets: [...baseBullets, ...EZKERTZA_DERIO_VENUE.spaces.slice(0, 2)],
            ctaPrimaryLabel: `Bloquear fecha con ${DEPOSITO_STRIPE_EUR} € deducibles`,
            ctaPrimaryHref: blockHref,
            conciergeHref: whatsappUrl,
        };
    }
    if (audiencia === 'pareja' && evento === 'comuniones') {
        return {
            headline: `Comuniones en ${name}`,
            subhead: `${comunionesCount} menús de comunión oficiales en el simulador, con jardines y el trato directo de la casa.`,
            bullets: [...baseBullets, ...EZKERTZA_DERIO_VENUE.spaces.slice(0, 2)],
            ctaPrimaryLabel: 'Consultar menús de comunión',
            ctaPrimaryHref: buildWaHref(`Hola, quiero información para una comunión en ${name} (${muni}).`),
            conciergeHref: whatsappUrl,
        };
    }
    if (audiencia === 'pareja') {
        return {
            headline: `Celebraciones familiares en ${name}`,
            subhead: `Aniversarios y eventos de día con el servicio completo del caserío y sus jardines.`,
            bullets: [...baseBullets, ...EZKERTZA_DERIO_VENUE.spaces.slice(0, 2)],
            ctaPrimaryLabel: 'Contar mi evento',
            ctaPrimaryHref: buildWaHref(`Hola, quiero celebrar un evento familiar en ${name} (${muni}).`),
            conciergeHref: whatsappUrl,
        };
    }
    if (audiencia === 'empresa') {
        return {
            headline: `Eventos de empresa en ${name}`,
            subhead: `${gruposCount} menús de grupos y empresa oficiales en el simulador, con sonorización para discursos y presentaciones.`,
            bullets: [...baseBullets, ...EZKERTZA_DERIO_VENUE.services.slice(0, 2)],
            ctaPrimaryLabel: 'Solicitar dossier de empresa',
            ctaPrimaryHref: buildWaHref(`Hola, quiero el dossier de empresa para un evento en ${name} (${muni}).`),
            conciergeHref: whatsappUrl,
        };
    }
    return {
        headline: `Tu evento privado en ${name}`,
        subhead: `Celebraciones privadas con el trato directo de la casa: aforo ${EZKERTZA_DERIO_VENUE.guestRange} y menús en el simulador.`,
        bullets: [...baseBullets, ...EZKERTZA_DERIO_VENUE.services.slice(0, 2)],
        ctaPrimaryLabel: 'Consultar disponibilidad',
        ctaPrimaryHref: buildWaHref(`Hola, quiero información para una celebración privada en ${name} (${muni}).`),
        conciergeHref: whatsappUrl,
    };
}

export default function VenueExperienceHub({
    blockHref,
    visitHref,
    whatsappUrl,
}: VenueExperienceHubProps): React.JSX.Element {
    const [audiencia, setAudiencia] = useState<AudienceId>('pareja');
    const [evento, setEvento] = useState<EventoId>('bodas');

    // Temperatura de lead entrante: si llega con ?audiencia=&evento=, el hub
    // arranca en ese segmento (iteración del comercial, sin datos personales).
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const a = params.get('audiencia');
        const e = params.get('evento');
        if (a === 'pareja' || a === 'empresa' || a === 'particular') setAudiencia(a);
        if (e === 'bodas' || e === 'comuniones' || e === 'otros') setEvento(e);
    }, []);

    const syncUrl = (a: AudienceId, e: EventoId): void => {
        if (typeof window === 'undefined') return;
        const url = new URL(window.location.href);
        url.searchParams.set('audiencia', a);
        url.searchParams.set('evento', e);
        window.history.replaceState(null, '', url.toString());
    };

    const selectAudiencia = (a: AudienceId): void => {
        setAudiencia(a);
        syncUrl(a, a === 'pareja' ? evento : 'otros');
    };

    const selectEvento = (e: EventoId): void => {
        setEvento(e);
        syncUrl(audiencia, e);
    };

    const copy = buildSegmentCopy(audiencia, evento, blockHref, whatsappUrl);
    const isExternalPrimary = copy.ctaPrimaryHref.startsWith('http');
    const menuCount = OFFICIAL_OTZARRETA_MENUS.length;

    return (
        <div
            data-audiencia={audiencia}
            data-evento={evento}
            className="mt-6 rounded-3xl border border-white/10 bg-[#09090d]/80 backdrop-blur-md p-6 sm:p-8 space-y-8"
        >
            {/* Selector de audiencia: el segmento elegido es la temperatura */}
            <div className="space-y-3">
                <div
                    className="flex flex-wrap items-center justify-center gap-2"
                    role="tablist"
                    aria-label="Tipo de cliente"
                >
                    {AUDIENCE_TABS.map((tab) => {
                        const TabIcon = tab.icon;
                        const isActive = audiencia === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => selectAudiencia(tab.id)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ease-out flex items-center gap-2 ${
                                    isActive
                                        ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                                }`}
                            >
                                <TabIcon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
                {audiencia === 'pareja' && (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {EVENTO_SUBTABS.map((tab) => {
                            const isActive = evento === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => selectEvento(tab.id)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-300 ease-out border ${
                                        isActive
                                            ? 'bg-white/10 text-[#ecb613] border-[#ecb613]/40'
                                            : 'text-gray-500 hover:text-gray-300 border-white/10'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Copia del segmento: solo bebe de la ficha del proveedor */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <div className="lg:col-span-2 space-y-3">
                    <h3 className="text-2xl font-extrabold text-white">{copy.headline}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{copy.subhead}</p>
                    {copy.bullets.length > 0 && (
                        <ul className="space-y-1.5">
                            {copy.bullets.map((bullet, index) => (
                                <li
                                    key={`${audiencia}-${index}`}
                                    className="flex items-start gap-2 text-xs text-gray-400"
                                >
                                    <Flame className="w-3.5 h-3.5 text-[#ecb613] shrink-0 mt-0.5" />
                                    <span>{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="flex flex-col gap-3">
                    <a
                        href={copy.ctaPrimaryHref}
                        target={isExternalPrimary ? '_blank' : undefined}
                        rel={isExternalPrimary ? 'noopener noreferrer' : undefined}
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#ecb613] via-[#f7cb45] to-[#ecb613] text-black font-extrabold text-sm text-center hover:brightness-110 transition-all inline-flex items-center justify-center gap-2"
                    >
                        <CalendarCheck className="w-4 h-4" />
                        {copy.ctaPrimaryLabel}
                    </a>
                    <a
                        href={visitHref}
                        className="px-5 py-3 rounded-xl bg-[#09090d]/80 border border-white/15 text-white font-semibold text-sm text-center hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2"
                    >
                        <ArrowRight className="w-4 h-4" />
                        Visita técnica
                    </a>
                    <a
                        href={copy.conciergeHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-3 rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-emerald-300 font-semibold text-sm text-center hover:bg-emerald-950/50 transition-all inline-flex items-center justify-center gap-2"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Hablar con la Conserjería
                    </a>
                </div>
            </div>

            {/* Simulador oficial: menús + cotizador + blindaje acústico */}
            <OtzarretaExperienceExplorer />

            <p className="text-center text-[10px] font-mono text-gray-600">
                TEMPERATURA DE LEAD · {audiencia.toUpperCase()} · {evento.toUpperCase()} · {menuCount} MENÚS EN SIMULADOR · FUENTE ÚNICA: FICHA DEL PROVEEDOR
            </p>
        </div>
    );
}
