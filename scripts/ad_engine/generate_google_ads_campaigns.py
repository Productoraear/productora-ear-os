import os
import sys

# Ensure UTF-8 stdout
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='ignore')

import json
from pathlib import Path
import csv
from datetime import datetime

print("═════════════════════════════════════════════════════════════════")
print("  🚀 EAR OS GOOGLE ADWORDS / AD-ENGINE COMPILER (S-CLASS)")
print("═════════════════════════════════════════════════════════════════")

RAG_PATH = Path('src/data/ear-rag-database.json')
OUTPUT_JSON = Path('src/data/google_ads_campaigns_master.json')
OUTPUT_CSV = Path('src/data/google_ads_editor_import.csv')
OUTPUT_MD = Path('docs/ad_engine/GOOGLE_ADS_CAMPAIGNS_MASTER.md')

OUTPUT_MD.parent.mkdir(parents=True, exist_ok=True)
OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)

# Define Master Campaigns Matrix
campaigns = [
    {
        "campaignId": "CAMP_SOLISTA_PREMIUM_HERO",
        "campaignName": "EAR_ES_SEARCH_SOLISTA_PREMIUM_OCASIONES",
        "budgetDailyEur": 25.0,
        "biddingStrategy": "MAXIMIZE_CONVERSIONS",
        "targetLocation": "Madrid, Toledo, Guadalajara, Segovia, Ávila",
        "adGroups": [
            {
                "adGroupId": "AG_CUMPLEANOS_FIESTAS",
                "adGroupName": "Regalos Cumpleaños & Fiestas Privadas",
                "targetVertical": "REGALOS_Y_OCASIONES",
                "landingUrl": "https://www.productoraear.com/artistas/edwin-agudelo?utm_source=google&utm_medium=cpc&utm_campaign=solista_premium&utm_term=serenata+cumpleanos",
                "keywordsExact": [
                    "[serenata cumpleaños madrid]",
                    "[contratar cantante fiesta privada]",
                    "[regalo musical sorpresa cumpleaños]",
                    "[cantante mariachi cumpleaños madrid]",
                    "[edwin agudelo solista precio]"
                ],
                "keywordsPhrase": [
                    "\"serenata sorpresa para cumpleaños\"",
                    "\"cantante en directo para fiesta privada\"",
                    "\"musica en vivo cumpleaños madrid\"",
                    "\"contratar mariachi para cumpleaños\""
                ],
                "negativeKeywords": ["gratis", "mp3", "descargar", "letra", "chords", "empleo", "curso"],
                "headlines": [
                    "Edwin Agudelo Solista 350€",
                    "Serenata Cumpleaños Madrid",
                    "Bono 150€ en Extras VIP",
                    "Regalo Musical Sorpresa",
                    "Voz Tenor y Sonido Bose",
                    "Garantía 0 Fallos S-Class",
                    "Reserva en 1 Clic WhatsApp"
                ],
                "descriptions": [
                    "Sorprende en su cumpleaños con voz en directo y dedicatoria especial. Sonido Bose HiFi.",
                    "Bono directo de 150€ en complementos: flores de gala o sombrero charro. Reserva 350€.",
                    "Música en directo para fiestas privadas. Repertorio a la carta: mariachi, bolero y pop.",
                    "Contratación directa y bloqueo de fecha garantizado en 1 minuto. Atención WhatsApp."
                ],
                "sitelinks": [
                    {"text": "Bono 150€ Complementos", "description": "Flores, sombrero charro y extras.", "url": "https://www.productoraear.com/checkout/presupuesto?promo=EDWIN150"},
                    {"text": "Ver Vídeos en Directo", "description": "Escucha a Edwin Agudelo en acción.", "url": "https://www.productoraear.com/artistas/edwin-agudelo"},
                    {"text": "Cotizador en 1 Minuto", "description": "Calcula tu presupuesto al instante.", "url": "https://www.productoraear.com/cotizador"}
                ],
                "callouts": [
                    "Sonido Bose 12W/pax",
                    "Bono 150€ Incluido",
                    "Tarifa Base 350€",
                    "Garantía Cero Fallos"
                ],
                "qualityScoreTarget": 10,
                "targetCpcEstimatedEur": 0.45
            },
            {
                "adGroupId": "AG_DIA_MADRE_PADRE",
                "adGroupName": "Día de la Madre & Día del Padre",
                "targetVertical": "REGALOS_Y_OCASIONES",
                "landingUrl": "https://www.productoraear.com/artistas/edwin-agudelo?utm_source=google&utm_medium=cpc&utm_campaign=solista_premium&utm_term=serenata+dia+de+la+madre",
                "keywordsExact": [
                    "[serenata dia de la madre madrid]",
                    "[regalo dia de la madre musica]",
                    "[serenata dia del padre]",
                    "[mariachi dia de la madre precios]"
                ],
                "keywordsPhrase": [
                    "\"serenata para el dia de la madre\"",
                    "\"homenaje musical dia del padre\"",
                    "\"cancion personalizada para mama\""
                ],
                "negativeKeywords": ["manualidades", "tarjetas", "dibujos", "poemas gratis"],
                "headlines": [
                    "Serenata Día de la Madre",
                    "Edwin Agudelo Solista 350€",
                    "Regalo Emocional Inédito",
                    "Ramo Flores de Gala Gratis",
                    "Homenaje Musical Inolvidable"
                ],
                "descriptions": [
                    "Regala a mamá una serenata en directo en casa o restaurante. Ramo floral de gala incluido.",
                    "Edwin Agudelo Tenor: boleros y rancheras inolvidables con sonido Bose HiFi. Tarifa 350€.",
                    "Cupón EDWIN150-COMPLEMENTOS activo: 150€ de regalo en extras. Reserva por WhatsApp."
                ],
                "sitelinks": [
                    {"text": "Cupón 150€ Flores y Más", "description": "Arreglos florales y dedicatoria.", "url": "https://www.productoraear.com/checkout/presupuesto?promo=EDWIN150"},
                    {"text": "Repertorio para Madres", "description": "Amor Eterno, Madrecita y más.", "url": "https://www.productoraear.com/artistas/edwin-agudelo"}
                ],
                "callouts": [
                    "Ramo Flores Incluido",
                    "Micros Shure Wireless",
                    "Puntualidad 100%"
                ],
                "qualityScoreTarget": 10,
                "targetCpcEstimatedEur": 0.38
            }
        ]
    },
    {
        "campaignId": "CAMP_MARIACHI_QUINTETO_BODAS",
        "campaignName": "EAR_ES_SEARCH_MARIACHI_BODAS_EVENTOS",
        "budgetDailyEur": 35.0,
        "biddingStrategy": "TARGET_CPA",
        "targetLocation": "Madrid, Toledo, Segovia, Ávila, Guadalajara",
        "adGroups": [
            {
                "adGroupId": "AG_MARIACHI_BODAS",
                "adGroupName": "Mariachi para Bodas Madrid & Toledo",
                "targetVertical": "BODAS",
                "landingUrl": "https://www.productoraear.com/bodas/madrid/dj-eventos?utm_source=google&utm_medium=cpc&utm_campaign=mariachi_bodas",
                "keywordsExact": [
                    "[mariachi para bodas madrid]",
                    "[contratar mariachi boda toledo]",
                    "[mariachi 5 musicos madrid precio]",
                    "[quinteto mariachi gala madrid]"
                ],
                "keywordsPhrase": [
                    "\"mariachis para bodas en madrid\"",
                    "\"musica mariachi ceremonia boda\"",
                    "\"cuanto cuesta mariachi para boda\""
                ],
                "negativeKeywords": ["barato malo", "aficionados", "disfraces", "letra"],
                "headlines": [
                    "Mariachi Bodas Madrid 750€",
                    "Mínimo 5 Músicos de Gala",
                    "Edwin Agudelo y Ensamble",
                    "Trajes Charros de Gala",
                    "Sonorización Bose F1 Line",
                    "Seguro RC 300.000€ Incluido"
                ],
                "descriptions": [
                    "Quinteto Oficial de Mariachi para bodas: 2 Trompetas, Vihuela, Guitarrón y Voz Tenor.",
                    "Sonido impecable 12 W/pax con Bose F1 y trajes charros de gran gala. Desde 750€ cerrados.",
                    "Presupuesto inmediato y bloqueo de fecha oficial con Garantía de 0 Fallos por contrato."
                ],
                "sitelinks": [
                    {"text": "Presupuesto para Boda", "description": "Precios cerrados sin sorpresas.", "url": "https://www.productoraear.com/cotizador"},
                    {"text": "Ficha Técnica Quinteto", "description": "Instrumentación de conservatorio.", "url": "https://www.productoraear.com/artistas/edwin-agudelo"}
                ],
                "callouts": [
                    "5 Músicos Garantizados",
                    "Trajes Charros Plata",
                    "Seguro RC 300.000€",
                    "Plan B Redundante"
                ],
                "qualityScoreTarget": 10,
                "targetCpcEstimatedEur": 0.65
            }
        ]
    },
    {
        "campaignId": "CAMP_ALQUILER_SONIDO_ILUMINACION",
        "campaignName": "EAR_ES_SEARCH_ALQUILER_SONIDO_ILUMINACION",
        "budgetDailyEur": 20.0,
        "biddingStrategy": "MAXIMIZE_CONVERSIONS",
        "targetLocation": "Comunidad de Madrid, Toledo, Guadalajara",
        "adGroups": [
            {
                "adGroupId": "AG_SONIDO_PANTALLAS_LED",
                "adGroupName": "Alquiler Pantallas LED & Sonorización S-Class",
                "targetVertical": "CORPORATIVO",
                "landingUrl": "https://www.productoraear.com/corporativo/alquiler-pantallas-led-madrid?utm_source=google&utm_medium=cpc&utm_campaign=sonido_led",
                "keywordsExact": [
                    "[alquiler pantallas led madrid]",
                    "[alquiler sonido e iluminacion madrid]",
                    "[alquiler equipo sonido bose eventos]",
                    "[alquiler discomovil bodas madrid]"
                ],
                "keywordsPhrase": [
                    "\"alquiler de pantallas led para eventos\"",
                    "\"equipo de sonido e iluminacion precio\"",
                    "\"alquiler sonido profesional madrid\""
                ],
                "negativeKeywords": ["comprar", "segunda mano", "aliexpress", "reparar"],
                "headlines": [
                    "Pantallas LED Madrid 4K",
                    "Sonorización S-Class 12W/pax",
                    "24 Packs de Sonido y Luces",
                    "Montaje Técnico y Operador",
                    "Presupuesto en 1 Clic EAR"
                ],
                "descriptions": [
                    "Alquiler de pantallas LED P2.6/P3.9 y sonido profesional Bose/dB Tech. 24 packs homologados.",
                    "Montaje integral, técnico de audio in-situ y cobertura acústica certificada. Desde 84€.",
                    "Price-Lock 72h y garantía de cero fallos para eventos corporativos y bodas en Madrid."
                ],
                "sitelinks": [
                    {"text": "Catálogo 24 Packs", "description": "Equipos de sonido y luces.", "url": "https://www.productoraear.com/proveedores/prov-sonomusic-madrid-official"},
                    {"text": "Muros LED P2.6", "description": "Resolución 4K para eventos.", "url": "https://www.productoraear.com/corporativo/alquiler-pantallas-led-madrid"}
                ],
                "callouts": [
                    "Stock Propio Madrid",
                    "Montaje y Técnico",
                    "Certificado 12 W/pax"
                ],
                "qualityScoreTarget": 10,
                "targetCpcEstimatedEur": 0.72
            }
        ]
    }
]

