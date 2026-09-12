#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANTIGRAVITY OMEGA v6.2 — SINCRONIZACIÓN SOBERANA DE PROVEEDORES (ZTM)
====================================================================
Lee el dataset rico 'src/data/vampirized-providers-deep-sclass.json'
(53.623 proveedores), descarga las imágenes ÚNICAS desde el origen
(cdn0/cdn1.bodas.net, unsplash, etc.) a 'public/assets/shadow_vendors/'
y reescribe las URLs remotas por rutas locales soberanas.

REGLAS:
  1. Los datos de proveedor (nombre, categoría, teléfono, pricing,
     metrics, technicalRider, descripción, etc.) se conservan ÍNTEGROS.
  2. Las URLs de imagen activas (media.coverImage / media.gallery /
     imageUrls) pasan a rutas locales. La URL remota original se
     preserva SOLO en 'sourceImageUrls' como referencia de auditoría.
  3. Salida: src/data/vampirized-providers-synchronized.json en formato
     canónico VendorShadowProfile (camelCase) listo para Supabase.

Protocolo ZTM: lectura por streaming, sin volcar JSON masivo a consola.
Solo se emite un resumen sintético al final.
"""

import os
import sys
import json
import hashlib
import time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse

from curl_cffi import requests

BASE_DIR = Path(__file__).resolve().parent.parent
SOURCE_FILE = BASE_DIR / "src" / "data" / "vampirized-providers-deep-sclass.json"
OUTPUT_FILE = BASE_DIR / "src" / "data" / "vampirized-providers-synchronized.json"
ASSETS_DIR = BASE_DIR / "public" / "assets" / "shadow_vendors"

# Extensiones de imagen ráster válidas. Los SVG (logos de plataforma) se
# descartan explícitamente por seguridad y porque no son fotos de proveedor.
RASTER_EXT = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif")

# Hosts que sirven imágenes reales SIN extensión de archivo en la URL
# (Unsplash placeholders, miniaturas de Google, avatares de Google).
EXTENSIONLESS_IMAGE_HOSTS = (
    "images.unsplash.com",
    "encrypted-tbn0.gstatic.com",
    "lh3.googleusercontent.com",
)

MAX_WORKERS = 8
TIMEOUT = 15
MAX_RETRIES = 2
# Límite de descarga para ejecuciones de validación rápida.
# 0 = descargar TODO.
MAX_DOWNLOAD = int(os.environ.get("EAR_SYNC_MAX_DOWNLOAD", "0") or 0)


def md5_url(url: str) -> str:
    return hashlib.md5(url.encode("utf-8")).hexdigest()[:16]


def ext_for_url(url: str) -> str:
    path = urlparse(url).path.lower()
    for ext in RASTER_EXT:
        if path.endswith(ext):
            return ".jpg" if ext == ".jpeg" else ext
    # Por defecto asumimos jpg (Unsplash/Gstatic/Google y CDN bodas.net).
    return ".jpg"


def is_image_url(url: str) -> bool:
    if not isinstance(url, str) or not url.startswith("http") or url.startswith("data:"):
        return False
    host = (urlparse(url).hostname or "").lower()
    path = urlparse(url).path.lower()
    if any(path.endswith(e) for e in RASTER_EXT):
        return True
    if host in EXTENSIONLESS_IMAGE_HOSTS:
        return True
    return False


def collect_images(data):
    """Recolecta las URLs de imagen ÚNICAS del dataset completo."""
    arr = data if isinstance(data, list) else (data.get("providers") or data.get("data") or [])
    uniq = set()
    for rec in arr:
        media = rec.get("media") if isinstance(rec.get("media"), dict) else {}
        for u in ([media.get("coverImage")] if media.get("coverImage") else []):
            if is_image_url(u):
                uniq.add(u)
        for u in (media.get("gallery") or []):
            if is_image_url(u):
                uniq.add(u)
        if is_image_url(rec.get("coverImage")):
            uniq.add(rec["coverImage"])
        if is_image_url(rec.get("imageUrl")):
            uniq.add(rec["imageUrl"])
        for u in (rec.get("imageUrls") or []):
            if is_image_url(u):
                uniq.add(u)
    return sorted(uniq)


def download_one(session, url: str) -> tuple:
    """Devuelve (url, ruta_local_relativa | None, bytes_count)."""
    h = md5_url(url)
    ext = ext_for_url(url)
    fname = f"{h}{ext}"
    fpath = ASSETS_DIR / fname
    rel = f"/assets/shadow_vendors/{fname}"

    if fpath.exists() and fpath.stat().st_size > 1000:
        return (url, rel, fpath.stat().st_size)

    last_err = None
    for attempt in range(MAX_RETRIES + 1):
        try:
            resp = session.get(url, timeout=TIMEOUT, allow_redirects=True)
            if resp.status_code == 200 and len(resp.content) > 1000:
                fpath.write_bytes(resp.content)
                return (url, rel, len(resp.content))
            last_err = f"status {resp.status_code}"
        except Exception as e:
            last_err = repr(e)
        time.sleep(0.3 * (attempt + 1))

    return (url, None, 0)


def slugify(name: str) -> str:
    import unicodedata
    s = unicodedata.normalize("NFD", (name or "").lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = "".join(c if (c.isalnum() or c in "-") else "-" for c in s)
    return s.strip("-")


def sha256(text: str) -> str:
    return hashlib.sha256(text.lower().encode("utf-8")).hexdigest()


def claim_token(name: str, province: str) -> str:
    h = sha256(f"{name}-{province}")
    return f"EAR-CLAIM-{h[:12].upper()}"


def main():
    print("═══════════════════════════════════════════════════════════════")
    print(" SINCRONIZACIÓN SOBERANA DE PROVEEDORES (ZTM)")
    print("═══════════════════════════════════════════════════════════════")

    if not SOURCE_FILE.exists():
        print(f"[ERROR] No existe el dataset fuente: {SOURCE_FILE}")
        sys.exit(1)

    ASSETS_DIR.mkdir(parents=True, exist_ok=True)

    with open(SOURCE_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    arr = data if isinstance(data, list) else (data.get("providers") or data.get("data") or [])
    total_records = len(arr)
    print(f"[INFO] Dataset fuente: {total_records:,} proveedores")

    images = collect_images(data)
    print(f"[INFO] Imágenes únicas detectadas: {len(images):,}")

    download_list = images if MAX_DOWNLOAD == 0 else images[:MAX_DOWNLOAD]

    session = requests.Session(impersonate="chrome110")
    downloaded = 0
    failed = 0
    map_url_to_local = {}

    print(f"[INFO] Descargando {len(download_list):,} imágenes al CDN local (workers={MAX_WORKERS})...")
    t0 = time.time()

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        futures = {ex.submit(download_one, session, u): u for u in download_list}
        done = 0
        for fut in as_completed(futures):
            url, rel, n = fut.result()
            if rel:
                map_url_to_local[url] = rel
                if n > 0:
                    downloaded += 1
            else:
                failed += 1
            done += 1
            if done % 500 == 0 or done == len(download_list):
                print(f"  [PROGRESS] {done:,}/{len(download_list):,} procesadas "
                      f"(ok={downloaded:,}, fail={failed:,})")

    dt = time.time() - t0
    print(f"[INFO] Descarga completada en {dt:.1f}s — OK={downloaded:,} FAIL={failed:,}")

    # ── Reescribir dataset conservando datos íntegros ────────────────────
    print("[INFO] Reescribiendo dataset con rutas soberanas...")
    synchronized = []

    for rec in arr:
        # Copia profunda para no mutar el original ni perder campos
        item = json.loads(json.dumps(rec, ensure_ascii=False))

        media = item.get("media") if isinstance(item.get("media"), dict) else {}
        source_urls = []

        def localize(u):
            # Devuelve la ruta local si se descargó; None si debe descartarse.
            if not isinstance(u, str):
                return None
            if not u.startswith("http"):
                return u  # ya es ruta local relativa
            source_urls.append(u)
            return map_url_to_local.get(u)  # None => se descarta (cero hotlinks)

        def clean_list(values):
            out = []
            for u in values:
                v = localize(u)
                if isinstance(v, str) and v:
                    out.append(v)
            # Deduplicar preservando orden
            seen = set()
            dedup = []
            for x in out:
                if x not in seen:
                    seen.add(x)
                    dedup.append(x)
            return dedup

        if media.get("coverImage"):
            media["coverImage"] = localize(media["coverImage"]) or ""
        if media.get("gallery"):
            media["gallery"] = clean_list(media["gallery"])
        if media:
            item["media"] = media

        if item.get("coverImage"):
            item["coverImage"] = localize(item["coverImage"]) or ""
        if item.get("imageUrl"):
            item["imageUrl"] = localize(item["imageUrl"]) or ""
        if item.get("imageUrls"):
            item["imageUrls"] = clean_list(item["imageUrls"])

        # ── Construir registro canónico VendorShadowProfile (camelCase) ──
        name = (rec.get("name") or "Proveedor Sin Nombre").strip()
        loc = rec.get("location") if isinstance(rec.get("location"), dict) else {}
        province = loc.get("province") or rec.get("province") or "España"
        municipality = loc.get("city") or rec.get("municipality") or None
        category = rec.get("category") or "Servicios para Eventos"
        phone = rec.get("phone") or rec.get("telephone") or None
        pricing = rec.get("pricing") if isinstance(rec.get("pricing"), dict) else {}
        metrics = rec.get("metrics") if isinstance(rec.get("metrics"), dict) else {}

        base_price = pricing.get("basePrice")
        price_range = f"{base_price} €" if isinstance(base_price, (int, float)) else None

        # Imágenes activas localizadas (solo rutas locales, sin hotlinks)
        active_imgs = []
        if media.get("coverImage"):
            active_imgs.append(media["coverImage"])
        if media.get("gallery"):
            active_imgs.extend(media["gallery"])
        # Deduplicar preservando orden
        seen = set()
        dedup = []
        for u in active_imgs:
            if isinstance(u, str) and u and u not in seen:
                seen.add(u)
                dedup.append(u)

        canonical = {
            "shaHash": sha256(f"{name}|{province}|{category}"),
            "name": name[:255],
            "slug": rec.get("slug") or slugify(name),
            "category": category[:100],
            "province": province[:100],
            "municipality": (municipality[:100] if municipality else None),
            "telephone": (phone[:50] if phone else None),
            "priceRange": price_range,
            "rating": metrics.get("rating") if isinstance(metrics.get("rating"), (int, float)) else (rec.get("rating") if isinstance(rec.get("rating"), (int, float)) else 4.8),
            "reviewsCount": metrics.get("reviewCount") if isinstance(metrics.get("reviewCount"), (int, float)) else (rec.get("reviewsCount") if isinstance(rec.get("reviewsCount"), (int, float)) else 12),
            "description": rec.get("description") or None,
            "imageUrls": dedup,
            "claimToken": claim_token(name, province),
            "status": rec.get("status") or "GHOST_UNCLAIMED",
            # Datos íntegros adicionales preservados (pricing, metrics, rider, media, location, sourceImageUrls)
            "phone": phone,
            "pricing": pricing,
            "metrics": metrics,
            "technicalRider": rec.get("technicalRider"),
            "media": media,
            "location": loc,
            "sourceImageUrls": source_urls if source_urls else None,
        }

        synchronized.append(canonical)

    # ── Guardar salida ───────────────────────────────────────────────────
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(synchronized, f, ensure_ascii=False)
    out_mb = OUTPUT_FILE.stat().st_size / 1024 / 1024

    # ── Verificación final ───────────────────────────────────────────────
    local_cnt = 0
    remote_cnt = 0
    for c in synchronized:
        for u in c["imageUrls"]:
            if u.startswith("/"):
                local_cnt += 1
            elif u.startswith("http"):
                remote_cnt += 1

    summary = {
        "status": "COMPLETED",
        "source": str(SOURCE_FILE),
        "output": str(OUTPUT_FILE),
        "total_providers": len(synchronized),
        "unique_images": len(images),
        "downloaded_ok": downloaded,
        "download_failed": failed,
        "local_image_urls": local_cnt,
        "remote_fallback_urls": remote_cnt,
        "assets_dir": str(ASSETS_DIR),
        "output_mb": round(out_mb, 2),
        "elapsed_seconds": round(dt, 1),
    }
    print("───────────────────────────────────────────────────────────────")
    print(json.dumps(summary, indent=2, ensure_ascii=False))
    print("  ✓ EXIT 0 — Proveedores sincronizados con imágenes soberanas.")


if __name__ == "__main__":
    main()