"use client";

import { useEffect, useRef, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, limit, orderBy } from "firebase/firestore";
import { api } from "@/lib/api";

export const useTripwire = () => {
    const initialized = useRef(false);

    /**
     * IGNITE TRIPWIRE
     * Dispara un evento de telemetría y activa los sensores del sistema.
     */
    const igniteTripwire = useCallback((type: string, data: any) => {
        api.trackEvent(`TRIPWIRE_${type.toUpperCase()}`, data);
        
        // Disparo local a la API de logs si fuera necesario
        fetch("/api/tripwire", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, data, timestamp: new Date().toISOString() })
        }).catch(() => {}); // Falla silenciosa para no interrumpir la UX
    }, []);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        // Solo activar listeners en tiempo real si existe sesión autenticada o credenciales
        let unsubLeads = () => {};
        let unsubOrders = () => {};

        try {
            unsubLeads = onSnapshot(
                query(collection(db, "ear_leads"), limit(1)), 
                (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added" && !snapshot.metadata.hasPendingWrites) {
                            igniteTripwire("lead", change.doc.data());
                        }
                    });
                },
                (err) => {
                    // Failsafe silencioso para sesiones públicas sin permisos de lectura en colecciones privadas
                    if (process.env.NODE_ENV === 'development' && err.code !== 'permission-denied') {
                        console.debug('[useTripwire] Leads listener status:', err.code);
                    }
                }
            );
        } catch (e) {
            // Failsafe ante fallo de inicialización
        }

        try {
            unsubOrders = onSnapshot(
                query(collection(db, "ear_orders"), limit(1)), 
                (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added" && !snapshot.metadata.hasPendingWrites) {
                            igniteTripwire("order", change.doc.data());
                        }
                    });
                },
                (err) => {
                    // Failsafe silencioso para sesiones públicas sin permisos de lectura en colecciones privadas
                    if (process.env.NODE_ENV === 'development' && err.code !== 'permission-denied') {
                        console.debug('[useTripwire] Orders listener status:', err.code);
                    }
                }
            );
        } catch (e) {
            // Failsafe ante fallo de inicialización
        }

        return () => {
            try {
                unsubLeads();
                unsubOrders();
            } catch (e) {}
        };
    }, [igniteTripwire]);

    return { igniteTripwire };
};
