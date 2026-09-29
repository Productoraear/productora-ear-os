"""
════════════════════════════════════════════════════════════════════════════════════════
EAR OS SITEMAP & SEARCH INTENT LANDING ENGINE (S-CLASS 2050)
Genera y valida la URL canónica y la Landing Page para CADA intención de búsqueda
del Search Console Dataset (2026-09-29) garantizando el TOP 1 en Google & AI Search.
════════════════════════════════════════════════════════════════════════════════════════
"""

import os
import re
import csv
import io
import json
import zipfile
from datetime import datetime

ZIP_VAULT_PATH = r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\https___www.productoraear.com_-Performance-on-Search-2026-09-29.zip"
OUTPUT_INTENT_JSON = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\telemetry\gsc-sitemap-intent-landings.json"
OUTPUT_INTENT_MD = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\telemetry\SITEMAP_SEARCH_INTENT_TOP1_DOSSIER.md"

BASE_URL = "https://productoraear.com"

# Reglas de normalización de Slugs RFC 3986
def slugify(text):
    if not text: return ""
    text = text.lower().strip()
    # Reemplazar acentos
    replacements = (
        ("á", "a"), ("é", "e"), ("í", "i"), ("ó", "o"), ("ú", "u"),
        ("ñ", "n"), ("ü", "u"), ("ç", "c")
    )
    for a, b in replacements:
        text = text.replace(a, b)
    text = re.sub(r'[^a-z0-9\- ]', '', text)
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

# Mapa de provincias y comarcas
PROVINCIAS = [
    "madrid", "toledo", "barcelona", "valencia", "sevilla", "zaragoza", "malaga",
    "murcia", "palma", "baleares", "las-palmas", "santa-cruz-de-tenerife", "vizcaya",
    "bilbao", "alava", "guipuzcoa", "navarra", "valladolid", "cordoba", "granada",
    "almeria", "cadiz", "huelva", "jaen", "castellon", "alicante", "cuenca",
    "guadalajara", "ciudad-real", "albacete", "caceres", "badajoz", "salamanca",
    "burgos", "leon", "palencia", "zamora", "avila", "segovia", "soria", "la-rioja",
    "oviedo", "asturias", "santander", "cantabria", "coruna", "lugo", "ourense", "pontevedra", "girona", "tarragona", "lleida"
]

def detect_province(query):
    for p in PROVINCIAS:
        if re.search(r'\b' + p.replace('-', ' ') + r'\b', query, re.IGNORECASE):
            return p
    return "madrid" # Default territorial

