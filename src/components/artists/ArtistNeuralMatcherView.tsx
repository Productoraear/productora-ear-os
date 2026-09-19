"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { NeuralArtistTinderMatch, type CanonicalArtist } from './NeuralArtistTinderMatch';
import type { CoupleCalibration } from '@/lib/matching/calibratorTypes';
import { ARTIST_CALIBRATION_DIMENSIONS } from '@/lib/matching/artistCalibratorTypes';

/**
 * 🎸 B1.03 — ARTIST NEURAL MATCHER VIEW
 * Client shell que hidrata el dataset curado de artistas y lo conecta al
 * NeuralArtistTinderMatch con un CoupleCalibration por defecto (dims pareja 1-50).
 */
const CANONICAL_URL = '/data/artists/artists_canonical.json';

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
                const data = await res.json();
                if (alive) setArtists(Array.isArray(data) ? data : []);
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
            <div className="w-full py-16 text-center font-mono text-xs text-zinc-500">
                Cargando dataset neural de artistas…
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-16 text-center font-mono text-xs text-amber-400">
                No se pudo cargar el dataset de artistas: {error}
            </div>
        );
    }

    if (artists.length === 0) {
        return (
            <div className="w-full py-16 text-center font-mono text-xs text-zinc-500">
                Sin artistas curados. Ejecuta scripts/absorb_celebrents_artists.cjs
            </div>
        );
    }

    return (
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 py-12">
            <NeuralArtistTinderMatch
                artists={artists}
                coupleCalibration={coupleCalibration}
            />
        </div>
    );
};

export default ArtistNeuralMatcherView;