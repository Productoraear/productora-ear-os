import pandas as pd
import argparse
import os
from datetime import datetime

def generate_obsidian_kanban(keyword, index_path, vault_path):
    print(f"[*] Buscando '{keyword}' en {index_path}...")
    try:
        # Optimización: Cargar CSV usando pandas para manejar 362k registros eficientemente
        df = pd.read_csv(index_path, low_memory=False)
        # Filtrar
        matches = df[df['Ruta'].str.contains(keyword, case=False, na=False)]
        count = len(matches)
        
        if count == 0:
            print("[!] No se encontraron activos de oro.")
            return

        print(f"[+] {count} activos encontrados. Inyectando en Obsidian...")
        
        # Limitar a los top 200 para no colapsar la nota
        top_matches = matches.head(200)

        # Formato Markdown para Obsidian (Estilo Kanban o Lista Mestra)
        md_content = f"# 🧠 Inteligencia Omni-Drive: {keyword.upper()}\n\n"
        md_content += f"> [!info] Telemetría\n> Generado el: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n> Total activos encontrados: {count}\n\n"
        
        md_content += "## 🎯 Activos de Alta Prioridad (PDF/MD)\n\n"
        
        for index, row in top_matches.iterrows():
            ruta = str(row['Ruta']).replace('\\', '/')
            ext = str(row['Extension']).lower()
            name = os.path.basename(ruta)
            
            # Formato de enlace de Obsidian tipo [[ruta]] o [nombre](file:///ruta)
            if ext in ['.pdf', '.md', '.docx']:
                md_content += f"- 📄 **{name}** | [Abrir Archivo Original](file:///{ruta.replace(' ', '%20')})\n"
                
        md_content += "\n## 📊 Archivos de Datos (JSON/CSV)\n\n"
        for index, row in top_matches.iterrows():
            ruta = str(row['Ruta']).replace('\\', '/')
            ext = str(row['Extension']).lower()
            name = os.path.basename(ruta)
            
            if ext in ['.json', '.csv', '.ts']:
                md_content += f"- 💾 **{name}** | [Inspeccionar](file:///{ruta.replace(' ', '%20')})\n"

        # Guardar la nota en el vault
        safe_keyword = "".join(x for x in keyword if x.isalnum() or x in " _-")
        output_file = os.path.join(vault_path, f"Omni-Drive_{safe_keyword}.md")
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(md_content)
            
        print(f"[🚀] ÉXITO: Puente neuronal establecido.")
        print(f"Abre Obsidian y busca la nota: Omni-Drive_{safe_keyword}.md")

    except Exception as e:
        print(f"[X] Error crítico: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Puente Neuronal a Obsidian")
    parser.add_argument("keyword", help="Palabra clave a buscar")
    parser.add_argument("--index", default=r"H:\EAR_GOLDEN_INDEX.csv", help="Ruta al índice")
    # Por defecto apuntamos a la carpeta raíz de Obsidian
    parser.add_argument("--vault", default=r"H:\EAR_OS_V2\EAR_OS_V2", help="Ruta a la bóveda de Obsidian")
    
    args = parser.parse_args()
    
    generate_obsidian_kanban(args.keyword, args.index, args.vault)
