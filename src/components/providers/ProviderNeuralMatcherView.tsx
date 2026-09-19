"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
    NeuralProviderTinderMatch,
    type CanonicalProviderService
} from './NeuralProviderTinderMatch';
import type { CoupleCalibration } from '@/lib/matching/calibratorTypes';
import { PROVIDER_SERVICE_CALIBRATION_DIMENSIONS } from '@/lib/matching/providerServiceCalibratorTypes';

/**
 * 📦 B1.04B — PROVIDER NEURAL MATCHER VIEW
 * Client shell que hidrata el dataset curado de proveedores y lo conecta al
 * NeuralProviderTinderMatch con un CoupleCalibration por defecto (dims pareja 1-50).
 */
const CANONICAL_URL = '/data/providers/providers_canonical.json';

function buildDefaultCoupleCalibration(): CoupleCalibration {
    const dims: CoupleCalibration['dimensions'] = {};
    for (const d of PROVIDER_SERVICE_CALIBRATION_DIMENSIONS) {
        if (d.side === 'couple') {
            dims[d.id] = d.defaultValue;
        }
    }
    return {
        dimensions: dims,
        completionPercent: 50
    };
}

export const ProviderNeuralMatcherView: React.FC = () => {
    const [providers, setProviders] = useState<CanonicalProviderService[]>([]);
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
                if (alive) setProviders(Array.isArray(data) ? data : []);
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
            <div className="w-full py-20 text-center font-mono text-xs text-zinc-500">
                <div className="inline-block animate-spin mr-2">⚙️</div>
                Cargando calibrador neural de proveedores B2B/B2G…
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-16 text-center text-xs font-mono text-red-400 bg-red-950/20 border border-red-500/20 rounded-2xl p-4">
                Error al cargar el catálogo de proveedores: {error}
            </div>
        );
    }

    return (
        <NeuralProviderTinderMatch
            providers={providers}
            coupleCalibration={coupleCalibration}
        />
    );
};
