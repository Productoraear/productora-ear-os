#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANTIGRAVITY OMEGA v4.1 — INYECTOR TOTAL DE TELÉFONOS (MULTI-ESTRATEGIA)
=========================================================================
Cruza TODAS las fuentes de teléfonos contra la SSOT usando 5 estrategias:
  1. Bodas.net e-ID exacto (ej: --e13113)
  2. Slug URL exacto
  3. Nombre normalizado exacto
  4. Nombre parcial (3+ palabras comunes)
  5. Extracción directa de HTMLs con sesión del vault

Fuentes de teléfonos:
  - fast_extracted_phones.json (4976 con teléfono)
  - vault_absorbed_providers.json (471 con teléfono)
  - vampire_mass_extracted.json (pendiente)
"""
from __future__ import annotations

import json
import os
import re
import sys
import unicodedata
from pathlib import Path
from typing import Optional

BASE_DIR = Path(__file__).resolve().parent.parent
MAIN_DB = BASE_DIR / "src" / "data" / "vampirized_providers.json"
PHONES_PATH = BASE_DIR / "scripts" / "nightcrawler_results" / "fast_extracted_phones.json"
VAULT_PATH = BASE_DIR / "scripts" / "nightcrawler_results" / "vault_absorbed_providers.json"

BODAS_EID_RE = re.compile(r'--e(\d+)')
PHONE_RE = re.compile(r'(?:\+34\s?)?(?:6|7|8|9)\d[\d\s\-\.]{7,12}')


def normalize(name: str) -> str:
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
    digits = re.sub(r'[^\d]', '', str(raw))
    if digits.startswith('34') and len(digits) >= 11:
        digits = digits[2:]
    if len(digits) == 9 and digits[0] in '6789':
        return digits
    return None


def extract_slug_from_filename(fname: str) -> Optional[str]:
    """Extract bodas.net slug from vault filename."""
    m = re.search(r'_([a-z0-9](?:[a-z0-9-]*[a-z0-9])?)--e\d+', fname.lower())
    return m.group(1) if m else None


def extract_eid_from_string(s: str) -> Optional[str]:
    """Extract bodas.net e-ID number."""
    m = BODAS_EID_RE.search(s)
    return m.group(1) if m else None


def main():
    print("=" * 72)
    print("ANTIGRAVITY OMEGA v4.1 - INYECTOR TOTAL DE TELEFONOS")
    print("=" * 72)

    # Load SSOT
    with open(MAIN_DB, 'r', encoding='utf-8') as f:
        providers = json.load(f)
    if isinstance(providers, dict):
        providers = providers.get('providers', [])

    total = len(providers)
    pre_phones = sum(1 for p in providers if clean_phone(p.get('telephone', '')))
    print(f"\n[SSOT] {total} proveedores, {pre_phones} con telefono ({100*pre_phones/total:.1f}%)")

    # Build multi-index for SSOT
    eid_idx: dict[str, list[int]] = {}    # bodas e-ID -> provider indices
    slug_idx: dict[str, list[int]] = {}   # slug -> provider indices
    name_idx: dict[str, list[int]] = {}   # normalized name -> provider indices

    for i, p in enumerate(providers):
        # Index by e-ID from sourceUrl
        url = p.get('sourceUrl', '') or ''
        eid = extract_eid_from_string(url)
        if eid:
            eid_idx.setdefault(eid, []).append(i)

        # Index by slug
        slug = p.get('slug', '')
        if slug:
            slug_idx.setdefault(slug.lower(), []).append(i)

        # Index by name
        nn = normalize(p.get('name', ''))
        if nn:
            name_idx.setdefault(nn, []).append(i)

    print(f"  -> {len(eid_idx)} unique e-IDs indexed")
    print(f"  -> {len(slug_idx)} unique slugs indexed")
    print(f"  -> {len(name_idx)} unique names indexed")

    # ========================
    # SOURCE 1: fast_extracted_phones.json
    # ========================
    print(f"\n[SOURCE 1] fast_extracted_phones.json")
    phones_data = []
    if PHONES_PATH.exists():
        with open(PHONES_PATH, 'r', encoding='utf-8') as f:
            phones_data = json.load(f)
    print(f"  -> {len(phones_data)} entries")

    s1_injected = 0
    for entry in phones_data:
        phone = clean_phone(entry.get('phone', ''))
        if not phone:
            continue

        name = entry.get('name', '')
        fname = entry.get('file', '')

        # Strategy 1: e-ID from filename
        eid = extract_eid_from_string(fname)
        if eid and eid in eid_idx:
            for idx in eid_idx[eid]:
                if not clean_phone(providers[idx].get('telephone', '')):
                    providers[idx]['telephone'] = phone
                    s1_injected += 1
            continue

        # Strategy 2: slug from filename
        slug = extract_slug_from_filename(fname)
        if slug and slug in slug_idx:
            for idx in slug_idx[slug]:
                if not clean_phone(providers[idx].get('telephone', '')):
                    providers[idx]['telephone'] = phone
                    s1_injected += 1
            continue

        # Strategy 3: exact name match
        nn = normalize(name)
        if nn and nn in name_idx:
            for idx in name_idx[nn]:
                if not clean_phone(providers[idx].get('telephone', '')):
                    providers[idx]['telephone'] = phone
                    s1_injected += 1
            continue

        # Strategy 4: partial name match (first 3 significant words)
        words = [w for w in nn.split() if len(w) >= 3]
        if len(words) >= 2:
            partial = ' '.join(words[:3])
            for key, indices in name_idx.items():
                if partial in key or key in partial:
                    for idx in indices:
                        if not clean_phone(providers[idx].get('telephone', '')):
                            providers[idx]['telephone'] = phone
                            s1_injected += 1
                    break

    print(f"  -> {s1_injected} telefonos inyectados")

    # ========================
    # SOURCE 2: vault_absorbed_providers.json
    # ========================
    print(f"\n[SOURCE 2] vault_absorbed_providers.json")
    vault_data = []
    if VAULT_PATH.exists():
        with open(VAULT_PATH, 'r', encoding='utf-8') as f:
            raw = json.load(f)
        vault_data = raw if isinstance(raw, list) else raw.get('providers', [])
    print(f"  -> {len(vault_data)} entries")

    s2_injected = 0
    for entry in vault_data:
        phone = clean_phone(entry.get('telephone') or entry.get('phone', ''))
        if not phone:
            continue

        name = entry.get('name', '')
        nn = normalize(name)

        # Try name match
        if nn and nn in name_idx:
            for idx in name_idx[nn]:
                if not clean_phone(providers[idx].get('telephone', '')):
                    providers[idx]['telephone'] = phone
                    s2_injected += 1

        # Try slug from URL
        url = entry.get('url', '') or entry.get('sourceUrl', '')
        slug_m = re.search(r'/([a-z0-9-]+)--e\d+', url.lower())
        if slug_m:
            slug = slug_m.group(1)
            if slug in slug_idx:
                for idx in slug_idx[slug]:
                    if not clean_phone(providers[idx].get('telephone', '')):
                        providers[idx]['telephone'] = phone
                        s2_injected += 1

    print(f"  -> {s2_injected} telefonos inyectados")

    # ========================
    # SOURCE 3: Scan vault HTML files with bodas.net e-ID match
    # ========================
    print(f"\n[SOURCE 3] Vault HTML scan (solo fichas con e-ID matcheable)")
    from bs4 import BeautifulSoup
    import warnings
    from bs4 import XMLParsedAsHTMLWarning
    warnings.filterwarnings("ignore", category=XMLParsedAsHTMLWarning)

    vault_dir = Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT")
    s3_injected = 0
    files_scanned = 0

    if vault_dir.exists():
        for root, dirs, files in os.walk(vault_dir):
            for fname in files:
                if not fname.lower().endswith(('.htm', '.html')):
                    continue

                # Only process files with bodas e-ID pattern
                eid = extract_eid_from_string(fname)
                if not eid or eid not in eid_idx:
                    continue

                # Check if we already have a phone for this provider
                target_indices = eid_idx[eid]
                needs_phone = any(not clean_phone(providers[idx].get('telephone', '')) for idx in target_indices)
                if not needs_phone:
                    continue

                filepath = Path(root) / fname
                files_scanned += 1

                try:
                    text = filepath.read_text(encoding='utf-8', errors='replace')
                    soup = BeautifulSoup(text, 'lxml')

                    phone = None

                    # JSON-LD
                    for script in soup.find_all('script', type='application/ld+json'):
                        try:
                            ld = json.loads(script.string or '')
                            if isinstance(ld, dict) and ld.get('telephone'):
                                phone = clean_phone(ld['telephone'])
                                if phone:
                                    break
                        except Exception:
                            continue

                    # tel: links
                    if not phone:
                        for a in soup.find_all('a', href=re.compile(r'^tel:')):
                            phone = clean_phone(a['href'].replace('tel:', ''))
                            if phone:
                                break

                    # data-phone
                    if not phone:
                        for el in soup.find_all(attrs={'data-phone': True}):
                            phone = clean_phone(el['data-phone'])
                            if phone:
                                break

                    # Text vicinity
                    if not phone:
                        full_text = soup.get_text(' ', strip=True)
                        for kw in ['tel', 'telefono', 'contacto', 'llamar']:
                            pos = full_text.lower().find(kw)
                            if pos >= 0:
                                vicinity = full_text[max(0, pos-10):pos+60]
                                for m in PHONE_RE.findall(vicinity):
                                    phone = clean_phone(m)
                                    if phone:
                                        break
                            if phone:
                                break

                    if phone:
                        for idx in target_indices:
                            if not clean_phone(providers[idx].get('telephone', '')):
                                providers[idx]['telephone'] = phone
                                s3_injected += 1

                except Exception:
                    continue

    print(f"  -> {files_scanned} HTMLs escaneados (con e-ID matcheable)")
    print(f"  -> {s3_injected} telefonos inyectados")

    # ========================
    # FINAL: Save and report
    # ========================
    post_phones = sum(1 for p in providers if clean_phone(p.get('telephone', '')))

    print(f"\n{'='*72}")
    print(f"INFORME FINAL DE INYECCION DE TELEFONOS")
    print(f"{'='*72}")
    print(f"Telefonos ANTES:     {pre_phones}")
    print(f"Telefonos DESPUES:   {post_phones}")
    print(f"Incremento:          +{post_phones - pre_phones}")
    print(f"  Source 1 (phones):   +{s1_injected}")
    print(f"  Source 2 (vault):    +{s2_injected}")
    print(f"  Source 3 (HTML):     +{s3_injected}")
    print(f"Cobertura final:     {post_phones}/{total} ({100*post_phones/total:.1f}%)")
    print(f"{'='*72}")

    # Save
    print(f"\n[GUARDADO] Escribiendo SSOT...")
    with open(MAIN_DB, 'w', encoding='utf-8') as f:
        json.dump(providers, f, ensure_ascii=False, separators=(',', ':'))

    sz = os.path.getsize(MAIN_DB) / (1024*1024)
    print(f"  -> {sz:.1f} MB")
    print(f"[FIN] Inyeccion completada.")


if __name__ == '__main__':
    main()
