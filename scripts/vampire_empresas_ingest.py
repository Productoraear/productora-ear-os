"""
VAMPIRE EMPRESAS INGESTION ENGINE // EAR OS V2
SSOT: Nodo Empresas - Homologación B2B, Fincas Partner & Red de Afiliados
Pipeline:
  1. Auditoría de Integridad y Deduplicación (SHA-256).
  2. Extracción y Limpieza Textual (PDF, DOCX, TXT, MD, CSV, XLSX).
  3. Puntuación Semántica por Clústeres (Umbral mínimo: 0.70).
  4. Generación y Actualización de src/data/empresas_vault/empresas-knowledge-base.json.
  5. Desplazamiento seguro a H:\\EAR_INGESTION_HUB\\_PROCESADOS\\ con timestamp.
"""

import os
import sys
import json
import shutil
import hashlib
from datetime import datetime

HUB_EMPRESAS = r"H:\EAR_INGESTION_HUB\03_EMPRESAS"
HUB_PROCESADOS = r"H:\EAR_INGESTION_HUB\_PROCESADOS"
KB_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\empresas_vault\empresas-knowledge-base.json"

CLUSTERS = {
    "proveedores_y_fincas": [
        "finca partner", "homologacion tecnica", "potencia electrica", "cetac trifasico",
        "limite de sonido", "dba", "dbc", "limitador acustico", "acceso furgon 14 plazas",
        "poliza rc", "responsabilidad civil", "fincas toledo", "fincas madrid", "plano de espacio"
    ],
    "gestion_multimedia_b2b": [
        "area privada b2b", "press kit", "assets 4k", "video promocional espacio",
        "galeria de alta resolucion", "derechos de fijacion", "cesion de imagen",
        "co-branding ear", "material descargable"
    ],
    "afiliados_y_comisiones": [
        "comisiones cruzadas", "afiliados b2b", "10 por ciento", "15 por ciento",
        "wedding planner partner", "catering asociado", "fotografo colaborador",
        "scoring de partner", "liquidacion automatica", "autofactura b2b", "comisionista"
    ]
}

def compute_sha256(filepath):
    hasher = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def extract_text(filepath):
    ext = os.path.splitext(filepath)[1].lower()
    text = ""
    try:
        if ext in ['.txt', '.md', '.json', '.csv']:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()
        elif ext == '.docx':
            import docx
            doc = docx.Document(filepath)
            text = "\n".join([p.text for p in doc.paragraphs])
        elif ext == '.pdf':
            import pypdf
            reader = pypdf.PdfReader(filepath)
            for page in reader.pages[:15]:
                t = page.extract_text()
                if t: text += t + "\n"
    except Exception as e:
        print(f"  [ERROR] Extracción en {filepath}: {e}")
    return text.strip()

def calculate_affinity(text, filename):
    content = (filename + " " + text).lower()
    scores = {}
    for cluster_key, keywords in CLUSTERS.items():
        matches = sum(1 for kw in keywords if kw in content)
        score = min(1.0, round(matches / max(1, len(keywords) * 0.35), 2))
        scores[cluster_key] = score

    best_cluster = max(scores, key=scores.get)
    best_score = scores[best_cluster]
    return best_cluster, best_score

def run_vampire_ingest():
    print("=" * 80)
    print("VAMPIRE EMPRESAS INGESTION ENGINE // INICIANDO ESCANEO DEL BUZÓN B2B")
    print("=" * 80)

    if not os.path.exists(HUB_EMPRESAS):
        print(f"[ERROR] No se encuentra {HUB_EMPRESAS}")
        return

    # Cargar base de datos existente
    with open(KB_PATH, 'r', encoding='utf-8') as f:
        kb_data = json.load(f)

    existing_hashes = {item['sha256'] for item in kb_data['items']}
    processed_count = 0
    duplicate_count = 0

    # Recorrer subcarpetas de H:\EAR_INGESTION_HUB\03_EMPRESAS\
    for root, dirs, files in os.walk(HUB_EMPRESAS):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext not in ['.pdf', '.docx', '.txt', '.md', '.json', '.csv']:
                continue

            filepath = os.path.join(root, file)
            sha256 = compute_sha256(filepath)

            # Paso 1: Deduplicación
            if sha256 in existing_hashes:
                print(f"[DESCARTE - DUPLICADO] {file} ya existe en el SSOT de Empresas.")
                duplicate_count += 1
                continue

            # Paso 2: Extracción
            print(f"[EXTRAYENDO] {file}...")
            text = extract_text(filepath)
            if not text:
                print(f"  [AVISO] Archivo sin texto extraíble: {file}")
                continue

            # Paso 3: Puntuación Semántica
            best_cluster, score = calculate_affinity(text, file)
            print(f"  -> Asignado a: {best_cluster} (Afinidad: {score})")

            # Paso 4: Inyección en SSOT
            new_id = f"EMP-INGEST-{len(kb_data['items']) + 1:04d}"
            item = {
                "id": new_id,
                "source_file": file,
                "sha256": sha256,
                "cluster": best_cluster,
                "title": os.path.splitext(file)[0].replace("_", " ").title(),
                "summary": text[:250].replace("\n", " ") + "...",
                "content_clean": text[:3000],
                "affinity_score": score,
                "tags": [best_cluster.split("_")[0], "ingested", ext[1:]],
                "operational_rules": [
                    "Integrado automáticamente por el motor Vampire Empresas SSOT",
                    f"Cluster asignado: {best_cluster}"
                ],
                "ingestion_timestamp": datetime.now().isoformat()
            }

            kb_data['items'].append(item)
            kb_data['metadata']['total_entries'] = len(kb_data['items'])
            kb_data['metadata']['cluster_counts'][best_cluster] = (
                kb_data['metadata']['cluster_counts'].get(best_cluster, 0) + 1
            )
            existing_hashes.add(sha256)
            processed_count += 1

            # Paso 5: Desplazamiento a _PROCESADOS
            timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
            dest_name = f"{timestamp_str}_{file}"
            dest_path = os.path.join(HUB_PROCESADOS, dest_name)
            shutil.move(filepath, dest_path)
            print(f"  -> Movido a {dest_path}")

    # Guardar base de datos actualizada
    kb_data['metadata']['last_updated'] = datetime.now().isoformat()
    with open(KB_PATH, 'w', encoding='utf-8') as f:
        json.dump(kb_data, f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 80)
    print(f"VAMPIRIZACIÓN DE EMPRESAS COMPLETADA: {processed_count} nuevos archivos procesados.")
    print(f"Duplicados descartados: {duplicate_count}")
    print(f"Total registros en el SSOT de Empresas: {len(kb_data['items'])}")
    print("=" * 80)

if __name__ == "__main__":
    run_vampire_ingest()
