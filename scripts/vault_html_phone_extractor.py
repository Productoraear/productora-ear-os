#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANTIGRAVITY OMEGA v4.1 — EXTRACCIÓN MASIVA DE TELÉFONOS DESDE BÓVEDA HTML
==========================================================================
Recorre TODOS los archivos .htm/.html de la bóveda absorbida (EAR_ABSORBED_VAULT),
extrae el teléfono y el slug bodas.net de cada ficha, y cruza contra la SSOT
para inyectar teléfonos verificados.

Estrategia de matching:
  1. Slug URL bodas.net (ej: "convento-del-carmen--e13113" -> slug "convento-del-carmen")
  2. Nombre exacto normalizado
  3. Nombre parcial (primeras 3 palabras significativas)
"""
from __future__ import annotations

import json
import os
import re
import sys
import unicodedata
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("[FATAL] pip install beautifulsoup4 lxml")
    sys.exit(2)

BASE_DIR = Path(__file__).resolve().parent.parent
MAIN_DB = BASE_DIR / "src" / "data" / "vampirized_providers.json"

VAULT_DIRS = [
    Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT"),
]

PHONE_RE = re.compile(r'(?:\+34[\s\-]?)?(?:6|7|8|9)\d[\d\s\-\.]{7,12}')
BODAS_SLUG_RE = re.compile(r'([a-z0-9](?:[a-z0-9-]*[a-z0-9])?)--e(\d+)', re.I)


def normalize_name(name: str) -> str:
    if not name:
        return ""
    name = unicodedata.normalize('NFD', name.lower())
    name = ''.join(c for c in name if unicodedata.category(c) != 'Mn')
    name = re.sub(r'[^a-z0-9\s]', '', name)
    name = re.sub(r'\s+', ' ', name).strip()
    return name


def clean_phone(raw: Optional[str]) -> Optional[str]:
    if not raw:
        return None
    digits = re.sub(r'[^\d]', '', raw)
    if digits.startswith('34') and len(digits) >= 11:
        digits = digits[2:]
    if len(digits) == 9 and digits[0] in '6789':
        return digits
    return None


def extract_from_html_file(filepath: Path) -> dict:
    """Extract phone, name, slug from a single HTML vault file."""
    result = {}
    try:
        text = filepath.read_text(encoding='utf-8', errors='replace')
    except Exception:
        return result

    soup = BeautifulSoup(text, 'lxml')

    # Extract bodas.net slug from URL in content or filename
    fname = filepath.name.lower()
    slug_match = BODAS_SLUG_RE.search(fname)
    if slug_match:
        result['slug'] = slug_match.group(1)
        result['bodas_id'] = slug_match.group(2)

    # Also check canonical URL in page
    canonical = soup.find('link', rel='canonical')
    if canonical and canonical.get('href'):
        url_slug = BODAS_SLUG_RE.search(canonical['href'])
        if url_slug:
            result['slug'] = url_slug.group(1)
            result['bodas_id'] = url_slug.group(2)
            result['canonical_url'] = canonical['href']

    # Extract phone from JSON-LD
    for script in soup.find_all('script', type='application/ld+json'):
        try:
            ld = json.loads(script.string or '')
            if isinstance(ld, dict):
                phone = clean_phone(ld.get('telephone', ''))
                if phone:
                    result['telephone'] = phone
                name = ld.get('name', '')
                if name and len(name) > 2:
                    result['name'] = name

                # Address
                addr = ld.get('address', {})
                if isinstance(addr, dict) and addr.get('addressRegion'):
                    result['province'] = addr['addressRegion']
                if isinstance(addr, dict) and addr.get('addressLocality'):
                    result['municipality'] = addr['addressLocality']

                # Rating
                agg = ld.get('aggregateRating', {})
                if isinstance(agg, dict):
                    try:
                        result['rating'] = float(agg.get('ratingValue', 0))
                        result['reviewsCount'] = int(agg.get('reviewCount', 0))
                    except (ValueError, TypeError):
                        pass

                # Price
                if ld.get('priceRange'):
                    result['priceRange'] = ld['priceRange']

                # Image
                img = ld.get('image')
                if isinstance(img, str) and img.startswith('http'):
                    result['imageUrl'] = img
        except (json.JSONDecodeError, TypeError):
            continue

    # Extract phone from tel: links
    if 'telephone' not in result:
        for a in soup.find_all('a', href=re.compile(r'^tel:')):
            phone = clean_phone(a['href'].replace('tel:', ''))
            if phone:
                result['telephone'] = phone
                break

    # Extract phone from data attributes
    if 'telephone' not in result:
        for el in soup.find_all(attrs={'data-phone': True}):
            phone = clean_phone(el['data-phone'])
            if phone:
                result['telephone'] = phone
                break

    # Extract phone from visible text (last resort)
    if 'telephone' not in result:
        full_text = soup.get_text(' ', strip=True)
        # Look near keywords like "telefono", "contacto", "llamar"
        for keyword in ['tel', 'telefono', 'contacto', 'llamar', 'whatsapp']:
            kw_pos = full_text.lower().find(keyword)
            if kw_pos >= 0:
                vicinity = full_text[max(0, kw_pos-20):kw_pos+80]
                matches = PHONE_RE.findall(vicinity)
                for m in matches:
                    phone = clean_phone(m)
                    if phone:
                        result['telephone'] = phone
                        break
                if 'telephone' in result:
                    break

    # Extract name from title if not found
    if 'name' not in result:
        title = soup.find('title')
        if title:
            title_text = title.get_text(strip=True)
            # Clean bodas.net title pattern: "Name (Category City)"
            name_match = re.match(r'^(.+?)\s*[\(|–|\-]', title_text)
            if name_match:
                result['name'] = name_match.group(1).strip()
            elif len(title_text) < 100:
                result['name'] = title_text

    return result


def main():
    print("=" * 72)
    print("ANTIGRAVITY OMEGA v4.1 - VAULT HTML PHONE EXTRACTOR")
    print("=" * 72)

    # Load SSOT
    print("\n[LOAD] Cargando SSOT...")
    with open(MAIN_DB, 'r', encoding='utf-8') as f:
        providers = json.load(f)
    if isinstance(providers, dict):
        providers = providers.get('providers', [])
    print(f"  -> {len(providers)} proveedores")

    # Build indexes for matching
    slug_index: dict[str, int] = {}  # bodas slug -> SSOT index
    name_index: dict[str, int] = {}  # normalized name -> SSOT index

    for i, p in enumerate(providers):
        # Index by name
        nn = normalize_name(p.get('name', ''))
        if nn:
            name_index[nn] = i

        # Index by slug from sourceUrl
        url = p.get('sourceUrl', '') or ''
        m = BODAS_SLUG_RE.search(url)
        if m:
            slug_index[m.group(1).lower()] = i

        # Also index by record slug
        rec_slug = p.get('slug', '')
        if rec_slug:
            slug_index[rec_slug.lower()] = i

    print(f"  -> {len(slug_index)} slug entries indexed")
    print(f"  -> {len(name_index)} name entries indexed")

    # Count existing phones
    pre_phones = sum(1 for p in providers if clean_phone(p.get('telephone', '')))
    print(f"  -> {pre_phones} con telefono ANTES de la extraccion")

    # Scan vault HTML files
    print("\n[SCAN] Escaneando boveda HTML...")
    html_files = []
    for vault_dir in VAULT_DIRS:
        if not vault_dir.exists():
            print(f"  [SKIP] {vault_dir} no existe")
            continue
        for root, dirs, files in os.walk(vault_dir):
            for fname in files:
                if fname.lower().endswith(('.htm', '.html')):
                    html_files.append(Path(root) / fname)

    print(f"  -> {len(html_files)} archivos HTML encontrados")

    # Process each HTML file
    phones_injected = 0
    data_enriched = 0
    files_with_phone = 0
    files_processed = 0

    for filepath in html_files:
        files_processed += 1
        data = extract_from_html_file(filepath)

        if not data:
            continue

        phone = data.get('telephone')
        if phone:
            files_with_phone += 1

        # Try to match against SSOT
        matched_idx = None

        # Strategy 1: slug match
        slug = data.get('slug', '').lower()
        if slug and slug in slug_index:
            matched_idx = slug_index[slug]

        # Strategy 2: name match
        if matched_idx is None and data.get('name'):
            nn = normalize_name(data['name'])
            if nn in name_index:
                matched_idx = name_index[nn]

        if matched_idx is not None:
            p = providers[matched_idx]
            enriched = False

            # Inject phone
            if phone and not clean_phone(p.get('telephone', '')):
                p['telephone'] = phone
                phones_injected += 1
                enriched = True

            # Inject other data
            if data.get('priceRange') and (not p.get('priceRange') or p.get('priceRange') == 'Consultar'):
                p['priceRange'] = data['priceRange']
                enriched = True

            if data.get('rating') and (not p.get('rating') or p.get('rating') == 0):
                p['rating'] = data['rating']
                if data.get('reviewsCount'):
                    p['reviewsCount'] = data['reviewsCount']
                enriched = True

            if data.get('province') and not p.get('province'):
                p['province'] = data['province']
                enriched = True

            if data.get('municipality') and not p.get('municipality'):
                p['municipality'] = data['municipality']
                enriched = True

            if data.get('imageUrl') and not p.get('imageUrls'):
                p['imageUrls'] = [data['imageUrl']]
                enriched = True

            if enriched:
                data_enriched += 1

        if files_processed % 500 == 0:
            print(f"  [{files_processed}/{len(html_files)}] Phones injected: {phones_injected}, Enriched: {data_enriched}", flush=True)

    # Save
    print(f"\n[GUARDADO] Escribiendo SSOT actualizada...")
    with open(MAIN_DB, 'w', encoding='utf-8') as f:
        json.dump(providers, f, ensure_ascii=False, separators=(',', ':'))

    post_phones = sum(1 for p in providers if clean_phone(p.get('telephone', '')))

    print(f"\n{'='*72}")
    print(f"INFORME VAULT HTML PHONE EXTRACTOR")
    print(f"{'='*72}")
    print(f"HTMLs procesados:        {files_processed}")
    print(f"HTMLs con telefono:      {files_with_phone}")
    print(f"Telefonos inyectados:    {phones_injected}")
    print(f"Registros enriquecidos:  {data_enriched}")
    print(f"Telefonos ANTES:         {pre_phones}")
    print(f"Telefonos DESPUES:       {post_phones}")
    print(f"Incremento:              +{post_phones - pre_phones}")
    print(f"Cobertura final:         {post_phones}/{len(providers)} ({100*post_phones/len(providers):.1f}%)")
    print(f"{'='*72}")


if __name__ == '__main__':
    main()
