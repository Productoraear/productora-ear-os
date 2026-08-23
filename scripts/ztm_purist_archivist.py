import os
import sys
import json
import hashlib
import shutil
import time
from datetime import datetime

VAULT_BASE = r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT"
MANIFEST_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\scripts\.archived_manifest.json"
PROCESSED_HASHES_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\scripts\.processed_hashes.json"
RAG_DB_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\ear-rag-database.json"
DIGEST_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\docs\digests\RECYCLED_ASSETS_DIGEST.json"

TARGET_SCAN_DIRS = [
    r"H:\00_PRODUCTORA_EAR\BODEGA_CUARENTENA",
    r"H:\00_PRODUCTORA_EAR\00_AVE_FENIX",
    r"H:\00 EAR_OS_LEGACY_STAGING",
    r"H:\EAR_OS_V2\VERTICAL_INCUBADORA_VAMPIRIZADA",
    r"H:\EAR_OS_V2\VERTICAL_PROYECTOS_VIMUME",
    r"H:\EAR_OS_V2\VERTICAL_EVENTOS",
    r"H:\SANTUARIO_EAR",
    r"C:\Users\M2-W10\Documents",
    r"C:\Users\M2-W10\Desktop"
]

IGNORED_PATTERNS = [
    'node_modules', '.git', '.next', 'AppData', '$RECYCLE.BIN',
    'EAR_ABSORBED_VAULT', 'Windows', 'Program Files', 'System Volume Information'
]

HEAVY_MEDIA_EXTS = {'.mp4', '.mov', '.avi', '.mkv', '.wav', '.flac', '.zip', '.tar', '.gz', '.iso', '.exe'}
TEXT_DOC_EXTS = {'.md', '.txt', '.json', '.pdf', '.docx', '.doc', '.xlsx', '.csv', '.rtf', '.html', '.htm', '.py', '.ts', '.tsx', '.js'}

def calculate_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(16384):
            h.update(chunk)
    return h.hexdigest()

def detect_category(filename, content_sample=""):
    combined = f"{filename} {content_sample}".lower()
    
    if any(k in combined for k in ['dnda', 'sgae', 'aie', 'derecho de autor', 'derechos de autor', 'propiedad intelectual', 'partida 10-', 'registro obra']):
        return "PROPIEDAD_INTELECTUAL_DNDA"
    elif any(k in combined for k in ['astra', 'neural twin', 'oráculo', 'directiva', 'roadmap', 'prompt maestro']):
        return "ACADEMIA_ASTRA"
    elif any(k in combined for k in ['whisper', 'transcription', 'transcripcion', 'audio_log', 'entrevista']):
        return "TRANSCRIPCIONES_AUDIO"
    elif any(k in combined for k in ['contrato', 'precontrato', 'clausula', 'acuerdo 360', 'recoupment', 'rider tecnico', 'pliego']):
        return "CONTRATOS_Y_LEGAL"
    elif any(k in combined for k in ['incubadora', 'bodas.net', 'proveedor', 'vampiriz', 'scrap', 'fotografo', 'finca']):
        return "INCUBADORA_VAMPIRIZADA"
    elif any(k in combined for k in ['factura', 'presupuesto', 'precio', 'tarifa', 'pricing', 'stripe', 'roi', 'balance']):
        return "METRICAS_Y_VENTAS"
    else:
        return "DOCUMENTOS_HISTORICOS"

def extract_semantic_summary(filepath, ext):
    sample = ""
    try:
        if ext in ['.md', '.txt', '.json', '.csv', '.html', '.htm', '.py', '.ts', '.tsx', '.js']:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                sample = f.read(3000)
        elif ext == '.pdf':
            try:
                import fitz
                doc = fitz.open(filepath)
                pages = [doc[i].get_text() for i in range(min(len(doc), 3))]
                sample = "\n".join(pages)
                doc.close()
            except Exception:
                sample = f"Documento PDF: {os.path.basename(filepath)}"
        else:
            sample = f"Activo digital clasificado: {os.path.basename(filepath)}"
    except Exception:
        sample = os.path.basename(filepath)

    cleaned = " ".join(sample.split())[:300]
    return cleaned

