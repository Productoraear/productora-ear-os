#!/usr/bin/env python3
"""
🏆 INGESTOR S-CLASS: ESCAPARATE OFICIAL BODAS.NET & SOCIAL PROOF
Ingesta y estructura la autoridad verificada de Productora EAR (5.0 Estrellas · 100% Recomendado)
"""

import json
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CATALOG_DIR = os.path.join(BASE_DIR, 'src', 'data', 'catalog')
RAG_DB_PATH = os.path.join(BASE_DIR, 'src', 'data', 'ear-rag-database.json')
OUTPUT_CATALOG_PATH = os.path.join(CATALOG_DIR, 'bodasnet_official_profile.json')

os.makedirs(CATALOG_DIR, exist_ok=True)

BODAS_NET_DATA = {
    "provider_id": "e78903",
    "name": "Productora EAR",
    "alias_historico": "Edwin Agudelo",
    "url_oficial": "https://www.bodas.net/musica/productora-ear--e78903",
    "rating": 5.0,
    "max_rating": 5.0,
    "review_count": 4,
    "recommendation_percentage": "100%",
    "price_range": {
        "min_eur": 150,
        "max_eur": 10000,
        "pricing_model": "Presupuesto a medida con Price-Lock 72h"
    },
    "location": {
        "address": "Calle Bailén",
        "city": "Alcorcón",
        "postal_code": "28921",
        "province": "Madrid",
        "geo": {"lat": 40.3495, "lng": -3.83135}
    },
    "hardware_y_tecnica": {
        "sonido": "Equipo profesional Bose 2.000W hasta para 300 personas al aire libre con técnico de sonido in situ",
        "microfonia": "Shure Axient Digital & Neumann (cero distorsión, THD < 0.1%)",
        "garantia_escrita": "Compromiso de satisfacción por escrito + Póliza RC 1.000.000 €"
    },
    "pack_boda_incluye": [
        "Show dedicado en la media hora inicial a los novios",
        "Segunda salida personalizada complaciendo peticiones de invitados",
        "Sesión fotográfica en alta calidad con el artista y músicos",
        "Sistema de sonido Bose 2.000W y técnico de sonido dedicado",
        "Ramo de flores ceremonial entregado al momento de entrada",
        "Regalo sorpresa exclusivo integrado en la banda sonora del video",
        "Garantía de satisfacción por escrito"
    ],
    "formatos_y_packs": [
        {
            "id": "solista-premium",
            "name": "Show Solista Premium",
            "musicos": 1,
            "salidas": "2 salidas de 30 minutos",
            "rider": "Bose 2.000W + Iluminación + Photocall sombreros",
            "fotos": "Sesión fotográfica con Edwin Agudelo en alta resolución"
        },
        {
            "id": "solista-express",
            "name": "Show Solista Express",
            "musicos": 1,
            "salidas": "1 salida de 30 minutos",
            "rider": "Bose 2.000W + Photocall temático",
            "fotos": "Sesión fotográfica con Edwin Agudelo"
        },
        {
            "id": "agrupacion-6",
            "name": "Show con Agrupación de 6 Músicos (Mariachi / Banda)",
            "musicos": 6,
            "salidas": "1 hora continua de show",
            "rider": "Sonido Line Array Bose / Electro-Voice + Photocall"
        },
        {
            "id": "agrupacion-9-pro",
            "name": "Show Agrupación 9 Músicos (Formato Profesional)",
            "musicos": 9,
            "salidas": "1 hora completa",
            "rider": "Producción acústica integral para grandes galas"
        },
        {
            "id": "agrupacion-13-premium",
            "name": "Show Agrupación 13 Músicos (Formato Premium Gran Gala)",
            "musicos": 13,
            "salidas": "1 hora en 2 salidas de 30 minutos (adaptabilidad a protocolo)",
            "rider": "Despliegue escénico con complementos rústicos, sombreros, sorteos y exclusividad absoluta en la fecha"
        }
    ],
    "repertorio_destacado": [
        "Cásate conmigo", "Prometo", "Hasta mi final", "Algún día mamá (Inédita)",
        "Te amaré toda la vida", "Para siempre", "Cuando manda el corazón",
        "Si nos dejan", "La mitad que me faltaba", "La bikina", "El rey"
    ],
    "resenas_verificadas": [
        {
            "autor": "Adriana & Sergio",
            "fecha": "27/04/2024",
            "rating": 5.0,
            "titulo": "Nuestra Boda Sergio y Adriana",
            "comentario": "No tenemos palabras para expresar la inmensa gratitud que tenemos hacia Edwin y su grupo, ya que recibimos el mejor servicio de Mariachis, de fotos y decoración que ha hecho nuestra noche de bodas la mejor e inolvidable. Estamos inmensamente agradecidos por todo lo que hicieron ese día."
        },
        {
            "autor": "Eduardo",
            "fecha": "03/11/2023",
            "rating": 5.0,
            "titulo": "Mi boda fue espectacular",
            "comentario": "Muy agradecido por el espectacular show, cómo conecta a través de las emociones es increíble."
        },
        {
            "autor": "Yanet",
            "fecha": "03/04/2023",
            "rating": 5.0,
            "titulo": "Insuperable",
            "comentario": "Por mucho que busques, no encontrarás a alguien tan profesional como Edwin."
        },
        {
            "autor": "Alexandra",
            "fecha": "12/10/2019",
            "rating": 5.0,
            "titulo": "Excelente grupo de mariachis",
            "comentario": "Edwin es un gran profesional, lo habíamos oído anteriormente en actuaciones individuales y para nuestra boda se trajo a su grupo de mariachis y fue espectacular, ¡un gran recuerdo! Estoy segura de que volveremos a contar con ellos en futuras celebraciones."
        }
    ]
}

