"use server";
import { trackFleetUnit } from "./fleet-actions";
/**
 * 🛰️ EAR OS / TELEMETRY BROADCASTER (MOCK DRIVER)
 * Simulates a real-time tracking session by emitting pings at intervals.
 */
export async function simulateTelemetryStream(waybillId, unitId, startLat, startLng, endLat, endLng) {
    console.log(`[SIMULATOR] Starting telemetry stream for Waybill ${waybillId}`);
    const steps = 20;
    const interval = 2000; // 2 seconds between pings
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const currentLat = startLat + (endLat - startLat) * t;
        const currentLng = startLng + (endLng - startLng) * t;
        // Persist to DB via existing S-Class Action
        await trackFleetUnit({
            waybillId,
            latitude: currentLat,
            longitude: currentLng,
            type: i === steps ? "ARRIVED" : "LOCATION_PING",
            heading: 0, // Simplified for mock
            speed: 120,
        });
        // Wait before next ping
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    console.log(`[SIMULATOR] Waybill ${waybillId} simulation completed.`);
    return { success: true };
}
