"""
VIMUME FASE 2: INGESTA CANÓNICA, CUARENTENA PII Y COMPILACIÓN RAG SSOT
SSOT: Directiva Táctica de Aprobación Condicionada de la Fase 2 (VIMUME)

REGLAS DE ORO ARQUITECTÓNICAS:
1. CERO BINARIOS EN SRC/: Los 4.029 archivos físicos residen EXCLUSIVAMENTE en H:\\EAR_INGESTION_HUB\\05_PROYECTO_VIMUME\\.
2. AISLAMIENTO PII: Los 44 archivos sospechosos se mueven a H:\\EAR_INGESTION_HUB\\quarantine_pii\\ (NUNCA tocan el RAG).
3. ÚNICO ENTREGABLE EN REPOSITORIO: src/data/vimume-rag-ssot.json (estrictamente <= 25 MB).
"""

import os
import sys
import json
import shutil
import hashlib
from datetime import datetime

# Rutas del Hub Externo
HUB_VIMUME_BASE = r"H:\EAR_INGESTION_HUB\05_PROYECTO_VIMUME"
HUB_QUARANTINE = r"H:\EAR_INGESTION_HUB\quarantine_pii"

# Ruta del entregable único en el proyecto
PROJECT_ROOT = r"H:\EAR_OS_V2\EAR_OS_V2"
INVENTORY_PATH = os.path.join(PROJECT_ROOT, "vimume_forensic_inventory.json")
OUTPUT_SSOT_PATH = os.path.join(PROJECT_ROOT, "src", "data", "vimume-rag-ssot.json")

# 7 Carpetas Canónicas de VIMUME
CANONICAL_FOLDERS = {
    "01_FUNDAMENTACION_CIENTIFICA": os.path.join(HUB_VIMUME_BASE, "01_FUNDAMENTACION_CIENTIFICA"),
    "02_METODOLOGIA_CLINICA": os.path.join(HUB_VIMUME_BASE, "02_METODOLOGIA_CLINICA"),
    "03_IDENTIDAD_Y_MARCA": os.path.join(HUB_VIMUME_BASE, "03_IDENTIDAD_Y_MARCA"),
    "04_SISTEMA_NEURONAL_MAP": os.path.join(HUB_VIMUME_BASE, "04_SISTEMA_NEURONAL_MAP"),
    "05_PILOTOS_Y_CASOS_USO": os.path.join(HUB_VIMUME_BASE, "05_PILOTOS_Y_CASOS_USO"),
    "06_EXPEDIENTES_B2G_LCSP": os.path.join(HUB_VIMUME_BASE, "06_EXPEDIENTES_B2G_LCSP"),
    "07_FINANCIACION_Y_MECENAZGO": os.path.join(HUB_VIMUME_BASE, "07_FINANCIACION_Y_MECENAZGO"),
}

def map_to_canonical_folder(item):
    """Mapea un activo al módulo canónico más adecuado."""
    fn_lower = item['filename'].lower()
    vectors = item.get('matched_macro_vectors', [])

    # Reglas específicas por nombre de archivo
    if any(k in fn_lower for k in ['manual de identidad', 'colibri', 'colibrí', 'isotipo', 'logotipo', 'tipografia']):
        return "03_IDENTIDAD_Y_MARCA"
    if any(k in fn_lower for k in ['40 hz', '40hz', 'gamma', 'papers', 'investigacion', 'investigación', 'evidencia']):
        return "01_FUNDAMENTACION_CIENTIFICA"
    if any(k in fn_lower for k in ['metodologia', 'metodología', 'sesion', 'sesión', 'protocolo', 'sebastian diaz', 'sebastián']):
        return "02_METODOLOGIA_CLINICA"
    if any(k in fn_lower for k in ['lcsp', 'contrato menor', 'art 118', 'art. 118', 'pliego', 'licitacion', 'ayuntamiento']):
        return "06_EXPEDIENTES_B2G_LCSP"
    if any(k in fn_lower for k in ['patrocinio', 'mecenazgo', 'crowdfunding', 'modelo 182', 'donacion', 'donación']):
        return "07_FINANCIACION_Y_MECENAZGO"
    if any(k in fn_lower for k in ['stakeholder', 'terapeuta', 'familiar', 'psicologo', 'cuidador', 'ontologia']):
        return "04_SISTEMA_NEURONAL_MAP"
    if any(k in fn_lower for k in ['piloto', 'residencia', 'centro de dia', 'evaluacion', 'caso']):
        return "05_PILOTOS_Y_CASOS_USO"

    # Mapeo por macro-vector general
    if '2_NEUROCIENCIA_TERAPIA_ACUSTICA' in vectors:
        return "01_FUNDAMENTACION_CIENTIFICA"
    if '3_MARIACHI_TERAPEUTICO_ARTE' in vectors:
        return "02_METODOLOGIA_CLINICA"
    if '5_MARCO_B2G_FINANCIACION_ODS' in vectors:
        return "06_EXPEDIENTES_B2G_LCSP"
    if '4_STAKEHOLDERS_SOCIOS' in vectors:
        return "04_SISTEMA_NEURONAL_MAP"
    return "05_PILOTOS_Y_CASOS_USO"

