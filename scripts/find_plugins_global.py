import os
import json
import string
from pathlib import Path

keywords = ['affiliate', 'afiliados', 'plugin', 'woocommerce', 'ref', 'partner', 'coupon', 'zip']

def get_available_drives():
    # Detecta automáticamente todas las letras de unidad fijas disponibles en Windows
    drives = []
    for letter in string.ascii_uppercase:
        drive = f"{letter}:\\"
        if os.path.exists(drive):
            drives.append(drive)
    return drives

results = []
drives = get_available_drives()
print(f"[*] Unidades de disco detectadas en el PC: {drives}")
print("[*] Iniciando escaneo forense global de archivos .zip (omitiendo sistema y dependencias)...")

for drive in drives:
    print(f"    Escaneando unidad {drive}...")
    try:
        for root, dirs, files in os.walk(drive):
            # Omitir carpetas del sistema, caché y entornos de desarrollo para velocidad quirúrgica
            root_lower = root.lower()
            if any(skip in root_lower for skip in ['windows', 'program files', 'programdata', 'node_modules', '.next', 'appdata', '$recycle.bin', 'system volume information']):
                continue
            
            for file in files:
                if file.endswith('.zip'):
                    file_lower = file.lower()
                    # Buscar por keywords o registrar todos los zip si quieres un filtro más amplio
                    if any(kw in file_lower for kw in keywords):
                        full_path = os.path.join(root, file)
                        try:
                            size_mb = os.path.getsize(full_path) / (1024 * 1024)
                            results.append({
                                "nombre": file,
                                "ruta": full_path,
                                "tamano_mb": round(size_mb, 2)
                            })
                        except Exception:
                            pass
    except Exception as e:
        print(f"    [!] Aviso: No se pudo escanear completamente {drive}: {e}")

output_path = "scripts/reports/found_affiliate_plugins_global.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"\n[OK] Escaneo global finalizado. Total de archivos .zip localizados: {len(results)}")
print(f"     Reporte guardado en: {output_path}")
