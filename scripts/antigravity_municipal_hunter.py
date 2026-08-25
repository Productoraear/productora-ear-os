import os
import sys
import json
import re
import datetime

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = r"H:\EAR_OS_V2\EAR_OS_V2\docs\propuestas_municipales"
TAXONOMY_FILE = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\ear-30-level-taxonomy.json"

MUNICIPALITIES_TARGET = [
    {"name": "Alcorcón", "provincia": "Madrid", "poblacion": 170000, "tipo": "Urbano / Gran Población", "partida": "Servicios Sociales / Envejecimiento Activo", "necesidad": "Soledad no deseada / Alzheimer", "formato_propuesto": "VIMUME_CLINICA", "precio": 450},
    {"name": "Soria Capital", "provincia": "Soria", "poblacion": 40000, "tipo": "España Vaciada", "partida": "Cultura y Bienestar Social", "necesidad": "Estimulación Intergeneracional", "formato_propuesto": "VIMUME_EXPANDIDO", "precio": 750},
    {"name": "Sigüenza", "provincia": "Guadalajara", "poblacion": 4300, "tipo": "Rural / Histórico", "partida": "Fiestas Patronales y Mayores", "necesidad": "Gala Patronal y Taller Residencia", "formato_propuesto": "MARIACHI_GALA_6", "precio": 750},
    {"name": "Teruel Capital", "provincia": "Teruel", "poblacion": 36000, "tipo": "España Vaciada", "partida": "Convenio IMSERSO / NextGen", "necesidad": "Neuroacústica 40Hz en Centros de Día", "formato_propuesto": "VIMUME_CIRCUITO_5", "precio": 1800},
    {"name": "Cuenca", "provincia": "Cuenca", "poblacion": 54000, "tipo": "Patrimonio / España Vaciada", "partida": "Servicios a la Comunidad", "necesidad": "Terapia Musical no Farmacológica", "formato_propuesto": "VIMUME_CLINICA", "precio": 450}
]

def generate_lcsp_proposal(muni):
    today = datetime.datetime.now().strftime("%d/%m/%Y")
    precio_base = muni['precio']
    iva = precio_base * 0.21
    total = precio_base + iva
    
    doc = f"""# 🏛️ MEMORIA TÉCNICA Y ECONÓMICA DE CONTRATACIÓN PÚBLICA (LCSP)
**DESTINATARIO:** Ilustrísimo Ayuntamiento de {muni['name']} ({muni['provincia']})  
**ÓRGANO DE CONTRATACIÓN:** Concejalía de {muni['partida']}  
**RÉGIMEN CONTRACTUAL:** Contrato Menor de Servicios (Art. 118 Ley 9/2017 LCSP)  
**EXPEDIENTE:** EAR-B2G-{muni['name'].upper().replace(' ', '_')}-2026  
**FECHA DE EMISIÓN:** {today}  

---

## 1. JUSTIFICACIÓN DE LA NECESIDAD Y OBJETO DEL SERVICIO
El presente proyecto tiene por objeto la prestación del servicio de **"Entretenimiento Terapéutico y Estimulación Neuroacústica — Programa VIMUME (Viaje Musical por la Memoria)"**, diseñado específicamente para el colectivo de personas mayores y vecinos del municipio de **{muni['name']}**.

A diferencia del mero espectáculo lúdico, este programa aborda de forma directa la **lucha contra la soledad no deseada** y la **prevención del deterioro cognitivo (Alzheimer y demencias seniles)** mediante estimulación neuroacústica tradicional adaptada (<75 dB).

## 2. ACREDITACIÓN TÉCNICA Y SOLVENCIA S-CLASS
- **Dirección Artística y Ejecutiva:** Edwin Agudelo (Cantautor de Gala y Especialista en Reminiscencia Musical).
- **Seguro de Responsabilidad Civil:** Póliza en vigor de **600.000,00 €** de cobertura por siniestro.
- **Régimen Laboral:** Alta legal en el Régimen Especial de Artistas de la Seguridad Social de todo el elenco.
- **Equipamiento Homologado:** Sistemas auto-amplificados Bose Professional / Shure calibrados para evitar fatiga auditiva.
- **Facturación Electrónica:** Presentación a través del portal **FACe** con códigos DIR3 municipales correspondientes.

## 3. IMPACTO SOCIAL Y ALINEACIÓN CON FONDOS EUROPEOS
Este servicio se encuentra alineado con los objetivos del **Plan de Recuperación, Transformación y Resiliencia (NextGenerationEU)** y las líneas de subvención del **0,7% IRPF para fines sociales**. El 10% del importe de la adjudicación se reinvierte en investigación de métricas clínicas con universidades colaboradoras.

## 4. PROPUESTA ECONÓMICA DESGLOSADA (CONTRATO MENOR)

| Concepto | Importe Base | IVA (21%) | Total Factura |
| :--- | :--- | :--- | :--- |
| **Programa {muni['formato_propuesto']} en {muni['name']}** | {precio_base:.2f} € | {iva:.2f} € | **{total:.2f} €** |

*Validez de la oferta: 60 días naturales.*

---

**Por Productora EAR & Proyecto VIMUME**  
*Edwin Agudelo — Director General*  
*Contacto Directo Centralita: +34 693 693 048 • hola@productoraear.com*  
"""
    return doc

def run_municipal_hunter():
    print("🚀 Ejecutando AntiGravity Municipal Hunter (+8.000 Pueblos de España)...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    ascii_map = {'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u', 'ñ': 'n', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ü': 'U', 'Ñ': 'N'}
    
    generated = []
    for muni in MUNICIPALITIES_TARGET:
        name_clean = muni['name'].lower()
        prov_clean = muni['provincia'].lower()
        for k, v in ascii_map.items():
            name_clean = name_clean.replace(k, v)
            prov_clean = prov_clean.replace(k, v)
            
        name_clean = re.sub(r'[^a-z0-9_]', '_', name_clean.replace(' ', '_'))
        prov_clean = re.sub(r'[^a-z0-9_]', '_', prov_clean.replace(' ', '_'))
        
        filename_official = f"PROPUESTA_LCSP_{prov_clean.upper()}_{name_clean.upper()}.md"
        filename_alias = f"expediente_{name_clean}.md"
        
        content = generate_lcsp_proposal(muni)
        
        path_official = os.path.join(OUTPUT_DIR, filename_official)
        path_alias = os.path.join(OUTPUT_DIR, filename_alias)
        
        with open(path_official, 'w', encoding='utf-8') as f:
            f.write(content)
        with open(path_alias, 'w', encoding='utf-8') as f:
            f.write(content)
            
        generated.append(path_official)
        print(f"✅ Propuesta generada: {filename_official} y {filename_alias}")
        
    print(f"\nTotal de expedientes LCSP B2G preparados: {len(generated)} en {OUTPUT_DIR}")

if __name__ == '__main__':
    run_municipal_hunter()
