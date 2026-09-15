@echo off
color 0B
echo =======================================================
echo    ANTIGRAVITY S-CLASS: OLLAMA PRO VRAM SHIELD
echo =======================================================
echo.
echo [1/3] Configurando variables de entorno ROCm / RDNA3...
setx OLLAMA_FLASH_ATTENTION "1"
setx OLLAMA_KV_CACHE_TYPE "q8_0"
setx OLLAMA_NUM_PARALLEL "1"
setx OLLAMA_KEEP_ALIVE "15m"

echo [2/3] Reiniciando Ollama...
taskkill /f /im ollama.exe /t >nul 2>&1
taskkill /f /im "ollama app.exe" /t >nul 2>&1
timeout /t 2 /nobreak >nul
start "" "%LOCALAPPDATA%\Programs\Ollama\ollama app.exe"
timeout /t 3 /nobreak >nul

echo [3/3] Listo. Selecciona en Cline el modelo segun tu tarea:
echo   - ear-14b-speed     (Titulos, textos, copys, micro-ediciones - Contexto 16k)
echo   - ear-27b-flow      (APIs, rutas Next.js, endpoints - Contexto 20k)
echo   - ear-32b-architect (Arquitectura, Typescript estricto - Contexto 24k)
echo.
pause
