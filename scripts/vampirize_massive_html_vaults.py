#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
═══════════════════════════════════════════════════════════════════════════════
 TAREA_01 — vampirize_massive_html_vaults.py
 ANTIGRAVITY System Orchestrator × Productora EAR OS
 Protocolo: BARE-METAL QWEN WORKER · Zero-Token Memory (ZTM)
═══════════════════════════════════════════════════════════════════════════════

 OBJETIVO:
   Barrer TODOS los discos H:\ e I:\ buscando archivos HTML de proveedores.
   Extraer 100% del contenido purgando orígen, marcas de agua y URLs propias.
   Consolidar en bodas-vendors-harvested.json sin duplicidades (dedup SHA-256).
   Generar informe de sesión en scripts/reports/vampire_massive_report.json.

 DEPENDENCIAS:
   pip install beautifulsoup4 lxml tqdm

 USO:
   python scripts/vampirize_massive_html_vaults.py
   python scripts/vampirize_massive_html_vaults.py --dry-run    # solo cuenta archivos
   python scripts/vampirize_massive_html_vaults.py --max 5000   # limita archivos
   python scripts/vampirize_massive_html_vaults.py --drive I    # solo disco I:\

═══════════════════════════════════════════════════════════════════════════════
 VETO INMUTABLE (AGENTS.md §6):
   - NO eval()                           - NO hardcoded secrets
   - NO tocar Split Soberano 80/10/10    - NO romper firmas HMAC SHA-256
   - NO inventar credenciales académicas para Edwin Agudelo