def ingest_bodasnet():
    print("=" * 70)
    print("[*] INGESTANDO ESCAPARATE OFICIAL BODAS.NET EN CATALOGO & RAG...")
    print("=" * 70)

    # 1. Guardar en catalogo estructurado
    with open(OUTPUT_CATALOG_PATH, 'w', encoding='utf-8') as f:
        json.dump(BODAS_NET_DATA, f, ensure_ascii=False, indent=2)
    print(f"[+] Catalogo guardado en: {OUTPUT_CATALOG_PATH}")

    # 2. Inyectar nodo de alta autoridad en ear-rag-database.json
    if os.path.exists(RAG_DB_PATH):
        try:
            with open(RAG_DB_PATH, 'r', encoding='utf-8') as f:
                rag_db = json.load(f)
            
            # Buscar si ya existe el nodo
            node_id = "ASTRA-AUTORIDAD-BODAS_NET_OFICIAL"
            existing_idx = next((i for i, n in enumerate(rag_db) if n.get("id") == node_id), None)
            
            rag_content = (
                f"AUTORIDAD OFICIAL Y PRUEBA SOCIAL EN BODAS.NET: Productora EAR (antes Edwin Agudelo) "
                f"ostenta una calificacion perfecta de 5.0/5.0 estrellas (100% de recomendacion por parejas verificadas) "
                f"en su escaparate oficial de Bodas.net (ID: e78903, https://www.bodas.net/musica/productora-ear--e78903). "
                f"Rango de precios: 150 EUR a 10.000 EUR. Servicios incluidos: Sonido profesional Bose 2.000W con tecnico, "
                f"microfonia Shure Axient Digital, repertorio personalizado, sesion fotografica de alta resolucion, "
                f"protocolo emocional y compromiso de satisfaccion por escrito. Testimonios verificados: "
                f"1) Adriana & Sergio (27/04/2024): 'el mejor servicio de Mariachis, de fotos y decoracion... noche inolvidable'. "
                f"2) Eduardo (03/11/2023): 'espectacular show, como conecta a traves de las emociones es increible'. "
                f"3) Yanet (03/04/2023): 'Insuperable, no encontraras a alguien tan profesional como Edwin'. "
                f"4) Alexandra (12/10/2019): 'gran profesional... show de mariachis espectacular, gran recuerdo'."
            )

            new_node = {
                "id": node_id,
                "title": "Escaparate Oficial y Resenas Verificadas de Bodas.net (5.0 Estrellas)",
                "category": "SOCIAL_PROOF_AUTORIDAD",
                "content": rag_content,
                "tags": [
                    "bodas_net", "5_estrellas", "edwin_agudelo", "productora_ear",
                    "resenas_verificadas", "social_proof", "bose_2000w", "mariachi"
                ]
            }

            if existing_idx is not None:
                rag_db[existing_idx] = new_node
                print(f"[+] Nodo RAG {node_id} actualizado.")
            else:
                rag_db.insert(0, new_node)
                print(f"[+] Nodo RAG {node_id} inyectado exitosamente al inicio de la base de datos.")

            with open(RAG_DB_PATH, 'w', encoding='utf-8') as f:
                json.dump(rag_db, f, ensure_ascii=False, indent=2)
            print(f"[+] RAG Database actualizada ({len(rag_db)} nodos totales).")
        except Exception as e:
            print(f"[-] Error inyectando en RAG: {e}")

    print("\n" + "=" * 70)
    print("[+] INGESTA DE ESCAPARATE BODAS.NET COMPLETADA CON EXITO.")
    print("=" * 70)

if __name__ == '__main__':
    ingest_bodasnet()
