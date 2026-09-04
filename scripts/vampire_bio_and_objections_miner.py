import os
import json
import concurrent.futures
import re
import string

EXCLUDED_DIRS = {
    'windows', 'program files', 'program files (x86)', 'programdata', 'appdata', 
    'node_modules', '.git', '.next', 'temp', 'tmp', '$recycle.bin', 'system volume information'
}
TARGET_EXTENSIONS = {'.txt', '.json', '.md', '.vtt', '.srt'}

BIO_KEYWORDS = ['edwin agudelo', 'biografía', 'nacimiento', 'trayectoria', 'tenor']
OBJECTIONS_KEYWORDS = ['dani aragón', 'incubadora', 'objeciones', 'ventas', 'takeaway', 'ticket']

def get_drives():
    return [f"{d}:\\" for d in string.ascii_uppercase if os.path.exists(f"{d}:\\")]

def scan_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read().lower()
            
            has_bio = any(k in content for k in BIO_KEYWORDS)
            has_obj = any(k in content for k in OBJECTIONS_KEYWORDS)
            
            if has_bio or has_obj:
                return {
                    'filepath': filepath,
                    'has_bio': has_bio,
                    'has_obj': has_obj,
                    'content_snippet': content[:1000] # store a snippet for manual review
                }
    except Exception:
        pass
    return None

def scan_directory(drive):
    results = []
    for root, dirs, files in os.walk(drive):
        # Exclude directories in-place
        dirs[:] = [d for d in dirs if d.lower() not in EXCLUDED_DIRS]
        
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in TARGET_EXTENSIONS:
                filepath = os.path.join(root, file)
                res = scan_file(filepath)
                if res:
                    results.append(res)
    return results

def main():
    print("[OMNI-DRIVE MINER] Inicializando escáner forense...")
    drives = get_drives()
    print(f"[OMNI-DRIVE MINER] Unidades detectadas: {drives}")
    
    all_results = []
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(drives)*2) as executor:
        future_to_drive = {executor.submit(scan_directory, drive): drive for drive in drives}
        for future in concurrent.futures.as_completed(future_to_drive):
            drive = future_to_drive[future]
            try:
                res = future.result()
                all_results.extend(res)
                print(f"[OMNI-DRIVE MINER] Escaneo completado en unidad {drive}. Archivos relevantes encontrados: {len(res)}")
            except Exception as exc:
                print(f"[OMNI-DRIVE MINER] Error escaneando {drive}: {exc}")
                
    # Process results
    bio_data = [r for r in all_results if r['has_bio']]
    obj_data = [r for r in all_results if r['has_obj']]
    
    # Save as Drafts
    base_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'data')
    os.makedirs(base_dir, exist_ok=True)
    
    bio_out = os.path.join(base_dir, 'edwin-true-bio-ssot_draft.json')
    obj_out = os.path.join(base_dir, 'oraculo-300-objeciones-ssot_draft.json')
    
    with open(bio_out, 'w', encoding='utf-8') as f:
        json.dump({
            "status": "DRAFT",
            "source": "Omni-Drive Miner",
            "data": bio_data if bio_data else None
        }, f, indent=2, ensure_ascii=False)
        
    with open(obj_out, 'w', encoding='utf-8') as f:
        json.dump({
            "status": "DRAFT",
            "source": "Omni-Drive Miner",
            "data": obj_data if obj_data else None
        }, f, indent=2, ensure_ascii=False)

    print(f"[OMNI-DRIVE MINER] Extracción finalizada con Exit Code 0.")
    print(f" -> {bio_out}")
    print(f" -> {obj_out}")

if __name__ == '__main__':
    main()