═══════════════════════════════════════════════════════════════════════════════
"""

import sys
import os
import re
import json
import glob
import hashlib
import argparse
import time
from pathlib import Path
from collections import defaultdict
from datetime import datetime

# ─── ENCODING UTF-8 FORCED ──────────────────────────────────────────────────
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# ─── ARGUMENT PARSER ────────────────────────────────────────────────────────
parser = argparse.ArgumentParser(description="EAR OS Massive HTML Vampirizer")
parser.add_argument("--dry-run", action="store_true", help="Solo cuenta archivos sin procesar")
parser.add_argument("--max", type=int, default=0, help="Limite maximo de archivos (0=sin limite)")
parser.add_argument("--drive", type=str, default="", help="Solo procesar disco específico (H, I, D...)")
parser.add_argument("--min-name-len", type=int, default=3, help="Longitud minima del nombre del proveedor")
args = parser.parse_args()

# ─── PATHS ──────────────────────────────────────────────────────────────────
BASE_DIR     = Path(r"H:\EAR_OS_V2\EAR_OS_V2")
DATA_DIR     = BASE_DIR / "src" / "data"
REPORTS_DIR  = BASE_DIR / "scripts" / "reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_PATH  = DATA_DIR / "bodas-vendors-harvested.json"
REPORT_PATH  = REPORTS_DIR / "vampire_massive_report.json"
HASH_CACHE   = BASE_DIR / "scripts" / ".processed_hashes.json"

# ─── SCAN ROOTS — H:\ e I:\ completos más rutas específicas de alto rendimiento
SCAN_ROOTS = [
    # H:\ — Rutas de alta densidad de proveedores
    r"H:\ARCHIVO_FRIO_ESTRUCTURAL",
    r"H:\EAR_OS_V2",
    r"H:\00_PRODUCTORA_EAR",
    r"H:\INCUBADORA_EAR",
    r"H:\BUNKER_EAR",
    # I:\ — Disco de datos secundario
    r"I:\\",
    # D:\ — Eventos/Bodas
    r"D:\01_VERTICAL_EVENTOS",
]

# Filtrar por drive si se especifica
if args.drive:
    drive_letter = args.drive.upper() + ":\\"
    SCAN_ROOTS = [r for r in SCAN_ROOTS if r.upper().startswith(drive_letter)]

# ─── DIRECTORIOS EXCLUIDOS (nunca entrar) ───────────────────────────────────
SKIP_DIRS = {
    ".git", ".next", "node_modules", "__pycache__", ".firebase",
    ".vercel", "dist", "build", ".cache", "coverage", "vendor",
    "$RECYCLE.BIN", "System Volume Information", "Windows", "Program Files",
    "ProgramData", "AppData"
}

# ─── DOMINIOS PROPIETARIOS A PURGAR ─────────────────────────────────────────
PURGE_DOMAINS = [
    "bodas.net", "zankyou.es", "bodaestilo.es", "hiperboda.com",
    "casamientos.com", "matrimonio.com", "wedding.com",
    "zola.com", "theknot.com", "wedshoots.com"
]

# ─── WATERMARK / LOGO SIGNATURES ────────────────────────────────────────────
WATERMARK_TOKENS = [
    "logo", "badge", "icon", "square-icon", "wedshoots", "premio",
    "seal", "watermark", "illustration", "plane_destination", "stars.svg",
    "favicon", "sprite", "pixel.gif", "tracking", "analytics"
]

# ─── SKIP FILENAME PATTERNS ─────────────────────────────────────────────────
SKIP_NAME_PATTERNS = re.compile(
    r"(404|500|503|index|admin|terminos|privacidad|cookies|legal|login|"
    r"registro|about|contact|sitemap|robots|jquery|bootstrap|polyfill)",
    re.I
)

# ─── COMPETITOR BRANDING SCRUB ───────────────────────────────────────────────
BRAND_REPLACEMENTS = [
    (re.compile(r'\s*[-|]\s*Bodas\.net.*', re.I), ""),
    (re.compile(r'\bbodas\.net\b', re.I), "Productora EAR"),
    (re.compile(r'\bbodas\s+net\b', re.I), "Productora EAR"),
    (re.compile(r'\bzankyou\b', re.I), "Productora EAR"),
    (re.compile(r'\bwedding\s*wire\b', re.I), "Productora EAR"),
]

ENCODING_FIXES = {
    "Ã¡": "á", "Ã©": "é", "Ã­": "í", "Ã³": "ó", "Ãº": "ú",
    "Ã±": "ñ", "Ã'": "Ñ", "Ã€": "À", "Ã‰": "É", "Ã": "Í",
    "Ã“": "Ó", "Ãš": "Ú", "â‚¬": "€", "Â": "", "\ufffd": " "
}

# ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

def norm_key(s: str) -> str:
    """Normalización de clave para deduplicación."""
    return re.sub(r"[^a-z0-9]", "", str(s).lower())[:60]


def clean_text(t: str) -> str:
    """Limpia encoding, marcas de competidores y whitespace."""
    if not t:
        return ""
    for bad, good in ENCODING_FIXES.items():
        t = t.replace(bad, good)
    for pattern, replacement in BRAND_REPLACEMENTS:
        t = pattern.sub(replacement, t)
    return " ".join(t.split()).strip()


def is_watermark(url: str) -> bool:
    """True si la URL corresponde a logo, watermark o badge."""
    u = url.lower()
    return any(tok in u for tok in WATERMARK_TOKENS)


def is_competitor_url(url: str) -> bool:
    """True si la URL apunta a un dominio de la competencia."""
    return any(dom in url.lower() for dom in PURGE_DOMAINS)


def sha256_key(text: str) -> str:
    """SHA-256 de un string para dedup y vaulting."""
    return hashlib.sha256(text.encode("utf-8", errors="ignore")).hexdigest()[:16]


def extract_phones(content: str) -> list:
    """Extrae todos los teléfonos del HTML."""
    phones = []
    # tel: href
    for m in re.finditer(r'href=[\'"]tel:([^\'"]+)[\'"]', content, re.I):
        raw = re.sub(r"[\s\-\.\(\)]", "", m.group(1))
        if 9 <= len(raw) <= 15 and raw not in phones:
            phones.append(raw)
    # Plaintext Spanish phone patterns
    for m in re.finditer(r"\b((?:\+34)?[ -]?[6789]\d{2}[ -]?\d{3}[ -]?\d{3})\b", content):
        raw = re.sub(r"[\s\-]", "", m.group(1))
        if raw not in phones:
            phones.append(raw)
    return phones[:5]


def extract_jsonld(content: str) -> list:
    """Extrae todos los bloques JSON-LD del HTML."""
    results = []
    for m in re.finditer(
        r"<script[^>]*type=['\"]application/ld\+json['\"][^>]*>(.*?)</script>",
        content, re.DOTALL | re.I
    ):
        try:
            raw = m.group(1).strip()
            obj = json.loads(raw)
            nodes = obj if isinstance(obj, list) else obj.get("@graph", [obj]) if isinstance(obj, dict) else []
            results.extend([n for n in nodes if isinstance(n, dict)])
        except Exception:
            pass
    return results


def extract_og_tags(content: str) -> dict:
    """Extrae Open Graph meta tags."""
    og = {}
    for m in re.finditer(r'<meta[^>]+property=[\'"]og:(\w+)[\'"][^>]+content=[\'"]([^\'"]+)[\'"]', content, re.I):
        og[m.group(1)] = clean_text(m.group(2))
    for m in re.finditer(r'<meta[^>]+content=[\'"]([^\'"]+)[\'"][^>]+property=[\'"]og:(\w+)[\'"]', content, re.I):
        og[m.group(2)] = clean_text(m.group(1))
    return og


def extract_h1(content: str) -> str:
    """Extrae el primer H1 del HTML."""
    m = re.search(r"<h1[^>]*>(.*?)</h1>", content, re.DOTALL | re.I)
    if m:
        return clean_text(re.sub(r"<[^>]+>", "", m.group(1)))
    return ""


def extract_description(content: str) -> str:
    """Extrae meta description o primer párrafo largo."""
    # Meta description
    m = re.search(r'<meta[^>]+name=[\'"]description[\'"][^>]+content=[\'"]([^\'"]{20,})[\'"]', content, re.I)
    if m:
        return clean_text(m.group(1))
    # First paragraph
    m = re.search(r"<p[^>]*>(.{60,500}?)</p>", content, re.DOTALL | re.I)
    if m:
        return clean_text(re.sub(r"<[^>]+>", "", m.group(1)))
    return ""


def extract_images(content: str) -> list:
    """Extrae todas las imágenes relevantes del HTML."""
    imgs = []
    seen = set()
    for m in re.finditer(
        r'<img[^>]+(?:src|data-src|data-original|data-lazy-src)=[\'"]([^\'"]+)[\'"]',
        content, re.I
    ):
        src = m.group(1).strip()
        if (
            src and len(src) > 10
            and not is_watermark(src)
            and not is_competitor_url(src)
            and src not in seen
            and not src.startswith("data:")
        ):
            seen.add(src)
            imgs.append(src)
    return imgs[:20]


def extract_prices(content: str) -> list:
    """Extrae precios en formato español."""
    prices = []
    for m in re.finditer(
        r"(\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+(?:\.\d{2})?)\s*€",
        content
    ):
        try:
            raw = m.group(1).replace(".", "").replace(",", ".")
            val = float(raw)
            if 50 <= val <= 50000:
                prices.append(val)
        except Exception:
            pass
    return sorted(set(prices))[:5]


def extract_category(content: str, og: dict) -> str:
    """Infiere categoría del proveedor."""
    text_lower = content.lower()
    CAT_MAP = [
        ("musica en vivo|banda|orquesta|grupo musical|solista",  "Música en Vivo"),
        ("catering|banquete|gastronomia|chef|cocinero",          "Catering"),
        ("fotograf",                                              "Fotografía"),
        ("video|videograph|cinemat",                             "Videografía"),
        ("flor|florist|decoraci",                                "Floristería y Decoración"),
        ("dj |disc.jockey|pincha",                               "DJ"),
        ("finca|hacienda|salon|celebracion|espacio",             "Finca/Espacio"),
        ("vestido|traje|modist|novia|novio",                     "Moda Nupcial"),
        ("belleza|maquilla|peluquer|estilista",                  "Belleza"),
        ("viaje|luna de miel|hotel",                             "Viajes de Novios"),
        ("joyeria|alianza|anillo",                               "Joyería"),
        ("transporte|coche|limusina|autobus",                    "Transporte"),
        ("mariachi|flamenco|sevillanas",                         "Espectáculo"),
    ]
    for pattern, cat in CAT_MAP:
        if re.search(pattern, text_lower):
            return cat
    return og.get("type", "Proveedor de Bodas")


def extract_locality(content: str, nodes: list) -> tuple:
    """Extrae localidad y provincia del HTML."""
    locality, province = None, None
    for node in nodes:
        addr = node.get("address", {})
        if isinstance(addr, dict):
            locality  = locality  or clean_text(addr.get("addressLocality", ""))
            province  = province  or clean_text(addr.get("addressRegion", ""))
    # Fallback: schema.org breadcrumbs or address text patterns
    if not locality:
        m = re.search(r'(?:localidad|ciudad|municipio)[^>]*>\s*([A-ZÁÉÍÓÚ][a-záéíóúñ\s]{3,30})', content, re.I)
        if m:
            locality = clean_text(m.group(1))
    return locality or "", province or ""


def process_html_file(fpath: str) -> dict | None:
    """
    Procesa un archivo HTML y extrae un vendor_data dict completo.
    Retorna None si el archivo no es válido o tiene nombre de sistema.
    """
    fname = os.path.basename(fpath)
    if SKIP_NAME_PATTERNS.search(fname):
        return None

    try:
        with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read(500_000)  # Tope de 500KB para velocidad
    except Exception:
        return None

    # Skip archivos muy pequeños (no son páginas de proveedor)
    if len(content) < 2000:
        return None

    # Skip si contiene muy poco texto útil
    text_density = len(re.sub(r"<[^>]+>", "", content))
    if text_density < 500:
        return None

    og = extract_og_tags(content)
    nodes = extract_jsonld(content)

    # ── Nombre ──────────────────────────────────────────────────
    name = ""
    for node in nodes:
        ntype = str(node.get("@type", ""))
        if any(t in ntype for t in ["LocalBusiness", "Organization", "Service", "EntertainmentBusiness"]):
            if node.get("name"):
                name = clean_text(node["name"])
                break
    if not name:
        name = og.get("site_name") or og.get("title") or extract_h1(content)
    if not name or len(name) < 3:
        return None  # Sin nombre no hay proveedor válido

    # Purgar URLs de competidores del nombre
    if is_competitor_url(name):
        return None

    # ── Datos enriquecidos ───────────────────────────────────────
    phones = extract_phones(content)
    images = extract_images(content)
    prices = extract_prices(content)
    description = extract_description(content)
    locality, province = extract_locality(content, nodes)
    category = extract_category(content, og)

    # ── Geo ──────────────────────────────────────────────────────
    lat, lon = None, None
    for node in nodes:
        geo = node.get("geo", {})
        if isinstance(geo, dict):
            try:
                lat = lat or float(geo.get("latitude", 0)) or None
                lon = lon or float(geo.get("longitude", 0)) or None
            except Exception:
                pass

    # ── Rating ───────────────────────────────────────────────────
    rating, reviews = None, None
    for node in nodes:
        agg = node.get("aggregateRating", {})
        if isinstance(agg, dict):
            try:
                rating  = rating  or float(agg.get("ratingValue", 0)) or None
                reviews = reviews or int(agg.get("reviewCount", 0)) or None
            except Exception:
                pass

    # ── FAQs ─────────────────────────────────────────────────────
    faqs = []
    for node in nodes:
        if node.get("@type") == "FAQPage":
            for item in node.get("mainEntity", [])[:5]:
                q = clean_text(item.get("name", ""))
                a_obj = item.get("acceptedAnswer", {})
                a = clean_text(a_obj.get("text", "")) if isinstance(a_obj, dict) else ""
                if q and a:
                    faqs.append({"q": q, "a": a[:300]})

    # ── Construcción del registro ────────────────────────────────
    vendor = {
        "id":          f"bvh-{sha256_key(name + fpath)}",
        "name":        name,
        "category":    category,
        "phone":       phones[0] if phones else None,
        "phones":      phones,
        "locality":    locality,
        "province":    province,
        "latitude":    lat,
        "longitude":   lon,
        "rating":      rating,
        "reviews":     reviews,
        "prices":      prices,
        "priceMin":    min(prices) if prices else None,
        "priceMax":    max(prices) if prices else None,
        "photos":      images,
        "description": description[:600],
        "faqs":        faqs,
        "sourceFile":  os.path.basename(fpath),   # Solo nombre, NO ruta completa
        "processedAt": datetime.now().isoformat()
    }

    return vendor


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    t0 = time.time()
    print("=" * 72)
    print("[*] TAREA_01 — VAMPIRIZACION MASIVA DE HTML VAULTS (H:\\ e I:\\)")
    print("=" * 72)

    # ── Cargar hashes ya procesados (cache incremental ZTM) ──────
    processed_hashes: set = set()
    if HASH_CACHE.exists():
        try:
            processed_hashes = set(json.loads(HASH_CACHE.read_text(encoding="utf-8")))
            print(f"[*] Cache ZTM: {len(processed_hashes)} archivos ya procesados")
        except Exception:
            pass

    # ── Cargar base existente ────────────────────────────────────
    existing: list = []
    existing_ids: set = set()
    existing_name_keys: set = set()

    if OUTPUT_PATH.exists():
        try:
            existing = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
            existing_ids = {v.get("id", "") for v in existing}
            existing_name_keys = {norm_key(v.get("name", "")) for v in existing}
            print(f"[*] Base existente: {len(existing)} proveedores en {OUTPUT_PATH.name}")
        except Exception as e:
            print(f"[!] Error cargando base existente: {e}")

    # ── Descubrimiento de archivos HTML ─────────────────────────
    print(f"\n[1/4] Descubriendo archivos HTML en {len(SCAN_ROOTS)} raices...")
    all_html_files: list = []

    for root_path in SCAN_ROOTS:
        if not os.path.exists(root_path):
            print(f"  [!] No existe: {root_path}")
            continue

        print(f"  [*] Escaneando: {root_path}")
        for dirpath, dirs, files in os.walk(root_path):
            # Excluir directorios de sistema
            dirs[:] = [
                d for d in dirs
                if d not in SKIP_DIRS
                and not d.startswith(".")
                and not d.startswith("$")
            ]
            for fname in files:
                if fname.lower().endswith((".htm", ".html")):
                    fpath = os.path.join(dirpath, fname)
                    all_html_files.append(fpath)

            # Tope de archivos
            if args.max > 0 and len(all_html_files) >= args.max:
                break

        if args.max > 0 and len(all_html_files) >= args.max:
            all_html_files = all_html_files[: args.max]
            print(f"  [!] Tope --max {args.max} alcanzado")
            break

    print(f"\n  → Total archivos HTML descubiertos: {len(all_html_files):,}")

    if args.dry_run:
        print(f"\n[DRY-RUN] Muestreo de las primeras 20 rutas:")
        for p in all_html_files[:20]:
            print(f"  {p}")
        print("\n[DRY-RUN] Modo activo — sin escritura a disco.")
        return

    # ── Filtrar archivos ya procesados (ZTM cache) ───────────────
    print(f"\n[2/4] Filtrando duplicados por cache ZTM...")
    new_files = [
        f for f in all_html_files
        if sha256_key(f) not in processed_hashes
    ]
    print(f"  → Archivos nuevos a procesar: {len(new_files):,} / {len(all_html_files):,}")

    # ── Procesamiento de archivos ────────────────────────────────
    print(f"\n[3/4] Extrayendo y purificando proveedores...")
    new_vendors: list = []
    skipped_dup = 0
    skipped_invalid = 0
    batch_hashes: list = []

    REPORT_INTERVAL = 1000

    for idx, fpath in enumerate(new_files, 1):
        if idx % REPORT_INTERVAL == 0:
            elapsed = time.time() - t0
            rate = idx / elapsed if elapsed > 0 else 0
            eta = (len(new_files) - idx) / rate if rate > 0 else 0
            print(
                f"  ... [{idx:>6}/{len(new_files):,}] "
                f"+{len(new_vendors)} nuevos | "
                f"Skip: {skipped_dup}dup {skipped_invalid}inv | "
                f"ETA: {eta/60:.1f}min",
                flush=True
            )

        file_hash = sha256_key(fpath)
        batch_hashes.append(file_hash)

        vendor = process_html_file(fpath)
        if vendor is None:
            skipped_invalid += 1
            continue

        # ── Deduplicación por nombre normalizado ─────────────────
        nk = norm_key(vendor["name"])
        if nk in existing_name_keys or len(nk) < args.min_name_len:
            skipped_dup += 1
            continue

        existing_name_keys.add(nk)
        new_vendors.append(vendor)

    # ── Actualizar cache ZTM ─────────────────────────────────────
    processed_hashes.update(batch_hashes)
    HASH_CACHE.write_text(
        json.dumps(sorted(processed_hashes), ensure_ascii=False),
        encoding="utf-8"
    )

    # ── Consolidar y guardar ─────────────────────────────────────
    print(f"\n[4/4] Consolidando y escribiendo base de datos...")
    final_db = existing + new_vendors
    OUTPUT_PATH.write_text(
        json.dumps(final_db, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    # ── Informe de sesión ────────────────────────────────────────
    elapsed = time.time() - t0
    report = {
        "session_ts":          datetime.now().isoformat(),
        "duration_seconds":    round(elapsed, 2),
        "scan_roots":          SCAN_ROOTS,
        "html_discovered":     len(all_html_files),
        "html_new":            len(new_files),
        "vendors_existing":    len(existing),
        "vendors_added":       len(new_vendors),
        "vendors_total":       len(final_db),
        "skipped_dup":         skipped_dup,
        "skipped_invalid":     skipped_invalid,
        "output":              str(OUTPUT_PATH),
        "protocol":            "ANTIGRAVITY ZTM v4.1 — BARE-METAL QWEN WORKER"
    }
    REPORT_PATH.write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    # ── Salida final ─────────────────────────────────────────────
    print("\n" + "=" * 72)
    print("[OK] TAREA_01 — VAMPIRIZACION MASIVA COMPLETADA")
    print(f"  HTML descubiertos:   {len(all_html_files):,}")
    print(f"  HTML nuevos proc.:   {len(new_files):,}")
    print(f"  Proveedores nuevos:  {len(new_vendors):,}")
    print(f"  Total en base:       {len(final_db):,}")
    print(f"  Skipped dup:         {skipped_dup:,}")
    print(f"  Skipped inválidos:   {skipped_invalid:,}")
    print(f"  Tiempo total:        {elapsed:.1f}s ({elapsed/60:.1f}min)")
    print(f"  Output:              {OUTPUT_PATH}")
    print(f"  Informe:             {REPORT_PATH}")
    print("=" * 72)


if __name__ == "__main__":
    main()

