import os
import json

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"
db_path = os.path.join(base_dir, "src", "data", "all_providers_database.json")

with open(db_path, "r", encoding="utf-8-sig") as f:
    providers = json.load(f)

# Actualizar el perfil soberano con el Pack Solista Premium
for p in providers:
    if p.get("id") == "prov-ear-sovereign-01" or "productora ear" in str(p.get("name")).lower():
        p["basePrice"] = 350
        p["img"] = "/images/mariachi.png"
        p["gallery"] = ["/images/mariachi.png"]
        p["pack_name"] = "Pack Solista Premium \u2014 Experiencia Irresistible"
        p["description"] = "Show musical en vivo de 1 hora (2 pases), sonido profesional Bose, ramo de flores, canci\u00f3n personalizada y sesi\u00f3n de fotos con sombreros tem\u00e1ticos."
        p["description_full"] = "La propuesta m\u00e1s completa en relaci\u00f3n calidad-precio. Incluye actuaci\u00f3n de 1 hora en 2 salidas de 30 min (12-14 canciones), sonorizaci\u00f3n de alta fidelidad Bose, entrega de ramo de flores en vivo, canci\u00f3n personalizada dedicada y sesi\u00f3n fotogr\u00e1fica con sombreros tem\u00e1ticos y env\u00edo de galer\u00eda digital HD v\u00eda email."
        p["services_list"] = [
            "Actuaci\u00f3n Musical en Vivo (1 Hora / 2 pases de 30 min / 12-14 canciones)",
            "Sonorizaci\u00f3n Profesional de Alta Fidelidad BOSE",
            "Entrega de Ramo de Flores en directo",
            "Canci\u00f3n Personalizada adaptada al evento",
            "Sesi\u00f3n Fotogr\u00e1fica con sombreros tem\u00e1ticos y env\u00edo digital HD",
            "Garant\u00eda de Exclusividad: Bloqueo total de agenda ese d\u00eda"
        ]
        p["whatsapp_payload"] = "Hola Productora EAR, deseo reservar el PACK SOLISTA PREMIUM (350\u20ac) con sonido Bose, flores, fotos y canci\u00f3n personalizada."

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(providers, f, ensure_ascii=False, indent=2)

print("[OK] Pack Solista Premium inyectado correctamente en el catalogo maestro.")
