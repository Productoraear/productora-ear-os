import json
import os

input_path = "scripts/reports/found_affiliate_plugins_global.json"

if not os.path.exists(input_path):
    print("[!] No se encontró el reporte global de plugins.")
    exit(1)

with open(input_path, 'r', encoding='utf-8') as f:
    items = json.load(f)

# Excluir los ya detectados de indeed-affiliate-pro
rest_items = [item for item in items if 'indeed-affiliate-pro' not in item['nombre'].lower()]

# Categorías clave para clasificar el resto de herramientas
categories = {
    "pasarelas_pago": ['stripe', 'paypal', 'redsys', 'pago', 'checkout'],
    "seo_marketing": ['seo', 'rank', 'yoast', 'schema', 'pixel', 'analytics', 'ads'],
    "formularios_leads": ['form', 'gravity', 'contact', 'wpforms', 'leads', 'popup'],
    "optimizacion_cache": ['cache', 'speed', 'minify', 'optimizer', 'imagify', 'smush'],
    "otros_utilitarios": []
}

classified = {cat: [] for cat in categories.keys()}

for item in rest_items:
    name_lower = item['nombre'].lower()
    path_lower = item['ruta'].lower()
    matched = False
    for cat, keywords in categories.items():
        if cat == "otros_utilitarios":
            continue
        if any(kw in name_lower or kw in path_lower for kw in keywords):
            classified[cat].append(item)
            matched = True
            break
    if not matched:
        classified["otros_utilitarios"].append(item)

print(f"\n======================================================================")
print(f"[*] CLASIFICACIÓN DEL RESTO DE ARCHIVOS .ZIP EN TUS DISCOS")
print(f"======================================================================")
for cat, lst in classified.items():
    print(f"-> Categoría [{cat.upper()}] Total: {len(lst)} archivos")

output_summary = "scripts/reports/rest_plugins_classified.json"
with open(output_summary, 'w', encoding='utf-8') as f:
    json.dump(classified, f, indent=2, ensure_ascii=False)

print(f"\n[OK] Reporte clasificado guardado en: {output_summary}")
