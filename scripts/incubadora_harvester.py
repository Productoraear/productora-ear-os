import os
import sys
import shutil
import json
import re
from pathlib import Path

TARGET_ROOT = Path(r"H:\incubadora despegue")
TARGET_ROOT.mkdir(parents=True, exist_ok=True)

CATEGORIES = {
    "AMPLIFY_MEDIA": ["amplify media", "amplifymedia", "amplify_media", "amplify-media", "amplify"],
    "AMPLIFY_NEWS": ["amplify news", "amplifynews", "amplify_news", "amplify-news"],
    "MOMENTUM": ["momentum"],
    "LA_BOMBILLA": ["la bombilla", "labombilla", "la_bombilla", "la-bombilla", "bombilla"],
    "INFLUENCE": ["influence"],
    "VELOCITY": ["velocity"]
}

for cat in CATEGORIES.keys():
    (TARGET_ROOT / cat).mkdir(parents=True, exist_ok=True)
(TARGET_ROOT / "OTROS_Y_DOCUMENTOS").mkdir(parents=True, exist_ok=True)

SEARCH_ROOTS = [
    Path(r"H:\EAR_OS_BUNKER_CONSOLIDADO"),
    Path(r"H:\EAR_OS_MASTER_2026"),
    Path(r"H:\EAR_OS_V2"),
    Path(r"H:\00_PRODUCTORA_EAR"),
    Path(r"H:\EAR_VAULT_XMIND_INBOX"),
    Path(r"H:\SANTUARIO_EAR"),
    Path(r"H:\SANTUARIO_RESCATE_FINAL"),
    Path(r"C:\EAR_OS_V2"),
    Path(r"D:\00_SILICON_VALLEY_MASTER_ARCHIVE"),
    Path(r"D:\01_VERTICAL_EVENTOS"),
    Path(r"D:\02_VERTICAL_VIMUME"),
    Path(r"D:\EAR_OS_INTEL_BUNKER"),
    Path(r"D:\EAR_VAULT"),
    Path(r"D:\VAMPIRIZADOS")
]

SKIP_DIRS = {
    ".git", "node_modules", ".next", ".cache", "AppData", "$RECYCLE.BIN", 
    "System Volume Information", "Epic Games", "Windows", "Program Files",
    "BRUTOS_VIDEO", "BRUTOS_AUDIO", "BRUTOS_FOTOS", "COPIAS_DE_SEGURIDAD",
    "MUSICA_PERSONAL_(Coleccion_FLAC)", "_PAPELERA_REVISION", "HDAVINCI_WORKINGPROXIES",
    "incubadora despegue"
}

found_items = []
copied_count = 0
total_bytes_copied = 0

print(f"[*] Iniciando rastreo optimizado de alta velocidad hacia {TARGET_ROOT}...")

def match_categories(name_or_text):
    text_lower = name_or_text.lower()
    matched = []
    for cat, patterns in CATEGORIES.items():
        for pat in patterns:
            if len(pat) <= 4:
                if re.search(r'\b' + re.escape(pat) + r'\b', text_lower):
                    matched.append(cat)
                    break
            else:
                if pat in text_lower:
                    matched.append(cat)
                    break
    return matched

# 1. Search in ADN_EAR_INDEX.json if exists
adn_index_path = Path(r"C:\EAR_OS_V2\src\data\catalog\ADN_EAR_INDEX.json")
if adn_index_path.exists():
    try:
        print("[*] Escaneando ADN_EAR_INDEX.json...")
        with open(adn_index_path, "r", encoding="utf-8", errors="ignore") as f:
            data = json.load(f)
            if isinstance(data, list):
                for entry in data:
                    path_str = entry.get("path") or entry.get("file") or entry.get("filepath")
                    if path_str and os.path.exists(path_str):
                        cats = match_categories(os.path.basename(path_str))
                        if cats:
                            for c in cats:
                                found_items.append((Path(path_str), c, "ADN_INDEX"))
    except Exception as e:
        print(f"[!] Error leyendo ADN_EAR_INDEX.json: {e}")

