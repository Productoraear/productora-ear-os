import json
import os
import glob
import re

RAG_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\ear-rag-database.json"

vampirized_market_nodes = [
    {
        "id": "VAMPIRE-BODASNET-KILLER-01",
        "title": "Análisis Forense de Fricción en Directorios Pasivos (Bodas.net / Zankyou)",
        "category": "INTELIGENCIA_COMPETITIVA",
        "content": "Bodas.net y portales tradicionales operan bajo un modelo de 'Edad de Piedra': directorios pasivos que trasladan 240 minutos de fatiga cognitiva a los novios. EAR OS ejecuta un modelo de Matchmaking Activo S-Class reduciendo la fricción a 3 minutos mediante el Túnel Neural Termodinámico. Desmantelamiento de sobrecostes: los portales tradicionales ocultan un 35% en costes de kilometraje, técnicos de refuerzo y derechos SGAE que cobran como extras imprevistos. EAR OS garantiza precio cerrado por contrato mercantil auditado.",
        "tags": ["bodas_net_killer", "vampire_market_intel", "fatiga_cognitiva", "matchmaking_activo", "costes_ocultos"]
    },
    {
        "id": "VAMPIRE-PRECIOS-BODAS-ESPANA",
        "title": "Estructura Financiera y Rangos de Precio Nupcial en España 2026",
        "category": "INTELIGENCIA_COMPETITIVA",
        "content": "Rangos de precios reales analizados en 1.200 bodas: Show Solista Premium Edwin Agudelo (350€ con sonido Bose F1), Ensamble Mariachi Gala 6+ (750€ a 1.200€), DJs con audio S-Class (450€ - 850€), Coordinación Wedding Planner Integral (1.500€ - 3.500€). Inversión Base Producción 360 de Autor: 3.000€. Todos los servicios integran Protocolo Plan B con microfonía Shure Axient y seguro de Responsabilidad Civil de 1.000.000€.",
        "tags": ["rangos_precios_bodas", "vampire_market_intel", "mariachis_precios", "dj_bodas_precios", "plan_b"]
    },
    {
        "id": "VAMPIRE-TUNEL-TERMODINAMICO-ALGORITMO",
        "title": "Algoritmo de Bifurcación Termodinámica de Leads (Cold vs Hot Route)",
        "category": "ARQUITECTURA_NEURAL",
        "content": "El Túnel Neural Termodinámico clasifica la temperatura del lead en tiempo real a partir del lenguaje natural: 1) Ruta Fría (Lead Indeciso): 10 pantallas inmersivas de storyselling, revelación de costes ocultos, presión acústica de 12 W/pax y descarga del Master Dossier en PDF. 2) Ruta Caliente (Lead Transaccional): Fast-Track de 2 pantallas con detección de flota, congelación de slots por 72h y onboarding directo a WhatsApp con Edwin Agudelo (+34 693 693 048).",
        "tags": ["tunel_termodinamico", "clasificacion_temperatura", "fast_track", "storyselling", "bifurcacion_leads"]
    },
    {
        "id": "VAMPIRE-ACOUSTIC-12W-PAX-STANDARDS",
        "title": "Estándar de Presión Acústica 12 W/pax y Monitoreo Ergonómico",
        "category": "INGENIERIA_ACUSTICA",
        "content": "El 92% de las quejas en salones de boda se deben al exceso de volumen estridente o a la falta de inteligibilidad en ceremonias. El estándar EAR OS prescribe exactamente 12 Watts RMS por invitado en espacios exteriores o salones amplios, utilizando sistemas Line Array Bose F1 y L-Acoustics con monitoreo in-ear para que el banquete sea conversacional para mayores y la barra libre sea demoledora para los jóvenes.",
        "tags": ["12w_pax", "ingenieria_acustica", "ergonomia_auditiva", "bose_f1", "shure_axient"]
    }
]

def main():
    if not os.path.exists(RAG_PATH):
        print(f"Error: {RAG_PATH} not found")
        return

    with open(RAG_PATH, "r", encoding="utf-8") as f:
        database = json.load(f)

    existing_ids = {node.get("id") for node in database}
    added = 0
    for node in vampirized_market_nodes:
        if node["id"] not in existing_ids:
            database.append(node)
            existing_ids.add(node["id"])
            added += 1
        else:
            for i, n in enumerate(database):
                if n.get("id") == node["id"]:
                    database[i] = node
                    added += 1
                    break

    with open(RAG_PATH, "w", encoding="utf-8") as f:
        json.dump(database, f, ensure_ascii=False, indent=2)

    print(f"Vampirization RAG Complete: Total Nodes = {len(database)} (Processed {added} competitive nodes)")

if __name__ == "__main__":
    main()
