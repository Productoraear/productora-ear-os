#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANTIGRAVITY OMEGA v4.1 — GENERADOR DE DESPACHOS DIPLOMÁTICOS FITUR 2026
========================================================================
Genera 217 oficios y propuestas personalizadas para cada delegado institucional,
cónsul y director de patronato de la base de datos B2G de FITUR 2026.
Salida:
  src/data/b2g/diplomatic_dispatches_fitur26.json
"""
import json
import os
from pathlib import Path
from datetime import datetime, timezone

BASE_DIR = Path(__file__).resolve().parent.parent
LEADS_FILE = BASE_DIR / "src" / "data" / "b2g" / "fitur_institutional_leads.json"
OUTPUT_FILE = BASE_DIR / "src" / "data" / "b2g" / "diplomatic_dispatches_fitur26.json"

DOSSIER_URL = "https://www.productoraear.com/dossiers/dossier-embajadores-culturales-fitur-2026.pdf"
CENTRALITA = "+34 693 693 048"

def build_dispatch_letter(lead: dict) -> dict:
    entity = lead.get("entity_name", "Delegación Institucional")
    contact = lead.get("contact_person", "Excmo./a. Sr./Sra. Delegado/a Cultural")
    stand = lead.get("ifema_stand", "Pabellón Oficial IFEMA")
    country = lead.get("country_region", "Internacional")

    subject = f"EXPEDIENTE B2G // Propuesta Oficial Embajadores Culturales FITUR 2026 — {entity}"

    body = f"""A la atención de: {contact}
Órgano / Entidad: {entity} ({country}) — Stand IFEMA: {stand}
De: Dirección General de Gobernanza Cultural // Productora EAR
Asunto: Programa Soberano de Embajadores Culturales y Gala Institucional FITUR 2026
Marco Contractual: Contrato Menor de Servicios Artísticos (Art. 118 Ley 9/2017 LCSP)

Estimado/a {contact}:

Con motivo de la presencia de {entity} en la próxima edición de FITUR en IFEMA Madrid, nos dirigimos a usted desde Productora EAR para presentarle una propuesta operativa de alto impacto diseñada a la medida de su legación:

1. EDWIN AGUDELO COMO SU E-MANAGER INSTITUCIONAL:
Ponemos a su entera disposición a Edwin Agudelo (+34 años de oficio escénico y aval diplomático acreditado) como su E-Manager y director artístico, coordinando la puesta en escena, protocolo y etiqueta de Estado durante sus actos en FITUR.

2. INVERSIÓN TÉCNICA EN SU STAND Y TARIFA BLINDADA (PROMEDIO 2 ÚLTIMOS AÑOS):
El coste presupuestado se destina íntegramente a la dotación técnica que su stand requiere (sonido Bose F1 Model 812 a 12 W/pax < 75 dB SPL, iluminación escénica, microfonía Shure Axient y técnicos audiovisuales para montajes similares a sus ejercicios anteriores). Respetamos estrictamente en promedio el precio de sus últimos 2 años, sin sobrecostes.

3. PROGRAMA DE FORMACIÓN A 2 ARTISTAS DE SU COMUNIDAD (TOTALMENTE BONIFICADO):
Elegimos a 2 artistas o agrupaciones emergentes de su colectividad en España para brindarles formación profesional durante 2 meses mediante 8 mentorías de alto impacto (valoradas en más de 1.000,00 €) impartidas por Edwin Agudelo. Diseñamos su encaje como Embajadores Culturales para que ofrezcan una muestra artística de gala que represente con máxima dignidad los valores e identidad de su país o región.

4. LA VENTAJA SOBERANA:
Su delegación resuelve la inversión técnica obligatoria de su stand en FITUR bajo el marco legal de Contrato Menor (Art. 118 LCSP < 15.000 € / 14.250,00 € + IVA vía FACe) y, al mismo tiempo, salda la histórica falta de apoyos y presupuesto hacia sus talentos en el exterior arropándolos con equipamiento de primer nivel sin ningún coste adicional para la entidad.

ACREDITACIÓN INSTITUCIONAL PREVIA:
Productora EAR y Edwin Agudelo cuentan con el aval histórico de representación diplomática acreditada (Oficio de Agradecimiento Oficial del Consulado General Central de Colombia en Madrid por la gala inaugural en el Teatro de La Latina ante la Señora Ministra de Relaciones Exteriores).

Puede consultar y descargar el Dossier Técnico Oficial y la Declaración Responsable en el siguiente enlace:
{DOSSIER_URL}

Quedamos a su disposición para coordinar los detalles técnicos y la selección de sus 2 artistas en el teléfono oficial de Productora EAR ({CENTRALITA}) o respondiendo directamente a esta comunicación.

Atentamente,

Edwin Agudelo
E-Manager & Dirección Artística Institucional
Productora EAR — Madrid // Méntrida
"""
    return {
        "lead_id": lead.get("lead_id"),
        "entity_name": entity,
        "contact_person": contact,
        "country_region": country,
        "ifema_stand": stand,
        "sector": lead.get("sector", "Institucional"),
        "target_budget": 14250.0,
        "email_subject": subject,
        "dispatch_body": body,
        "dossier_pdf_url": DOSSIER_URL,
        "navigable_urls": lead.get("navigable_urls", {}),
        "consular_endorsement": "Oficio de Agradecimiento Oficial del Consulado General Central de Colombia en Madrid (Teatro de La Latina)",
        "status": "READY_TO_DISPATCH"
    }

def main():
    if not LEADS_FILE.exists():
        print(f"[ERROR] Archivo de leads no encontrado en: {LEADS_FILE}")
        return 1

    with open(LEADS_FILE, "r", encoding="utf-8") as f:
        leads = json.load(f)

    # Filtrar únicamente los leads B2G institucionales
    b2g_leads = [l for l in leads if l.get("lead_segment") == "EMBAJADORES_CULTURALES_B2G"]
    print(f">> Generando despachos para {len(b2g_leads)} entidades institucionales...")

    dispatches = [build_dispatch_letter(l) for l in b2g_leads]

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(dispatches, f, ensure_ascii=False, indent=2)

    sz_kb = os.path.getsize(OUTPUT_FILE) / 1024
    print(f"[OK] {len(dispatches)} despachos generados en: {OUTPUT_FILE} ({sz_kb:.1f} KB)")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
