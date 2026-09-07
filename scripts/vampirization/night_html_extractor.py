#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANTIGRAVITY OMEGA v5.0 — VAMPIRIZACIÓN NOCTURNA: EXTRACCIÓN HTML
- Descarga HTML crudo de proveedores usando curl_cffi para evadir Akamai WAF.
- Batch processing, hashes SHA256.
"""

import json
import hashlib
import time
import re
from pathlib import Path
from curl_cffi import requests

VAULT_DIR = Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\vendors_html")
MANIFEST_FILE = Path("scripts/.archived_manifest.json")
HARVEST_FILE = Path("src/data/bodas-vendors-harvested.json")
NEW_ONLINE_FILE = Path("scripts/nightcrawler_results/new_online_providers.json")

def normalize_slug(url_or_name: str) -> str:
    if not url_or_name: return "unknown"
    s = url_or_name.split("/")[-1].split("?")[0]
    if "--" in s: return s
    s = re.sub(r'[^a-zA-Z0-9]+', '-', s.lower()).strip('-')
    return s

def load_manifest() -> dict:
    if MANIFEST_FILE.exists():
        try:
            return json.loads(MANIFEST_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {}

def save_manifest(manifest: dict):
    MANIFEST_FILE.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_FILE.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

def get_providers() -> list[dict]:
    providers = []
    if HARVEST_FILE.exists():
        try:
            data = json.loads(HARVEST_FILE.read_text(encoding="utf-8"))
            providers.extend(data)
        except Exception: pass
    if NEW_ONLINE_FILE.exists():
        try:
            data = json.loads(NEW_ONLINE_FILE.read_text(encoding="utf-8"))
            if isinstance(data, dict) and "providers" in data:
                providers.extend(data["providers"])
        except Exception: pass
    return providers

def main():
    VAULT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = load_manifest()
    providers = get_providers()
    
    print(f"[START] Encontrados {len(providers)} proveedores en total.")
    
    count = 0
    success = 0
    failed = 0
    skipped = 0
    
    session = requests.Session(impersonate="chrome110", timeout=15)
    
    for p in providers:
        if count >= 5000:
            break
            
        url = p.get("sourceUrl") or p.get("url")
        if not url or "http" not in url:
            continue
            
        slug = normalize_slug(url)
        if not slug or slug == "unknown":
            slug = normalize_slug(p.get("name", "provider"))
            
        html_path = VAULT_DIR / f"{slug}.html"
        
        if str(html_path) in manifest and html_path.exists():
            skipped += 1
            continue
            
        try:
            resp = session.get(url)
            if resp.status_code == 200:
                html = resp.text
                html_path.write_text(html, encoding="utf-8")
                
                # SHA-256
                sha256 = hashlib.sha256(html.encode("utf-8")).hexdigest()
                manifest[str(html_path)] = sha256
                
                success += 1
                print(f"[OK] {url} -> {slug}.html")
            else:
                failed += 1
                print(f"[FAIL] {resp.status_code} {url}")
        except Exception as e:
            failed += 1
            print(f"[ERROR] {url} -> {str(e)}")
            
        if success > 0 and success % 50 == 0:
            save_manifest(manifest)
            
        time.sleep(0.5) # throttle
        count += 1
        
    save_manifest(manifest)
    print(f"\n[DONE] Extractos: {success} OK, {failed} ERROR, {skipped} SKIPPED (Ya en vault). Total peticiones: {count}")

if __name__ == "__main__":
    main()
