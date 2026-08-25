#!/usr/bin/env python3
"""
🏛️ EAR OS OMEGA — MIT DEEP ASSET SCANNER & VAULT STAGING ENGINE
Fase MIT 1 & 2: Barrido por Firmas, Aislamiento en Staging y Generación de Manifiesto JSON.
"""

import os
import sys
import re
import json
import shutil
import hashlib
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

SEARCH_ROOTS = [
    BASE_DIR / "src" / "adn_vault",
    BASE_DIR / "src",
    BASE_DIR / "scripts",
    Path("H:/00_PRODUCTORA_EAR"),
    Path("H:/EAR_OS_BUNKER_CONSOLIDADO"),
    Path("H:/SANTUARIO_RESCATE_FINAL"),
    Path("H:/SANTUARIO_EAR"),
]

EXCLUDE_DIRS = {
    "node_modules", ".git", ".next", "dist", "build", 
    ".gemini", "venv", ".venv", "env", "adn_vault_staging"
}

ALLOWED_EXTS = {".tsx", ".ts", ".jsx", ".js", ".py", ".json", ".md"}

SIGNATURES = {
    "ia": [
        "ollama", "rag", "embedding", "vector", "astra", "neural", 
        "oracle", "llm", "infer", "gemini", "langchain", "prompt", "cognitive"
    ],
    "b2g": [
        "lcsp", "art. 118", "art 118", "contrato menor", "pliego", 
        "licitacion", "rolece", "facturae", "dir3", "memoria justificativa", "ayuntamiento", "ods 2030"
    ],
    "finanzas": [
        "price-lock", "price lock", "split 80/10/10", "80/10/10", "stripe", 
        "checkout", "budget", "pricer", "cotizador", "simulator", "ledger", "roi", "pricing"
    ],
    "ui": [
        "glassmorphism", "visualizer", "equalizer", "three", "canvas", 
        "radar", "framer-motion", "3d", "bento", "bespoke", "luxury", "theme"
    ],
    "vimume": [
        "40hz", "neuro", "alzheimer", "reminiscencia", "gamma", 
        "terapia", "silver economy", "musica evocativa", "picower"
    ],
    "core": [
        "webhook", "scraper", "crawler", "telemetry", "parser", 
        "tripwire", "sanitizer", "router", "auth", "token"
    ]
}

def get_file_hash(filepath: Path) -> str:
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        hasher.update(f.read())
    return hasher.hexdigest()

def extract_exports(content: str) -> list:
    exports = []
    # Match export function/const/class/interface/type
    matches = re.findall(r'export\s+(?:default\s+)?(?:async\s+)?(?:function|const|class|interface|type)\s+([A-Za-z0-9_]+)', content)
    for m in matches:
        if m not in exports:
            exports.append(m)
    return exports

def extract_description(content: str) -> str:
    # Look for top docstring or comments
    doc_match = re.search(r'/\*\*([\s\S]*?)\*/', content)
    if doc_match:
        lines = [line.strip().lstrip('*').strip() for line in doc_match.group(1).split('\n') if line.strip().lstrip('*').strip()]
        return " ".join(lines[:3])
    # Fallback to first line comments
    lines = [line.strip().lstrip('//').lstrip('#').strip() for line in content.split('\n')[:8] if line.strip().startswith(('//', '#'))]
    return " ".join(lines) if lines else "Módulo reutilizable de EAR OS."

def classify_file(content: str, filename: str) -> tuple:
    lower_content = content.lower()
    lower_name = filename.lower()
    
    scores = {cat: 0 for cat in SIGNATURES}
    for cat, keywords in SIGNATURES.items():
        for kw in keywords:
            if kw in lower_name:
                scores[cat] += 4
            matches = lower_content.count(kw)
            if matches > 0:
                scores[cat] += min(matches, 3)
    
    best_cat = max(scores, key=scores.get)
    if scores[best_cat] > 0:
        return best_cat, scores[best_cat]
    return "core", 1

