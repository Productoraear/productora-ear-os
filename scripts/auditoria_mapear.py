import os
import re
import string
try:
    from pypdf import PdfReader
except ImportError:
    print("❌ Error: No se pudo cargar pypdf. Instala con 'python -m pip install pypdf'")
    exit()

def auditoria_mapear():
    archivos_md_encontrados = []
    archivos_pdf_encontrados = []
    
    # Detectar todas las unidades montadas (C:\, D:\, H:\, etc.)
    drives = [f"{d}:\\" for d in string.ascii_uppercase if os.path.exists(f"{d}:\\")]
    skip_dirs = {"windows", "$recycle.bin", "program files", "program files (x86)", "node_modules", ".git", "appdata"}
    
    print(f"🔎 Iniciando escaneo profundo en unidades: {', '.join(drives)}...")

    for drive in drives:
        print(f"📂 Auditando disco {drive}...")
        for root, dirs, files in os.walk(drive):
            dirs[:] = [d for d in dirs if d.lower() not in skip_dirs]
            for file in files:
                filepath = os.path.join(root, file)
                
                # 1. Búsqueda y validación del Master Map MD
                if file == "EAR_OS_MASTER_MAP.md" or "MASTER_MAP" in file:
                    try:
                        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                            contenido = f.read()
                            if re.search(r'^(#|\t*-|\s*-)', contenido, re.MULTILINE):
                                archivos_md_encontrados.append(filepath)
                    except Exception:
                        pass

                # 2. Búsqueda profunda en PDFs (Metadatos y Marca de Agua Xmind)
                elif file.lower().endswith('.pdf'):
                    try:
                        reader = PdfReader(filepath)
                        meta = reader.metadata
                        meta_str = str(meta).lower() if meta else ""
                        
                        if "xmind" in meta_str:
                            archivos_pdf_encontrados.append(filepath)
                            continue
                        
                        if len(reader.pages) > 0:
                            texto_pagina = reader.pages[0].extract_text().lower()
                            if "presented with xmind" in texto_pagina or "xmind" in texto_pagina:
                                archivos_pdf_encontrados.append(filepath)
                    except Exception:
                        pass

    return archivos_md_encontrados, archivos_pdf_encontrados

mds, pdfs = auditoria_mapear()

print("\n" + "="*70)
print("📊 RESULTADOS DE AUDITORÍA MAPEAR / XMIND")
print("="*70)
print(f"📄 Master Maps (.md) encontrados: {len(mds)}")
for md in mds: 
    print(f"  • {md}")

print(f"\n📑 PDFs con huella Xmind encontrados: {len(pdfs)}")
for pdf in pdfs: 
    print(f"  • {pdf}")
