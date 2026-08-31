#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANTIGRAVITY OMEGA v4.1 — ASSET MIRRORING S-CLASS (CANDADO 3)
===========================================================
Descarga y almacena localmente/soberanamente las imágenes principales
de los proveedores para eliminar el hotlinking y el riesgo de bloqueo por Referer.
"""
import os
import sys
import json
import time
import hashlib
from pathlib import Path
from curl_cffi import requests

BASE_DIR = Path(__file__).resolve().parent.parent
TARGET_ASSETS_DIR = BASE_DIR / "public" / "assets" / "shadow_vendors"
RAG_DATA_FILE = BASE_DIR / "src" / "data" / "vampirized_providers.json"

TARGET_ASSETS_DIR.mkdir(parents=True, exist_ok=True)

def hash_url(url: str) -> str:
    return hashlib.md5(url.encode("utf-8")).hexdigest()[:12]

def mirror_assets(max_items: int = 200) -> dict:
    if not RAG_DATA_FILE.exists():
        print(f"[ERROR] No existe el archivo {RAG_DATA_FILE}")
        return {"error": "Missing RAG file"}

    data = json.loads(RAG_DATA_FILE.read_text(encoding="utf-8"))
    print(f"[INFO] Total perfiles cargados: {len(data):,}")

    downloaded = 0
    skipped = 0
    errors = 0

    session = requests.Session(impersonate="chrome110")

    for i, item in enumerate(data[:max_items]):
        image_urls = item.get("image_urls") or item.get("images") or []
        if not image_urls:
            continue

        prov_id = item.get("claimToken") or f"vendor_{i}"
        prov_dir = TARGET_ASSETS_DIR / prov_id
        prov_dir.mkdir(parents=True, exist_ok=True)

        new_local_urls = []

        for idx, img_url in enumerate(image_urls[:2]):
            if not isinstance(img_url, str) or not img_url.startswith("http"):
                new_local_urls.append(img_url)
                continue

            file_ext = ".jpg"
            if ".png" in img_url.lower(): file_ext = ".png"
            elif ".webp" in img_url.lower(): file_ext = ".webp"

            file_name = f"photo_{idx}_{hash_url(img_url)}{file_ext}"
            file_path = prov_dir / file_name
            relative_url = f"/assets/shadow_vendors/{prov_id}/{file_name}"

            if file_path.exists() and file_path.stat().st_size > 1000:
                skipped += 1
                new_local_urls.append(relative_url)
                continue

            try:
                resp = session.get(img_url, timeout=10)
                if resp.status_code == 200 and len(resp.content) > 1000:
                    file_path.write_bytes(resp.content)
                    downloaded += 1
                    new_local_urls.append(relative_url)
                else:
                    new_local_urls.append(img_url)
                    errors += 1
            except Exception:
                new_local_urls.append(img_url)
                errors += 1

            time.sleep(0.05)

        item["image_urls"] = new_local_urls

    # Guardar actualización
    RAG_DATA_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    result = {
        "status": "COMPLETED",
        "processed_providers": min(len(data), max_items),
        "downloaded_images": downloaded,
        "skipped_existing": skipped,
        "network_errors": errors,
        "assets_dir": str(TARGET_ASSETS_DIR),
    }
    print(json.dumps(result, indent=2))
    return result

if __name__ == "__main__":
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else 100
    mirror_assets(limit)
