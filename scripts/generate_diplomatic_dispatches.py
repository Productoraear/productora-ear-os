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

Con motivo de la presencia de {entity} en la próxima edición de FITUR en IFEMA Madrid, nos dirigimos a usted desde Productora EAR para presentarle formalmente el "Programa Soberano de Embajadores Culturales y Diplomacia Pública".

Sabemos que su delegación requiere una representación escénica impecable durante los actos institucionales y recepciones de gala, y que simultáneamente existe el compromiso de visibilizar y dignificar a los mejores talentos y artistas de su comunidad en España.

Productora EAR le ofrece un servicio llave en mano homologado bajo el régimen de Contrato Menor (Art. 118 LCSP) por un importe cerrado de 14.250,00 € + IVA (tramitación directa sin concurso público):

1. MENTORÍA ESCÉNICA Y DIRECCIÓN ARTÍSTICA: Supervisión directa a cargo del tenor lírico y productor Edwin Agudelo (+34 años de trayectoria escénica profesional), formando y preparando a los artistas de su colectividad para el protocolo y etiqueta de recepciones de Estado.
2. RIDER ACÚSTICO BOSE F1 HOMOLOGADO: Columnas Bose F1 Model 812 calibradas a 12 W/pax con limitación estricta < 75 dB SPL, garantizando que el cuerpo diplomático pueda conversar con total nitidez.
3. COBERTURA Y FACTURACIÓN ELECTRÓNICA: Póliza de Responsabilidad Civil de 1.000.000 €, altas en Régimen de Artistas y facturación oficial reglamentaria a través de la plataforma FACe con sus códigos DIR3.
4. IMPACTO SOCIAL Y RETORNO SROI (4.85x): Liquidación soberana 80% directa a los artistas y 10% destinado a programas clínicos de musicoterapia VIMUME para mayores de su colectividad.

ACREDITACIÓN INSTITUCIONAL PREVIA:
Productora EAR y Edwin Agudelo cuentan con el aval histórico de representación diplomática acreditada (Oficio de Agradecimiento Oficial del Consulado General Central de Colombia en Madrid por la gala inaugural en el Teatro de La Latina ante la Señora Ministra de Relaciones Exteriores).

Puede consultar y descargar el Dossier Técnico Oficial y la Declaración Responsable en el siguiente enlace:
{DOSSIER_URL}

Quedamos a su disposición para coordinar una reunión técnica previa en el teléfono oficial de Productora EAR ({CENTRALITA}) o respondiendo directamente a esta comunicación.

Atentamente,

Edwin Agudelo
Dirección Artística y Producción Institucional
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
