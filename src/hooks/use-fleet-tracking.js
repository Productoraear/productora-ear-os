"use client";
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
export function useFleetTracking(waybillId, initialPos) {
    const supabase = createClient();
    const [position, setPosition] = useState({
        lat: initialPos?.lat || 0,
        lng: initialPos?.lng || 0,
        timestamp: Date.now()
    });
    const stateRef = useRef({
        current: { lat: initialPos?.lat || 0, lng: initialPos?.lng || 0, timestamp: Date.now() },
        from: { lat: initialPos?.lat || 0, lng: initialPos?.lng || 0, timestamp: Date.now() },
        to: { lat: initialPos?.lat || 0, lng: initialPos?.lng || 0, timestamp: Date.now() },
        lastUpdate: Date.now(),
        nextExpected: Date.now() + 1000
    });
    const lerp = (start, end, t) => start + (end - start) * t;
    // Process incoming telemetry ping
    const handlePing = (ping) => {
        const now = Date.now();
        stateRef.current.from = { ...stateRef.current.current };
        stateRef.current.to = {
            lat: ping.latitude,
            lng: ping.longitude,
            heading: ping.heading,
            timestamp: now
        };
        stateRef.current.lastUpdate = now;
        stateRef.current.nextExpected = now + 2000; // Expected interval (adjust based on frequency)
    };
    useEffect(() => {
        if (!waybillId)
            return;
        // 1. Subscribe to Realtime Telemetry for this Waybill
        const channel = supabase
            .channel(`fleet-tracking-${waybillId}`)
            .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'fleet_telemetry_events',
            filter: `waybill_id=eq.${waybillId}`,
        }, (payload) => {
            console.log('[TELEMETRY_REALTIME]', payload.new);
            handlePing(payload.new);
        })
            .subscribe();
        // 2. Animation Loop (LERP Engine)
        let frameId;
        const tick = () => {
            const now = Date.now();
            const state = stateRef.current;
            const duration = Math.max(10, state.nextExpected - state.lastUpdate);
            const t = Math.min(1.2, (now - state.lastUpdate) / duration); // Slight overshoot allowed for smoothness
            const interpolatedPos = {
                lat: lerp(state.from.lat, state.to.lat, t),
                lng: lerp(state.from.lng, state.to.lng, t),
                heading: state.to.heading ? lerp(state.from.heading || 0, state.to.heading, t) : state.from.heading,
                timestamp: now
            };
            state.current = interpolatedPos;
            setPosition(interpolatedPos);
            frameId = requestAnimationFrame(tick);
        };
        frameId = requestAnimationFrame(tick);
        return () => {
            supabase.removeChannel(channel);
            cancelAnimationFrame(frameId);
        };
    }, [waybillId, supabase]);
    return { position };
}
