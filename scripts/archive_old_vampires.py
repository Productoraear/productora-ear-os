import os
import shutil

print("📦 ARCHIVANDO SCRIPTS LEGACY EN CUARENTENA...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"
archive_dir = os.path.join(base_dir, "scripts", "archive_vampires_legacy")
os.makedirs(archive_dir, exist_ok=True)

vampires = [
    r"H:\EAR_OS_V2\EAR_OS_V2\Marketing_Skills\extract_providers_v1.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\Marketing_Skills\fander_forensic_scraper.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\scripts\bodas_vampire_engine.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\scripts\extract_real_images_v2.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\scripts\ingest_velocity_direct_links.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\scripts\ingest_velocity_exact_urls.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\scripts\ingest_velocity_mapped.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\scripts\ingest_velocity_master_arch.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\scripts\ingest_whisper_to_rag.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\scripts\inspect_bodas_data.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\scripts\vampire_daemon.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\scripts\vampirize_bodas_master.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\src\lib\NUCLEO_DATA\extractor_adn_bodas.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\src\lib\NUCLEO_DATA\fander_forensic_scraper.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\src\lib\NUCLEO_DATA\scrape_module.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\src\lib\services\scrapers\ear_mega_scraper_yolo.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\src\lib\services\scrapers\extract_deep.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\src\lib\services\scrapers\extract_providers.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\src\lib\services\scrapers\extractor.py",
    r"H:\EAR_OS_V2\EAR_OS_V2\src\lib\services\scrapers\substack_scraper.py"
]

moved = 0
for src in vampires:
    if os.path.exists(src):
        fname = os.path.basename(src)
        dest = os.path.join(archive_dir, fname)
        shutil.move(src, dest)
        moved += 1

print(f"✅ {moved} scripts archivados en {archive_dir}")