def resolve_landing_for_query(query, impressions, clicks, pos, ctr):
    q_lower = query.lower().strip()
    q_slug = slugify(q_lower)
    words = q_lower.split()
    prov = detect_province(q_lower)

    # 1. FINCAS Y CORTIJOS ESPECÍFICOS
    if any(k in q_lower for k in ["finca", "cortijo", "cigarral", "hacienda", "palacio", "alqueria", "torre ", "masia"]):
        finca_name = slugify(re.sub(r'\b(finca|cortijo|cigarral|hacienda|palacio|alqueria|masia)\b', '', q_lower))
        canonical_path = f"/fincas/{prov}/{q_slug}"
        intent_type = "FINCA_EXCLUSIVE_VENUE"
        page_title = f"{query.title()} · Finca Homologada para Bodas y Eventos Exclusivos"
        meta_desc = f"Descubre {query.title()} en {prov.title()}. Servicios musicales premium, sonido Bose 12W/pax y catering de brasas con garantía Productora EAR."
        target_cta = "Cotizar Fecha en Finca (Depósito 100€ Price-Lock)"

    # 2. PROVEEDORES / TIENDAS / MARCAS ESPECÍFICAS
    elif any(k in q_lower for k in ["regalos", "vestidos", "joyeria", "catering", "ostras", "fotografia", "video", "tarta", "floristeria", "setroimagen", "ana mari"]):
        canonical_path = f"/proveedores/{q_slug}"
        intent_type = "PROVIDER_DIRECTORY"
        page_title = f"{query.title()} · Proveedor Verificado de Bodas & Eventos"
        meta_desc = f"Ficha oficial y contacto directo con {query.title()}. Disponibilidad, presupuestos transparentes y alianza auditada por Productora EAR."
        target_cta = "Contactar Proveedor / Ver Alianza 80/10/10"

    # 3. PANTALLAS LED Y EQUIPAMIENTO TÉCNICO
    elif any(k in q_lower for k in ["pantalla", "led", "pantallas", "proyector", "audiovisual"]):
        canonical_path = f"/arsenal/pantallas-led/{prov}"
        intent_type = "ARSENAL_TECH_LED"
        page_title = f"Alquiler de Pantallas LED para Eventos en {prov.title()} · Productora EAR"
        meta_desc = f"Alquiler e instalación de pantallas LED gigantes de alta resolución (P2.6/P3.9) en {prov.title()} para bodas, conciertos y ferias. Tarifa transparente."
        target_cta = "Reservar Pantalla LED (Garantía Técnica Total)"

    # 4. DJ Y FIESTA
    elif any(k in q_lower for k in ["dj", "discoteca", "hora loca", "barra libre", "fiesta"]):
        canonical_path = f"/bodas/{prov}/dj/{prov}"
        intent_type = "ARTIST_DJ_PARTY"
        page_title = f"DJ Profesional para Bodas y Fiestas en {prov.title()} · Productora EAR"
        meta_desc = f"Contrata al mejor DJ para tu boda en {prov.title()}. Sonorización completa, iluminación robótica y repertorio a la carta con cierre garantizado."
        target_cta = "Contratar DJ (Depósito 100€ Price-Lock)"

    # 5. MARIACHIS Y SERENATAS
    elif any(k in q_lower for k in ["mariachi", "mariachis", "ranchera", "serenata"]):
        canonical_path = f"/bodas/{prov}/mariachi-gala/{prov}"
        intent_type = "ARTIST_MARIACHI_GALA"
        page_title = f"Mariachis de Gala para Bodas y Serenatas en {prov.title()} · Edwin Agudelo"
        meta_desc = f"Mariachi de gala profesional en {prov.title()}. Trajes de charro impecables, repertorio tradicional mexicano y emoción garantizada."
        target_cta = "Reservar Mariachi de Gala (Split 80/10/10)"

    # 6. SONIDO E ILUMINACIÓN
    elif any(k in q_lower for k in ["sonido", "iluminacion", "altavoces", "line array", "microfonos"]):
        canonical_path = f"/bodas/{prov}/sonido-iluminacion/{prov}"
        intent_type = "ARSENAL_AUDIO_LIGHTS"
        page_title = f"Alquiler de Sonido e Iluminación 12W/pax en {prov.title()} · Rider Acústico"
        meta_desc = f"Sonorización profesional para eventos en {prov.title()} con sistemas Bose F1 / S1 Pro. Cumplimiento estricto < 75 dB SPL y cobertura acústica total."
        target_cta = "Solicitar Rider Acústico Inmediato"

    # 7. WEDDING PLANNERS Y ORGANIZACIÓN
    elif any(k in q_lower for k in ["wedding planner", "organizacion", "coordinador"]):
        canonical_path = f"/bodas/{prov}/wedding-planner/{prov}"
        intent_type = "WEDDING_PLANNING_VIP"
        page_title = f"Wedding Planner & Coordinación de Bodas de Lujo en {prov.title()}"
        meta_desc = f"Organización integral de bodas en {prov.title()}. Gestión de proveedores, timing minucioso y diseño de experiencias inolvidables."
        target_cta = "Agendar Asesoría de Boda VIP"

    # 8. COCHES CLÁSICOS Y TRANSPORTE
    elif any(k in q_lower for k in ["coche", "coches", "limusina", "carruaje", "transporte"]):
        canonical_path = f"/bodas/{prov}/coches-clasicos/{prov}"
        intent_type = "CHAUFFEUR_LUXURY_CARS"
        page_title = f"Alquiler de Coches Clásicos y Chauffeur VIP para Bodas en {prov.title()}"
        meta_desc = f"Vehículos de época y alta gama para novios en {prov.title()}. Chófer uniformado, decoración floral y máxima puntualidad."
        target_cta = "Reservar Coche Clásico para Boda"

    # 9. GENERAL / LONGTAIL CONVERSACIONAL
    else:
        canonical_path = f"/bodas/{prov}/servicios/{q_slug}"
        intent_type = "GENERAL_CONVERSATIONAL_PSEO"
        page_title = f"{query.title()} · Servicios para Bodas y Eventos en {prov.title()}"
        meta_desc = f"Solución integral para '{query.title()}' en {prov.title()}. Calidad verificada, tarifas directas sin intermediarios y depósito protegido de 100€."
        target_cta = "Cotizar Servicio (Price-Lock 100€)"

    # Opportunity Score S-Class
    opp_score = round(impressions * (1.0 / (pos + 1.0)) * 10, 2)

    return {
        "query": query,
        "impressions": int(impressions),
        "clicks": int(clicks),
        "ctr": float(ctr),
        "position": float(pos),
        "opportunityScore": opp_score,
        "intentType": intent_type,
        "province": prov,
        "canonicalUrl": f"{BASE_URL}{canonical_path}",
        "internalPath": canonical_path,
        "seoTitle": page_title,
        "metaDescription": meta_desc,
        "targetCta": target_cta,
        "wordsCount": len(words)
    }

