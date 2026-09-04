import json
import os
from datetime import datetime

# Script preliminar del Cazador B2G para escaneo de contratos menores (< 14.250 €)
def main():
    print(">> [B2G HUNTER] Inicializando sonda de contratos públicos en PLACE / TED...")
    
    # Mock de sondeo inteligente para demostración de arquitectura autónoma
    tenders_found = [
        {
            "id": "PLACE-2026-MUNICIPAL-081",
            "entidad": "Ayuntamiento de Navalcarnero",
            "objeto": "Suministro de Espectáculo Musical de Fiestas Patronales",
            "presupuesto_licitacion": 12500.00,
            "tipo_contrato": "Menor de Servicios (Art. 118 LCSP)",
            "fecha_limite": "2026-09-15",
            "viabilidad_doble_impacto": True,
            "estado": "DETECTADO"
        },
        {
            "id": "PLACE-2026-MUNICIPAL-082",
            "entidad": "Ayuntamiento de Méntrida",
            "objeto": "Programación Cultural y Actuación Lírica Fiestas Mayores",
            "presupuesto_licitacion": 9800.00,
            "tipo_contrato": "Menor de Servicios (Art. 118 LCSP)",
            "fecha_limite": "2026-09-20",
            "viabilidad_doble_impacto": True,
            "estado": "DETECTADO"
        }
    ]

    output_dir = "src/data/b2g"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)
        
    output_path = os.path.join(output_dir, "b2g_active_tenders.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(tenders_found, f, indent=2, ensure_ascii=False)

    print(f">> [SUCCESS] Sonda completada. {len(tenders_found)} licitaciones óptimas (< 14.250 €) capturadas en {output_path}.")

if __name__ == "__main__":
    main()
