"""
VIMUME FORENSIC SCANNER - FASE 1: DRY-RUN PASIVO DE SOLO LECTURA (HIGH SPEED)
SSOT: Plan Maestro de Ingesta Forense, Gobernanza de Activos y Arquitectura RAG
Reglas:
- 100% Solo lectura: NO mueve, NO renombra, NO modifica archivos.
- Lista blanca estricta de extensiones: .pdf, .docx, .doc, .txt, .md, .rtf, .odt, .xlsx, .xls, .pptx, .json
- Lista negra estricta de carpetas de desarrollo y sistema (node_modules, .git, temp, etc.)
- Aislamiento Criptográfico en Origen: Excluye obra inédita personal de Edwin Agudelo.
- Detección de patrones PII (DNI/NIE, teléfonos) para banderas de cuarentena.
- Asignación preliminar de Macro-Vectores Semánticos (1 a 5).
- Cálculo determinista de Hash SHA-256 en bloques de 64KB solo en archivos coincidentes.
- Emisión formal de vimume_forensic_inventory.json.
"""

import os
import sys
import re
import json
import time
import hashlib
from datetime import datetime

# ==========================================
# 1. PERÍMETRO Y REGLAS DE FILTRADO
# ==========================================

SCAN_ROOTS = [
    r"H:\EAR_OS_V2",
    r"D:\EAR_VAULT",
    r"C:\Users\M2-W10\Documents",
    r"C:\Users\M2-W10\Desktop"
]

ALLOWED_EXTENSIONS = {
    '.pdf', '.docx', '.doc', '.txt', '.md', '.rtf', '.odt', 
    '.xlsx', '.xls', '.pptx', '.json'
}

EXCLUDED_DIR_NAMES = {
    'node_modules', '.git', '.next', 'venv', '__pycache__', 
    '.cache', 'lm-studio', '.ollama', 'ai_models_hub', 
    'appdata', 'local settings', 'temp', 'windows', 'program files',
    'program files (x86)', 'programdata', '$recycle.bin', 'system volume information',
    '00_edwin_composiciones', 'canciones_propias', 'discografia_inedita'
}

# ==========================================
# 2. MACRO-VECTORES SEMÁNTICOS (VIMUME)
# ==========================================

VECTORS = {
    '1_DEMOGRAFIA_SILVER_ECONOMY': [
        'tercera edad', 'envejecimiento activo', 'longevidad', 'residencia', 
        'residencias', 'centro de dia', 'centros de dia', 'soledad no deseada', 
        'senior', 'seniors', 'silver economy', 'dependencia', 'edadismo', 'abuelo', 'abuela'
    ],
    '2_NEUROCIENCIA_TERAPIA_ACUSTICA': [
        '40 hz', '40hz', 'gamma', 'neuroplasticidad', 'memoria autobiografica', 
        'memoria autobiográfica', 'demencia', 'alzheimer', 'deterioro cognitivo', 
        'musicoterapia', 'estimulacion sensorial', 'estimulación sensorial', 'dcl',
        'arrastre gamma', 'ondas gamma', 'reminiscencia', 'cognitiva', 'cognitivo'
    ],
    '3_MARIACHI_TERAPEUTICO_ARTE': [
        'mariachi', 'mariachi terapeutico', 'mariachi terapéutico', 
        'polinizacion de recuerdos', 'polinización de recuerdos', 'colibri', 'colibrí', 
        'viaje musical por la memoria', 'sebastian diaz', 'sebastián díaz', 'vimume'
    ],
    '4_STAKEHOLDERS_SOCIOS': [
        'familiares', 'terapeutas ocupacionales', 'terapeuta ocupacional', 
        'psicologos', 'psicólogos', 'cuidadores', 'geriatras', 'voluntariado', 
        'ceoma', 'udp', 'asociacion de alzheimer', 'asociación de alzheimer'
    ],
    '5_MARCO_B2G_FINANCIACION_ODS': [
        'lcsp', 'contratos menores', 'contrato menor', 'art 118', 'art. 118', 
        'ods 3', 'ods 10', 'ods 11', 'agenda 2030', 'horizonte europa', 
        'europa creativa', 'fse+', 'subvencion', 'subvención', 'pliego', 'licitacion'
    ]
}

RE_DNI = re.compile(r'\b[0-9]{8}[A-Za-z]\b|\b[XYZxyz][0-9]{7}[A-Za-z]\b')
RE_PHONE = re.compile(r'\b(?:\+34|0034)?[6789]\d{8}\b')

def compute_sha256(filepath):
    """Calcula SHA-256 en bloques de 64KB de solo lectura."""
    hasher = hashlib.sha256()
    try:
        with open(filepath, 'rb') as f:
            while chunk := f.read(65536):
                hasher.update(chunk)
        return hasher.hexdigest()
    except Exception:
        return None

def check_file_match(filename):
    """Evalúa coincidencia léxica en nombre de archivo (O(1))."""
    fname_lower = filename.lower()
    matched_vectors = []

    for vec_name, keywords in VECTORS.items():
        if any(kw in fname_lower for kw in keywords):
            matched_vectors.append(vec_name)

    return matched_vectors

def check_pii(filename, sample_text=""):
    """Detección preventiva de PII."""
    has_pii = False
    pii_types = []
    text_to_scan = filename.lower() + " " + sample_text.lower()
    if RE_DNI.search(text_to_scan):
        has_pii = True
        pii_types.append('DNI/NIE')
    if RE_PHONE.search(text_to_scan):
        has_pii = True
        pii_types.append('PHONE')
    return has_pii, pii_types

