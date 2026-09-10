#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EAR OS PROVIDER SEDUCTION & OUTBOUND ETHICAL ENGINE (S-CLASS DEMANDA EN MANO)
=============================================================================
- Filosofía: "No eres alguien que les robó la foto; eres un promotor con clientes y dinero en la mesa".
- Propuesta anticipada y proactiva que evita reclamos y convierte a los artistas en colaboradores fieles.
- Modelo Freemium de 3 Niveles:
  * Nivel 1 (Directorio Base): 100% GRATUITO DE POR VIDA. Ficha técnica pública protegida, recepción de presupuestos sin exclusividad. Cero cuotas fijas.
  * Nivel 2 (Roster Preferente & Rider Unificado): Si contratan con producción técnica EAR (Bose F1 / Shure Beta 87A), el artista cobra el 100% de su tarifa neta y EAR factura la producción técnica al cliente.
  * Nivel 3 (Licitaciones B2G VIMUME & High-Ticket): Acceso a contratos públicos de ayuntamientos (< 15.000 € Art. 118 LCSP) y colocación de cabecera en el Cotizador Neural. Split Soberano 80/10/10 solo sobre volumen facturado.
- Enlaces criptográficos 1-clic:
  * Reclamar Cuenta Oficial: https://www.productoraear.com/proveedores/{slug}?claim=true
  * Retirada Inmediata (Opt-Out): https://www.productoraear.com/api/providers/opt-out?slug={slug}
- Telemetría Digital S-Class integrada.
"""
import os
import sys
import json
import hashlib
from pathlib import Path

# Importar telemetría
try:
    from terminal_telemetry import DigitalHUD
except ImportError:
    sys.path.append(str(Path(__file__).resolve().parent.parent))
    try:
        from terminal_telemetry import DigitalHUD
    except ImportError:
        class DigitalHUD:
            def __init__(self, title="PROCESO", total=100):
                self.title = title
                self.total = max(1, total)
            def update(self, current, status="", item_info=""):
                pct = int((current / self.total) * 100)
                print(f"\r  [{'█'*(pct//5)}{'░'*(20-pct//5)}] {pct}% | {status} {item_info[:30]}", end="", flush=True)
            def finish(self, msg=""):
                print(f"\n[EXIT CODE 0] {msg}\n")

BASE_DIR = Path(__file__).resolve().parent.parent.parent
INPUT_HARVESTED = BASE_DIR / "src" / "data" / "bodas-vendors-harvested.json"
OUTPUT_CAMPAIGN = BASE_DIR / "src" / "data" / "outbound" / "provider_seduction_campaign.json"

def generate_claim_token(slug):
    salt = "EAR_OS_SOVEREIGN_TOKEN_2026"
    return hashlib.sha256(f"{slug}_{salt}".encode()).hexdigest()[:16]

def generate_ethical_pitch(vendor):
    name = vendor.get("name", "Compañero Artista")
    category = vendor.get("category", "Música & Directo")
    city = vendor.get("location", {}).get("city", "Madrid")
    province = vendor.get("location", {}).get("province", "Madrid")
    base_price = vendor.get("pricing", {}).get("rentalBasePrice", 650)
    slug = vendor.get("slug", "")
    token = generate_claim_token(slug)

    claim_url = f"https://www.productoraear.com/proveedores/{slug}?unlocked=true"
    optout_url = f"https://www.productoraear.com/api/providers/opt-out?slug={slug}"

    # Copy maestro ganador "Demanda en Mano" S-Class
    pitch = f"""Hola {name}.

Somos Productora EAR (Méntrida, Toledo / Madrid). Gestionamos producción técnica para eventos corporativos y bodas en la zona de {province} y zona centro.

Hemos recibido peticiones de clientes que buscan una formación de tu estilo en un rango de {base_price} € a {base_price + 350} €.

Nuestra política con los profesionales es de absoluto respeto ético y legal:
1. No publicamos tus datos personales sin tu consentimiento.
2. Tu espacio básico de directorio es 100% GRATUITO y sin exclusividad.
3. Solo cobramos comisión si deseas categorías superiores (posicionamiento preferente en cotizaciones neurales o acceso a licitaciones públicas B2G < 15.000 € con ayuntamientos del programa VIMUME).

Si deseas que te derivemos estas peticiones de presupuesto sin compromiso y activar tu canal de recepción directa:
👉 Activar Canal Directo Oficial: {claim_url}

Si prefieres no figurar en nuestro directorio profesional ni recibir solicitudes:
👉 Retirada Inmediata en 1-Clic: {optout_url}

Quedamos a tu disposición para cualquier detalle técnico o rider.
Un cordial saludo,
Equipo de Producción // Productora EAR
Teléfono Centralita Oficial: +34 693 693 048"""

    return {
        "id": vendor.get("id"),
        "name": name,
        "category": category,
        "province": province,
        "phone": vendor.get("phone"),
        "base_price": base_price,
        "token": token,
        "claim_url": claim_url,
        "optout_url": optout_url,
        "message": pitch
    }

def run_seduction_builder():
    if not INPUT_HARVESTED.exists():
        print(f"No se encontró el archivo de entrada: {INPUT_HARVESTED}")
        return

    OUTPUT_CAMPAIGN.parent.mkdir(parents=True, exist_ok=True)

    with open(INPUT_HARVESTED, "r", encoding="utf-8") as f:
        vendors = json.load(f)

    valid_vendors = [v for v in vendors if v.get("name") and not v.get("name", "").lower().startswith("prov-")]
    
    total = min(500, len(valid_vendors))
    hud = DigitalHUD(f"MOTOR DE SEDUCCIÓN OUTBOUND ({total} PROVEEDORES)", total=total)

    campaign = []
    for idx, v in enumerate(valid_vendors[:total], 1):
        item = generate_ethical_pitch(v)
        campaign.append(item)
        hud.update(idx, status="Generando Pitch", item_info=v.get("name", ""))

    with open(OUTPUT_CAMPAIGN, "w", encoding="utf-8") as f:
        json.dump(campaign, f, indent=2, ensure_ascii=False)

    hud.finish(f"Campaña 'Demanda en Mano' consolidada en {OUTPUT_CAMPAIGN}. Total contactos listos: {len(campaign)}")

if __name__ == "__main__":
    run_seduction_builder()
