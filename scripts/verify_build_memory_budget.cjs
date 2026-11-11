#!/usr/bin/env node
/**
 * verify_build_memory_budget.cjs — GATE DE MEMORIA DE BUILD (P0 OOM COOLIFY)
 *
 * Problema que resuelve: el VPS de produccion (82.29.179.172) tiene 1 vCPU y
 * 4 GB de RAM. Sin `experimental.cpus` Next.js reparte la compilacion entre
 * 4 workers (node_modules/next/dist/build/index.js:381) y el prerenderizado
 * agota el heap -> "/bin/sh -c npm run build" exit code: 1 en Coolify.
 *
 * Este gate carga la configuracion REAL con el cargador de Next (no lee el
 * texto del fichero), de modo que valida a la vez:
 *   1. Que `next.config.ts` no rompe el esquema Zod de Next 16.
 *   2. Que el presupuesto de memoria queda acotado a 1 worker.
 *   3. Que el Dockerfile exporta el heap de V8 antes de `npm run build`.
 *
 * Exit 0 solo si los 6 checks pasan. Exit 1 si cualquiera falla (bloquea deploy).
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const results = [];

function check(name, ok, detail) {
  results.push({ name, ok, detail });
}

async function main() {
  const loadConfig = require(path.join(ROOT, "node_modules", "next", "dist", "server", "config")).default;

  let config;
  try {
    config = await loadConfig(ROOT, "phase-production-build");
    check("config_loads", true, "next.config.ts supera el esquema Zod de Next 16");
  } catch (err) {
    check("config_loads", false, `next.config.ts invalido: ${err.message}`);
    return report();
  }

  const exp = config.experimental || {};

  // 1. Un unico worker de compilacion (rama de override, build/index.js:371-373).
  check("experimental_cpus_1", exp.cpus === 1, `experimental.cpus = ${exp.cpus} (esperado 1)`);

  // 2. Sin hilos de worker: evita fork de procesos por nucleo.
  check("worker_threads_off", exp.workerThreads === false, `experimental.workerThreads = ${exp.workerThreads} (esperado false)`);

  // 3. Optimizaciones de memoria del compilador activas.
  check("webpack_memory_opt", exp.webpackMemoryOptimizations === true, `experimental.webpackMemoryOptimizations = ${exp.webpackMemoryOptimizations} (esperado true)`);

  // 4. El runner consume .next/standalone (imagen ligera).
  check("output_standalone", config.output === "standalone", `output = ${config.output} (esperado standalone)`);

  // 5. El Dockerfile fija el heap de V8 ANTES de compilar.
  const dockerfile = fs.readFileSync(path.join(ROOT, "Dockerfile"), "utf8");
  const heapMatch = dockerfile.match(/--max-old-space-size=(\d+)/);
  const heapMb = heapMatch ? Number(heapMatch[1]) : 0;
  check("dockerfile_heap_env", heapMb >= 2048 && heapMb <= 3072, `NODE_OPTIONS --max-old-space-size=${heapMb} MB (esperado 2048-3072)`);

  // 6. El heap se declara en el stage builder, no solo en el base.
  const builderBlock = dockerfile.split(/^FROM /m).find((s) => s.startsWith("base AS builder")) || "";
  check("heap_in_builder_stage", /max-old-space-size=\d+/.test(builderBlock), "el stage builder declara su propio NODE_OPTIONS");

  return report();
}

function report() {
  const failed = results.filter((r) => !r.ok);
  for (const r of results) {
    console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name.padEnd(24)} ${r.detail}`);
  }
  console.log("");
  console.log(`BUILD_MEMORY_BUDGET=${failed.length === 0 ? "PASS" : "FAIL"} CHECKS=${results.length} FAILED=${failed.length}`);
  process.exitCode = failed.length === 0 ? 0 : 1;
}

main().catch((err) => {
  console.error(`BUILD_MEMORY_BUDGET=ERROR ${err && err.stack ? err.stack : err}`);
  process.exitCode = 1;
});
