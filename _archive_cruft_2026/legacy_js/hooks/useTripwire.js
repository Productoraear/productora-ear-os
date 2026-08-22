"use client";
import { useEffect, useRef, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, limit } from "firebase/firestore";
import { api } from "@/lib/api";
export const useTripwire = () => {
    const initialized = useRef(false);
    /**
     * IGNITE TRIPWIRE
     * Dispara un evento de telemetría y activa los sensores del sistema.
     */
    const igniteTripwire = useCallback((type, data) => {
        api.trackEvent(`TRIPWIRE_${type.toUpperCase()}`, data);
        // Disparo local a la API de logs si fuera necesario
        fetch("/api/tripwire", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, data, timestamp: new Date().toISOString() })
        }).catch(() => { }); // Falla silenciosa para no interrumpir la UX
    }, []);
    useEffect(() => {
        if (initialized.current)
            return;
        initialized.current = true;
        // Listeners para reactividad en tiempo real (Dashboard)
        const unsubLeads = onSnapshot(query(collection(db, "ear_leads"), limit(1)), (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added" && !snapshot.metadata.hasPendingWrites) {
                    igniteTripwire("lead", change.doc.data());
                }
            });
        });
        const unsubOrders = onSnapshot(query(collection(db, "ear_orders"), limit(1)), (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added" && !snapshot.metadata.hasPendingWrites) {
                    igniteTripwire("order", change.doc.data());
                }
            });
        });
        return () => {
            unsubLeads();
            unsubOrders();
        };
    }, [igniteTripwire]);
    return { igniteTripwire };
};