def run_forensic_scan():
    start_time = datetime.now()
    print("=" * 80, flush=True)
    print("VIMUME FORENSIC SCANNER // FASE 1: AUDITORÍA PASIVA DRY-RUN (HIGH-SPEED)", flush=True)
    print(f"Inicio: {start_time.strftime('%Y-%m-%d %H:%M:%S')}", flush=True)
    print("=" * 80, flush=True)

    inventory = []
    scanned_count = 0
    matched_count = 0
    seen_hashes = set()

    for root_dir in SCAN_ROOTS:
        if not os.path.exists(root_dir):
            print(f"[AVISO] Ruta no accesible o no montada: {root_dir}", flush=True)
            continue

        print(f"\n[ESCANEANDO ATÓMICAMENTE] {root_dir}...", flush=True)
        t_root = time.time()

        for root, dirs, files in os.walk(root_dir):
            # Pruning ultra rápido de carpetas excluidas
            dirs[:] = [
                d for d in dirs 
                if d.lower() not in EXCLUDED_DIR_NAMES 
                and not any(ex in d.lower() for ex in ['node_modules', '.git', '00_edwin_composiciones', 'canciones_propias', 'discografia_inedita'])
            ]

            for file in files:
                scanned_count += 1
                if scanned_count % 50000 == 0:
                    print(f"  ... Analizados {scanned_count:,} archivos en disco ({matched_count} activos VIMUME hallados)", flush=True)

                ext = os.path.splitext(file)[1].lower()
                if ext not in ALLOWED_EXTENSIONS:
                    continue

                matched_vectors = check_file_match(file)
                if not matched_vectors:
                    # Si la carpeta contenedora tiene vimume o musicoterapia, incluir
                    parent_lower = os.path.basename(root).lower()
                    for vec_name, keywords in VECTORS.items():
                        if any(kw in parent_lower for kw in ['vimume', 'musicoterapia', 'sebastian diaz', 'viaje musical']):
                            matched_vectors.append(vec_name)
                            break

                if matched_vectors:
                    full_path = os.path.join(root, file)
                    matched_count += 1

                    file_size = 0
                    try:
                        file_size = os.path.getsize(full_path)
                    except Exception:
                        pass

                    sha256 = compute_sha256(full_path)
                    is_duplicate = sha256 in seen_hashes if sha256 else False
                    if sha256:
                        seen_hashes.add(sha256)

                    # Muestra de texto para PII en txt/md si es ligero
                    sample_txt = ""
                    if ext in {'.txt', '.md', '.json'} and file_size < 100000:
                        try:
                            with open(full_path, 'r', encoding='utf-8', errors='ignore') as sf:
                                sample_txt = sf.read(2048)
                        except Exception:
                            pass

                    has_pii, pii_types = check_pii(file, sample_txt)

                    item = {
                        "id": f"VIM-FORENSIC-{matched_count:05d}",
                        "filename": file,
                        "extension": ext,
                        "file_size_bytes": file_size,
                        "file_size_mb": round(file_size / (1024 * 1024), 3),
                        "original_path": full_path,
                        "sha256": sha256,
                        "is_duplicate_hash": is_duplicate,
                        "matched_macro_vectors": matched_vectors,
                        "suggested_canonical_vault": matched_vectors[0] if matched_vectors else "UNASSIGNED",
                        "pii_detected": has_pii,
                        "pii_flags": pii_types,
                        "timestamp_scanned": datetime.now().isoformat()
                    }
                    inventory.append(item)

        print(f"  -> Concluido {root_dir} en {time.time()-t_root:.2f}s", flush=True)

    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()

    output_path = os.path.join(r"H:\EAR_OS_V2\EAR_OS_V2", "vimume_forensic_inventory.json")
    with open(output_path, "w", encoding="utf-8") as out_f:
        json.dump({
            "audit_metadata": {
                "system": "VIMUME (EAR OS) // Forensic Ingestion Engine",
                "phase": "FASE 1: DRY-RUN AUDIT (READ-ONLY)",
                "timestamp_start": start_time.isoformat(),
                "timestamp_end": end_time.isoformat(),
                "scan_duration_seconds": round(duration, 2),
                "total_files_scanned_in_disk": scanned_count,
                "total_matched_vimume_assets": matched_count,
                "unique_sha256_assets": len(seen_hashes),
                "pii_quarantine_candidates": sum(1 for x in inventory if x["pii_detected"])
            },
            "macro_vector_breakdown": {
                vec: sum(1 for x in inventory if vec in x["matched_macro_vectors"])
                for vec in VECTORS.keys()
            },
            "assets": inventory
        }, out_f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 80, flush=True)
    print("AUDITORÍA FORENSE COMPLETADA CON ÉXITO", flush=True)
    print(f"Total archivos analizados en disco: {scanned_count:,}", flush=True)
    print(f"Total activos identificados para VIMUME: {matched_count:,}", flush=True)
    print(f"Activos únicos por SHA-256: {len(seen_hashes):,}", flush=True)
    print(f"Candidatos con potencial PII (Cuarentena preventiva): {sum(1 for x in inventory if x['pii_detected'])}", flush=True)
    print(f"Tiempo total de escaneo: {round(duration, 2)} segundos", flush=True)
    print(f"Inventario emitido en: {output_path}", flush=True)
    print("=" * 80, flush=True)

if __name__ == "__main__":
    run_forensic_scan()
