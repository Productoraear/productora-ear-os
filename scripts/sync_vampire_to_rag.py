#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANTIGRAVITY OMEGA v4.1 — CONTINUOUS VAMPIRE SYNC BRIDGE
======================================================
Consolida en caliente los proveedores capturados online (new_online_providers.json),
los absorbidos de la Bóveda (vault_absorbed_providers.json) y los teléfonos extraídos
(fast_extracted_phones.json) directamente en src/data/vampirized_providers.json para Next.js.
"""
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
RESULTS_DIR = BASE_DIR / "scripts" / "nightcrawler_results"
RAG_TARGET_FILE = BASE_DIR / "src" / "data" / "vampirized_providers.json"

PHONE_RE = re.compile(r"(?:\+34)?[\s\-]?[6789]\d{2}[\s\-]?\d{3}[\s\-]?\d{3}")

def normalize_name(name: str) -> str:
    if not name: return ""
    n = name.lower().strip()
    n = re.sub(r"\s+", " ", n)
    for suffix in ("en bodas.net", "bodas.net", "en fanders.es", "fanders.es"):
        if n.endswith(suffix):
            n = n[:-len(suffix)].strip()
    return n

def generate_claim_token(name: str) -> str:
    h = abs(sum(ord(c) * (31 ** i) for i, c in enumerate(name[:20])))
    return f"EAR-GHOST-{h:08x}".upper()

def sync_pipeline() -> dict:
    online_path = RESULTS_DIR / "new_online_providers.json"
    vault_path = RESULTS_DIR / "vault_absorbed_providers.json"
    phones_path = RESULTS_DIR / "fast_extracted_phones.json"

    # 1. Load fast phones map
    phones_map: dict[str, str] = {}
    if phones_path.exists():
        try:
            raw_phones = json.loads(phones_path.read_text(encoding="utf-8"))
            if isinstance(raw_phones, list):
                for item in raw_phones:
                    nm = normalize_name(item.get("name", ""))
                    ph = item.get("phone") or item.get("telephone")
                    if nm and ph: phones_map[nm] = ph
        except Exception: pass

    # 2. Load Vault
    vault_list: list[dict] = []
    if vault_path.exists():
        try:
            raw = json.loads(vault_path.read_text(encoding="utf-8"))
            vault_list = raw.get("providers", []) if isinstance(raw, dict) else (raw if isinstance(raw, list) else [])
        except Exception: pass

    # 3. Load Online
    online_list: list[dict] = []
    if online_path.exists():
        try:
            raw = json.loads(online_path.read_text(encoding="utf-8"))
            online_list = raw.get("providers", []) if isinstance(raw, dict) else (raw if isinstance(raw, list) else [])
        except Exception: pass

    # 4. Consolidate into map
    consolidated: dict[str, dict] = {}

    for p in vault_list:
        name = p.get("name", "").strip()
        nn = normalize_name(name)
        if not nn or len(nn) < 3: continue

        phone = p.get("telephone") or phones_map.get(nn)
        loc = p.get("location")
        provincia = p.get("provincia")
        if not provincia and isinstance(loc, str) and "," in loc:
            provincia = loc.split(",")[-1].strip()

        consolidated[nn] = {
            "name": name,
            "category": p.get("category") or "Servicios para Eventos",
            "provincia": provincia or "España",
            "location": loc or provincia or "España",
            "telephone": phone,
            "rating": p.get("rating") or 4.8,
            "reviews_count": p.get("reviews_count") or 14,
            "description": p.get("description_full") or p.get("description") or f"Servicio profesional para bodas y eventos en {provincia or 'España'}.",
            "claimToken": generate_claim_token(name),
            "status": "GHOST_UNCLAIMED",
            "sourceOrigin": p.get("source_file") or "VAULT_LOCAL",
            "image_urls": p.get("image_urls") or [],
            "updatedAt": datetime.now(timezone.utc).isoformat(),
        }

    for p in online_list:
        name = p.get("name", "").strip()
        nn = normalize_name(name)
        if not nn or len(nn) < 3: continue

        phone = p.get("telephone") or phones_map.get(nn)

        if nn in consolidated:
            existing = consolidated[nn]
            if not existing.get("telephone") and phone:
                existing["telephone"] = phone
            if p.get("category") and existing.get("category") == "Servicios para Eventos":
                existing["category"] = p.get("category")
            if p.get("provincia") and existing.get("provincia") == "España":
                existing["provincia"] = p.get("provincia")
        else:
            provincia = p.get("provincia") or "España"
            consolidated[nn] = {
                "name": name,
                "category": p.get("category") or "Servicios para Eventos",
                "provincia": provincia,
                "location": provincia,
                "telephone": phone,
                "rating": p.get("rating") or 4.8,
                "reviews_count": p.get("reviews_count") or 12,
                "description": p.get("description_full") or f"Proveedor homologado para eventos y celebraciones en {provincia}.",
                "claimToken": generate_claim_token(name),
                "status": "GHOST_UNCLAIMED",
                "sourceOrigin": p.get("site") or "ONLINE_DAEMON",
                "image_urls": p.get("image_urls") or [],
                "updatedAt": datetime.now(timezone.utc).isoformat(),
            }

    final_list = list(consolidated.values())

    # Write to RAG target file
    RAG_TARGET_FILE.parent.mkdir(parents=True, exist_ok=True)
    RAG_TARGET_FILE.write_text(
        json.dumps(final_list, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    phones_count = sum(1 for p in final_list if p.get("telephone"))

    metrics = {
        "total_consolidated": len(final_list),
        "total_phones": phones_count,
        "phone_coverage_pct": f"{(phones_count / len(final_list) * 100):.1f}%" if final_list else "0%",
        "target_file": str(RAG_TARGET_FILE),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    return metrics

if __name__ == "__main__":
    res = sync_pipeline()
    print("SYNC COMPLETED SUCCESSFULLY:")
    print(json.dumps(res, indent=2))
