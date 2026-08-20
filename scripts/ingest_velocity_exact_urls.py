import os
import subprocess

# Configuración de Rutas
BASE_DIR = r"H:\incubadora despegue\ESTRATEGIAS_Y_FRAMEWORKS\LOS_GANADORES"
SEASON_DIR = os.path.join(BASE_DIR, "Temporada_01")

# PEGA AQUÍ LAS URLS M3U8 COPIADAS DE DEVTOOLS PARA CADA EPISODIO
EPISODE_URLS = {
    1: "https://d2k7qt6f7lk87e.cloudfront.net/assets/e801a327-800c-4dc8-9872-e29ab69b87a8/HLS/Ganadores_Ep01.m3u8",
    2: "PEGA_AQUÍ_LA_URL_M3U8_DEL_EPISODIO_2",
    3: "PEGA_AQUÍ_LA_URL_M3U8_DEL_EPISODIO_3",
    4: "PEGA_AQUÍ_LA_URL_M3U8_DEL_EPISODIO_4"
}

def download_remaining():
    os.makedirs(SEASON_DIR, exist_ok=True)
    print("\n🚀 INICIANDO DESCARGA DE EPISODIOS RESTANTES (LOS GANADORES)")

    for ep_num, url in EPISODE_URLS.items():
        if "PEGA_AQUÍ" in url:
            continue

        file_name = f"Los_Ganadores_Ep{ep_num:02d}.mp4"
        output_file = os.path.join(SEASON_DIR, file_name)

        if os.path.exists(output_file):
            print(f"⏭️ Omitido (Ya existe): {file_name}")
            continue

        print(f"📥 Descargando Episodio {ep_num} -> {file_name}")
        cmd = [
            "python", "-m", "yt_dlp",
            "--referer", "https://space.velocitymedia.info/",
            "-o", output_file,
            url
        ]
        subprocess.run(cmd)

    print("\n==================================================")
    print("✅ INGESTA FINALIZADA EN DISCO H:")
    print("==================================================\n")

if __name__ == "__main__":
    download_remaining()
