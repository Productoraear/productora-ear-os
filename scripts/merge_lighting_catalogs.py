import json
import os

cat2025_path = "src/data/demetrio_luces_navidad_2025.json"
cat2026_path = "src/data/luces_navidad_2026_ear.json"

with open(cat2025_path, "r", encoding="utf-8") as f:
    cat2025 = json.load(f)

with open(cat2026_path, "r", encoding="utf-8") as f:
    cat2026 = json.load(f)

print(f"Catálogo 2025: {len(cat2025)} productos")
print(f"Catálogo 2026 inicial: {len(cat2026)} productos")

# 1. Mapear precios y especificaciones de 2025 para enriquecer 2026
lookup_2025 = {}
for p in cat2025:
    sku_key = (p.get("sku") or "").lower().replace(" ", "").replace("-", "").replace("_", "")
    name_key = (p.get("name") or "").lower().strip()
    if sku_key:
        lookup_2025[sku_key] = p
    if name_key:
        lookup_2025[name_key] = p

enriched_2026 = 0
for p in cat2026:
    sku_key = (p.get("sku") or "").lower().replace(" ", "").replace("-", "").replace("_", "")
    name_key = (p.get("name") or "").lower().strip()
    match = lookup_2025.get(sku_key) or lookup_2025.get(name_key)
    if match:
        # Si 2026 no tenía precio y 2025 sí:
        if not p.get("priceNumeric") and match.get("priceNumeric"):
            p["priceNumeric"] = match["priceNumeric"]
            p["priceDisplay"] = match["priceDisplay"]
            enriched_2026 += 1
        # Si 2026 no tenía potencia y 2025 sí:
        if not p.get("powerWatts") and match.get("powerWatts"):
            p["powerWatts"] = match["powerWatts"]
        # Si 2026 no tenía dimensiones precisas:
        if p.get("dimensions") == "Ver catálogo técnico" and match.get("dimensions") and match.get("dimensions") != "Ver catálogo técnico":
            p["dimensions"] = match["dimensions"]

print(f"Productos de 2026 enriquecidos con datos de 2025: {enriched_2026}")

# 2. Agregar productos únicos de 2025 no presentes en 2026
skus_2026 = set((p.get("sku") or "").lower().replace(" ", "").replace("-", "").replace("_", "") for p in cat2026)
added_from_2025 = 0

for p in cat2025:
    sku_key = (p.get("sku") or "").lower().replace(" ", "").replace("-", "").replace("_", "")
    if sku_key and sku_key not in skus_2026:
        # Asegurar compatibilidad con formato 2026
        slug_safe = p.get("sku", "item").lower().replace(" ", "-").replace("/", "-")
        merged_item = {
            "id": f"ear-nav-fused-{p.get('id', added_from_2025)}",
            "sku": p.get("sku", ""),
            "name": p.get("name", ""),
            "category": p.get("category", "Motivos 3D Gigantes"),
            "subcategory": p.get("subcategory", "Colección Monumental Histórica"),
            "targetSector": p.get("targetSector", "Ayuntamientos y Grandes Espacios (Art. 118 LCSP)"),
            "description": p.get("description", "Elemento de iluminación navideña monumental S-Class homologado."),
            "priceNumeric": p.get("priceNumeric"),
            "priceDisplay": p.get("priceDisplay", "Consultar Cotización"),
            "unitType": p.get("unitType", "unidad"),
            "powerWatts": p.get("powerWatts"),
            "weightKg": p.get("weightKg"),
            "voltage": p.get("voltage", "230V / 24V"),
            "dimensions": p.get("dimensions", "Ver catálogo técnico"),
            "ledColor": p.get("ledColor", "LED Blanco Cálido / Frío"),
            "ipRating": p.get("ipRating", "IP65 / IP44 Plug Estanco"),
            "material": p.get("material", "Aluminio Anodizado Reforzado"),
            "specialTransport": p.get("specialTransport", False),
            "hasVideo": p.get("hasVideo", False),
            "cataloguePage": p.get("cataloguePage", 1),
            "provider": "División Alumbrado Monumental · Productora EAR S-Class",
            "canonicalUrl": f"/arsenal/luces-navidad/{slug_safe}",
            "image": p.get("image", f"/images/demetrio/page_{p.get('cataloguePage', 2)}.jpg"),
            "pageImage": p.get("image", f"/images/demetrio/page_{p.get('cataloguePage', 2)}.jpg")
        }
        cat2026.append(merged_item)
        skus_2026.add(sku_key)
        added_from_2025 += 1

print(f"Productos únicos de 2025 fusionados e incorporados: {added_from_2025}")
print(f"Total catálogo fusionado final: {len(cat2026)} referencias")

# 3. Guardar catálogo maestro unificado
with open(cat2026_path, "w", encoding="utf-8") as f:
    json.dump(cat2026, f, ensure_ascii=False, indent=2)

print(f"Guardado exitoso en {cat2026_path}")
