#!/usr/bin/env python3
"""
🏛️ EAR OS OMEGA — "SEARCH-BEFORE-BUILD" CLI ENGINE
Fase MIT 3: Búsqueda Semántica y Reutilización Obligatoria de Assets Locales en <2s.

Uso:
  python scripts/search_vault.py -q "price lock"
  python scripts/search_vault.py -q "lcsp" -c b2g
  python scripts/search_vault.py --list-categories
  python scripts/search_vault.py --show AST-00042
"""

import os
import sys
import json
import argparse
import time
from pathlib import Path

# Force UTF-8 on Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = Path("H:/EAR_OS_V2/EAR_OS_V2")
MANIFEST_PATHS = [
    BASE_DIR / "src" / "adn_vault_staging" / "manifest.json",
    BASE_DIR / "scripts" / "vault_manifest.json"
]

# ANSI Colors
GOLD = "\033[93m"
GREEN = "\033[92m"
CYAN = "\033[96m"
WHITE = "\033[97m"
GRAY = "\033[90m"
BOLD = "\033[1m"
RESET = "\033[0m"

def load_manifest():
    for p in MANIFEST_PATHS:
        if p.exists():
            try:
                with open(p, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
    return None

def score_asset(asset: dict, query_terms: list, category_filter: str = None) -> int:
    cat = asset.get("cat", "").lower()
    if category_filter and cat != category_filter.lower():
        return 0

    score = 0
    name = asset.get("name", "").lower()
    desc = asset.get("desc", "").lower()
    exports = " ".join(asset.get("exp", [])).lower()

    for term in query_terms:
        term = term.lower()
        if term in name:
            score += 20
        if term in exports:
            score += 15
        if term in desc:
            score += 8
        if term in cat:
            score += 5

    return score

def search(query: str, category: str = None, limit: int = 8):
    start_time = time.time()
    manifest = load_manifest()
    if not manifest:
        print(f"{GOLD}⚠️ No se encontró el manifiesto de assets.{RESET}")
        print(f"Ejecuta primero: {CYAN}python scripts/fast_index_manifest.py{RESET}")
        return

    query_terms = [t for t in query.split() if len(t) > 1] if query else []
    
    scored_results = []
    for asset in manifest.get("assets", []):
        if not query_terms and category:
            if asset.get("cat", "").lower() == category.lower():
                scored_results.append((10, asset))
        elif query_terms:
            s = score_asset(asset, query_terms, category)
            if s > 0:
                scored_results.append((s, asset))

    scored_results.sort(key=lambda x: x[0], reverse=True)
    top_results = scored_results[:limit]
    duration_ms = (time.time() - start_time) * 1000

    print("\n" + "=" * 75)
    print(f"{GOLD}{BOLD}🏛️ EAR OS OMEGA — PROTOCOLO SEARCH-BEFORE-BUILD{RESET}")
    print(f"{GRAY}Búsqueda: '{WHITE}{query or '*'}{GRAY}' | Categoría: '{WHITE}{category or 'TODAS'}{GRAY}' | Coincidencias: {GREEN}{len(scored_results)}{GRAY} ({duration_ms:.1f}ms){RESET}")
    print("=" * 75)

    if not top_results:
        print(f"\n{GRAY}No se encontraron assets que coincidan con la búsqueda.{RESET}")
        print(f"{CYAN}Sugerencia: Intenta con términos generales como 'pricer', 'dossier', 'b2g', 'visualizer', 'rag'.{RESET}\n")
        return

    for idx, (score, asset) in enumerate(top_results, 1):
        cat_badge = f"{GOLD}[{asset['cat'].upper()}]{RESET}"
        name = f"{WHITE}{BOLD}{asset['name']}{RESET}"
        asset_id = f"{CYAN}{asset['id']}{RESET}"
        
        print(f"\n{GREEN}{idx:02d}.{RESET} {asset_id} {cat_badge} {name} {GRAY}(Score: {score}){RESET}")
        print(f"    {GRAY}📁 Ruta:{RESET} {asset['path']}")
        
        if asset.get("exp"):
            exp_str = ", ".join(asset["exp"][:6])
            if len(asset["exp"]) > 6:
                exp_str += f" (+{len(asset['exp']) - 6} más)"
            print(f"    {CYAN}⚡ Exports:{RESET} {exp_str}")

        if asset.get("desc"):
            print(f"    {GRAY}📝 Resumen:{RESET} {asset['desc']}")

    print("\n" + "=" * 75)
    print(f"{GOLD}💡 REGLA DE ORO:{RESET} Antes de programar nuevo código, reutiliza el asset con {CYAN}python scripts/search_vault.py --show <ID>{RESET}.")
    print("=" * 75 + "\n")

def show_asset(asset_id: str):
    manifest = load_manifest()
    if not manifest:
        print(f"{GOLD}⚠️ No se encontró el manifiesto de assets.{RESET}")
        return

    target = None
    for a in manifest.get("assets", []):
        if a.get("id", "").lower() == asset_id.lower() or a.get("name", "").lower() == asset_id.lower():
            target = a
            break

    if not target:
        print(f"❌ Asset no encontrado con identificador '{asset_id}'.")
        return

    print("\n" + "=" * 75)
    print(f"{GOLD}{BOLD}📦 DETALLE DE ASSET: {target['name']} ({target['id']}){RESET}")
    print(f"{GRAY}Categoría: {WHITE}{target['cat'].upper()}{GRAY} | Tamaño: {WHITE}{target['size']} bytes{RESET}")
    print(f"{GRAY}Ruta Staging:{RESET} {target['path']}")
    print("=" * 75)
    
    if target.get("exp"):
        print(f"\n{CYAN}{BOLD}⚡ SÍMBOLOS EXPORTADOS:{RESET}")
        for exp in target["exp"]:
            print(f"   • {GREEN}{exp}{RESET}")

    # Read live snippet directly from file
    snippet = "// Archivo no disponible para lectura"
    try:
        p = Path(target["path"])
        if p.exists():
            with open(p, "r", encoding="utf-8", errors="ignore") as fp:
                lines = [fp.readline() for _ in range(25)]
                snippet = "".join(lines).strip()
    except Exception as e:
        snippet = f"// Error leyendo archivo: {e}"

    print(f"\n{GOLD}{BOLD}📄 VISTA PREVIA DEL CÓDIGO (Primeras 25 líneas):{RESET}")
    print("-" * 75)
    print(snippet)
    print("-" * 75 + "\n")

def list_categories():
    manifest = load_manifest()
    if not manifest:
        print(f"{GOLD}⚠️ No se encontró el manifiesto.{RESET}")
        return

    print("\n" + "=" * 75)
    print(f"{GOLD}{BOLD}📦 CATEGORÍAS EN VAULT STAGING{RESET}")
    print("=" * 75)
    for cat, count in manifest["metadata"]["categories_summary"].items():
        print(f"  • {CYAN}{cat.upper():12s}{RESET} -> {GREEN}{count:5d}{RESET} assets reutilizables")
    print(f"\nTotal: {WHITE}{manifest['metadata']['total_assets']}{RESET} assets catalogados.\n")

def main():
    parser = argparse.ArgumentParser(description="EAR OS — Search-Before-Build CLI")
    parser.add_argument("-q", "--query", type=str, default="", help="Término de búsqueda")
    parser.add_argument("-c", "--category", type=str, default=None, help="Filtrar por categoría (ia, b2g, finanzas, ui, vimume, core)")
    parser.add_argument("-l", "--limit", type=int, default=8, help="Límite de resultados")
    parser.add_argument("-s", "--show", type=str, default=None, help="Mostrar detalle de un asset por ID (ej. AST-00042)")
    parser.add_argument("--list-categories", action="store_true", help="Listar resumen de categorías")

    args = parser.parse_args()

    if args.list_categories:
        list_categories()
    elif args.show:
        show_asset(args.show)
    else:
        search(args.query, args.category, args.limit)

if __name__ == "__main__":
    main()
