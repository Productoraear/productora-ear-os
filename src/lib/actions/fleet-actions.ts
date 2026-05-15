"use server";

import { revalidatePath } from "next/cache";
import { TelemetryPingSchema, type TelemetryPing } from "@/lib/fleet-api-contracts";
import { prisma } from "@/lib/prisma"; // Assuming Prisma is configured

/**
 * 🚀 FLEET OS SERVER ACTIONS
 * Handle real-time telemetry ingestion and database mutations.
 */

export async function updateFleetTelemetry(data: TelemetryPing) {
  try {
    // 1. Validate against API Contract
    const validatedData = TelemetryPingSchema.parse(data);

    // 2. Security Check: Multi-tenant Lockdown
    // In strict mode, we ensure the driver_id matches the authenticated user
    // const session = await getAuthSession(); // Implement session check
    // if (!session) throw new Error("Unauthenticated");

    console.log(`[FLEET_TELEMETRY] Ping received for Unit ${validatedData.unitId} on Waybill ${validatedData.waybillId}`);

    // 3. Persist to Postgres
    const position = await prisma.fleetPosition.create({
      data: {
        unitId: validatedData.unitId,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        altitude: validatedData.altitude,
        speed: validatedData.speed,
        heading: validatedData.heading,
        accuracy: validatedData.accuracy,
        source: "SERVER_ACTION",
      }
    });

    // 4. Update Waybill Status Event
    await prisma.fleetTelemetryEvent.create({
      data: {
        waybillId: validatedData.waybillId,
        eventType: "position_updated",
        payload: { lat: validatedData.latitude, lng: validatedData.longitude }
      }
    });

    // 5. Optimized Revalidation (Avoid full page revalidation on high-freq pings)
    // revalidateTag(`fleet-unit-${validatedData.unitId}`);

    return { 
      success: true, 
      message: "Telemetry synchronized", 
      id: position.id
    };

  } catch (error) {
    console.error("[FLEET_TELEMETRY_ERROR]", error);
    return { 
      success: false, 
      message: "Sync failed", 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}