def run_ztm_sweep():
    print("=" * 80)
    print("ANTIGRAVITY OMEGA — BUCLE ZTM DE ARCHIVO FÍSICO & RECICLAJE SEMÁNTICO (v4.20)")
    print(f"Bóveda Central: {VAULT_BASE}")
    print("=" * 80)

    os.makedirs(VAULT_BASE, exist_ok=True)
    os.makedirs(os.path.dirname(MANIFEST_PATH), exist_ok=True)
    os.makedirs(os.path.dirname(DIGEST_PATH), exist_ok=True)

    manifest = {}
    if os.path.exists(MANIFEST_PATH):
        try:
            with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
                manifest = json.load(f)
        except Exception:
            manifest = {}

    hashes = {}
    if os.path.exists(PROCESSED_HASHES_PATH):
        try:
            with open(PROCESSED_HASHES_PATH, 'r', encoding='utf-8') as f:
                hashes = json.load(f)
        except Exception:
            hashes = {}

    # Load RAG DB
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
        except Exception:
            rag_docs = []

    rag_ids = {doc.get("id") for doc in rag_docs if isinstance(doc, dict)}

    processed_count = 0
    relocated_count = 0
    pointers_count = 0
    today_str = datetime.now().strftime("%Y-%m-%d")

    new_recycled_nodes = []

    for scan_root in TARGET_SCAN_DIRS:
        if not os.path.exists(scan_root):
            continue
        print(f"\n>> Escaneando Bóveda Origen: {scan_root}")
        
        for root, dirs, files in os.walk(scan_root):
            if any(ign in root for ign in IGNORED_PATTERNS):
                continue
            
            for f in files:
                filepath = os.path.join(root, f)
                ext = os.path.splitext(f)[1].lower()

                if ext not in TEXT_DOC_EXTS and ext not in HEAVY_MEDIA_EXTS:
                    continue

                try:
                    file_size = os.path.getsize(filepath)
                except Exception:
                    continue

                if file_size == 0 or file_size > 500 * 1024 * 1024:
                    continue

                # Calculate SHA-256
                try:
                    file_hash = calculate_sha256(filepath)
                except Exception:
                    continue

                if file_hash in hashes:
                    continue

                # Handle Heavy Media vs Documents
                if ext in HEAVY_MEDIA_EXTS:
                    category = "MEDIOS_PESADOS_POINTERS"
                    record = {
                        "original_path": filepath,
                        "vault_path": filepath,
                        "category": category,
                        "sha256": file_hash,
                        "is_pointer": True,
                        "size_bytes": file_size,
                        "archived_at": datetime.now().isoformat()
                    }
                    manifest[file_hash] = record
                    hashes[file_hash] = filepath
                    pointers_count += 1

                    rag_node_id = f"ZTM-PTR-{file_hash[:12]}"
                    if rag_node_id not in rag_ids:
                        node = {
                            "id": rag_node_id,
                            "tipo": "POINTER_MULTIMEDIA_PESADO",
                            "categoria": category,
                            "titulo": f"Puntero de Archivo Multimedia: {f}",
                            "ruta_local": filepath,
                            "sha256": file_hash,
                            "tamaño_mb": round(file_size / (1024 * 1024), 2),
                            "estado": "PRESERVADO_EN_ORIGEN"
                        }
                        rag_docs.append(node)
                        rag_ids.add(rag_node_id)
                        new_recycled_nodes.append(node)
                else:
                    content_sample = extract_semantic_summary(filepath, ext)
                    category = detect_category(f, content_sample)
                    
                    target_dir = os.path.join(VAULT_BASE, category)
                    os.makedirs(target_dir, exist_ok=True)
                    target_filename = f"[{today_str}]_{f}"
                    target_path = os.path.join(target_dir, target_filename)

                    try:
                        shutil.copy2(filepath, target_path)
                        record = {
                            "original_path": filepath,
                            "vault_path": target_path,
                            "category": category,
                            "sha256": file_hash,
                            "is_pointer": False,
                            "size_bytes": file_size,
                            "archived_at": datetime.now().isoformat()
                        }
                        manifest[file_hash] = record
                        hashes[file_hash] = target_path
                        relocated_count += 1

                        rag_node_id = f"ZTM-DOC-{file_hash[:12]}"
                        if rag_node_id not in rag_ids:
                            node = {
                                "id": rag_node_id,
                                "tipo": "DOCUMENTO_ABSORBIDO_ZTM",
                                "categoria": category,
                                "titulo": f"Activo Vault: {f}",
                                "resumen_semantico": content_sample,
                                "boveda_destino": target_path,
                                "sha256": file_hash,
                                "extension": ext,
                                "fecha_absorcion": today_str
                            }
                            rag_docs.append(node)
                            rag_ids.add(rag_node_id)
                            new_recycled_nodes.append(node)
                    except Exception as err:
                        print(f"Error reubicando {filepath}: {err}")
                        continue

                processed_count += 1
                if processed_count % 25 == 0:
                    print(f">> [ZTM PROGRESS] {processed_count} archivos procesados ({relocated_count} reubicados en bóveda, {pointers_count} punteros multimedia)...", flush=True)

    # Save outputs
    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    with open(PROCESSED_HASHES_PATH, 'w', encoding='utf-8') as f:
        json.dump(hashes, f, indent=2, ensure_ascii=False)

    if is_list_rag:
        with open(RAG_DB_PATH, 'w', encoding='utf-8') as f:
            json.dump(rag_docs, f, indent=2, ensure_ascii=False)
    else:
        raw_rag["documents"] = rag_docs
        with open(RAG_DB_PATH, 'w', encoding='utf-8') as f:
            json.dump(raw_rag, f, indent=2, ensure_ascii=False)

    # Generar Digest Compacto de Reciclaje Semántico
    digest_data = {
        "version": "4.20",
        "generatedAt": datetime.now().isoformat(),
        "totalNodesInRag": len(rag_docs),
        "totalArchivedFiles": len(manifest),
        "newNodesProcessedInRun": len(new_recycled_nodes),
        "sampleNodes": new_recycled_nodes[:10] if new_recycled_nodes else rag_docs[-10:]
    }

    with open(DIGEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(digest_data, f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 80)
    print("DICTAMEN ZTM PURIST ARCHIVIST & SEMANTIC DIGEST:")
    print(f"Archivos Nuevos Procesados: {processed_count}")
    print(f"Archivos Físicamente Reubicados en Bóveda: {relocated_count}")
    print(f"Punteros de Medios Preservados: {pointers_count}")
    print(f"Total Nodos en RAG Database: {len(rag_docs)}")
    print(f"Digest Semántico Actualizado en: {DIGEST_PATH}")
    print("=" * 80)

if __name__ == "__main__":
    is_continuous = "--continuous" in sys.argv or "--loop" in sys.argv
    if is_continuous:
        print("[ZTM DAEMON] Iniciando bucle continuo de reciclaje semántico (intervalo: 60s)...")
        while True:
            run_ztm_sweep()
            time.sleep(60)
    else:
        run_ztm_sweep()