# 2. Filesystem Crawl
for s_root in SEARCH_ROOTS:
    if not s_root.exists():
        continue
    print(f"[*] Escaneando raíz: {s_root}...")
    try:
        for root, dirs, files in os.walk(s_root):
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith(".")]
            
            for file in files:
                f_path = Path(root) / file
                cats = match_categories(file)
                if cats:
                    for c in cats:
                        found_items.append((f_path, c, "FILENAME_MATCH"))
                elif file.endswith((".md", ".txt", ".json", ".ts", ".tsx", ".js", ".jsx", ".html", ".py", ".xmind")):
                    try:
                        if f_path.stat().st_size < 1024 * 1024: # max 1MB
                            with open(f_path, "r", encoding="utf-8", errors="ignore") as tf:
                                content = tf.read(10240) # first 10KB
                                ccats = match_categories(content)
                                for c in ccats:
                                    found_items.append((f_path, c, "CONTENT_MATCH"))
                    except Exception:
                        pass
    except Exception as e:
        print(f"[!] Error escaneando {s_root}: {e}")

# Deduplicate
unique_items = {}
for p, cat, method in found_items:
    key = (str(p).lower(), cat)
    if key not in unique_items:
        unique_items[key] = (p, cat, method)

print(f"[*] Total activos únicos identificados: {len(unique_items)}")

# Copy items to target directory
manifest_records = []
for (p_lower, cat), (p, cat, method) in unique_items.items():
    if not p.exists() or p.is_dir():
        continue
    
    if str(p).startswith(str(TARGET_ROOT)):
        continue

    dest_dir = TARGET_ROOT / cat
    dest_file = dest_dir / p.name
    
    counter = 1
    while dest_file.exists() and dest_file.stat().st_size != p.stat().st_size:
        dest_file = dest_dir / f"{p.stem}_{counter}{p.suffix}"
        counter += 1
        
    try:
        if not dest_file.exists():
            shutil.copy2(p, dest_file)
            copied_count += 1
            total_bytes_copied += p.stat().st_size
        
        manifest_records.append({
            "name": dest_file.name,
            "category": cat,
            "original_path": str(p),
            "target_path": str(dest_file),
            "size_kb": round(p.stat().st_size / 1024, 2),
            "detection_method": method
        })
    except Exception as e:
        print(f"[!] Error copiando {p} a {dest_file}: {e}")

# Generate Master Index Markdown
md_lines = [
    "# 🚀 INCUBADORA DESPEGUE - CATÁLOGO DE ACTIVOS UNIFICADOS",
    f"**Ruta Raíz en Disco H:** `{TARGET_ROOT}`",
    f"**Total Activos Identificados y Unificados:** {len(manifest_records)}",
    f"**Volumen Total Consolidado:** {round(total_bytes_copied / (1024 * 1024), 2)} MB",
    "",
    "---",
    "",
    "## 📁 Distribución por Categorías Clave",
    ""
]

by_cat = {}
for rec in manifest_records:
    by_cat.setdefault(rec["category"], []).append(rec)

for cat_name, items in sorted(by_cat.items()):
    md_lines.append(f"### 📂 {cat_name} ({len(items)} activos)")
    md_lines.append(f"**Ubicación Directa:** `{TARGET_ROOT / cat_name}`")
    md_lines.append("")
    md_lines.append("| Archivo | Tamaño (KB) | Detección | Ruta Origen |")
    md_lines.append("|---|---|---|---|")
    for item in sorted(items, key=lambda x: x["name"])[:50]: # top 50 per category in md
        md_lines.append(f"| `{item['name']}` | {item['size_kb']} | {item['detection_method']} | `{item['original_path']}` |")
    if len(items) > 50:
        md_lines.append(f"| *... y {len(items)-50} archivos adicionales* | | | |")
    md_lines.append("")

index_md_path = TARGET_ROOT / "INDICE_MAESTRO_INCUBADORA.md"
with open(index_md_path, "w", encoding="utf-8") as f:
    f.write("\n".join(md_lines))

manifest_json_path = TARGET_ROOT / "manifest_incubadora.json"
with open(manifest_json_path, "w", encoding="utf-8") as f:
    json.dump(manifest_records, f, indent=2, ensure_ascii=False)

print(f"[✅] PROCESO COMPLETADO.")
print(f"[✅] Archivos consolidados: {copied_count}")
print(f"[✅] Directorio disponible en: {TARGET_ROOT}")
print(f"[✅] Índice maestro guardado en: {index_md_path}")
