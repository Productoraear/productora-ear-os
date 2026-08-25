from scrapegraphai.graphs import SmartScraperGraph

def run_fincas_scraper():
    graph_config = {
        "llm": {
            "model": "ollama/qwen2.5-coder:32b",
            "base_url": "http://localhost:11434",
        },
        "verbose": True,
    }

    smart_scraper = SmartScraperGraph(
        prompt="Extrae el nombre de la finca, correo de contacto, teléfono y si admiten música en exterior.",
        source="https://www.fincasparabodas.com/madrid",
        config=graph_config
    )

    result = smart_scraper.run()
    print("================== RESULTADOS SCRAPEGRAPHAI ==================")
    print(result)

if __name__ == "__main__":
    run_fincas_scraper()
