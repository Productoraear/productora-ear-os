import os
import json

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"
db_path = os.path.join(base_dir, "src", "data", "all_providers_database.json")

with open(db_path, "r", encoding="utf-8") as f:
    providers = json.load(f)

# Actualizar el perfil soberano con el Pack Solista Premium
for p in providers:
    if p.get("id") == "prov-ear-sovereign-01" or "productora ear" in str(p.get("name")).lower():
        p["basePrice"] = 350
        p["pack_name"] = "Pack Solista Premium — Experiencia Irresistible"
        p["description"] = "Show musical en vivo de 1 hora (2 pases), sonido profesional Bose, ramo de flores, canción personalizada y sesión de fotos con sombreros temáticos."
        p["description_full"] = "La propuesta más completa en relación calidad-precio. Incluye actuación de 1 hora en 2 salidas de 30 min (12-14 canciones), sonorización de alta fidelidad Bose, entrega de ramo de flores en vivo, canción personalizada dedicada y sesión fotográfica con sombreros temáticos y envío de galería digital HD vía email."
        p["services_list"] = [
            "Actuación Musical en Vivo (1 Hora / 2 pases de 30 min / 12-14 canciones)",
            "Sonorización Profesional de Alta Fidelidad BOSE",
            "Entrega de Ramo de Flores en directo",
            "Canción Personalizada adaptada al evento",
            "Sesión Fotográfica con sombreros temáticos y envío digital HD",
            "Garantía de Exclusividad: Bloqueo total de agenda ese día"
        ]
        p["whatsapp_payload"] = "Hola Productora EAR, deseo reservar el PACK SOLISTA PREMIUM (350€) con sonido Bose, flores, fotos y canción personalizada."

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(providers, f, ensure_ascii=False, indent=2)

print("✅ Pack Solista Premium inyectado correctamente en el catálogo maestro.")
