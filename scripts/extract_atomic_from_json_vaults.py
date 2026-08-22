# -*- coding: utf-8 -*-
import os
import json
import re

print("🚀 INICIANDO EXTRACCIÓN ATÓMICA DESDE LAS 70 BODEGAS JSON DE ORIGEN...")

db_path = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\all_providers_database.json"
search_root = r"H:\EAR_OS_V2"

if not os.path.exists(db_path):
    print(f"❌ Base de datos central no encontrada en: {db_path}")
    exit(1)

with open(db_path, "r", encoding="utf-8") as f:
    providers = json.load(f)

def clean_key(val):
    if not val: return ""
    return re.sub(r'\W+', '', str(val)).lower()

providers_map = {}
for p in providers:
    k = clean_key(p.get("name"))
    if k:
        providers_map[k] = p

# Buscar los 70 JSONs de origen excluyendo dependencias
source_files = []
for root, dirs, files in os.walk(search_root):
    dirs[:] = [d for d in dirs if d.lower() not in {"node_modules", ".git", ".next", "dist", "build"}]
    for file in files:
        fl = file.lower()
        if (("vendor" in fl or "imported" in fl or "harvested" in fl or "eve_bodas" in fl) 
            and fl.endswith(".json") 
            and fl != "all_providers_database.json"):
            source_files.append(os.path.join(root, file))

print(f"📂 Bodegas JSON de origen identificadas: {len(source_files)}")

total_atomic_attributes = 0
STANDARD_KEYS = {"img", "gallery", "photos", "name", "nombre", "id", "atomic_specs"}

for path in source_files:
    try:
        with open(path, "r", encoding="utf-8") as sf:
            raw = json.load(sf)
            if isinstance(raw, dict): raw = [raw]
            if not isinstance(raw, list): continue

            for item in raw:
                if not isinstance(item, dict): continue
                k = clean_key(item.get("name") or item.get("nombre"))
                if k in providers_map:
                    p = providers_map[k]
                    if "atomic_specs" not in p:
                        p["atomic_specs"] = {}
                    
                    added = 0
                    for key, val in item.items():
                        if key.lower() not in STANDARD_KEYS and val is not None and val != "":
                            p["atomic_specs"][key] = val
                            added += 1
                    
                    total_atomic_attributes += added
    except Exception:
        pass

# Recuento de validación final
with_specs = sum(1 for p in providers if p.get("atomic_specs") and len(p["atomic_specs"]) > 0)

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(providers, f, ensure_ascii=False, indent=2)

print("==================================================")
print("✅ INGESTIÓN ATÓMICA DE BODEGAS CONCLUIDA")
print("==================================================")
print(f" ├─ Proveedores Enriquecidos con Atributos: {with_specs} / {len(providers)}")
print(f" ├─ Total Atributos Atómicos Inyectados: {total_atomic_attributes}")
print(f" └─ Base de Datos Guardada: {db_path}")
print("==================================================")
