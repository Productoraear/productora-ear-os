import os
import sys
import zipfile
import csv
import json
import hashlib
import shutil
from datetime import datetime

TARGET_FILES = [
    r"H:\bulk_alsoasked_queries.csv",
    r"H:\CATALOGO luces de Navidad Demetrio 2025 _compressed.pdf",
    r"H:\https___www.productoraear.com_-Performance-on-Search-2026-08-24 (1).zip",
    r"H:\https___www.productoraear.com_-Performance-on-Search-2026-08-24.zip",
    r"H:\https___www.productoraear.com_-Performance-on-Search-2026-08-25.zip",
    r"H:\https___www.productoraear.com_-Performance-on-Search-2026-08-26.zip",
    r"H:\alsoasked-bodas-y-eventos-en-directo-mariachis-protocolo-musical-canciones-para-banquetes-sorpresas-para-novios-precios-y-presupuesto-alquiler-de-espacios-coordinacion-de-eventos-sonido-catering-repertorio-p.csv",
    r"H:\alsoasked-musicoterapia-para-mayores-envejecimiento-activo-alzheimer-estimulacion-cognitiva-o-talleres-en-residencias-es-es-madrid-community-of-madrid.csv"
]

VAULT_BASE = r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\MERCADO_Y_SEO_MARIACHIS"
RAG_DB_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\ear-rag-database.json"
TELEMETRY_GSC = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\telemetry\gsc-performance-data.json"
MANIFEST_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\scripts\.archived_manifest.json"
PROCESSED_HASHES_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\scripts\.processed_hashes.json"
EXTRACT_TEMP = r"H:\EAR_OS_V2\EAR_OS_V2\g s console\extracted_batch"

os.makedirs(VAULT_BASE, exist_ok=True)
os.makedirs(EXTRACT_TEMP, exist_ok=True)
os.makedirs(os.path.dirname(TELEMETRY_GSC), exist_ok=True)

def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def parse_num(v):
    if not v: return 0.0
    v = str(v).replace('%', '').replace(',', '.').strip()
    try:
        return float(v)
    except:
        return 0.0

