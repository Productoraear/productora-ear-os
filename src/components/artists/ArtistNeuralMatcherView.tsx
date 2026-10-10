"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { NeuralArtistTinderMatch, type CanonicalArtist } from './NeuralArtistTinderMatch';
import type { CoupleCalibration } from '@/lib/matching/calibratorTypes';
import { ARTIST_CALIBRATION_DIMENSIONS } from '@/lib/matching/artistCalibratorTypes';

/**
 * 🎸 B1.03 — ARTIST NEURAL MATCHER VIEW
 * Client shell que hidrata el dataset curado de artistas y lo conecta al
 * NeuralArtistTinderMatch con un CoupleCalibration por defecto (dims pareja 1-50).
 *
 * A11Y (W07-027):
 * - Región principal con role="region" y aria-label descriptivo.
 * - Estados de carga/error/vacío con roles ARIA apropiados (status/alert).
 * - aria-live para anuncios dinámicos a lectores de pantalla.
 * - aria-busy en el contenedor durante la carga.
 * - aria-labelledby/aria-describedby para asociar encabezado y descripción.
 */
const CANONICAL_URL = '/data/artists/artists_canonical.json';

const REGION_ID = 'artist-neural-matcher-view';
const HEADING_ID = 'artist-neural-matcher-heading';
const DESCRIPTION_ID = 'artist-neural-matcher-description';

function buildDefaultCoupleCalibration(): CoupleCalibration {
    const dims: CoupleCalibration['dimensions'] = {};
    for (const d of ARTIST_CALIBRATION_DIMENSIONS) {
        if (d.side === 'couple') {
            dims[d.id] = d.defaultValue;
        }
    }
    return {
        dimensions: dims,
        completionPercent: 40
    };
}

export const ArtistNeuralMatcherView: React.FC = () => {
    const [artists, setArtists] = useState<CanonicalArtist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const coupleCalibration = useMemo(() => buildDefaultCoupleCalibration(), []);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await fetch(CANONICAL_URL);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data: unknown = await res.json();
                if (alive) setArtists(Array.isArray(data) ? (data as CanonicalArtist[]) : []);
            } catch (e) {
                if (alive) setError(e instanceof Error ? e.message : 'Error de carga');
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    if (loading) {
        return (
            <div
                id={REGION_ID}
                role="region"
                aria-label="Matcher neural de artistas"
                aria-labelledby={HEADING_ID}
                aria-describedby={DESCRIPTION_ID}
                aria-busy="true"
                className="w-full mx-auto max-w-7xl px-4 sm:px-6 py-12"
            >
                <h1 id={HEADING_ID} className="sr-only">
                    Matcher neural de artistas
                </h1>
                <p id={DESCRIPTION_ID} className="sr-only">
                    Cargando el dataset curado de artistas para el emparejamiento neural.
                </p>
                <div
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    className="w-full py-16 text-center font-mono text-xs text-zinc-500"
                >
                    Cargando dataset neural de artistas…
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                id={REGION_ID}
                role="region"
                aria-label="Matcher neural de artistas"
                aria-labelledby={HEADING_ID}
                aria-describedby={DESCRIPTION_ID}
                className="w-full mx-auto max-w-7xl px-4 sm:px-6 py-12"
            >
                <h1 id={HEADING_ID} className="sr-only">
                    Matcher neural de artistas
                </h1>
                <p id={DESCRIPTION_ID} className="sr-only">
                    Error al cargar el dataset curado de artistas.
                </p>
                <div
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                    className="w-full py-16 text-center font-mono text-xs text-amber-400"
                >
                    No se pudo cargar el dataset de artistas: {error}
                </div>
            </div>
        );
    }

    if (artists.length === 0) {
        return (
            <div
                id={REGION_ID}
                role="region"
                aria-label="Matcher neural de artistas"
                aria-labelledby={HEADING_ID}
                aria-describedby={DESCRIPTION_ID}
                className="w-full mx-auto max-w-7xl px-4 sm:px-6 py-12"
            >
                <h1 id={HEADING_ID} className="sr-only">
                    Matcher neural de artistas
                </h1>
                <p id={DESCRIPTION_ID} className="sr-only">
                    No hay artistas curados disponibles en el dataset.
                </p>
                <div
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    className="w-full py-16 text-center font-mono text-xs text-zinc-500"
                >
                    Sin artistas curados. Ejecuta scripts/absorb_celebrents_artists.cjs
                </div>
            </div>
        );
    }

    return (
        <section
            id={REGION_ID}
            role="region"
            aria-label="Matcher neural de artistas"
            aria-labelledby={HEADING_ID}
            aria-describedby={DESCRIPTION_ID}
            className="w-full mx-auto max-w-7xl px-4 sm:px-6 py-12"
        >
            <h1 id={HEADING_ID} className="sr-only">
                Matcher neural de artistas
            </h1>
            <p id={DESCRIPTION_ID} className="sr-only">
                Interfaz interactiva para emparejar artistas mediante calibración neural de pareja.
            </p>
            <NeuralArtistTinderMatch
                artists={artists}
                coupleCalibration={coupleCalibration}
            />
        </section>
    );
};

export default ArtistNeuralMatcherView;