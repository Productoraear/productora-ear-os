import os
import json
from pathlib import Path

keywords = ['affiliate', 'afiliados', 'plugin', 'woocommerce', 'ref', 'partner', 'coupon']
search_drives = ['H:\\', 'C:\\']
results = []

print("[*] Iniciando escaneo forense de .zip en unidades locales...")

for drive in search_drives:
    if not os.path.exists(drive):
        continue
    print(f"    Scanning {drive}...")
    for root, dirs, files in os.walk(drive):
        # Omitir carpetas pesadas o del sistema para evitar bloqueos
        if any(skip in root.lower() for skip in ['windows', 'program files', 'node_modules', '.next', 'appdata']):
            continue
        for file in files:
            if file.endswith('.zip'):
                file_lower = file.lower()
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

output_path = "scripts/reports/found_affiliate_plugins.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"[OK] Escaneo finalizado. Encontrados: {len(results)} archivos .zip relevantes.")
print(f"     Reporte guardado en: {output_path}")
