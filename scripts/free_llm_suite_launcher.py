import os
import sys

# Ensure UTF-8 stdout
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='ignore')

import subprocess
import time
from pathlib import Path

print("═════════════════════════════════════════════════════════════════")
print("  🤖 EAR OS FREE LLM ORCHESTRATOR & RESOURCE SUITE (S-CLASS)")
print("═════════════════════════════════════════════════════════════════")

FCC_DIR = Path('tools/free-claude-code')

def check_environment():
    print("[1] Verificando entorno de Free Claude Code y proveedores...")
    env_file = FCC_DIR / '.env'
    if env_file.exists():
        print(f"  ✅ Archivo .env detectado en {env_file}")
    else:
        print(f"  ⚠️ Creando .env desde .env.example...")
        example = FCC_DIR / '.env.example'
        if example.exists():
            env_file.write_text(example.read_text(encoding='utf-8'), encoding='utf-8')

def print_free_resources_catalog():
    print("\n[2] CATÁLOGO DE RECURSOS LLM GRATUITOS DISPONIBLES:")
    print("  ─────────────────────────────────────────────────────────────")
    print("  1. FREE CLAUDE CODE PROXY (tools/free-claude-code)")
    print("     • Escucha en: http://localhost:8000/v1")
    print("     • Compatible con: Claude Code CLI, Cursor, Cline, VSCode, OpenAI SDK")
    print("     • Modelos: OpenRouter Free, NVIDIA NIM (40 req/min), DeepSeek, LM Studio")
    print("  ─────────────────────────────────────────────────────────────")
    print("  2. LOCAL AMD RX 7900 XTX 24GB VRAM (0 Tokens / 100% Privado)")
    print("     • LM Studio (http://localhost:1234/v1)")
    print("     • Modelos recomendados: DeepSeek-R1-Distill-Qwen-32B, Qwen 2.5 Coder 32B")
    print("  ─────────────────────────────────────────────────────────────")
    print("  3. CLOUD FREE TIERS DE ALTA VELOCIDAD:")
    print("     • Google AI Studio: Gemini 2.0 Flash (1M tokens context, 15 RPM free)")
    print("     • Groq: Llama 3.3 70B a 500 tokens/s (30 RPM, 14.4k req/día free)")
    print("     • NVIDIA NIM: 40 requests/minuto gratis en build.nvidia.com")
    print("  ─────────────────────────────────────────────────────────────")

def start_free_claude_proxy():
    print("\n[3] Iniciando servidor Free Claude Code Proxy en puerto 8000...")
    cmd = [sys.executable, "server.py"]
    try:
        proc = subprocess.Popen(
            cmd,
            cwd=str(FCC_DIR.resolve()),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding='utf-8',
            errors='ignore'
        )
        print(f"  ✅ Servidor proxy iniciado con PID: {proc.pid}")
        print("  📍 Endpoint Anthropic / OpenAI: http://localhost:8000/v1")
        print("\nPara usar Claude Code CLI con este proxy gratis, ejecuta en tu terminal:")
        print('  $env:ANTHROPIC_BASE_URL="http://localhost:8000"')
        print('  $env:ANTHROPIC_API_KEY="dummy-key"')
        print('  claude\n')
        return proc
    except Exception as e:
        print(f"  ❌ Error al iniciar servidor: {e}")
        return None

if __name__ == '__main__':
    check_environment()
    print_free_resources_catalog()
    print("═════════════════════════════════════════════════════════════════")
    print("  💡 Guía detallada generada en: docs/free_llm_resources/GUIA_MAESTRA_RECURSOS_LLM_GRATIS.md")
    print("═════════════════════════════════════════════════════════════════")
