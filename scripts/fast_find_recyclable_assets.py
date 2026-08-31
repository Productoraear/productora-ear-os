#!/usr/bin/env python3
"""
FAST FIND RECYCLABLE ASSETS — EAR OS V2
Gobernanza Antigravity Omega v4.1 (Zero-Token Memory)
Escaneo forense optimizado y ultrarrápido de Bóveda y workspace.
"""

import os
import re
import json
import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

VAULT_PATH = r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT"
WORKSPACE_PATH = r"H:\EAR_OS_V2\EAR_OS_V2"

PATTERNS = {
    "PRISMA_POSTGRES": [r"datasource\s+db", r"generator\s+client", r"model\s+User", r"model\s+Booking", r"supabase", r"createTable", r"fincasparaboda"],
    "FACe_FACTURAE": [r"Facturae", r"xmlsignature", r"DIR3", r"PlataformaContratacion", r"telegram", r"licitacion", r"contrato\s+menor"],
    "MULTI_PROVIDER": [r"supplier", r"proveedor", r"fincasparaboda", r"commission", r"split", r"cuadrilla", r"roster"],
    "ADS_CAMPAIGNS": [r"googleAds", r"gtag", r"pixel", r"conversion", r"campaign", r"fitur", r"adwords"]
}

results = {k: [] for k in PATTERNS.keys()}

print("🔍 Iniciando escaneo forense de alta velocidad...")

search_roots = [WORKSPACE_PATH, VAULT_PATH]

for s_root in search_roots:
    if not os.path.exists(s_root):
        continue
    print(f"📁 Escaneando: {s_root}")
    for root, dirs, files in os.walk(s_root):
        # Excluir carpetas irrelevantes
        dirs[:] = [d for d in dirs if d not in ["node_modules", ".next", ".git", ".gemini", "dist", "build", ".venv", "cache"]]
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ['.ts', '.tsx', '.js', '.jsx', '.json', '.prisma', '.sql', '.py', '.md', '.xml']:
                file_path = os.path.join(root, file)
                try:
                    # Leer solo los primeros 150 KB para máxima velocidad
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read(150000)
                    
                    for category, regex_list in PATTERNS.items():
                        matches = sum(1 for p in regex_list if re.search(p, content, re.IGNORECASE))
                        if matches >= 2:
                            results[category].append({
                                "file": file,
                                "path": file_path,
                                "relevance_score": matches,
                                "category": category
                            })
                except Exception:
                    pass

for k in results:
    results[k] = sorted(results[k], key=lambda x: x["relevance_score"], reverse=True)[:30]

out_file = os.path.join(WORKSPACE_PATH, "scripts", "recyclable_assets_found.json")
os.makedirs(os.path.dirname(out_file), exist_ok=True)
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\n" + "=" * 60)
print("📊 RESUMEN DE ACTIVOS FORENSES LOCALIZADOS:")
print("=" * 60)
for k, v in results.items():
    print(f"  🔹 {k:<20}: {len(v)} archivos reciclables")
print(f"\n📄 Archivo generado: {out_file}")
