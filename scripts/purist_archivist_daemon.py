import os
import sys
import json
import re
import datetime
import hashlib
import shutil
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

VAULT_BASE = r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT"
MANIFEST_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\scripts\.archived_manifest.json"
NODES_OBSIDIAN_DIR = r"H:\EAR_OS_V2\EAR_OS_V2\docs\vault_nodes"
RAW_FILE = r"H:\EAR_OS_V2\EAR_OS_V2\scratch\forensic_mindmaps_raw.json"
TAXONOMY_FILE = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\ear-30-level-taxonomy.json"

LEVEL_MAPPING = {
    'vimume': ('L20_IMPACTO_SOCIAL_VIMUME', 'VIMUME_TERAPIA'),
    'alzheimer': ('L20_IMPACTO_SOCIAL_VIMUME', 'VIMUME_TERAPIA'),
    'memoria': ('L20_IMPACTO_SOCIAL_VIMUME', 'VIMUME_TERAPIA'),
    'mariachi': ('L4_LINEA_SERVICIO', 'MARIACHI_GALA'),
    'edwin': ('L6_PRODUCTO_HOMOLOGADO', 'EDWIN_AGUDELO'),
    'solista': ('L6_PRODUCTO_HOMOLOGADO', 'EDWIN_SOLISTA'),
    'boda': ('L3_VERTICAL_MERCADO', 'BODAS_ELITE'),
    'corporativo': ('L3_VERTICAL_MERCADO', 'CORPORATIVO'),
    'ayuntamiento': ('L3_VERTICAL_MERCADO', 'B2G_AYUNTAMIENTOS'),
    'pleno': ('L3_VERTICAL_MERCADO', 'B2G_AYUNTAMIENTOS'),
    'licitacion': ('L23_FINANCIACION_PUBLICA', 'LICITACIONES_LCSP'),
    'rider': ('L8_ARQUITECTURA_RIDER', 'RIDERS_HARDWARE'),
    'bose': ('L7_VARIANTE_CONFIGURACION', 'SONIDO_BOSE'),
    'tarifa': ('L16_MODELO_PRICING_LOCK', 'PRICING_TARIFAS'),
    'precio': ('L16_MODELO_PRICING_LOCK', 'PRICING_TARIFAS'),
    'presupuesto': ('L16_MODELO_PRICING_LOCK', 'PRICING_TARIFAS'),
    'sgae': ('L2_MACRO_DOMINIO', 'FINTECH_SGAE'),
    'cue': ('L4_LINEA_SERVICIO', 'CUE_BRIDGE')
}

def clean_filename(name):
    # Sanitize filename
    clean = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', name)
    clean = re.sub(r'_+', '_', clean)
    return clean

def classify_entry(entry):
    name = entry.get('name', '').lower()
    preview = entry.get('preview', '').lower()
    combined = f"{name} {preview}"
    
    assigned_level = 'L1_ECOSISTEMA_ROOT'
    assigned_category = 'GENERAL'
    
    for kw, (lvl, cat) in LEVEL_MAPPING.items():
        if kw in combined:
            assigned_level = lvl
            assigned_category = cat
            break
            
    return assigned_level, assigned_category

def run_archivist():
    print("🏛️ Iniciando Daemon del Archivista Purista...")
    os.makedirs(VAULT_BASE, exist_ok=True)
    os.makedirs(NODES_OBSIDIAN_DIR, exist_ok=True)
    
    manifest = {}
    if os.path.exists(MANIFEST_PATH):
        try:
            with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
                loaded = json.load(f)
                if isinstance(loaded, dict):
                    manifest = loaded
                elif isinstance(loaded, list):
                    manifest = {m.get('sha256', str(i)): m for i, m in enumerate(loaded) if isinstance(m, dict)}
        except Exception:
            manifest = {}
            
    processed_hashes = set(manifest.keys())
    
    if not os.path.exists(RAW_FILE):
        print("Archivo raw no encontrado.")
        return
        
    with open(RAW_FILE, 'r', encoding='utf-8', errors='ignore') as f:
        entries = json.load(f)
        
    print(f"Procesando {len(entries)} archivos detectados...")
    today_str = datetime.datetime.now().strftime("%Y%m%d")
    
    moved_count = 0
    node_cards_created = 0
    
    for entry in entries:
        orig_path = entry.get('path')
        sha = entry.get('sha256')
        orig_name = entry.get('name')
        ext = entry.get('ext')
        
        if not orig_path or not os.path.exists(orig_path):
            continue
        if sha in processed_hashes:
            continue
            
        level, category = classify_entry(entry)
        
        # Don't move files that are active workspace code in H:\EAR_OS_V2\EAR_OS_V2\src
        if "EAR_OS_V2\\src" in orig_path or "EAR_OS_V2\\scripts" in orig_path or "EAR_OS_V2\\docs" in orig_path:
            continue
            
        target_dir = os.path.join(VAULT_BASE, level, category)
        os.makedirs(target_dir, exist_ok=True)
        
        clean_name = clean_filename(orig_name)
        new_filename = f"{today_str}_{level}_{clean_name}"
        if not new_filename.lower().endswith(ext.lower()):
            new_filename += ext
            
        new_path = os.path.join(target_dir, new_filename)
        
        # Create Obsidian lightweight Node Card with wikilinks
        node_card_name = f"NODE_{clean_filename(os.path.splitext(orig_name)[0])}.md"
        node_card_path = os.path.join(NODES_OBSIDIAN_DIR, node_card_name)
        
        card_content = f"""---
title: "{orig_name}"
level: "{level}"
category: "{category}"
sha256: "{sha}"
archived_date: "{datetime.datetime.now().isoformat()}"
original_path: "{orig_path}"
vault_path: "{new_path}"
tags:
  - ear-os/vault
  - level/{level.lower()}
  - category/{category.lower()}
---

# 📜 {orig_name}

- **Nivel Ontológico:** [[{level}]]
- **Categoría Maestro:** [[{category}]]
- **Hash SHA-256:** `{sha}`
- **Ubicación Bóveda:** `{new_path}`

## 🔍 Resumen Semántico
{entry.get('preview', '')[:800]}

## 🔗 Relaciones Bidireccionales
- Relacionado con: [[EAR_OS_UNIFIED_KNOWLEDGE_GRAPH]]
- Ecosistema: [[Productora EAR]]
- Módulo: [[{level}]]
"""
        with open(node_card_path, 'w', encoding='utf-8') as f:
            f.write(card_content)
            
        manifest[sha] = {
            'original_path': orig_path,
            'vault_path': new_path,
            'node_card': node_card_path,
            'sha256': sha,
            'level': level,
            'category': category,
            'timestamp': datetime.datetime.now().isoformat(),
            'status': 'ARCHIVED'
        }
        processed_hashes.add(sha)
        moved_count += 1
        node_cards_created += 1
        
        if moved_count >= 150: # Process in batches of 150 to keep it ultra fast
            break
            
    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
        
    print(f"✅ Bote procesado: {moved_count} archivos catalogados, {node_cards_created} fichas Obsidian generadas en docs/vault_nodes/.")

if __name__ == '__main__':
    run_archivist()
