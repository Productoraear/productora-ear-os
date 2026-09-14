import os
import re
import json
from pathlib import Path

# Load catalog
catalog_path = Path("reports/velocity_media_master_catalog.json")
with open(catalog_path, "r", encoding="utf-8") as f:
    catalog = json.load(f)

print(f"Buscando {len(catalog)} contenidos en el sistema de archivos...")

# Normalize function
def clean_str(s):
    s = s.lower()
    s = re.sub(r'[^\w\s]', '', s)
    return s.strip()

keywords = []
for item in catalog:
    t = clean_str(item['title'])
    if len(t) > 3:
        keywords.append((t, item['title']))

# Drives to scan
drives = ["D:\\", "E:\\", "H:\\", "L:\\"]
found_matches = []

# Scan for video, audio, text files
valid_exts = {".mp4", ".mkv", ".mp3", ".m4a", ".wav", ".pdf", ".txt", ".md", ".vtt", ".srt"}

for drive in drives:
    if not os.path.exists(drive):
        continue
    print(f"Escaneando unidad {drive}...")
    try:
        for root, dirs, files in os.walk(drive):
            # Skip hidden / heavy system dirs
            if any(p in root.lower() for p in ["$recycle.bin", "system volume", "node_modules", ".git", "appdata"]):
                continue
            
            # Check folder name first
            folder_clean = clean_str(os.path.basename(root))
            for kw, title in keywords:
                if kw in folder_clean:
                    found_matches.append({
                        "matched_title": title,
                        "type": "DIRECTORY",
                        "path": root,
                        "file_count": len(files)
                    })
            
            # Check individual files
            for f in files:
                ext = os.path.splitext(f)[1].lower()
                if ext in valid_exts:
                    f_clean = clean_str(f)
                    for kw, title in keywords:
                        if kw in f_clean:
                            found_matches.append({
                                "matched_title": title,
                                "type": "FILE",
                                "path": os.path.join(root, f),
                                "ext": ext
                            })
    except Exception as e:
        print(f"Error escaneando {drive}: {e}")

# Deduplicate and group by course
matches_by_course = {}
for m in found_matches:
    t = m["matched_title"]
    if t not in matches_by_course:
        matches_by_course[t] = []
    matches_by_course[t].append(m)

report = {
    "total_catalog": len(catalog),
    "found_courses_count": len(matches_by_course),
    "missing_courses_count": len(catalog) - len(matches_by_course),
    "percentage_found": round((len(matches_by_course) / len(catalog)) * 100, 1),
    "found": matches_by_course,
    "missing": [c for c in catalog if c["title"] not in matches_by_course]
}

report_path = Path("reports/velocity_media_cross_audit.json")
with open(report_path, "w", encoding="utf-8") as f:
    json.dump(report, f, indent=2, ensure_ascii=False)

print("\n" + "="*70)
print(f"📊 REPORTE DE AUDITORÍA FORENSE VELOCITY MEDIA")
print("="*70)
print(f"Total en Catálogo: {report['total_catalog']}")
print(f"Encontrados en PC: {report['found_courses_count']} ({report['percentage_found']}%)")
print(f"Faltantes en PC:   {report['missing_courses_count']}")
print("\n--- CONTENIDOS ENCONTRADOS EN PC ---")
for t, items in matches_by_course.items():
    print(f" ✅ {t} ({len(items)} archivos/carpetas encontrados)")
    for it in items[:2]:
        print(f"     -> [{it['type']}] {it['path']}")

print("\n--- CONTENIDOS FALTANTES QUE DEBEMOS DESCARGAR ---")
for c in report["missing"]:
    print(f" ❌ [{c.get('category', 'N/A')}] {c['title']} ({c.get('clases', '?')} | {c.get('duracion', '?')})")
