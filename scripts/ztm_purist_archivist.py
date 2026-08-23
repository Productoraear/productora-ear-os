import os
import json
import hashlib
import shutil
from datetime import datetime

VAULT_BASE = r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT"
MANIFEST_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\scripts\.archived_manifest.json"
PROCESSED_HASHES_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\scripts\.processed_hashes.json"

def calculate_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def archive_ingested_file(source_path, category="DERECHOS_DE_AUTOR"):
    if not os.path.exists(source_path):
        return None
    
    # Heavy video files remain in place, only hash & pointer stored
    ext = os.path.splitext(source_path)[1].lower()
    if ext in ['.mp4', '.mov', '.avi', '.mkv']:
        file_hash = calculate_sha256(source_path)
        print(f"Puntero de vídeo registrado (sin mover): {source_path} [SHA: {file_hash[:8]}]")
        return {"status": "POINTER_ONLY", "path": source_path, "hash": file_hash}

    file_hash = calculate_sha256(source_path)
    today_str = datetime.now().strftime("%Y-%m-%d")
    filename = os.path.basename(source_path)
    target_dir = os.path.join(VAULT_BASE, category)
    os.makedirs(target_dir, exist_ok=True)
    
    target_filename = f"[{today_str}]_{filename}"
    target_path = os.path.join(target_dir, target_filename)

    # Load manifests
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

    if file_hash in hashes:
        print(f"Archivo ya archivado previamente: {source_path}")
        return manifest.get(file_hash)

    # Copy / Move to vault
    try:
        shutil.copy2(source_path, target_path)
        record = {
            "original_path": source_path,
            "vault_path": target_path,
            "category": category,
            "sha256": file_hash,
            "archived_at": datetime.now().isoformat()
        }
        manifest[file_hash] = record
        hashes[file_hash] = target_path

        with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2, ensure_ascii=False)
        with open(PROCESSED_HASHES_PATH, 'w', encoding='utf-8') as f:
            json.dump(hashes, f, indent=2, ensure_ascii=False)

        print(f"Archivado con éxito en Bóveda Central: {target_path}")
        return record
    except Exception as e:
        print(f"Error al archivar {source_path}: {e}")
        return None

if __name__ == "__main__":
    print("Módulo Archivista Purista ZTM cargado.")