def ingest_batch():
    today_str = datetime.now().strftime("%Y-%m-%d")
    
    # Load manifest and hashes
    manifest = []
    if os.path.exists(MANIFEST_PATH):
        try:
            with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
                manifest_data = json.load(f)
                if isinstance(manifest_data, list):
                    manifest = manifest_data
                else:
                    manifest = list(manifest_data.values())
        except: manifest = []

    hashes = {}
    if os.path.exists(PROCESSED_HASHES_PATH):
        try:
            with open(PROCESSED_HASHES_PATH, 'r', encoding='utf-8') as f:
                hashes_data = json.load(f)
                if isinstance(hashes_data, dict):
                    hashes = hashes_data
                elif isinstance(hashes_data, list):
                    hashes = {item.get('sha256'): item for item in hashes_data if isinstance(item, dict)}
        except: hashes = {}

    # Load RAG
    rag_docs = []
    is_list_rag = True
    raw_rag = None
    if os.path.exists(RAG_DB_PATH):
        try:
            with open(RAG_DB_PATH, 'r', encoding='utf-8') as f:
                raw_rag = json.load(f)
                if isinstance(raw_rag, list):
                    rag_docs = raw_rag
                    is_list_rag = True
                else:
                    rag_docs = raw_rag.get("documents", [])
                    is_list_rag = False
        except:
            rag_docs = []
    
    rag_ids = {doc.get("id") for doc in rag_docs if isinstance(doc, dict)}

    queries_agg = {}
    pages_agg = {}
    alsoasked_mariachis = []
    alsoasked_vimume = []
    alsoasked_bulk = []
    demetrio_items = []

    files_found = 0
    relocated_count = 0

    for filepath in TARGET_FILES:
        if not os.path.exists(filepath):
            print(f"[SKIP/NOT_FOUND] {filepath}")
            continue
        
        files_found += 1
        sha = compute_sha256(filepath)
        filename = os.path.basename(filepath)
        ext = os.path.splitext(filename)[1].lower()
        file_size = os.path.getsize(filepath)

        print(f"[PROCESSING] {filename} ({round(file_size/1024, 1)} KB)...")

        # 1. Handle GSC Zips
        if ext == '.zip':
            try:
                with zipfile.ZipFile(filepath, 'r') as z:
                    for member in z.namelist():
                        z.extract(member, EXTRACT_TEMP)
                        csv_path = os.path.join(EXTRACT_TEMP, member)
                        if not member.lower().endswith('.csv') or not os.path.isfile(csv_path):
                            continue
                        
                        with open(csv_path, 'r', encoding='utf-8', errors='replace') as f:
                            reader = csv.reader(f)
                            header = next(reader, None)
                            if not header: continue
                            header = [h.strip().lower() for h in header]
                            
                            is_queries = any('consulta' in h or 'query' in h for h in header)
                            is_pages = any('página' in h or 'pagina' in h or 'page' in h for h in header)

                            for row in reader:
                                if not row or len(row) < 4: continue
                                name = row[0].strip()
                                clicks = parse_num(row[1]) if len(row) > 1 else 0
                                impressions = parse_num(row[2]) if len(row) > 2 else 0
                                pos = parse_num(row[4]) if len(row) > 4 else 0

                                if is_queries and not is_pages:
                                    if name not in queries_agg:
                                        queries_agg[name] = {'clicks': 0, 'impressions': 0, 'positions': []}
                                    queries_agg[name]['clicks'] += clicks
                                    queries_agg[name]['impressions'] += impressions
                                    queries_agg[name]['positions'].append(pos)
                                elif is_pages:
                                    if name not in pages_agg:
                                        pages_agg[name] = {'clicks': 0, 'impressions': 0, 'positions': []}
                                    pages_agg[name]['clicks'] += clicks
                                    pages_agg[name]['impressions'] += impressions
                                    pages_agg[name]['positions'].append(pos)
            except Exception as e:
                print(f"[ERR ZIP] {e}")

        # 2. Handle AlsoAsked CSVs
        elif ext == '.csv':
            try:
                with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
                    reader = csv.reader(f)
                    header = next(reader, None)
                    for row in reader:
                        if not row: continue
                        text_line = " | ".join(row).strip()
                        if not text_line: continue
                        if 'mariachis' in filename.lower() or 'bodas' in filename.lower():
                            alsoasked_mariachis.append(text_line)
                        elif 'musicoterapia' in filename.lower() or 'alzheimer' in filename.lower():
                            alsoasked_vimume.append(text_line)
                        else:
                            alsoasked_bulk.append(text_line)
            except Exception as e:
                print(f"[ERR CSV] {e}")

        # 3. Handle PDF Demetrio
        elif ext == '.pdf':
            try:
                pdf_text = ""
                try:
                    import fitz
                    doc = fitz.open(filepath)
                    for page in doc:
                        pdf_text += page.get_text() + "\n"
                    doc.close()
                except:
                    try:
                        import pypdf
                        reader = pypdf.PdfReader(filepath)
                        for page in reader.pages:
                            pdf_text += page.extract_text() + "\n"
                    except:
                        pdf_text = f"Catalogo Luces Navidad Demetrio 2025 ({file_size} bytes)"

                # Extract key sections
                lines = [l.strip() for l in pdf_text.split('\n') if len(l.strip()) > 3]
                demetrio_items = lines[:200]
            except Exception as e:
                print(f"[ERR PDF] {e}")

        # Reubicación física en Bóveda
        target_path = os.path.join(VAULT_BASE, f"[{today_str}]_{filename}")
        try:
            shutil.copy2(filepath, target_path)
            try:
                os.remove(filepath)
                relocated_msg = "Reubicado y eliminado origen"
            except:
                relocated_msg = "Copiado a bóveda"

            record = {
                "original_path": filepath,
                "vault_path": target_path,
                "category": "MERCADO_Y_SEO_MARIACHIS",
                "sha256": sha,
                "size_bytes": file_size,
                "archived_at": datetime.now().isoformat()
            }
            manifest.append(record)
            hashes[sha] = target_path
            relocated_count += 1
            print(f"[VAULT OK] {filename} -> {relocated_msg}")
        except Exception as e:
            print(f"[ERR REPAIR/MOVE] {e}")

    # Create Synthesized RAG Nodes
    new_nodes_count = 0

    # Node 1: GSC Mariachis & Events Telemetry
    if queries_agg:
        mariachi_queries = [
            {'query': q, 'clicks': d['clicks'], 'impressions': d['impressions'], 'avg_pos': round(sum(d['positions'])/len(d['positions']), 1) if d['positions'] else 0}
            for q, d in queries_agg.items()
            if any(k in q.lower() for k in ['mariachi', 'edwin', 'agudelo', 'boda', 'evento', 'precio', 'madrid', 'toledo'])
        ]
        mariachi_queries.sort(key=lambda x: x['impressions'], reverse=True)
        
        node_id = f"RAG-GSC-MARIACHIS-DOMINANCE-{today_str}"
        if node_id not in rag_ids:
            node = {
                "id": node_id,
                "tipo": "INTELIGENCIA_GSC_SEO",
                "categoria": "DOMINANCIA_MARIACHIS_UBER_CENTRALITA",
                "titulo": "GSC Search Intent & Oportunidades Mariachis 24/7",
                "total_queries_indexadas": len(queries_agg),
                "top_oportunidades_mariachis": mariachi_queries[:40],
                "top_paginas_lideres": sorted([{'page': p, 'impressions': d['impressions'], 'clicks': d['clicks']} for p, d in pages_agg.items()], key=lambda x: x['impressions'], reverse=True)[:25],
                "fecha_extraccion": today_str
            }
            rag_docs.append(node)
            rag_ids.add(node_id)
            new_nodes_count += 1

    # Node 2: AlsoAsked Mariachis & Bodas
    if alsoasked_mariachis:
        node_id = f"RAG-ALSOASKED-MARIACHIS-BODAS-{today_str}"
        if node_id not in rag_ids:
            node = {
                "id": node_id,
                "tipo": "INTELIGENCIA_ALSOASKED_QUESTIONS",
                "categoria": "DOMINANCIA_MARIACHIS_UBER_CENTRALITA",
                "titulo": "Preguntas Frecuentes Reales y Objeciones de Mariachis y Bodas",
                "total_preguntas": len(alsoasked_mariachis),
                "preguntas_clave": alsoasked_mariachis[:80],
                "fecha_extraccion": today_str
            }
            rag_docs.append(node)
            rag_ids.add(node_id)
            new_nodes_count += 1

    # Node 3: AlsoAsked VIMUME
    if alsoasked_vimume:
        node_id = f"RAG-ALSOASKED-VIMUME-RESIDENCIAS-{today_str}"
        if node_id not in rag_ids:
            node = {
                "id": node_id,
                "tipo": "INTELIGENCIA_ALSOASKED_VIMUME",
                "categoria": "VIMUME_TERAPEUTICO_SENIOR",
                "titulo": "AlsoAsked Estimulación Cognitiva y Musicoterapia Residencias Madrid",
                "total_preguntas": len(alsoasked_vimume),
                "preguntas_clave": alsoasked_vimume[:80],
                "fecha_extraccion": today_str
            }
            rag_docs.append(node)
            rag_ids.add(node_id)
            new_nodes_count += 1

    # Node 4: AlsoAsked Bulk
    if alsoasked_bulk:
        node_id = f"RAG-ALSOASKED-BULK-QUERIES-{today_str}"
        if node_id not in rag_ids:
            node = {
                "id": node_id,
                "tipo": "INTELIGENCIA_SEARCH_INTENT_BULK",
                "categoria": "SEO_PROGRAMATICO_GEO",
                "titulo": "AlsoAsked Bulk Queries - Intenciones de Búsqueda de Eventos",
                "total_preguntas": len(alsoasked_bulk),
                "preguntas_muestra": alsoasked_bulk[:60],
                "fecha_extraccion": today_str
            }
            rag_docs.append(node)
            rag_ids.add(node_id)
            new_nodes_count += 1

    # Node 5: Catálogo Luces Demetrio 2025
    if demetrio_items:
        node_id = f"RAG-CATALOGO-DEMETRIO-NAVIDAD-2025-{today_str}"
        if node_id not in rag_ids:
            node = {
                "id": node_id,
                "tipo": "CATALOGO_ILUMINACION_EVENTOS",
                "categoria": "ARSENAL_TECNICO_Y_EQUIPOS",
                "titulo": "Catálogo Luces de Navidad e Iluminación Espectacular Demetrio 2025",
                "total_lineas": len(demetrio_items),
                "resumen_items": demetrio_items[:100],
                "fecha_extraccion": today_str
            }
            rag_docs.append(node)
            rag_ids.add(node_id)
            new_nodes_count += 1

    # Save RAG
    if is_list_rag:
        with open(RAG_DB_PATH, 'w', encoding='utf-8') as f:
            json.dump(rag_docs, f, indent=2, ensure_ascii=False)
    else:
        raw_rag["documents"] = rag_docs
        with open(RAG_DB_PATH, 'w', encoding='utf-8') as f:
            json.dump(raw_rag, f, indent=2, ensure_ascii=False)

    # Save Telemetry GSC
    final_queries = []
    for q, data in queries_agg.items():
        avg_pos = sum(data['positions']) / len(data['positions']) if data['positions'] else 0.0
        ctr = (data['clicks'] / data['impressions'] * 100) if data['impressions'] > 0 else 0.0
        final_queries.append({
            'query': q,
            'clicks': int(data['clicks']),
            'impressions': int(data['impressions']),
            'ctr': round(ctr, 2),
            'position': round(avg_pos, 1)
        })
    final_queries.sort(key=lambda x: x['impressions'], reverse=True)

    with open(TELEMETRY_GSC, 'w', encoding='utf-8') as f:
        json.dump({
            "meta": {"lastIngestedAt": datetime.now().isoformat(), "totalUniqueQueries": len(final_queries)},
            "topQueries": final_queries[:100]
        }, f, indent=2, ensure_ascii=False)

    # Save Manifest and Hashes
    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    with open(PROCESSED_HASHES_PATH, 'w', encoding='utf-8') as f:
        json.dump(hashes, f, indent=2, ensure_ascii=False)

    summary_result = {
        "status": "SUCCESS",
        "archived_vault_target": VAULT_BASE,
        "files_processed_count": files_found,
        "files_relocated_to_vault": relocated_count,
        "new_rag_nodes_created": new_nodes_count,
        "total_rag_nodes": len(rag_docs),
        "total_unique_gsc_queries": len(queries_agg),
        "total_alsoasked_questions": len(alsoasked_mariachis) + len(alsoasked_vimume) + len(alsoasked_bulk)
    }

    print("\n" + "="*80)
    print("ZTM INGESTION COMPLETE:")
    print(json.dumps(summary_result, indent=2))
    print("="*80)

if __name__ == "__main__":
    ingest_batch()