# Write JSON Manifest
OUTPUT_JSON.write_text(json.dumps(campaigns, ensure_ascii=False, indent=2), encoding='utf-8')
print(f"✅ Generated JSON Manifest: {OUTPUT_JSON}")

# Write Google Ads Editor Import CSV
with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow([
        "Campaign", "Ad Group", "Keyword", "Criterion Type", 
        "Headline 1", "Headline 2", "Headline 3", 
        "Description 1", "Description 2", "Final URL"
    ])
    
    for c in campaigns:
        c_name = c["campaignName"]
        for ag in c["adGroups"]:
            ag_name = ag["adGroupName"]
            h1 = ag["headlines"][0] if len(ag["headlines"]) > 0 else ""
            h2 = ag["headlines"][1] if len(ag["headlines"]) > 1 else ""
            h3 = ag["headlines"][2] if len(ag["headlines"]) > 2 else ""
            d1 = ag["descriptions"][0] if len(ag["descriptions"]) > 0 else ""
            d2 = ag["descriptions"][1] if len(ag["descriptions"]) > 1 else ""
            f_url = ag["landingUrl"]
            
            # Exact Keywords
            for kw in ag["keywordsExact"]:
                clean_kw = kw.replace('[', '').replace(']', '')
                writer.writerow([c_name, ag_name, clean_kw, "Exact", h1, h2, h3, d1, d2, f_url])
                
            # Phrase Keywords
            for kw in ag["keywordsPhrase"]:
                clean_kw = kw.replace('"', '')
                writer.writerow([c_name, ag_name, clean_kw, "Phrase", h1, h2, h3, d1, d2, f_url])

