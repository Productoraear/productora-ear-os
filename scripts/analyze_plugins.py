import json
import os

input_path = "scripts/reports/found_affiliate_plugins_global.json"

if not os.path.exists(input_path):
    print("[!] No se encontró el reporte global.")
    exit(1)

with open(input_path, 'r', encoding='utf-8') as f:
    items = json.load(f)

# Palabras clave estrictas de plugins de afiliados / e-commerce
target_keywords = [
    'affiliate', 'afiliados', 'coupon', 'cupón', 'referral', 'ref-', 
    'woocommerce', 'wc-', 'stripe', 'paypal', 'member', 's2member', 
    'edd-', 'easy digital', 'yith', 'partner', 'clickbank', 'jvzoo', 
    'commission', 'comision', 'reward', 'points', 'mlm'
]

shortlisted = []
for item in items:
    name_lower = item['nombre'].lower()
    path_lower = item['ruta'].lower()
    
    # Comprobar si coincide con alguna keyword de negocio/afiliación
    if any(kw in name_lower or kw in path_lower for kw in target_keywords):
        shortlisted.append(item)

print(f"\n======================================================================")
print(f"[*] RESULTADOS DEL FILTRADO QUIRÚRGICO DE AFILIADOS / E-COMMERCE")
print(f"======================================================================")
print(f"Total de candidatos relevantes detectados: {len(shortlisted)}\n")

for idx, p in enumerate(shortlisted[:25], 1): # Mostrar los primeros 25 más relevantes
    print(f"[{idx:02d}] {p['nombre']} ({p['tamano_mb']} MB)")
    print(f"     Ruta: {p['ruta']}\n")

output_shortlist = "scripts/reports/shortlisted_affiliate_plugins.json"
with open(output_shortlist, 'w', encoding='utf-8') as f:
    json.dump(shortlisted, f, indent=2, ensure_ascii=False)

print(f"[OK] Listado filtrado guardado en: {output_shortlist}")
