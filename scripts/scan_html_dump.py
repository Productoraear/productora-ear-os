import os
import glob
import re

htm_dir = r"D:\01_VERTICAL_EVENTOS\BODAS"
print(f"=== [*] ESCANEANDO ARCHIVOS HTML EN {htm_dir} ===")

if os.path.exists(htm_dir):
    all_htms = []
    for root, dirs, files in os.walk(htm_dir):
        for f in files:
            if f.endswith(('.htm', '.html')):
                all_htms.append(os.path.join(root, f))
    
    print(f"[+] Total archivos HTML encontrados: {len(all_htms)}")
    if len(all_htms) > 0:
        sample_file = all_htms[0]
        print(f"[+] Muestra: {sample_file}")
        with open(sample_file, 'r', encoding='utf-8', errors='ignore') as hf:
            sample_content = hf.read(2000)
            print("--- Primeros 500 caracteres ---")
            print(sample_content[:500])
