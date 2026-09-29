"""
════════════════════════════════════════════════════════════════════════════════════════
EAR OS TELEMETRY & GEO/AI SEARCH ENGINE (VANGUARDIA 2050)
Pipeline Autónomo de Minería de Intención, Clustering Transaccional y pSEO Trigger
════════════════════════════════════════════════════════════════════════════════════════
"""

import os
import re
import json
import sys
from datetime import datetime

# Rutas SSOT
DATA_INPUT = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\telemetry\gsc-performance-data.json"
OUTPUT_REPORT_JSON = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\telemetry\gsc-classified-intelligence.json"
OUTPUT_REPORT_MD = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\telemetry\TELEMETRY_GSC_GEO_REPORT.md"

# ════════════════════════════════════════════════════════════════════════════════════════
# 4 CLÚSTERES QUIRÚRGICOS DE FACTURACIÓN EAR OS (REGEX S-CLASS)
# ════════════════════════════════════════════════════════════════════════════════════════

REGEX_VECTORS = {
    "TRANSACTIONAL_BODAS_EVENTOS": {
        "pattern": re.compile(r"(?!.*(edwin|productora\s?ear|vimume)).*(musica|saxofonista|violinista|cantante|grupo|dj|amenizacion|boda|evento|coctel|precio|tarifa|contratar|cuanto\scuesta|fiesta|show|animacion)", re.IGNORECASE),
        "target": "Depósito 100€ / Cotizador Inmediato (Price-Lock)",
        "priority": "P0_REVENUE",
        "action": "Vincular a /cotizador con precarga de servicios y Split 80/10/10"
    },
    "GEO_AI_CONVERSATIONAL_LONGTAIL": {
        "pattern": re.compile(r"^(\S+\s+){4,}\S+", re.IGNORECASE), # 5 o más palabras
        "geo_keywords": ["madrid", "toledo", "mentrida", "illescas", "arroyomolinos", "navalcarnero", "valdemoro", "aranjuez", "torrejon", "alcala", "talavera", "finca", "cortijo", "cigarral"],
        "target": "pSEO Landing Pages & Dominancia IA (Google AI / GEO)",
        "priority": "P1_PSEO_EXPANSION",
        "action": "Generar/Actualizar Landing pSEO con Schema JSON-LD de alta densidad"
    },
    "B2G_INSTITUTIONAL": {
        "pattern": re.compile(r".*\b(concierto|espectaculo|actuacion|sonorizacion|fiestas\spatronales|navidad|cultura|ayuntamiento|concejalia|licitacion|contrato\smenor|teatro|auditorio)\b.*", re.IGNORECASE),
        "target": "Licitaciones Menores B2G (< 14.250€ Art. 118 LCSP / VIMUME)",
        "priority": "P0_B2G_TENDER",
        "action": "Despachar Dossier B2G Institucional + Certificado VIMUME 10% Impacto"
    },
    "B2B_FINCAS_SOURCING": {
        "pattern": re.compile(r".*\b(finca|espacio|catering|wedding\splanner|salon|cortijo|palacio|complejo|hacienda)\b.*", re.IGNORECASE),
        "target": "Red de Fincas & Proveedores Aliados (Split 80/10/10)",
        "priority": "P1_B2B_SOURCING",
        "action": "Inyectar en Call Center / Radar de Proveedores para propuesta de Alianza"
    }
}

