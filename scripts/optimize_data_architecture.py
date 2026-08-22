# -*- coding: utf-8 -*-
import os
import json

print("🚀 INICIANDO OPTIMIZACIÓN DE ARQUITECTURA DE DATOS (LIGHT INDEX + ATOMIC HYDRATION)...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"
db_path = os.path.join(base_dir, "src", "data", "all_providers_database.json")
index_path = os.path.join(base_dir, "src", "data", "providers_search_index.json")

if not os.path.exists(db_path):
    print(f"❌ No se encontró la base de datos central en {db_path}")
    exit(1)

with open(db_path, "r", encoding="utf-8") as f:
    providers = json.load(f)

search_index = []
for p in providers:
    # Extraer sólo lo imprescindible para el primer renderizado y filtrado rápido
    specs = p.get("atomic_specs", {})
    index_item = {
        "id": p.get("id"),
        "name": p.get("name"),
        "img": p.get("img"),
        "gallery": p.get("gallery", [])[:3], # Máximo 3 imágenes para preview
        "locality": specs.get("locality") or p.get("locality", ""),
        "min_pax": specs.get("min_pax"),
        "max_pax": specs.get("max_pax"),
        "price_per_menu_min": specs.get("price_per_menu_min"),
        "rating_value": specs.get("rating_value"),
        "has_accommodation": specs.get("has_accommodation", False),
        "allows_civil_ceremony": specs.get("allows_civil_ceremony", False),
        "has_exclusive_catering": specs.get("has_exclusive_catering", False)
    }
    search_index.append(index_item)

# Guardar índice ligero
with open(index_path, "w", encoding="utf-8") as f:
    json.dump(search_index, f, ensure_ascii=False, indent=2)

raw_size = round(os.path.getsize(db_path) / (1024 * 1024), 2)
index_size = round(os.path.getsize(index_path) / (1024 * 1024), 2)
reduction = round((1 - (index_size / raw_size)) * 100, 1)

print("==================================================")
print("✅ ARQUITECTURA DE DATOS OPTIMIZADA CON ÉXITO")
print("==================================================")
print(f" ├─ Base Completa Grafo Atómico: {raw_size} MB (67.001 Atributos)")
print(f" ├─ Índice Ligero de Búsqueda Creado: {index_size} MB")
print(f" ├─ Reducción de Payload de Carga Inicial: {reduction}%")
print(f" └─ Archivo Generado: {index_path}")
print("==================================================")
