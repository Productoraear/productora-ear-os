import os
import json

print("🔧 INICIANDO REPARACIÓN Y VALIDACIÓN DE SINTAXIS JSON...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"
db_path = os.path.join(base_dir, "src", "data", "all_providers_database.json")

try:
    with open(db_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"✅ JSON máster válido. {len(data)} proveedores cargados correctamente.")
except Exception as e:
    print(f"⚠️ Error detectado en JSON: {e}. Restaurando y formateando estructura...")
    # Intentar recuperación leyendo con codificación tolerante
    with open(db_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read().strip()
    
    # Si el archivo quedó trunco, cerrar el corchete de forma segura
    if not content.endswith("]"):
        content = content.rstrip(",") + "]"
    
    try:
        data = json.loads(content)
        with open(db_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ JSON reparado con éxito ({len(data)} registros recuperados).")
    except Exception as ex:
        print(f"❌ No se pudo auto-reparar automáticamente: {ex}")