def analyze_telemetry():
    if not os.path.exists(DATA_INPUT):
        print(f"[!] Error: No se encontró el archivo de datos GSC en {DATA_INPUT}")
        return

    with open(DATA_INPUT, 'r', encoding='utf-8') as f:
        data = json.load(f)

    raw_queries = data.get('topQueries', [])
    if not raw_queries:
        raw_queries = data.get('topPerformingQueries', [])

    classified = {
        "TRANSACTIONAL_BODAS_EVENTOS": [],
        "GEO_AI_CONVERSATIONAL_LONGTAIL": [],
        "B2G_INSTITUTIONAL": [],
        "B2B_FINCAS_SOURCING": [],
        "UNCLASSIFIED_LONGTAIL": []
    }

    stats = {
        "total_analyzed": len(raw_queries),
        "classified_count": 0,
        "potential_impressions": 0,
        "potential_clicks": 0
    }

    for item in raw_queries:
        query_text = item.get('query', '').strip()
        clicks = item.get('clicks', 0)
        impressions = item.get('impressions', 0)
        pos = item.get('position', 99.0)
        ctr = item.get('ctr', 0.0)

        # Cálculo de Opportunity Score S-Class
        # Premia alto volumen de impresiones y posiciones en página 2 (11-20) fáciles de escalar a TOP 3
        opp_score = round(impressions * (1.0 / (pos + 1.0)) * 10, 2)
        enriched_item = {
            "query": query_text,
            "clicks": clicks,
            "impressions": impressions,
            "position": pos,
            "ctr": ctr,
            "opportunityScore": opp_score,
            "wordsCount": len(query_text.split())
        }

        matched = False

        # 1. B2G
        if REGEX_VECTORS["B2G_INSTITUTIONAL"]["pattern"].match(query_text):
            classified["B2G_INSTITUTIONAL"].append(enriched_item)
            matched = True

        # 2. Transaccional Bodas / Eventos
        elif REGEX_VECTORS["TRANSACTIONAL_BODAS_EVENTOS"]["pattern"].match(query_text):
            classified["TRANSACTIONAL_BODAS_EVENTOS"].append(enriched_item)
            matched = True

        # 3. Fincas y Sourcing
        elif REGEX_VECTORS["B2B_FINCAS_SOURCING"]["pattern"].match(query_text):
            classified["B2B_FINCAS_SOURCING"].append(enriched_item)
            matched = True

        # 4. GEO Conversacional (+5 palabras)
        if REGEX_VECTORS["GEO_AI_CONVERSATIONAL_LONGTAIL"]["pattern"].match(query_text):
            classified["GEO_AI_CONVERSATIONAL_LONGTAIL"].append(enriched_item)
            matched = True

        if matched:
            stats["classified_count"] += 1
            stats["potential_impressions"] += impressions
            stats["potential_clicks"] += clicks
        elif len(query_text.split()) >= 4:
            classified["UNCLASSIFIED_LONGTAIL"].append(enriched_item)

    # Ordenar cada clúster por Opportunity Score descendente
    for k in classified:
        classified[k].sort(key=lambda x: x["opportunityScore"], reverse=True)

    # Generar JSON de salida para Dashboard
    output_payload = {
        "timestamp": datetime.now().isoformat(),
        "stats": stats,
        "clusters": {
            k: {
                "vectorInfo": {
                    "target": REGEX_VECTORS.get(k, {}).get("target", "Longtail general"),
                    "priority": REGEX_VECTORS.get(k, {}).get("priority", "P2"),
                    "action": REGEX_VECTORS.get(k, {}).get("action", "Revisar"),
                    "pattern": REGEX_VECTORS.get(k, {}).get("pattern", re.compile("")).pattern if k in REGEX_VECTORS else ""
                },
                "totalQueries": len(classified[k]),
                "queries": classified[k]
            } for k in classified
        }
    }

    os.makedirs(os.path.dirname(OUTPUT_REPORT_JSON), exist_ok=True)
    with open(OUTPUT_REPORT_JSON, 'w', encoding='utf-8') as f:
        json.dump(output_payload, f, indent=2, ensure_ascii=False)

    # Generar Reporte Markdown
    md_content = f"""# 🦅 INFORME DE TELEMETRÍA GSC & GEO / AI INTENT (EAR OS 2050)
*Generado: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*

### 📊 Resumen Ejecutivo
- **Total Consultas Analizadas:** {stats['total_analyzed']}
- **Consultas con Intención de Alto Valor:** {stats['classified_count']} ({round((stats['classified_count']/stats['total_analyzed'])*100, 1) if stats['total_analyzed'] > 0 else 0}%)
- **Impresiones Potenciales Cualificadas:** {stats['potential_impressions']}
- **Clics Actuales:** {stats['potential_clicks']}

---

### 1. 💍 Vector Bodas & Eventos Privados (Depósito 100€ / Price-Lock)
*Acción Automática:* Vincular consultas huérfanas a landing de reserva directa.
| Consulta | Impresiones | Clics | Posición | CTR | Opp. Score |
| :--- | :---: | :---: | :---: | :---: | :---: |
"""
    for q in classified["TRANSACTIONAL_BODAS_EVENTOS"][:15]:
        md_content += f"| **{q['query']}** | {q['impressions']} | {q['clicks']} | {q['position']} | {q['ctr']}% | `{q['opportunityScore']}` |\n"

    md_content += f"""
---

### 2. 🏰 Vector Fincas, Cortijos y Alianzas B2B (Split 80/10/10)
*Acción Automática:* Inyección en Radar Call Center para captación de alianzas.
| Finca / Espacio | Impresiones | Clics | Posición | CTR | Opp. Score |
| :--- | :---: | :---: | :---: | :---: | :---: |
"""
    for q in classified["B2B_FINCAS_SOURCING"][:15]:
        md_content += f"| **{q['query']}** | {q['impressions']} | {q['clicks']} | {q['position']} | {q['ctr']}% | `{q['opportunityScore']}` |\n"

    md_content += f"""
---

### 3. 🤖 Vector GEO / Conversacional IA (+5 palabras)
*Acción Automática:* Inyección en páginas pSEO locales (Madrid / Toledo / Méntrida).
| Consulta Larga | Palabras | Impresiones | Posición | Opp. Score |
| :--- | :---: | :---: | :---: | :---: |
"""
    for q in classified["GEO_AI_CONVERSATIONAL_LONGTAIL"][:15]:
        md_content += f"| **{q['query']}** | {q['wordsCount']} | {q['impressions']} | {q['position']} | `{q['opportunityScore']}` |\n"

    md_content += f"""
---

### 4. 🏛️ Vector B2G Institucional (Licitaciones < 14.250€)
| Consulta B2G | Impresiones | Clics | Posición | Opp. Score |
| :--- | :---: | :---: | :---: | :---: |
"""
    for q in classified["B2G_INSTITUTIONAL"][:10]:
        md_content += f"| **{q['query']}** | {q['impressions']} | {q['clicks']} | {q['position']} | `{q['opportunityScore']}` |\n"

    with open(OUTPUT_REPORT_MD, 'w', encoding='utf-8') as f:
        f.write(md_content)

    print(f"[OK] Telemetria clasificada con exito.")
    print(f"[OK] JSON generado en: {OUTPUT_REPORT_JSON}")
    print(f"[OK] Reporte MD generado en: {OUTPUT_REPORT_MD}")
    print(f"\nResumen:")
    print(f" - Bodas/Eventos: {len(classified['TRANSACTIONAL_BODAS_EVENTOS'])} queries")
    print(f" - Fincas/B2B: {len(classified['B2B_FINCAS_SOURCING'])} queries")
    print(f" - GEO/AI Longtail: {len(classified['GEO_AI_CONVERSATIONAL_LONGTAIL'])} queries")
    print(f" - B2G Institucional: {len(classified['B2G_INSTITUTIONAL'])} queries")

if __name__ == "__main__":
    analyze_telemetry()
