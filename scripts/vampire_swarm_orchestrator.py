#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
═══════════════════════════════════════════════════════════════════════════════
  🦇 EAR OS V2 — MASTER VAMPIRE SWARM ORCHESTRATOR (PARALLEL HARVESTER)
  Arquitectura: ANTIGRAVITY OMEGA v5.0 · Modo CEO Activo · Protocolo ZTM
  Entorno: H:\EAR_OS_V2\EAR_OS_V2 · Bare-Metal Multi-Process Execution
═══════════════════════════════════════════════════════════════════════════════

  OBJETIVO:
    Lanzar y coordinar SIMULTÁNEAMENTE toda la flota de scripts vampiro del
    ecosistema EAR OS en paralelo, aislando sus streams de logs, controlando
    su estado de proceso y consolidando un informe de telemetría unificado.

  UNIDADES DE COMBATE VAMPÍRICO:
    1. UNIT_HTML_MASSIVE       -> scripts/vampirize_massive_html_vaults.py
    2. UNIT_LIGHTING_B2G       -> scripts/vampirize_christmas_lighting_b2g.py
    3. UNIT_DEMETRIO_CATALOG   -> scripts/vampirize_demetrio_full.py
    4. UNIT_BIO_OBJECTIONS     -> scripts/vampire_bio_and_objections_miner.py
    5. UNIT_ORACLE_RAG         -> scripts/vampire_oracle_miner.py
    6. UNIT_B2G_TENDER_HUNTER  -> scripts/b2g_tender_hunter.py --mock
    7. UNIT_FORENSIC_SWEEPER   -> scripts/full_pc_forensic_ear_sweeper.py

  DIRECTIVAS INMUTABLES:
    - Zero-Token Memory (ZTM): 100% cómputo local bare-metal.
    - Preservación del Split Soberano (80/10/10).
    - Cero interferencia de E/S: Logs redirigidos a scripts/reports/swarm/
