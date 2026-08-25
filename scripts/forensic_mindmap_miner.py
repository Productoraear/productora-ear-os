import os
import sys
import json
import re
import datetime
import hashlib
from pathlib import Path

# Try importing PDF reader
has_fitz = False
try:
    import fitz # PyMuPDF
    has_fitz = True
except ImportError:
    pass

has_pypdf = False
if not has_fitz:
    try:
        import pypdf
        has_pypdf = True
    except ImportError:
        pass

# Roots to scan
SCAN_ROOTS = [
    r"C:\Users\M2-W10\Documents",
    r"C:\Users\M2-W10\Desktop",
    r"C:\Users\M2-W10\Downloads",
    r"C:\Users\M2-W10\Proyectos",
    r"D:\00_SILICON_VALLEY_MASTER_ARCHIVE",
    r"D:\Proyectos",
    r"D:\00_PRODUCTORA_EAR",
    r"H:\00_PRODUCTORA_EAR",
    r"H:\00 EAR_OS_LEGACY_STAGING",
    r"H:\EAR_OS_V2"
]

EXCLUDE_DIRS = {
    'node_modules', '.git', '.next', 'AppData', 'Windows', 'Program Files', 
    'Program Files (x86)', '$Recycle.Bin', 'System Volume Information',
    '.vscode', '.idea', 'dist', 'build', '__pycache__'
}

MINDMAP_EXTS = {'.pdf', '.xmind', '.mm', '.mmap', '.opml', '.json', '.md', '.txt', '.docx'}

PATTERNS = [
    r'mapa.*mental', r'mindmap', r'mind.*map', r'arbol.*servicio', r'catalogo',
    r'categoria', r'servicio', r'producto', r'necesidad', r'subtema', r'vimume',
    r'viaje.*musical', r'propuesta.*valor', r'incubadora', r'dani.*aragon', r'tarifas'
]
COMPILED_PATTERNS = [re.compile(p, re.IGNORECASE) for p in PATTERNS]

def is_matching_name(filename):
    for pat in COMPILED_PATTERNS:
        if pat.search(filename):
            return True
    return False

def extract_pdf_text(filepath, max_pages=15):
    text = ""
    try:
        if has_fitz:
            doc = fitz.open(filepath)
            for i, page in enumerate(doc):
                if i >= max_pages:
                    break
                text += page.get_text() + "\n"
        elif has_pypdf:
            reader = pypdf.PdfReader(filepath)
            for i, page in enumerate(reader.pages):
                if i >= max_pages:
                    break
                t = page.extract_text()
                if t:
                    text += t + "\n"
    except Exception as e:
        text = f"[Error extracting PDF: {e}]"
    return text

def calculate_sha256(filepath):
    h = hashlib.sha256()
    try:
        with open(filepath, 'rb') as f:
            while chunk := f.read(65536):
                h.update(chunk)
        return h.hexdigest()
    except Exception:
        return ""

def scan_system():
    discovered_files = []
    seen_paths = set()
    
    print("Iniciando escaneo forense de mapas mentales, servicios y productos...")
    
    for root_dir in SCAN_ROOTS:
        if not os.path.exists(root_dir):
            continue
        print(f"Escaneando raíz: {root_dir}")
        for current_root, dirs, files in os.walk(root_dir, topdown=True):
            # Prune exclude dirs
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
            
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext in MINDMAP_EXTS:
                    full_path = os.path.join(current_root, file)
                    norm_path = os.path.normpath(full_path)
                    if norm_path in seen_paths:
                        continue
                    seen_paths.add(norm_path)
                    
                    # Check filename match or special file formats
                    is_special_mindmap = ext in {'.xmind', '.mm', '.mmap', '.opml'}
                    is_name_match = is_matching_name(file)
                    
                    if is_special_mindmap or is_name_match or 'viaje' in norm_path.lower() or 'vimume' in norm_path.lower() or 'mapa' in norm_path.lower():
                        discovered_files.append({
                            'path': norm_path,
                            'name': file,
                            'ext': ext,
                            'size': os.path.getsize(norm_path) if os.path.exists(norm_path) else 0
                        })

    print(f"Total de archivos candidatos encontrados: {len(discovered_files)}")
    
    # Process and extract content from matching files
    results = []
    manifest = []
    
    for item in discovered_files:
        p = item['path']
        ext = item['ext']
        content_preview = ""
        
        try:
            if ext == '.pdf':
                raw_text = extract_pdf_text(p)
                content_preview = raw_text[:2500]
            elif ext in {'.txt', '.md', '.json', '.opml'}:
                if os.path.getsize(p) < 1000000: # 1MB max
                    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
                        content_preview = f.read(2500)
            elif ext == '.docx':
                content_preview = "[Documento DOCX detectado]"
            elif ext == '.xmind':
                content_preview = "[Archivo Nativo XMind Mindmap detectado]"
            
            sha256 = calculate_sha256(p)
            
            entry = {
                'path': p,
                'name': item['name'],
                'ext': ext,
                'size_bytes': item['size'],
                'sha256': sha256,
                'preview': content_preview.strip()
            }
            results.append(entry)
            manifest.append({
                'original_path': p,
                'sha256': sha256,
                'timestamp': datetime.datetime.now().isoformat(),
                'status': 'MINED'
            })
        except Exception as e:
            print(f"Error procesando {p}: {e}")
            
    # Output to scratch and docs
    out_json = r"H:\EAR_OS_V2\EAR_OS_V2\scratch\forensic_mindmaps_raw.json"
    os.makedirs(os.path.dirname(out_json), exist_ok=True)
    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
        
    print(f"Resultados guardados en {out_json}")
    return results

if __name__ == '__main__':
    scan_system()
