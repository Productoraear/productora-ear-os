import os
import json
import requests
from bs4 import BeautifulSoup

print("🚀 INICIANDO VAMPIRIZACIÓN E INYECCIÓN PREFERENTE DE PRODUCTORA EAR...")

base_dir = r"H:\EAR_OS_V2"
db_path = os.path.join(base_dir, "EAR_OS_V2", "src", "data", "all_providers_database.json")

# 1. Objeto VIP Soberano de Productora EAR
ear_sovereign_profile = {
    "id": "prov-ear-sovereign-01",
    "name": "Productora EAR",
    "phone": "693693048",
    "category": "musica",
    "province": "madrid",
    "verified": True,
    "source": "bodas.net_official_e78903",
    "isPreferred": True,
    "rank": 1,
    "badge": "S-CLASS PREFERRED #1",
    "basePrice": 650,
    "rating": "5.0",
    "reviews": 128,
    "sla": "12 W/pax Homologado + Póliza RC 1M€",
    "img": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200",
    "gallery": [
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200"
    ],
    "description": "Servicios de música, sonido profesional y shows en vivo de alta gama (Mariachis, Boleros, Baladas y DJ) dirigidos por Edwin Agudelo.",
    "description_full": "Productora EAR es el proveedor matriz y referente de la Red de Excelencia Nacional EAR OS. Especializados en producciones musicales integrales, agrupaciones de mariachis de alto nivel, tenores solistas y sonorización de alta fidelidad con equipamiento homologado (Behringer XR18, Bose F1 812, microfonía Shure Betas). Garantía total con contrato y cobertura RC de 1.000.000 €.",
    "address": "Méntrida (Toledo) / Cobertura Total en Comunidad de Madrid y Nacional",
    "services_list": [
        "Mariachi Aflamencado & Show Ranchero",
        "Tenor Solista (Boleros, Baladas, Música Sacra)",
        "Sonorización & Iluminación Pro (Bose/Behringer)",
        "Garantía Contractual & Póliza RC 1M€",
        "Asesoría Técnica y Escénica Personalizada"
    ]
}

# 2. Intento de Vampirización Scraping Directo
url = "https://www.bodas.net/musica/productora-ear--e78903"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
}

try:
    res = requests.get(url, headers=headers, timeout=10)
    if res.status_code == 200:
        soup = BeautifulSoup(res.text, "html.parser")
        title = soup.select_one(".storefrontHeader__title, h1")
        if title:
            ear_sovereign_profile["name"] = title.get_text(strip=True)
            print("✅ Título oficial extraído de Bodas.net.")
        
        imgs = soup.select("img")
        scraped_gallery = []
        for img in imgs:
            src = img.get("data-src") or img.get("src")
            if src and "http" in src and not any(k in src.lower() for k in ["logo", "avatar", "icon", "thumb", "watermark"]):
                scraped_gallery.append(src.split("?")[0])
        
        if scraped_gallery:
            ear_sovereign_profile["img"] = scraped_gallery[0]
            ear_sovereign_profile["gallery"] = scraped_gallery[:4]
            print(f"✅ {len(scraped_gallery[:4])} Fotografías HD originales extraídas de la ficha.")
except Exception as e:
    print(f"⚠️ Scraping directo omitido (Usando perfil estructurado S-Class de reserva): {e}")

# 3. Inyección en la Posición #1 de la Base de Datos
if os.path.exists(db_path):
    with open(db_path, "r", encoding="utf-8") as f:
        data = json.load(f)
else:
    data = []

# Filtrar duplicados previos de EAR
data = [p for p in data if "productora ear" not in str(p.get("name", "")).lower() and p.get("id") != "prov-ear-sovereign-01"]

# Inyectar al principio absoluto del array
data.insert(0, ear_sovereign_profile)

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("⭐ PRODUCTORA EAR POSICIONADA COMO PROVEEDOR PREFERENTE #1 CON ÉXITO.")
