#!/usr/bin/env python3
"""
EAR OS GOLD - DISPATCHER DE ENVIOS CONTROLADOS B2B (CALENTAMIENTO DE DOMINIO)
Superpowers Pattern: Queue, Rate-Limiter y Log de Envios
"""

import json
import time
import random
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BATCH_PATH = os.path.join(BASE_DIR, 'src', 'data', 'outbound', 'microbatch_100_madrid_toledo.json')
LOG_PATH = os.path.join(BASE_DIR, 'src', 'data', 'outbound', 'dispatch_execution_log.json')

def run_dispatcher(simulation_mode=True):
    if not os.path.exists(BATCH_PATH):
        print(f"[-] Error: Archivo de micro-lote no encontrado: {BATCH_PATH}")
        return

    with open(BATCH_PATH, 'r', encoding='utf-8') as f:
        batch = json.load(f)

    print(f"[*] DESPACHADOR AGENTICO INICIADO -- {len(batch)} contactos en cola.")
    print("[*] MODO CALENTAMIENTO ACTIVO: Retraso aleatorio de 45 a 90 segundos por envio.\n")

    dispatch_log = []
    sent_count = 0

    for item in batch:
        sent_count += 1
        vendor_name = item["name"]
        claim_url = item["claim_url"]
        phone = item["phone"]

        print(f"[{sent_count}/{len(batch)}] PROCESANDO: {vendor_name}")
        print(f"    |-- WhatsApp Target: {phone}")
        print(f"    |-- Claim URL: {claim_url}")
        print(f"    +-- Estado: SIMULATED_DISPATCH_OK")

        dispatch_log.append({
            'timestamp': time.time(),
            'index': sent_count,
            'vendor_name': vendor_name,
            'phone': phone,
            'claim_url': claim_url,
            'status': 'DISPATCHED_SIMULATED'
        })

        if simulation_mode:
            time.sleep(0.02)
        else:
            sleep_time = random.randint(45, 90)
            print(f"    [..] Esperando {sleep_time} segundos para el siguiente envio...\n")
            time.sleep(sleep_time)

    with open(LOG_PATH, 'w', encoding='utf-8') as f:
        json.dump(dispatch_log, f, ensure_ascii=False, indent=2)

    print("\n[+] DESPACHO DE MICRO-LOTE 01 FINALIZADO CON EXITO.")
    print(f"[+] Registro de auditoria guardado en: {LOG_PATH}")

if __name__ == '__main__':
    is_real = '--real' in sys.argv
    run_dispatcher(simulation_mode=not is_real)
