#!/usr/bin/env python3
"""
FIND RECYCLABLE ASSETS — EAR OS V2
Gobernanza Antigravity Omega v4.1 (Zero-Token Memory)
Minería forense de código reciclable en Bóveda y repositorios locales:
- Prisma / PostgreSQL / Supabase
- FACe / FacturaE / B2G XML
- Multi-Provider / Roster / Fincas
- Google Ads / GTag / Tracking Pixels
"""

import os
import re
import json
import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

VAULT_PATH = r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT"
ROOT_PROJECT = r"H:\EAR_OS_V2"

PATTERNS = {
    "PRISMA_POSTGRES": [r"datasource\s+db", r"generator\s+client", r"model\s+User", r"model\s+Booking", r"supabase", r"createTable"],
    "FACe_FACTURAE": [r"Facturae", r"xmlsignature", r"DIR3", r"PlataformaContratacion", r"telegram", r"licitacion", r"contrato\s+menor"],
    "MULTI_PROVIDER": [r"supplier", r"proveedor", r"fincasparaboda", r"commission", r"split", r"cuadrilla"],
    "ADS_CAMPAIGNS": [r"googleAds", r"gtag", r"pixel", r"conversion", r"campaign", r"fitur"]
}

results = {k: [] for k in PATTERNS.keys()}

print("🔍 Iniciando minería forense de código reciclable...")

for search_root in [VAULT_PATH, ROOT_PROJECT]:
    if not os.path.exists(search_root):
        print(f"⚠️ Ruta no encontrada: {search_root}")
        continue
    print(f"📁 Escaneando raíz: {search_root}")
    for root, dirs, files in os.walk(search_root):
        if any(skip in root for skip in ["node_modules", ".next", ".git", ".gemini", "dist", "build"]):
            continue
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.json', '.prisma', '.sql', '.py', '.md')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        for category, regex_list in PATTERNS.items():
                            matches = sum(1 for p in regex_list if re.search(p, content, re.IGNORECASE))
                            if matches >= 2:
                                results[category].append({
                                    "file": file,
                                    "path": file_path,
                                    "relevance_score": matches,
                                    "size_bytes": os.path.getsize(file_path)
                                })
                except Exception:
                    pass

# Ordenar por relevancia
for k in results:
    results[k] = sorted(results[k], key=lambda x: x["relevance_score"], reverse=True)[:50]

output_path = os.path.join(ROOT_PROJECT, "EAR_OS_V2", "scripts", "recyclable_assets_found.json")
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"\n✅ Minería completada.")
for k, v in results.items():
    print(f"   📊 {k:<20}: {len(v)} activos de alta relevancia localizados")
print(f"📄 Resultados guardados en: {output_path}")
