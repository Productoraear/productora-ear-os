import os
import json
from pathlib import Path

velocity_root = Path(r"D:\COPIAS_DE_SEGURIDAD\EAR os posible recuperacion\Carpeta desconocida\VELOCITY")

# Catalog from web
catalog_path = Path("reports/velocity_media_master_catalog.json")
with open(catalog_path, "r", encoding="utf-8") as f:
    web_catalog = json.load(f)

local_inventory = {}

for cat_dir in sorted(velocity_root.iterdir()):
    if cat_dir.is_dir():
        cat_name = cat_dir.name
        local_inventory[cat_name] = []
        for course_dir in sorted(cat_dir.iterdir()):
            if course_dir.is_dir():
                files = list(course_dir.glob("*.*"))
                media_files = [f for f in files if f.suffix.lower() in [".mp4", ".mp3", ".m4a", ".mkv", ".wav"]]
                text_files = [f for f in files if f.suffix.lower() in [".pdf", ".txt", ".md", ".vtt", ".srt"]]
                total_size_mb = sum(f.stat().st_size for f in files) / (1024 * 1024)
                
                local_inventory[cat_name].append({
                    "course_folder": course_dir.name,
                    "path": str(course_dir),
                    "media_count": len(media_files),
                    "text_count": len(text_files),
                    "total_files": len(files),
                    "size_mb": round(total_size_mb, 1),
                    "sample_files": [f.name for f in media_files[:3]]
                })

# Save detailed inventory
out_path = Path("reports/velocity_local_perfect_inventory.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(local_inventory, f, indent=2, ensure_ascii=False)

print("="*80)
print(f"🏛️ INVENTARIO FORENSE VELOCITY EN PC")
print(f"Ruta raíz: {velocity_root}")
print("="*80)

total_courses = 0
total_files = 0
total_gb = 0

for cat, courses in local_inventory.items():
    cat_files = sum(c["total_files"] for c in courses)
    cat_mb = sum(c["size_mb"] for c in courses)
    total_courses += len(courses)
    total_files += cat_files
    total_gb += cat_mb / 1024
    print(f"\n📁 [{cat}] -> {len(courses)} programas | {cat_files} archivos | {round(cat_mb/1024, 2)} GB")
    for c in courses:
        status_icon = "🟢" if c["media_count"] > 0 else "⚪"
        print(f"   {status_icon} {c['course_folder']} -> {c['media_count']} audios/videos ({c['size_mb']} MB)")

print("\n" + "="*80)
print(f"🏆 RESUMEN TOTAL LOCAL: {total_courses} programas | {total_files} archivos | {round(total_gb, 2)} GB en disco")
print("="*80)
