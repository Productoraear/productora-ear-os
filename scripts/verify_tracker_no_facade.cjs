"use strict";

const fs = require("node:fs");
const path = require("node:path");

const TRACKER_PATH = path.join(
  __dirname,
  "..",
  "src",
  "components",
  "telemetry",
  "LiveFleetTracker.tsx"
);

const source = fs.readFileSync(TRACKER_PATH, "utf8");

const failures = [];

if (source.includes("Math.random")) {
  failures.push("LiveFleetTracker.tsx contiene 'Math.random' (datos simulados prohibidos).");
}

if (!source.includes("/api/telemetry/")) {
  failures.push("LiveFleetTracker.tsx no consume '/api/telemetry/' (API real ausente).");
}

if (!source.includes("AbortController")) {
  failures.push("LiveFleetTracker.tsx no usa 'AbortController' (polling sin cancelación).");
}

if (failures.length > 0) {
  for (const message of failures) {
    console.error(`[FAIL] ${message}`);
  }
  process.exit(1);
}

console.log(
  "[PASS] LiveFleetTracker defacade verificado: sin Math.random, consume /api/telemetry/ y usa AbortController."
);
process.exit(0);
