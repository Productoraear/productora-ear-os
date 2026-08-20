import os
import json

files_to_check = [
    r"C:\EAR_OS_V2\src\lib\NUCLEO_DATA\bodas_clean.json",
    r"C:\EAR_OS_V2\src\lib\NUCLEO_DATA\bodas_full.json",
    r"H:\incubadora despegue\TRANSCRIPCIONES_WHISPER\bodas_vendors.json",
    r"H:\incubadora despegue\TRANSCRIPCIONES_WHISPER\EVE_BODAS_VENDORS.json"
]

print("=== [*] ANALISIS FORENSE DE DATASETS DE PROVEEDORES BODAS ===")

for fp in files_to_check:
    if os.path.exists(fp):
        size_mb = os.path.getsize(fp) / (1024 * 1024)
        print(f"\n[+] Archivo: {fp} ({size_mb:.2f} MB)")
        try:
            with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
                data = json.load(f)
                if isinstance(data, list):
                    print(f"    Total registros: {len(data)}")
                    sample = data[0] if len(data) > 0 else {}
                    print(f"    Campos muestra: {list(sample.keys())}")
                    has_images = sum(1 for x in data[:100] if x.get('images') or x.get('extractedImages') or x.get('photos'))
                    has_phone = sum(1 for x in data[:100] if x.get('phone') or x.get('telephone') or x.get('telefono'))
                    has_rating = sum(1 for x in data[:100] if x.get('rating') or x.get('valoration') or x.get('reviews'))
                    print(f"    Muestra 100 -> con imagenes: {has_images}, con rating: {has_rating}, con telefono: {has_phone}")
                elif isinstance(data, dict):
                    print(f"    Claves raiz: {list(data.keys())[:10]}")
        except Exception as e:
            print(f"    Error leyendo: {e}")
