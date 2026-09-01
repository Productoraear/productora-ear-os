#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANTIGRAVITY OMEGA v4.1 — FASE 2: DEEP PHONE EXTRACTOR
=======================================================
Visita cada URL individual de proveedor y extrae:
  - Teléfono directo (del botón "Ver teléfono" o meta tags)
  - Precio exacto
  - Dirección completa
  - Rating/reviews actualizados
  - Capacidad de invitados
  - Imágenes (primera foto)

Solo visita proveedores que NO tienen teléfono en la SSOT.
Guarda resultados de forma incremental.
"""
from __future__ import annotations

import argparse
import json
import os
import random
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

try:
    from curl_cffi import requests as cffi_requests
except ImportError:
    print("[FATAL] pip install curl_cffi")
    sys.exit(2)

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("[FATAL] pip install beautifulsoup4 lxml")
    sys.exit(2)

BASE_DIR = Path(__file__).resolve().parent.parent
MAIN_DB = BASE_DIR / "src" / "data" / "vampirized_providers.json"
PROGRESS_FILE = BASE_DIR / "scripts" / "nightcrawler_results" / "deep_phone_progress.json"
ENRICHED_FILE = BASE_DIR / "scripts" / "nightcrawler_results" / "deep_enriched_providers.json"

IMPERSONATE = "chrome110"
PHONE_RE = re.compile(r'(?:\+34\s?)?(?:6|7|8|9)\d[\d\s\-\.]{7,12}')
FLUSH_EVERY = 20
LONG_PAUSE_EVERY = 80

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
]

BASE_HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "es-ES,es;q=0.9,en;q=0.7",
    "Sec-Ch-Ua": '"Chromium";v="110", "Google Chrome";v="110"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Upgrade-Insecure-Requests": "1",
}


def clean_phone(raw: Optional[str]) -> Optional[str]:
    if not raw:
        return None
    digits = re.sub(r'[^\d]', '', raw)
    if digits.startswith('34') and len(digits) >= 11:
        digits = digits[2:]
    if len(digits) == 9 and digits[0] in '6789':
        return digits
    return None


def http_get(url: str) -> tuple[int, Optional[str]]:
    try:
        headers = dict(BASE_HEADERS)
        headers["User-Agent"] = random.choice(USER_AGENTS)
        resp = cffi_requests.get(url, impersonate=IMPERSONATE, headers=headers, timeout=25)
        return int(resp.status_code), (resp.text if resp.status_code == 200 else None)
    except Exception as e:
        print(f"  [HTTP-ERR] {url}: {e}", flush=True)
        return 0, None


def extract_deep_data(html: str, url: str) -> dict[str, Any]:
    """Extract phone, address, price, rating, images from individual provider page."""
    soup = BeautifulSoup(html, 'lxml')
    result: dict[str, Any] = {}

    # 1. Phone: multiple strategies
    # Strategy A: JSON-LD schema
    for script in soup.find_all('script', type='application/ld+json'):
        try:
            ld = json.loads(script.string or '')
            if isinstance(ld, dict):
                phone = ld.get('telephone')
                if phone:
                    cp = clean_phone(phone)
                    if cp:
                        result['telephone'] = cp

                addr = ld.get('address', {})
                if isinstance(addr, dict):
                    parts = []
                    if addr.get('streetAddress'):
                        parts.append(addr['streetAddress'])
                    if addr.get('addressLocality'):
                        parts.append(addr['addressLocality'])
                    if addr.get('addressRegion'):
                        parts.append(addr['addressRegion'])
                    if parts:
                        result['address'] = ', '.join(parts)

                    if addr.get('addressRegion'):
                        result['province'] = addr['addressRegion']

                agg = ld.get('aggregateRating', {})
                if isinstance(agg, dict):
                    try:
                        result['rating'] = float(agg.get('ratingValue', 0))
                        result['reviewsCount'] = int(agg.get('reviewCount', 0))
                    except (ValueError, TypeError):
                        pass

                if ld.get('priceRange'):
                    result['priceRange'] = ld['priceRange']

                img = ld.get('image')
                if isinstance(img, str) and img.startswith('http'):
                    result['imageUrl'] = img
                elif isinstance(img, list) and img:
                    result['imageUrl'] = img[0] if isinstance(img[0], str) else None
        except (json.JSONDecodeError, TypeError):
            continue

    # Strategy B: meta tags
    if 'telephone' not in result:
        tel_meta = soup.find('meta', attrs={'name': 'telephone'}) or soup.find('meta', attrs={'property': 'business:contact_data:phone_number'})
        if tel_meta and tel_meta.get('content'):
            cp = clean_phone(tel_meta['content'])
            if cp:
                result['telephone'] = cp

    # Strategy C: tel: links
    if 'telephone' not in result:
        tel_links = soup.find_all('a', href=re.compile(r'^tel:'))
        for tl in tel_links:
            href = tl.get('href', '')
            cp = clean_phone(href.replace('tel:', ''))
            if cp:
                result['telephone'] = cp
                break

    # Strategy D: data attributes or visible phone text
    if 'telephone' not in result:
        phone_elements = soup.find_all(attrs={'data-phone': True})
        for pe in phone_elements:
            cp = clean_phone(pe.get('data-phone', ''))
            if cp:
                result['telephone'] = cp
                break

    # Strategy E: Regex scan of entire page
    if 'telephone' not in result:
        text = soup.get_text(' ', strip=True)
        matches = PHONE_RE.findall(text)
        for m in matches:
            cp = clean_phone(m)
            if cp:
                result['telephone'] = cp
                break

    # 2. Description
    if 'description' not in result:
        desc_meta = soup.find('meta', attrs={'name': 'description'})
        if desc_meta and desc_meta.get('content'):
            result['description'] = desc_meta['content'][:400]

    # 3. Price from visible text
    if 'priceRange' not in result:
        price_match = re.search(r'[Dd]esde\s+(\d[\d\.,]*)\s*[€$]', soup.get_text(' '))
        if price_match:
            result['priceRange'] = f"Desde {price_match.group(1)} EUR"

    # 4. Capacity
    cap_match = re.search(r'(\d+)\s*a\s*(\d[\d\.]*)\s*[Ii]nvitados', soup.get_text(' '))
    if cap_match:
        result['capacity'] = f"{cap_match.group(1)} a {cap_match.group(2)} invitados"

    return result


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0, help="Max providers to visit (0 = all)")
    ap.add_argument("--resume", action="store_true", help="Resume from progress file")
    args = ap.parse_args()

    print("=" * 72, flush=True)
    print("ANTIGRAVITY OMEGA v4.1 - DEEP PHONE EXTRACTOR (FASE 2)", flush=True)
    print("=" * 72, flush=True)

    # Load main DB
    with open(MAIN_DB, 'r', encoding='utf-8') as f:
        providers = json.load(f)
    if isinstance(providers, dict):
        providers = providers.get('providers', [])

    print(f"[LOAD] {len(providers)} proveedores en SSOT", flush=True)

    # Filter: only those WITHOUT phone AND with a sourceUrl
    candidates = []
    for i, p in enumerate(providers):
        phone = clean_phone(p.get('telephone', ''))
        url = p.get('sourceUrl', '') or p.get('url', '')
        if not phone and url and url.startswith('http'):
            candidates.append((i, url, p.get('name', '')))

    print(f"[CANDIDATES] {len(candidates)} proveedores sin telefono con URL visitables", flush=True)

    # Load progress
    done_urls = set()
    if args.resume and PROGRESS_FILE.exists():
        try:
            prog = json.loads(PROGRESS_FILE.read_text(encoding='utf-8'))
            done_urls = set(prog.get('completed_urls', []))
            print(f"[RESUME] {len(done_urls)} ya completados", flush=True)
        except Exception:
            pass

    # Filter done
    candidates = [(i, url, name) for i, url, name in candidates if url not in done_urls]
    random.shuffle(candidates)  # Orden estocastico

    if args.limit > 0:
        candidates = candidates[:args.limit]

    print(f"[QUEUE] {len(candidates)} fichas individuales a visitar", flush=True)

    enriched_count = 0
    phones_found = 0
    total_requests = 0
    batch: list[dict] = []

    for idx_in_queue, (db_idx, url, name) in enumerate(candidates, 1):
        status, html = http_get(url)
        total_requests += 1

        if status in (403, 429):
            print(f"  [WAF-BLOCK {status}] {name} -> Pausa 300s", flush=True)
            time.sleep(300)
            status, html = http_get(url)
            total_requests += 1

        if status != 200 or not html:
            done_urls.add(url)
            time.sleep(random.gauss(5, 1.5))
            continue

        data = extract_deep_data(html, url)

        if data:
            enriched_count += 1
            if data.get('telephone'):
                phones_found += 1
                providers[db_idx]['telephone'] = data['telephone']

            if data.get('priceRange') and (not providers[db_idx].get('priceRange') or providers[db_idx].get('priceRange') == 'Consultar'):
                providers[db_idx]['priceRange'] = data['priceRange']

            if data.get('rating') and (not providers[db_idx].get('rating') or providers[db_idx].get('rating') == 0):
                providers[db_idx]['rating'] = data['rating']
                if data.get('reviewsCount'):
                    providers[db_idx]['reviewsCount'] = data['reviewsCount']

            if data.get('description') and len(providers[db_idx].get('description', '') or '') < 50:
                providers[db_idx]['description'] = data['description']

            if data.get('address'):
                providers[db_idx]['address'] = data['address']

            if data.get('province') and not providers[db_idx].get('province'):
                providers[db_idx]['province'] = data['province']

            if data.get('imageUrl') and not providers[db_idx].get('imageUrls'):
                providers[db_idx]['imageUrls'] = [data['imageUrl']]

            if data.get('capacity'):
                providers[db_idx]['capacity'] = data['capacity']

            batch.append({'name': name, 'url': url, **data})

        done_urls.add(url)

        if idx_in_queue % 10 == 0:
            phone_tag = f" TEL:{data.get('telephone','?')}" if data.get('telephone') else ""
            print(f"  [{idx_in_queue}/{len(candidates)}] {name}{phone_tag} | Phones: {phones_found} | Enriched: {enriched_count}", flush=True)

        # Flush progress
        if idx_in_queue % FLUSH_EVERY == 0:
            PROGRESS_FILE.write_text(json.dumps({
                'completed_urls': list(done_urls),
                'total_requests': total_requests,
                'phones_found': phones_found,
                'enriched_count': enriched_count,
                'updated_at': datetime.now(timezone.utc).isoformat(),
            }, ensure_ascii=False), encoding='utf-8')

            # Save enriched batch
            existing_enriched = []
            if ENRICHED_FILE.exists():
                try:
                    existing_enriched = json.loads(ENRICHED_FILE.read_text(encoding='utf-8'))
                except Exception:
                    pass
            existing_enriched.extend(batch)
            ENRICHED_FILE.write_text(json.dumps(existing_enriched, ensure_ascii=False, indent=2), encoding='utf-8')
            batch = []

        # Long pause every N requests
        if total_requests % LONG_PAUSE_EVERY == 0:
            pause = random.uniform(120, 240)
            print(f"  [PAUSA LARGA] {total_requests} peticiones -> {pause:.0f}s", flush=True)
            time.sleep(pause)
        else:
            time.sleep(max(3.5, random.gauss(7, 2)))

    # Final flush
    if batch:
        existing_enriched = []
        if ENRICHED_FILE.exists():
            try:
                existing_enriched = json.loads(ENRICHED_FILE.read_text(encoding='utf-8'))
            except Exception:
                pass
        existing_enriched.extend(batch)
        ENRICHED_FILE.write_text(json.dumps(existing_enriched, ensure_ascii=False, indent=2), encoding='utf-8')

    PROGRESS_FILE.write_text(json.dumps({
        'completed_urls': list(done_urls),
        'total_requests': total_requests,
        'phones_found': phones_found,
        'enriched_count': enriched_count,
        'updated_at': datetime.now(timezone.utc).isoformat(),
    }, ensure_ascii=False), encoding='utf-8')

    # Save updated SSOT
    print(f"\n[GUARDADO] Escribiendo SSOT actualizada...", flush=True)
    with open(MAIN_DB, 'w', encoding='utf-8') as f:
        json.dump(providers, f, ensure_ascii=False, separators=(',', ':'))

    total = len(providers)
    total_phones = sum(1 for p in providers if clean_phone(p.get('telephone', '')))

    print(f"\n{'='*72}", flush=True)
    print(f"INFORME DEEP PHONE EXTRACTOR", flush=True)
    print(f"{'='*72}", flush=True)
    print(f"Fichas visitadas:     {total_requests}", flush=True)
    print(f"Enriquecidas:         {enriched_count}", flush=True)
    print(f"Telefonos nuevos:     {phones_found}", flush=True)
    print(f"Total con telefono:   {total_phones}/{total} ({100*total_phones/total:.1f}%)", flush=True)
    print(f"{'='*72}", flush=True)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
