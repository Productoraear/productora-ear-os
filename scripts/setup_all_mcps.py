import os
import json

print("🚀 CONFIGURANDO Y ACTIVANDO SERVIDORES MCP PARA ANTIGRAVITY...")

# 1. Rutas de configuración global de Antigravity / Cursor / VSCode
appdata = os.environ.get("APPDATA", "")
config_dir = os.path.join(appdata, "Antigravity", "User", "globalStorage")
os.makedirs(config_dir, exist_ok=True)
config_file = os.path.join(config_dir, "mcp_config.json")

# Token de GitHub (Reemplaza con tu token copiado en el Paso 1 si deseas asociarlo directamente)
GITHUB_TOKEN = "PEGA_AQUI_TU_TOKEN_GHP"

mcp_servers = {
    "mcpServers": {
        "github": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {
                "GITHUB_PERSONAL_ACCESS_TOKEN": GITHUB_TOKEN
            }
        },
        "sequential-thinking": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
        },
        "chrome-devtools": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-chrome-devtools"]
        },
        "supabase": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://postgres:password@db.supabase.co:5432/postgres"]
        },
        "perplexity": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-perplexity"]
        },
        "google-cloud-logging": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-google-cloud-logging"]
        },
        "postman": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-postman"]
        }
    }
}

# Fusionar con configuración previa
if os.path.exists(config_file):
    try:
        with open(config_file, "r", encoding="utf-8") as f:
            existing = json.load(f)
        if "mcpServers" not in existing:
            existing["mcpServers"] = {}
        existing["mcpServers"].update(mcp_servers["mcpServers"])
        final_config = existing
    except Exception:
        final_config = mcp_servers
else:
    final_config = mcp_servers

with open(config_file, "w", encoding="utf-8") as f:
    json.dump(final_config, f, ensure_ascii=False, indent=2)

print(f"✅ Archivo de configuración escrito con éxito en: {config_file}")
