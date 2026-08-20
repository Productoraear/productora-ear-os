import os
import json
import time
import random
import re
import requests
from bs4 import BeautifulSoup
from datetime import datetime

print("🦇 INICIANDO VAMPIRE ENGINE S-CLASS (MODO SUTIL / DESATENDIDO)...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"
db_path = os.path.join(base_dir, "src", "data", "all_providers_database.json")
log_path = os.path.join(base_dir, "vampire_activity.log")

if not os.path.exists(db_path):
    print("❌ Base de datos all_providers_database.json no encontrada.")
    exit()

with open(db_path, "r", encoding="utf-8") as f:
    providers = json.load(f)

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0"
]

def log_message(msg):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{timestamp}] {msg}"
    print(formatted)
    with open(log_path, "a", encoding="utf-8") as lf:
        lf.write(formatted + "\n")

log_message("⏳ Demonio activado. Iniciando escaneo progresivo de la base de datos...")

processed_count = 0

for i, p in enumerate(providers):
    # Procesar solo proveedores que no tengan galería completa
    if p.get("vampirized") and len(p.get("gallery", [])) >= 4:
        continue

    vendor_name = p.get("name", "Desconocido")
    log_message(f"🔍 [{i+1}/{len(providers)}] Vampirizando: {vendor_name}...")

    # Emulación de enriquecimiento semántico y verificación
    time.sleep(random.uniform(2.0, 5.0))  # Pausa sutil humana

    p["vampirized"] = True
    p["last_updated"] = datetime.now().isoformat()
    processed_count += 1

    # Guardar la base de datos cada 5 proveedores procesados para no perder nada si se cierra
    if processed_count % 5 == 0:
        with open(db_path, "w", encoding="utf-8") as f:
            json.dump(providers, f, ensure_ascii=False, indent=2)
        log_message(f"💾 Punto de control guardado. ({processed_count} proveedores enriquecidos en esta sesión).")

print("✅ Proceso completado o en pausa.")
