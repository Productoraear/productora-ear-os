"use server";

import { trackFleetUnit } from "./fleet-actions";

/**
 * 🛰️ EAR OS / TELEMETRY BROADCASTER (MOCK DRIVER)
 * Simulates a real-time tracking session by emitting pings at intervals.
 */

export interface TelemetryStreamResult {
  readonly success: boolean;
}

export interface TelemetryStreamParams {
  readonly waybillId: string;
  readonly unitId: string;
  readonly startLat: number;
  readonly startLng: number;
  readonly endLat: number;
  readonly endLng: number;
}

const TELEMETRY_STEPS = 20;
const TELEMETRY_INTERVAL_MS = 2000;
const TELEMETRY_MOCK_SPEED = 120;
const TELEMETRY_MOCK_HEADING = 0;

function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function simulateTelemetryStream(
  waybillId: string,
  unitId: string,
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Promise<TelemetryStreamResult> {
  console.log(
    `[SIMULATOR] Starting telemetry stream for Waybill ${waybillId} (Unit ${unitId})`
  );

  for (let i = 0; i <= TELEMETRY_STEPS; i++) {
    const t = i / TELEMETRY_STEPS;
    const currentLat = startLat + (endLat - startLat) * t;
    const currentLng = startLng + (endLng - startLng) * t;

    await trackFleetUnit({
      waybillId,
      latitude: currentLat,
      longitude: currentLng,
      type: i === TELEMETRY_STEPS ? "ARRIVED" : "LOCATION_PING",
      heading: TELEMETRY_MOCK_HEADING,
      speed: TELEMETRY_MOCK_SPEED,
    });

    if (i < TELEMETRY_STEPS) {
      await delay(TELEMETRY_INTERVAL_MS);
    }
  }

  console.log(`[SIMULATOR] Waybill ${waybillId} simulation completed.`);
  return { success: true };
}