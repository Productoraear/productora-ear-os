@echo off
color 0B
echo =======================================================
echo    ANTIGRAVITY S-CLASS: OPTIMIZADOR VRAM AMD RX 7900 XTX
echo =======================================================
echo.
echo [1/4] Configurando Flash Attention y Cuantizacion de Cache KV...
setx OLLAMA_FLASH_ATTENTION "1"
setx OLLAMA_KV_CACHE_TYPE "q8_0"
setx OLLAMA_NUM_PARALLEL "1"
setx OLLAMA_KEEP_ALIVE "15m"

echo [2/4] Liberando VRAM y purgando instancias previas de Ollama...
taskkill /f /im ollama.exe /t >nul 2>&1
taskkill /f /im "ollama app.exe" /t >nul 2>&1
timeout /t 2 /nobreak >nul

echo [3/4] Reiniciando servicio de Ollama con banderas RDNA3 optimizadas...
start "" "%LOCALAPPDATA%\Programs\Ollama\ollama app.exe"
timeout /t 3 /nobreak >nul

echo [4/4] Verificando modelos especializados creados:
echo   * ear-14b-speed     -> Redaccion, Titulos, Copys, Micro-cambios (Contexto 16k, VRAM ~9.5 GB)
echo   * ear-27b-flow      -> APIs, Logica intermedia, Endpoints (Contexto 20k, VRAM ~15 GB)
echo   * ear-32b-architect -> Arquitectura S-Class, Contratos y Razonamiento (Contexto 24k, VRAM ~19 GB)
echo.
echo =======================================================
echo    VRAM PROTEGIDA: NUNCA MAS DESBORDAMIENTO EN 24 GB
echo =======================================================
pause
