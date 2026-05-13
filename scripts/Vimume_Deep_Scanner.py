import os
import re
import json
from pathlib import Path
import time

# Configuración de SClass (YOLO God Mode)
DEST_HUB_DIR = r"H:\EAR_OS_MASTER_2026\01_SAAS_RAG_ENGINE\core\src\data\VIMUME_MASTER"
REPORT_FILE = os.path.join(DEST_HUB_DIR, "DEEP_SCAN_REPORT_VIMUME.md")
JSON_DB = os.path.join(DEST_HUB_DIR, "vimume_nodes.json")

# Aseguramos que la zona de aterrizaje existe
os.makedirs(DEST_HUB_DIR, exist_ok=True)
os.makedirs(os.path.join(DEST_HUB_DIR, "Clinico"), exist_ok=True)
os.makedirs(os.path.join(DEST_HUB_DIR, "Negocio"), exist_ok=True)
os.makedirs(os.path.join(DEST_HUB_DIR, "Branding"), exist_ok=True)
os.makedirs(os.path.join(DEST_HUB_DIR, "Multimedia"), exist_ok=True)

# El Motor en Cascada (Keywords de rastreo profundo)
KEYWORDS_CASCADA = {
    "VIMUME": [b"vimume", b"viaje musical por la memoria", b"sebastian diaz", b"sebastian d\xedaz", b"haciendo nuestra parte"],
    "TERCERA_EDAD": [b"silver economy", b"alzheimer", b"musicoterapia", b"demencia", b"abuel", b"mayor", b"imserso", b"bono social", b"dependencia"],
    "STAKEHOLDERS": [b"ayuntamiento", b"residencia", b"terapeuta", b"geriatria", b"cuidador", b"familiar"],
    "INCUBADORA": [b"incubadora", b"despegue", b"momentum", b"velocity", b"amplify", b"la bombilla"]
}

# Rutas de barrido masivo (incluyendo backups)
TARGET_DRIVES = [r"H:\\", r"F:\\", r"D:\BACKUPS"]

EXTENSIONS = {'.pdf', '.docx', '.doc', '.txt', '.md', '.ai', '.csv', '.json', '.mp3', '.m4a', '.wav'}
IGNORE_DIRS = {'node_modules', '.git', '.next', 'AppData', '$Recycle.Bin', 'System Volume Information'}

found_files = []

def robust_scan():
    print("Iniciando escaneo VAMPIRE FORENSE v1.0 (Bit a Bit)...")
    start_time = time.time()
    
    for drive in TARGET_DRIVES:
        if not os.path.exists(drive):
            print(f"Skipping {drive} (Not accessible)")
            continue
        
        print(f"-> Escaneando el abismo en: {drive}")
        
        for root, dirs, files in os.walk(drive):
            # Filtrar carpetas basura para no colapsar
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS and not d.startswith('.')]
            
            for file in files:
                ext = Path(file).suffix.lower()
                if ext not in EXTENSIONS:
                    continue
                
                filepath = os.path.join(root, file)
                
                # Nivel 0: Búsqueda en el path/nombre por si el título es útil (aunque el Comandante diga que no, sirve de pista)
                path_lower = filepath.lower().encode('utf-8', 'ignore')
                matches = set()
                
                for category, keys in KEYWORDS_CASCADA.items():
                    if any(k in path_lower for k in keys):
                        matches.add(category)
                
                # Nivel 1: Lectura Binaria Profunda (Lee un fragmento del archivo buscando firmas sin necesitar librerías complejas)
                if ext in {'.txt', '.md', '.json', '.csv', '.pdf', '.docx'}:
                    try:
                        with open(filepath, 'rb') as f:
                            # Leemos hasta 500KB para no reventar la RAM, suficiente para detectar metadatos o inicios de texto
                            content = f.read(500 * 1024).lower()
                            for category, keys in KEYWORDS_CASCADA.items():
                                if any(k in content for k in keys):
                                    matches.add(category)
                    except Exception:
                        pass
                
                if matches:
                    # Lo encontramos. Evaluamos la potencia.
                    score = len(matches)
                    found_files.append({
                        "path": filepath,
                        "matches": list(matches),
                        "score": score,
                        "ext": ext
                    })
                    print(f"  [+] Match Lvl {score} -> {filepath[-60:]}")
    
    # Ordenar por score (Mayor relevancia primero)
    found_files.sort(key=lambda x: x['score'], reverse=True)
    
    # Escribir Reporte
    with open(REPORT_FILE, "w", encoding="utf-8") as rf:
        rf.write("# 🦇 REPORTE FORENSE VIMUME (ESCANEO EN CASCADA BIT A BIT)\n")
        rf.write(f"Tiempo de ejecución: {round(time.time() - start_time, 2)} segundos\n")
        rf.write(f"Total de fragmentos (Átomos) localizados: {len(found_files)}\n\n")
        
        for cat in KEYWORDS_CASCADA.keys():
            rf.write(f"### TOP ARCHIVOS: {cat}\n")
            for f in [x for x in found_files if cat in x['matches']][:20]: # Top 20 por categoria
                rf.write(f"- **Score {f['score']}**: `{f['path']}`\n")
            rf.write("\n")
            
    # Guardar en BD JSON para Antigravity
    with open(JSON_DB, "w", encoding="utf-8") as jf:
        json.dump(found_files, jf, indent=2, ensure_ascii=False)
        
    print(f"\n[OK] Escaneo completado. {len(found_files)} nodos detectados.")
    print(f"Reporte generado en: {REPORT_FILE}")

if __name__ == "__main__":
    robust_scan()
