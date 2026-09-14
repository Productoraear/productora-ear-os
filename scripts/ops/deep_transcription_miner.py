import os
import sys
import json
import re
from pathlib import Path

# Force UTF-8 on Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

DRIVES_TO_SCAN = [
    Path(r"H:\ "),
    Path(r"D:\ "),
    Path(r"E:\ "),
    Path(r"F:\ "),
    Path(r"G:\ "),
    Path(r"L:\ "),
    Path(r"C:\Users\M2-W10")
]

# Clean up drive paths
SCAN_PATHS = []
for d in DRIVES_TO_SCAN:
    clean_p = Path(str(d).strip())
    if clean_p.exists():
        SCAN_PATHS.append(clean_p)

EXCLUDE_DIRS = {
    "windows", "program files", "program files (x86)", "$recycle.bin", 
    "system volume information", "appdata", "node_modules", ".git", 
    ".next", ".vscode", "temp", "tmp"
}

print("="*80)
print("🔍 BÚSQUEDA FORENSE PROFUNDA DE TRANSCRIPCIONES EN TODO EL ORDENADOR")
print(f"Unidades a escanear: {[str(p) for p in SCAN_PATHS]}")
print("="*80)

discovered = []

for root_path in SCAN_PATHS:
    print(f"\n📂 Escaneando unidad: {root_path}...")
    for root, dirs, files in os.walk(root_path):
        # Filter out system and noise dirs
        dirs[:] = [d for d in dirs if d.lower() not in EXCLUDE_DIRS and not d.startswith(".")]
        
        for f in files:
            f_lower = f.lower()
            # 1. Match by obvious names
            is_candidate = False
            if any(k in f_lower for k in ["transcrip", "whisper", "_cue", "subtitles", "transcrito"]):
                is_candidate = True
            elif f_lower.endswith((".srt", ".vtt")):
                is_candidate = True
            elif f_lower.endswith(".json") and "transcription" in f_lower:
                is_candidate = True
            elif "clase " in f_lower and (f_lower.endswith(".txt") or f_lower.endswith(".md")):
                is_candidate = True
            
            if is_candidate:
                full_path = Path(root) / f
                try:
                    sz = full_path.stat().st_size
                    if 200 < sz < 50 * 1024 * 1024: # between 200B and 50MB
                        discovered.append({
                            "name": f,
                            "path": str(full_path),
                            "size_kb": round(sz / 1024, 1),
                            "drive": str(root_path)[:2]
                        })
                except Exception:
                    pass

print("\n" + "="*80)
print(f"🎯 TOTAL TRANSCRIPCIONES Y CANDIDATOS ENCONTRADOS: {len(discovered)}")
print("="*80)

# Group by folder/directory
by_folder = {}
for item in discovered:
    parent = str(Path(item["path"]).parent)
    by_folder[parent] = by_folder.get(parent, 0) + 1

print("\n📊 DISTRIBUCIÓN POR CARPETAS:")
for folder, count in sorted(by_folder.items(), key=lambda x: x[1], reverse=True)[:25]:
    print(f"  [{count} archivos] -> {folder}")

# Save master forensic report
report_path = Path("reports/all_pc_transcriptions_forensic_discovery.json")
report_path.parent.mkdir(parents=True, exist_ok=True)
with open(report_path, "w", encoding="utf-8") as fp:
    json.dump(discovered, fp, indent=2, ensure_ascii=False)

print(f"\n💾 Informe detallado guardado en: {report_path}")
