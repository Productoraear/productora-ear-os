import sys
import os
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

print("[*] Iniciando recolección instantánea...")
sys.stdout.flush()

matched_files = set()

def check_match(text):
    t = text.lower()
    res = []
    for cat, pats in CATEGORIES.items():
        for pat in pats:
            if pat in t:
                res.append(cat)
                break
    return res

# 1. Direct file search on H: fast directories
H_DIRS = [
    Path(r"H:\00_PRODUCTORA_EAR"),
    Path(r"H:\EAR_OS_MASTER_2026"),
    Path(r"H:\EAR_OS_BUNKER_CONSOLIDADO"),
    Path(r"H:\EAR_VAULT_XMIND_INBOX"),
    Path(r"H:\SANTUARIO_EAR"),
    Path(r"H:\SANTUARIO_RESCATE_FINAL"),
    Path(r"C:\EAR_OS_V2\BASE_DE_CONOCIMIENTO"),
    Path(r"C:\EAR_OS_V2\docs")
]

for h_dir in H_DIRS:
    if not h_dir.exists():
        continue
    print(f"[*] Buscando en {h_dir}...")
    sys.stdout.flush()
    for root, dirs, files in os.walk(h_dir):
        for f in files:
            cats = check_match(f)
            if cats:
                fp = Path(root) / f
                for c in cats:
                    matched_files.add((fp, c))

# 2. Line by line regex scan of ADN_EAR_INDEX.json without loading 587MB JSON
adn_path = Path(r"C:\EAR_OS_V2\src\data\catalog\ADN_EAR_INDEX.json")
if adn_path.exists():
    print("[*] Escaneando stream de ADN_EAR_INDEX.json...")
    sys.stdout.flush()
    pattern = re.compile(r'"(?:path|file_name)"\s*:\s*"([^"]+)"', re.IGNORECASE)
    with open(adn_path, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            m = pattern.search(line)
            if m:
                val = m.group(1).replace("\\\\", "\\")
                cats = check_match(os.path.basename(val))
                if cats:
                    p = Path(val)
                    if p.exists():
                        for c in cats:
                            matched_files.add((p, c))

print(f"[*] Total activos encontrados: {len(matched_files)}")
sys.stdout.flush()

manifest = []
for p, cat in matched_files:
    if not p.exists() or p.is_dir():
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
        manifest.append({
            "name": dest_file.name,
            "category": cat,
            "original_path": str(p),
            "target_path": str(dest_file),
            "size_kb": round(p.stat().st_size / 1024, 2)
        })
    except Exception as e:
        print(f"Error copiando {p}: {e}")

# Markdown index
md_lines = [
    "# 🚀 INCUBADORA DESPEGUE - ACTIVOS CONSOLIDADOS",
    f"**Ruta Directa:** `{TARGET_ROOT}`",
    f"**Total Activos Unificados:** {len(manifest)}",
    "",
    "---",
    ""
]

by_cat = {}
for m in manifest:
    by_cat.setdefault(m["category"], []).append(m)

for cat_name, items in sorted(by_cat.items()):
    md_lines.append(f"## 📂 {cat_name} ({len(items)} archivos)")
    md_lines.append(f"**Directorio:** `{TARGET_ROOT / cat_name}`")
    md_lines.append("")
    md_lines.append("| Archivo | Tamaño (KB) | Ruta Origen |")
    md_lines.append("|---|---|---|")
    for item in sorted(items, key=lambda x: x["name"]):
        md_lines.append(f"| `{item['name']}` | {item['size_kb']} | `{item['original_path']}` |")
    md_lines.append("")

with open(TARGET_ROOT / "INDICE_INCUBADORA.md", "w", encoding="utf-8") as f:
    f.write("\n".join(md_lines))

with open(TARGET_ROOT / "manifest.json", "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print(f"[✅] ¡UNIFICACIÓN COMPLETADA!")
print(f"[✅] Ruta directa: {TARGET_ROOT}")
