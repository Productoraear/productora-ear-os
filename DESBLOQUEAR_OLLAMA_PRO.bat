@echo off
color 0A
echo =======================================================
echo    ANTIGRAVITY S-CLASS: OLLAMA PRO UNLOCKER
echo =======================================================
echo.
echo 1. Fijando OLLAMA_KEEP_ALIVE a -1 (El modelo nunca se descarga de la memoria)
setx OLLAMA_KEEP_ALIVE "-1" /M

echo 2. Reiniciando el servicio de Ollama para aplicar los cambios...
taskkill /f /im ollama.exe /t >nul 2>&1
taskkill /f /im "ollama app.exe" /t >nul 2>&1
timeout /t 2 /nobreak >nul
start "" "%LOCALAPPDATA%\Programs\Ollama\ollama app.exe"
timeout /t 3 /nobreak >nul

echo 3. Precargando qwen-sclass (Esto evitara futuros timeouts de Cline)...
ollama run qwen-sclass "Model loaded successfully. Ready for S-Class operations."

echo.
echo =======================================================
echo    ¡ENTORNO OPTIMIZADO! YA PUEDES USAR CLINE
echo =======================================================
pause