def main():
    print("=" * 70)
    print("🏛️ EAR OS OMEGA — PROTOCOLO DE MINERÍA DE ASSETS (FASES MIT 1 & 2)")
    print("=" * 70)
    
    # Initialize Staging Directories
    for cat in SIGNATURES.keys():
        (STAGING_DIR / cat).mkdir(parents=True, exist_ok=True)
    
    manifest = {
        "metadata": {
            "version": "3.0.0-OMEGA",
            "framework": "Next.js 15 / TypeScript Strict",
            "total_assets": 0,
            "categories_summary": {},
            "generated_at": None
        },
        "assets": []
    }

    seen_hashes = set()
    total_scanned = 0

    for root_dir in SEARCH_ROOTS:
        if not root_dir.exists():
            continue
        print(f"🔍 Explorando repositorio: {root_dir}")

        for root, dirs, files in os.walk(root_dir):
            # Prune excluded directories
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]

            for file in files:
                filepath = Path(root) / file
                if filepath.suffix.lower() not in ALLOWED_EXTS:
                    continue

                total_scanned += 1
                try:
                    file_size = filepath.stat().st_size
                    if file_size == 0 or file_size > 10 * 1024 * 1024:  # skip empty or >10MB
                        continue

                    content = filepath.read_text(encoding="utf-8", errors="ignore")
                    if len(content.strip()) < 50:
                        continue

                    file_hash = get_file_hash(filepath)
                    if file_hash in seen_hashes:
                        continue
                    seen_hashes.add(file_hash)

                    category, score = classify_file(content, file)
                    exports = extract_exports(content)
                    desc = extract_description(content)

                    # Dest path in staging
                    staged_name = f"{filepath.stem}_{file_hash[:6]}{filepath.suffix}"
                    staged_path = STAGING_DIR / category / staged_name
                    
                    # Copy to staging vault
                    try:
                        shutil.copy2(filepath, staged_path)
                    except Exception:
                        pass

                    # Extract snippet
                    snippet_lines = content.split('\n')[:15]
                    snippet = "\n".join(snippet_lines)

                    asset_entry = {
                        "id": f"AST-{len(manifest['assets']) + 1:04d}",
                        "name": filepath.name,
                        "category": category,
                        "relevance_score": score,
                        "original_path": str(filepath.resolve()),
                        "staged_path": str(staged_path.resolve()),
                        "sha256": file_hash,
                        "size_bytes": file_size,
                        "line_count": len(content.split('\n')),
                        "exports": exports,
                        "description": desc,
                        "snippet": snippet
                    }

                    manifest["assets"].append(asset_entry)
                    manifest["metadata"]["categories_summary"][category] = (
                        manifest["metadata"]["categories_summary"].get(category, 0) + 1
                    )

                except Exception as e:
                    # Skip unreadable
                    pass

    import datetime
    manifest["metadata"]["total_assets"] = len(manifest["assets"])
    manifest["metadata"]["generated_at"] = datetime.datetime.now().isoformat()

    # Save manifest in staging & scripts
    manifest_path = STAGING_DIR / "manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    scripts_manifest = BASE_DIR / "scripts" / "vault_manifest.json"
    with open(scripts_manifest, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 70)
    print("✅ PROCESAMIENTO COMPLETADO EXITOSAMENTE")
    print(f"📊 Total archivos escaneados: {total_scanned}")
    print(f"💎 Assets únicos catalogados en Vault: {manifest['metadata']['total_assets']}")
    print("📦 Desglose por firmas tecnológicas:")
    for cat, count in manifest["metadata"]["categories_summary"].items():
        print(f"   • [{cat.upper()}]: {count} assets")
    print(f"📁 Manifiesto guardado en: {manifest_path}")
    print("=" * 70)

if __name__ == "__main__":
    main()