═══════════════════════════════════════════════════════════════════════════════
"""

import os
import sys
import time
import json
import subprocess
from pathlib import Path
from datetime import datetime

# Configuración UTF-8 en consola Windows
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

PROJECT_ROOT = Path(r"H:\EAR_OS_V2\EAR_OS_V2")
SCRIPTS_DIR = PROJECT_ROOT / "scripts"
REPORTS_DIR = SCRIPTS_DIR / "reports"
SWARM_LOGS_DIR = REPORTS_DIR / "swarm"
SWARM_LOGS_DIR.mkdir(parents=True, exist_ok=True)

TELEMETRY_OUT = REPORTS_DIR / "vampire_swarm_master_telemetry.json"

# Definición de la flota de vampiros
VAMPIRE_UNITS = [
    {
        "id": "UNIT_HTML_MASSIVE",
        "name": "Vampirizador Masivo de HTMLs (Proveedores H: & I:)",
        "script": "vampirize_massive_html_vaults.py",
        "args": [],
        "output_target": "src/data/bodas-vendors-harvested.json",
        "priority": 1
    },
    {
        "id": "UNIT_LIGHTING_B2G",
        "name": "Ingestor Alumbrado Navideño B2G & CPV 31522000",
        "script": "vampirize_christmas_lighting_b2g.py",
        "args": [],
        "output_target": "src/data/admin/christmas_lighting_b2g.json",
        "priority": 2
    },
    {
        "id": "UNIT_DEMETRIO_CATALOG",
        "name": "Vampirización Total Catálogo Demetrio Luces 2025/2026",
        "script": "vampirize_demetrio_full.py",
        "args": [],
        "output_target": "src/data/demetrio_luces_navidad_2025.json",
        "priority": 3
    },
    {
        "id": "UNIT_BIO_OBJECTIONS",
        "name": "Omni-Drive Miner (Biografía Edwin & Objeciones Dani Aragón)",
        "script": "vampire_bio_and_objections_miner.py",
        "args": [],
        "output_target": "src/data/edwin-true-bio-ssot_draft.json",
        "priority": 4
    },
    {
        "id": "UNIT_ORACLE_RAG",
        "name": "Oráculo Estratégico High-Density Distiller",
        "script": "vampire_oracle_miner.py",
        "args": [],
        "output_target": "src/data/oraculo-rag-ssot.json",
        "priority": 5
    },
    {
        "id": "UNIT_B2G_TENDER_HUNTER",
        "name": "Cazador B2G PLACE/TED Licitaciones Menores Art. 118",
        "script": "b2g_tender_hunter.py",
        "args": ["--mock"],
        "output_target": "src/data/b2g/b2g_doble_impacto_municipal.json",
        "priority": 6
    },
    {
        "id": "UNIT_FORENSIC_SWEEPER",
        "name": "Barrido Forense ZTM Omni-Drive & Absorbed Vault",
        "script": "full_pc_forensic_ear_sweeper.py",
        "args": [],
        "output_target": "src/data/ear-rag-database.json",
        "priority": 7
    }
]

def main():
    start_time = datetime.now()
    print("=" * 80)
    print("🦇 [EAR OS V2] ACTIVACIÓN SIMULTÁNEA DEL ENJAMBRE VAMPÍRICO TOTAL")
    print(f"   Hora de Ignición: {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"   Directorio Raíz: {PROJECT_ROOT}")
    print(f"   Logs de Enjambre: {SWARM_LOGS_DIR}")
    print("=" * 80)

    running_processes = []
    
    # 1. Disparo simultáneo de todos los procesos
    for unit in VAMPIRE_UNITS:
        script_path = SCRIPTS_DIR / unit["script"]
        if not script_path.exists():
            print(f"⚠️ [SKIP] {unit['id']}: No se encontró el script {unit['script']}")
            continue

        log_file_path = SWARM_LOGS_DIR / f"{unit['id']}.log"
        log_file = open(log_file_path, "w", encoding="utf-8", errors="replace")

        cmd = [sys.executable, str(script_path)] + unit["args"]
        
        print(f"🚀 [IGNICIÓN] {unit['id']} -> {unit['name']}")
        print(f"   Comando: {' '.join(cmd)}")
        print(f"   Log: {log_file_path.name}")
        
        proc = subprocess.Popen(
            cmd,
            cwd=str(PROJECT_ROOT),
            stdout=log_file,
            stderr=subprocess.STDOUT,
            shell=False
        )
        
        running_processes.append({
            "unit": unit,
            "process": proc,
            "log_file": log_file,
            "log_path": log_file_path,
            "start_time": datetime.now(),
            "status": "RUNNING"
        })

    print("-" * 80)
    print(f"⚡ [SWARM ACTIVO] {len(running_processes)} vampiros operando en paralelo.")
    print("   Monitorizando ejecución de cada unidad...")
    print("-" * 80)

    # 2. Bucle de supervisión y recolección
    completed_results = []
    
    while running_processes:
        time.sleep(2)
        still_running = []
        
        for item in running_processes:
            proc = item["process"]
            retcode = proc.poll()
            
            if retcode is None:
                still_running.append(item)
            else:
                item["log_file"].close()
                elapsed = (datetime.now() - item["start_time"]).total_seconds()
                status = "COMPLETED" if retcode == 0 else "FAILED"
                icon = "✅" if retcode == 0 else "❌"
                
                print(f"{icon} [{status}] {item['unit']['id']} finalizó en {elapsed:.2f}s (Exit Code: {retcode})")
                
                # Leer últimas líneas del log para métricas
                last_lines = []
                try:
                    with open(item["log_path"], "r", encoding="utf-8", errors="replace") as f:
                        lines = [line.strip() for line in f if line.strip()]
                        last_lines = lines[-5:] if lines else []
                except Exception:
                    pass

                completed_results.append({
                    "id": item["unit"]["id"],
                    "name": item["unit"]["name"],
                    "script": item["unit"]["script"],
                    "output_target": item["unit"]["output_target"],
                    "status": status,
                    "exit_code": retcode,
                    "elapsed_seconds": round(elapsed, 2),
                    "log_file": str(item["log_path"]),
                    "snippet": last_lines
                })
                
        running_processes = still_running

    total_elapsed = (datetime.now() - start_time).total_seconds()

    # 3. Consolidación de Telemetría
    telemetry = {
        "timestamp": datetime.now().isoformat(),
        "total_units": len(VAMPIRE_UNITS),
        "executed_units": len(completed_results),
        "successful_units": len([r for r in completed_results if r["status"] == "COMPLETED"]),
        "failed_units": len([r for r in completed_results if r["status"] == "FAILED"]),
        "total_elapsed_seconds": round(total_elapsed, 2),
        "units": completed_results
    }

    with open(TELEMETRY_OUT, "w", encoding="utf-8") as f:
        json.dump(telemetry, f, indent=2, ensure_ascii=False)

    print("=" * 80)
    print(f"🏆 [ENJAMBRE CONCLUIDO] Tiempo total: {total_elapsed:.2f}s")
    print(f"   Exitosos: {telemetry['successful_units']} / {telemetry['executed_units']}")
    print(f"   Fallidos: {telemetry['failed_units']}")
    print(f"   Informe de telemetría guardado en: {TELEMETRY_OUT}")
    print("=" * 80)

if __name__ == "__main__":
    main()
