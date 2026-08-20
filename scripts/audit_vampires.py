import os
import glob

print("🔎 RASTREANDO TODOS LOS MOTORES VAMPIRO EN EL PC...")

base_dir = r"H:\EAR_OS_V2"
search_patterns = ["*vampire*.py", "*scrap*.py", "*ingest*.py", "*extract*.py", "*bodas*.py"]

found_scripts = []
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if any(glob.fnmatch.fnmatch(file.lower(), p) for p in search_patterns):
            found_scripts.append(os.path.join(root, file))

print(f"📌 Se han localizado {len(found_scripts)} scripts de vampirización/extracción:")
for s in sorted(found_scripts):
    size_kb = os.path.getsize(s) / 1024
    print(f"  • {s} ({size_kb:.1f} KB)")
