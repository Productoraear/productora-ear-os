import os
import glob
import json
import re

print("🚀 Unificando proveedores de H:\EAR_OS_V2...")
base_dir = r"H:\EAR_OS_V2"
output_path = os.path.join(base_dir, "EAR_OS_V2", "src", "data", "all_providers_database.json")

files = glob.glob(os.path.join(base_dir, "**", "*.*"), recursive=True)
provider_files = [f for f in files if any(k in os.path.basename(f).lower() for k in ["proveedor", "bodas", "google", "directorio"]) and f.endswith((".json", ".txt", ".csv"))]

dedup_map = {}
total_parsed = 0
expired_count = 0

def clean_phone(p):
    if not p: return ""
    d = re.sub(r"\D", "", str(p))
    return d[-9:] if len(d) >= 9 else ""

def is_expired(txt):
    t = str(txt).lower()
    if any(k in t for k in ["caducado", "caducada", "expirada", "vencida"]): return True
    return any(yr in t for yr in ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"])

for fp in provider_files:
    try:
        if fp.endswith(".json"):
            data = json.load(open(fp, "r", encoding="utf-8", errors="ignore"))
            items = data if isinstance(data, list) else [data]
            for item in items:
                if not isinstance(item, dict): continue
                total_parsed += 1
                if is_expired(json.dumps(item)):
                    expired_count += 1
                    continue
                name = item.get("name") or item.get("nombre") or item.get("title") or "Proveedor Homologado"
                phone = clean_phone(item.get("phone") or item.get("telefono") or item.get("contact"))
                cat = item.get("category") or item.get("categoria") or "bodas"
                prov = item.get("province") or item.get("provincia") or "madrid"
                key = phone if phone else re.sub(r"\W+", "", name.lower())
                if key and key not in dedup_map:
                    dedup_map[key] = {
                        "id": f"prov-{len(dedup_map)+1}",
                        "name": name,
                        "phone": phone,
                        "category": str(cat).lower(),
                        "province": str(prov).lower(),
                        "verified": True,
                        "source": os.path.basename(fp)
                    }
    except Exception: continue

clean = list(dedup_map.values())
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(clean, f, ensure_ascii=False, indent=2)

print(f"✅ Procesados: {total_parsed} -- Caducados descartados: {expired_count} -- Únicos finales: {len(clean)}")
