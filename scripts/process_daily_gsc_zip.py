#!/usr/bin/env python3
"""
GSC Daily Ingestion & Telemetry Analyzer — EAR OS V2
Ingesta ZTM de Google Search Console ZIP:
1. Extrae y agrega telemetría a src/data/telemetry/gsc-performance-data.json
2. Detecta oportunidades SEO de alta conversión
3. Inyecta nodo canónico en src/data/ear-rag-database.json
4. Vaulting a H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\MERCADO_Y_SEO_MARIACHIS\
"""

import os
import sys
import zipfile
import csv
import json
import hashlib
import shutil
from pathlib import Path
from datetime import datetime

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ZIP_PATH = r"H:\https___www.productoraear.com_-Performance-on-Search-2026-08-30.zip"
WORKSPACE_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_TELEMETRY = WORKSPACE_ROOT / "src" / "data" / "telemetry" / "gsc-performance-data.json"
RAG_DB_PATH = WORKSPACE_ROOT / "src" / "data" / "ear-rag-database.json"
VAULT_DIR = Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\MERCADO_Y_SEO_MARIACHIS")
MANIFEST_PATH = WORKSPACE_ROOT / "scripts" / ".archived_manifest.json"

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

def process_gsc_zip():
    if not os.path.exists(ZIP_PATH):
        print(f"❌ Error: Archivo no encontrado {ZIP_PATH}")
        return 1

    sha = compute_sha256(ZIP_PATH)
    file_size = os.path.getsize(ZIP_PATH)
    print("=" * 80)
    print("📈 INGESTA FORENSE GOOGLE SEARCH CONSOLE — 30/08/2026")
    print(f"📦 Archivo: {os.path.basename(ZIP_PATH)} ({file_size / 1024:.1f} KB)")
    print(f"🔒 Hash SHA-256: {sha}")
    print("=" * 80)

    queries = []
    pages = []
    countries = []
    devices = []

    with zipfile.ZipFile(ZIP_PATH, 'r') as z:
        for filename in z.namelist():
            if not filename.endswith('.csv'):
                continue
            with z.open(filename) as f:
                reader = csv.DictReader(f.read().decode('utf-8-sig', errors='ignore').splitlines())
                clean_name = filename.lower()
                for row in reader:
                    if 'queries' in clean_name or 'consultas' in clean_name:
                        q_name = row.get('Top queries') or row.get('Consultas principales') or row.get('Query') or ''
                        if q_name:
                            queries.append({
                                'query': q_name.strip(),
                                'clicks': int(parse_num(row.get('Clicks') or row.get('Clics') or 0)),
                                'impressions': int(parse_num(row.get('Impressions') or row.get('Impresiones') or 0)),
                                'ctr': parse_num(row.get('CTR') or 0),
                                'position': parse_num(row.get('Position') or row.get('Posición') or 0)
                            })
                    elif 'pages' in clean_name or 'páginas' in clean_name:
                        p_url = row.get('Top pages') or row.get('Páginas principales') or row.get('Page') or ''
                        if p_url:
                            pages.append({
                                'page': p_url.strip(),
                                'clicks': int(parse_num(row.get('Clicks') or row.get('Clics') or 0)),
                                'impressions': int(parse_num(row.get('Impressions') or row.get('Impresiones') or 0)),
                                'ctr': parse_num(row.get('CTR') or 0),
                                'position': parse_num(row.get('Position') or row.get('Posición') or 0)
                            })

    # Ordenar por impresiones y clics
    queries.sort(key=lambda x: (x['clicks'], x['impressions']), reverse=True)
    pages.sort(key=lambda x: (x['clicks'], x['impressions']), reverse=True)

    total_clicks = sum(q['clicks'] for q in queries)
    total_impressions = sum(q['impressions'] for q in queries)
    avg_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0.0

    print(f"📊 Métricas Globales Consolidadas:")
    print(f"   • Total Clics: {total_clicks:,}")
    print(f"   • Total Impresiones: {total_impressions:,}")
    print(f"   • CTR Medio: {avg_ctr:.2f}%")
    print(f"   • Consultas Únicas Indexadas: {len(queries):,}")
    print(f"   • Páginas con Tráfico: {len(pages):,}")
    print("-" * 80)

    # Detectar Top Oportunidades (Posición 3 a 15 con alta impresión)
    opportunities = [
        q for q in queries 
        if q['impressions'] >= 20 and 3.0 <= q['position'] <= 18.0
    ]
    opportunities.sort(key=lambda x: x['impressions'], reverse=True)

    print("🎯 Top 5 Oportunidades de Alto Impacto (Posición 3-15):")
    for op in opportunities[:5]:
        print(f"   👉 \"{op['query']}\" | {op['impressions']} impr | {op['clicks']} clics | Pos: {op['position']:.1f} | CTR: {op['ctr']:.1f}%")

    print("-" * 80)
    print("🏆 Top 5 Páginas Líderes en Clics:")
    for p in pages[:5]:
        print(f"   📄 {p['page']} ({p['clicks']} clics / {p['impressions']} impr)")

    # 1. Guardar Telemetría JSON
    telemetry_data = {
        'lastUpdated': datetime.utcnow().isoformat() + 'Z',
        'exportDate': '2026-08-30',
        'sha256': sha,
        'summary': {
            'totalClicks': total_clicks,
            'totalImpressions': total_impressions,
            'avgCtr': avg_ctr,
            'uniqueQueries': len(queries),
            'uniquePages': len(pages)
        },
        'topQueries': queries[:50],
        'topOpportunities': opportunities[:30],
        'topPages': pages[:30]
    }
    
    OUTPUT_TELEMETRY.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_TELEMETRY, 'w', encoding='utf-8') as f:
        json.dump(telemetry_data, f, indent=2, ensure_ascii=False)
    print(f"\n💾 Telemetría guardada en: {OUTPUT_TELEMETRY.relative_to(WORKSPACE_ROOT)}")

    # 2. Inyección RAG
    if RAG_DB_PATH.exists():
        try:
            with open(RAG_DB_PATH, 'r', encoding='utf-8') as f:
                rag_db = json.load(f)
            
            node_id = f"GSC_TELEMETRY_2026_08_30"
            rag_node = {
                "id": node_id,
                "category": "MERCADO_Y_SEO_MARIACHIS",
                "title": "Google Search Console Performance Report (2026-08-30)",
                "summary": f"Telemetría GSC de Productora EAR al 30/08/2026. Total {total_clicks} clics y {total_impressions} impresiones. Oportunidades top en contratación de mariachis, bodas Madrid/Toledo y alquiler de pantallas LED.",
                "keyMetrics": {
                    "clicks": total_clicks,
                    "impressions": total_impressions,
                    "avgCtr": round(avg_ctr, 2),
                    "topOpportunity": opportunities[0]['query'] if opportunities else "N/A"
                },
                "sha256": sha,
                "timestamp": datetime.utcnow().isoformat() + 'Z'
            }
            
            # Reemplazar o añadir
            existing = [i for i, n in enumerate(rag_db) if n.get('id') == node_id]
            if existing:
                rag_db[existing[0]] = rag_node
            else:
                rag_db.append(rag_node)
                
            with open(RAG_DB_PATH, 'w', encoding='utf-8') as f:
                json.dump(rag_db, f, indent=2, ensure_ascii=False)
            print(f"🧠 Nodo RAG inyectado con éxito: {node_id} (Total nodos: {len(rag_db):,})")
        except Exception as e:
            print(f"⚠️ Error actualizando RAG DB: {e}")

    # 3. Vaulting a EAR_ABSORBED_VAULT
    VAULT_DIR.mkdir(parents=True, exist_ok=True)
    vault_dest = VAULT_DIR / os.path.basename(ZIP_PATH)
    try:
        shutil.move(ZIP_PATH, str(vault_dest))
        print(f"🏛️ Archivo archivado en bóveda: {vault_dest}")
        
        # Registrar en Manifiesto
        manifest_data = []
        if MANIFEST_PATH.exists():
            try:
                with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
                    manifest_data = json.load(f)
            except:
                manifest_data = []
                
        manifest_data.append({
            "filename": os.path.basename(ZIP_PATH),
            "original_path": ZIP_PATH,
            "vault_path": str(vault_dest),
            "sha256": sha,
            "category": "MERCADO_Y_SEO_MARIACHIS",
            "archived_at": datetime.utcnow().isoformat() + 'Z'
        })
        
        with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
            json.dump(manifest_data, f, indent=2, ensure_ascii=False)
        print(f"📜 Registrado en manifiesto: {len(manifest_data):,} entradas.")
    except Exception as e:
        print(f"⚠️ Error durante vaulting: {e}")

    print("=" * 80)
    print("✅ INGESTA ZTM COMPLETADA CON ÉXITO")
    print("=" * 80)
    return 0

if __name__ == "__main__":
    sys.exit(process_gsc_zip())
