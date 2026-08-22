"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
/**
 * 🚀 EAR OS / FLEET COMMAND SERVER ACTIONS (V4 PRODUCTION)
 * Sovereign logistics engine for real-time dispatch and telemetry.
 */
const TelemetryPingSchema = z.object({
    waybillId: z.string().uuid(),
    actorUserId: z.string().optional(),
    latitude: z.number(),
    longitude: z.number(),
    heading: z.number().optional().nullable(),
    speed: z.number().optional().nullable(),
    accuracy: z.number().optional().nullable(),
    type: z.enum(["LOCATION_PING", "ARRIVED", "COMPLETED", "CANCELLED"]).default("LOCATION_PING"),
});
/**
 * Persists a telemetry ping and updates the unit's last known position.
 */
export async function trackFleetUnit(data) {
    try {
        const validated = TelemetryPingSchema.parse(data);
        return await prisma.$transaction(async (tx) => {
            // 1. Log Telemetry Event
            const event = await tx.fleetTelemetryEvent.create({
                data: {
                    waybillId: validated.waybillId,
                    actorUserId: validated.actorUserId,
                    type: validated.type,
                    latitude: validated.latitude,
                    longitude: validated.longitude,
                    heading: validated.heading,
                    speed: validated.speed,
                    accuracy: validated.accuracy,
                },
            });
            // 2. Find associated Unit via Waybill
            const waybill = await tx.waybill.findUnique({
                where: { id: validated.waybillId },
                select: { unitId: true, workspaceId: true },
            });
            if (waybill?.unitId) {
                // 3. Update Unit's Real-time Shadow State
                await tx.fleetUnit.update({
                    where: { id: waybill.unitId },
                    data: {
                        lastLatitude: validated.latitude,
                        lastLongitude: validated.longitude,
                        lastHeading: validated.heading,
                        lastSpeed: validated.speed,
                        lastPingAt: new Date(),
                        status: validated.type === "LOCATION_PING" ? "BUSY" : "IDLE",
                    },
                });
            }
            return { success: true, eventId: event.id };
        });
    }
    catch (error) {
        console.error("[FLEET_COMMAND_ERROR]", error);
        return { success: false, error: "Logistics synchronization failed" };
    }
}
/**
 * Assigns a Fleet Unit to a Waybill (Dispatcher Action).
 */
export async function dispatchWaybill(waybillId, unitId) {
    try {
        const result = await prisma.$transaction(async (tx) => {
            const waybill = await tx.waybill.update({
                where: { id: waybillId },
                data: {
                    unitId,
                    status: "DISPATCHED"
                },
            });
            await tx.fleetUnit.update({
                where: { id: unitId },
                data: { status: "BUSY" },
            });
            // Log assignment event
            await tx.fleetTelemetryEvent.create({
                data: {
                    waybillId,
                    type: "UNIT_ASSIGNED",
                    latitude: 0, // Placeholder as it's an administrative event
                    longitude: 0,
                    payload: { unitId },
                },
            });
            return waybill;
        });
        revalidatePath("/admin/fleet");
        return { success: true, data: result };
    }
    catch (error) {
        console.error("[DISPATCH_ERROR]", error);
        return { success: false, error: "Dispatch sequence aborted" };
    }
}
