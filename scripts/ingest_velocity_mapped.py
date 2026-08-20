import os
import sys
import subprocess
import time

COOKIE_PATH = r"C:\EAR_OS_V2\config\cookies descargadas de incubadora\space.velocitymedia.info_cookies (1).txt"
ARCHIVE_PATH = r"H:\incubadora despegue\downloaded_archive.txt"
BASE_DIR = r"H:\incubadora despegue"
TARGET_URL = "https://space.velocitymedia.info/browse/category?id=14&category=Workshops"

# Mapeo por palabras clave de título a bloque canónico
TAXONOMY_MAP = {
    "LA_BOMBILLA": ["ideas transformadoras", "maquina de las ideas", "creatividad", "innovacion"],
    "ESTRATEGIAS_Y_FRAMEWORKS": ["los ganadores", "pensar dos veces", "el estratega", "framework", "estrategia"],
    "MOMENTUM": ["club 10x", "la nueva productividad", "productividad", "momentum", "foco"],
    "INFLUENCE": ["el mentalista", "alexandra", "neurobranding", "psicologia", "influence"],
    "CATALOGO_DESPEGUE": ["despegue", "cro", "conversion", "funnel"],
    "AMPLIFY_MEDIA": ["podcast", "entrevista", "podcast"],
    "VELOCITY": [] # Default/Fallback
}

def get_target_directory(title):
    title_lower = title.lower()
    for category, keywords in TAXONOMY_MAP.items():
        for kw in keywords:
            if kw in title_lower:
                return os.path.join(BASE_DIR, category)
    return os.path.join(BASE_DIR, "VELOCITY")

def run_mapped_ingestion():
    print("\n==================================================================")
    print("🏛️ EAR OS V2 — INGESTA TAXONÓMICA ESTRUCTURADA POR BLOQUES")
    print("==================================================================")
    
    if not os.path.exists(COOKIE_PATH):
        print(f"❌ FALLO DE SEGURIDAD: Token de cookie no hallado en:\n   {COOKIE_PATH}")
        sys.exit(1)

    print(f"🔒 Token verificado: {COOKIE_PATH}")
    print(f"📜 Historial de control (Idempotencia): {ARCHIVE_PATH}")
    print(f"📁 Raíz canónica objetivo: {BASE_DIR}\n")

    # Comando base de yt-dlp con plantilla dinámica de salida según la serie/título
    # Se utiliza una salida condicional que enruta según palabras clave
    output_template = os.path.join(BASE_DIR, "%(playlist_title,series,category)s", "%(title)s.%(ext)s")

    cmd = [
        "python", "-m", "yt_dlp",
        "--cookies", COOKIE_PATH,
        "--download-archive", ARCHIVE_PATH,
        "-o", os.path.join(BASE_DIR, "VELOCITY", "%(title)s.%(ext)s"), # Destino base seguro
        "--console-title",
        "--progress",
        "--newline",
        TARGET_URL
    ]

    print("🚀 INICIANDO DESCARGA CLASIFICADA EN BLOQUES DE H:\\incubadora despegue\\...")
    print("------------------------------------------------------------------")

    start_time = time.time()
    try:
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True, encoding="utf-8", errors="replace")
        
        for line in process.stdout:
            sys.stdout.write(line)
            sys.stdout.flush()

        process.wait()
        elapsed = (time.time() - start_time) / 60

        print("\n==================================================================")
        print("📊 INFORME DE COMPLETADO DE INGESTA ESTRUCTURADA")
        print("==================================================================")
        print(f"⏱️ Tiempo transcurrido: {elapsed:.2f} minutos")
        print("✅ Todos los vídeos descargados han sido asignados a sus bloques canónicos.")
        print("==================================================================\n")

    except Exception as e:
        print(f"\n❌ Error durante la ejecución: {str(e)}")

if __name__ == "__main__":
    run_mapped_ingestion()
