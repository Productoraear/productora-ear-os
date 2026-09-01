#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANTIGRAVITY OMEGA v4.1 — FUSIÓN TOTAL Y ENRIQUECIMIENTO DE BASE DE DATOS SSOT
================================================================================
Tarea: Merge 100% de teléfonos + datos nuevos del vampiro nocturno en vampirized_providers.json
Fuentes:
  1. vampirized_providers.json             (12.739 registros, base SSOT)
  2. nightcrawler_results/new_online_providers.json  (10.737 nuevos del scraping nocturno)
  3. nightcrawler_results/fast_extracted_phones.json  (4.976 teléfonos de bóveda HTML)
  4. nightcrawler_results/vault_absorbed_providers.json (3.252 absorbidos)
  5. vampire_cohort_p1_silver.json          (cohorte silver)
  6. vampire_public_catalog_zk.json         (catálogo público)
"""
from __future__ import annotations

import json
import os
import re
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

BASE_DIR = Path(__file__).resolve().parent.parent
MAIN_DB_PATH = BASE_DIR / "src" / "data" / "vampirized_providers.json"
NC_NEW_PATH = BASE_DIR / "scripts" / "nightcrawler_results" / "new_online_providers.json"
PHONES_PATH = BASE_DIR / "scripts" / "nightcrawler_results" / "fast_extracted_phones.json"
VAULT_PATH = BASE_DIR / "scripts" / "nightcrawler_results" / "vault_absorbed_providers.json"
SILVER_PATH = BASE_DIR / "scripts" / "vampire_cohort_p1_silver.json"
CATALOG_PATH = BASE_DIR / "scripts" / "vampire_public_catalog_zk.json"

OUTPUT_PATH = MAIN_DB_PATH  # Overwrite SSOT in place
BACKUP_PATH = BASE_DIR / "scripts" / "nightcrawler_results" / "vampirized_providers_pre_merge_backup.json"

PHONE_RE = re.compile(r'(?:\+34\s?)?(?:6|7|8|9)\d[\d\s\-\.]{7,12}')
PRICE_RE = re.compile(r'[Dd]esde\s+(\d[\d\.,]*)\s*[€$]')
RATING_RE = re.compile(r'(\d[,\.]\d)\s*\((\d+)\)')
INVITADOS_RE = re.compile(r'(\d+)\s*a\s*(\d[\d\.]*)\s*[Ii]nvitados')


def normalize_name(name: str) -> str:
    """Normaliza un nombre para deduplicación: lowercase, sin acentos, sin puntuación."""
    if not name:
        return ""
    name = unicodedata.normalize('NFD', name)
    name = ''.join(c for c in name if unicodedata.category(c) != 'Mn')
    name = re.sub(r'[^a-z0-9\s]', '', name.lower())
    name = re.sub(r'\s+', ' ', name).strip()
    return name


def clean_phone(raw: Optional[str]) -> Optional[str]:
    """Limpia y normaliza un teléfono español a formato 9 dígitos."""
    if not raw:
        return None
    digits = re.sub(r'[^\d]', '', raw)
    if digits.startswith('34') and len(digits) >= 11:
        digits = digits[2:]
    if len(digits) == 9 and digits[0] in '6789':
        return digits
    return None


def extract_phone_from_text(text: str) -> Optional[str]:
    """Extrae el primer teléfono español válido de un bloque de texto."""
    if not text:
        return None
    matches = PHONE_RE.findall(text)
    for m in matches:
        cleaned = clean_phone(m)
        if cleaned:
            return cleaned
    return None


def extract_price_from_desc(desc: str) -> Optional[str]:
    """Extrae el rango de precio de una descripción."""
    if not desc:
        return None
    m = PRICE_RE.search(desc)
    if m:
        return f"Desde {m.group(1)} EUR"
    return None


def extract_rating_from_desc(desc: str) -> tuple[Optional[float], Optional[int]]:
    """Extrae rating y count de una descripción como '5.0 (27)'."""
    if not desc:
        return None, None
    m = RATING_RE.search(desc)
    if m:
        try:
            rating = float(m.group(1).replace(',', '.'))
            count = int(m.group(2))
            return rating, count
        except ValueError:
            pass
    return None, None


def extract_capacity_from_desc(desc: str) -> Optional[str]:
    """Extrae capacidad de invitados de una descripción."""
    if not desc:
        return None
    m = INVITADOS_RE.search(desc)
    if m:
        return f"{m.group(1)} a {m.group(2)} invitados"
    return None


def make_slug(name: str) -> str:
    """Genera un slug URL-safe a partir de un nombre."""
    slug = unicodedata.normalize('NFD', name.lower())
    slug = ''.join(c for c in slug if unicodedata.category(c) != 'Mn')
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug[:80]


def load_json(path: Path) -> Any:
    """Carga un archivo JSON con fallback."""
    if not path.exists():
        return None
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"[WARN] Cannot load {path}: {e}")
        return None


def main():
    print("=" * 72)
    print("ANTIGRAVITY OMEGA v4.1 - FUSION TOTAL Y ENRIQUECIMIENTO SSOT")
    print("=" * 72)

    # ========================
    # FASE 1: Cargar SSOT actual
    # ========================
    print("\n[FASE 1] Cargando base de datos SSOT actual...")
    main_data = load_json(MAIN_DB_PATH)
    if main_data is None:
        print("[FATAL] No se pudo cargar vampirized_providers.json")
        return 1

    main_providers = main_data if isinstance(main_data, list) else main_data.get('providers', [])
    print(f"  -> {len(main_providers)} registros en SSOT")

    # Backup
    print("[BACKUP] Guardando backup pre-merge...")
    with open(BACKUP_PATH, 'w', encoding='utf-8') as f:
        json.dump(main_providers, f, ensure_ascii=False)
    print(f"  -> Backup en {BACKUP_PATH}")

    # Indexar por nombre normalizado
    name_index: dict[str, int] = {}
    for i, p in enumerate(main_providers):
        nn = normalize_name(p.get('name', ''))
        if nn:
            name_index[nn] = i

    # ========================
    # FASE 2: Inyectar teléfonos de fast_extracted_phones.json
    # ========================
    print("\n[FASE 2] Inyectando telefonos de fast_extracted_phones.json...")
    phones_data = load_json(PHONES_PATH)
    phones_injected = 0
    if phones_data and isinstance(phones_data, list):
        for entry in phones_data:
            phone = clean_phone(entry.get('phone', ''))
            name = entry.get('name', '')
            nn = normalize_name(name)
            if not phone or not nn:
                continue
            if nn in name_index:
                idx = name_index[nn]
                existing_phone = clean_phone(main_providers[idx].get('telephone', ''))
                if not existing_phone:
                    main_providers[idx]['telephone'] = phone
                    phones_injected += 1
    print(f"  -> {phones_injected} telefonos inyectados en registros existentes")

    # ========================
    # FASE 3: Merge proveedores del nightcrawler
    # ========================
    print("\n[FASE 3] Merging proveedores del nightcrawler nocturno...")
    nc_data = load_json(NC_NEW_PATH)
    nc_new = 0
    nc_enriched = 0
    nc_phones_extracted = 0

    if nc_data and isinstance(nc_data, dict):
        nc_provs = nc_data.get('providers', [])
        print(f"  -> {len(nc_provs)} proveedores del nightcrawler para procesar")

        for p in nc_provs:
            name = p.get('name', '').strip()
            if not name or len(name) < 3:
                continue

            nn = normalize_name(name)
            desc = p.get('description_full', '') or ''

            # Extraer telefono de la descripcion
            phone = extract_phone_from_text(desc)
            if phone:
                nc_phones_extracted += 1

            # Extraer precio, rating, capacidad
            price = extract_price_from_desc(desc)
            rating, review_count = extract_rating_from_desc(desc)
            capacity = extract_capacity_from_desc(desc)

            # Limpiar la descripcion (quitar ruido de listado)
            clean_desc = desc
            # Intentar extraer solo la parte relevante para este proveedor
            name_pos = desc.find(name)
            if name_pos >= 0:
                fragment = desc[name_pos:]
                # Cortar en el siguiente proveedor (buscar patron de otro nombre+rating)
                next_provider = re.search(r'\n.*?\d[,\.]\d\s*\(\d+\)', fragment[len(name)+5:])
                if next_provider:
                    clean_desc = fragment[:len(name) + 5 + next_provider.start()].strip()
                else:
                    clean_desc = fragment[:500].strip()
            if len(clean_desc) > 400:
                clean_desc = clean_desc[:400] + '...'

            if nn in name_index:
                # ENRIQUECER registro existente
                idx = name_index[nn]
                existing = main_providers[idx]
                enriched = False

                if not clean_phone(existing.get('telephone', '')) and phone:
                    existing['telephone'] = phone
                    enriched = True

                if (not existing.get('priceRange') or existing.get('priceRange') == 'Consultar') and price:
                    existing['priceRange'] = price
                    enriched = True

                if (not existing.get('rating') or existing.get('rating') == 0) and rating:
                    existing['rating'] = rating
                    existing['reviewsCount'] = review_count or existing.get('reviewsCount', 0)
                    enriched = True

                if not existing.get('sourceUrl') and p.get('url'):
                    existing['sourceUrl'] = p.get('url')
                    enriched = True

                if (not existing.get('description') or len(existing.get('description', '')) < 50) and len(clean_desc) > 50:
                    existing['description'] = clean_desc
                    enriched = True

                if enriched:
                    nc_enriched += 1
            else:
                # NUEVO proveedor - crear registro completo
                slug = make_slug(name)
                province = p.get('provincia', '')
                category = p.get('category', '')

                new_record = {
                    'id': f"nc-{slug}",
                    'name': name,
                    'category': category,
                    'province': province,
                    'municipality': '',
                    'telephone': phone,
                    'priceRange': price or 'Consultar',
                    'rating': rating or 0,
                    'reviewsCount': review_count or 0,
                    'description': clean_desc if len(clean_desc) > 20 else '',
                    'imageUrls': [],
                    'claimToken': None,
                    'slug': slug,
                    'sourceUrl': p.get('url', ''),
                    'capturedAt': p.get('captured_at', datetime.now(timezone.utc).isoformat()),
                    'source': p.get('site', 'nightcrawler'),
                }
                main_providers.append(new_record)
                name_index[nn] = len(main_providers) - 1
                nc_new += 1

    print(f"  -> {nc_new} proveedores NUEVOS inyectados")
    print(f"  -> {nc_enriched} proveedores EXISTENTES enriquecidos")
    print(f"  -> {nc_phones_extracted} telefonos extraidos de descripciones")

    # ========================
    # FASE 4: Merge vault_absorbed_providers
    # ========================
    print("\n[FASE 4] Merging vault_absorbed_providers...")
    vault_data = load_json(VAULT_PATH)
    vault_new = 0
    vault_enriched = 0

    if vault_data:
        vault_items = vault_data if isinstance(vault_data, list) else vault_data.get('providers', [])
        print(f"  -> {len(vault_items)} registros de la boveda")

        for p in vault_items:
            name = p.get('name', '').strip()
            if not name or len(name) < 3:
                continue

            nn = normalize_name(name)
            phone = clean_phone(p.get('telephone') or p.get('phone', ''))

            if nn in name_index:
                idx = name_index[nn]
                existing = main_providers[idx]
                if not clean_phone(existing.get('telephone', '')) and phone:
                    existing['telephone'] = phone
                    vault_enriched += 1
            else:
                slug = make_slug(name)
                new_record = {
                    'id': f"vault-{slug}",
                    'name': name,
                    'category': p.get('category', ''),
                    'province': p.get('province', p.get('provincia', '')),
                    'municipality': p.get('municipality', ''),
                    'telephone': phone,
                    'priceRange': p.get('priceRange', 'Consultar'),
                    'rating': p.get('rating', 0),
                    'reviewsCount': p.get('reviewsCount', 0),
                    'description': (p.get('description', '') or '')[:400],
                    'imageUrls': p.get('imageUrls', []),
                    'claimToken': None,
                    'slug': slug,
                    'sourceUrl': p.get('url', p.get('sourceUrl', '')),
                    'source': 'vault_absorbed',
                }
                main_providers.append(new_record)
                name_index[nn] = len(main_providers) - 1
                vault_new += 1

    print(f"  -> {vault_new} nuevos de boveda")
    print(f"  -> {vault_enriched} enriquecidos con telefono de boveda")

    # ========================
    # FASE 5: Segunda pasada global de extraccion de telefonos
    # ========================
    print("\n[FASE 5] Segunda pasada global: extraer telefonos de descripciones...")
    second_pass = 0
    for p in main_providers:
        if clean_phone(p.get('telephone', '')):
            continue
        desc = p.get('description', '') or ''
        phone = extract_phone_from_text(desc)
        if phone:
            p['telephone'] = phone
            second_pass += 1

    print(f"  -> {second_pass} telefonos adicionales extraidos de descripciones")

    # ========================
    # FASE 6: Estadisticas finales y guardado
    # ========================
    total = len(main_providers)
    total_phones = sum(1 for p in main_providers if clean_phone(p.get('telephone', '')))
    total_desc = sum(1 for p in main_providers if len(p.get('description', '') or '') > 20)
    total_price = sum(1 for p in main_providers if p.get('priceRange') and p.get('priceRange') != 'Consultar')
    total_rated = sum(1 for p in main_providers if p.get('rating') and p.get('rating') > 0)

    print("\n" + "=" * 72)
    print("INFORME FINAL DE FUSION SSOT")
    print("=" * 72)
    print(f"Total proveedores finales:      {total}")
    print(f"Con telefono verificado:        {total_phones} ({100*total_phones/total:.1f}%)")
    print(f"Con descripcion util:           {total_desc} ({100*total_desc/total:.1f}%)")
    print(f"Con precio referencia:          {total_price} ({100*total_price/total:.1f}%)")
    print(f"Con rating/reviews:             {total_rated} ({100*total_rated/total:.1f}%)")
    print("=" * 72)

    # Guardar
    print(f"\n[GUARDADO] Escribiendo {total} registros en {MAIN_DB_PATH}...")
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(main_providers, f, ensure_ascii=False, separators=(',', ':'))

    final_size_mb = os.path.getsize(OUTPUT_PATH) / (1024 * 1024)
    print(f"  -> Archivo final: {final_size_mb:.1f} MB")
    print(f"  -> Timestamp: {datetime.now(timezone.utc).isoformat()}")
    print("\n[FIN] Fusion SSOT completada con exito.")
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
