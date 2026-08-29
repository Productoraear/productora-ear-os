#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
═══════════════════════════════════════════════════════════════════════════════
  🧠 EAR OS V2 — MOTOR DE DESTILACIÓN COGNITIVA Y CUARENTENA CON TTL 1 AÑO
═══════════════════════════════════════════════════════════════════════════════
Estrategia en 3 Capas:
  Capa 1: Fusión y Deduplicación Canónica en RAG (Nodos Maestros de Alta Densidad).
  Capa 2: Blindaje de Activos Intangibles (Ideas Creativas/Bocetos -> BOVEDA_ETERNA_INTANGIBLES).
  Capa 3: Traslado de Crudos a Cuarentena con TTL 365 Días ([EXP_2027-08-29]).
"""

import os
import re
import sys
import json
import time
import shutil
import hashlib
from datetime import datetime

if hasattr(sys.stdout, "reconfigure"):
    try: sys.stdout.reconfigure(encoding="utf-8")
    except Exception: pass
if hasattr(sys.stderr, "reconfigure"):
    try: sys.stderr.reconfigure(encoding="utf-8")
    except Exception: pass

VAULT_BASE = r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT"
INTANGIBLES_VAULT = os.path.join(VAULT_BASE, "BOVEDA_ETERNA_INTANGIBLES")
QUARANTINE_BASE = r"H:\00_PRODUCTORA_EAR\BODEGA_CUARENTENA_1_ANO"
EXPIRATION_DATE = "2027-08-29"

RAG_DB_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\ear-rag-database.json"
QUARANTINE_MANIFEST = r"H:\EAR_OS_V2\EAR_OS_V2\scripts\.quarantine_manifest.json"
ARCHIVED_MANIFEST = r"H:\EAR_OS_V2\EAR_OS_V2\scripts\.archived_manifest.json"
PROCESSED_HASHES = r"H:\EAR_OS_V2\EAR_OS_V2\scripts\.processed_hashes.json"
REGISTRY_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\scripts\registry.json"

CATEGORIES = [
    "MARIACHIS_Y_REPERTORIO",
    "VIMUME_NEUROCIENCIA",
    "PRODUCCION_Y_RIDERS",
    "LEGAL_Y_CONTRATOS",
    "STORYSELLING_Y_PRECIOS",
    "MERCADO_Y_SEO_MARIACHIS"
]

# Palabras clave de ideas humanas e intangibles no destructibles
INTANGIBLE_KEYWORDS = [
    "poema", "poesia", "letra", "cancion", "acordes", "partitura", "boceto",
    "manifiesto", "reflexion", "edwin agudelo", "charro", "guitarrón", "vihuela",
    "historia personal", "carta de intenciones", "filosofia", "dnda", "obra"
]

def sanitize_filename(name, max_len=80):
    base, ext = os.path.splitext(name)
    clean_base = re.sub(r'[<>:"/\\|?*\n\r\t]', '_', base)[:max_len].strip(' ._')
    return f"{clean_base or 'doc'}{ext}"

def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def is_intangible(filename, content_sample=""):
    combined = f"{filename} {content_sample}".lower()
    return any(k in combined for k in INTANGIBLE_KEYWORDS)

def save_json_safe(path, data, max_retries=5):
    for attempt in range(max_retries):
        try:
            tmp = path + f".tmp_{os.getpid()}"
            with open(tmp, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            if os.path.exists(path):
                try:
                    os.replace(tmp, path)
                except OSError:
                    shutil.copy2(tmp, path)
                    try: os.remove(tmp)
                    except: pass
            else:
                shutil.move(tmp, path)
            return True
        except Exception as e:
            time.sleep(0.5 * (attempt + 1))
    return False

def extract_text_sample(filepath):
    ext = os.path.splitext(filepath)[1].lower()
    sample = ""
    try:
        if ext in ['.txt', '.md', '.json', '.csv', '.html', '.htm']:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                sample = f.read(2000)
        elif ext == '.pdf':
            try:
                import fitz
                doc = fitz.open(filepath)
                sample = " ".join([page.get_text() for page in doc[:2]])
                doc.close()
            except:
                sample = os.path.basename(filepath)
        else:
            sample = os.path.basename(filepath)
    except:
        sample = os.path.basename(filepath)
    return re.sub(r'\s+', ' ', sample)[:500].strip()

def run_distillation():
    print("╔" + "═" * 78 + "╗")
    print("  🧠 EAR OS V2 — MOTOR DE DESTILACIÓN COGNITIVA Y CUARENTENA 365 DÍAS")
    print("╚" + "═" * 78 + "╝")

    os.makedirs(INTANGIBLES_VAULT, exist_ok=True)
    today_str = datetime.now().strftime("%Y-%m-%d")
    quarantine_today_dir = os.path.join(QUARANTINE_BASE, f"[EXP_{EXPIRATION_DATE}]")
    os.makedirs(quarantine_today_dir, exist_ok=True)

    # 1. Cargar RAG y Manifiestos
    rag_docs = []
    if os.path.exists(RAG_DB_PATH):
        try:
            with open(RAG_DB_PATH, 'r', encoding='utf-8') as f:
                raw = json.load(f)
                rag_docs = raw if isinstance(raw, list) else raw.get("documents", [])
        except:
            rag_docs = []

    existing_rag_ids = {doc.get("id") for doc in rag_docs if isinstance(doc, dict)}

    quarantine_records = []
    if os.path.exists(QUARANTINE_MANIFEST):
        try:
            with open(QUARANTINE_MANIFEST, 'r', encoding='utf-8') as f:
                quarantine_records = json.load(f)
        except:
            quarantine_records = []

    stats = {
        "total_archivos_examinados": 0,
        "intangibles_blindados": 0,
        "borradores_y_temporales_detectados": 0,
        "nodos_canonicos_enriquecidos": 0,
        "archivos_movidos_a_cuarentena": 0
    }

    # 2. Recorrer la Bóveda por Categorías
    for category in CATEGORIES:
        cat_dir = os.path.join(VAULT_BASE, category)
        if not os.path.isdir(cat_dir):
            continue

        files = [f for f in os.listdir(cat_dir) if os.path.isfile(os.path.join(cat_dir, f))]
        stats["total_archivos_examinados"] += len(files)
        print(f"\n>> Destilando Categoría: {category} ({len(files)} archivos)...")

        # Agrupación por Stems / Clusters
        clusters = {}
        for filename in files:
            filepath = os.path.join(cat_dir, filename)
            
            # Normalizar stem para encontrar versiones (ej: ~$doc, doc_v1, doc (1))
            clean_stem = re.sub(r'^\[\d{4}-\d{2}-\d{2}\]_', '', filename)
            clean_stem = re.sub(r'^(~\$|\.\_)', '', clean_stem)
            clean_stem = re.sub(r'(_v\d+|\(\d+\)|\.bak|\.tmp)', '', clean_stem, flags=re.IGNORECASE)
            stem_key = clean_stem[:40].lower().strip()

            if stem_key not in clusters:
                clusters[stem_key] = []
            clusters[stem_key].append((filename, filepath))

        # Procesar Clusters
        for stem_key, cluster_files in clusters.items():
            # Ordenar por tamaño y completitud
            cluster_files.sort(key=lambda x: os.path.getsize(x[1]) if os.path.exists(x[1]) else 0, reverse=True)
            master_file, master_path = cluster_files[0]
            
            content_sample = extract_text_sample(master_path)
            
            # Capa 2: ¿Es un Activo Intangible / Idea Creativa / Poesía / Filosofía?
            if is_intangible(master_file, content_sample):
                stats["intangibles_blindados"] += 1
                sanctuary_dest = os.path.join(INTANGIBLES_VAULT, sanitize_filename(master_file))
                try:
                    if not os.path.exists(sanctuary_dest):
                        shutil.copy2(master_path, sanctuary_dest)
                except Exception as e:
                    pass

                # Inyectar nodo intangible blindado en RAG
                sha = compute_sha256(master_path) if os.path.exists(master_path) else "sha_intangible"
                node_id = f"RAG-INTANGIBLE-INMUTABLE-{sha[:10].upper()}"
                if node_id not in existing_rag_ids:
                    node = {
                        "id": node_id,
                        "tipo": "ACTIVO_INTANGIBLE_INMUTABLE",
                        "categoria": category,
                        "titulo": f"💎 [LEGADO HUMANO] {sanitize_filename(master_file)}",
                        "resumen_semantico": content_sample,
                        "boveda_santuario": sanctuary_dest,
                        "sha256": sha,
                        "estado": "INMUNE_A_PURGA_365D",
                        "fecha_blindaje": today_str
                    }
                    rag_docs.append(node)
                    existing_rag_ids.add(node_id)
                    stats["nodos_canonicos_enriquecidos"] += 1

            # Capa 1: Fusión Canónica en RAG del documento maestro
            else:
                sha = compute_sha256(master_path) if os.path.exists(master_path) else "sha_canonico"
                node_id = f"RAG-CANONICO-{category[:8]}-{sha[:10].upper()}"
                if node_id not in existing_rag_ids:
                    node = {
                        "id": node_id,
                        "tipo": "NODO_CANONICO_DESTILADO",
                        "categoria": category,
                        "titulo": f"⚡ [CANÓNICO] {sanitize_filename(master_file)}",
                        "resumen_semantico": content_sample,
                        "archivos_fusionados_en_cluster": len(cluster_files),
                        "sha256": sha,
                        "fecha_destilacion": today_str
                    }
                    rag_docs.append(node)
                    existing_rag_ids.add(node_id)
                    stats["nodos_canonicos_enriquecidos"] += 1

            # Capa 3: Si hay versiones redundantes, temporales o borradores en el cluster, mover a Cuarentena
            if len(cluster_files) > 1:
                stats["borradores_y_temporales_detectados"] += len(cluster_files) - 1
                for sub_file, sub_path in cluster_files[1:]:
                    if not os.path.exists(sub_path):
                        continue
                    
                    cat_quarantine_dir = os.path.join(quarantine_today_dir, category)
                    os.makedirs(cat_quarantine_dir, exist_ok=True)
                    quarantine_dest = os.path.join(cat_quarantine_dir, sanitize_filename(sub_file))

                    try:
                        shutil.copy2(sub_path, quarantine_dest)
                        try: os.remove(sub_path)
                        except: pass
                        
                        quarantine_records.append({
                            "original_file": sub_file,
                            "original_path": sub_path,
                            "quarantine_path": quarantine_dest,
                            "category": category,
                            "master_reference": master_file,
                            "quarantined_at": today_str,
                            "expires_at": EXPIRATION_DATE,
                            "ttl_days": 365,
                            "status": "EN_CUARENTENA_AUDITADA"
                        })
                        stats["archivos_movidos_a_cuarentena"] += 1
                    except Exception as e:
                        pass

    # 3. Guardar RAG y Manifiesto de Cuarentena
    save_json_safe(RAG_DB_PATH, rag_docs)
    save_json_safe(QUARANTINE_MANIFEST, quarantine_records)

    # 4. Registrar la herramienta en registry.json
    registry_data = {"tools": []}
    if os.path.exists(REGISTRY_PATH):
        try:
            with open(REGISTRY_PATH, 'r', encoding='utf-8') as f:
                registry_data = json.load(f)
        except: pass

    tools_list = registry_data.get("tools", [])
    if not any(t.get("name") == "semantic_distiller_and_quarantine.py" for t in tools_list):
        tools_list.append({
            "name": "semantic_distiller_and_quarantine.py",
            "path": "scripts/semantic_distiller_and_quarantine.py",
            "purpose": "Destilador cognitivo de 3 capas: fusión canónica en RAG, santuario de intangibles y bodega de cuarentena con TTL 365 días.",
            "inputs": "H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\",
            "outputs": "src/data/ear-rag-database.json + scripts/.quarantine_manifest.json + H:\\00_PRODUCTORA_EAR\\BODEGA_CUARENTENA_1_ANO\\",
            "cli": "python scripts/semantic_distiller_and_quarantine.py"
        })
        registry_data["tools"] = tools_list
        save_json_safe(REGISTRY_PATH, registry_data)

    print("\n" + "=" * 80)
    print("📊 INFORME FINAL DE DESTILACIÓN Y CUARENTENA COGNITIVA:")
    print("=" * 80)
    print(f"• Total Archivos Examinados          : {stats['total_archivos_examinados']}")
    print(f"• Activos Intangibles Blindados (💎) : {stats['intangibles_blindados']} (En BOVEDA_ETERNA_INTANGIBLES)")
    print(f"• Borradores/Duplicados Detectados  : {stats['borradores_y_temporales_detectados']}")
    print(f"• Archivos Reubicados en Cuarentena : {stats['archivos_movidos_a_cuarentena']} (Vence: {EXPIRATION_DATE})")
    print(f"• Nodos RAG Canónicos Enriquecidos  : {stats['nodos_canonicos_enriquecidos']}")
    print(f"• Total Nodos RAG Acumulados        : {len(rag_docs)}")
    print(f"• Manifiesto de Cuarentena Auditada : {QUARANTINE_MANIFEST}")
    print("=" * 80)
    print("🏁 DESTILACIÓN COGNITIVA COMPLETADA — EL CEREBRO ESTÁ PURO Y BLINDADO\n")

if __name__ == "__main__":
    run_distillation()