def process_search_console_vault():
    if not os.path.exists(ZIP_VAULT_PATH):
        print(f"[!] Error: No existe el archivo zip en {ZIP_VAULT_PATH}")
        return

    print(f"[*] Abriendo bóveda GSC: {ZIP_VAULT_PATH}")
    with zipfile.ZipFile(ZIP_VAULT_PATH, 'r') as z:
        # Extraer Consultas.csv
        consultas_filename = None
        for n in z.namelist():
            if 'consultas' in n.lower():
                consultas_filename = n
                break

        if not consultas_filename:
            print("[!] No se encontró Consultas.csv en el zip")
            return

        with z.open(consultas_filename) as f:
            reader = csv.reader(io.TextIOWrapper(f, encoding='utf-8', errors='replace'))
            header = next(reader, None)
            
            all_intents = []
            for row in reader:
                if not row or len(row) < 5: continue
                q_text = row[0].strip()
                clicks = float(row[1].replace(',', '.').replace('%', '').strip() or 0)
                impressions = float(row[2].replace(',', '.').replace('%', '').strip() or 0)
                ctr = float(row[3].replace(',', '.').replace('%', '').strip() or 0)
                pos = float(row[4].replace(',', '.').replace('%', '').strip() or 99)

                intent_record = resolve_landing_for_query(q_text, impressions, clicks, pos, ctr)
                all_intents.append(intent_record)

    # Ordenar por Opportunity Score
    all_intents.sort(key=lambda x: x["opportunityScore"], reverse=True)

    # Agrupar por tipo de intención
    grouped_by_type = {}
    for item in all_intents:
        itype = item["intentType"]
        if itype not in grouped_by_type:
            grouped_by_type[itype] = []
        grouped_by_type[itype].append(item)

    # Métricas globales
    total_queries = len(all_intents)
    total_impressions = sum(x["impressions"] for x in all_intents)
    total_clicks = sum(x["clicks"] for x in all_intents)

    # Exportar JSON de Intenciones & URLs para Sitemap / Next.js
    payload = {
        "timestamp": datetime.now().isoformat(),
        "source": "Google Search Console (2026-09-29)",
        "totals": {
            "totalQueries": total_queries,
            "totalImpressions": total_impressions,
            "totalClicks": total_clicks,
            "totalIntentClusters": len(grouped_by_type)
        },
        "clusters": grouped_by_type,
        "allIntents": all_intents
    }

    os.makedirs(os.path.dirname(OUTPUT_INTENT_JSON), exist_ok=True)
    with open(OUTPUT_INTENT_JSON, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    # Generar Dossier Markdown de Mapeo Exhaustivo
    md = f"""# 🦅 DOSSIER DE INTENCIONES DE BÚSQUEDA Y LANDINGS TOP 1 (EAR OS 2050)
*Fuente: Search Console Performance 2026-09-29 | Estado: 100% Cobertura Activa*

### 🚀 Resumen de Cobertura
- **Total Intenciones Mapeadas:** {total_queries} consultas
- **Impresiones en Juego:** {total_impressions:,} impresiones
- **Clics Base Actuales:** {total_clicks:,} clics
- **Clústeres Semánticos:** {len(grouped_by_type)} categorías estratégicas

---

"""

    for itype, items in grouped_by_type.items():
        sub_imp = sum(x["impressions"] for x in items)
        sub_clicks = sum(x["clicks"] for x in items)
        md += f"## 🎯 {itype} ({len(items)} queries · {sub_imp:,} imp · {sub_clicks} clics)\n\n"
        md += "| Consulta | URL Canónica Landing Page | Pos | Imp | Opp. Score | Acción de Conversión |\n"
        md += "| :--- | :--- | :---: | :---: | :---: | :--- |\n"
        for item in items[:15]: # Top 15 de cada clúster
            md += f"| **{item['query']}** | [`{item['internalPath']}`]({item['canonicalUrl']}) | {item['position']} | {item['impressions']} | `{item['opportunityScore']}` | {item['targetCta']} |\n"
        md += "\n---\n\n"

    with open(OUTPUT_INTENT_MD, 'w', encoding='utf-8') as f:
        f.write(md)

    print(f"[OK] Ingesta y mapeo completado con exito.")
    print(f"[OK] {total_queries} intenciones asignadas a URLs canonicas en {OUTPUT_INTENT_JSON}")
    print(f"[OK] Dossier generado en {OUTPUT_INTENT_MD}")

if __name__ == "__main__":
    process_search_console_vault()
