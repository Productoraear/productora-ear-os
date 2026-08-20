import os
import json
import subprocess

# Configuración de Rutas
BASE_DIR = r"H:\incubadora despegue\ESTRATEGIAS_Y_FRAMEWORKS\LOS_GANADORES"
SEASON_DIR = os.path.join(BASE_DIR, "Temporada_01")

# Metadata de la Serie (Copia fiel de la arquitectura y copy de la plataforma)
SERIES_METADATA = {
    "platform": "Velocity Media",
    "category": "Series / Workshops",
    "block_canonical": "ESTRATEGIAS_Y_FRAMEWORKS",
    "series_title": "Los Ganadores",
    "season": 1,
    "total_episodes": 4,
    "duration_total": "1h 09m",
    "synopsis": "Los mejores emprendedores piensan como atletas de élite: saben competir, pero sobre todo saben ganar. En esta serie desciframos qué hace distintos a los que llegan a la cima.",
    "seo_keywords": ["emprendimiento", "atletas de elite", "mentalidad ganadora", "estrategia de negocio", "alto rendimiento"],
    "episodes": [
        {"ep": 1, "title": "Episodio 1", "cdn_url": "https://d2k7qt6f7lk87e.cloudfront.net/assets/e801a327-800c-4dc8-9872-e29ab69b87a8/HLS/Ganadores_Ep01.m3u8"},
        {"ep": 2, "title": "Episodio 2", "cdn_url": "https://d2k7qt6f7lk87e.cloudfront.net/assets/e801a327-800c-4dc8-9872-e29ab69b87a8/HLS/Ganadores_Ep02.m3u8"},
        {"ep": 3, "title": "Episodio 3", "cdn_url": "https://d2k7qt6f7lk87e.cloudfront.net/assets/e801a327-800c-4dc8-9872-e29ab69b87a8/HLS/Ganadores_Ep03.m3u8"},
        {"ep": 4, "title": "Episodio 4", "cdn_url": "https://d2k7qt6f7lk87e.cloudfront.net/assets/e801a327-800c-4dc8-9872-e29ab69b87a8/HLS/Ganadores_Ep04.m3u8"}
    ]
}

def create_structure_and_download():
    os.makedirs(SEASON_DIR, exist_ok=True)
    print("\n🏛️ INICIANDO INGESTA ARQUITECTÓNICA: LOS GANADORES")
    print(f"📁 Directorio Serie: {BASE_DIR}")

    # 1. Guardar Ficha de Metadatos JSON (SSOT RAG)
    json_path = os.path.join(BASE_DIR, "00_SERIE_METADATA.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(SERIES_METADATA, f, ensure_ascii=False, indent=2)
    print(f"✅ Metadata JSON preservada en: {json_path}")

    # 2. Generar README.md Estructurado para RAG / Búsqueda
    readme_path = os.path.join(BASE_DIR, "README.md")
    readme_content = f"""# {SERIES_METADATA['series_title']}
**Plataforma de Origen:** {SERIES_METADATA['platform']}  
**Categoría:** {SERIES_METADATA['category']} | **Bloque:** {SERIES_METADATA['block_canonical']}  
**Duración Total:** {SERIES_METADATA['duration_total']} ({SERIES_METADATA['total_episodes']} Episodios)

## Sinopsis
{SERIES_METADATA['synopsis']}

## Palabras Clave / SEO
{", ".join(SERIES_METADATA['seo_keywords'])}

## ESTRUCTURA DE CONTENIDOS (Temporada 1)
"""
    for ep in SERIES_METADATA['episodes']:
        readme_content += f"- **Episodio {ep['ep']}:** {ep['title']}\n"

    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(readme_content)
    print(f"📄 Documento Markdown RAG generado en: {readme_path}\n")

    # 3. Descarga de Archivos de Vídeo
    for ep in SERIES_METADATA['episodes']:
        file_name = f"Los_Ganadores_Ep{ep['ep']:02d}.mp4"
        output_file = os.path.join(SEASON_DIR, file_name)

        if os.path.exists(output_file):
            print(f"⏭️ Omitido (Ya existe): {file_name}")
            continue

        print(f"📥 Descargando Episodio {ep['ep']}/{SERIES_METADATA['total_episodes']} -> {file_name}")
        cmd = [
            "python", "-m", "yt_dlp",
            "--referer", "https://space.velocitymedia.info/",
            "-o", output_file,
            ep['cdn_url']
        ]
        subprocess.run(cmd)

    print("\n==================================================")
    print("✅ PROCESO DE ARQUITECTURA COMPLETADO")
    print("==================================================\n")

if __name__ == "__main__":
    create_structure_and_download()
