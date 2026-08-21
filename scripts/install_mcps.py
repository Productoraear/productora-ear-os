import os
import json

print("🚀 INICIANDO INYECCIÓN AUTOMÁTICA DE SERVIDORES MCP S-CLASS...")

# Rutas estándar de configuración MCP en Windows
appdata = os.environ.get("APPDATA", "")
config_dir = os.path.join(appdata, "Antigravity", "User", "globalStorage")
os.makedirs(config_dir, exist_ok=True)
config_file = os.path.join(config_dir, "mcp_config.json")

# Definición de servidores MCP esenciales
mcp_servers = {
    "mcpServers": {
        "github": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {
                "GITHUB_PERSONAL_ACCESS_TOKEN": "TU_GITHUB_TOKEN_AQUI"
            }
        },
        "postgres-supabase": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://postgres:password@db.supabase.co:5432/postgres"]
        },
        "sequential-thinking": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
        },
        "chrome-devtools": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-chrome-devtools"]
        },
        "perplexity": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-perplexity"],
            "env": {
                "PERPLEXITY_API_KEY": "TU_PERPLEXITY_KEY_AQUI"
            }
        },
        "filesystem": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", "H:\\EAR_OS_V2\\EAR_OS_V2"]
        }
    }
}

# Fusionar o escribir la configuración JSON
if os.path.exists(config_file):
    try:
        with open(config_file, "r", encoding="utf-8") as f:
            existing_data = json.load(f)
        if "mcpServers" not in existing_data:
            existing_data["mcpServers"] = {}
        existing_data["mcpServers"].update(mcp_servers["mcpServers"])
        final_config = existing_data
    except Exception:
        final_config = mcp_servers
else:
    final_config = mcp_servers

with open(config_file, "w", encoding="utf-8") as f:
    json.dump(final_config, f, ensure_ascii=False, indent=2)

print(f"✅ Configuración inyectada en: {config_file}")
print("💡 Reinicia Antigravity para que los nuevos MCPs sean cargados automáticamente.")
