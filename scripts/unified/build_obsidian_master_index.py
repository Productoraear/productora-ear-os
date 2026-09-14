import pandas as pd
import os
import argparse
import math
from datetime import datetime

def sanitize_filename(name):
    return "".join(c if c.isalnum() or c in [' ', '-', '_'] else '_' for c in name).strip()

def build_master_index(index_path, vault_path, max_links_per_file=2000):
    print(f"[*] Iniciando Ingesta Maestra (Opción B: Agrupación por Directorio)")
    print(f"[*] Leyendo índice desde: {index_path}")
    
    try:
        # Cargar CSV completo
        df = pd.read_csv(index_path, low_memory=False)
        total_rows = len(df)
        print(f"[+] {total_rows} registros cargados en memoria RAM.")
        
        if total_rows == 0:
            print("[!] El índice está vacío.")
            return

        # Crear carpeta de destino en Obsidian
        target_dir = os.path.join(vault_path, "Omni-Index_Master")
        os.makedirs(target_dir, exist_ok=True)
        print(f"[*] Carpeta de destino creada: {target_dir}")

        # Extraer carpeta padre de cada ruta
        print("[*] Procesando agrupaciones topológicas...")
        df['CarpetaPadre'] = df['Ruta'].apply(lambda x: os.path.dirname(str(x)))
        
        # Agrupar por carpeta padre
        grouped = df.groupby('CarpetaPadre')
        
        archivos_generados = 0
        total_enlaces_inyectados = 0

        for folder, group in grouped:
            folder_name = os.path.basename(folder)
            if not folder_name:
                folder_name = "RAIZ"
                
            safe_folder_name = sanitize_filename(folder_name)
            
            # Si el grupo es enorme, paginar
            total_items = len(group)
            total_pages = math.ceil(total_items / max_links_per_file)
            
            for page in range(total_pages):
                page_suffix = f"_P{page+1}" if total_pages > 1 else ""
                filename = f"INDICE_{safe_folder_name[:40]}{page_suffix}.md"
                filepath = os.path.join(target_dir, filename)
                
                start_idx = page * max_links_per_file
                end_idx = start_idx + max_links_per_file
                page_group = group.iloc[start_idx:end_idx]
                
                md_content = f"# 📁 Índice Maestro: {folder_name}\n"
                md_content += f"> [!info] Metadatos de la Carpeta\n"
                md_content += f"> **Ruta Original:** `{folder}`\n"
                md_content += f"> **Activos en esta página:** {len(page_group)}\n"
                md_content += f"> **Fecha de inyección:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n"
                
                md_content += "## 🎯 Activos\n*Usa las casillas para marcar los archivos que ya has auditado, movido o borrado.*\n\n"
                
                for _, row in page_group.iterrows():
                    ruta_completa = str(row['Ruta']).replace('\\', '/')
                    nombre_archivo = os.path.basename(ruta_completa)
                    
                    # Markdown Checkbox format: - [ ] [Name](file:///path)
                    md_content += f"- [ ] [{nombre_archivo}](file:///{ruta_completa.replace(' ', '%20')})\n"
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(md_content)
                
                archivos_generados += 1
                total_enlaces_inyectados += len(page_group)

        print(f"\n[🚀] ¡INGESTA COMPLETADA CON ÉXITO!")
        print(f"[-] Total de enlaces inyectados: {total_enlaces_inyectados}")
        print(f"[-] Total de Mapas de Contenido (MOCs) creados: {archivos_generados}")
        print(f"[-] Carpeta en Obsidian: Omni-Index_Master/")

    except Exception as e:
        print(f"\n[X] ERROR FATAL: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Indexador Maestro para Obsidian")
    parser.add_argument("--index", default=r"H:\EAR_GOLDEN_INDEX.csv", help="Ruta al índice CSV")
    # Para usar la raíz como vault, que es lo que el usuario está usando
    parser.add_argument("--vault", default=r"H:\EAR_OS_V2\EAR_OS_V2", help="Ruta a la bóveda de Obsidian")
    
    args = parser.parse_args()
    build_master_index(args.index, args.vault)
