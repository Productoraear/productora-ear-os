#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANTIGRAVITY OMEGA v4.1 — INGESTA DE LEADS INSTITUCIONALES FITUR 2026 (IFEMA)
=============================================================================
Objetivo:
  Transformar el catálogo de 967 expositores de FITUR 2026 (IFEMA Madrid)
  en leads de alta cualificación B2G / Institucionales para el programa:
  "Embajadores Culturales de Municipios y Regiones", dirigido por Edwin Agudelo.

Fuentes:
  1. D:\\EAR_VAULT\\VAMPIRIZADO_POR_GEMINI\\FITUR_2026_Expositores_EAR.json
  2. Bóveda local y enriquecimiento con entidades públicas y patronatos

Salida:
  src/data/b2g/fitur_institutional_leads.json
"""
import json
import os
import re
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

BASE_DIR = Path(__file__).resolve().parent.parent
FITUR_SOURCE = Path(r"D:\EAR_VAULT\VAMPIRIZADO_POR_GEMINI\FITUR_2026_Expositores_EAR.json")
OUTPUT_PATH = BASE_DIR / "src" / "data" / "b2g" / "fitur_institutional_leads.json"

# Garantizar existencia de directorio de salida
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

# Palabras clave para segmentación B2G / Embajadores Culturales
B2G_TERMS = [
    "institucional", "turismo", "patronato", "ayuntamiento", "diputacion",
    "gobierno", "concejalia", "ministerio", "comunidad", "consell",
    "xunta", "junta", "generalitat", "cabildo", "embajada", "consulado",
    "delegacion", "promocion", "unwto", "spain", "españa"
]

def normalize_text(text: str) -> str:
    if not text:
        return ""
    text = unicodedata.normalize('NFD', text.lower())
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
    return re.sub(r'\s+', ' ', text).strip()

def classify_lead_tier(item: Dict[str, Any]) -> Dict[str, Any]:
    empresa = item.get("empresa", "")
    sector = item.get("sector", "")
    pais = item.get("pais_region", "")
    valor = item.get("valor_ear", "")

    combined = normalize_text(f"{empresa} {sector} {pais} {valor}")

    is_b2g = any(term in combined for term in B2G_TERMS) or sector == "Institucional"

    if is_b2g:
        program = "EMBAJADORES_CULTURALES_B2G"
        pitch = "Formación y acreditación de artistas locales como Embajadores Culturales para galas y ferias internacionales (Dirección Artística: Edwin Agudelo, +34 años de trayectoria escénica) bajo Contrato Menor Art. 118 LCSP (< 15.000 €)."
        target_budget = 14250.0  # Ajuste preventivo 95% techo LCSP
        priority = "P0_ALTA_PRIORIDAD"
    elif sector in ["Lujo", "Cruceros", "MICE"]:
        program = "MICE_LUXURY_SHOWCASE"
        pitch = "Producción escénica acústica premium (Bose F1 12 W/pax) y repertorio de conservatorio/solista para cócteles y eventos corporativos exclusivos."
        target_budget = 3500.0
        priority = "P1_VIP_CORPORATIVO"
    else:
        program = "BOOKING_DESTINO_INTERNACIONAL"
        pitch = "Contratación de espectáculos y música en directo para eventos de destino y semanas culturales."
        target_budget = 1500.0
        priority = "P2_GENERAL"

    return {
        "is_b2g": is_b2g,
        "program": program,
        "pitch": pitch,
        "target_budget": target_budget,
        "priority": priority
    }

def main():
    print("=" * 72)
    print("ANTIGRAVITY OMEGA v4.1 — INGESTA DE LEADS FITUR 2026 (IFEMA MADRID)")
    print("=" * 72)

    if not FITUR_SOURCE.exists():
        print(f"[FATAL] Archivo no encontrado en: {FITUR_SOURCE}")
        return 1

    with open(FITUR_SOURCE, "r", encoding="utf-8", errors="replace") as f:
        raw_leads = json.load(f)

    print(f"[CARGA] {len(raw_leads)} expositores leídos de {FITUR_SOURCE.name}")

    enriched_leads: List[Dict[str, Any]] = []
    b2g_count = 0
    luxury_count = 0

    for idx, item in enumerate(raw_leads, start=1):
        empresa = item.get("empresa", "").strip()
        if not empresa:
            continue

        classification = classify_lead_tier(item)
        if classification["is_b2g"]:
            b2g_count += 1
        elif classification["priority"] == "P1_VIP_CORPORATIVO":
            luxury_count += 1

        lead_record = {
            "lead_id": f"FITUR26-{idx:04d}",
            "entity_name": empresa,
            "sector": item.get("sector", "Turismo General"),
            "country_region": item.get("pais_region", "Internacional"),
            "ifema_stand": item.get("stand", "Pabellón IFEMA"),
            "contact_person": item.get("contacto", "Responsable de Delegación"),
            "valor_original_ear": item.get("valor_ear", "Estándar"),
            "lead_segment": classification["program"],
            "target_opportunity_budget": classification["target_budget"],
            "priority": classification["priority"],
            "commercial_pitch": classification["pitch"],
            "mentor_in_charge": "Edwin Agudelo (+34 años de trayectoria escénica y producción en directo)",
            "acoustic_rider": "Sistemas Bose F1 812 / S1 Pro (12 W/pax) + Microfonía Shure Axient/Beta 87A",
            "regulatory_framework": "Contrato Menor de Servicios Culturales (Art. 118 LCSP < 15.000 €)",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "source": "FITUR_2026_IFEMA_OFFICIAL_CATALOG"
        }
        enriched_leads.append(lead_record)

    # Ordenar por prioridad (P0 primero, luego P1, luego P2)
    enriched_leads.sort(key=lambda x: (0 if x["priority"] == "P0_ALTA_PRIORIDAD" else 1 if x["priority"] == "P1_VIP_CORPORATIVO" else 2))

    # Guardar en JSON SSOT
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(enriched_leads, f, ensure_ascii=False, indent=2)

    sz_kb = os.path.getsize(OUTPUT_PATH) / 1024

    print(f"\n[ÉXITO] Ingesta y normalización completada:")
    print(f"  -> Total Leads Procesados:    {len(enriched_leads)}")
    print(f"  -> Leads Institucionales B2G: {b2g_count} (Embajadores Culturales / LCSP)")
    print(f"  -> Leads MICE y Lujo S-Class: {luxury_count} (Cruceros, MICE y Corporativo)")
    print(f"  -> Archivo Destino:           {OUTPUT_PATH} ({sz_kb:.1f} KB)")
    print(f"  -> Techo LCSP Asignado:       14.250,00 € preventivo por expediente")
    print("=" * 72)
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
