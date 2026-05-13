import os
import hashlib
import json
import time

def get_file_hash(file_path, block_size=65536):
    """Calcula el hash SHA-256 de un archivo para identificar su 'ADN' exacto."""
    hasher = hashlib.sha256()
    try:
        with open(file_path, 'rb') as afile:
            buf = afile.read(block_size)
            while len(buf) > 0:
                hasher.update(buf)
                buf = afile.read(block_size)
        return hasher.hexdigest()
    except Exception as e:
        return None

def scan_drive(root_dir):
    """Escanea el disco buscando duplicados exactos (por ADN) y filtra el ruido."""
    print(f"🚀 Iniciando Gran Escáner Forense (EAR-OS) en: {root_dir}")
    print("Modo Cirujano Activado: Cero prisa, máxima precisión.\n")
    
    inventory = {}
    total_files = 0
    failed_files = 0
    start_time = time.time()
    
    # 🛑 PROTECCIÓN DE ACTIVOS: Ignorar la carpeta del Motor Vivo
    excluded_dirs = ["SAAS_FINAL_STAGING", "Z_PAPELERA_FORENSE_100_DIAS", ".git", "node_modules"]
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Aplicar exclusiones de seguridad
        dirnames[:] = [d for d in dirnames if d not in excluded_dirs]
        
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            
            # Solo analizamos archivos de texto y documentos en esta primera fase
            if not filename.lower().endswith(('.txt', '.md', '.docx', '.json', '.pdf')):
                continue
                
            total_files += 1
            file_hash = get_file_hash(file_path)
            
            if file_hash:
                if file_hash not in inventory:
                    inventory[file_hash] = []
                inventory[file_hash].append(file_path)
            else:
                failed_files += 1
                
            # Modo Cirujano: Pequeño delay para no saturar el i9
            if total_files % 1000 == 0:
                print(f"[{total_files}] archivos escaneados... (Pausa técnica de seguridad)")
                time.sleep(0.5)

    print("\n--- ANÁLISIS COMPLETADO ---")
    print(f"⏱️ Tiempo: {round(time.time() - start_time, 2)} segundos")
    print(f"📄 Archivos analizados: {total_files}")
    if failed_files > 0:
        print(f"⚠️ Archivos inaccesibles (protegidos o en uso): {failed_files}")
        
    # Filtrar solo los duplicados (Hashes con más de 1 ruta)
    duplicates = {h: paths for h, paths in inventory.items() if len(paths) > 1}
    
    report_file = os.path.join(root_dir, "00_AVE_FENIX", "04_CEREBRO_TECNICO", "INFORME_DUPLICADOS_ADN.json")
    
    # Asegurar que el directorio existe
    os.makedirs(os.path.dirname(report_file), exist_ok=True)
    
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(duplicates, f, indent=4, ensure_ascii=False)
        
    print(f"\n✅ INFORME GENERADO CON ÉXITO: {report_file}")
    print(f"Se encontraron {len(duplicates)} grupos de archivos duplicados exactos (mismo ADN).")
    print("Por favor, revisa el archivo JSON generado.")

if __name__ == "__main__":
    scan_drive(r"H:\00_PRODUCTORA_EAR")