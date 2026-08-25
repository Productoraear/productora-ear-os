#!/usr/bin/env python3
"""
🏛️ EAR OS OMEGA — COMPACT MANIFEST GENERATOR
Genera un índice ultraligero y de alta velocidad (<5MB) de los 25.000+ assets en src/adn_vault_staging/.
"""

import os
import sys
import json
import re
import datetime
from pathlib import Path

# Force UTF-8 on Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = Path("H:/EAR_OS_V2/EAR_OS_V2")
STAGING_DIR = BASE_DIR / "src" / "adn_vault_staging"

def extract_exports(content: str) -> list:
    exports = []
    matches = re.findall(r'export\s+(?:default\s+)?(?:async\s+)?(?:function|const|class|interface|type)\s+([A-Za-z0-9_]+)', content)
    for m in matches:
        if m not in exports:
            exports.append(m)
    return exports[:8]  # Limit to top 8 exports to keep index lean

def extract_description(content: str) -> str:
    doc_match = re.search(r'/\*\*([\s\S]*?)\*/', content)
    if doc_match:
        lines = [line.strip().lstrip('*').strip() for line in doc_match.group(1).split('\n') if line.strip().lstrip('*').strip()]
        return " ".join(lines[:2])
    lines = [line.strip().lstrip('//').lstrip('#').strip() for line in content.split('\n')[:6] if line.strip().startswith(('//', '#'))]
    return " ".join(lines[:2]) if lines else "Módulo reutilizable S-Class de Productora EAR."

def main():
    manifest = {
        "metadata": {
            "version": "3.0.0-OMEGA",
            "framework": "Next.js 15 / TypeScript Strict",
            "total_assets": 0,
            "categories_summary": {},
            "generated_at": datetime.datetime.now().isoformat()
        },
        "assets": []
    }

    asset_count = 0
    categories = ["ia", "b2g", "finanzas", "ui", "vimume", "core"]

    for cat in categories:
        cat_dir = STAGING_DIR / cat
        if not cat_dir.exists():
            continue

        cat_files = list(cat_dir.glob("*.*"))
        for f in cat_files:
            if f.name == "manifest.json":
                continue
            
            try:
                # Read only top 4KB for exports and description (ultra-fast)
                with open(f, "r", encoding="utf-8", errors="ignore") as fp:
                    header_content = fp.read(4096)

                exports = extract_exports(header_content)
                desc = extract_description(header_content)
                
                asset_count += 1
                entry = {
                    "id": f"AST-{asset_count:05d}",
                    "name": f.name,
                    "cat": cat,
                    "path": str(f.resolve()),
                    "size": f.stat().st_size,
                    "exp": exports,
                    "desc": desc[:180]
                }
                
                manifest["assets"].append(entry)
                manifest["metadata"]["categories_summary"][cat] = (
                    manifest["metadata"]["categories_summary"].get(cat, 0) + 1
                )
            except Exception:
                pass

    manifest["metadata"]["total_assets"] = len(manifest["assets"])

    # Guardar en staging y en scripts
    manifest_path = STAGING_DIR / "manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, separators=(',', ':'))

    scripts_manifest = BASE_DIR / "scripts" / "vault_manifest.json"
    with open(scripts_manifest, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, separators=(',', ':'))

    print("\n" + "=" * 70)
    print("✅ ÍNDICE DE ALTA VELOCIDAD GENERADO EXITOSAMENTE")
    print(f"💎 Total assets catalogados: {manifest['metadata']['total_assets']}")
    for c, cnt in manifest["metadata"]["categories_summary"].items():
        print(f"   • [{c.upper()}]: {cnt} assets")
    print(f"📁 Tamaño del índice: {manifest_path.stat().st_size / (1024 * 1024):.2f} MB")
    print("=" * 70)

if __name__ == "__main__":
    main()
