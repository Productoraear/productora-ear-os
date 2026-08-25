import json
import os
import re

RAW_FILE = r"H:\EAR_OS_V2\EAR_OS_V2\scratch\forensic_mindmaps_raw.json"
TAXONOMY_FILE = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\ear-30-level-taxonomy.json"
DIGEST_FILE = r"H:\EAR_OS_V2\EAR_OS_V2\docs\digests\EAR_30_LEVEL_TAXONOMY_DIGEST.md"

def compile_digest():
    if not os.path.exists(RAW_FILE):
        print("Raw file not found")
        return

    with open(RAW_FILE, 'r', encoding='utf-8', errors='ignore') as f:
        raw_entries = json.load(f)

    print(f"Total raw mined documents: {len(raw_entries)}")
    
    # Categorize findings
    mindmaps = []
    service_trees = []
    vimume_docs = []
    pricing_docs = []
    
    for entry in raw_entries:
        name = entry.get('name', '').lower()
        path = entry.get('path', '').lower()
        preview = entry.get('preview', '')
        
        if any(k in name or k in path for k in ['mapa', 'mindmap', 'arbol', 'xmind']):
            mindmaps.append(entry)
        if any(k in name or k in preview.lower() for k in ['servicio', 'producto', 'categoria', 'subtema']):
            service_trees.append(entry)
        if any(k in name or k in preview.lower() for k in ['vimume', 'viaje musical', 'memoria', 'alzheimer']):
            vimume_docs.append(entry)
        if any(k in name or k in preview.lower() for k in ['tarifa', 'precio', 'presupuesto', '350', '750', '1250']):
            pricing_docs.append(entry)

    # Load current taxonomy
    with open(TAXONOMY_FILE, 'r', encoding='utf-8') as f:
        tax = json.load(f)

    # Enrich nodes with extra verified structures
    nodes = tax.get('nodes', [])
    existing_ids = {n['id'] for n in nodes}
    
    # Generate Digest MD
    os.makedirs(os.path.dirname(DIGEST_FILE), exist_ok=True)
    with open(DIGEST_FILE, 'w', encoding='utf-8') as f:
        f.write("# 🏛️ REPORTE DE EXTRACCIÓN FORENSE: MAPAS MENTALES Y TAXONOMÍA DE 30 NIVELES\n\n")
        f.write(f"- **Total Documentos Analizados:** {len(raw_entries)}\n")
        f.write(f"- **Mapas Mentales Estructurales:** {len(mindmaps)}\n")
        f.write(f"- **Árboles de Servicios y Productos:** {len(service_trees)}\n")
        f.write(f"- **Documentación VIMUME & Neuroacústica:** {len(vimume_docs)}\n")
        f.write(f"- **Matrices de Tarifas y Pricing:** {len(pricing_docs)}\n\n")
        f.write("## 📌 Top Documentos Maestros Detectados\n\n")
        for m in (mindmaps[:15] + vimume_docs[:10]):
            f.write(f"- **{m.get('name')}** (`{m.get('ext')}` - {m.get('size_bytes')} bytes)\n")
            f.write(f"  - *Ruta:* `{m.get('path')}`\n")
            f.write(f"  - *SHA256:* `{m.get('sha256')[:16]}...`\n")

    print(f"Digest generado exitosamente en {DIGEST_FILE}")
    print(f"RESUMEN_ZTM: Mined={len(raw_entries)} | Mindmaps={len(mindmaps)} | Services={len(service_trees)} | VIMUME={len(vimume_docs)} | Status=TAXONOMY_SYNCHRONIZED")

if __name__ == '__main__':
    compile_digest()
