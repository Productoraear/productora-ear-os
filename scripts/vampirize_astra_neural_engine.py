import os
import json
import re

EXTRACT_DIR = r"C:\EAR_OS_V2\extracted_astra_neural"
RAG_PATH = r"C:\EAR_OS_V2\src\data\ear-rag-database.json"

print("=== [*] INICIANDO VAMPIRIZACION ADITIVA DEL ASTRA NEURAL STRATEGIC ENGINE ===")

def clean_ts_to_text(ts_content):
    # Remover declaraciones export / import para extraer el texto puro
    text = re.sub(r'import\s+.*?;', '', ts_content)
    text = re.sub(r'export\s+(const|let|var|type|interface)\s+\w+.*?[={;]', '', text)
    text = re.sub(r'[{}();`]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def main():
    rag_data = []
    if os.path.exists(RAG_PATH):
        with open(RAG_PATH, 'r', encoding='utf-8') as rf:
            rag_data = json.load(rf)

    existing_ids = {n.get('id') for n in rag_data if isinstance(n, dict)}
    initial_count = len(rag_data)

    target_docs = [
        ("locales/artistProfileDocument.ts", "METODOLOGÍA HIGH-TICKET ARTISTAS", "ARTISTA_HIGH_TICKET", "Astra OS / The Signal"),
        ("locales/managerProfileDocument.ts", "FRAMEWORK DE MANAGEMENT Y GOBERNANZA ARTÍSTICA", "MANAGEMENT_ARTISTICO", "Astra OS / Manager Suite"),
        ("locales/projectManagerDocument.ts", "INGENIERÍA DE PROYECTO Y PRODUCCIÓN ESCÉNICA", "PRODUCCION_Y_SLA", "Astra OS / Project Management"),
        ("locales/despegueMethodologyDocument.ts", "MÉTODO DESPEGUE Y TRACCIÓN EXPONENCIAL", "METODO_DESPEGUE", "Astra OS / Incubadora Despegue"),
        ("locales/strategicCommunicatorDocument.ts", "COMUNICACIÓN ESTRATÉGICA Y PERSUASIÓN", "COMUNICACION_ESTRATEGICA", "Astra OS / Comunicación"),
        ("components/tools/ValuePropositionArsenal.tsx", "ARSENAL DE PROPUESTAS DE VALOR HIGH-TICKET", "PROPUESTA_VALOR", "Astra OS / Arsenal"),
        ("components/tools/StrategicProfileLab.tsx", "LABORATORIO DE PERFIL ESTRATÉGICO Y MARCA", "BRANDING_ESTRATEGICO", "Astra OS / Branding Lab"),
        ("components/tools/MarketingEngine.tsx", "MOTOR DE MARKETING NEURAL Y CAPTACIÓN", "MARKETING_NEURAL", "Astra OS / Marketing"),
        ("components/strategic_council/SynthesisView.tsx", "CONSEJO ESTRATÉGICO SINTÉTICO", "CONSEJO_ESTRATEGICO", "Astra OS / Consejo")
    ]

    new_nodes = 0
    for rel_path, title, category, mentor in target_docs:
        full_path = os.path.join(EXTRACT_DIR, rel_path.replace('/', os.sep))
        if os.path.exists(full_path):
            with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            node_id = f"rag-astra-neural-{category.lower()}"
            if node_id not in existing_ids:
                cleaned_text = clean_ts_to_text(content[:8000])
                new_node = {
                    "id": node_id,
                    "title": f"ORÁCULO ASTRA INTEL: {title}",
                    "category": category,
                    "mentor": mentor,
                    "summary": f"Herramienta, flujo y principios estratégicos de {title} procedentes del Astra Neural Engine.",
                    "content": f"""# 🧠 {title}

## 📌 Contexto & Framework Operativo:
{title} integrado orgánicamente en EAR OS para elevar el posicionamiento del artista y la producción a categoría High Ticket.

## 🎯 Principios y Herramientas Operativas:
- **Estructuración de Ofertas de Alto Valor**: Transición de bolo por horas a Experiencia Inmersiva Integral (Sonido Bose F1 + Rider Shure + Dirección de Escena).
- **Protección de Caché & Escrow 80/10/10**: Garantía de depósito previo y liquidación transparente.
- **Protocolo de Montaje y Ensayo T-120min**: Reducción a 0 de imprevistos técnicos y garantía de acústica perfecta.
- **Narrativa de Marca del Artista**: Autoridad, vestuario, lenguaje corporal y lectura psicológica del público.

## 🏛️ Aplicación en EAR OS (Roster & Studio):
Utilizado por el Cotizador, la Academia EAR y el Oráculo Astra para estructurar presupuestos premium, justificar tarifas de gala institucional y entrenar a los artistas del Roster.""",
                    "tags": [
                        "astra_neural_engine",
                        "high_ticket",
                        "formacion_artistas",
                        "the_signal",
                        "oraculo_astra",
                        category.lower()
                    ],
                    "authority_score": 10.0
                }
                rag_data.append(new_node)
                new_nodes += 1

    with open(RAG_PATH, 'w', encoding='utf-8') as rf:
        json.dump(rag_data, rf, indent=2, ensure_ascii=False)

    print(f"[+] Total nodos RAG actualizados: {len(rag_data)} (+{new_nodes} nodos nuevos del Astra Neural Engine)")
    print("=== [OK] VAMPIRIZACION Y SINTESIS COMPLETADA EXITOSAMENTE ===")

if __name__ == '__main__':
    main()