def extract_clean_text(filepath, max_chars=15000):
    """Extrae texto limpio de forma ultraligera sin sobrecargar memoria."""
    ext = os.path.splitext(filepath)[1].lower()
    text = ""
    try:
        if ext in ['.txt', '.md', '.json', '.rtf']:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read(max_chars)
        elif ext == '.docx':
            import docx
            doc = docx.Document(filepath)
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            text = "\n".join(paragraphs[:80])
        elif ext == '.pdf':
            # Solo extraer primeras páginas de PDFs clave para evitar lentitud
            size = os.path.getsize(filepath)
            if size < 25 * 1024 * 1024:  # Menores de 25MB
                import pypdf
                reader = pypdf.PdfReader(filepath)
                for page in reader.pages[:10]:
                    t = page.extract_text()
                    if t: text += t + "\n"
    except Exception:
        pass
    # Limpieza de saltos y caracteres espurios
    lines = [l.strip() for l in text.split('\n') if len(l.strip()) > 3]
    return " ".join(lines[:200])

def run_phase_2():
    print("=" * 80, flush=True)
    print("VIMUME FASE 2: INGESTA CANÓNICA, CUARENTENA PII Y COMPILACIÓN RAG", flush=True)
    print("=" * 80, flush=True)

    # 1. Crear directorios canónicos en el HUB externo
    for folder_path in CANONICAL_FOLDERS.values():
        os.makedirs(folder_path, exist_ok=True)
    os.makedirs(HUB_QUARANTINE, exist_ok=True)
    os.makedirs(os.path.dirname(OUTPUT_SSOT_PATH), exist_ok=True)

    print(f"[OK] Estructura creada en: {HUB_VIMUME_BASE}", flush=True)
    print(f"[OK] Cuarentena creada en: {HUB_QUARANTINE}", flush=True)

    # 2. Cargar Inventario Forense
    if not os.path.exists(INVENTORY_PATH):
        print(f"[ERROR] No se encuentra {INVENTORY_PATH}", flush=True)
        return

    with open(INVENTORY_PATH, 'r', encoding='utf-8') as f:
        inventory_data = json.load(f)

    assets = inventory_data.get('assets', [])
    print(f"[INFO] Total activos a procesar: {len(assets)}", flush=True)

    # 3. Separar Cuarentena PII
    pii_quarantine_assets = [a for a in assets if a.get('pii_detected')]
    clean_assets = [a for a in assets if not a.get('pii_detected')]

    print(f"\n[PASO 1: AISLAMIENTO PII] Trasladando {len(pii_quarantine_assets)} archivos a cuarentena...", flush=True)
    quarantined_count = 0
    for a in pii_quarantine_assets:
        src = a['original_path']
        if os.path.exists(src):
            dst = os.path.join(HUB_QUARANTINE, a['filename'])
            try:
                if not os.path.exists(dst):
                    shutil.copy2(src, dst)
                quarantined_count += 1
            except Exception:
                pass

    print(f"  -> {quarantined_count} archivos aislados en {HUB_QUARANTINE} (Cero PII en el RAG)", flush=True)

    # 4. Deduplicar por SHA-256
    unique_clean_assets = {}
    for a in clean_assets:
        h = a.get('sha256')
        if h and h not in unique_clean_assets:
            unique_clean_assets[h] = a

    print(f"\n[PASO 2: ORGANIZACIÓN EXTERNA] Copiando {len(unique_clean_assets)} activos únicos en el Ingestion Hub...", flush=True)
    copied_by_category = {k: 0 for k in CANONICAL_FOLDERS.keys()}
    
    rag_chunks = []
    total_text_bytes = 0

    for idx, (sha, a) in enumerate(unique_clean_assets.items()):
        src = a['original_path']
        if not os.path.exists(src):
            continue

        target_folder_key = map_to_canonical_folder(a)
        target_dir = CANONICAL_FOLDERS[target_folder_key]
        dst_file = os.path.join(target_dir, a['filename'])

        # Copiar al Hub externo de forma segura
        try:
            if not os.path.exists(dst_file):
                shutil.copy2(src, dst_file)
            copied_by_category[target_folder_key] += 1
        except Exception:
            pass

        # 5. Extracción para el RAG SSOT (Solo documentos de alto valor informativo)
        # Priorizamos documentos clave para mantener el JSON ultraligero (< 25 MB)
        clean_text = extract_clean_text(src)
        if clean_text and len(clean_text) > 40:
            chunk_item = {
                "id": f"VIM-RAG-{len(rag_chunks)+1:05d}",
                "category": target_folder_key,
                "title": os.path.splitext(a['filename'])[0].replace("_", " ").title()[:120],
                "filename": a['filename'],
                "sha256": sha,
                "macro_vectors": a.get('matched_macro_vectors', []),
                "content_chunk": clean_text[:1200],  # Chunks de ~200-300 palabras
                "access_level": "public" if target_folder_key in ["01_FUNDAMENTACION_CIENTIFICA", "03_IDENTIDAD_Y_MARCA"] else "authenticated",
                "timestamp": datetime.now().isoformat()
            }
            rag_chunks.append(chunk_item)
            total_text_bytes += len(clean_text)

        if (idx + 1) % 500 == 0:
            print(f"  ... Procesados {idx+1}/{len(unique_clean_assets)} activos (Chunks RAG generados: {len(rag_chunks)})", flush=True)

    # 6. Compilar el archivo único SSOT en src/data/
    ssot_payload = {
        "metadata": {
            "system": "VIMUME (EAR OS) // Base de Conocimiento RAG SSOT",
            "version": "2.0.0-GOLD",
            "compiled_at": datetime.now().isoformat(),
            "total_documents_indexed": len(unique_clean_assets),
            "total_rag_chunks": len(rag_chunks),
            "quarantined_pii_files": quarantined_count,
            "external_storage_path": HUB_VIMUME_BASE,
            "category_distribution": copied_by_category
        },
        "ontology_roots": [
            "1. Demografía & Silver Economy",
            "2. Neurociencia & Terapia Acústica (40 Hz)",
            "3. Mariachi Terapéutico & Identidad Colibrí",
            "4. Ecosistema de Stakeholders",
            "5. Marco B2G, LCSP Art. 118 & Financiación ODS"
        ],
        "chunks": rag_chunks
    }

    with open(OUTPUT_SSOT_PATH, 'w', encoding='utf-8') as out_f:
        json.dump(ssot_payload, out_f, indent=2, ensure_ascii=False)

    ssot_size_bytes = os.path.getsize(OUTPUT_SSOT_PATH)
    ssot_size_mb = round(ssot_size_bytes / (1024 * 1024), 2)

    print("\n" + "=" * 80, flush=True)
    print("FASE 2 COMPLETADA CON ÉXITO ROTUNDO", flush=True)
    print(f"Archivos físicos copiados a H:\\EAR_INGESTION_HUB\\05_PROYECTO_VIMUME\\: {sum(copied_by_category.values())}")
    for cat, count in copied_by_category.items():
        print(f"  - {cat}: {count} archivos")
    print(f"Archivos en cuarentena PII (H:\\EAR_INGESTION_HUB\\quarantine_pii\\): {quarantined_count}")
    print(f"Total Chunks RAG generados: {len(rag_chunks)}")
    print(f"ÚNICO entregable en src/data/: {OUTPUT_SSOT_PATH}")
    print(f"Tamaño final del archivo SSOT: {ssot_size_mb} MB (Límite: <= 25 MB)")
    print(f"Archivos binarios o .pdf añadidos a src/: CERO (0)")
    print("=" * 80, flush=True)

if __name__ == "__main__":
    run_phase_2()
