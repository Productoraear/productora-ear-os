import os
import re
import warnings
from pypdf import PdfReader

# Silenciar advertencias de cabeceras PDF inválidas
warnings.filterwarnings("ignore")

def auditoria_mapear_acotada():
    target_dirs = [
        r"H:\EAR_OS_V2\EAR_OS_V2",
        r"H:\incubadora despegue"
    ]
    
    mds_found = []
    pdfs_found = []
    
    print("🔎 Escaneando mapas y PDFs en carpetas estratégicas de proyectos...")
    
    for t_dir in target_dirs:
        if not os.path.exists(t_dir):
            continue
        for root, dirs, files in os.walk(t_dir):
            # Omitir dependencias y cachés pesados
            dirs[:] = [d for d in dirs if d.lower() not in {"node_modules", ".git", ".next", "dist", "build"}]
            for file in files:
                filepath = os.path.join(root, file)
                
                # 1. Búsqueda de Master Maps MD
                if "MASTER_MAP" in file or file.endswith(".md"):
                    try:
                        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            if re.search(r'^(#|\t*-|\s*-)', content, re.MULTILINE):
                                mds_found.append(filepath)
                    except Exception:
                        pass
                
                # 2. Búsqueda de PDFs válidos (límite de tamaño: < 20MB, > 1KB)
                elif file.lower().endswith('.pdf'):
                    try:
                        size = os.path.getsize(filepath)
                        if 1024 < size < 20 * 1024 * 1024:
                            reader = PdfReader(filepath, strict=False)
                            meta = str(reader.metadata).lower() if reader.metadata else ""
                            if "xmind" in meta:
                                pdfs_found.append(filepath)
                    except Exception:
                        pass
                        
    return mds_found, pdfs_found

mds, pdfs = auditoria_mapear_acotada()

print(f"\n✅ Auditoría Finalizada:")
print(f"  • Mapas Markdown (.md): {len(mds)}")
print(f"  • PDFs de Xmind: {len(pdfs)}")