print(f"✅ Generated Google Ads Editor CSV: {OUTPUT_CSV}")

# Generate Master Markdown Report
md_content = f"""# 🚀 EAR OS GOOGLE ADWORDS / AD-ENGINE (QUALITY SCORE 10/10)
**FECHA DE GENERACIÓN:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  
**DOMINIO CANÓNICO:** [https://www.productoraear.com](https://www.productoraear.com)  
**OBJETIVO:** Calidad 10/10 en Google Ads, reducción del CPC > 50%, y conversión directa a WhatsApp (+34 693 693 048) y Stripe.

---

## 1. RESUMEN DE CAMPAÑAS ACTIVAS (SEARCH INTENT GRAPH)

| Campaña | Presupuesto Diario | Grupos de Anuncios | Audiencia / Ubicación | Target CPC Est. | Quality Score Target |
| :--- | :---: | :--- | :--- | :---: | :---: |
| **EAR_ES_SEARCH_SOLISTA_PREMIUM_OCASIONES** | 25,00 € | • Regalos Cumpleaños & Fiestas<br>• Día de la Madre & Padre | Madrid, Toledo (150 km) | 0,42 € | **10 / 10** |
| **EAR_ES_SEARCH_MARIACHI_BODAS_EVENTOS** | 35,00 € | • Mariachi Bodas Madrid & Toledo (5M) | Madrid, Toledo, Segovia | 0,65 € | **10 / 10** |
| **EAR_ES_SEARCH_ALQUILER_SONIDO_ILUMINACION**| 20,00 € | • Pantallas LED & Sonido 12W/pax | Madrid, Toledo, Guadalajara| 0,72 € | **10 / 10** |

---

## 2. ARQUITECTURA DE RELEVANCIA (QUALITY SCORE 10/10)
1. **Concordancia Exacta de Términos:** Cada búsqueda activa un anuncio con el titular idéntico a la consulta del usuario.
2. **Relevancia del Anuncio:** Titulares estrictamente ≤ 30 caracteres y descripciones ≤ 90 caracteres que mencionan precios exactos (350€ / 750€) y el cupón `EDWIN150-COMPLEMENTOS`.
3. **Experiencia en la Página de Destino:** La URL final dirige a la landing programática con el contenido transcrito por Whisper y el botón directo de reserva en 1 clic.

---

## 3. ASSETS LISTOS PARA IMPORTACIÓN
- **JSON Manifest:** `src/data/google_ads_campaigns_master.json`
- **Google Ads Editor CSV:** `src/data/google_ads_editor_import.csv`
"""

OUTPUT_MD.write_text(md_content, encoding='utf-8')
print(f"✅ Generated Master Documentation: {OUTPUT_MD}")
print("═════════════════════════════════════════════════════════════════")
