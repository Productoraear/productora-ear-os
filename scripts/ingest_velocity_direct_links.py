import os
import sys
import subprocess
import time

COOKIE_PATH = r"C:\EAR_OS_V2\config\cookies descargadas de incubadora\space.velocitymedia.info_cookies (1).txt"
ARCHIVE_PATH = r"H:\incubadora despegue\downloaded_archive.txt"
BASE_DIR = r"H:\incubadora despegue"

# Lote actual de URLs individuales extraídas
TARGET_URLS = [
    "https://space.velocitymedia.info/watch/class/237#/?playlistId=0&videoId=0",
    "https://space.velocitymedia.info/watch/class/238#/?playlistId=0&videoId=1",
    "https://space.velocitymedia.info/watch/class/239#/?playlistId=0&videoId=2",
    "https://space.velocitymedia.info/watch/class/240#/?playlistId=0&videoId=3"
]

# Reglas de mapeo a bloques canónicos
BLOCK_RULES = {
    "LA_BOMBILLA": ["ideas transformadoras", "maquina de las ideas", "creatividad"],
    "ESTRATEGIAS_Y_FRAMEWORKS": ["los ganadores", "pensar dos veces", "el estratega", "framework", "ganadores"],
    "MOMENTUM": ["club 10x", "la nueva productividad", "productividad", "momentum"],
    "INFLUENCE": ["el mentalista", "alexandra", "neurobranding", "psicologia"],
    "AMPLIFY_MEDIA": ["podcast", "entrevista"]
}

def resolve_target_dir(url_index):
    # Por defecto para esta serie (Los Ganadores) -> ESTRATEGIAS_Y_FRAMEWORKS
    return os.path.join(BASE_DIR, "ESTRATEGIAS_Y_FRAMEWORKS")

def run_batch():
    print("\n==================================================================")
    print("🏛️ EAR OS V2 — INGESTA DIRECTA Y CLASIFICACIÓN EN DISCO H:")
    print("==================================================================")

    if not os.path.exists(COOKIE_PATH):
        print(f"❌ FALLO DE SEGURIDAD: Token de cookie no hallado en:\n   {COOKIE_PATH}")
        sys.exit(1)

    print(f"🔒 Token verificado: {COOKIE_PATH}")
    print(f"📜 Historial de control (Idempotencia): {ARCHIVE_PATH}")

    total = len(TARGET_URLS)
    print(f"📋 Procesando {total} enlaces directos...\n")

    for idx, url in enumerate(TARGET_URLS, 1):
        target_dir = resolve_target_dir(idx)
        os.makedirs(target_dir, exist_ok=True)

        print(f"🚀 [{idx}/{total}] Descargando: {url}")
        print(f"📁 Destino: {target_dir}")

        cmd = [
            "python", "-m", "yt_dlp",
            "--cookies", COOKIE_PATH,
            "--download-archive", ARCHIVE_PATH,
            "-o", os.path.join(target_dir, "%(title)s.%(ext)s"),
            "--referer", "https://space.velocitymedia.info/",
            url
        ]

        subprocess.run(cmd)

    print("\n==================================================================")
    print("📊 LOTE COMPLETADO CON ÉXITO")
    print("==================================================================\n")

if __name__ == "__main__":
    run_batch()
