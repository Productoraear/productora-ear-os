"use client";

import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

/**
 * 🛰️ EL CAZADOR - MOTOR DE INTERCEPTACIÓN S-CLASS (DNA EAR)
 * Directiva 05: Scraping de guerrilla y Mimetismo Digital.
 * Versión extraída de las 52 sesiones forenses (H:).
 */

export interface HunterIntercept {
    source: 'Wallapop' | 'Eventbrite' | 'Bodas.net' | 'BOE' | 'Pleno';
    target: string;
    query: string;
    location: string;
    score: number;
    amount?: string;
    metadata?: Record<string, any>;
}

export const HunterProtocol = {
    /**
     * Algoritmo de Predicción de Match Alpha
     * Basado en DigitalTwinExplorer.predictMatchScore extraído de H:
     */
    calculateMatch: (data: Partial<HunterIntercept>): number => {
        const baseScore = 75;
        let bonus = 0;
        
        // Lógica de afinidad EAR
        if (data.location?.includes('Madrid') || data.location?.includes('Toledo')) bonus += 15;
        if (data.query?.includes('boda') || data.query?.includes('evento')) bonus += 10;
        if (data.source === 'BOE') bonus += 5;
        
        return Math.min(99, baseScore + bonus);
    },

    /**
     * Intercepción y Persistencia Forense
     */
    intercept: async (intercept: HunterIntercept) => {
        try {
            
            if (!db) {
                console.warn("[HUNTER] Firebase Offline - Modo Simulación Activo");
                return { success: true, id: 'demo-' + Date.now() };
            }

            const interceptRef = collection(db, 'ear_hunter_logs');
            const docRef = await addDoc(interceptRef, {
                ...intercept,
                status: 'INTERCEPTED',
                sovereignAura: 'ALPHA_GOD_MODE',
                timestamp: serverTimestamp()
            });

            // Disparar evento de Tripwire vía API interna
            await fetch('/api/tripwire', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'HUNTER_INTERCEPT',
                    payload: {
                        target: intercept.target,
                        source: intercept.source,
                        score: intercept.score
                    }
                })
            });

            return { success: true, id: docRef.id };
        } catch (error) {
            console.error("[HUNTER] Error crítico en intercepción:", error);
            return { success: false, error };
        }
    },

    /**
     * Mimetismo Omega (Limpieza de datos competitivos)
     * Basado en ApalancamientoEngine.applyOmegaMask
     */
    applyMimicry: (text: string): string => {
        return text
            .replace(/bodas\.net/gi, 'EAR Network')
            .replace(/fander/gi, 'EAR Talent')
            .replace(/competidor/gi, 'Fricción de Mercado')
            .replace(/wallapop/gi, 'Direct Guerrilla Feed');
    }
};

export default HunterProtocol;
