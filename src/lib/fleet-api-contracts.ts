import { z } from "zod";

/**
 * 🛰️ FLEET & LOGISTICS OS — API CONTRACTS
 * Standard: Silicon Valley Real-Time Standard
 */

// 1. GPS Telemetry Ping (from Driver App)
export const TelemetryPingSchema = z.object({
  unitId: z.string().uuid(),
  waybillId: z.string().uuid(),
  deviceId: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  altitude: z.number().optional(),
  speed: z.number().min(0).max(500).optional(),
  heading: z.number().min(0).max(360).optional(),
  accuracy: z.number().min(0).optional(),
  timestamp: z.string().datetime().refine((val) => {
    const date = new Date(val);
    return date <= new Date(Date.now() + 60000);
  }, { message: "Timestamp cannot be in the future" }).default(() => new Date().toISOString()),
});

export type TelemetryPing = z.infer<typeof TelemetryPingSchema>;

// 2. Waybill Update (from Admin or Driver)
export const WaybillStatusSchema = z.enum([
  "PENDING",
  "IN_TRANSIT",
  "ARRIVED",
  "COMPLETED",
  "CANCELLED",
  "DELAYED",
]);

export const UpdateWaybillSchema = z.object({
  status: WaybillStatusSchema.optional(),
  metadata: z.record(z.any()).optional(),
  actualArrivalTime: z.string().datetime().optional(),
});

export type UpdateWaybill = z.infer<typeof UpdateWaybillSchema>;

// 3. Response Contracts
export const FleetAPIResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  timestamp: z.string().datetime(),
});
